import axios from 'axios';
import { normalizeError } from './apiUtils';
import toast from 'react-hot-toast';
import MetricsService from './metricsApi';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:5000/api`,
  withCredentials: true,
  timeout: 15000, // Reduced timeout to 15s (Gap 1)
  xsrfCookieName: 'csrfToken',
  xsrfHeaderName: 'X-CSRF-Token',
});

let getToken = async () => localStorage.getItem('token');

export const setTokenGetter = (fn) => {
  getToken = fn;
};

const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
};

const pendingRequests = new Map();

api.interceptors.request.use(
  async (config) => {
    // Skip token fetch if explicitly requested
    if (config.headers?.['x-skip-token']) {
      delete config.headers['x-skip-token'];
      return config;
    }

    try {
      const token = await getToken();
      if (
        token &&
        typeof token === 'string' &&
        token !== 'null' &&
        token !== 'undefined'
      ) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('[API] Failed to retrieve authentication token:', err);
    }

    const mutatingMethods = ['post', 'put', 'patch', 'delete'];
    const isMutating = mutatingMethods.includes(config.method?.toLowerCase());

    let dataHash = '';
    if (config.data) {
      if (config.data instanceof FormData) {
        const parts = [];
        for (const [key, value] of config.data.entries()) {
          if (value instanceof File) {
            parts.push(`${key}:${value.name}:${value.size}`);
          } else {
            parts.push(`${key}:${String(value).substring(0, 100)}`);
          }
        }
        dataHash = `form-data:${parts.join(',')}`;
      } else {
        const str = JSON.stringify(config.data) || '';
        dataHash = str.length < 1000 ? str : `large:${simpleHash(str)}`;
      }
    }
    const requestKey = `${config.method}:${config.url}:${dataHash}`;

    if (isMutating && pendingRequests.has(requestKey)) {
      const controller = new AbortController();
      config.signal = controller.signal;
      controller.abort('duplicate_request');
      return config;
    }

    if (isMutating) {
      pendingRequests.set(requestKey, true);
      config._requestKey = requestKey;
    }

    const idempotencyMethods = ['post', 'put', 'patch'];
    if (
      idempotencyMethods.includes(config.method?.toLowerCase()) &&
      !config.headers['X-Idempotency-Key']
    ) {
      config.headers['X-Idempotency-Key'] = crypto.randomUUID();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const getSuccessMessage = (method, url) => {
  const m = method?.toLowerCase();
  if (url.includes('/auth/reset-password') && m === 'post')
    return 'PASSWORD_RESET_SUCCESSFUL';
  if (url.includes('/auth/register') && m === 'post')
    return 'WORKSPACE_INITIALIZED_SUCCESSFULLY';
  if (url.includes('/projects') && m === 'post')
    return 'PROJECT_INITIALIZED_SUCCESSFULLY';
  if (url.includes('/projects') && m === 'patch')
    return 'PROJECT_STATE_SYNCHRONIZED';
  if (url.includes('/team/invite') && m === 'post')
    return 'INVITATIONS_SENT_SUCCESSFULLY';
  if (url.includes('/team/revoke') && m === 'post')
    return 'INVITATION_REVOKED_SUCCESSFULLY';
  if (url.includes('/tasks') && url.includes('/status') && m === 'patch')
    return 'STATUS_SYNCHRONIZED';
  if (url.includes('/tasks') && url.includes('/blockage') && m === 'patch')
    return 'TASK_STATE_UPDATED';
  if (url.includes('/tasks') && m === 'put') return 'TASK_METRICS_UPDATED';
  if (url.includes('/tasks') && m === 'post')
    return 'TASK_ORCHESTRATED_SUCCESSFULLY';
  return 'ACTION_COMPLETED';
};

api.interceptors.response.use(
  (response) => {
    if (response.config._requestKey) {
      pendingRequests.delete(response.config._requestKey);
    }

    const isMutating = ['post', 'put', 'patch', 'delete'].includes(
      response.config.method?.toLowerCase()
    );
    const url = response.config.url || '';

    if (
      isMutating &&
      !url.includes('/metrics') &&
      !url.includes('/auth/login')
    ) {
      const defaultMsg = getSuccessMessage(response.config.method, url);
      toast.success(response.data?.message || defaultMsg);

      setTimeout(() => {
        if (url.includes('/auth/register'))
          MetricsService.trackEvent('signup_success');
        if (
          url.includes('/projects') &&
          response.config.method?.toLowerCase() === 'post'
        )
          MetricsService.trackEvent('project_created');
        if (
          url.includes('/tasks') &&
          response.config.method?.toLowerCase() === 'post'
        )
          MetricsService.trackEvent('task_created');
      }, 0);
    }

    return response;
  },
  async (error) => {
    if (error.config?._requestKey) {
      pendingRequests.delete(error.config._requestKey);
    }

    if (error.message === 'duplicate_request') return Promise.reject(error);

    const originalRequest = error.config;
    const normalizedError = normalizeError(error);
    const useClerk = import.meta.env.VITE_USE_CLERK_AUTH === 'true';

    // 1. Strict 401 Handling
    if (normalizedError.status === 401) {
      const isAuthRequest =
        originalRequest?.url?.includes('/auth/login') ||
        originalRequest?.url?.includes('/auth/register') ||
        originalRequest?.url?.includes('/auth/me');

      // If using Clerk, 401 means backend session is invalid/stale relative to Clerk token
      // We exclude non-critical telemetry endpoints from triggering global logout
      if (useClerk && !originalRequest?.url?.includes('/metrics')) {
        console.warn(
          '[API] Clerk-backed session unauthorized by backend. Dispatching logout.'
        );
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(normalizedError);
      }

      if (isAuthRequest || originalRequest._retry) {
        console.warn(
          '[API] Auth failure on sensitive endpoint. Forcing logout.'
        );
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(normalizedError);
      }

      // 2. Token Refresh Flow (Native JWT only)
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('[API] Session expired. Attempting refresh...');
        const res = await api.get('/auth/refresh');
        const { token } = res.data;

        if (token) {
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          processQueue(null, token);
          return api(originalRequest);
        }
        throw new Error('REFRESH_FAILED');
      } catch (refreshError) {
        processQueue(refreshError);
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(normalizeError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    // 3. Network Retry Logic (Only for 5xx / Timeouts)
    const maxRetries = 1;
    const currentRetry = originalRequest?._retryCount || 0;
    const isNetworkError = !error.response && error.code !== 'ERR_CANCELED';
    const is5xxError = normalizedError.status >= 500;
    const isTimeout =
      error.code === 'ECONNABORTED' ||
      error.message?.toLowerCase().includes('timeout');

    if (
      (isNetworkError || is5xxError || isTimeout) &&
      currentRetry < maxRetries &&
      originalRequest.method?.toLowerCase() === 'get'
    ) {
      originalRequest._retryCount = currentRetry + 1;
      const backoffDelay = Math.pow(2, originalRequest._retryCount) * 1000;
      console.log(
        `[API] Retrying request (${currentRetry + 1}/${maxRetries}) in ${backoffDelay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return api(originalRequest);
    }

    // 4. Mutation Error Toasting
    const isMutating = ['post', 'put', 'patch', 'delete'].includes(
      originalRequest?.method?.toLowerCase()
    );
    if (isMutating && !originalRequest?.url?.includes('/metrics')) {
      toast.error(normalizedError.message || 'Mission protocol failure');
    }

    return Promise.reject(normalizedError);
  }
);

export default api;

import axios from 'axios';
import { normalizeError } from './apiUtils';
import toast from 'react-hot-toast';
import MetricsService from './metricsService';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:5000/api`,
  withCredentials: true,
  timeout: 15000, // Reduced timeout to 15s (Gap 1)
});

const pendingRequests = new Map();

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const mutatingMethods = ['post', 'put', 'patch', 'delete'];
    const isMutating = mutatingMethods.includes(config.method?.toLowerCase());
    
    const dataHash = config.data ? (JSON.stringify(config.data).length < 1000 ? JSON.stringify(config.data) : 'large-payload') : '';
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
    if (idempotencyMethods.includes(config.method?.toLowerCase()) && !config.headers['X-Idempotency-Key']) {
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
  if (url.includes('/auth/reset-password') && m === 'post') return 'PASSWORD_RESET_SUCCESSFUL';
  if (url.includes('/auth/register') && m === 'post') return 'WORKSPACE_INITIALIZED_SUCCESSFULLY';
  if (url.includes('/projects') && m === 'post') return 'PROJECT_INITIALIZED_SUCCESSFULLY';
  if (url.includes('/team/invite') && m === 'post') return 'INVITATIONS_SENT_SUCCESSFULLY';
  if (url.includes('/team/revoke') && m === 'post') return 'INVITATION_REVOKED_SUCCESSFULLY';
  if (url.includes('/tasks') && url.includes('/status') && m === 'patch') return 'STATUS_SYNCHRONIZED';
  if (url.includes('/tasks') && url.includes('/blockage') && m === 'patch') return 'TASK_STATE_UPDATED';
  if (url.includes('/tasks') && m === 'put') return 'TASK_METRICS_UPDATED';
  if (url.includes('/tasks') && m === 'post') return 'TASK_ORCHESTRATED_SUCCESSFULLY';
  return 'OPERATION_SUCCESSFUL';
};

api.interceptors.response.use(
  (response) => {
    if (response.config._requestKey) {
      pendingRequests.delete(response.config._requestKey);
    }

    // Gap 3 & 4: Global Success Toast & Metrics Tracking
    const isMutating = ['post', 'put', 'patch', 'delete'].includes(response.config.method?.toLowerCase());
    const url = response.config.url || '';
    
    if (isMutating && !url.includes('/metrics')) {
      const defaultMsg = getSuccessMessage(response.config.method, url);
      toast.success(response.data?.message || defaultMsg);

      // Gap 4: Trigger metrics after success (non-blocking)
      setTimeout(() => {
        if (url.includes('/auth/login')) MetricsService.trackEvent('login_success');
        if (url.includes('/auth/register')) MetricsService.trackEvent('signup_success');
        if (url.includes('/projects') && response.config.method?.toLowerCase() === 'post') MetricsService.trackEvent('project_created');
        if (url.includes('/tasks') && response.config.method?.toLowerCase() === 'post') MetricsService.trackEvent('task_created');
        if (url.includes('/team/invite') || url.includes('/invitations')) MetricsService.trackEvent('invite_sent');
      }, 0);
    }
    
    return response;
  },
  async (error) => {
    if (error.config?._requestKey) {
      pendingRequests.delete(error.config._requestKey);
    }
    
    if (error.message === 'duplicate_request') {
      return new Promise(() => {});
    }

    const originalRequest = error.config;
    const normalizedError = normalizeError(error);

    // Gap 3: Global Error Toast for mutations
    const isMutating = ['post', 'put', 'patch', 'delete'].includes(originalRequest?.method?.toLowerCase());
    if (isMutating && !originalRequest?.url?.includes('/metrics')) {
      // Prioritize backend normalized message, otherwise fallback
      toast.error(normalizedError.message || 'OPERATION_FAILED');
    }

    const isAuthRequest = originalRequest?.url?.includes('/auth/login') || 
                         originalRequest?.url?.includes('/auth/register') ||
                         originalRequest?.url?.includes('/auth/refresh');

    // Gap 2: Token Refresh Flow
    if (normalizedError.status === 401 && !isAuthRequest && !originalRequest._retry) {
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
        const res = await api.get('/auth/refresh');
        const { token } = res.data;
        
        if (token) {
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
        }

        isRefreshing = false;
        processQueue(null, token);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(normalizeError(refreshError));
      }
    }

    // Gap 1 & 5: Network Retry & Timeout Handling
    const maxRetries = 2; // Gap 1: Max 2 retries
    const currentRetry = originalRequest?._retryCount || 0;

    const isNetworkError = !error.response && error.code !== 'ERR_CANCELED' && error.message !== 'duplicate_request';
    const is5xxError = normalizedError.status >= 500 && normalizedError.status < 600;
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout');

    if ((isNetworkError || is5xxError || isTimeout) && currentRetry < maxRetries) {
      originalRequest._retryCount = currentRetry + 1;
      
      if (isTimeout && currentRetry === 1) {
        // Gap 5: Timeout Fallback Message (inform user we are retrying)
        toast.loading('Request taking longer than expected. Retrying...', { duration: 3000 });
      }

      const backoffDelay = Math.pow(2, originalRequest._retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      return api(originalRequest);
    }

    if (normalizedError.status === 401 && (isAuthRequest || originalRequest?._retry)) {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    return Promise.reject(normalizedError);
  }
);

export default api;

import axios from 'axios';
import { normalizeError } from './apiUtils';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    `${window.location.protocol}//${window.location.hostname}:5000/api`,
  withCredentials: true,
  timeout: 60000, // Accounts for Render free tier cold starts (~30-60s)
});

const pendingRequests = new Map();

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Request Locking: Prevent redundant concurrent requests for mutating operations
    const mutatingMethods = ['post', 'put', 'patch', 'delete'];
    const isMutating = mutatingMethods.includes(config.method?.toLowerCase());
    
    const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.data)}`;
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

    // Idempotency: Ensures unique processing of mutating requests on unstable networks
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

api.interceptors.response.use(
  (response) => {
    if (response.config._requestKey) {
      pendingRequests.delete(response.config._requestKey);
    }

    // Defensive UI: Normalize nulls to undefined
    if (response.data && typeof response.data === 'object') {
      const normalize = (obj) => {
        for (const key in obj) {
          if (obj[key] === null) obj[key] = undefined;
          if (Array.isArray(obj[key])) obj[key].forEach(normalize);
          else if (typeof obj[key] === 'object') normalize(obj[key]);
        }
      };
      normalize(response.data);
    }

    return response;
  },
  async (error) => {
    if (error.config?._requestKey) {
      pendingRequests.delete(error.config._requestKey);
    }
    
    if (error.message === 'duplicate_request') {
      return new Promise(() => {}); // Suppress canceled duplicate logs
    }

    const originalRequest = error.config;
    const normalizedError = normalizeError(error);

    // Automatic Session Recovery: Broadened 401 handling for seamless token rotation
    const isAuthRequest = originalRequest.url?.includes('/auth/login') || 
                         originalRequest.url?.includes('/auth/register') ||
                         originalRequest.url?.includes('/auth/refresh');

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
        
        // Signal UI to show a clean "Session Expired" notification instead of a harsh redirect
        window.dispatchEvent(new CustomEvent('auth:session-expired', { 
          detail: 'Your security session has expired. Please sign in again to continue.' 
        }));
        
        return Promise.reject(normalizeError(refreshError));
      }
    }

    // Network Resilience: Automated retry with exponential backoff for transient failures
    const isNetworkError = !error.response && error.code !== 'ERR_CANCELED';
    const isRetryableStatus = [503, 504].includes(normalizedError.status);
    const maxRetries = 3;
    
    if ((isNetworkError || isRetryableStatus) && !originalRequest._retryCount) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      if (originalRequest._retryCount <= maxRetries) {
        const backoffDelay = Math.pow(2, originalRequest._retryCount) * 1000;
        console.warn(`[API] Retrying transient error in ${backoffDelay}ms... (Attempt ${originalRequest._retryCount})`);
        
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return api(originalRequest);
      }
    }

    // Forced Logout: Handle unrecoverable 401s (e.g. after refresh fails)
    if (normalizedError.status === 401 && (isAuthRequest || originalRequest._retry)) {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    if (normalizedError.status === 403) {
      console.warn('[API] Access forbidden: Insufficient privileges.');
    }

    // State Conflict: Signal UI when data version mismatch is detected (Optimistic Locking)
    if (normalizedError.status === 409) {
      window.dispatchEvent(
        new CustomEvent('app:state-conflict', { 
          detail: normalizedError.message || 'Concurrent modification detected. Please refresh.' 
        })
      );
    }

    if (normalizedError.isDisconnected) {
      window.dispatchEvent(
        new CustomEvent('app:server-down', { detail: normalizedError.message })
      );
    }

    return Promise.reject(normalizedError);
  }
);

export default api;

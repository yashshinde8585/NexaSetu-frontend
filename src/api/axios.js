import axios from 'axios';
import { normalizeError } from './apiUtils';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    `http://${window.location.hostname}:5000/api`,
  withCredentials: true,
  timeout: 10000, // 10s timeout
});

// Request interceptor: logging and common headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: normalization and automated error handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const normalizedError = normalizeError(error);

    // 🔄 Automated Silent Refresh Architecture
    if (normalizedError.status === 401 && normalizedError.message === 'token_expired' && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to rotate access token using HttpOnly refresh cookie
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

    // Standard 401 logout (Invalid token or Session expired)
    // Only logout if it's a 401 AND it was already a retry (meaning refresh failed)
    if (normalizedError.status === 401 && originalRequest._retry) {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    // Handle 403 (Forbidden) - Do NOT logout, just reject
    if (normalizedError.status === 403) {
      console.warn('[API] Access forbidden. Performer lacks required privileges.');
    }

    // Global Server Down Notification
    if (normalizedError.isDisconnected) {
      window.dispatchEvent(
        new CustomEvent('app:server-down', { detail: normalizedError.message })
      );
    }

    return Promise.reject(normalizedError);
  }
);

export default api;

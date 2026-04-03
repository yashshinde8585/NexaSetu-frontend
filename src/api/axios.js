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
    // console.log(`[API REQUEST] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: normalization and automated error handling
api.interceptors.response.use(
  (response) => {
    // console.log(`[API RESPONSE] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const normalizedError = normalizeError(error);

    // Log failures persistently for debugging
    console.error(
      `[API ERROR] ${normalizedError.status} ${error.config?.url}:`,
      normalizedError.message
    );

    // Automated Session Management
    if (normalizedError.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:logout'));
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

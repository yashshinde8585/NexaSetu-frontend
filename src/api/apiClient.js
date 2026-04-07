import api from './axios';

/**
 * Thin wrapper around the configured axios instance that automatically
 * unwraps `response.data`, eliminating the repeated two-line pattern:
 *   const response = await api.verb(url);
 *   return response.data;
 *
 * All callers receive the same payload shape — nothing downstream changes.
 */
const apiClient = {
  get:    (url, config)       => api.get(url, config).then((r) => r.data),
  post:   (url, data, config) => api.post(url, data, config).then((r) => r.data),
  put:    (url, data, config) => api.put(url, data, config).then((r) => r.data),
  patch:  (url, data, config) => api.patch(url, data, config).then((r) => r.data),
  delete: (url, config)       => api.delete(url, config).then((r) => r.data),
};

export default apiClient;

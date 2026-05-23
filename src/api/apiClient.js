import api from './axios';

const apiClient = {
  get: (url, config) => api.get(url, config).then((r) => r.data),
  post: (url, data, config) => api.post(url, data, config).then((r) => r.data),
  put: (url, data, config) => api.put(url, data, config).then((r) => r.data),
  patch: (url, data, config) =>
    api.patch(url, data, config).then((r) => r.data),
  delete: (url, config) => api.delete(url, config).then((r) => r.data),
};

export default apiClient;

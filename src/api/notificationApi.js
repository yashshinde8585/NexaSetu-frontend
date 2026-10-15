import apiClient from './apiClient';

export const getMyNotifications = (config = {}) => {
  return apiClient.get('/notifications/my-notifications', config);
};

export const markAsRead = (id, config = {}) => {
  return apiClient.patch(`/notifications/mark-read/${id}`, null, config);
};

export const markAllAsRead = (config = {}) => {
  return apiClient.patch('/notifications/mark-all-read', null, config);
};

export const clearAll = (config = {}) => {
  return apiClient.delete('/notifications/clear-all', config);
};

export default {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  clearAll,
};

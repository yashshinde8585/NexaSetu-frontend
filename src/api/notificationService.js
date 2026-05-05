import apiClient from './apiClient';

export const getMyNotifications = () => {
  return apiClient.get('/notifications/my-notifications');
};

export const markAsRead = (id) => {
  return apiClient.patch(`/notifications/mark-read/${id}`);
};

export const markAllAsRead = () => {
  return apiClient.patch('/notifications/mark-all-read');
};

export const clearAll = () => {
  return apiClient.delete('/notifications/clear-all');
};

export default {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  clearAll,
};


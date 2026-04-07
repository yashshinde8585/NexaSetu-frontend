import apiClient from './apiClient';

// Handles interactions with the notification subsystem.
class NotificationService {
  getMyNotifications() {
    return apiClient.get('/notifications/my-notifications');
  }

  markAsRead(id) {
    return apiClient.patch(`/notifications/mark-read/${id}`);
  }

  markAllAsRead() {
    return apiClient.patch('/notifications/mark-all-read');
  }

  clearAll() {
    return apiClient.delete('/notifications/clear-all');
  }
}

export default new NotificationService();

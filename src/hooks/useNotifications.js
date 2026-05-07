import { useState, useEffect, useCallback } from 'react';
import NotificationService from '../api/notificationService';
import socketService from '../services/socketService';

/**
 * Shared async error wrapper — runs fn(), returns true on success or false on
 * failure. Eliminates the identical try/catch/console.error/return pattern that
 * was duplicated across markAsRead, markAllAsRead, and clearAll.
 */
const attempt = async (fn, label) => {
  try {
    return await fn();
  } catch (err) {
    console.error(label, err);
    return false;
  }
};

// Custom hook to manage user notifications with polling and management logic.
const useNotifications = (pollInterval = 10000) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await NotificationService.getMyNotifications();
      const list = res.data?.notifications || [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, pollInterval);
    
    // Real-time Push Integration (Connection managed by AuthProvider)
    
    const handleNewNotification = (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socketService.onEvent('NOTIFICATION_RECEIVED', handleNewNotification);

    return () => {
      clearInterval(interval);
      socketService.offEvent('NOTIFICATION_RECEIVED');
    };
  }, [fetchNotifications, pollInterval]);

  const markAsRead = (id) =>
    attempt(async () => {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return true;
    }, 'Failed to mark notification as read:');

  const markAllAsRead = () =>
    attempt(async () => {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      return true;
    }, 'Failed to mark all as read:');

  const clearAll = () =>
    attempt(async () => {
      await NotificationService.clearAll();
      setNotifications([]);
      setUnreadCount(0);
      return true;
    }, 'Failed to clear notifications:');

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    refresh: fetchNotifications,
  };
};

export default useNotifications;

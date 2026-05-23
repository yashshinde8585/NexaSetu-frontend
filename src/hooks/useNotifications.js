import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NotificationService from '../api/notificationApi';
import socketService from '../services/socketService';

const attempt = async (fn, label) => {
  try {
    return await fn();
  } catch (err) {
    console.error(label, err);
    return false;
  }
};

// Custom hook to manage user notifications with coordinated polling and management logic.
const useNotifications = (pollInterval = 60000) => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading: loading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      NotificationService.getMyNotifications().then(
        (res) => res.data?.notifications || []
      ),
    refetchInterval: pollInterval,
    staleTime: 30000, // 30 s \u2014 socket push handles instant delivery
    gcTime: 5 * 60 * 1000, // 5 min cache between polls
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    // Real-time Push Integration
    const handleNewNotification = (notif) => {
      queryClient.setQueryData(['notifications'], (old = []) => [
        notif,
        ...old,
      ]);
    };

    socketService.onEvent('NOTIFICATION_RECEIVED', handleNewNotification);
    return () => socketService.offEvent('NOTIFICATION_RECEIVED');
  }, [queryClient]);

  const markAsRead = (id) =>
    attempt(async () => {
      await NotificationService.markAsRead(id);
      queryClient.setQueryData(['notifications'], (prev = []) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      return true;
    }, 'Failed to mark notification as read:');

  const markAllAsRead = () =>
    attempt(async () => {
      await NotificationService.markAllAsRead();
      queryClient.setQueryData(['notifications'], (prev = []) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      return true;
    }, 'Failed to mark all as read:');

  const clearAll = () =>
    attempt(async () => {
      await NotificationService.clearAll();
      queryClient.setQueryData(['notifications'], []);
      return true;
    }, 'Failed to clear notifications:');

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    refresh: () =>
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  };
};

export default useNotifications;

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TaskService from '../api/taskApi';
import { TASK_STATUS } from '../constants';

import { useAuth } from '../context/AuthContext';

// Manages personal and global workspace task retrieval, filtering, and status tracking.
export const useTasks = (
  initialScope = 'personal',
  initialFilter = 'active',
  userId = null
) => {
  const { authReady, user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState(initialFilter);
  const [scope, setScope] = useState(initialScope);
  const [search, setSearch] = useState('');

  // Synchronized Data Fetching: Utilizes React Query's SWR strategy
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['my-tasks', scope, user?._id],
    queryFn: () =>
      TaskService.getMyTasks(scope).then((res) => res.data?.tasks || []),
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
    enabled: authReady && !!user,
  });

  // Atomic Status Update with Optimistic UI & Targeted Cache Invalidation
  const statusMutation = useMutation({
    mutationFn: ({ taskId, newStatus }) =>
      TaskService.updateTaskStatus(taskId, newStatus),

    // Step 1: Optimistic Update
    onMutate: async ({ taskId, newStatus }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['my-tasks', scope] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['my-tasks', scope]);

      // Optimistically update to the new value
      queryClient.setQueryData(['my-tasks', scope], (old) => {
        if (!old) return [];
        return old.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        );
      });

      // Return a context object with the snapshotted value
      return { previousTasks };
    },

    // Step 2: Rollback on Error
    onError: (err, variables, context) => {
      queryClient.setQueryData(['my-tasks', scope], context.previousTasks);
      console.error('Optimistic update failed, rolling back:', err);
    },

    // Step 3: Final Sync
    onSettled: () => {
      // Invalidate both scope variations to ensure consistency across dashboards
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      // Also invalidate dashboard stats since status changes impact progress metrics
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await statusMutation.mutateAsync({ taskId, newStatus });
      return true;
    } catch (err) {
      console.error('Status update failed:', err);
      return false;
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      let matchesFilter =
        filter === 'active'
          ? t.status !== TASK_STATUS.DONE
          : filter === 'all' || t.status === filter;

      if (filter === 'due') {
        matchesFilter =
          t.delayStatus?.toLowerCase() === 'delayed' &&
          t.status !== TASK_STATUS.DONE;
      }
      if (filter === 'completed') {
        matchesFilter = t.status === TASK_STATUS.DONE;
      }

      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.project?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesUser =
        !userId || t.assignedUser === userId || t.assignedUser?._id === userId;

      return matchesFilter && matchesSearch && matchesUser;
    });
  }, [tasks, filter, search, userId]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading: isLoading,
    error: error?.message || null,
    filter,
    setFilter,
    scope,
    setScope,
    search,
    setSearch,
    handleStatusChange,
    refreshTasks: refetch,
  };
};

export default useTasks;

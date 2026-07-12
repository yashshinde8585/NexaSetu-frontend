import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TaskService from '../api/taskApi';
import { TASK_STATUS } from '../constants';

import { useAuth } from '../context/AuthContext';

// Custom hook managing task querying, state filtration, search indexing, and status updates
// across personal or workspace dashboard scopes.
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

  // Mutates task status. Uses an optimistic update strategy for perceived instant execution,
  // falling back to previous state if the API request encounters errors.
  const statusMutation = useMutation({
    mutationFn: ({ taskId, newStatus }) =>
      TaskService.updateTaskStatus(taskId, newStatus),

    onMutate: async ({ taskId, newStatus }) => {
      // Cancel active background queries to prevent race conditions where out-of-order responses
      // might overwrite our optimistic UI state.
      await queryClient.cancelQueries({
        queryKey: ['my-tasks', scope, user?._id],
      });

      const previousTasks = queryClient.getQueryData([
        'my-tasks',
        scope,
        user?._id,
      ]);

      queryClient.setQueryData(['my-tasks', scope, user?._id], (old) => {
        if (!old) return [];
        return old.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        );
      });

      return { previousTasks };
    },

    onError: (err, variables, context) => {
      // Revert the local cache to the pre-mutation snapshot on request failure.
      queryClient.setQueryData(
        ['my-tasks', scope, user?._id],
        context.previousTasks
      );
      console.error('Optimistic update failed, rolling back:', err);
    },

    onSettled: () => {
      // Refresh all task list variations to ensure alignment with database values.
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      // Invalidate global dashboard stats to trigger progress indicator refreshes.
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

import { useState, useEffect, useMemo } from 'react';
import TaskService from '../api/taskService';
import { TASK_STATUS } from '../constants';

// Manages personal and global workspace task retrieval, filtering, and status tracking.
export const useTasks = (
  initialScope = 'personal',
  initialFilter = 'active'
) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(initialFilter);
  const [scope, setScope] = useState(initialScope);
  const [search, setSearch] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await TaskService.getMyTasks(scope);
      setTasks(res.data?.tasks || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [scope]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      await fetchTasks();
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
        t.project?.name.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    error,
    filter,
    setFilter,
    scope,
    setScope,
    search,
    setSearch,
    handleStatusChange,
    refreshTasks: fetchTasks,
  };
};

export default useTasks;

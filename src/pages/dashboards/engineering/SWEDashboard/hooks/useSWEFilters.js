import React, { useMemo, useCallback } from 'react';

export const useSWEFilters = (
  myTasks,
  inProgressTasks,
  inReviewTasks,
  doneTasks,
  selectedWorkspace,
  selectedSprintId,
  sprintId,
  searchQuery
) => {
  const filterTaskFn = useCallback(
    (task) => {
      // Project filter
      if (selectedWorkspace !== 'all' && task.projectId !== selectedWorkspace) {
        return false;
      }
      // Sprint filter
      if (selectedSprintId === 'active') {
        if (sprintId && task.sprintId !== sprintId) {
          return false;
        }
      } else {
        if (task.sprintId !== selectedSprintId) {
          return false;
        }
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          task.title?.toLowerCase().includes(q) ||
          task.taskKey?.toLowerCase().includes(q)
        );
      }
      return true;
    },
    [selectedWorkspace, selectedSprintId, sprintId, searchQuery]
  );

  const filteredMyTasks = useMemo(
    () => myTasks?.filter(filterTaskFn) || [],
    [myTasks, filterTaskFn]
  );
  const filteredInProgress = useMemo(
    () => inProgressTasks?.filter(filterTaskFn) || [],
    [inProgressTasks, filterTaskFn]
  );
  const filteredInReview = useMemo(
    () => inReviewTasks?.filter(filterTaskFn) || [],
    [inReviewTasks, filterTaskFn]
  );
  const filteredDone = useMemo(
    () => doneTasks?.filter(filterTaskFn) || [],
    [doneTasks, filterTaskFn]
  );

  return {
    filteredMyTasks,
    filteredInProgress,
    filteredInReview,
    filteredDone,
    filterTaskFn,
  };
};

export default useSWEFilters;

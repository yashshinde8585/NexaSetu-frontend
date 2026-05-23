import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProjectService from '../api/projectApi';
import DashboardService from '../api/dashboardApi';
import SprintService from '../api/sprintApi';
import MagicService from '../api/magicApi';
import ActionService from '../api/actionApi';
import TaskService from '../api/taskApi';
import { TASK_STATUS, USER_ROLES } from '../constants';

import { useAuth } from '../context/AuthContext';

// Manages dashboard data retrieval, project creation, and analytics state.
export const useDashboard = (initialSprintId = null) => {
  const { user, authReady } = useAuth();
  const queryClient = useQueryClient();
  const [newProjectName, setNewProjectName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [selectedSprintId, setSelectedSprintId] = useState(initialSprintId);

  // Sync internal state with external prop if provided
  useEffect(() => {
    if (initialSprintId && initialSprintId !== selectedSprintId) {
      setSelectedSprintId(initialSprintId);
    }
  }, [initialSprintId]);

  const statsQuery = useQuery({
    queryKey: ['dashboard-stats', selectedSprintId, user?.workspaceId],
    queryFn: () =>
      DashboardService.getDashboardStats({ sprintId: selectedSprintId }).then(
        (res) => res.data
      ),
    enabled: authReady && !!user?.workspaceId,
    staleTime: 2 * 60 * 1000, // 2 min — live metrics, moderate refresh
    gcTime: 10 * 60 * 1000,
  });

  const sprintsQuery = useQuery({
    queryKey: ['sprints', user?.workspaceId],
    queryFn: () =>
      SprintService.getSprints().then((res) => res.data?.sprints || []),
    enabled: authReady && !!user?.workspaceId,
    staleTime: 10 * 60 * 1000, // 10 min — sprints are created infrequently
    gcTime: 30 * 60 * 1000,
  });

  const sprints = sprintsQuery.data || [];

  useEffect(() => {
    if (selectedSprintId && sprints.length > 0) {
      const exists = sprints.some((s) => s._id === selectedSprintId);
      if (!exists) {
        setSelectedSprintId(null);
      }
    } else if (
      selectedSprintId &&
      sprints.length === 0 &&
      !sprintsQuery.isLoading
    ) {
      setSelectedSprintId(null);
    }
  }, [sprints, selectedSprintId, sprintsQuery.isLoading]);

  const sprintStatsQuery = useQuery({
    queryKey: ['sprint-stats', selectedSprintId],
    queryFn: () =>
      SprintService.getSprintStats(selectedSprintId).then((res) => res.data),
    enabled: authReady && !!selectedSprintId,
    staleTime: 5 * 60 * 1000, // 5 min — sprint analytics are per-sprint snapshots
    gcTime: 15 * 60 * 1000,
  });

  const actionsQuery = useQuery({
    queryKey: ['pending-actions', user?.workspaceId],
    queryFn: () =>
      ActionService.getPendingActions().then((res) => res.data?.actions || []),
    enabled: authReady && !!user,
    staleTime: 60 * 1000, // 1 min — pending approvals need to feel live
    gcTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (projectData) => {
      // Map frontend 'objective' to backend 'description'
      const { objective, sprintId, ...rest } = projectData;
      return ProjectService.createProject({
        ...rest,
        description: objective,
        sprint: sprintId,
      });
    },
    onSuccess: () => {
      setNewProjectName('');
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => ActionService.approveAction(id),
    onMutate: async (actionId) => {
      await queryClient.cancelQueries({ queryKey: ['pending-actions'] });
      const previousActions = queryClient.getQueryData(['pending-actions']);

      // Optimistically remove the action from the list
      queryClient.setQueryData(['pending-actions'], (old) =>
        old ? old.filter((a) => a._id !== actionId) : []
      );

      return { previousActions };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['pending-actions'], context.previousActions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const createSprintMutation = useMutation({
    mutationFn: (data) => SprintService.createSprint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => ActionService.rejectAction(id),
    onMutate: async (actionId) => {
      await queryClient.cancelQueries({ queryKey: ['pending-actions'] });
      const previousActions = queryClient.getQueryData(['pending-actions']);

      queryClient.setQueryData(['pending-actions'], (old) =>
        old ? old.filter((a) => a._id !== actionId) : []
      );

      return { previousActions };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['pending-actions'], context.previousActions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async ({ title, project, sprint }) => {
      const res = await TaskService.createTask({
        title,
        project,
        sprint,
        status: TASK_STATUS.TODO,
      });

      if (sprint) {
        await ProjectService.updateProject(project, { sprint });
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      if (selectedSprintId) {
        queryClient.invalidateQueries({
          queryKey: ['sprint-stats', selectedSprintId],
        });
      }
    },
  });

  const handleCreateProject = async (data) => {
    // If a simple string is passed, wrap it in an object for backward compatibility
    const projectData = typeof data === 'string' ? { name: data } : data;
    const name = projectData.name?.trim();

    // Verify sprint existence before passing it
    const activeSprintId =
      selectedSprintId && sprints.some((s) => s._id === selectedSprintId)
        ? selectedSprintId
        : null;

    if (name)
      return createMutation.mutateAsync({
        ...projectData,
        name,
        sprintId: activeSprintId,
      });
  };

  const visibleProjects = useMemo(() => {
    const rawProjects = statsQuery.data?.projects || [];
    const isGlobalViewer = [
      USER_ROLES.WORKSPACE_ADMIN,
      USER_ROLES.WORKSPACE_MANAGER,
      USER_ROLES.TECH_LEAD,
    ].includes(user?.role);

    if (isGlobalViewer) {
      return rawProjects;
    }

    return rawProjects.filter((p) =>
      p.members?.some((m) => (m._id || m).toString() === user?._id?.toString())
    );
  }, [statsQuery.data?.projects, user]);

  const handleOptimizePath = async (projectName) => {
    try {
      const res = await MagicService.executeMagicCommand(
        `Optimize path for ${projectName}`
      );
      if (res.actionTriggered) {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        alert(
          `AI Orchestration triggered for ${projectName}. Reassignments staged for approval.`
        );
      } else {
        alert(res.actions[0]?.message || 'No optimizations needed currently.');
      }
    } catch (err) {
      console.error('Optimization failed:', err);
    }
  };

  return {
    projects: visibleProjects,
    workload: statsQuery.data?.workload || [],
    sprints: sprintsQuery.data || [],
    selectedSprintId,
    setSelectedSprintId,
    sprintStats: sprintStatsQuery.data,
    sprintStatsLoading: sprintStatsQuery.isLoading,
    aiImpact: statsQuery.data?.aiImpact,
    summary: statsQuery.data?.summary || {
      [TASK_STATUS.TODO]: 0,
      [TASK_STATUS.IN_PROGRESS]: 0,
      [TASK_STATUS.IN_REVIEW]: 0,
      [TASK_STATUS.DONE]: 0,
      total: 0,
    },
    personal: statsQuery.data?.personal || {
      [TASK_STATUS.TODO]: 0,
      [TASK_STATUS.IN_PROGRESS]: 0,
      [TASK_STATUS.IN_REVIEW]: 0,
      [TASK_STATUS.DONE]: 0,
      active: 0,
      completed: 0,
      total: 0,
    },
    isLoading:
      statsQuery.isLoading || sprintsQuery.isLoading || actionsQuery.isLoading,
    error: statsQuery.error || sprintsQuery.error,
    createMutation,
    newProjectName,
    setNewProjectName,
    showForm,
    setShowForm,
    handleCreateProject,
    pendingActions: actionsQuery.data || [],
    approveAction: approveMutation.mutate,
    rejectAction: rejectMutation.mutate,
    linkProjectToSprint: (projectId) => {
      if (!selectedSprintId) return;
      ProjectService.updateProject(projectId, {
        sprint: selectedSprintId,
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({
          queryKey: ['sprint-stats', selectedSprintId],
        });
      });
    },
    createSprint: createSprintMutation.mutate,
    createSprintLoading: createSprintMutation.isPending,
    createTicket: createTaskMutation.mutate,
    createTicketLoading: createTaskMutation.isPending,
    getFinalSummary: async (id) => {
      const res = await SprintService.finalizeSprint(id);
      return res.data;
    },
    downloadSprintReport: async (id) => {
      const res = await SprintService.getSprintReport(id);
      return res.data;
    },
    actionsLoading: actionsQuery.isLoading,
  };
};

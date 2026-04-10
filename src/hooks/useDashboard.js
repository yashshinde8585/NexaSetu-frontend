import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProjectService from '../api/projectService';
import DashboardService from '../api/dashboardService';
import SprintService from '../api/sprintService';
import MagicService from '../api/magicService';
import ActionService from '../api/actionService';
import TaskService from '../api/taskService';
import { TASK_STATUS, USER_ROLES } from '../constants';

// Manages dashboard data retrieval, project creation, and analytics state.
export const useDashboard = (user, initialSprintId = null) => {
  const queryClient = useQueryClient();
  const [newProjectName, setNewProjectName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [selectedSprintId, setSelectedSprintId] = useState(initialSprintId);

  // Sync internal state with external prop if provided
  useMemo(() => {
    if (initialSprintId && initialSprintId !== selectedSprintId) {
      setSelectedSprintId(initialSprintId);
    }
  }, [initialSprintId]);

  const statsQuery = useQuery({
    queryKey: ['dashboard-stats', selectedSprintId],
    queryFn: () =>
      DashboardService.getDashboardStats({ sprintId: selectedSprintId }).then(
        (res) => res.data
      ),
  });

  const sprintsQuery = useQuery({
    queryKey: ['sprints'],
    queryFn: () =>
      SprintService.getSprints().then((res) => res.data?.sprints || []),
  });

  const sprintStatsQuery = useQuery({
    queryKey: ['sprint-stats', selectedSprintId],
    queryFn: () =>
      SprintService.getSprintStats(selectedSprintId).then((res) => res.data),
    enabled: !!selectedSprintId,
  });

  const actionsQuery = useQuery({
    queryKey: ['pending-actions'],
    queryFn: () =>
      ActionService.getPendingActions().then((res) => res.data?.actions || []),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: ({ name, sprintId }) =>
      ProjectService.createProject({ name, sprint: sprintId }),
    onSuccess: () => {
      setNewProjectName('');
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => ActionService.approveAction(id),
    onSuccess: () => {
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
    onSuccess: () => {
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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const name = newProjectName.trim();
    if (name) return createMutation.mutateAsync({ name, sprintId: selectedSprintId });
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
    recentActivity: statsQuery.data?.recentActivity,
    isLoading:
      statsQuery.isLoading || sprintsQuery.isLoading || actionsQuery.isLoading,
    error: statsQuery.error || sprintsQuery.error,
    createMutation,
    newProjectName,
    setNewProjectName,
    showForm,
    setShowForm,
    handleCreateProject,
    handleOptimizePath,
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
    createSprintLoading: createSprintMutation.isLoading,
    createTicket: createTaskMutation.mutate,
    createTicketLoading: createTaskMutation.isLoading,
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

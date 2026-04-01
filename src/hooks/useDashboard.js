import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject, updateProject } from '../api/projectService';
import { getDashboardStats } from '../api/dashboardService';
import { getSprints, getSprintStats, createSprint, finalizeSprint, getSprintReport } from '../api/sprintService';
import { executeMagicCommand } from '../api/magicService';
import { getPendingActions, approveAction, rejectAction } from '../api/actionService';
import { createTask } from '../api/taskService';

export const useDashboard = (user) => {
  const queryClient = useQueryClient();
  const [newProjectName, setNewProjectName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [selectedSprintId, setSelectedSprintId] = useState(null);

  // 1. Queries
  const statsQuery = useQuery({
    queryKey: ['dashboard-stats', selectedSprintId],
    queryFn: () => getDashboardStats({ sprintId: selectedSprintId }).then(res => res.data.data)
  });

  const sprintsQuery = useQuery({
    queryKey: ['sprints'],
    queryFn: () => getSprints().then(res => res.data.data.sprints || [])
  });

  const sprintStatsQuery = useQuery({
    queryKey: ['sprint-stats', selectedSprintId],
    queryFn: () => getSprintStats(selectedSprintId).then(res => res.data.data),
    enabled: !!selectedSprintId
  });

  const actionsQuery = useQuery({
    queryKey: ['pending-actions'],
    queryFn: () => getPendingActions().then(res => res.data.actions),
    enabled: !!user
  });

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: ({ name, sprintId }) => createProject({ name, sprint: sprintId }),
    onSuccess: () => {
      setNewProjectName('');
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });

  const approveMutation = useMutation({
    mutationFn: (id) => approveAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });

  const createSprintMutation = useMutation({
    mutationFn: (data) => createSprint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-actions'] });
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: async ({ title, project, sprint }) => {
      // 1. Create the task
      const res = await createTask({ title, project, sprint, status: 'todo' });

      // 2. Ensure project is synced to this sprint if it isn't already
      // This ensures the project appears in the Sprint Heatmap and its tasks are counted
      if (sprint) {
        await updateProject(project, { sprint });
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      if (selectedSprintId) {
        queryClient.invalidateQueries({ queryKey: ['sprint-stats', selectedSprintId] });
      }
    }
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    const name = newProjectName.trim();
    if (name) createMutation.mutate({ name, sprintId: selectedSprintId });
  };

  // 3. Derived Logic
  const visibleProjects = useMemo(() => {
    const rawProjects = statsQuery.data?.projects || [];
    const isGlobalViewer = user?.role === 'WORKSPACE_ADMIN' || user?.role === 'WORKSPACE_MANAGER' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

    // Global viewers see all workspace projects
    if (isGlobalViewer) {
      return rawProjects;
    }

    // Leads, Engineers, and Interns only see projects where they are members
    return rawProjects.filter(p =>
      p.members?.some(m => (m._id || m).toString() === user?._id?.toString())
    );
  }, [statsQuery.data?.projects, user]);

  const handleOptimizePath = async (projectName) => {
    try {
      const res = await executeMagicCommand(`Optimize path for ${projectName}`);
      if (res.data.actionTriggered) {
        // Refresh data to show staged actions in Portfolio/Approval panels
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        alert(`AI Orchestration triggered for ${projectName}. Reassignments staged for approval.`);
      } else {
        alert(res.data.actions[0]?.message || 'No optimizations needed currently.');
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
    summary: statsQuery.data?.summary || { todo: 0, in_progress: 0, in_review: 0, done: 0, total: 0 },
    personal: statsQuery.data?.personal || { todo: 0, in_progress: 0, in_review: 0, done: 0, active: 0, completed: 0, total: 0 },
    recentActivity: statsQuery.data?.recentActivity,
    isLoading: statsQuery.isLoading || sprintsQuery.isLoading || actionsQuery.isLoading,
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
      updateProject(projectId, { sprint: selectedSprintId }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        queryClient.invalidateQueries({ queryKey: ['sprint-stats', selectedSprintId] });
      });
    },
    createSprint: createSprintMutation.mutate,
    createSprintLoading: createSprintMutation.isLoading,
    createTicket: createTaskMutation.mutate,
    createTicketLoading: createTaskMutation.isLoading,
    getFinalSummary: async (id) => {
      const res = await (finalizeSprint)(id);
      return res.data.data;
    },
    downloadSprintReport: async (id) => {
      const res = await getSprintReport(id);
      return res.data.data;
    },
    actionsLoading: actionsQuery.isLoading
  };
};

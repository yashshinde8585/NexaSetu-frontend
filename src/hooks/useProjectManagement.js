import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import socketService from '../services/socketService';
import ProjectService from '../api/projectService';
import TaskService from '../api/taskService';
import SprintService from '../api/sprintService';
import AiService from '../api/aiService';
import GithubService from '../api/githubService';
import { TASK_STATUS, USER_ROLES } from '../constants';
import MetricsService from '../api/metricsService';

import { useAuth } from '../context/AuthContext';

// Manages state, mutations, and derived data for individual project environments.
export const useProjectManagement = (id) => {
  const { user, authReady } = useAuth();
  const queryClient = useQueryClient();

  // Real-time Synchronizer: Manages project room lifecycle and event-driven cache invalidation
  useEffect(() => {
    if (!id || id === 'null') return;

    // Join the tactical project frequency
    socketService.joinProject(id);

    // Synchronize local cache with remote changes
    const handleTaskUpdate = (payload) => {
      console.debug('[SOCKET] Task update received, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      queryClient.invalidateQueries({ queryKey: ['analytics', id] });
    };

    const handleAgentActivity = (activity) => {
      console.debug('[SOCKET] Agent activity detected:', activity.type);
      // Optional: Update activity log or show pulse animation
    };

    socketService.onEvent('task_updated', handleTaskUpdate);
    socketService.onEvent('AGENT_ACTIVITY', handleAgentActivity);

    // Teardown: Prevent zombie subscriptions and memory leaks
    return () => {
      socketService.leaveProject(id);
      socketService.offEvent('task_updated');
      socketService.offEvent('AGENT_ACTIVITY');
    };
  }, [id, queryClient]);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);
  const [showGithubPanel, setShowGithubPanel] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    sprint: '',
    priority: 'medium',
    type: 'task',
    estimatedDuration: 30,
    durationUnit: 'minutes',
    dueDate: '',
    startDate: '',
    attachments: [],
  });
  const [githubToken, setGithubToken] = useState('');
  const [githubSuggestions, setGithubSuggestions] = useState([]);
  const [githubConnected, setGithubConnected] = useState(false);

  const [selectedSprintId, setSelectedSprintId] = useState(null);

  const projectQuery = useQuery({
    queryKey: ['project', id],
    queryFn: () =>
      ProjectService.getProject(id).then((res) => res.data?.project),
    enabled: authReady && !!id && id !== 'null',
  });

  const tasksQuery = useQuery({
    queryKey: ['tasks', id, selectedSprintId],
    queryFn: () =>
      TaskService.getTasksByProject(id, selectedSprintId).then(
        (res) => res.data?.tasks
      ),
    enabled: authReady && !!id && id !== 'null',
  });

  const analyticsQuery = useQuery({
    queryKey: ['analytics', id, selectedSprintId],
    queryFn: () =>
      ProjectService.getProjectAnalytics(id, selectedSprintId).then(
        (res) => res.data?.analytics
      ),
    enabled: authReady && !!id && id !== 'null',
  });

  const sprintsQuery = useQuery({
    queryKey: ['sprints', user?.workspaceId],
    queryFn: () => SprintService.getSprints().then((res) => res.data?.sprints || []),
    enabled: authReady && !!user?.workspaceId,
  });

  const reposQuery = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => GithubService.getRepositories().then((res) => res.data?.repositories || []),
    enabled: authReady && githubConnected,
    retry: false,
    onError: () => setGithubConnected(false),
  });

  const directivesQuery = useQuery({
    queryKey: ['directives', id],
    queryFn: () => ProjectService.getActiveDirectives(id).then((res) => res.data?.directives || []),
    enabled: authReady && !!id,
  });

  const createTaskMutation = useMutation({
    mutationFn: (task) => {
      const currentSprintId =
        task.sprint ||
        selectedSprintId ||
        projectQuery.data?.sprint?._id ||
        projectQuery.data?.sprint;
      const payload = { ...task, project: id, sprint: currentSprintId };
      
      // Convert to minutes based on unit for estimatedDuration calculation, 
      // but keep the unit for persistence
      if (task.durationUnit === 'hours') {
        payload.estimatedDuration = (task.estimatedDuration || 0) * 60;
      } else if (task.durationUnit === 'days') {
        payload.estimatedDuration = (task.estimatedDuration || 0) * 1440; // 24 * 60
      }

      return TaskService.createTask(payload);
    },
    onMutate: async (newTaskData) => {
      // Optimized Path: Provide instant feedback for task creation
      const queryKey = ['tasks', id, selectedSprintId];
      await queryClient.cancelQueries({ queryKey });
      
      const previousTasks = queryClient.getQueryData(queryKey);
      
      const optimisticTask = {
        ...newTaskData,
        _id: `temp-${Date.now()}`,
        status: newTaskData.status || TASK_STATUS.TODO,
        createdAt: new Date().toISOString(),
        assignedUser: user, // Optimistically assume assigned to self or data provided
        isOptimistic: true
      };

      queryClient.setQueryData(queryKey, (old) => [optimisticTask, ...(old || [])]);

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', id, selectedSprintId], context.previousTasks);
      }
    },
    onSuccess: (res) => {
      const createdTask = res.data?.task || res.task;
      MetricsService.trackTaskCreated(createdTask?._id, createdTask?.title);
      
      setShowTaskForm(false);
      setAiSuggestion(null);
      setNewTask({
        title: '',
        description: '',
        status: TASK_STATUS.TODO,
        sprint: '',
        priority: 'medium',
        estimatedDuration: 30,
        durationUnit: 'minutes',
        dueDate: '',
        startDate: '',
        attachments: [],
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id, selectedSprintId] });
      queryClient.invalidateQueries({ queryKey: ['analytics', id, selectedSprintId] });
      queryClient.invalidateQueries({ queryKey: ['sprint-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }) => {
      const task = tasksQuery.data?.find(t => t._id === taskId);
      return TaskService.updateTaskStatus(taskId, status, task?.__v);
    },
    onMutate: async ({ taskId, status }) => {
      const queryKey = ['tasks', id, selectedSprintId];
      await queryClient.cancelQueries({ queryKey });
      const previousTasks = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old?.map((t) => (t._id === taskId ? { ...t, status } : t))
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ['tasks', id, selectedSprintId],
          context.previousTasks
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', id, selectedSprintId],
      });
      queryClient.invalidateQueries({
        queryKey: ['analytics', id, selectedSprintId],
      });
      queryClient.invalidateQueries({ queryKey: ['sprint-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const aiExtractMutation = useMutation({
    mutationFn: (text) => AiService.extractTaskFromText(text),
    onSuccess: (res) => {
      const suggestion = res.data?.suggestion;
      if (!suggestion) return;

      if (projectQuery.data?.sprint) {
        suggestion.sprint =
          projectQuery.data.sprint._id || projectQuery.data.sprint;
      }
      
      // Improve UX: Convert minutes to most appropriate unit for display
      let mins = suggestion.estimatedDuration || 30;
      if (mins >= 1440 && mins % 1440 === 0) {
        suggestion.estimatedDuration = mins / 1440;
        suggestion.durationUnit = 'days';
      } else if (mins >= 60 && mins % 60 === 0) {
        suggestion.estimatedDuration = mins / 60;
        suggestion.durationUnit = 'hours';
      } else {
        suggestion.durationUnit = 'minutes';
      }

      setAiSuggestion(suggestion);
      setAiInput('');
    },
  });

  const githubConnectMutation = useMutation({
    mutationFn: (token) => GithubService.connectGithub(token),
    onSuccess: () => {
      setGithubConnected(true);
      setGithubToken('');
      queryClient.invalidateQueries(['github-repos']);
    },
  });

  const githubLinkRepoMutation = useMutation({
    mutationFn: (repo) =>
      GithubService.linkProject(id, {
        owner: repo.owner,
        repo: repo.name,
        fullName: repo.fullName,
      }),
    onSuccess: () => queryClient.invalidateQueries(['project', id]),
  });

  const githubActivityMutation = useMutation({
    mutationFn: () => GithubService.getActivitySuggestions(id),
    onSuccess: (res) => setGithubSuggestions(res.data?.suggestions || []),
  });

  const githubApproveMutation = useMutation({
    mutationFn: (tasks) => GithubService.approveTasks(id, tasks),
    onSuccess: (_, approvedTasks) => {
      setGithubSuggestions((prev) =>
        prev.filter(
          (s) => !approvedTasks.some((at) => at.githubId === s.githubId)
        )
      );
      queryClient.invalidateQueries(['tasks', id]);
      queryClient.invalidateQueries(['analytics', id]);
      queryClient.invalidateQueries(['sprint-stats']);
      queryClient.invalidateQueries(['dashboard-stats']);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: (data) => ProjectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', id]);
      queryClient.invalidateQueries(['sprint-stats']);
      queryClient.invalidateQueries(['dashboard-stats']);
    },
  });

  const groupedTasks = useMemo(() => {
    const userId = user?._id;
    const visibleTasks =
      user?.role === USER_ROLES.INTERN
        ? (tasksQuery.data || []).filter(
            (t) =>
              (t.assignedUser?._id || t.assignedUser) === userId ||
              (t.createdBy?._id || t.createdBy) === userId
          )
        : tasksQuery.data || [];

    return {
      [TASK_STATUS.TODO]: visibleTasks.filter(
        (t) => t.status === TASK_STATUS.TODO
      ),
      [TASK_STATUS.IN_PROGRESS]: visibleTasks.filter(
        (t) => t.status === TASK_STATUS.IN_PROGRESS
      ),
      [TASK_STATUS.IN_REVIEW]: visibleTasks.filter(
        (t) => t.status === TASK_STATUS.IN_REVIEW
      ),
      [TASK_STATUS.DONE]: visibleTasks.filter(
        (t) => t.status === TASK_STATUS.DONE
      ),
    };
  }, [tasksQuery.data, user]);

  return {
    project: projectQuery.data,
    tasks: tasksQuery.data,
    analytics: analyticsQuery.data,
    directives: directivesQuery.data || [],
    isLoading:
      projectQuery.isLoading || tasksQuery.isLoading || sprintsQuery.isLoading || directivesQuery.isLoading,
    error:
      projectQuery.error ||
      tasksQuery.error ||
      sprintsQuery.error ||
      createTaskMutation.error ||
      aiExtractMutation.error,
    selectedSprintId,
    setSelectedSprintId,

    ui: {
      showTaskForm,
      setShowTaskForm,
      showAiInput,
      setShowAiInput,
      showGithubPanel,
      setShowGithubPanel,
    },

    statusMutation,
    createTaskMutation,
    updateProjectMutation,
    groupedTasks,
    sprints: useMemo(() => {
      const allSprints = sprintsQuery.data || [];
      return allSprints.filter(s => {
        const pid = s.project?._id || s.project;
        return !pid || pid === id;
      });
    }, [sprintsQuery.data, id]),

    ai: {
      input: aiInput,
      setInput: setAiInput,
      processing: aiExtractMutation.isPending,
      suggestion: aiSuggestion,
      setSuggestion: setAiSuggestion,
      extract: () => aiExtractMutation.mutate(aiInput),
    },

    github: {
      token: githubToken,
      setToken: setGithubToken,
      connected: githubConnected,
      setConnected: setGithubConnected,
      repos: reposQuery.data || [],
      loadingRepos: reposQuery.isLoading,
      suggestions: githubSuggestions,
      setSuggestions: setGithubSuggestions,
      isFetchingActivity: githubActivityMutation.isPending,
      connect: () => githubConnectMutation.mutate(githubToken),
      linkRepo: (repo) => githubLinkRepoMutation.mutate(repo),
      fetchRepos: () => reposQuery.refetch(),
      syncActivity: () => githubActivityMutation.mutate(),
      approveTasks: (tasks) => githubApproveMutation.mutate(tasks),
    },

    setNewTask,
    newTask,
    queryClient,
  };
};

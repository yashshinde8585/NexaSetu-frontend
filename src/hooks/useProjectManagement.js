import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProjectService from '../api/projectService';
import TaskService from '../api/taskService';
import SprintService from '../api/sprintService';
import AiService from '../api/aiService';
import GithubService from '../api/githubService';
import { TASK_STATUS, USER_ROLES } from '../constants';

// Manages state, mutations, and derived data for individual project environments.
export const useProjectManagement = (id, user) => {
  const queryClient = useQueryClient();

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
    enabled: !!id && id !== 'null',
  });

  const tasksQuery = useQuery({
    queryKey: ['tasks', id, selectedSprintId],
    queryFn: () =>
      TaskService.getTasksByProject(id, selectedSprintId).then(
        (res) => res.data?.tasks
      ),
    enabled: !!id && id !== 'null',
  });

  const analyticsQuery = useQuery({
    queryKey: ['analytics', id, selectedSprintId],
    queryFn: () =>
      ProjectService.getProjectAnalytics(id, selectedSprintId).then(
        (res) => res.data?.analytics
      ),
    enabled: !!id && id !== 'null',
  });

  const sprintsQuery = useQuery({
    queryKey: ['sprints', id],
    queryFn: async () => {
      const res = await SprintService.getSprints();
      const allSprints = res.data?.sprints || [];
      // Include sprints for this project OR global sprints
      return allSprints.filter(s => {
        const pid = s.project?._id || s.project;
        return !pid || pid === id;
      });
    },
    enabled: !!id,
  });

  const reposQuery = useQuery({
    queryKey: ['github-repos'],
    queryFn: () => GithubService.getRepositories().then((res) => res.data?.repositories || []),
    enabled: githubConnected,
    retry: false,
    onError: () => setGithubConnected(false),
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
    onSuccess: () => {
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
    sprints: sprintsQuery.data || [],
    isLoading:
      projectQuery.isLoading || tasksQuery.isLoading || sprintsQuery.isLoading,
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

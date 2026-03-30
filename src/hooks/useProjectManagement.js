import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProject, getProjectAnalytics, updateProject } from '../api/projectService';
import { getTasksByProject, createTask, updateTaskStatus } from '../api/taskService';
import { getSprints } from '../api/sprintService';
import { extractTaskFromText } from '../api/aiService';
import * as githubService from '../api/githubService';

export const useProjectManagement = (id, user) => {
    const queryClient = useQueryClient();

    // UI States
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showAiInput, setShowAiInput] = useState(false);
    const [showGithubPanel, setShowGithubPanel] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo', sprint: '' });
    const [githubToken, setGithubToken] = useState('');
    const [githubSuggestions, setGithubSuggestions] = useState([]);
    const [githubConnected, setGithubConnected] = useState(false);

    const [selectedSprintId, setSelectedSprintId] = useState(null);

    // Queries
    const projectQuery = useQuery({
        queryKey: ['project', id],
        queryFn: () => getProject(id).then(res => res.data.project)
    });

    const tasksQuery = useQuery({
        queryKey: ['tasks', id, selectedSprintId],
        queryFn: () => getTasksByProject(id, selectedSprintId).then(res => res.data.tasks)
    });

    const analyticsQuery = useQuery({
        queryKey: ['analytics', id, selectedSprintId],
        queryFn: () => getProjectAnalytics(id, selectedSprintId).then(res => res.data.analytics)
    });

    const sprintsQuery = useQuery({
        queryKey: ['sprints'],
        queryFn: () => getSprints().then(res => res.data.data.sprints || [])
    });

    const reposQuery = useQuery({
        queryKey: ['github-repos'],
        queryFn: () => githubService.getRepositories().then(res => res.data),
        enabled: githubConnected,
        retry: false,
        onError: () => setGithubConnected(false)
    });

    // Mutations
    const createTaskMutation = useMutation({
        mutationFn: (task) => {
            const currentSprintId = task.sprint || selectedSprintId || projectQuery.data?.sprint?._id || projectQuery.data?.sprint;
            return createTask({ ...task, project: id, sprint: currentSprintId });
        },
        onSuccess: () => {
            setShowTaskForm(false);
            setAiSuggestion(null);
            setNewTask({ title: '', description: '', status: 'todo', sprint: '' });
            queryClient.invalidateQueries({ queryKey: ['tasks', id, selectedSprintId] });
            queryClient.invalidateQueries({ queryKey: ['analytics', id, selectedSprintId] });
            queryClient.invalidateQueries({ queryKey: ['sprint-stats'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
    });

    const statusMutation = useMutation({
        mutationFn: ({ taskId, status }) => updateTaskStatus(taskId, status),
        onMutate: async ({ taskId, status }) => {
            const queryKey = ['tasks', id, selectedSprintId];
            await queryClient.cancelQueries({ queryKey });
            const previousTasks = queryClient.getQueryData(queryKey);
            queryClient.setQueryData(queryKey, old => old?.map(t => t._id === taskId ? { ...t, status } : t));
            return { previousTasks };
        },
        onError: (err, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks', id, selectedSprintId], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', id, selectedSprintId] });
            queryClient.invalidateQueries({ queryKey: ['analytics', id, selectedSprintId] });
            queryClient.invalidateQueries({ queryKey: ['sprint-stats'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
    });

    // GitHub & AI Operations
    const aiExtractMutation = useMutation({
        mutationFn: (text) => extractTaskFromText(text),
        onSuccess: (res) => {
            const suggestion = res.data.suggestion;
            // Automatically assign the project's current sprint if exists
            if (projectQuery.data?.sprint) {
                suggestion.sprint = projectQuery.data.sprint._id || projectQuery.data.sprint;
            }
            setAiSuggestion(suggestion);
            setAiInput('');
        }
    });

    const githubConnectMutation = useMutation({
        mutationFn: (token) => githubService.connectGithub(token),
        onSuccess: () => {
            setGithubConnected(true);
            setGithubToken('');
            queryClient.invalidateQueries(['github-repos']);
        }
    });

    const githubLinkRepoMutation = useMutation({
        mutationFn: (repo) => githubService.linkProject(id, { owner: repo.owner, repo: repo.name, fullName: repo.fullName }),
        onSuccess: () => queryClient.invalidateQueries(['project', id])
    });

    const githubActivityMutation = useMutation({
        mutationFn: () => githubService.getActivitySuggestions(id),
        onSuccess: (res) => setGithubSuggestions(res.data || [])
    });

    const githubApproveMutation = useMutation({
        mutationFn: (tasks) => githubService.approveTasks(id, tasks),
        onSuccess: (_, approvedTasks) => {
            setGithubSuggestions(prev => prev.filter(s => !approvedTasks.some(at => at.githubId === s.githubId)));
            queryClient.invalidateQueries(['tasks', id]);
            queryClient.invalidateQueries(['analytics', id]);
            queryClient.invalidateQueries(['sprint-stats']);
            queryClient.invalidateQueries(['dashboard-stats']);
        }
    });

    const updateProjectMutation = useMutation({
        mutationFn: (data) => updateProject(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['project', id]);
            queryClient.invalidateQueries(['sprint-stats']);
            queryClient.invalidateQueries(['dashboard-stats']);
        }
    });

    // Derived State: Grouped Tasks
    const groupedTasks = useMemo(() => {
        const userId = user?._id;
        const visibleTasks = (user?.role === 'INTERN') 
            ? (tasksQuery.data || []).filter(t => (t.assignedUser?._id || t.assignedUser) === userId)
            : (tasksQuery.data || []);

        return {
            todo: visibleTasks.filter(t => t.status === 'todo'),
            in_progress: visibleTasks.filter(t => t.status === 'in_progress'),
            in_review: visibleTasks.filter(t => t.status === 'in_review'),
            done: visibleTasks.filter(t => t.status === 'done')
        };
    }, [tasksQuery.data, user]);

    return {
        project: projectQuery.data,
        tasks: tasksQuery.data,
        analytics: analyticsQuery.data,
        sprints: sprintsQuery.data || [],
        isLoading: projectQuery.isLoading || tasksQuery.isLoading || sprintsQuery.isLoading,
        error: projectQuery.error || tasksQuery.error || sprintsQuery.error || createTaskMutation.error,
        selectedSprintId,
        setSelectedSprintId,
        
        // UI Controls
        ui: {
            showTaskForm, setShowTaskForm,
            showAiInput, setShowAiInput,
            showGithubPanel, setShowGithubPanel
        },
        
        // Operations
        statusMutation,
        createTaskMutation,
        updateProjectMutation,
        groupedTasks,
        
        // AI State/Action
        ai: {
            input: aiInput, setInput: setAiInput,
            processing: aiExtractMutation.isLoading,
            suggestion: aiSuggestion, setSuggestion: setAiSuggestion,
            extract: () => aiExtractMutation.mutate(aiInput)
        },
        
        // GitHub State/Action
        github: {
            token: githubToken, setToken: setGithubToken,
            connected: githubConnected, setConnected: setGithubConnected,
            repos: reposQuery.data || [],
            loadingRepos: reposQuery.isLoading,
            suggestions: githubSuggestions, setSuggestions: setGithubSuggestions,
            isFetchingActivity: githubActivityMutation.isLoading,
            connect: () => githubConnectMutation.mutate(githubToken),
            linkRepo: (repo) => githubLinkRepoMutation.mutate(repo),
            fetchRepos: () => reposQuery.refetch(),
            syncActivity: () => githubActivityMutation.mutate(),
            approveTasks: (tasks) => githubApproveMutation.mutate(tasks)
        },
        
        // Other Utils
        setNewTask, newTask, queryClient
    };
};

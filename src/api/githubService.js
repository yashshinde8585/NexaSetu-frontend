import api from './axios';

export const connectGithub = async (accessToken) => {
    return await api.post('/github/connect', { accessToken });
};

export const getRepositories = async () => {
    return await api.get('/github/repositories');
};

export const linkProject = async (projectId, repoInfo) => {
    return await api.post('/github/link-project', { projectId, repoInfo });
};

export const getActivitySuggestions = async (projectId) => {
    return await api.get(`/github/activity-suggestions/${projectId}`);
};

export const approveTasks = async (projectId, tasks) => {
    return await api.post('/github/approve-tasks', { projectId, tasks });
};

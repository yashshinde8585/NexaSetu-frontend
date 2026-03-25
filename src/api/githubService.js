import api from './axios';

export const connectGithub = async (accessToken) => {
    const response = await api.post('/github/connect', { accessToken });
    return response.data;
};

export const getRepositories = async () => {
    const response = await api.get('/github/repositories');
    return response.data;
};

export const linkProject = async (projectId, repoInfo) => {
    const response = await api.post('/github/link-project', { projectId, repoInfo });
    return response.data;
};

export const getActivitySuggestions = async (projectId) => {
    const response = await api.get(`/github/activity-suggestions/${projectId}`);
    return response.data;
};

export const approveTasks = async (projectId, tasks) => {
    const response = await api.post('/github/approve-tasks', { projectId, tasks });
    return response.data;
};

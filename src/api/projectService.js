import api from './axios';

export const getProjects = async () => {
    const response = await api.get('/projects');
    return response.data;
};

export const createProject = async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
};

export const getProject = async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
};

export const getProjectAnalytics = async (projectId, sprintId = null) => {
    const url = sprintId ? `/projects/${projectId}/analytics?sprintId=${sprintId}` : `/projects/${projectId}/analytics`;
    const response = await api.get(url);
    return response.data;
};

export const updateProject = async (projectId, projectData) => {
    const response = await api.patch(`/projects/${projectId}`, projectData);
    return response.data;
};

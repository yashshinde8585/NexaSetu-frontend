import api from './axios';

export const createTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};

export const getTasksByProject = async (projectId) => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
    const response = await api.patch(`/tasks/${taskId}`, { status });
    return response.data;
};

export const updateTask = async (taskId, taskData) => {
    const response = await api.patch(`/tasks/${taskId}`, taskData);
    return response.data;
};

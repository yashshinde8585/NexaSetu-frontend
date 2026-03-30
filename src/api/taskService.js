import api from './axios';

export const createTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};

export const getTasksByProject = async (projectId, sprintId = null) => {
    const url = sprintId ? `/tasks/project/${projectId}?sprintId=${sprintId}` : `/tasks/project/${projectId}`;
    const response = await api.get(url);
    return response.data;
};

export const getMyTasks = async () => {
    const response = await api.get('/tasks/my-tasks');
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

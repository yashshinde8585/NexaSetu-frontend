import api from './axios';

export const getPendingActions = async () => {
    const response = await api.get('/actions/pending');
    return response.data;
};

export const approveAction = async (actionId) => {
    const response = await api.post(`/actions/${actionId}/approve`);
    return response.data;
};

export const rejectAction = async (actionId) => {
    const response = await api.post(`/actions/${actionId}/reject`);
    return response.data;
};

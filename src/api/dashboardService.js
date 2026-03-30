import api from './axios';

export const getDashboardStats = async (params = {}) => {
    return await api.get('/dashboard/stats', { params });
};

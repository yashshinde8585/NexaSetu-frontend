import api from './axios';

export const getDashboardStats = async () => {
    return await api.get('/dashboard/stats');
};

import api from './axios';

export const extractTaskFromText = async (text) => {
    const response = await api.post('/ai/extract', { text });
    return response.data;
};

export const getPortfolioRecommendations = async () => {
    const response = await api.get('/ai/portfolio-recommendations');
    return response.data;
};

export const getActivityLogs = async () => {
    const response = await api.get('/ai/activity-logs');
    return response.data;
};

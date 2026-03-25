import api from './axios';

export const getResourceWorkload = async () => {
    const response = await api.get('/resources/workload');
    return response.data;
};

import api from './axios';

export const extractTaskFromText = async (text) => {
    const response = await api.post('/ai/extract', { text });
    return response.data;
};

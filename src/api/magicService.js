import api from './axios';

export const executeMagicCommand = async (query, context = {}) => {
    const response = await api.post('/magic/execute', { query, context });
    return response.data;
};

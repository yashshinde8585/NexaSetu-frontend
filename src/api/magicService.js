import api from './axios';

export const executeMagicCommand = async (query) => {
    const response = await api.post('/magic/execute', { query });
    return response.data;
};

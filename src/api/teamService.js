import api from './axios';


export const inviteBulkMembers = async (invites) => {
    const response = await api.post('/team/invite-bulk', { invites });
    return response.data;
};


export const getTeamMembers = async () => {
    const response = await api.get('/team/members');
    return response.data;
};

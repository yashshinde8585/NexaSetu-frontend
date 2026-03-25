import api from './axios';

/**
 * Bulk invite members to the team.
 * @param {Array} invites - List of { name, email, role, projectId }
 */
export const inviteBulkMembers = async (invites) => {
    const response = await api.post('/team/invite-bulk', { invites });
    return response.data;
};

/**
 * Get team members for the workspace.
 */
export const getTeamMembers = async () => {
    const response = await api.get('/team/members');
    return response.data;
};

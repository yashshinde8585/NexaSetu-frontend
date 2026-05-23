import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

const normalizeMember = (member) => {
  if (!member) return null;
  return {
    ...member,
    id: member._id || member.id,
    assignedProjectId: member.assignedProjectId
      ? {
          ...member.assignedProjectId,
          id: member.assignedProjectId._id || member.assignedProjectId.id,
        }
      : null,
  };
};

export const inviteBulk = (data) => {
  return apiClient.post(API_ENDPOINTS.TEAM.INVITE_BULK, data);
};

export const getMembers = async (
  params = { page: 1, limit: 20, search: '' }
) => {
  const res = await apiClient.get(API_ENDPOINTS.TEAM.MEMBERS, { params });

  // Normalize data structure
  const data = res.data || res;
  return {
    ...data,
    members: (data.members || []).map(normalizeMember),
    invitations: (data.invitations || []).map((inv) => ({
      ...inv,
      id: inv._id || inv.id,
      projectId: inv.projectId
        ? {
            ...inv.projectId,
            id: inv.projectId._id || inv.projectId.id,
          }
        : null,
    })),
  };
};

export const getRoles = () => {
  return apiClient.get(API_ENDPOINTS.TEAM.ROLES);
};

export const removeInvitation = (id) => {
  return apiClient.delete(API_ENDPOINTS.TEAM.REMOVE_INVITATION(id));
};

export const updateMemberProject = (id, projectId) => {
  return apiClient.patch(`/team/members/${id}/project`, { projectId });
};

export default {
  inviteBulk,
  getMembers,
  getRoles,
  removeInvitation,
  updateMemberProject,
};

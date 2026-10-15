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
  const responseData = res.data || res;

  const rawItems = responseData.items || responseData.members || [];
  const normalizedItems = rawItems.map(normalizeMember);

  const legacyMembers = normalizedItems.filter(
    (item) => item.type !== 'invitation' && item.status !== 'Invited'
  );
  const rawInvitations =
    responseData.invitations ||
    normalizedItems.filter(
      (item) => item.type === 'invitation' || item.status === 'Invited'
    );
  const legacyInvitations = rawInvitations.map((inv) => ({
    ...inv,
    id: inv._id || inv.id,
    projectId: inv.projectId
      ? {
          ...inv.projectId,
          id: inv.projectId._id || inv.projectId.id,
        }
      : null,
  }));

  return {
    ...responseData,
    items: normalizedItems,
    members: legacyMembers,
    invitations: legacyInvitations,
    stats: responseData.stats,
    data: {
      members: legacyMembers,
      invitations: legacyInvitations,
    },
  };
};

export const getRoles = () => {
  return apiClient.get(API_ENDPOINTS.TEAM.ROLES);
};

export const removeInvitation = (id) => {
  return apiClient.delete(API_ENDPOINTS.TEAM.REMOVE_INVITATION(id));
};

export const updateMemberProject = (id, projectId, config = {}) => {
  return apiClient.patch(
    `/team/members/${id}/project`,
    { projectId },
    { skipToast: true, ...config }
  );
};

export default {
  inviteBulk,
  getMembers,
  getRoles,
  removeInvitation,
  updateMemberProject,
};

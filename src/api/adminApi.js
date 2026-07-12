import apiClient from './apiClient';

// Interface for system administration actions mapping to /v1/admin backend routes.
// SECURITY CONSTRAINTS: All endpoints here require workspace administrator privileges.
// Non-admin sessions will receive 403 Forbidden responses.
const AdminService = {
  getAdminDashboard: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.action) params.append('action', filters.action);
    return apiClient.get(`/v1/admin/dashboard?${params.toString()}`);
  },

  updateSettings: (settings) => apiClient.patch('/v1/admin/settings', settings),

  inviteUser: (data) => apiClient.post('/v1/admin/invite-user', data),

  deactivateUser: (userId, status) =>
    apiClient.patch('/v1/admin/deactivate-user', { userId, status }),

  updateUserRole: (userId, role) =>
    apiClient.patch('/v1/admin/user-role', { userId, role }),

  createTeam: (teamData) => apiClient.post('/v1/admin/teams', teamData),

  updateTeam: (id, teamData) =>
    apiClient.patch(`/v1/admin/teams/${id}`, teamData),

  deleteTeam: (id) => apiClient.delete(`/v1/admin/teams/${id}`),

  updateRolePermissions: (role, permissions) =>
    apiClient.patch('/v1/admin/role-permissions', { role, permissions }),

  createRole: (roleName, permissions) =>
    apiClient.post('/v1/admin/roles', { roleName, permissions }),
};

export default AdminService;

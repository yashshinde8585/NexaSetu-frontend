import apiClient from './apiClient';

/**
 * Admin Service - Interface for system administration actions.
 */
const AdminService = {
  /**
   * Fetch admin dashboard data
   */
  getAdminDashboard: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.action) params.append('action', filters.action);
    return apiClient.get(`/v1/admin/dashboard?${params.toString()}`);
  },

  /**
   * Update workspace settings
   */
  updateSettings: (settings) => apiClient.patch('/v1/admin/settings', settings),

  /**
   * Invite a new user to the workspace
   */
  inviteUser: (data) => apiClient.post('/v1/admin/invite-user', data),

  /**
   * Deactivate a user
   */
  deactivateUser: (userId, status) => apiClient.patch('/v1/admin/deactivate-user', { userId, status }),

  /**
   * Update a user's role
   */
  updateUserRole: (userId, role) => apiClient.patch('/v1/admin/user-role', { userId, role }),
  /**
   * Create a new team
   */
  createTeam: (teamData) => apiClient.post('/v1/admin/create-team', teamData),
  /**
   * Update an existing team
   */
  updateTeam: (id, teamData) => apiClient.patch(`/v1/admin/update-team/${id}`, teamData),
  /**
   * Delete a team
   */
  deleteTeam: (id) => apiClient.delete(`/v1/admin/delete-team/${id}`),
  /**
   * Update permissions for a specific role
   */
  updateRolePermissions: (role, permissions) => apiClient.patch('/v1/admin/role-permissions', { role, permissions }),
  /**
   * Create a new role
   */
  createRole: (roleName, permissions) => apiClient.post('/v1/admin/create-role', { roleName, permissions })
};

export default AdminService;

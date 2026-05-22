import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService from '../api/adminService';
import socketService from '../services/socketService';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for managing Admin dashboard state and actions.
 */
export const useAdminDashboard = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ action: '' });
  const { user } = useAuth();

  // 1. Fetch Dashboard Data
  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['admin-dashboard', filters, user?.workspaceId],
    queryFn: () => AdminService.getAdminDashboard(filters),
    refetchInterval: 120000,
    staleTime: 60000,
    enabled: !!user?.workspaceId,
  });
 
  // 2. Real-time Synchronization
  useEffect(() => {
    if (!user?.workspaceId) return;
 
    // Join workspace signaling room
    const workspaceId = String(user.workspaceId);
    
    // Listen for tactical updates
    const handleUserUpdate = (payload) => {
      console.log('[REAL-TIME] User record updated:', payload);
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    };
 
    const handleTeamUpdate = (payload) => {
      console.log('[REAL-TIME] Squad structure updated:', payload);
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    };
 
    socketService.onEvent('USER_UPDATED', handleUserUpdate);
    socketService.onEvent('TEAM_UPDATED', handleTeamUpdate);
 
    if (socketService.socket) {
      socketService.socket.emit('join_workspace', workspaceId);
    }
 
    return () => {
      if (socketService.socket) {
        socketService.socket.emit('leave_workspace', workspaceId);
      }
      socketService.offEvent('USER_UPDATED');
      socketService.offEvent('TEAM_UPDATED');
    };
  }, [user?.workspaceId, queryClient]);

  // 3. Mutations
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => AdminService.updateUserRole(userId, role),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: ({ userId, status }) => AdminService.deactivateUser(userId, status),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings) => AdminService.updateSettings(settings),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const createTeamMutation = useMutation({
    mutationFn: (teamData) => AdminService.createTeam(teamData),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ teamId, teamData }) => AdminService.updateTeam(teamId, teamData),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (teamId) => AdminService.deleteTeam(teamId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const updateRolePermissionsMutation = useMutation({
    mutationFn: ({ role, permissions }) => AdminService.updateRolePermissions(role, permissions),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const createRoleMutation = useMutation({
    mutationFn: ({ roleName, permissions }) => AdminService.createRole(roleName, permissions),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  return {
    data: data?.data,
    isLoading,
    error,
    updateUserRole: (payload) => updateRoleMutation.mutateAsync(payload),
    deactivateUser: (payload) => deactivateMutation.mutateAsync(payload),
    updateSettings: (settings) => updateSettingsMutation.mutateAsync(settings),
    createTeam: (teamData) => createTeamMutation.mutateAsync(teamData),
    updateTeam: (teamId, teamData) => updateTeamMutation.mutateAsync({ teamId, teamData }),
    deleteTeam: (teamId) => deleteTeamMutation.mutateAsync(teamId),
    updateRolePermissions: (payload) => updateRolePermissionsMutation.mutateAsync(payload),
    createRole: (payload) => createRoleMutation.mutateAsync(payload),
    updateRoleMutation,
    deactivateMutation,
    updateSettingsMutation,
    createTeamMutation,
    updateTeamMutation,
    deleteTeamMutation,
    updateRolePermissionsMutation,
    createRoleMutation,
    refetch,
    filters,
    setFilters
  };
};

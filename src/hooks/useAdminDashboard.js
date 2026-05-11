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
    if (!user?.workspaceId || !socketService.socket) return;
 
    // Join workspace signaling room
    const workspaceId = user.workspaceId.toString();
    socketService.socket.emit('join_workspace', workspaceId);
    
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
 
    return () => {
      socketService.socket?.emit('leave_workspace', workspaceId);
      socketService.offEvent('USER_UPDATED');
      socketService.offEvent('TEAM_UPDATED');
    };
  }, [user?.workspaceId, queryClient]);

  // 3. Mutations
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => AdminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: ({ userId, status }) => AdminService.deactivateUser(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings) => AdminService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const createTeamMutation = useMutation({
    mutationFn: (teamData) => AdminService.createTeam(teamData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (teamId) => AdminService.deleteTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const updateRolePermissionsMutation = useMutation({
    mutationFn: ({ role, permissions }) => AdminService.updateRolePermissions(role, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const createRoleMutation = useMutation({
    mutationFn: ({ roleName, permissions }) => AdminService.createRole(roleName, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  return {
    data: data?.data,
    isLoading,
    error,
    updateUserRole: (payload) => updateRoleMutation.mutate(payload),
    deactivateUser: (payload) => deactivateMutation.mutate(payload),
    updateSettings: (settings) => updateSettingsMutation.mutate(settings),
    createTeam: (teamData) => createTeamMutation.mutate(teamData),
    deleteTeam: (teamId) => deleteTeamMutation.mutate(teamId),
    updateRolePermissions: (payload) => updateRolePermissionsMutation.mutate(payload),
    createRole: (payload) => createRoleMutation.mutate(payload),
    refetch,
    filters,
    setFilters
  };
};

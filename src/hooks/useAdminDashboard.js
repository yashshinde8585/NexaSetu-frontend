import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService from '../api/adminService';

/**
 * Hook for managing Admin dashboard state and actions.
 */
export const useAdminDashboard = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = React.useState({ action: '' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard', filters],
    queryFn: () => AdminService.getAdminDashboard(filters).then(res => res.data),
    refetchInterval: 1000 * 60 * 2, // 2 minutes
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settings) => AdminService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => AdminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const inviteUserMutation = useMutation({
    mutationFn: (data) => AdminService.inviteUser(data),
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

  const createTeamMutation = useMutation({
    mutationFn: (data) => AdminService.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, ...data }) => AdminService.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id) => AdminService.deleteTeam(id),
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
    data,
    isLoading,
    error,
    filters,
    setFilters,
    updateSettings: updateSettingsMutation.mutate,
    updateUserRole: updateRoleMutation.mutate,
    inviteUser: inviteUserMutation.mutateAsync,
    deactivateUser: deactivateMutation.mutate,
    createTeam: createTeamMutation.mutateAsync,
    updateTeam: (id, teamData) => updateTeamMutation.mutateAsync({ id, ...teamData }),
    deleteTeam: deleteTeamMutation.mutateAsync,
    updateRolePermissions: updateRolePermissionsMutation.mutateAsync,
    createRole: createRoleMutation.mutateAsync
  };
};

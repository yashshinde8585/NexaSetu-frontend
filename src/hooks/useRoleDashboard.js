import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardService from '../api/dashboardService';
import socketService from '../services/socketService';
import { useAuth } from '../context/AuthContext';

/**
 * useRoleDashboard - Unified hook for fetching and managing role-specific dashboards.
 * @param {string} role - The role identifier.
 * @param {object} options - Query configuration.
 */
export const useRoleDashboard = (role, options = {}) => {
  const { authReady } = useAuth();

  // Fetch dashboard data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard', role],
    queryFn: () => DashboardService.getRoleDashboard(role).then(res => res.data),
    refetchInterval: 60000, // Default 1 minute
    staleTime: 30000,
    enabled: authReady && !!role,
    ...options
  });

  const queryClient = useQueryClient();

  // Real-time synchronization
  useEffect(() => {
    const invalidate = () => {
      console.debug(`[REAL-TIME] Invalidating dashboard data for: ${role}`);
      queryClient.invalidateQueries({ queryKey: ['dashboard', role] });
    };

    // Listen for critical events that impact the EM dashboard
    socketService.onEvent('task_updated', invalidate);
    socketService.onEvent('sprint_updated', invalidate);
    socketService.onEvent('blocker_detected', invalidate);
    socketService.onEvent('service_updated', invalidate);
    socketService.onEvent('TEAM_SYNC_REQUIRED', invalidate);

    return () => {
      socketService.offEvent('task_updated');
      socketService.offEvent('sprint_updated');
      socketService.offEvent('blocker_detected');
      socketService.offEvent('service_updated');
      socketService.offEvent('TEAM_SYNC_REQUIRED');
    };
  }, [role, queryClient]);

  // Drilldown state management
  const [drilldown, setDrilldown] = useState({ 
    isOpen: false, 
    category: '', 
    type: 'role', 
    data: [] 
  });

  const handleDrilldown = useCallback(async (category, type = 'role') => {
    try {
      setDrilldown(prev => ({ ...prev, isOpen: true, category, type, data: [] }));
      
      let drillData = [];
      if (type === 'role') {
        const res = await DashboardService.getRoleBreakdown(category);
        drillData = res.data.data;
      } else {
        const res = await DashboardService.getIndividualBreakdown(category);
        drillData = res.data.data;
      }
      
      setDrilldown(prev => ({ ...prev, data: drillData }));
    } catch (err) {
      console.error('Drilldown failed:', err);
    }
  }, []);


  const closeDrilldown = useCallback(() => {
    setDrilldown(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
    // Drilldown support
    drilldown,
    setDrilldown,
    handleDrilldown,
    closeDrilldown
  };
};

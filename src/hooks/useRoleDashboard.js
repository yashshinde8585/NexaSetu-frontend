import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardService from '../api/dashboardService';

/**
 * useRoleDashboard - Unified hook for fetching and managing role-specific dashboards.
 * @param {string} role - The role identifier.
 * @param {object} options - Query configuration.
 */
export const useRoleDashboard = (role, options = {}) => {
  // Fetch dashboard data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard', role],
    queryFn: () => DashboardService.getRoleDashboard(role).then(res => res.data),
    refetchInterval: 60000, // Default 1 minute
    staleTime: 30000,
    ...options
  });

  // Drilldown state management
  const [drilldown, setDrilldown] = useState({ 
    isOpen: false, 
    category: '', 
    type: 'role', 
    data: [] 
  });

  const handleDrilldown = useCallback(async (category, type = 'role') => {
    try {
      let drillData = [];
      // Dynamic drilldown fetching based on role and category
      // This can be expanded as needed or handled locally in components
      // For now, we provide the state management
      setDrilldown(prev => ({ ...prev, isOpen: true, category, type }));
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

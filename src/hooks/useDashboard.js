import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '../api/projectService';
import { getDashboardStats } from '../api/dashboardService';

export const useDashboard = (user) => {
  const queryClient = useQueryClient();
  const [newProjectName, setNewProjectName] = useState('');
  const [showForm, setShowForm] = useState(false);

  // 1. Queries
  const statsQuery = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStats().then(res => res.data.data)
  });

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: (name) => createProject({ name }),
    onSuccess: () => {
      setNewProjectName('');
      setShowForm(false);
      queryClient.invalidateQueries(['dashboard-stats']);
    }
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    const name = newProjectName.trim();
    if (name) createMutation.mutate(name);
  };

  // 3. Derived Logic
  const visibleProjects = useMemo(() => {
    if (!statsQuery.data?.projects) return [];
    return statsQuery.data.projects.filter(project => {
      if (user?.role === 'ADMIN' || user?.role === 'MANAGER') return true;
      const userId = user?._id;
      return (
        project.members?.some(m => (m?._id || m) === userId) || 
        (project.createdBy?._id || project.createdBy) === userId
      );
    });
  }, [statsQuery.data?.projects, user]);

  return {
    projects: visibleProjects,
    recentActivity: statsQuery.data?.recentActivity,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
    createMutation,
    newProjectName,
    setNewProjectName,
    showForm,
    setShowForm,
    handleCreateProject
  };
};

import React from 'react';
import { FolderOpen, Rocket, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';

// Sub-components
import StatCards from '../components/dashboard/StatCards';
import ProjectList from '../components/dashboard/ProjectList';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    projects,
    recentActivity,
    isLoading,
    error,
    createMutation,
    newProjectName,
    setNewProjectName,
    showForm,
    setShowForm,
    handleCreateProject
  } = useDashboard(user);

  const stats = React.useMemo(() => {
    const activeCount = projects.filter(p => p.percentage < 100).length;
    const completedCount = projects.filter(p => p.percentage === 100).length;
    const atRiskCount = projects.filter(p => p.percentage < 50 && p.percentage > 0).length;
    const avgVelocity = projects.length > 0 
      ? (projects.reduce((sum, p) => sum + p.percentage, 0) / projects.length).toFixed(0) 
      : 0;

    return [
      { label: 'Active Projects', value: activeCount, color: 'bg-primary/10 border-primary/20 text-primary', icon: <FolderOpen size={20} /> },
      { label: 'Overall Velocity', value: `${avgVelocity}%`, color: 'bg-white/5 border-white/10 text-white', icon: <Rocket size={20} /> },
      { label: 'Projects At Risk', value: atRiskCount, color: 'bg-status-warning/10 border-status-warning/20 text-status-warning', icon: <Zap size={20} /> },
      { label: 'Completed', value: completedCount, color: 'bg-status-success/10 border-status-success/20 text-status-success', icon: <CheckCircle size={20} /> },
    ];
  }, [projects]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const errorMessage = error?.response?.data?.message || createMutation.error?.response?.data?.message || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {errorMessage && <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-3 rounded-xl text-xs">{errorMessage}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-10">
          <StatCards stats={stats} />
          
          <ProjectList 
            projects={projects} 
            user={user}
            handleCreateProject={handleCreateProject}
            newProjectName={newProjectName}
            setNewProjectName={setNewProjectName}
            showForm={showForm}
            setShowForm={setShowForm}
          />
        </div>

        <ActivityFeed recentActivity={recentActivity} />
      </div>
    </div>
  );
};

export default Dashboard;

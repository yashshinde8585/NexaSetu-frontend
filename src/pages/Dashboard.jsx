import React from 'react';
import {
  FolderOpen,
  Rocket,
  CheckCircle,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { useMagic } from '../context/MagicContext';

// Components
import StatCards from '../components/dashboard/StatCards';
import SprintList from '../components/dashboard/SprintList';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import RoleAnalytics from '../components/dashboard/RoleAnalytics';
import ProjectCard from '../components/ProjectCard';
import ApprovalPanel from '../components/portfolio/ApprovalPanel';

import ProjectOverviewList from '../components/dashboard/ProjectOverviewList';
import ProjectHealthSummary from '../components/dashboard/ProjectHealthSummary';
import CenteredLoading from '../components/atoms/CenteredLoading';



// Centralized view of project health, team activity, and AI insights.
const Dashboard = () => {
  const { user } = useAuth();
  const { setProjects, setDashboardContext } = useMagic();
  const {
    projects,
    workload,
    aiImpact,
    summary,
    personal,
    sprints,
    selectedSprintId,
    setSelectedSprintId,
    sprintStats,
    recentActivity,
    isLoading,
    error,
    createMutation,
    pendingActions,
    approveAction,
    rejectAction,
  } = useDashboard(user);

  const [selectedProjectId, setSelectedProjectId] = React.useState(null);

  // User Roles
  const isLead = React.useMemo(
    () =>
      (user?.jobTitle || '').toUpperCase().includes('LEAD') ||
      user?.role === 'TECH_LEAD',
    [user]
  );
  const isAdmin = React.useMemo(
    () =>
      (user?.role === 'WORKSPACE_ADMIN' ||
        user?.role === 'WORKSPACE_MANAGER') &&
      !isLead,
    [user, isLead]
  );

  // Sync with global context
  React.useEffect(() => {
    if (projects) {
      setProjects(projects);

      // Auto-deselect if the project is no longer in the list
      if (
        selectedProjectId &&
        !projects.some((p) => p._id === selectedProjectId)
      ) {
        setSelectedProjectId(null);
      }
    }
  }, [projects, selectedProjectId, setProjects]);

  const stats = React.useMemo(() => {
    let computedStats = [];
    if (isAdmin) {
      const activeCount = projects.filter((p) => p.percentage < 100).length;
      const completedCount = projects.filter(
        (p) => p.percentage === 100
      ).length;
      const atRiskCount = projects.filter(
        (p) => p.percentage < 50 && p.percentage > 0
      ).length;
      const avgVelocity =
        projects.length > 0
          ? projects.reduce((sum, p) => sum + p.percentage, 0) / projects.length
          : 0;

      computedStats = [
        {
          label: 'Active Projects',
          value: activeCount,
          color: 'bg-primary/10 border-primary/20 text-primary',
          icon: <FolderOpen size={20} />,
          trend: '+2 this mo',
        },
        {
          label: 'Workload Velocity',
          value: `${avgVelocity.toFixed(0)}%`,
          color: 'bg-white/5 border-white/10 text-white',
          icon: <Rocket size={20} />,
          trend: '+5.2%',
        },
        {
          label: 'Priority Projects',
          value: atRiskCount,
          color:
            'bg-status-warning/10 border-status-warning/20 text-status-warning',
          icon: <Zap size={20} />,
          trend: '+12% risk',
        },
        {
          label: 'Completed',
          value: completedCount,
          color:
            'bg-status-success/10 border-status-success/20 text-status-success',
          icon: <CheckCircle size={20} />,
          trend: '+4 this wk',
        },
      ];
    } else {
      // Personal task filters
      computedStats = [
        {
          label: 'To-Do',
          value: personal.todo,
          color: 'bg-white/5 border-white/10 text-white/40',
          icon: <FolderOpen size={20} />,
          trend: `Overall: ${summary.todo}`,
          to: '/my-tasks?filter=todo&scope=personal',
        },
        {
          label: 'In Progress',
          value: personal.in_progress,
          color: 'bg-primary/10 border-primary/20 text-primary',
          icon: <Rocket size={20} />,
          trend: `Overall: ${summary.in_progress}`,
          to: '/my-tasks?filter=in_progress&scope=personal',
        },
        {
          label: 'In Review',
          value: personal.in_review,
          color: 'bg-secondary/10 border-secondary/20 text-secondary',
          icon: <ShieldCheck size={20} />,
          trend: `Overall: ${summary.in_review}`,
          to: '/my-tasks?filter=in_review&scope=personal',
        },
        {
          label: 'Done',
          value: personal.done,
          color:
            'bg-status-success/10 border-status-success/20 text-status-success',
          icon: <CheckCircle size={20} />,
          trend: `Overall: ${summary.done}`,
          to: '/my-tasks?filter=completed&scope=personal',
        },
      ];
    }
    return computedStats;
  }, [projects, workload, personal, user, isAdmin, isLead]);

  // Sync summary stats
  React.useEffect(() => {
    if (stats && stats.length > 0) {
      setDashboardContext({ stats });
    }
  }, [stats, setDashboardContext]);

  if (isLoading) {
    return <CenteredLoading />;
  }

  const errorMessage = error?.message || createMutation.error?.message || '';

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 pt-8 pb-12 space-y-12">
      {errorMessage && (
        <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-3 rounded-xl text-xs">
          {errorMessage}
        </div>
      )}



      <div className="space-y-12">
        <StatCards stats={stats} />
        
        <ProjectHealthSummary sprintId={selectedSprintId} />

        <div className="relative z-30">
          {isAdmin ? (
            <ProjectOverviewList
              projects={projects}
              isLoading={isLoading}
              onProjectSelect={setSelectedProjectId}
              selectedProjectId={selectedProjectId}
            />
          ) : (
            <SprintList
              sprints={sprints}
              user={user}
              isLoading={isLoading}
              onSprintSelect={setSelectedSprintId}
              selectedSprintId={selectedSprintId}
            />
          )}
        </div>

        <div className="relative z-20">
          <RoleAnalytics
            user={user}
            projects={
              selectedProjectId
                ? projects.filter((p) => p._id === selectedProjectId)
                : projects
            }
            workload={(() => {
              if (!selectedProjectId) return workload;
              const members =
                projects.find((p) => p._id === selectedProjectId)?.members ||
                [];
              const memberNames = members.map((m) =>
                typeof m === 'string' ? m : m.name || m._id
              );
              return workload.filter((w) => memberNames.includes(w.name));
            })()}
            aiImpact={aiImpact}
            selectedSprintId={selectedSprintId}
            sprints={sprints}
          />
        </div>

        {/* AI Approvals */}
        <div className="pt-10 transition-all duration-1000">
          <ApprovalPanel
            actions={pendingActions}
            handleApprove={approveAction}
            handleReject={rejectAction}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

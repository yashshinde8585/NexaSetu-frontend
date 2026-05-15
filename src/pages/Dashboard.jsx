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
import CenteredLoading from '../components/atoms/CenteredLoading';
import { ResilientPage } from '../components/states';
import DirectiveBanner from '../components/molecules/dashboard/DirectiveBanner';

const SprintList = React.lazy(() => import('../components/dashboard/SprintList'));
const RoleAnalytics = React.lazy(() => import('../components/dashboard/RoleAnalytics'));
const ApprovalPanel = React.lazy(() => import('../components/portfolio/ApprovalPanel'));
const ProjectOverviewList = React.lazy(() => import('../components/dashboard/ProjectOverviewList'));
const ProjectHealthSummary = React.lazy(() => import('../components/dashboard/ProjectHealthSummary'));

import { resolveDashboard } from './dashboard/DashboardRegistry';

// Centralized view router for project health, team activity, and AI insights.
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
    if (isAdmin && projects) {
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
          trend: '+2 this month',
        },
        {
          label: 'Total Velocity',
          value: `${avgVelocity.toFixed(0)}%`,
          color: 'bg-white/10 border-white/20 text-white',
          icon: <Rocket size={20} />,
          trend: '+5.2%',
        },
        {
          label: 'Attention Needed',
          value: atRiskCount,
          color:
            'bg-status-warning/10 border-status-warning/20 text-status-warning',
          icon: <Zap size={20} />,
          trend: 'Requires review',
        },
        {
          label: 'Completed',
          value: completedCount,
          color:
            'bg-status-success/10 border-status-success/20 text-status-success',
          icon: <CheckCircle size={20} />,
          trend: '+4 this week',
        },
      ];
    } else {
      // Personal task filters
      computedStats = [
        {
          label: 'To-Do',
          value: personal.todo,
          color: 'bg-white/10 border-white/20 text-white/60',
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

  // Strategic Role Redirection (Master Dashboard Registry)
  const TacticalDashboard = resolveDashboard(user);

  const filteredWorkload = React.useMemo(() => {
    if (!selectedProjectId) return workload;
    const members = projects.find((p) => p._id === selectedProjectId)?.members || [];
    const memberNames = members.map((m) =>
      typeof m === 'string' ? m : m.name || m._id
    );
    return workload.filter((w) => memberNames.includes(w.name));
  }, [selectedProjectId, projects, workload]);

  return (
    <ResilientPage 
      error={error}
      onRetry={() => window.location.reload()}
    >
      {TacticalDashboard ? (
        <React.Suspense fallback={<CenteredLoading />}>
          <TacticalDashboard />
        </React.Suspense>
      ) : (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-8">
          {createMutation.error && (
            <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-3 rounded-xl text-xs">
              {createMutation.error.message}
            </div>
          )}

      <div className="space-y-8">
        <StatCards stats={stats} isLoading={isLoading} />
        
        <React.Suspense fallback={<div className="h-40 bg-white/[0.02] border border-white/5 rounded-[2rem] animate-pulse" />}>
          <ProjectHealthSummary sprintId={selectedSprintId} />
        </React.Suspense>

        <div className="relative z-30">
          <React.Suspense fallback={<div className="h-64 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />}>
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
          </React.Suspense>
        </div>

        <div className="relative z-20">
          <React.Suspense fallback={<div className="h-80 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />}>
            <RoleAnalytics
              user={user}
              projects={
                selectedProjectId
                  ? projects.filter((p) => p._id === selectedProjectId)
                  : projects
              }
              workload={filteredWorkload}
              aiImpact={aiImpact}
              selectedSprintId={selectedSprintId}
              sprints={sprints}
              isLoading={isLoading}
            />
          </React.Suspense>
        </div>


        {/* AI Approvals */}
        <div className="pt-6 transition-all duration-1000">
          <React.Suspense fallback={<div className="h-40 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />}>
            <ApprovalPanel
              actions={pendingActions}
              handleApprove={approveAction}
              handleReject={rejectAction}
              isLoading={isLoading}
            />
          </React.Suspense>
          </div>
        </div>

      </div>
    )}
    </ResilientPage>
  );
};

export default Dashboard;

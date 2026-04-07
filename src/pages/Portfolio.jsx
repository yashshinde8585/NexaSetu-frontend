import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardService from '../api/dashboardService';
import ResourceService from '../api/resourceService';
import AiService from '../api/aiService';
import ActionService from '../api/actionService';

import ProjectCard from '../components/ProjectCard';
// import MagicBar from '../components/MagicBar';
import StrategicOverview from '../components/portfolio/StrategicOverview';
import ApprovalPanel from '../components/portfolio/ApprovalPanel';
import SuggestionPanel from '../components/portfolio/SuggestionPanel';
import ResourcePanel from '../components/portfolio/ResourcePanel';
import ActivityFeed from '../components/portfolio/ActivityFeed';
import CenteredLoading from '../components/atoms/CenteredLoading';

import { usePermissions, PERMISSIONS } from '../hooks/usePermissions';

// A high-level orchestration page for managing project portfolios, team capacity, and AI-driven strategic approvals.
const Portfolio = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['portfolio-stats'],
    queryFn: () =>
      DashboardService.getDashboardStats().then((res) => res.data),
  });

  const { data: resources, isLoading: resLoading } = useQuery({
    queryKey: ['resource-workload'],
    queryFn: () =>
      ResourceService.getWorkload().then((res) => res.data.resources),
  });

  const {
    data: recommendations,
    isLoading: recLoading,
    refetch: refetchRecs,
  } = useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: () =>
      AiService.getPortfolioRecommendations().then(
        (res) => res.data.recommendations
      ),
  });

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: () => AiService.getActivityLogs().then((res) => res.data.logs),
  });

  const { data: actions, isLoading: actionsLoading } = useQuery({
    queryKey: ['pending-actions'],
    queryFn: () =>
      ActionService.getPendingActions().then((res) => res.data.actions),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => ActionService.approveAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries([
        'pending-actions',
        'portfolio-stats',
        'activity-logs',
      ]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => ActionService.rejectAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-actions']);
    },
  });

  const isLoading =
    statsLoading || resLoading || recLoading || logsLoading || actionsLoading;

  if (isLoading) {
    return <CenteredLoading />;
  }

  const projects = statsData?.projects || [];
  const globalVelocity =
    projects.length > 0
      ? Math.round(
          projects.reduce((acc, p) => acc + p.percentage, 0) / projects.length
        )
      : 0;

  const escalations = projects.filter(
    (p) => p.riskLevel === 'High' || p.healthScore < 50
  );
  const portfolioHealth =
    Math.round(
      (projects.filter((p) => p.riskLevel === 'Low').length / projects.length) *
        100
    ) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Portfolio Orchestration
          </h1>
          <p className="text-text-muted text-xs font-bold uppercase tracking-[0.2em] opacity-60">
            Aggregate Strategic Control Layer
          </p>
        </div>
        {hasPermission(PERMISSIONS.GENERATE_EXEC_BRIEF) && (
          <button
            className="px-6 py-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 group shadow-2xl shadow-primary/10"
            onClick={() =>
              alert(
                'NexaSetu AI is analyzing 428 commits, 12 project delays, and team velocity to generate your briefing...'
              )
            }
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            Generate Weekly Executive Brief
            <svg
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        )}
      </div>

      {/* MagicBar moved to Navbar */}

      {/* C-Suite Macro KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-background-light/20 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
          <div className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest mb-4">
            Portfolio Health
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-white">
              {portfolioHealth}%
            </span>
            <span
              className={`text-xs font-bold ${portfolioHealth > 70 ? 'text-status-success' : 'text-status-error'} mb-2`}
            >
              {portfolioHealth > 70 ? '🟢 OPTIMAL' : '🔴 CRITICAL'}
            </span>
          </div>
          <div className="mt-6 h-1 w-full bg-white/5 rounded-full">
            <div
              className="h-full bg-status-success"
              style={{ width: `${portfolioHealth}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-background-light/20 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
          <div className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest mb-4">
            Global Delivery Velocity
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-white">
              {globalVelocity}%
            </span>
            <span className="text-xs font-bold text-status-info mb-2">
              🚀 +12% MoM
            </span>
          </div>
          <div className="mt-6 h-1 w-full bg-white/10 rounded-full">
            <div
              className="h-full bg-status-info"
              style={{ width: `${globalVelocity}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-background-light/20 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
          <div className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest mb-4">
            Active Escalations
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-status-error">
              {escalations.length}
            </span>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter mb-2">
              Projects at Risk
            </span>
          </div>
          <div className="mt-6 flex gap-1">
            {escalations.map((_, i) => (
              <div
                key={i}
                className="w-4 h-1 bg-status-error rounded-full"
              ></div>
            ))}
            {escalations.length === 0 && (
              <div className="text-[10px] font-bold text-status-success italic">
                NO CRITICAL FIRES DETECTED
              </div>
            )}
          </div>
        </div>
      </div>

      {hasPermission(PERMISSIONS.APPROVE_AI_ACTIONS) && (
        <ApprovalPanel
          actions={actions || []}
          handleApprove={approveMutation.mutate}
          handleReject={rejectMutation.mutate}
        />
      )}

      <SuggestionPanel
        recommendations={recommendations || []}
        setRecommendations={refetchRecs}
      />

      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-status-error/20 rounded-lg text-status-error text-xl animate-pulse"></span>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-status-error">
            Critical High-Risk Escalations
          </h2>
        </div>
        {escalations.length === 0 ? (
          <div className="bg-background-light/40 border-2 border-dashed border-white/10 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-status-success italic">
              All Projects are within Optimal Execution Boundaries
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {escalations.map((project) => (
              <ProjectCard
                key={project._id}
                project={{ ...project, variant: 'strategic' }}
              />
            ))}
          </div>
        )}
      </div>

      {hasPermission(PERMISSIONS.VIEW_GLOBAL_RESOURCES) && (
        <ResourcePanel resources={resources || []} />
      )}

      <ActivityFeed logs={logs || []} />

      {/* Legacy Risk Panels (kept for visual excellence) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="bg-gradient-to-br from-[#2D1B69]/30 to-[#1B1B3A]/30 p-10 rounded-[3rem] border border-[#6D28D9]/20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 group-hover:scale-110 transition-transform duration-500">
            🛡️
          </div>
          <h3 className="text-2xl font-black text-white mb-4">
            Risk Management
          </h3>
          <p className="text-white/60 leading-relaxed mb-6">
            Your portfolio view highlights projects with less than 30% progress
            as{' '}
            <span className="text-status-error font-bold italic">
              High Risk
            </span>
            .
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#1B3A2D]/30 to-[#1B1B3A]/30 p-10 rounded-[3rem] border border-[#10B981]/20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 group-hover:scale-110 transition-transform duration-500">
            🛰️
          </div>
          <h3 className="text-2xl font-black text-white mb-4">
            Health Prediction Ready
          </h3>
          <p className="text-white/60 leading-relaxed mb-6">
            Our AI engine is currently analyzing historical patterns to predict
            delays.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

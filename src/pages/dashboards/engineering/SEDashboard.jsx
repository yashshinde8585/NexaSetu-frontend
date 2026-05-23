import React from 'react';
import {
  Package,
  Clock,
  ShieldAlert,
  Flame,
  GitPullRequest,
  CheckCircle2,
  Bug,
  Activity,
  Zap,
  Users,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Shield,
  FileText,
  Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import taskApi from '../../../api/taskApi';
import CenteredLoading from '../../../components/atoms/CenteredLoading';
import DashboardSection from '../../../components/molecules/dashboard/DashboardSection';
import StatusBadge from '../../../components/molecules/dashboard/StatusBadge';
import MetricStripItem from '../../../components/molecules/dashboard/MetricStripItem';
import ActivityItem from '../../../components/molecules/dashboard/ActivityItem';

const SEDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useRoleDashboard('se');

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await taskApi.updateTaskStatus(taskId, status);
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'se'] });
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  const handleToggleBlock = async (taskId, blocked) => {
    try {
      await taskApi.toggleTaskBlockage(taskId, blocked);
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'se'] });
    } catch (err) {
      console.error('Toggle block failed:', err);
    }
  };

  if (isLoading) return <CenteredLoading />;

  const {
    executionMetrics = {
      tasksAssigned: 0,
      dueToday: 0,
      blocked: 0,
      highPriority: 0,
      pendingReviews: 0,
    },
    workQueue = [],
    myBlockers = [],
    moduleOwnership = [],
    prStatus = { pendingReviews: 0, stalePR: null },
    myBugs = [],
    teamSupport = [],
    activity = { commitsToday: 0, filesChanged: 0, prsMerged: 0 },
  } = data || {};

  return (
    <div className="min-h-screen bg-background text-text p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      {/* 1. Tactical Execution Strip */}
      <div
        id="se-metrics-strip"
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <MetricStripItem
          label="Assigned Load"
          value={executionMetrics.tasksAssigned}
          icon={<Package size={14} />}
          accent="bg-primary"
        />
        <MetricStripItem
          label="Due Today"
          value={executionMetrics.dueToday}
          icon={<Clock size={14} />}
          color={
            executionMetrics.dueToday > 0
              ? 'text-status-warning'
              : 'text-white/40'
          }
          accent={
            executionMetrics.dueToday > 0 ? 'bg-status-warning' : 'bg-white/5'
          }
        />
        <MetricStripItem
          label="Blocked Nodes"
          value={executionMetrics.blocked}
          icon={<ShieldAlert size={14} />}
          color={
            executionMetrics.blocked > 0 ? 'text-status-error' : 'text-white/40'
          }
          accent={
            executionMetrics.blocked > 0 ? 'bg-status-error' : 'bg-white/5'
          }
        />
        <MetricStripItem
          label="High Priority"
          value={executionMetrics.highPriority}
          icon={<Flame size={14} />}
          color="text-status-error"
          accent="bg-status-error"
        />
        <MetricStripItem
          label="PR Reviews"
          value={executionMetrics.pendingReviews}
          icon={<GitPullRequest size={14} />}
          accent="bg-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Primary Work Queue */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <DashboardSection
            title="Execution Queue"
            icon={<Activity size={14} />}
          >
            <div className="overflow-x-auto py-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] text-white/40 uppercase font-black tracking-[0.2em] border-b border-white/5">
                    <th className="pb-3 px-4">ASSIGNED_OBJECTIVE</th>
                    <th className="pb-3 px-4 text-center">PRIORITY</th>
                    <th className="pb-3 px-4">TEMPORAL_LIMIT</th>
                    <th className="pb-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02] text-[10px] font-black uppercase tracking-widest">
                  {workQueue?.map((task, idx) => (
                    <tr
                      key={idx}
                      className="group hover:bg-white/[0.015] transition-colors cursor-pointer"
                      onClick={() => task.id && navigate(`/task/${task.id}`)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {task.blocked && (
                            <ShieldAlert
                              size={12}
                              className="text-status-error animate-pulse shrink-0"
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="text-white group-hover:text-primary transition-colors">
                              {task.title}
                            </span>
                            {task.priority === 'urgent' && (
                              <span className="text-[6px] text-status-error font-black">
                                IMMEDIATE_ATTENTION_REQUIRED
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${
                            task.priority === 'urgent'
                              ? 'border-status-error/40 text-status-error bg-status-error/5'
                              : task.priority === 'high'
                                ? 'border-status-warning/40 text-status-warning bg-status-warning/5'
                                : 'border-white/10 text-white/40'
                          }`}
                        >
                          {task.priority || 'NORMAL'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[9px] font-black tracking-[0.2em] ${task.isOverdue ? 'text-status-error' : 'text-white/40'}`}
                        >
                          {task.due}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {task.status === 'todo' && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(task.id, 'in_progress')
                              }
                              className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[7px] text-primary hover:bg-primary/20 transition-colors"
                            >
                              START
                            </button>
                          )}
                          {task.status === 'in_progress' && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(task.id, 'in_review')
                              }
                              className="px-2 py-1 bg-status-warning/10 border border-status-warning/20 rounded text-[7px] text-status-warning hover:bg-status-warning/20 transition-colors"
                            >
                              REVIEW
                            </button>
                          )}
                          <button
                            onClick={() =>
                              task.id && navigate(`/task/${task.id}`)
                            }
                            className="p-1.5 bg-white/5 border border-white/10 rounded hover:border-primary/40 hover:bg-white/10 transition-colors text-white/40"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>

          <DashboardSection
            title="Peer Support Directives"
            icon={<Users size={14} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
              {teamSupport?.map((help, idx) => (
                <div
                  key={idx}
                  onClick={() => help.id && navigate(`/task/${help.id}`)}
                  className="p-4 bg-white/5 border border-white/10 rounded flex flex-col gap-3 hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-primary px-2 py-0.5 bg-primary/10 border border-primary/20 rounded uppercase tracking-[0.2em]">
                      {help.teamMember}
                    </span>
                    <Sparkles
                      size={12}
                      className="text-white/10 group-hover:text-status-warning/60 transition-colors"
                    />
                  </div>
                  <p className="text-[9px] font-black text-white uppercase leading-snug tracking-widest line-clamp-2">
                    {help.issue}
                  </p>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[7px] text-white/20 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <MessageSquare size={10} /> {help.reason}
                    </span>
                    <ChevronRight
                      size={12}
                      className="text-white/10 group-hover:text-primary transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>

        {/* 3. Sidebar: Stability & Review */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <DashboardSection
            title="Operational Blockers"
            icon={<ShieldAlert size={14} />}
          >
            <div className="flex flex-col gap-2 py-2">
              {myBlockers?.map((block, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-status-error/5 border border-status-error/20 rounded group hover:border-status-error/40 transition-colors flex flex-col gap-2 cursor-pointer"
                  onClick={() => block.id && navigate(`/task/${block.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <span className="block text-[10px] font-black text-white uppercase tracking-widest leading-tight">
                      {block.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBlock(block.id, false);
                      }}
                      className="text-[7px] font-black text-status-success uppercase tracking-widest px-1.5 py-0.5 border border-status-success/20 rounded hover:bg-status-success/10"
                    >
                      RESOLVE
                    </button>
                  </div>
                  <span className="block text-[8px] text-status-error/60 uppercase tracking-[0.2em] font-black flex items-center gap-2">
                    <Clock size={10} /> WAITING_ON: {block.waitingOn}
                  </span>
                </div>
              ))}
              {!myBlockers?.length && (
                <div className="py-8 text-center text-[9px] text-white/10 uppercase font-black tracking-[0.2em] italic">
                  ZERO_BLOCKADE_STATE
                </div>
              )}
            </div>
          </DashboardSection>

          <DashboardSection
            title="Review Status"
            icon={<GitPullRequest size={14} />}
          >
            <div className="flex flex-col gap-2 py-2">
              <div
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded group hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => navigate('/my-tasks')}
              >
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                  ACTIVE_REQUESTS
                </span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 font-black rounded text-[9px] tracking-[0.2em]">
                  {prStatus?.pendingReviews}
                </span>
              </div>
              {prStatus?.stalePR && (
                <div
                  className="p-4 bg-status-warning/5 border border-status-warning/20 rounded group hover:border-status-warning/60 transition-colors cursor-pointer"
                  onClick={() =>
                    prStatus.stalePR.id &&
                    navigate(`/task/${prStatus.stalePR.id}`)
                  }
                >
                  <span className="block text-[10px] font-black text-white uppercase tracking-widest leading-tight group-hover:text-status-warning transition-colors">
                    {prStatus.stalePR.title}
                  </span>
                  <span className="block text-[8px] text-status-warning/60 uppercase tracking-[0.2em] font-black mt-2 flex items-center gap-2 italic">
                    STALE_T: {prStatus.stalePR.pendingDays} DAYS_INACTIVE
                  </span>
                </div>
              )}
            </div>
          </DashboardSection>

          <DashboardSection title="Sync Integrity" icon={<Target size={14} />}>
            <div className="flex items-center justify-around py-4 mt-2 bg-white/5 rounded border border-white/10">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-white tracking-widest">
                  {activity.commitsToday}
                </span>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                  COMMITS
                </span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-white tracking-widest">
                  {activity.filesChanged}
                </span>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                  CHANGES
                </span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-white tracking-widest">
                  {activity.prsMerged}
                </span>
                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                  MERGED
                </span>
              </div>
            </div>
          </DashboardSection>
        </div>
      </div>

      {/* 4. Domain Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <DashboardSection
            title="Domain Stability"
            icon={<Shield size={14} />}
          >
            <div className="flex flex-col gap-2 py-2">
              {moduleOwnership?.map((module, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded group hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => module.id && navigate(`/service/${module.id}`)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">
                      {module.name}
                    </span>
                    <span
                      className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                        module.status === 'healthy'
                          ? 'text-status-success/60'
                          : 'text-status-error/60'
                      }`}
                    >
                      INTEGRITY: {module.health}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={module.status === 'healthy' ? 'success' : 'error'}
                    />
                    <ExternalLink
                      size={12}
                      className="text-white/10 group-hover:text-white/40"
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-8">
          <DashboardSection
            title="Structural Defect Queue"
            icon={<Bug size={14} />}
          >
            <div className="flex flex-col gap-2 py-2">
              {myBugs?.map((bug, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded group hover:border-status-error/40 transition-colors cursor-pointer"
                  onClick={() => bug.id && navigate(`/task/${bug.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded border ${bug.severity === 'urgent' ? 'border-status-error/40 text-status-error bg-status-error/5' : 'border-status-warning/40 text-status-warning bg-status-warning/5'}`}
                    >
                      <AlertCircle
                        size={12}
                        className={
                          bug.severity === 'urgent' ? 'animate-pulse' : ''
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-status-error transition-colors leading-none mb-1">
                        {bug.issue}
                      </span>
                      <span className="text-[8px] text-white/40 uppercase font-black tracking-[0.2em] leading-none">
                        {bug.severity} SEVERITY
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={bug.status} />
                    <ExternalLink
                      size={12}
                      className="text-white/10 group-hover:text-white/40 transition-colors"
                    />
                  </div>
                </div>
              ))}
              {!myBugs?.length && (
                <div className="py-8 text-center text-[9px] text-white/10 uppercase font-black tracking-[0.2em] italic">
                  ZERO_DEFECT_ENVIRONMENT
                </div>
              )}
            </div>
          </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default SEDashboard;

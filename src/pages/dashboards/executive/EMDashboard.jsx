import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  Shield,
  Users,
  Flame,
  Target,
  Zap,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  ShieldAlert,
  Layers,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import DashboardSection from '../../../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../../../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../../../components/molecules/dashboard/StatusBadge';
import PipelineStep from '../../../components/molecules/dashboard/PipelineStep';
import CenteredLoading from '../../../components/atoms/CenteredLoading';
import { ROUTES } from '../../../constants';
import DashboardService from '../../../api/dashboardApi';
import { useQueryClient } from '@tanstack/react-query';

const EMDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useRoleDashboard('em');
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = React.useState(false);

  if (isLoading || !data) return <CenteredLoading />;

  if (error)
    return (
      <div className="p-12 text-status-error bg-background min-h-screen font-mono font-bold uppercase text-center flex items-center justify-center border border-status-error/20">
        {error?.message || 'CRITICAL_ERROR: SYSTEM_DATA_UNAVAILABLE'}
      </div>
    );

  const sprintControl = data?.sprintControl || {
    progress: 0,
    delayRisk: 'UNKNOWN',
    blockedTasks: 0,
    teamLoad: 0,
    tasksDueToday: 0,
  };
  const taskBoard = Array.isArray(data?.taskBoard) ? data.taskBoard : [];
  const blockers = Array.isArray(data?.blockers) ? data.blockers : [];
  const teamWorkload = Array.isArray(data?.teamWorkload)
    ? data.teamWorkload
    : [];
  const burndown = data?.burndown || {
    planned: 0,
    completed: 0,
    daysLeft: 0,
    remaining: 0,
  };
  const distribution = data?.distribution || {
    backend: 0,
    frontend: 0,
    qa: 0,
    other: 0,
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      console.log('SYNC_SEQUENCE_INITIATED');
      await DashboardService.recalculateDashboard('em');
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'em'] });
    } catch (err) {
      console.error('SYNC_FAILED', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      {/* 1. Global Performance metrics */}
      <div
        id="em-performance-strip"
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <MetricStripItem
          icon={<TrendingUp size={14} />}
          label="Sprint Progress"
          value={`${sprintControl.progress}%`}
          accent="bg-primary"
        />
        <MetricStripItem
          icon={<Clock size={14} />}
          label="Delay Risk"
          value={sprintControl.delayRisk}
          color={
            sprintControl.delayRisk === 'HIGH'
              ? 'text-status-error'
              : sprintControl.delayRisk === 'MEDIUM'
                ? 'text-status-warning'
                : 'text-status-success'
          }
          accent={
            sprintControl.delayRisk === 'HIGH'
              ? 'bg-status-error'
              : 'bg-status-warning'
          }
        />
        <MetricStripItem
          icon={<ShieldAlert size={14} />}
          label="Blocked Tasks"
          value={sprintControl.blockedTasks}
          color={
            sprintControl.blockedTasks > 0
              ? 'text-status-error'
              : 'text-white/40'
          }
          accent="bg-status-error"
        />
        <MetricStripItem
          icon={<Users size={14} />}
          label="Team Load"
          value={`${sprintControl.teamLoad}%`}
          color={
            sprintControl.teamLoad > 100
              ? 'text-status-error'
              : sprintControl.teamLoad > 85
                ? 'text-status-warning'
                : 'text-primary'
          }
          accent="bg-primary"
        />
        <MetricStripItem
          icon={<Flame size={14} />}
          label="Due Today"
          value={sprintControl.tasksDueToday}
          color={
            sprintControl.tasksDueToday > 0
              ? 'text-status-warning'
              : 'text-white/40'
          }
          accent="bg-status-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Main Column: Sprint Task Board */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <DashboardSection
            title="Sprint Task Board"
            icon={<Target size={14} />}
          >
            <div className="overflow-x-auto py-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] text-white/40 uppercase font-black tracking-[0.2em] border-b border-white/5">
                    <th className="pb-3 px-4">TASK_TITLE</th>
                    <th className="pb-3 px-4">OWNER</th>
                    <th className="pb-3 px-4 text-center">STATUS</th>
                    <th className="pb-3 px-4 text-center">DUE</th>
                    <th className="pb-3 px-4 text-right">PRIORITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02] text-[10px] font-black uppercase tracking-widest">
                  {taskBoard.map((task, i) => (
                    <tr
                      key={i}
                      className="group hover:bg-white/[0.015] transition-all cursor-pointer"
                      onClick={() => navigate(ROUTES.TASK_DETAIL(task.id))}
                    >
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white group-hover:text-primary transition-colors">
                              {task.title}
                            </span>
                            <ExternalLink
                              size={10}
                              className="text-white/0 group-hover:text-primary/40 transition-all"
                            />
                          </div>
                          {task.blocked && (
                            <span className="text-[8px] text-status-error tracking-[0.2em]">
                              BLOCKED
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/40">{task.owner}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">
                          <StatusBadge status={task.status} />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded border text-[8px] font-black tracking-[0.2em] ${getDueColor(task.due)}`}
                        >
                          {task.due}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={getPriorityTextColor(task.priority)}>
                          {task.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {taskBoard.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-white/10 italic">
                          <Package size={32} />
                          <span className="text-[9px] uppercase font-black tracking-[0.2em]">
                            NO_ACTIVE_TASKS
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DashboardSection>

          <DashboardSection title="Team Workload" icon={<Users size={14} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              {teamWorkload.map((member, i) => (
                <div
                  key={i}
                  onClick={() =>
                    navigate(`${ROUTES.MY_TASKS}?userId=${member.id}`)
                  }
                  className={`bg-white/5 border p-4 rounded flex flex-col gap-4 group hover:bg-white/10 transition-all cursor-pointer border-l-2 ${(member.loadV2 ?? member.load) > 90 ? 'border-status-error border-l-status-error animate-pulse' : 'border-white/10 border-l-white/20'}`}
                >
                  <div className="flex justify-between items-center leading-none">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-white font-black uppercase tracking-widest group-hover:text-primary transition-colors">
                        {member.member}
                      </span>
                      {(member.loadV2 ?? member.load) > 90 && (
                        <span className="text-[7px] text-status-error font-black uppercase tracking-tighter">
                          CRITICAL_OVERLOAD
                        </span>
                      )}
                    </div>
                    <div
                      className={`w-1.5 h-1.5 rounded-sm ${member.status === 'red' ? 'bg-status-error' : member.status === 'yellow' ? 'bg-status-warning' : 'bg-status-success'}`}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end text-[8px] uppercase font-black tracking-[0.2em]">
                      <span className="text-white/40">OPERATIONAL_LOAD</span>
                      <span
                        className={
                          (member.loadV2 ?? member.load) > 90
                            ? 'text-status-error'
                            : 'text-white/60'
                        }
                      >
                        {member.loadV2 ?? member.load}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full ${(member.loadV2 ?? member.load) > 90 ? 'bg-status-error' : (member.loadV2 ?? member.load) > 70 ? 'bg-status-warning' : 'bg-primary'} transition-all duration-1000`}
                        style={{
                          width: `${Math.min(member.loadV2 ?? member.load, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>

        {/* 3. Sidebar Column: Sprint Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <DashboardSection
            title="Sprint Burndown"
            icon={<BarChart3 size={14} />}
          >
            <div className="flex flex-col gap-px bg-white/10 border border-white/10 rounded overflow-hidden mt-2">
              <div className="grid grid-cols-2 gap-px bg-white/10">
                <div className="bg-black p-4 flex flex-col items-center gap-2 group hover:bg-white/[0.02] transition-colors">
                  <span className="text-[8px] text-white/40 uppercase font-black tracking-[0.2em]">
                    PLANNED_TASKS
                  </span>
                  <span className="text-2xl font-black text-white tracking-widest">
                    {burndown.planned}
                  </span>
                </div>
                <div className="bg-black p-4 flex flex-col items-center gap-2 group hover:bg-white/[0.02] transition-colors">
                  <span className="text-[8px] text-status-success/60 uppercase font-black tracking-[0.2em]">
                    COMPLETED
                  </span>
                  <span className="text-2xl font-black text-status-success tracking-widest">
                    {burndown.completed}
                  </span>
                </div>
              </div>

              <div className="bg-black p-4 flex justify-between items-center group hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-white/40 uppercase font-black tracking-[0.2em]">
                    DAYS_LEFT
                  </span>
                  <span className="text-xl font-black text-status-warning tracking-widest uppercase">
                    {burndown.daysLeft} DAYS
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[8px] text-white/40 uppercase font-black tracking-[0.2em]">
                    REMAINING
                  </span>
                  <span className="text-[12px] font-black text-white tracking-widest uppercase">
                    {burndown.remaining} TASKS
                  </span>
                </div>
              </div>
            </div>
          </DashboardSection>

          <DashboardSection
            title="Active Blockers"
            icon={<ShieldAlert size={14} />}
          >
            <div className="flex flex-col gap-2 pt-2">
              {blockers.map((blocker, i) => (
                <div
                  key={i}
                  className="p-4 bg-status-error/5 border border-status-error/20 rounded flex flex-col gap-2 group hover:border-status-error/40 transition-colors cursor-pointer"
                  onClick={() => navigate(ROUTES.TASK_DETAIL(blocker.id))}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={12} className="text-status-error" />
                    <span className="text-white text-[10px] font-black uppercase tracking-widest group-hover:text-status-error transition-colors truncate">
                      {blocker.title}
                    </span>
                  </div>
                  <span className="text-[8px] text-white/40 uppercase font-black tracking-[0.2em] pl-5 italic truncate">
                    REASON: {blocker.reason}
                  </span>
                </div>
              ))}
              {blockers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-20 border border-white/10 border-dashed rounded">
                  <Shield size={32} className="mb-2" />
                  <span className="text-[9px] uppercase font-black tracking-[0.2em]">
                    NO_ACTIVE_BLOCKERS
                  </span>
                </div>
              )}
            </div>
          </DashboardSection>

          <DashboardSection
            title="Workload Distribution"
            icon={<Layers size={14} />}
          >
            <div className="flex flex-col gap-8 py-4 px-2">
              <DistributionBar
                label="Backend"
                value={distribution.backend}
                total={
                  distribution.backend +
                  distribution.frontend +
                  distribution.qa +
                  distribution.other
                }
                color="bg-primary"
              />
              <DistributionBar
                label="Frontend"
                value={distribution.frontend}
                total={
                  distribution.backend +
                  distribution.frontend +
                  distribution.qa +
                  distribution.other
                }
                color="bg-status-warning"
              />
              <DistributionBar
                label="QA"
                value={distribution.qa}
                total={
                  distribution.backend +
                  distribution.frontend +
                  distribution.qa +
                  distribution.other
                }
                color="bg-status-success"
              />
            </div>
          </DashboardSection>
        </div>
      </div>

      {/* Global Sync Overlay - Only shown if risk is high or blockers exist */}
      {(sprintControl.delayRisk === 'HIGH' ||
        sprintControl.blockedTasks > 0) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="bg-black border border-white/10 p-4 rounded flex items-center justify-between shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded border border-status-warning/20 flex items-center justify-center text-status-warning bg-status-warning/10">
                <Zap size={20} fill="currentColor" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest italic leading-none">
                  PROJECT_SYNC_REQUIRED
                </h4>
                <p className="text-[8px] text-white/40 uppercase font-black tracking-[0.2em]">
                  MITIGATE {sprintControl.delayRisk} RISK_PROTOCOL
                </p>
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`flex items-center gap-3 bg-white text-black font-black uppercase text-[9px] px-6 py-2 rounded hover:bg-primary transition-colors tracking-widest group ${isSyncing ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isSyncing ? 'SYNCING...' : 'SYNC'}{' '}
              <ArrowRight
                size={14}
                className={`${isSyncing ? '' : 'group-hover:translate-x-1'} transition-transform`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DistributionBar = ({ label, value, total, color }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end text-[8px] font-black uppercase tracking-[0.2em] leading-none">
        <span className="text-white/20">{label}</span>
        <span className="text-white/60">{percent}%</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const getPriorityTextColor = (p) => {
  switch (p?.toLowerCase()) {
    case 'urgent':
      return 'text-status-error';
    case 'high':
      return 'text-status-warning';
    case 'medium':
      return 'text-primary';
    case 'low':
      return 'text-white/40';
    default:
      return 'text-white/20';
  }
};

const getDueColor = (due) => {
  if (due === 'Today' || due === 'Overdue')
    return 'text-status-error border-status-error/30 bg-status-error/5';
  if (due === 'Tomorrow')
    return 'text-status-warning border-status-warning/30 bg-status-warning/5';
  return 'text-white/20 border-white/5 bg-white/5';
};

export default EMDashboard;

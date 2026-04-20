import React from 'react';
import { 
  Package, Clock, Shield, Users, Flame, Target, Activity, Zap, 
  AlertTriangle, ArrowRight, TrendingUp, BarChart3, ShieldAlert,
  Layers, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import PipelineStep from '../components/molecules/dashboard/PipelineStep';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';
import CenteredLoading from '../components/atoms/CenteredLoading';

/**
 * Engineering Manager Dashboard
 * Focused on team metrics, sprint velocity, and operational blockers.
 */
const EMDashboard = () => {
  const { data, isLoading, error } = useRoleDashboard('em');

  if (isLoading || !data) return <CenteredLoading />;

  if (error) return (
    <div className="p-12 text-status-error bg-black min-h-screen font-mono font-bold uppercase text-center flex items-center justify-center border border-status-error/20">
      {error?.message || 'CRITICAL_ERROR: SYSTEM_DATA_UNAVAILABLE'}
    </div>
  );

  const { 
    sprintControl = { progress: 0, delayRisk: 'UNKNOWN', blockedTasks: 0, teamLoad: 0, tasksDueToday: 0 }, 
    taskBoard = [], 
    blockers = [], 
    teamWorkload = [], 
    burndown = { planned: 0, completed: 0, daysLeft: 0, remaining: 0 }, 
    activity = [], 
    distribution = { backend: 0, frontend: 0, qa: 0, other: 0 } 
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1700px] mx-auto flex flex-col gap-12">
      
      {/* 1. Global Performance metrics */}
      <div id="em-performance-strip" className="grid grid-cols-2 lg:grid-cols-5 gap-6">
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
          color={sprintControl.delayRisk === 'HIGH' ? 'text-status-error' : sprintControl.delayRisk === 'MEDIUM' ? 'text-status-warning' : 'text-status-success'}
          accent={sprintControl.delayRisk === 'HIGH' ? 'bg-status-error' : 'bg-status-warning'}
        />
        <MetricStripItem 
          icon={<ShieldAlert size={14} />} 
          label="Blocked Tasks" 
          value={sprintControl.blockedTasks} 
          color={sprintControl.blockedTasks > 0 ? 'text-status-error' : 'text-white/40'}
          accent="bg-status-error"
        />
        <MetricStripItem 
          icon={<Users size={14} />} 
          label="Team Load" 
          value={`${sprintControl.teamLoad}%`} 
          color={sprintControl.teamLoad > 100 ? 'text-status-error' : sprintControl.teamLoad > 85 ? 'text-status-warning' : 'text-primary'}
          accent="bg-primary"
        />
        <MetricStripItem 
          icon={<Flame size={14} />} 
          label="Due Today" 
          value={sprintControl.tasksDueToday} 
          color={sprintControl.tasksDueToday > 0 ? 'text-status-warning' : 'text-white/40'}
          accent="bg-status-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 2. Main Column: Sprint Task Board */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          <DashboardSection title="Sprint Task Board" icon={<Target size={14} />}>
            <div className="overflow-x-auto py-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-white/30 uppercase font-bold tracking-widest border-b border-white/5">
                    <th className="pb-4 px-2">Task Title</th>
                    <th className="pb-4 px-2">Owner</th>
                    <th className="pb-4 px-2 text-center">Status</th>
                    <th className="pb-4 px-2 text-center">Due</th>
                    <th className="pb-4 px-2 text-right">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {taskBoard.map((task, i) => (
                    <tr key={i} className="group hover:bg-white/[0.015] transition-all">
                      <td className="py-4 px-2">
                        <div className="flex flex-col gap-1 pr-4">
                           <span className="text-[12px] font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">{task.title}</span>
                           {task.blocked && (
                             <span className="text-[8px] text-status-error font-bold uppercase tracking-widest leading-none">BLOCKED</span>
                           )}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest tabular-nums">{task.owner}</td>
                      <td className="py-4 px-2 text-center">
                        <div className="flex justify-center">
                           <StatusBadge status={task.status} text={task.status} mini />
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest leading-none ${getDueColor(task.due)}`}>{task.due}</span>
                      </td>
                      <td className="py-4 px-2 text-right">
                         <span className={`text-[10px] font-bold tracking-widest uppercase ${getPriorityTextColor(task.priority)}`}>
                            {task.priority}
                         </span>
                      </td>
                    </tr>
                  ))}
                  {taskBoard.length === 0 && (
                     <tr>
                        <td colSpan={5} className="py-24 text-center">
                           <div className="flex flex-col items-center gap-4 text-white/10 italic">
                             <Package size={48} className="mb-2" />
                             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">No active tasks found in the current sprint.</span>
                           </div>
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DashboardSection>

          <DashboardSection title="Team Workload" icon={<Users size={14} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
              {teamWorkload.map((member, i) => (
                <div key={i} className="bg-white/[0.015] border border-white/5 p-6 rounded flex flex-col gap-5 group hover:border-white/20 transition-all border-l-2 border-l-white/10">
                  <div className="flex justify-between items-center leading-none">
                    <span className="text-[12px] text-white font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{member.member}</span>
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(var(--color-status),0.5)] ${member.status === 'red' ? 'bg-status-error' : member.status === 'yellow' ? 'bg-status-warning' : 'bg-status-success'}`}></div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end text-[9px] uppercase font-bold tracking-widest leading-none">
                      <span className="text-white/20">Operational Load</span>
                      <span className={member.load > 100 ? 'text-status-error' : 'text-white/40'}>{member.load}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full ${member.load > 100 ? 'bg-status-error' : member.load > 85 ? 'bg-status-warning' : 'bg-primary'} transition-all duration-1000`} 
                        style={{ width: `${Math.min(member.load, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>

        {/* 3. Sidebar Column: Sprint Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-12">
          <DashboardSection title="Sprint Burndown" icon={<BarChart3 size={14} />}>
             <div className="flex flex-col gap-px bg-white/10 border border-white/10 rounded overflow-hidden mt-2">
                <div className="grid grid-cols-2 gap-px bg-white/10">
                  <div className="bg-black p-8 flex flex-col items-center gap-3 group hover:bg-white/[0.02] transition-all">
                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest leading-none">Planned Tasks</span>
                    <span className="text-4xl font-bold text-white tabular-nums tracking-tighter">{burndown.planned}</span>
                  </div>
                  <div className="bg-black p-8 flex flex-col items-center gap-3 group hover:bg-white/[0.02] transition-all">
                    <span className="text-[9px] text-status-success/30 uppercase font-bold tracking-widest leading-none">Completed</span>
                    <span className="text-4xl font-bold text-status-success tabular-nums tracking-tighter">{burndown.completed}</span>
                  </div>
                </div>

                <div className="bg-black p-8 flex justify-between items-center group hover:bg-white/[0.02] transition-all">
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest leading-none">Days Left</span>
                    <span className="text-3xl font-bold text-status-warning tabular-nums tracking-tighter leading-none">{burndown.daysLeft} DAYS</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest leading-none">Remaining</span>
                    <span className="text-xl font-bold text-white tabular-nums tracking-tighter leading-none">{burndown.remaining} TASKS</span>
                  </div>
                </div>
             </div>
          </DashboardSection>

          <DashboardSection title="Active Blockers" icon={<ShieldAlert size={14} />}>
            <div className="flex flex-col gap-4 py-2">
              {blockers.map((blocker, i) => (
                <div key={i} className="p-6 bg-status-error/[0.02] border border-status-error/10 rounded flex flex-col gap-3 group hover:border-status-error/40 transition-all">
                  <div className="flex items-center gap-3">
                     <AlertTriangle size={14} className="text-status-error" />
                     <span className="text-white text-[11px] font-bold uppercase tracking-tight leading-none">{blocker.title}</span>
                  </div>
                  <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest leading-normal pl-7 italic">Reason: {blocker.reason}</span>
                </div>
              ))}
              {blockers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center opacity-10 border border-white/5 border-dashed rounded">
                  <Shield size={48} className="mb-4" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">No active blockers.</span>
                </div>
              )}
            </div>
          </DashboardSection>

          <DashboardSection title="Workload Distribution" icon={<Layers size={14} />}>
            <div className="flex flex-col gap-8 py-4 px-2">
              <DistributionBar label="Backend" value={distribution.backend} total={distribution.backend + distribution.frontend + distribution.qa + distribution.other} color="bg-primary" />
              <DistributionBar label="Frontend" value={distribution.frontend} total={distribution.backend + distribution.frontend + distribution.qa + distribution.other} color="bg-status-warning" />
              <DistributionBar label="QA" value={distribution.qa} total={distribution.backend + distribution.frontend + distribution.qa + distribution.other} color="bg-status-success" />
            </div>
          </DashboardSection>

          <DashboardSection title="Recent Activity" icon={<Activity size={14} />}>
            <div className="space-y-px max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {activity.map((item, i) => (
                <ActivityItem key={i} text={item.text} time={item.time} mini />
              ))}
            </div>
          </DashboardSection>
        </div>
      </div>

      {/* Global Sync Overlay */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-8">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-8">
            <div className="w-12 h-12 rounded border border-status-warning/20 flex items-center justify-center text-status-warning bg-status-warning/5">
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-widest leading-none italic">Project Sync Required</h4>
              <p className="text-[10px] text-white/20 uppercase font-bold tracking-tight">Synchronize sprint operational parameters.</p>
            </div>
          </div>

          <button className="flex items-center gap-4 bg-white text-black font-bold uppercase text-[10px] px-8 py-3 rounded hover:bg-primary transition-all tracking-widest active:scale-95 group">
             Project Sync <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
};

const DistributionBar = ({ label, value, total, color }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-3">
       <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest leading-none">
          <span className="text-white/20">{label}</span>
          <span className="text-white/60 tabular-nums">{percent}%</span>
       </div>
       <div className="h-1.5 w-full bg-white/3 text-white bg-opacity-5 rounded-full overflow-hidden border border-white/5">
          <div 
            className={`h-full ${color} transition-all duration-1000 ease-out`} 
            style={{ width: `${percent}%` }}
          ></div>
       </div>
    </div>
  );
};

const getPriorityTextColor = (p) => {
  switch (p?.toLowerCase()) {
    case 'high': return 'text-status-error';
    case 'medium': return 'text-status-warning';
    case 'low': return 'text-primary';
    default: return 'text-white/20';
  }
};

const getDueColor = (due) => {
  if (due === 'Today' || due === 'Overdue') return 'text-status-error border-status-error/30 bg-status-error/5';
  if (due === 'Tomorrow') return 'text-status-warning border-status-warning/30 bg-status-warning/5';
  return 'text-white/20 border-white/5 bg-white/5';
};

export default EMDashboard;

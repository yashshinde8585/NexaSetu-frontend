import React from 'react';
import { 
  CheckCircle2, Clock, ShieldAlert, ArrowRightCircle, 
  MessageSquare, GitPullRequest, Calendar, ChevronRight, 
  Zap, Activity, User, Plus, ExternalLink, Target,
  FileCode, Layers
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';

/**
 * Software Engineering (SWE) Dashboard
 * Highly tactical interface focused on daily task execution, blockers, and sprint progress.
 */
const SWEDashboard = () => {
  const { data, isLoading } = useRoleDashboard('swe');

  if (isLoading) return <CenteredLoading />;

  const { 
    dayMetrics = { myTasks: 0, dueToday: 0, blocked: 0, remaining: 0 }, 
    myTasks = [], 
    blockers = [], 
    progress = { percentage: 0, completed: 0, total: 0 }, 
    whatsNext = [],
    prStats = { open: 0, merged: 0, pendingReview: 0 },
    activityFeed = [] 
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      
      {/* 1. Tactical Execution Strip */}
      <div id="swe-metrics-strip" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricStripItem 
            label="Assigned Directives" 
            value={dayMetrics.myTasks} 
            icon={<CheckCircle2 size={14} />} 
            accent="bg-primary" 
        />
        <MetricStripItem 
            label="Temporal Threshold (Today)" 
            value={dayMetrics.dueToday} 
            icon={<Clock size={14} />} 
            color={dayMetrics.dueToday > 0 ? 'text-status-warning' : 'text-white/40'} 
            accent={dayMetrics.dueToday > 0 ? 'bg-status-warning' : 'bg-white/5'}
        />
        <MetricStripItem 
            label="Operational Blockers" 
            value={dayMetrics.blocked} 
            icon={<ShieldAlert size={14} />} 
            color={dayMetrics.blocked > 0 ? 'text-status-error' : 'text-white/40'} 
            accent={dayMetrics.blocked > 0 ? 'bg-status-error' : 'bg-white/5'}
        />
        <MetricStripItem 
            label="Queue Latency" 
            value={dayMetrics.remaining} 
            icon={<ArrowRightCircle size={14} />} 
            accent="bg-white/5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Primary Execution Queue */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <DashboardSection title="Execution Queue" icon={<Activity size={14} />}>
              <div className="overflow-x-auto py-2">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="text-[9px] text-white/40 uppercase font-black tracking-[0.2em] border-b border-white/5">
                          <th className="pb-3 px-4">OBJECTIVE_IDENTIFIER</th>
                          <th className="pb-3 px-4 text-center">LIFECYCLE</th>
                          <th className="pb-3 px-4">TEMPORAL_LIMIT</th>
                          <th className="pb-3 px-4 text-right">COMMIT</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02] text-[10px] font-black uppercase tracking-widest">
                       {myTasks?.map((task, idx) => (
                         <tr key={idx} className="group hover:bg-white/[0.015] transition-colors">
                            <td className="py-3 px-4">
                               <div className="flex items-center gap-3">
                                  {task.blocked && <div className="w-1.5 h-1.5 rounded-none bg-status-error animate-pulse shrink-0" />}
                                  <span className={`text-white group-hover:text-primary transition-colors leading-none ${task.isOverdue ? 'text-status-error' : ''}`}>
                                     {task.title}
                                  </span>
                               </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                               <StatusBadge status={task.status} />
                            </td>
                            <td className="py-3 px-4">
                               <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                                 task.due === 'Today' ? 'text-status-warning' : 
                                 task.due === 'Overdue' ? 'text-status-error underline' : 'text-white/20'
                               }`}>
                                  {task.due}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                               <button className="p-1.5 bg-white/5 border border-white/10 rounded hover:border-primary/40 hover:bg-white/10 transition-colors text-white/40">
                                  <ExternalLink size={14} />
                               </button>
                            </td>
                         </tr>
                       ))}
                       {!myTasks?.length && (
                         <tr>
                           <td colSpan="4" className="py-12 text-center text-[9px] text-white/10 uppercase font-black tracking-[0.2em] italic">
                               ZERO_MISSION_PARAMETERS
                           </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </DashboardSection>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardSection title="Synchronized Updates" icon={<GitPullRequest size={14} />}>
                 <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 rounded overflow-hidden mt-2">
                    <div className="bg-black p-4 flex flex-col items-center justify-center gap-1 group hover:bg-white/[0.02] transition-colors">
                       <span className="text-2xl font-black text-primary tracking-widest leading-none">{prStats.open}</span>
                       <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20">ACTIVE</span>
                    </div>
                    <div className="bg-black p-4 flex flex-col items-center justify-center gap-1 group hover:bg-white/[0.02] transition-colors border-x border-white/10">
                       <span className="text-2xl font-black text-status-success tracking-widest leading-none">{prStats.merged}</span>
                       <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20">MERGED</span>
                    </div>
                    <div className="bg-black p-4 flex flex-col items-center justify-center gap-1 group hover:bg-white/[0.02] transition-colors">
                       <span className="text-2xl font-black text-status-warning tracking-widest leading-none">{prStats.pendingReview}</span>
                       <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20">REVIEW</span>
                    </div>
                 </div>
              </DashboardSection>

              <DashboardSection title="Tactical History" icon={<Activity size={14} />}>
                 <div className="flex flex-col gap-3 py-2">
                    {activityFeed?.slice(0, 4).map((item, idx) => (
                      <ActivityItem 
                         key={idx} 
                         icon={<Layers size={12} />} 
                         text={item.action} 
                         time={item.time} 
                         type="info"
                      />
                    ))}
                 </div>
              </DashboardSection>
           </div>
        </div>

        {/* 3. Sidebar: Blockades & Progress */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <DashboardSection title="Direct Blockades" icon={<ShieldAlert size={14} />}>
              <div className="flex flex-col gap-2 py-2">
                 {blockers?.map((b, idx) => (
                    <div key={idx} className="p-4 bg-status-error/5 border border-status-error/20 rounded group hover:border-status-error/40 transition-colors">
                       <span className="block text-[10px] font-black text-white uppercase tracking-widest mb-2 leading-tight group-hover:text-status-error transition-colors">{b.issue}</span>
                       <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[8px] text-white/20 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                             <User size={10} /> {b.contact}
                          </span>
                          <button className="text-[8px] font-black text-status-error uppercase tracking-[0.2em] hover:underline">CLEAR_REQ</button>
                       </div>
                    </div>
                 ))}
                 {!blockers?.length && (
                    <div className="py-8 text-center text-[9px] text-white/10 uppercase font-black tracking-[0.2em] italic">OPEN_CORRIDOR</div>
                 )}
              </div>
           </DashboardSection>

           <DashboardSection title="Sprint Fulfillment" icon={<Target size={14} />}>
              <div className="flex flex-col gap-4 py-4 px-5 bg-white/5 border border-white/10 rounded">
                 <div className="flex justify-between items-end leading-none">
                    <span className="text-4xl font-black text-white tracking-widest">{progress.percentage}%</span>
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em]">THRESHOLD</span>
                       <span className="text-[9px] font-black text-primary uppercase tracking-widest">{progress.completed} / {progress.total}</span>
                    </div>
                 </div>
                 <div className="w-full h-0.5 bg-white/5 rounded-none overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out" 
                      style={{ width: `${progress.percentage}%` }}
                    />
                 </div>
              </div>
           </DashboardSection>

           <DashboardSection title="Imminent Objective" icon={<ArrowRightCircle size={14} />}>
              <div className="p-4 bg-white/5 border border-primary/20 rounded group hover:border-primary/60 transition-colors flex flex-col gap-3">
                 <div className="flex justify-between items-center leading-none">
                    <span className="text-[8px] font-black uppercase text-primary tracking-[0.2em]">PRIORITY_ALPHA</span>
                    <CheckCircle2 size={12} className="text-primary/40" />
                 </div>
                 <span className="text-[11px] font-black text-white uppercase tracking-widest leading-tight group-hover:text-primary transition-colors">
                    {whatsNext?.[0]?.title || 'AWAITING_ASSIGNMENT'}
                 </span>
                 <button className="mt-2 w-full py-2 bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors active:scale-[0.98] rounded-none">
                    INITIALIZE_DIRECTIVE
                 </button>
              </div>
           </DashboardSection>

           <DashboardSection title="External Support" icon={<MessageSquare size={14} />}>
              <button className="w-full py-6 border-2 border-dashed border-white/10 rounded-none hover:bg-white/5 hover:border-white/20 transition-colors flex flex-col items-center gap-3 group">
                 <div className="w-8 h-8 rounded-none bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:border-primary/40 border border-white/10 transition-colors">
                    <MessageSquare size={14} />
                 </div>
                 <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-white transition-colors">INTERROGATE_LEAD</span>
              </button>
           </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default SWEDashboard;

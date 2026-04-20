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
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1600px] mx-auto flex flex-col gap-12">
      
      {/* 1. Tactical Execution Strip */}
      <div id="swe-metrics-strip" className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 2. Primary Execution Queue */}
        <div className="lg:col-span-8 flex flex-col gap-10">
           <DashboardSection title="Execution Queue" icon={<Activity size={14} />}>
              <div className="overflow-x-auto py-2">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="text-[10px] text-white/30 uppercase font-bold tracking-widest border-b border-white/5">
                          <th className="pb-4 px-2">Objective Identifier</th>
                          <th className="pb-4 px-2 text-center">Lifecycle</th>
                          <th className="pb-4 px-2">Temporal Limit</th>
                          <th className="pb-4 px-2 text-right">Commit</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                       {myTasks?.map((task, idx) => (
                         <tr key={idx} className="group hover:bg-white/[0.015] transition-all">
                            <td className="py-4 px-2">
                               <div className="flex items-center gap-3">
                                  {task.blocked && <div className="w-1.5 h-1.5 rounded-full bg-status-error animate-pulse shrink-0" />}
                                  <span className={`text-[12px] font-bold tracking-tight uppercase ${task.isOverdue ? 'text-status-error' : 'text-white'} group-hover:text-primary transition-colors leading-none`}>
                                     {task.title}
                                  </span>
                               </div>
                            </td>
                            <td className="py-4 px-2 text-center">
                               <StatusBadge status={task.status} mini />
                            </td>
                            <td className="py-4 px-2">
                               <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                 task.due === 'Today' ? 'text-status-warning' : 
                                 task.due === 'Overdue' ? 'text-status-error underline' : 'text-white/20'
                               }`}>
                                  {task.due}
                               </span>
                            </td>
                            <td className="py-4 px-2 text-right">
                               <button className="p-2 bg-white/[0.03] border border-white/10 rounded hover:border-primary/40 hover:bg-primary/10 transition-all text-white/20 hover:text-primary">
                                  <ExternalLink size={14} />
                               </button>
                            </td>
                         </tr>
                       ))}
                       {!myTasks?.length && (
                         <tr>
                           <td colSpan="4" className="py-12 text-center text-[10px] text-white/10 uppercase font-black tracking-widest italic">
                              Zero mission parameters defined.
                           </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </DashboardSection>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <DashboardSection title="Synchronized Updates" icon={<GitPullRequest size={14} />}>
                 <div className="grid grid-cols-3 gap-px bg-white/5 border border-white/10 rounded overflow-hidden mt-2">
                    <div className="bg-black p-6 flex flex-col items-center justify-center gap-1 group hover:bg-white/[0.02] transition-all">
                       <span className="text-3xl font-black text-primary tracking-tighter leading-none">{prStats.open}</span>
                       <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Active</span>
                    </div>
                    <div className="bg-black p-6 flex flex-col items-center justify-center gap-1 group hover:bg-white/[0.02] transition-all border-x border-white/5">
                       <span className="text-3xl font-black text-status-success tracking-tighter leading-none">{prStats.merged}</span>
                       <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Merged</span>
                    </div>
                    <div className="bg-black p-6 flex flex-col items-center justify-center gap-1 group hover:bg-white/[0.02] transition-all">
                       <span className="text-3xl font-black text-status-warning tracking-tighter leading-none">{prStats.pendingReview}</span>
                       <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Review</span>
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
        <div className="lg:col-span-4 flex flex-col gap-10">
           <DashboardSection title="Direct Blockades" icon={<ShieldAlert size={14} />}>
              <div className="flex flex-col gap-3 py-2">
                 {blockers?.map((b, idx) => (
                   <div key={idx} className="p-5 bg-white/[0.01] border border-status-error/20 rounded group hover:border-status-error/60 transition-all">
                      <span className="block text-[11px] font-bold text-white uppercase tracking-tight mb-3 leading-tight group-hover:text-status-error transition-colors">{b.issue}</span>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                         <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2">
                            <User size={10} /> {b.contact}
                         </span>
                         <button className="text-[9px] font-bold text-status-error uppercase tracking-widest hover:underline">Request Clear</button>
                      </div>
                   </div>
                 ))}
                 {!blockers?.length && (
                   <div className="py-8 text-center text-[10px] text-white/10 uppercase font-black tracking-widest italic">Open corridor state.</div>
                 )}
              </div>
           </DashboardSection>

           <DashboardSection title="Sprint Fulfillment" icon={<Target size={14} />}>
              <div className="flex flex-col gap-6 py-4 px-6 bg-white/[0.01] border border-white/5 rounded">
                 <div className="flex justify-between items-end leading-none">
                    <span className="text-5xl font-black text-white tracking-tighter tabular-nums">{progress.percentage}%</span>
                    <div className="flex flex-col items-end gap-1">
                       <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Integrity Threshold</span>
                       <span className="text-[10px] font-bold text-primary uppercase tracking-tight">{progress.completed} / {progress.total} Completed</span>
                    </div>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out" 
                      style={{ width: `${progress.percentage}%` }}
                    />
                 </div>
              </div>
           </DashboardSection>

           <DashboardSection title="Imminent Objective" icon={<ArrowRightCircle size={14} />}>
              <div className="p-6 bg-white/[0.02] border border-primary/20 rounded group hover:border-primary/60 transition-all flex flex-col gap-4">
                 <div className="flex justify-between items-center leading-none">
                    <span className="text-[9px] font-bold uppercase text-primary tracking-widest">Priority Alpha</span>
                    <CheckCircle2 size={14} className="text-primary/40" />
                 </div>
                 <span className="text-[13px] font-bold text-white uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                    {whatsNext?.[0]?.title || 'Awaiting assignment...'}
                 </span>
                 <button className="mt-2 w-full py-3 bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all active:scale-[0.98] rounded-sm">
                    Initialize Directive
                 </button>
              </div>
           </DashboardSection>

           <DashboardSection title="External Support" icon={<MessageSquare size={14} />}>
              <button className="w-full py-8 border-2 border-dashed border-white/5 rounded hover:bg-white/[0.02] hover:border-white/20 transition-all flex flex-col items-center gap-4 group">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:border-primary/40 border border-white/5 transition-all">
                    <MessageSquare size={16} />
                 </div>
                 <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">Interrogate Tech Lead</span>
              </button>
           </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default SWEDashboard;



export default SWEDashboard;

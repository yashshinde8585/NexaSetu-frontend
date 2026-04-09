import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ArrowRightCircle, 
  MessageSquare, 
  GitPullRequest,
  Calendar,
  ChevronRight,
  Zap,
  Activity,
  User,
  Plus
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';

const SWEDashboard = () => {
  const { data, isLoading } = useRoleDashboard('swe');

  if (isLoading) return <CenteredLoading />;

  const { 
    dayMetrics, 
    myTasks, 
    blockers, 
    progress, 
    whatsNext,
    prStats,
    activityFeed 
  } = data || {};

  return (
    <div className="p-6 bg-[#050505] min-h-screen text-text-main flex flex-col gap-6 font-sans">
      
      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricStripItem label="My Tasks" value={dayMetrics?.myTasks} icon={<CheckCircle2 size={18} />} accent="bg-primary/20" />
        <MetricStripItem label="Due Today" value={dayMetrics?.dueToday} icon={<Clock size={18} />} color={dayMetrics?.dueToday > 0 ? 'text-amber-500' : 'text-white/40'} />
        <MetricStripItem label="Blocked" value={dayMetrics?.blocked} icon={<ShieldAlert size={18} />} color={dayMetrics?.blocked > 0 ? 'text-rose-500' : 'text-white/40'} />
        <MetricStripItem label="Remaining" value={dayMetrics?.remaining} icon={<ArrowRightCircle size={18} />} />
      </div>

      {/* My Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
           <DashboardSection title="My Tasks" icon={<Activity size={16} />}>
              <div className="overflow-x-auto mt-4 px-2">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[10px] text-text-muted uppercase tracking-widest border-b border-white/5 pb-2">
                          <th className="font-black pb-3">Task</th>
                          <th className="font-black pb-3">Status</th>
                          <th className="font-black pb-3">Due</th>
                          <th className="font-black pb-3 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                       {myTasks?.map((task, idx) => (
                         <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-4">
                               <div className="flex items-center gap-3">
                                  {task.blocked && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                                  <span className={`text-[13px] font-bold ${task.isOverdue ? 'text-rose-400' : 'text-white/90'}`}>{task.title}</span>
                               </div>
                            </td>
                            <td className="py-4">
                               <StatusBadge status={task.status} />
                            </td>
                            <td className="py-4">
                               <span className={`text-[11px] font-bold ${task.due === 'Today' ? 'text-amber-500' : task.due === 'Overdue' ? 'text-rose-500' : 'text-text-muted'}`}>
                                  {task.due}
                               </span>
                            </td>
                            <td className="py-4 text-right">
                               <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all">
                                  Manage
                                </button>
                            </td>
                         </tr>
                       ))}
                       {!myTasks?.length && (
                         <tr><td colSpan="4" className="py-12 text-center text-xs text-text-muted font-black italic uppercase tracking-widest">No assigned tasks for today.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </DashboardSection>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <DashboardSection title="Blockers" icon={<ShieldAlert size={16} />} className="border-rose-500/20 bg-rose-500/[0.01]">
              <div className="space-y-3 mt-4">
                 {blockers?.map((b, idx) => (
                   <div key={idx} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                      <span className="text-[11px] font-bold text-white block mb-1">{b.issue}</span>
                      <span className="text-[9px] text-rose-300/60 flex items-center gap-1.5 font-bold uppercase truncate">
                         Contact: {b.contact}
                      </span>
                   </div>
                 ))}
                 {!blockers?.length && (
                   <div className="py-4 text-center text-[10px] text-text-muted uppercase font-black">All systems green</div>
                 )}
              </div>
           </DashboardSection>

           {/* 4. Progress Tracker */}
           <DashboardSection title="Sprint Progress" icon={<Zap size={16} />}>
              <div className="mt-4 flex flex-col gap-4">
                 <div className="flex justify-between items-end">
                    <span className="text-3xl font-black text-white">{progress?.percentage}%</span>
                    <span className="text-[10px] font-bold text-text-muted mb-1">{progress?.completed} / {progress?.total} Completed</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${progress?.percentage}%` }}
                    />
                 </div>
              </div>
           </DashboardSection>
        </div>
      </div>

      {/* Row 3: PRs | Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <DashboardSection title="My Code (PRs)" icon={<GitPullRequest size={16} />}>
            <div className="grid grid-cols-3 gap-4 mt-4">
               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                  <span className="block text-xl font-black mb-1 text-primary">{prStats?.open}</span>
                  <span className="block text-[8px] font-black uppercase tracking-widest text-text-muted">Open</span>
               </div>
               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                  <span className="block text-xl font-black mb-1 text-emerald-500">{prStats?.merged}</span>
                  <span className="block text-[8px] font-black uppercase tracking-widest text-text-muted">Merged</span>
               </div>
               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                  <span className="block text-xl font-black mb-1 text-amber-500">{prStats?.pendingReview}</span>
                  <span className="block text-[8px] font-black uppercase tracking-widest text-text-muted">In Review</span>
               </div>
            </div>
         </DashboardSection>

         <DashboardSection title="Recent Activity" icon={<Activity size={16} />}>
            <div className="flex flex-col gap-3 mt-4">
               {activityFeed?.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.03] last:border-0">
                    <span className="font-semibold text-white/70">{item.action}</span>
                    <span className="text-[10px] font-mono text-text-muted">{item.time}</span>
                 </div>
               ))}
            </div>
         </DashboardSection>
      </div>

      {/* Bottom: What’s Next | Help Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <DashboardSection title="What's Next" icon={<ArrowRightCircle size={16} />} className="bg-primary/[0.02]">
            <div className="flex bg-white/[0.03] border border-white/5 p-4 rounded-2xl items-center justify-between mt-4">
               <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase text-primary tracking-widest">Next Target</span>
                  <span className="text-[13px] font-bold text-white">{whatsNext?.[0]?.title || 'Awaiting assignment...'}</span>
               </div>
               <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Plus size={18} />
               </div>
            </div>
         </DashboardSection>

         <DashboardSection title="Requirement Clarification" icon={<MessageSquare size={16} />}>
            <div className="mt-4">
               <button className="w-full py-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-text-muted hover:bg-white/[0.08] hover:border-white/20 transition-all flex flex-col items-center gap-2">
                  <span className="text-xl">?</span>
                  Raise Question to Lead
               </button>
            </div>
         </DashboardSection>
      </div>
    </div>
  );
};



export default SWEDashboard;

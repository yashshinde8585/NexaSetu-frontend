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
    <div className="p-6 bg-black min-h-screen text-white flex flex-col gap-8 font-mono selection:bg-primary/30">
      
      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricStripItem label="Active Mission" value={dayMetrics?.myTasks} icon={<CheckCircle2 size={18} />} color="text-white" />
        <MetricStripItem label="Imminent Deadline" value={dayMetrics?.dueToday} icon={<Clock size={18} />} color={dayMetrics?.dueToday > 0 ? 'text-status-warning' : 'text-white/40'} />
        <MetricStripItem label="Engagement Blocked" value={dayMetrics?.blocked} icon={<ShieldAlert size={18} />} color={dayMetrics?.blocked > 0 ? 'text-status-error' : 'text-white/40'} />
        <MetricStripItem label="Backlog Depth" value={dayMetrics?.remaining} icon={<ArrowRightCircle size={18} />} color="text-white/40" />
      </div>

      {/* My Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
           <DashboardSection title="EXECUTION PIPELINE: INDIVIDUAL ASSIGNMENTS" icon={<Activity size={16} />}>
              <div className="overflow-x-auto mt-6 custom-scrollbar">
                 <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                       <tr className="bg-black border-b border-white/20 text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">
                          <th className="py-6 px-8">Assignment // Identifier</th>
                          <th className="py-6 px-8 text-center">Status</th>
                          <th className="py-6 px-8">Deadline</th>
                          <th className="py-6 px-8 text-right">Access</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] font-black italic">
                       {myTasks?.map((task, idx) => (
                         <tr key={idx} className="group hover:bg-white/5 transition-colors">
                            <td className="py-5 px-8">
                               <div className="flex items-center gap-4">
                                  {task.blocked && <div className="w-2.5 h-2.5 rounded-full bg-status-error animate-pulse shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.6)]" />}
                                  <span className={`text-[12px] font-black tracking-tight ${task.isOverdue ? 'text-status-error' : 'text-white'} group-hover:text-primary transition-colors`}>{task.title}</span>
                               </div>
                            </td>
                            <td className="py-5 px-8 text-center">
                               <StatusBadge status={task.status} />
                            </td>
                            <td className="py-5 px-8">
                               <span className={`text-[10px] font-black uppercase tracking-widest ${task.due === 'Today' ? 'text-status-warning font-black animate-pulse' : task.due === 'Overdue' ? 'text-status-error font-black underline' : 'text-white/20'}`}>
                                  {task.due}
                               </span>
                            </td>
                            <td className="py-5 px-8 text-right">
                               <button className="px-6 py-2.5 bg-black border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-black hover:border-primary transition-all shadow-lg active:scale-95">
                                  Inspect
                                </button>
                            </td>
                         </tr>
                       ))}
                       {!myTasks?.length && (
                         <tr><td colSpan="4" className="py-16 text-center text-[11px] text-white/10 font-black italic uppercase tracking-[0.5em]">No active deployments assigned.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </DashboardSection>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-10">
           <DashboardSection title="ENGAGEMENT BLOCKERS" icon={<ShieldAlert size={16} />} className="border-status-error/40 bg-black">
              <div className="space-y-4 mt-6">
                 {blockers?.map((b, idx) => (
                   <div key={idx} className="p-6 bg-black border-2 border-status-error/20 rounded-2xl shadow-[0_4px_20px_rgba(239,68,68,0.1)] group hover:border-status-error/60 transition-all">
                      <span className="text-[12px] font-black text-white block mb-3 uppercase tracking-tight group-hover:text-status-error transition-colors">{b.issue}</span>
                      <span className="text-[9px] text-status-error/60 flex items-center gap-2 font-black uppercase tracking-widest">
                         <User size={10} /> CONTACT: {b.contact}
                      </span>
                   </div>
                 ))}
                 {!blockers?.length && (
                   <div className="py-10 text-center text-[10px] text-white/10 uppercase font-black tracking-[0.5em] italic">Zero external blocks</div>
                 )}
              </div>
           </DashboardSection>

           {/* 4. Progress Tracker */}
           <DashboardSection title="SPRINT VELOCITY: INDIVIDUAL" icon={<Zap size={16} />}>
              <div className="mt-8 flex flex-col gap-6">
                 <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-4xl font-black text-white">{progress?.percentage}%</span>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1 italic">{progress?.completed} / {progress?.total} Items Finalized</span>
                 </div>
                 <div className="w-full h-2.5 bg-black border border-white/10 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--color-primary),0.3)]" 
                      style={{ width: `${progress?.percentage}%` }}
                    />
                 </div>
              </div>
           </DashboardSection>
        </div>
      </div>

      {/* Row 3: PRs | Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <DashboardSection title="INDIVIDUAL DEPLOYMENT STATUS (PRs)" icon={<GitPullRequest size={16} />}>
            <div className="grid grid-cols-3 gap-6 mt-6">
               <div className="p-6 bg-black border border-white/10 rounded-2xl text-center shadow-lg group hover:border-primary transition-all">
                  <span className="block text-3xl font-black mb-2 text-primary group-hover:scale-110 transition-transform">{prStats?.open}</span>
                  <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">OPEN STACK</span>
               </div>
               <div className="p-6 bg-black border border-white/10 rounded-2xl text-center shadow-lg group hover:border-status-success transition-all">
                  <span className="block text-3xl font-black mb-2 text-status-success group-hover:scale-110 transition-transform">{prStats?.merged}</span>
                  <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">MERGED</span>
               </div>
               <div className="p-6 bg-black border border-white/10 rounded-2xl text-center shadow-lg group hover:border-status-warning transition-all">
                  <span className="block text-3xl font-black mb-2 text-status-warning group-hover:scale-110 transition-transform">{prStats?.pendingReview}</span>
                  <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-white/30">ASSESSMENT</span>
               </div>
            </div>
         </DashboardSection>

         <DashboardSection title="OPERATIONAL LOG: RECENT" icon={<Activity size={16} />}>
            <div className="flex flex-col gap-4 mt-6 custom-scrollbar max-h-[180px] overflow-y-auto pr-2">
               {activityFeed?.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0 group">
                    <span className="text-[11px] font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{item.action}</span>
                    <span className="text-[10px] font-mono font-black text-white/20 uppercase tracking-widest">{item.time}</span>
                 </div>
               ))}
            </div>
         </DashboardSection>
      </div>

      {/* Bottom: What’s Next | Help Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <DashboardSection title="SEQUENTIAL TARGETING" icon={<ArrowRightCircle size={16} />} className="border-primary/20">
            <div className="flex bg-black border-2 border-white/10 p-6 rounded-[2rem] items-center justify-between mt-6 shadow-xl group hover:border-primary transition-all">
               <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em] mb-1">Queue // Alpha</span>
                  <span className="text-[14px] font-black text-white uppercase tracking-tight">{whatsNext?.[0]?.title || 'Awaiting assignment...'}</span>
               </div>
               <div className="p-4 rounded-2xl bg-primary text-black shadow-[0_0_20px_rgba(var(--color-primary),0.4)]">
                  <Plus size={24} />
               </div>
            </div>
         </DashboardSection>

         <DashboardSection title="CRITICAL CLARIFICATION" icon={<MessageSquare size={16} />}>
            <div className="mt-6">
               <button className="w-full py-8 bg-black border-2 border-dashed border-white/10 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.4em] text-white/30 hover:bg-white/5 hover:border-white/40 hover:text-white transition-all flex flex-col items-center gap-4 group shadow-2xl">
                  <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center text-2xl group-hover:border-primary group-hover:text-primary transition-all font-mono">?</div>
                  INITIALIZE LEAD ENGAGEMENT
               </button>
            </div>
         </DashboardSection>
      </div>
    </div>
  );
};



export default SWEDashboard;

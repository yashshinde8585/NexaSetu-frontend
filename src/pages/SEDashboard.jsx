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
  FileText
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';

const SEDashboard = () => {
  const { data, isLoading } = useRoleDashboard('se');

  if (isLoading) return <CenteredLoading />;

  const { 
    executionMetrics, 
    workQueue, 
    myBlockers, 
    moduleOwnership, 
    prStatus, 
    myBugs, 
    teamSupport,
    activity 
  } = data || {};

  return (
    <div className="p-6 bg-black min-h-screen text-white flex flex-col gap-8 font-mono selection:bg-primary/30">
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricStripItem label="Active Assignment" value={executionMetrics?.tasksAssigned} icon={<Package size={18} />} color="text-white" />
        <MetricStripItem label="Imminent Deadline" value={executionMetrics?.dueToday} icon={<Clock size={18} />} color={executionMetrics?.dueToday > 0 ? 'text-status-warning' : 'text-white/40'} />
        <MetricStripItem label="Execution Blocked" value={executionMetrics?.blocked} icon={<ShieldAlert size={18} />} color={executionMetrics?.blocked > 0 ? 'text-status-error' : 'text-white/40'} />
        <MetricStripItem label="Mission Critical" value={executionMetrics?.highPriority} icon={<Flame size={18} />} color="text-status-error" />
        <MetricStripItem label="Peer Assessment" value={executionMetrics?.pendingReviews} icon={<GitPullRequest size={18} />} color="text-primary" />
      </div>

      {/* 2. My Work Queue (MAIN FOCUS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <DashboardSection title="EXECUTION PIPELINE: ACTIVE ASSIGNMENTS" icon={<Activity size={16} />} className="h-full">
            <div className="overflow-x-auto mt-6 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-black border-b border-white/20 text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">
                    <th className="py-6 px-8">Assignment // Identifier</th>
                    <th className="py-6 px-8 text-center">Priority</th>
                    <th className="py-6 px-8">Deadline</th>
                    <th className="py-6 px-8 text-right">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] font-black italic">
                  {workQueue?.map((task, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-4">
                           {task.blocked && <ShieldAlert size={14} className="text-status-error animate-pulse shrink-0" />}
                           <span className="text-[12px] font-black text-white group-hover:text-primary transition-colors truncate max-w-xs">{task.title}</span>
                        </div>
                      </td>
                      <td className="py-5 px-8 text-center">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded border shadow-inner ${
                          task.priority === 'urgent' ? 'border-status-error/40 text-status-error bg-status-error/5' : 
                          task.priority === 'high' ? 'border-status-warning/40 text-status-warning bg-status-warning/5' : 'border-white/10 text-white/40 bg-white/5'
                        }`}>
                          {task.priority || 'NORMAL'}
                        </span>
                      </td>
                      <td className="py-5 px-8">
                        <span className={`text-[10px] font-mono font-black ${task.isOverdue ? 'text-status-error' : 'text-white/30'}`}>
                          {task.due}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <button className="p-3 rounded-xl bg-black border border-white/10 hover:border-primary hover:text-primary transition-all shadow-lg active:scale-95 group/btn">
                           <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-10">
          <DashboardSection title="SYSTEM BLOCKERS" icon={<ShieldAlert size={16} />}>
             <div className="space-y-4 mt-6">
                {myBlockers?.map((block, idx) => (
                  <div key={idx} className="p-6 bg-black border-2 border-status-error/20 rounded-2xl shadow-[0_4px_20px_rgba(239,68,68,0.1)] group hover:border-status-error/60 transition-all">
                    <span className="block text-[12px] font-black text-white uppercase mb-3 tracking-tight group-hover:text-status-error transition-colors">{block.title}</span>
                    <span className="block text-[9px] text-status-error/60 uppercase tracking-[0.2em] font-black flex items-center gap-2">
                      <Clock size={10} className="animate-pulse" /> DEBT OWNER: {block.waitingOn}
                    </span>
                  </div>
                ))}
                {!myBlockers?.length && (
                  <div className="py-10 text-center text-[10px] text-white/10 uppercase font-black tracking-[0.5em] italic">Zero external blocks detected</div>
                )}
             </div>
          </DashboardSection>
 
          <DashboardSection title="PEER ASSESSMENT STACK" icon={<GitPullRequest size={16} />}>
             <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between p-4 bg-black border border-white/10 rounded-xl">
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Awaiting assessment</span>
                   <span className="px-3 py-1 bg-primary text-black font-black rounded-full text-[11px] shadow-[0_0_15px_rgba(var(--color-primary),0.4)]">{prStatus?.pendingReviews}</span>
                </div>
                {prStatus?.stalePR && (
                  <div className="p-6 bg-black border-2 border-status-warning/20 rounded-2xl group cursor-pointer hover:border-status-warning/60 transition-all shadow-lg">
                    <span className="block text-[12px] font-black text-white uppercase group-hover:text-status-warning transition-colors">{prStatus.stalePR.title}</span>
                    <span className="block text-[9px] text-status-warning/60 uppercase tracking-[0.3em] font-black mt-3 flex items-center gap-2 italic">
                       ⚠ LATENCY DETECTED: {prStatus.stalePR.pendingDays} DAYS IN STACK
                    </span>
                  </div>
                )}
             </div>
          </DashboardSection>
        </div>
      </div>

      {/* Row 3: Code Ownership | Bugs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
           <DashboardSection title="SYSTEM OWNERSHIP" icon={<Shield size={16} />}>
              <div className="space-y-4 mt-6">
                 {moduleOwnership?.map((module, idx) => (
                   <div key={idx} className="flex items-center justify-between p-5 bg-black border border-white/10 rounded-2xl group hover:border-white/30 transition-all shadow-lg">
                      <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{module.name}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          module.status === 'healthy' ? 'text-status-success/60' : 'text-status-error/60'
                        }`}>
                          INTEGRITY: {module.health}
                        </span>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded border ${
                        module.status === 'healthy' ? 'border-status-success/30 text-status-success bg-status-success/5' : 'border-status-error/30 text-status-error bg-status-error/5 animate-pulse'
                      }`}>
                         {module.status}
                      </span>
                   </div>
                 ))}
              </div>
           </DashboardSection>
        </div>

        <div className="lg:col-span-8">
           <DashboardSection title="DEFECT TELEMETRY: ASSIGNED" icon={<Bug size={16} />}>
              <div className="space-y-4 mt-6">
                 {myBugs?.map((bug, idx) => (
                   <div key={idx} className="flex items-center justify-between p-5 bg-black border border-white/10 rounded-2xl hover:border-status-error transition-all group shadow-xl">
                      <div className="flex items-center gap-5">
                         <div className={`p-3 rounded-xl border ${bug.severity === 'urgent' ? 'border-status-error/40 text-status-error bg-status-error/5 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-status-warning/40 text-status-warning bg-status-warning/5'}`}>
                            <AlertCircle size={20} className={bug.severity === 'urgent' ? 'animate-pulse' : ''} />
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-[13px] font-black text-white uppercase group-hover:text-status-error transition-colors">{bug.issue}</span>
                            <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">Severity Tier: {bug.severity}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <span className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-mono italic">{bug.status}</span>
                        <ExternalLink size={16} className="text-white/10 group-hover:text-white/40 transition-colors" />
                      </div>
                   </div>
                 ))}
                 {!myBugs?.length && (
                  <div className="py-10 text-center text-[10px] text-white/10 uppercase font-black tracking-[0.5em] italic">No defects requiring direct intervention</div>
                )}
              </div>
           </DashboardSection>
        </div>
      </div>

      {/* Row 4: Focus Mode | Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-7">
            <DashboardSection title="PRIMARY MISSION OBJECTIVE" icon={<Zap size={16} />} className="border-primary/40 shadow-[0_0_30px_rgba(var(--color-primary),0.1)]">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pb-2">
                  <div className="flex flex-col gap-2 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-primary">
                       <Zap size={14} className="animate-pulse" /> Focus Alpha
                    </span>
                    <span className="text-[11px] font-black text-white uppercase leading-tight tracking-tight">{workQueue?.[0]?.title || 'System Idle'}</span>
                  </div>
                  <div className="flex flex-col gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-status-success">
                       <GitPullRequest size={14} /> Focus Beta
                    </span>
                    <span className="text-[11px] font-black text-white uppercase leading-tight tracking-tight">{prStatus?.pendingReviews} Assessments Pending</span>
                  </div>
                  <div className="flex flex-col gap-2 p-4 bg-black border border-white/10 rounded-2xl">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-status-warning">
                       <Bug size={14} /> Focus Gamma
                    </span>
                    <span className="text-[11px] font-black text-white uppercase leading-tight tracking-tight">{myBugs?.length || 0} Defects Pending</span>
                  </div>
               </div>
            </DashboardSection>
         </div>

         <div className="lg:col-span-5">
            <DashboardSection title="OPERATIONAL TELEMETRY" icon={<Activity size={16} />}>
               <div className="flex items-center justify-around h-full py-4 mt-4">
                  <div className="text-center group">
                    <span className="block text-3xl font-black text-white group-hover:text-primary transition-colors">{activity?.commitsToday}</span>
                    <span className="block text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mt-2 italic shadow-md">Commits Today</span>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center group">
                    <span className="block text-3xl font-black text-white group-hover:text-primary transition-colors">{activity?.filesChanged}</span>
                    <span className="block text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mt-2 italic">Files Delta</span>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center group">
                    <span className="block text-3xl font-black text-white group-hover:text-primary transition-colors">{activity?.prsMerged}</span>
                    <span className="block text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mt-2 italic">Assessments</span>
                  </div>
               </div>
            </DashboardSection>
         </div>
      </div>

      {/* 9. Mentorship / Support Signals */}
      <DashboardSection title="TEAM COLLABORATION: SUPPORT VECTORS" icon={<Users size={16} />}>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {teamSupport?.map((help, idx) => (
              <div key={idx} className="p-6 bg-black border border-white/10 rounded-[2rem] flex flex-col gap-3 hover:border-primary transition-all cursor-pointer shadow-lg group">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary px-3 py-1 bg-primary/5 border border-primary/20 rounded-full uppercase tracking-[0.2em]">{help.teamMember}</span>
                    <span className="text-status-warning/40 group-hover:text-status-warning transition-colors"><Sparkles size={16} /></span>
                 </div>
                 <p className="text-[12px] font-black text-white uppercase leading-relaxed tracking-tight line-clamp-2">{help.issue}</p>
                 <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
                       <MessageSquare size={12} /> {help.reason}
                    </span>
                    <ChevronRight size={14} className="text-white/10 group-hover:text-primary transition-all" />
                 </div>
              </div>
            ))}
            {!teamSupport?.length && (
              <div className="col-span-3 py-12 text-center text-[10px] text-white/10 uppercase font-black tracking-[0.5em] italic">Cluster stable: No active mentorship requests</div>
            )}
         </div>
      </DashboardSection>
    </div>
  );
};



export default SEDashboard;

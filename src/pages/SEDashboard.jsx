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
    <div className="p-6 bg-[#050505] min-h-screen text-text-main flex flex-col gap-6 font-sans">
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricStripItem label="Tasks Assigned" value={executionMetrics?.tasksAssigned} icon={<Package size={18} />} />
        <MetricStripItem label="Due Today" value={executionMetrics?.dueToday} icon={<Clock size={18} />} color={executionMetrics?.dueToday > 0 ? 'text-amber-500' : 'text-white/40'} />
        <MetricStripItem label="Blocked" value={executionMetrics?.blocked} icon={<ShieldAlert size={18} />} color={executionMetrics?.blocked > 0 ? 'text-rose-500' : 'text-white/40'} />
        <MetricStripItem label="High Priority" value={executionMetrics?.highPriority} icon={<Flame size={18} />} color="text-orange-500" />
        <MetricStripItem label="PR Reviews" value={executionMetrics?.pendingReviews} icon={<GitPullRequest size={18} />} color="text-emerald-500" />
      </div>

      {/* 2. My Work Queue (MAIN FOCUS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <DashboardSection title="My Tasks" icon={<Activity size={16} />} className="h-full">
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-text-muted uppercase tracking-widest font-black">
                    <th className="pb-3 px-4">Task</th>
                    <th className="pb-3 px-4">Priority</th>
                    <th className="pb-3 px-4">Due</th>
                    <th className="pb-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {workQueue?.map((task, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                           {task.blocked && <ShieldAlert size={12} className="text-rose-500 animate-pulse" />}
                           <span className="text-xs font-semibold text-white/80 group-hover:text-white truncate max-w-xs">{task.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={task.priority === 'urgent' ? 'blocked' : task.priority === 'high' ? 'in_progress' : 'todo'} />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-mono ${task.isOverdue ? 'text-rose-400' : 'text-text-muted'}`}>
                          {task.due}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-1.5 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                           <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <DashboardSection title="My Blockers" icon={<ShieldAlert size={16} />}>
             <div className="space-y-3 mt-4">
                {myBlockers?.map((block, idx) => (
                  <div key={idx} className="p-3 bg-rose-500/[0.02] border border-rose-500/10 rounded-xl">
                    <span className="block text-[10px] font-bold text-white mb-1">{block.title}</span>
                    <span className="block text-[8px] text-rose-400 uppercase tracking-widest font-black flex items-center gap-1">
                      <Clock size={8} /> Waiting on: {block.waitingOn}
                    </span>
                  </div>
                ))}
                {!myBlockers?.length && (
                  <div className="py-6 text-center text-[10px] text-text-muted/40 uppercase font-black italic">No active blockers</div>
                )}
             </div>
          </DashboardSection>

          <DashboardSection title="Code Review Queue" icon={<GitPullRequest size={16} />}>
             <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-white/60 mb-2">
                   <span>Review Requests</span>
                   <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px]">{prStatus?.pendingReviews}</span>
                </div>
                {prStatus?.stalePR && (
                  <div className="p-3 bg-amber-500/[0.02] border border-amber-500/10 rounded-xl group cursor-pointer hover:bg-amber-500/[0.05] transition-all">
                    <span className="block text-[10px] font-bold text-white group-hover:text-amber-500 transition-colors">{prStatus.stalePR.title}</span>
                    <span className="block text-[8px] text-amber-500/60 uppercase tracking-widest font-black mt-1">⚠ Stale for {prStatus.stalePR.pendingDays} days</span>
                  </div>
                )}
             </div>
          </DashboardSection>
        </div>
      </div>

      {/* Row 3: Code Ownership | Bugs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
           <DashboardSection title="Ownership" icon={<Shield size={16} />}>
              <div className="space-y-3 mt-4">
                 {moduleOwnership?.map((module, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white">{module.name}</span>
                        <span className={`text-[9px] font-semibold ${
                          module.status === 'healthy' ? 'text-emerald-500/60' : 'text-rose-500/60'
                        }`}>
                          {module.health}
                        </span>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        module.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                         {module.status}
                      </span>
                   </div>
                 ))}
              </div>
           </DashboardSection>
        </div>

        <div className="lg:col-span-7">
           <DashboardSection title="Bugs Assigned to Me" icon={<Bug size={16} />}>
              <div className="space-y-3 mt-4">
                 {myBugs?.map((bug, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.015] border border-white/5 rounded-xl hover:bg-white/[0.03] transition-all">
                      <div className="flex items-center gap-3">
                         <div className={`p-1.5 rounded-lg ${bug.severity === 'urgent' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            <AlertCircle size={14} />
                         </div>
                         <span className="text-xs font-semibold text-white/80">{bug.issue}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] text-text-muted uppercase tracking-tighter font-mono">{bug.status}</span>
                        <ExternalLink size={12} className="text-text-muted/30" />
                      </div>
                   </div>
                 ))}
                 {!myBugs?.length && (
                  <div className="py-6 text-center text-[10px] text-text-muted/40 uppercase font-black italic">No defects currently assigned</div>
                )}
              </div>
           </DashboardSection>
        </div>
      </div>

      {/* Row 4: Focus Mode | Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-7">
            <DashboardSection title="Daily Objective" icon={<Zap size={16} />} className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 text-primary">
                       <Zap size={14} /> Primary Focus
                    </span>
                    <span className="text-xs font-bold text-white/80 truncate">{workQueue?.[0]?.title || 'No tasks'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 text-emerald-500">
                       <GitPullRequest size={14} /> Unblock PRs
                    </span>
                    <span className="text-xs font-bold text-white/80 truncate">{prStatus?.pendingReviews} assessments pending</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 text-amber-500">
                       <Bug size={14} /> Resolution
                    </span>
                    <span className="text-xs font-bold text-white/80 truncate">{myBugs?.length || 0} defects require attention</span>
                  </div>
               </div>
            </DashboardSection>
         </div>

         <div className="lg:col-span-5">
            <DashboardSection title="Activity Snapshot" icon={<Activity size={16} />}>
               <div className="flex items-center justify-around h-full py-2">
                  <div className="text-center">
                    <span className="block text-2xl font-black text-white">{activity?.commitsToday}</span>
                    <span className="block text-[8px] font-bold text-text-muted uppercase tracking-[0.2em]">Commits Today</span>
                  </div>
                  <div className="w-px h-8 bg-white/5" />
                  <div className="text-center">
                    <span className="block text-2xl font-black text-white">{activity?.filesChanged}</span>
                    <span className="block text-[8px] font-bold text-text-muted uppercase tracking-[0.2em]">Files Changed</span>
                  </div>
                  <div className="w-px h-8 bg-white/5" />
                  <div className="text-center">
                    <span className="block text-2xl font-black text-white">{activity?.prsMerged}</span>
                    <span className="block text-[8px] font-bold text-text-muted uppercase tracking-[0.2em]">PRs Merged</span>
                  </div>
               </div>
            </DashboardSection>
         </div>
      </div>

      {/* 9. Mentorship / Support Signals */}
      <DashboardSection title="Team Support" icon={<Users size={16} />}>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {teamSupport?.map((help, idx) => (
              <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-2 hover:bg-white/[0.04] transition-all cursor-pointer">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded uppercase tracking-widest">{help.teamMember}</span>
                    <span className="text-yellow-500/50"><Sparkles size={14} /></span>
                 </div>
                 <p className="text-xs font-semibold text-white/80 leading-relaxed truncate">{help.issue}</p>
                 <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <MessageSquare size={10} /> {help.reason}
                 </span>
              </div>
            ))}
            {!teamSupport?.length && (
              <div className="col-span-3 py-6 text-center text-[10px] text-text-muted/40 uppercase font-black italic">Team is currently unblocked</div>
            )}
         </div>
      </DashboardSection>
    </div>
  );
};



export default SEDashboard;

import React from 'react';
import { 
  Package, Clock, ShieldAlert, Flame, GitPullRequest, 
  CheckCircle2, Bug, Activity, Zap, Users, AlertCircle, 
  ChevronRight, ExternalLink, MessageSquare, Sparkles, 
  Shield, FileText, Target
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';

/**
 * Software Engineering Dashboard
 * Focused on task execution, code ownership stability, and peer support.
 */
const SEDashboard = () => {
  const { data, isLoading } = useRoleDashboard('se');

  if (isLoading) return <CenteredLoading />;

  const { 
    executionMetrics = { tasksAssigned: 0, dueToday: 0, blocked: 0, highPriority: 0, pendingReviews: 0 }, 
    workQueue = [], 
    myBlockers = [], 
    moduleOwnership = [], 
    prStatus = { pendingReviews: 0, stalePR: null }, 
    myBugs = [], 
    teamSupport = [],
    activity = { commitsToday: 0, filesChanged: 0, prsMerged: 0 } 
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1600px] mx-auto flex flex-col gap-12">
      
      {/* 1. Tactical Execution Strip */}
      <div id="se-metrics-strip" className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
            color={executionMetrics.dueToday > 0 ? "text-status-warning" : "text-white/40"} 
            accent={executionMetrics.dueToday > 0 ? "bg-status-warning" : "bg-white/5"}
        />
        <MetricStripItem 
            label="Blocked Nodes" 
            value={executionMetrics.blocked} 
            icon={<ShieldAlert size={14} />} 
            color={executionMetrics.blocked > 0 ? "text-status-error" : "text-white/40"} 
            accent={executionMetrics.blocked > 0 ? "bg-status-error" : "bg-white/5"}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 2. Primary Work Queue */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <DashboardSection title="Execution Queue" icon={<Activity size={14} />}>
            <div className="overflow-x-auto py-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-white/30 uppercase font-bold tracking-widest border-b border-white/5">
                    <th className="pb-4 px-2">Assigned Objective</th>
                    <th className="pb-4 px-2 text-center">Priority</th>
                    <th className="pb-4 px-2">Temporal Limit</th>
                    <th className="pb-4 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {workQueue?.map((task, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.015] transition-all">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                           {task.blocked && <ShieldAlert size={14} className="text-status-error animate-pulse shrink-0" />}
                           <span className="text-[12px] font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">{task.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                          task.priority === 'urgent' ? 'border-status-error/40 text-status-error bg-status-error/5' : 
                          task.priority === 'high' ? 'border-status-warning/40 text-status-warning bg-status-warning/5' : 'border-white/10 text-white/40'
                        }`}>
                          {task.priority || 'NORMAL'}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`text-[11px] font-bold tracking-widest ${task.isOverdue ? 'text-status-error' : 'text-white/40'}`}>
                          {task.due}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button className="p-2 bg-white/[0.03] border border-white/10 rounded hover:border-primary/40 hover:bg-primary/10 transition-all text-white/20 hover:text-primary">
                           <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>

          <DashboardSection title="Peer Support Directives" icon={<Users size={14} />}>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
                {teamSupport?.map((help, idx) => (
                  <div key={idx} className="p-5 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-4 hover:border-primary/40 transition-all group">
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-primary px-2 py-0.5 bg-primary/10 border border-primary/20 rounded uppercase tracking-widest">{help.teamMember}</span>
                        <Sparkles size={12} className="text-white/10 group-hover:text-status-warning/60 transition-colors" />
                     </div>
                     <p className="text-[11px] font-bold text-white uppercase leading-snug tracking-tight line-clamp-2">{help.issue}</p>
                     <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2">
                           <MessageSquare size={10} /> {help.reason}
                        </span>
                        <ChevronRight size={12} className="text-white/10 group-hover:text-primary transition-all" />
                     </div>
                  </div>
                ))}
             </div>
          </DashboardSection>
        </div>

        {/* 3. Sidebar: Stability & Review */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <DashboardSection title="Operational Blockers" icon={<ShieldAlert size={14} />}>
             <div className="flex flex-col gap-3 py-2">
                {myBlockers?.map((block, idx) => (
                  <div key={idx} className="p-4 bg-status-error/[0.02] border border-status-error/10 rounded group hover:border-status-error/40 transition-all">
                    <span className="block text-[11px] font-bold text-white uppercase tracking-tight mb-2 leading-tight">{block.title}</span>
                    <span className="block text-[9px] text-status-error/60 uppercase tracking-widest font-bold flex items-center gap-2">
                      <Clock size={10} /> WAITING: {block.waitingOn}
                    </span>
                  </div>
                ))}
                {!myBlockers?.length && (
                  <div className="py-8 text-center text-[10px] text-white/10 uppercase font-black tracking-widest italic">Zero blockade state.</div>
                )}
             </div>
          </DashboardSection>
 
          <DashboardSection title="Review Status" icon={<GitPullRequest size={14} />}>
             <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded group hover:border-primary/40 transition-all">
                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Requests</span>
                   <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 font-bold rounded text-[10px] tracking-widest">{prStatus?.pendingReviews}</span>
                </div>
                {prStatus?.stalePR && (
                  <div className="p-4 bg-status-warning/[0.02] border border-status-warning/20 rounded group hover:border-status-warning/60 transition-all">
                    <span className="block text-[11px] font-bold text-white uppercase tracking-tight leading-tight group-hover:text-status-warning transition-colors">{prStatus.stalePR.title}</span>
                    <span className="block text-[9px] text-status-warning/60 uppercase tracking-widest font-bold mt-2 flex items-center gap-2 italic">
                       STALE: {prStatus.stalePR.pendingDays} DAYS INACTIVE
                    </span>
                  </div>
                )}
             </div>
          </DashboardSection>

          <DashboardSection title="Sync Integrity" icon={<Target size={14} />}>
             <div className="flex items-center justify-around py-6 mt-2 bg-white/[0.01] rounded border border-white/5">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-black text-white tracking-tighter">{activity.commitsToday}</span>
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Commits</span>
                </div>
                <div className="w-px h-10 bg-white/5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-black text-white tracking-tighter">{activity.filesChanged}</span>
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Changes</span>
                </div>
                <div className="w-px h-10 bg-white/5" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-black text-white tracking-tighter">{activity.prsMerged}</span>
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Merged</span>
                </div>
             </div>
          </DashboardSection>
        </div>
      </div>

      {/* 4. Domain Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
           <DashboardSection title="Domain Stability" icon={<Shield size={14} />}>
              <div className="flex flex-col gap-3 py-2">
                 {moduleOwnership?.map((module, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded group hover:border-primary/20 transition-all">
                       <div className="flex flex-col gap-1">
                         <span className="text-[11px] font-bold text-white uppercase tracking-tight leading-none mb-1">{module.name}</span>
                         <span className={`text-[9px] font-bold uppercase tracking-widest ${
                           module.status === 'healthy' ? 'text-status-success/60' : 'text-status-error/60'
                         }`}>
                           INTEGRITY: {module.health}
                         </span>
                       </div>
                       <StatusBadge 
                          status={module.status === 'healthy' ? 'success' : 'error'} 
                          text={module.status} 
                          mini
                       />
                    </div>
                 ))}
              </div>
           </DashboardSection>
        </div>

        <div className="lg:col-span-8">
           <DashboardSection title="Structural Defect Queue" icon={<Bug size={14} />}>
              <div className="flex flex-col gap-2 py-2">
                 {myBugs?.map((bug, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded group hover:border-status-error/40 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`p-2 rounded border ${bug.severity === 'urgent' ? 'border-status-error/40 text-status-error bg-status-error/5' : 'border-status-warning/40 text-status-warning bg-status-warning/5'}`}>
                             <AlertCircle size={14} className={bug.severity === 'urgent' ? 'animate-pulse' : ''} />
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[12px] font-bold text-white uppercase tracking-tight group-hover:text-status-error transition-colors leading-none mb-1">{bug.issue}</span>
                             <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest leading-none">{bug.severity} SEVERITY</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                         <StatusBadge status={bug.status} text={bug.status} mini />
                         <ExternalLink size={14} className="text-white/10 group-hover:text-white/40 transition-colors" />
                       </div>
                    </div>
                 ))}
                 {!myBugs?.length && (
                  <div className="py-8 text-center text-[10px] text-white/10 uppercase font-black tracking-widest italic">Zero defect environment.</div>
                )}
              </div>
           </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default SEDashboard;

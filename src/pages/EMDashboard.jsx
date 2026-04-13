import { 
  Package, 
  Clock, 
  Shield, 
  Users, 
  Flame, 
  ChevronRight, 
  CheckCircle2, 
  Activity, 
  ArrowRight, 
  AlertTriangle,
  Target,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';

/**
 * Engineering Manager Dashboard
 * Overview of team tasks and performance.
 */
const EMDashboard = () => {
  const { data, isLoading, error } = useRoleDashboard('em');

  if (isLoading || !data) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <CenteredLoading />
        <span className="text-white/60 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Syncing data stream...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-status-error bg-black h-screen font-black flex items-center justify-center">
      <div className="border-2 border-status-error p-10 bg-black max-w-md text-center">
        <AlertTriangle className="mx-auto mb-6" size={48} />
        <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Connection Failure</h2>
        <p className="text-xs text-white/60 leading-relaxed uppercase tracking-widest">{error?.message || 'Connection to the team data stream has been lost.'}</p>
      </div>
    </div>
  );

  const { 
    sprintControl = { progress: 0, delayRisk: 'UNKNOWN', blockedTasks: 0, teamLoad: 0, tasksDueToday: 0 }, 
    taskBoard = [], 
    blockers = [], 
    teamWorkload = [], 
    burndown = { planned: 0, completed: 0, daysLeft: 0, remaining: 0 }, 
    activity = [], 
    focusToday = [], 
    distribution = { backend: 0, frontend: 0, qa: 0, other: 0 } 
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 pb-40 md:pb-32 font-mono selection:bg-primary overflow-x-hidden">
      
      {/* Sprint Overview */}
      <div id="em-top" className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
        <MetricStripItem 
          icon={<Package size={16} />} 
          label="Sprint Progress" 
          value={`${sprintControl.progress}%`} 
          color="text-primary"
        />
        <MetricStripItem 
          icon={<Clock size={16} />} 
          label="Delay Risk" 
          value={sprintControl.delayRisk} 
          color={sprintControl.delayRisk === 'HIGH' ? 'text-status-error' : sprintControl.delayRisk === 'MEDIUM' ? 'text-status-warning' : 'text-status-success'}
        />
        <MetricStripItem 
          icon={<Shield size={16} />} 
          label="Blocked Tasks" 
          value={sprintControl.blockedTasks} 
          color={sprintControl.blockedTasks > 0 ? 'text-status-error' : 'text-white/60'}
        />
        <MetricStripItem 
          icon={<Users size={16} />} 
          label="Team Load" 
          value={`${sprintControl.teamLoad}%`} 
          color={sprintControl.teamLoad > 100 ? 'text-status-error' : sprintControl.teamLoad > 85 ? 'text-status-warning' : 'text-primary'}
        />
        <MetricStripItem 
          icon={<Flame size={16} />} 
          label="Due Today" 
          value={sprintControl.tasksDueToday} 
          color={sprintControl.tasksDueToday > 0 ? 'text-status-warning' : 'text-white/60'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24">
        
        <div className="lg:col-span-12">
          <DashboardSection title="Execution Pipeline: Tactical Task Control" icon={<Target size={12} />}>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-black border-b border-white/30 text-white/50 text-[10px] uppercase tracking-[0.4em] font-black">
                    <th className="py-6 px-8">Nomenclature // Task Identity</th>
                    <th className="py-6 px-8">Operator</th>
                    <th className="py-6 px-8 text-center">Status</th>
                    <th className="py-6 px-8 text-center">Drift Threshold</th>
                    <th className="py-6 px-8 text-center">Integrity</th>
                    <th className="py-6 px-8 text-right">Priority</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-black">
                  {taskBoard.map((task, i) => (
                    <tr key={i} className="border-b border-white/[0.05] group hover:bg-white/5 transition-all">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-1.5 h-6 ${getPriorityColor(task.priority)}`}></div>
                          <span className="text-white group-hover:text-primary transition-colors uppercase tracking-tight">{task.title}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8 text-white/60 uppercase tracking-widest">{task.owner}</td>
                      <td className="py-6 px-8 text-center">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="py-6 px-8 text-center">
                        <span className={`px-3 py-1 rounded border ${getDueColor(task.due)}`}>{task.due}</span>
                      </td>
                      <td className="py-6 px-8 text-center">
                        {task.blocked ? (
                          <div className="flex justify-center">
                            <span className="bg-status-error/10 text-status-error border border-status-error/40 px-3 py-1 text-[9px] font-black uppercase flex items-center gap-2 animate-pulse rounded">
                              <Shield size={10} /> Conflict
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/10 uppercase tracking-tighter">—</span>
                        )}
                      </td>
                      <td className="py-6 px-8 text-right">
                         <span className={`uppercase text-[10px] font-black tracking-[0.2em] ${getPriorityTextColor(task.priority)}`}>
                            {task.priority}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {taskBoard.map((task, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/20 p-5 rounded-2xl relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 bottom-0 w-1 ${getPriorityColor(task.priority)}`}></div>
                  <div className="flex justify-between items-start mb-4 pl-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-white text-[11px] font-black uppercase tracking-tight group-hover:text-primary transition-colors">{task.title}</span>
                      <span className="text-[9px] text-white/60 uppercase tracking-widest">{task.owner}</span>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pl-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest ${getDueColor(task.due)}`}>{task.due}</span>
                      <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${getPriorityTextColor(task.priority)}`}>{task.priority}</span>
                    </div>
                    {task.blocked && (
                      <span className="text-status-error flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest animate-pulse">
                        <AlertTriangle size={10} /> Conflict
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {taskBoard.length === 0 && (
              <div className="py-32 text-center flex flex-col items-center gap-6">
                <Package size={64} className="text-white/10" />
                <p className="text-white/20 uppercase tracking-[0.5em] text-[10px] font-black italic">Operational pipeline clear: No active task entries found</p>
              </div>
            )}
          </DashboardSection>
        </div>

        <div className="lg:col-span-12">
          <DashboardSection title="TACTICAL BLOCKERS: SYSTEM CONFLICTS" icon={<AlertTriangle size={12} />}>
            <div id="em-blockers" className="space-y-4">
              {blockers.map((blocker, i) => (
                <div key={i} className="bg-black border border-status-error/20 p-4 md:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-status-error transition-all shadow-lg">
                  <div className="flex flex-col gap-2">
                    <span className="text-white text-sm md:text-base font-black uppercase tracking-tight group-hover:text-status-error transition-colors">{blocker.title}</span>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[9px] md:text-[10px] text-white/50 uppercase font-black tracking-widest">
                       <span className="flex items-center gap-2 text-status-error bg-status-error/10 px-2 py-0.5 rounded border border-status-error/20 shrink-0"><Clock size={10} /> LATENCY: {blocker.since}</span>
                       <span className="hidden sm:inline text-white/10">|</span>
                       <span className="text-white/60 leading-tight">ROOT CAUSE: {blocker.reason}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="hidden sm:block text-white/10 group-hover:text-status-error group-hover:translate-x-1 transition-all" />
                </div>
              ))}
              {blockers.length === 0 && (
                <div className="p-20 text-center bg-black border border-white/5 rounded-2xl shadow-inner">
                   <CheckCircle2 size={48} className="mx-auto mb-6 text-status-success/20" />
                   <p className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-black">All operational vectors cleared: Integration stable</p>
                </div>
              )}
            </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-6">
          <DashboardSection title="TEAM LOAD PROFILING" icon={<Users size={12} />}>
            <div className="overflow-hidden bg-black border border-white/30 rounded-2xl">
              {/* Desktop View */}
              <div className="hidden md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-black border-b border-white/30 text-[9px] text-white/50 uppercase tracking-[0.3em] font-black">
                      <th className="py-4 px-6">Operator</th>
                      <th className="py-4 px-4 text-center">Tasks</th>
                      <th className="py-4 px-4 text-center">Load Profile</th>
                      <th className="py-4 px-6 text-right">Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-black">
                    {teamWorkload.map((member, i) => (
                      <tr key={i} className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors">
                        <td className="py-5 px-6 text-white uppercase tracking-tight">{member.member}</td>
                        <td className="py-5 px-4 text-center text-white/60 font-mono text-xs">{member.tasks}</td>
                        <td className="py-5 px-4">
                          <div className="flex flex-col gap-2 items-center">
                            <span className={`text-[10px] uppercase font-black tracking-widest ${member.load > 100 ? 'text-status-error' : 'text-white/60'}`}>{member.load}%</span>
                            <div className="w-24 h-1.5 bg-black border border-white/30 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${member.load > 100 ? 'bg-status-error shadow-[0_0_10px_rgba(239,68,68,0.5)]' : member.load > 85 ? 'bg-status-warning' : 'bg-primary'}`} 
                                  style={{ width: `${Math.min(member.load, 100)}%` }}
                                ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className={`w-2.5 h-2.5 rounded-full inline-block ${member.status === 'red' ? 'bg-status-error shadow-[0_0_10px_rgba(239,68,68,0.8)]' : member.status === 'yellow' ? 'bg-status-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-status-success shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-white/5 font-black">
                {teamWorkload.map((member, i) => (
                  <div key={i} className="p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-white uppercase tracking-tight text-[11px]">{member.member}</span>
                        <span className="text-[9px] text-white/60 uppercase tracking-widest">{member.tasks} Active Tasks</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${member.status === 'red' ? 'bg-status-error shadow-[0_0_10px_rgba(239,68,68,0.8)]' : member.status === 'yellow' ? 'bg-status-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-status-success shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}></div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.3em]">
                          <span className="text-white/50">Load Factor</span>
                          <span className={member.load > 100 ? 'text-status-error' : 'text-white'}>{member.load}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-black border border-white/20 rounded-full overflow-hidden">
                          <div className={`h-full ${member.load > 100 ? 'bg-status-error shadow-[0_0_10px_rgba(239,68,68,0.5)]' : member.load > 85 ? 'bg-status-warning' : 'bg-primary'}`} style={{ width: `${Math.min(member.load, 100)}%` }}></div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-6">
          <DashboardSection title="VELOCITY TELEMETRY: BURNDOWN" icon={<Activity size={12} />}>
              <div id="burndown" className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black p-6 rounded-2xl border border-white/30 flex flex-col items-center shadow-lg">
                       <span className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-2">Planned Logic</span>
                       <span className="text-3xl font-black text-white">{burndown.planned}</span>
                    </div>
                    <div className="bg-black p-6 rounded-2xl border border-white/30 flex flex-col items-center shadow-lg">
                       <span className="text-[10px] text-status-success/60 uppercase font-black tracking-widest mb-2">Committed</span>
                       <span className="text-3xl font-black text-status-success">{burndown.completed}</span>
                    </div>
                 </div>

                 <div className="relative h-24 w-full bg-black rounded-xl border border-white/20 overflow-hidden flex items-center justify-center shadow-inner">
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-primary/5 to-transparent"></div>
                    <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.5em] animate-pulse">Telemetry Live: Flow Analysis</span>
                    <svg className="absolute bottom-0 left-0 w-full h-16 opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0 10 L25 25 L50 20 L75 60 L100 55" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" />
                    </svg>
                 </div>

                 <div className="flex justify-between items-center bg-black p-4 rounded-xl border border-white/30 shadow-md">
                    <div className="flex flex-col gap-1">
                       <span className="text-3xl font-black text-status-warning">{burndown.daysLeft}</span>
                       <span className="text-[10px] text-white/50 uppercase font-black tracking-widest">Cycle Remaining</span>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                       <span className="text-2xl font-black text-white">{burndown.remaining}</span>
                       <span className="text-[10px] text-white/50 uppercase font-black tracking-widest">Backlog Depth</span>
                    </div>
                 </div>
              </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-4">
          <DashboardSection title="TACTICAL ACTIVITY FEED" icon={<Activity size={12} />}>
            <div id="em-feed" className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {activity.map((item, i) => (
                <div key={i} className="flex gap-4 group p-4 rounded-xl hover:bg-white/5 transition-colors border border-white/5 bg-black/40">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shadow-[0_0_12px_rgba(var(--color-primary),0.6)]"></div>
                    <div className="w-[1.5px] h-full bg-white/10 my-2"></div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-white/90 font-black uppercase tracking-tight leading-relaxed">{item.text}</span>
                    <span className="text-[9px] text-white/50 font-black uppercase tracking-[0.2em]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-4">
           {/* 8. Task Distribution Insight */}
            <DashboardSection title="RESOURCE ALLOCATION" icon={<Target size={12} />}>
               <div id="distribution" className="space-y-6">
                  <div className="space-y-4">
                     <DistributionBar label="Backend Logic" value={distribution.backend} total={distribution.backend + distribution.frontend + distribution.qa + distribution.other} color="bg-primary" />
                     <DistributionBar label="Frontend Interface" value={distribution.frontend} total={distribution.backend + distribution.frontend + distribution.qa + distribution.other} color="bg-purple-500" />
                     <DistributionBar label="Quality Assurance" value={distribution.qa} total={distribution.backend + distribution.frontend + distribution.qa + distribution.other} color="bg-status-success" />
                  </div>

                  {distribution.imbalance && (
                    <div className="mt-8 p-5 bg-black border-2 border-status-error/40 rounded-xl flex items-start gap-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        <AlertTriangle size={18} className="text-status-error shrink-0 mt-0.5" />
                        <div>
                           <span className="text-[11px] font-black text-status-error uppercase block mb-1 tracking-widest">Imbalance Detected</span>
                           <p className="text-[12px] text-white/90 font-black italic leading-tight uppercase tracking-tight">{distribution.imbalance}</p>
                        </div>
                    </div>
                  )}
               </div>
            </DashboardSection>
        </div>

      </div>

      {/* 7. Priority Focus Section (Sticky Bottom Strip) */}
      <div id="focus" className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-white/30 p-4 md:h-24 flex items-center justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
         <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-10">
            <div className="flex items-center gap-4 self-start md:self-center">
               <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-black border-2 border-status-warning/40 flex items-center justify-center text-status-warning shadow-[0_0_20px_rgba(245,158,11,0.2)] shrink-0">
                  <Flame size={20} className="md:size-6 animate-pulse" />
               </div>
               <div>
                  <h4 className="text-[10px] md:text-[11px] font-black text-status-warning uppercase tracking-[0.3em]">Critical Path focus</h4>
                  <p className="text-[9px] md:text-xs font-black text-white/60 uppercase tracking-widest">Execution Integrity Enforced</p>
               </div>
            </div>

            <div className="flex-1 hidden lg:flex items-center gap-5 overflow-x-hidden">
               {focusToday.slice(0, 3).map((item, i) => (
                 <div key={i} className="flex items-center gap-3 bg-black border border-white/20 px-5 py-2.5 rounded-full whitespace-nowrap group hover:border-primary transition-colors">
                    <span className="text-[10px] font-black text-white/20 group-hover:text-primary transition-colors">{i + 1}.</span>
                    <span className="text-[11px] text-white font-black uppercase tracking-[0.1em]">{item}</span>
                 </div>
               ))}
            </div>

            <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-black font-black uppercase text-[10px] md:text-[11px] px-8 py-3.5 rounded-xl md:rounded-full hover:bg-primary hover:text-white transition-all shadow-[0_4px_30px_rgba(255,255,255,0.1)] active:scale-95 group shrink-0 tracking-widest leading-none">
               Sync active Task <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>

    </div>
  );
};

// Sub-components for semantic clarity and isolation





const DistributionBar = ({ label, value, total, color }) => {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-white/40">{label}</span>
          <span className="text-white">{percent}%</span>
       </div>
       <div className="h-1.5 w-full bg-black border border-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(255,255,255,0.1)]`} 
            style={{ width: `${percent}%` }}
          ></div>
       </div>
    </div>
  );
};

const getPriorityColor = (p) => {
  switch (p?.toLowerCase()) {
    case 'high': return 'bg-status-error shadow-[0_0_12px_rgba(239,68,68,0.4)]';
    case 'medium': return 'bg-status-warning shadow-[0_0_12px_rgba(245,158,11,0.2)]';
    case 'low': return 'bg-primary/50';
    default: return 'bg-white/10';
  }
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
  if (due === 'Today') return 'bg-status-warning/10 text-status-warning border-status-warning/40 font-black animate-pulse';
  if (due === 'Overdue') return 'bg-status-error/10 text-status-error border-status-error/40 font-black decoration-status-error/50 underline-offset-4';
  if (due === 'Tomorrow') return 'bg-primary/10 text-primary border-primary/20';
  return 'bg-black text-white/30 border-white/10';
};

export default EMDashboard;

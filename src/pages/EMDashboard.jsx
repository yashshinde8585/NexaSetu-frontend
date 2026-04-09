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
  AlertTriangle 
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
    <div className="h-screen flex items-center justify-center bg-[#0a0f18]">
      <div className="flex flex-col items-center gap-4">
        <CenteredLoading />
        <span className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Syncing data...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-rose-500 bg-[#0a0f18] h-screen font-mono flex items-center justify-center">
      <div className="border border-rose-900/50 p-6 rounded bg-rose-950/20 max-w-md text-center">
        <AlertTriangle className="mx-auto mb-4" size={40} />
        <h2 className="text-xl font-black mb-2 uppercase tracking-tighter">Connection Failure</h2>
        <p className="text-sm text-rose-300/70">{error?.message || 'Connection to the team data stream has been lost.'}</p>
      </div>
    </div>
  );

  const { 
    sprintControl, 
    taskBoard, 
    blockers, 
    teamWorkload, 
    burndown, 
    activity, 
    focusToday, 
    distribution 
  } = data;

  return (
    <div className="min-h-screen bg-[#0a0f18] text-slate-300 p-4 md:p-6 font-mono selection:bg-sky-500/30 overflow-x-hidden">
      
      {/* Sprint Overview */}
      <div id="em-top" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricStripItem 
          icon={<Package size={16} />} 
          label="Sprint Progress" 
          value={`${sprintControl.progress}%`} 
          color="text-sky-500"
        />
        <MetricStripItem 
          icon={<Clock size={16} />} 
          label="Delay Risk" 
          value={sprintControl.delayRisk} 
          color={sprintControl.delayRisk === 'HIGH' ? 'text-rose-500' : sprintControl.delayRisk === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'}
        />
        <MetricStripItem 
          icon={<Shield size={16} />} 
          label="Blocked Tasks" 
          value={sprintControl.blockedTasks} 
          color={sprintControl.blockedTasks > 0 ? 'text-rose-500' : 'text-slate-500'}
        />
        <MetricStripItem 
          icon={<Users size={16} />} 
          label="Team Load" 
          value={`${sprintControl.teamLoad}%`} 
          color={sprintControl.teamLoad > 100 ? 'text-rose-500' : sprintControl.teamLoad > 85 ? 'text-amber-500' : 'text-sky-400'}
        />
        <MetricStripItem 
          icon={<Flame size={16} />} 
          label="Due Today" 
          value={sprintControl.tasksDueToday} 
          color={sprintControl.tasksDueToday > 0 ? 'text-amber-500' : 'text-slate-500'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24">
        
          <DashboardSection title="TASK BOARD">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black">
                    <th className="py-5 px-6">Task Identity</th>
                    <th className="py-5 px-4">Owner</th>
                    <th className="py-5 px-4 text-center">Status</th>
                    <th className="py-5 px-4 text-center">Due Threshold</th>
                    <th className="py-5 px-4 text-center">Blockage</th>
                    <th className="py-5 px-6 text-right">Priority</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-bold">
                  {taskBoard.map((task, i) => (
                    <tr key={i} className="border-b border-slate-900 group hover:bg-white/[0.02] transition-all">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-1 h-6 ${getPriorityColor(task.priority)}`}></div>
                          <span className="text-slate-100 group-hover:text-sky-400 transition-colors uppercase tracking-tight">{task.title}</span>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-slate-400 uppercase">{task.owner}</td>
                      <td className="py-5 px-4 text-center">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={getDueColor(task.due)}>{task.due}</span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        {task.blocked ? (
                          <div className="flex justify-center">
                            <span className="bg-rose-500/10 text-rose-500 border border-rose-500/30 px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1 animate-pulse">
                              <Shield size={10} /> Blocked
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-700">❌</span>
                        )}
                      </td>
                      <td className="py-5 px-6 text-right">
                         <span className={`uppercase text-[10px] font-black tracking-widest ${getPriorityTextColor(task.priority)}`}>
                            {task.priority}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {taskBoard.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <Package size={48} className="text-slate-800" />
                <p className="text-slate-600 uppercase tracking-widest text-xs">No active tasks found</p>
              </div>
            )}
          </DashboardSection>
        </div>

          <DashboardSection title="CRITICAL BLOCKERS">
            <div id="em-blockers" className="space-y-4">
              {blockers.map((blocker, i) => (
                <div key={i} className="bg-rose-500/[0.03] border border-rose-500/10 p-4 rounded-lg flex items-center justify-between group hover:border-rose-500/30 transition-all">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-200 text-sm font-black uppercase tracking-tight group-hover:text-rose-400 transition-colors">{blocker.title}</span>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase font-bold">
                       <span className="flex items-center gap-1 text-rose-500/60"><Clock size={10} /> Since {blocker.since}</span>
                       <span className="text-slate-700">|</span>
                       <span>Reason: {blocker.reason}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-800 group-hover:text-rose-500" />
                </div>
              ))}
              {blockers.length === 0 && (
                <div className="p-12 text-center bg-emerald-500/[0.02] border border-emerald-500/10 rounded-lg">
                   <CheckCircle2 size={32} className="mx-auto mb-3 text-emerald-500/40" />
                   <p className="text-emerald-500/60 uppercase tracking-widest text-[10px] font-black">All operational paths cleared</p>
                </div>
              )}
            </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-6">
          <DashboardSection title="TEAM WORKLOAD">
            <div className="overflow-hidden bg-slate-900/10 border border-slate-800/30 rounded-lg">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/40 text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black">
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-2 text-center">Tasks</th>
                    <th className="py-3 px-2 text-center">Load Profile</th>
                    <th className="py-3 px-4 text-right">Capacity</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] font-bold">
                  {teamWorkload.map((member, i) => (
                    <tr key={i} className="border-b border-slate-900/50">
                      <td className="py-4 px-4 text-slate-200 uppercase">{member.member}</td>
                      <td className="py-4 px-2 text-center text-slate-400 font-mono">{member.tasks}</td>
                      <td className="py-4 px-2">
                        <div className="flex flex-col gap-1.5 items-center">
                           <span className={member.load > 100 ? 'text-rose-500' : 'text-slate-400'}>{member.load}%</span>
                           <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${member.load > 100 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : member.load > 85 ? 'bg-amber-500' : 'bg-sky-500/50'}`} 
                                style={{ width: `${Math.min(member.load, 100)}%` }}
                              ></div>
                           </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                         <div className={`w-2 h-2 rounded-full inline-block ${member.status === 'red' ? 'bg-rose-500 animate-pulse' : member.status === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500/40'}`}></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>
        </div>

          <DashboardSection title="SPRINT VELOCITY">
              <div id="burndown" className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800/50 flex flex-col items-center">
                       <span className="text-[9px] text-slate-600 uppercase font-black mb-1">Total Tasks</span>
                       <span className="text-2xl font-black text-white">{burndown.planned}</span>
                    </div>
                    <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800/50 flex flex-col items-center">
                       <span className="text-[9px] text-emerald-500/70 uppercase font-black mb-1">Completed</span>
                       <span className="text-2xl font-black text-emerald-500">{burndown.completed}</span>
                    </div>
                 </div>

                 <div className="relative h-24 w-full bg-slate-900/50 rounded border border-slate-800/30 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-sky-500/5 to-transparent"></div>
                    <span className="text-[9px] text-slate-600 uppercase font-bold tracking-[0.3em] font-mono animate-pulse">Telemetry Live: Burndown</span>
                    <svg className="absolute bottom-0 left-0 w-full h-16 opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0 10 L25 25 L50 20 L75 60 L100 55" fill="none" stroke="#0ea5e9" strokeWidth="2" />
                      <path d="M0 10 L25 25 L50 20 L75 60 L100 55 L100 100 L0 100 Z" fill="url(#burndowngrad)" />
                      <defs>
                        <linearGradient id="burndowngrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{stopColor:'rgb(14, 165, 233)', stopOpacity:0.3}} />
                          <stop offset="100%" style={{stopColor:'rgb(14, 165, 233)', stopOpacity:0}} />
                        </linearGradient>
                      </defs>
                    </svg>
                 </div>

                 <div className="flex justify-between items-center bg-slate-900/30 p-3 rounded border border-slate-800/30">
                    <div className="flex flex-col">
                       <span className="text-2xl font-black text-amber-500">{burndown.daysLeft}</span>
                       <span className="text-[9px] text-slate-500 uppercase font-black">Days Remaining</span>
                    </div>
                    <div className="text-right">
                       <span className="text-xl font-black text-slate-300">{burndown.remaining}</span>
                       <span className="text-[9px] text-slate-500 uppercase font-black block">Tasks Left</span>
                    </div>
                 </div>
              </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-4">
          <DashboardSection title="TEAM ACTIVITY">
            <div id="em-feed" className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {activity.map((item, i) => (
                <div key={i} className="flex gap-4 group p-2 rounded hover:bg-white/[0.02] transition-colors border-l border-slate-800">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-sky-500 mt-1 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
                    <div className="w-[1px] h-full bg-slate-800 my-1"></div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-slate-200 font-black uppercase tracking-tight">{item.text}</span>
                    <span className="text-[9px] text-slate-600 font-bold uppercase">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-4">
           {/* 8. Task Distribution Insight */}
            <DashboardSection title="TASK DISTRIBUTION">
               <div id="distribution" className="space-y-6">
                  <div className="space-y-3">
                     <DistributionBar label="Backend" value={distribution.backend} total={distribution.backend + distribution.frontend + distribution.qa + distribution.other} color="bg-sky-500" />
                     <DistributionBar label="Frontend" value={distribution.frontend} total={distribution.backend + distribution.frontend + distribution.qa + distribution.other} color="bg-purple-500" />
                     <DistributionBar label="QA / Test" value={distribution.qa} total={distribution.backend + distribution.frontend + distribution.qa + distribution.other} color="bg-emerald-500" />
                  </div>

                  {distribution.imbalance && (
                    <div className="mt-8 p-4 bg-rose-500/5 border border-rose-500/20 rounded flex items-start gap-3">
                        <AlertTriangle size={16} className="text-rose-500 mt-0.5" />
                        <div>
                           <span className="text-[10px] font-black text-rose-500 uppercase block mb-1">Imbalance Detected</span>
                           <p className="text-[11px] text-rose-300 font-bold italic leading-tight uppercase underline decoration-rose-500/50 underline-offset-4">{distribution.imbalance}</p>
                        </div>
                    </div>
                  )}
               </div>
            </DashboardSection>
        </div>

      </div>

      {/* 7. Priority Focus Section (Sticky Bottom Strip) */}
      <div id="focus" className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f18]/80 backdrop-blur-2xl border-t border-slate-800 p-4 h-20 flex items-center justify-center">
         <div className="max-w-6xl w-full flex items-center justify-between gap-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                  <Flame size={20} className="animate-pulse" />
               </div>
               <div>
                  <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Execution Focus</h4>
                  <p className="text-xs font-black text-white uppercase italic">Critical path management</p>
               </div>
            </div>

            <div className="flex-1 hidden md:flex items-center gap-4 overflow-x-hidden">
               {focusToday.map((item, i) => (
                 <div key={i} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full whitespace-nowrap animate-in slide-in-from-right-4 fade-in duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                    <span className="text-[9px] font-black text-slate-500">{i + 1}.</span>
                    <span className="text-[11px] text-slate-200 font-black uppercase tracking-tight">{item}</span>
                 </div>
               ))}
            </div>

            <button className="flex items-center gap-2 bg-white text-black font-black uppercase text-[10px] px-6 py-2.5 rounded-full hover:bg-sky-400 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] active:scale-95 group">
               Complete Active Task <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
    <div className="space-y-1.5">
       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
          <span className="text-slate-400">{label}</span>
          <span className="text-slate-200">{percent}%</span>
       </div>
       <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-1000 ease-out`} 
            style={{ width: `${percent}%` }}
          ></div>
       </div>
    </div>
  );
};

const getPriorityColor = (p) => {
  switch (p?.toLowerCase()) {
    case 'high': return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]';
    case 'medium': return 'bg-amber-500';
    case 'low': return 'bg-sky-500/40';
    default: return 'bg-slate-700';
  }
};

const getPriorityTextColor = (p) => {
  switch (p?.toLowerCase()) {
    case 'high': return 'text-rose-500';
    case 'medium': return 'text-amber-500';
    case 'low': return 'text-sky-500/70';
    default: return 'text-slate-600';
  }
};

const getDueColor = (due) => {
  if (due === 'Today') return 'text-amber-500 font-black animate-pulse';
  if (due === 'Overdue') return 'text-rose-500 font-black underline decoration-rose-500/50 underline-offset-4';
  if (due === 'Tomorrow') return 'text-sky-400';
  return 'text-slate-600';
};

export default EMDashboard;

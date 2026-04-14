import CenteredLoading from '../components/atoms/CenteredLoading';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import { AlertTriangle, Clock, Shield, Target, Users, TrendingDown, TrendingUp, Minus, Activity } from 'lucide-react';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import SystemIntegrityStatus from '../components/dashboard/SystemIntegrityStatus';


/**
 * VP Engineering Dashboard
 * High-level overview of engineering execution and performance.
 */
const VPEDashboard = () => {
  const {
    data,
    isLoading,
    error,
    drilldown,
    handleDrilldown,
    closeDrilldown
  } = useRoleDashboard('vpe');

  if (isLoading || !data) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <CenteredLoading />
        <span className="text-white/60 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Syncing Execution Data...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-8 text-status-error bg-black h-screen font-mono flex items-center justify-center uppercase font-black">
      <div className="border border-status-error/40 p-8 rounded-2xl bg-black max-w-md text-center shadow-3xl">
        <AlertTriangle className="mx-auto mb-6 text-status-error" size={48} />
        <h2 className="text-2xl font-black mb-4 tracking-tighter">Connection Failure</h2>
        <p className="text-[11px] text-white/60 tracking-widest leading-loose">{error?.message || 'The tactical data stream has been interrupted.'}</p>
      </div>
    </div>
  );

  const { 
    executionStats = { projectsDelayed: 0, avgSprintDelay: '0d', activeBlockers: 0, teamsOverloaded: 0, velocityTrend: { direction: 'stable', value: '0%' } }, 
    teamGrid = [], 
    sprintExecution = { progress: 0, risk: 'UNKNOWN', completed: 0, inProgress: 0, blocked: 0 }, 
    blockers = {}, 
    timeline = [], 
    activity = [] 
  } = data;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 font-mono selection:bg-primary">
      
      {/* Execution Overview */}
      <div id="vp-top" className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <MetricStripItem 
            icon={<AlertTriangle size={14} />} 
            label="Projects Delayed" 
            value={executionStats.projectsDelayed} 
            color="text-status-error" 
            accent="bg-status-error"
        />
        <MetricStripItem 
            icon={<Clock size={14} />} 
            label="Avg Sprint Delay" 
            value={executionStats.avgSprintDelay} 
            color="text-status-warning" 
            accent="bg-status-warning"
        />
        <MetricStripItem 
            icon={<Shield size={14} />} 
            label="Active Blockers" 
            value={executionStats.activeBlockers} 
            color="text-primary" 
            accent="bg-primary"
        />
        <MetricStripItem 
            icon={<Users size={14} />} 
            label="Teams Overloaded" 
            value={executionStats.teamsOverloaded} 
            color="text-status-warning" 
            accent="bg-status-warning"
        />
        <MetricStripItem 
            icon={executionStats.velocityTrend.direction === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />} 
            label="Velocity Trend" 
            value={executionStats.velocityTrend.value} 
            color={executionStats.velocityTrend.direction === 'down' ? 'text-status-error' : 'text-status-success'} 
            accent={executionStats.velocityTrend.direction === 'down' ? 'bg-status-error' : 'bg-status-success'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Section - Team Performance Grid */}
        <div className="lg:col-span-8 space-y-6">
          
          <DashboardSection title="TEAM PERFORMANCE" icon={<Users size={12} />}>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/30 text-white/50 text-[10px] uppercase tracking-[0.2em] font-black">
                    <th className="py-4 px-4 bg-black">Functional Team</th>
                    <th className="py-4 px-4 bg-black text-center">Sprint Progress</th>
                    <th className="py-4 px-4 bg-black text-center">Velocity</th>
                    <th className="py-4 px-4 bg-black text-center">Avg Load</th>
                    <th className="py-4 px-4 bg-black text-center">Blockers</th>
                    <th className="py-4 px-4 bg-black text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {teamGrid.map((row, i) => (
                    <tr key={i} 
                      onClick={() => handleDrilldown(row.team)}
                      className="border-b border-white/[0.05] hover:bg-white/5 transition-all cursor-pointer group">
                      <td className="py-5 px-4 font-black text-white group-hover:text-primary transition-colors uppercase tracking-widest text-[11px]">
                        {row.team} Team
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex flex-col items-center gap-2">
                           <span className="text-[11px] font-black text-white/50">{row.progress}</span>
                           <div className="w-24 h-1.5 bg-black border border-white/30 rounded-full overflow-hidden">
                             <div 
                                className={`h-full ${parseInt(row.progress) > 70 ? 'bg-status-success' : parseInt(row.progress) > 40 ? 'bg-status-warning' : 'bg-status-error'}`} 
                                style={{ width: row.progress }}
                             ></div>
                           </div>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <VelocityIndicator direction={row.velocity} />
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${parseInt(row.load) > 100 ? 'bg-status-error/10 text-status-error border border-status-error/40' : 'bg-black border border-white/30 text-white/50'}`}>
                          {row.load}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`font-black text-[11px] uppercase tracking-widest ${row.blockers > 0 ? 'text-status-error animate-pulse' : 'text-white/20'}`}>
                          {row.blockers} BK
                        </span>
                      </td>
                      <td className="py-5 px-4 text-right">
                        <StatusIndicator color={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {teamGrid.map((row, i) => (
                <div key={i} 
                  onClick={() => handleDrilldown(row.team)}
                  className="bg-white/[0.03] border border-white/20 p-5 rounded-2xl group transition-all active:bg-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black text-white group-hover:text-primary transition-colors uppercase tracking-widest text-[11px]">{row.team} Unit</span>
                    <StatusIndicator color={row.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-1">
                      <span className="text-[8px] text-white/50 uppercase tracking-widest font-black">Sprint Progress</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-black border border-white/20 rounded-full overflow-hidden">
                          <div className={`h-full ${parseInt(row.progress) > 70 ? 'bg-status-success' : parseInt(row.progress) > 40 ? 'bg-status-warning' : 'bg-status-error'}`} style={{ width: row.progress }}></div>
                        </div>
                        <span className="text-[9px] font-black text-white">{row.progress}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-white/50 uppercase tracking-widest font-black block mb-1">Blockers</span>
                      <span className={`font-black text-[10px] uppercase tracking-widest ${row.blockers > 0 ? 'text-status-error animate-pulse' : 'text-white/20'}`}>{row.blockers} ACTIVE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-black border border-white/30 rounded-xl text-[10px] text-white/60 uppercase tracking-[0.2em] flex items-center gap-3">
               <Shield size={14} className="text-primary" />
               Critical Insights: {teamGrid.some(t => t.status === 'red') ? "HIGH RISK DETECTION IN ACTIVE FUNCTIONAL PIPELINES. IMMEDIATE REBALANCING REQUIRED." : "SYSTEM PERFORMANCE WITHIN ACCEPTABLE EXECUTION PARAMETERS."}
            </div>
          </DashboardSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardSection title="Sprint Execution" icon={<Shield size={12} />}>
              <div className="space-y-6 py-2">
                <div id="sprint" className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] text-white/60 uppercase tracking-widest font-black">Progress</span>
                    <div className="text-3xl font-black text-white">{sprintExecution?.progress || 0}%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/60 uppercase tracking-widest font-black block mb-1">Spillover Risk</span>
                    <span className={`px-3 py-1 border rounded-lg text-[10px] font-black uppercase tracking-widest ${sprintExecution?.risk === 'HIGH' ? 'bg-status-error/10 text-status-error border-status-error/40' : 'bg-status-success/10 text-status-success border-status-success/40'}`}>
                        {sprintExecution?.risk || 'NONE'}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/30">
                  <div className="h-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${sprintExecution?.progress || 0}%` }}></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <SprintCounter label="Completed" value={`${sprintExecution?.completed || 0} TASKS`} color="text-status-success" />
                  <SprintCounter label="In Progress" value={sprintExecution?.inProgress || 0} color="text-primary" />
                  <SprintCounter label="Blocked" value={sprintExecution?.blocked || 0} color="text-status-error" className="col-span-2 sm:col-span-1" />
                </div>
                
                <div className="pt-2">
                   <div className="h-24 w-full bg-slate-900/50 rounded border border-slate-800/50 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-transparent"></div>
                      <span className="text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold">Burndown Chart</span>
                      {/* Placeholder for burndown using SVG */}
                      <svg className="absolute bottom-0 left-0 w-full h-12 opacity-30 group-hover:opacity-50 transition-opacity" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 20 L20 35 L40 30 L60 60 L80 55 L100 90 L100 100 L0 100 Z" fill="url(#grad)" />
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor:'rgb(14, 165, 233)', stopOpacity:0.5}} />
                            <stop offset="100%" style={{stopColor:'rgb(14, 165, 233)', stopOpacity:0}} />
                          </linearGradient>
                        </defs>
                        <path d="M0 20 L20 35 L40 30 L60 60 L80 55 L100 90" fill="none" stroke="#0ea5e9" strokeWidth="2" />
                      </svg>
                   </div>
                </div>
              </div>
            </DashboardSection>

            {/* 5. Team Load Distribution */}
            <DashboardSection title="Load Distribution" icon={<Target size={12} />}>
              <div className="space-y-5 py-2">
                {teamGrid.map((team, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-white/60">{team.team}</span>
                      <span className={parseInt(team.load) > 100 ? 'text-status-error' : 'text-white'}>{team.load} Load</span>
                    </div>
                    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-white/30">
                      <div 
                        className={`h-full transition-all duration-700 ${parseInt(team.load) > 100 ? 'bg-status-error' : parseInt(team.load) > 85 ? 'bg-status-warning' : 'bg-white/20'}`} 
                        style={{ width: `${Math.min(parseInt(team.load), 100)}%` }}
                      ></div>
                    </div>
                    {parseInt(team.load) > 100 && (
                      <p className="text-[9px] text-status-error font-black uppercase tracking-widest">Rebalance Recommended: Shift tasks to underloaded units.</p>
                    )}
                  </div>
                ))}

                <div className="mt-6 p-4 bg-black border border-primary/40 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <h4 className="text-[10px] font-black text-primary uppercase flex items-center gap-2 mb-2 tracking-widest">
                    <Target size={14} /> Strategic Analysis
                  </h4>
                  <p className="text-[11px] text-primary/80 uppercase font-black tracking-tight leading-relaxed">
                    SHIFT 2 HIGH-PRIORITY TASKS FROM {teamGrid.sort((a,b) => parseInt(b.load)-parseInt(a.load))[0]?.team.toUpperCase()} → {teamGrid.sort((a,b) => parseInt(a.load)-parseInt(b.load))[0]?.team.toUpperCase()} TO STABILIZE DELIVERY VELOCITY.
                  </p>
                </div>
              </div>
            </DashboardSection>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="lg:col-span-4 space-y-6">
          <SystemIntegrityStatus />
          
          <DashboardSection title="Team Blockers" icon={<AlertTriangle size={12} />}>

            <div id="vp-blockers" className="space-y-6">
              {Object.keys(blockers).map((teamName, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-status-error rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    {teamName} Team Blockers
                  </h4>
                  <ul className="space-y-3">
                    {blockers[teamName].map((item, i) => (
                      <li key={i} className="text-[11px] text-white/70 font-black uppercase tracking-tight flex items-start gap-3 bg-black p-3 rounded-xl border border-white/30 shadow-sm hover:border-primary/40 transition-all">
                        <span className="text-status-error font-black shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </DashboardSection>

          <DashboardSection title="Delivery Timeline" icon={<Clock size={12} />}>
            <div id="timeline" className="space-y-4">
                {timeline.map((item, idx) => (
                 <div key={idx} className="flex justify-between items-center p-4 bg-black rounded-xl border border-white/30 group hover:border-primary transition-all shadow-sm mb-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-black text-white group-hover:text-primary transition-colors uppercase tracking-widest">{item.project}</span>
                      <span className="text-[9px] text-white/50 uppercase font-black tracking-widest">System Drift Analysis</span>
                    </div>
                    <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border shadow-sm ${item.status === 'green' ? 'bg-status-success/10 text-status-success border-status-success/40' : item.status === 'yellow' ? 'bg-status-warning/10 text-status-warning border-status-warning/40' : 'bg-status-error/10 text-status-error border-status-error/40'}`}>
                      {item.drift}
                    </div>
                 </div>
               ))}
               <p className="text-[9px] text-white/20 text-center uppercase tracking-[0.3em] pt-4 font-black">Projections based on current team velocity trends</p>
            </div>
          </DashboardSection>

          {/* 7. Engineering Activity Feed */}
          <DashboardSection title="Engineering Activity" icon={<Activity size={12} />}>
            <div id="vp-feed" className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {activity?.map((item, i) => (
                <div key={i} className="flex justify-between items-start border-l border-white/30 pl-4 py-3 hover:bg-white/5 transition-colors rounded-r-xl group">
                  <p className="text-[11px] text-white/60 font-black uppercase tracking-tight leading-normal group-hover:text-white transition-colors">{item.text}</p>
                  <span className="text-[9px] text-white/20 whitespace-nowrap ml-3 uppercase font-black tracking-widest self-center">{item.time}</span>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>
      </div>

       {/* Team Drilldown Modal */}
       {drilldown.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black animate-in fade-in duration-300">
          <div className="bg-black border border-white/30 rounded-[2.5rem] w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
            <div className="p-6 md:p-10 border-b border-white/30 flex justify-between items-center bg-black">
              <div>
                <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter">
                  Unit Intelligence: {drilldown.category}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[8px] md:text-[10px] text-white/60 uppercase tracking-[0.4em] font-black">Functional Portfolio Operational Load Profiling // ACTIVE</span>
                </div>
              </div>
              <button 
                onClick={closeDrilldown} 
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-black border border-white/30 text-white/60 hover:text-primary hover:border-primary transition-all text-2xl md:text-3xl font-light"
              >
                ×
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
              {/* Desktop View */}
              <div className="hidden md:block">
                <table className="w-full text-left">
                  <thead className="bg-black sticky top-0 z-10 border-b border-white/30">
                    <tr className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-black">
                      <th className="py-5 px-8">Personnel</th>
                      <th className="py-5 px-8">Active Tasks</th>
                      <th className="py-5 px-8">Load Profile</th>
                      <th className="py-5 px-8 text-right">Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-black">
                    {drilldown.data.map((person, i) => (
                      <tr key={i} className="border-b border-white/[0.05] hover:bg-white/5 transition-colors group">
                        <td className="py-5 px-8">
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-white group-hover:text-primary uppercase tracking-tight transition-colors">{person.name}</span>
                            <span className="text-[9px] text-white/50 uppercase tracking-[0.2em]">{person.role}</span>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-white font-mono">{person.tasks} TASKS</td>
                        <td className="py-5 px-8">
                          <div className="flex flex-col gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${person.load > 100 ? 'text-status-error' : 'text-white/60'}`}>{person.load}%</span>
                            <div className="w-32 h-1.5 bg-black border border-white/30 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${person.load > 100 ? 'bg-status-error shadow-[0_0_10px_rgba(239,68,68,0.5)]' : person.load > 80 ? 'bg-status-warning' : 'bg-primary'}`} 
                                  style={{ width: `${Math.min(person.load, 100)}%` }}
                                ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <div className={`w-2 h-2 rounded-full inline-block ${person.status === 'red' ? 'bg-status-error shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-status-success shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden p-5 space-y-4">
                {drilldown.data.map((person, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/20 p-5 rounded-2xl group transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-white uppercase tracking-tight">{person.name}</span>
                        <span className="text-[9px] text-white/50 uppercase tracking-[0.2em]">{person.role}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${person.status === 'red' ? 'bg-status-error shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-status-success shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}></div>
                    </div>
                    <div className="mt-6 flex flex-col gap-3">
                       <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-widest text-white/60">
                          <span>Active Tasks</span>
                          <span className="text-white">{person.tasks} Entries</span>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                             <span className="text-white/40">Utilization</span>
                             <span className={person.load > 100 ? 'text-status-error' : 'text-white'}>{person.load}%</span>
                          </div>
                          <div className="w-full h-1 bg-black border border-white/10 rounded-full overflow-hidden">
                             <div className={`h-full ${person.load > 100 ? 'bg-status-error' : person.load > 80 ? 'bg-status-warning' : 'bg-primary'}`} style={{ width: `${Math.min(person.load, 100)}%` }}></div>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              {drilldown.data.length === 0 && (
                <div className="p-20 text-center">
                   <Users className="mx-auto mb-6 text-white/10" size={64} />
                   <p className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-black">No personnel linked to this functional unit in current cycle</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-black border-t border-white/20 flex justify-center">
               <div className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black">
                 Security Layer: Tactical Visibility Enforced
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};





const SprintCounter = ({ label, value, color }) => (
  <div className="bg-black p-3 rounded-xl border border-white/20 flex flex-col gap-1 text-center shadow-[0_0_15px_rgba(255,255,255,0.05)]">
    <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">{label}</span>
    <span className={`text-[12px] font-black uppercase tracking-tight ${color}`}>{value}</span>
  </div>
);

const VelocityIndicator = ({ direction }) => {
  if (direction === 'up') return (
    <div className="flex items-center justify-center gap-2 text-status-success bg-black px-3 py-1.5 rounded-xl border border-status-success/40 w-full mx-auto shadow-[0_0_15px_rgba(34,197,94,0.2)]">
      <TrendingUp size={14} strokeWidth={3} />
      <span className="text-[10px] font-black uppercase tracking-widest">Optimal Flow</span>
    </div>
  );
  if (direction === 'down') return (
    <div className="flex items-center justify-center gap-2 text-status-error bg-black px-3 py-1.5 rounded-xl border border-status-error/40 w-full mx-auto shadow-[0_0_15px_rgba(239,68,68,0.2)]">
      <TrendingDown size={14} strokeWidth={3} />
      <span className="text-[10px] font-black uppercase tracking-widest">Restricted Flow</span>
    </div>
  );
  return (
    <div className="flex items-center justify-center gap-2 text-white/40 bg-black px-3 py-1.5 rounded-xl border border-white/20 w-full mx-auto shadow-none">
      <Minus size={14} strokeWidth={3} />
      <span className="text-[10px] font-black uppercase tracking-widest">Stable Trend</span>
    </div>
  );
};

const StatusIndicator = ({ color }) => {
  const colors = {
    red: 'bg-status-error shadow-[0_0_12px_rgba(239,68,68,0.5)]',
    yellow: 'bg-status-warning shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    green: 'bg-status-success shadow-[0_0_12px_rgba(34,197,94,0.5)]'
  };
  return (
    <div className="flex items-center justify-end gap-3">
       <span className={`text-[10px] font-black uppercase tracking-widest ${color === 'red' ? 'text-status-error' : color === 'yellow' ? 'text-status-warning' : 'text-status-success'}`}>
         {color === 'red' ? 'Critical' : color === 'yellow' ? 'At Risk' : 'Healthy'}
       </span>
       <div className={`w-2 h-2 rounded-full ${colors[color] || 'bg-white/20'} animate-pulse`}></div>
    </div>
  );
};

export default VPEDashboard;

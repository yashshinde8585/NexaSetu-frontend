import CenteredLoading from '../components/atoms/CenteredLoading';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import { AlertTriangle, Clock, Shield, Target, Users, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';

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
    <div className="h-screen flex items-center justify-center bg-[#0a0f18]">
      <div className="flex flex-col items-center gap-4">
        <CenteredLoading />
        <span className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">Syncing data...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-8 text-rose-500 bg-[#0a0f18] h-screen font-mono flex items-center justify-center">
      <div className="border border-rose-900/50 p-6 rounded bg-rose-950/20 max-w-md text-center">
        <AlertTriangle className="mx-auto mb-4" size={40} />
        <h2 className="text-xl font-black mb-2 uppercase">Connection Failure</h2>
        <p className="text-sm text-rose-300/70">{error?.message || 'The data stream has been interrupted.'}</p>
      </div>
    </div>
  );

  const { executionStats, teamGrid, sprintExecution, blockers, timeline, activity } = data;

  return (
    <div className="min-h-screen bg-[#0a0f18] text-slate-300 p-4 md:p-6 font-mono selection:bg-sky-500/30">
      
      {/* Execution Overview */}
      <div id="vp-top" className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <MetricStripItem 
            icon={<AlertTriangle size={14} />} 
            label="Projects Delayed" 
            value={executionStats.projectsDelayed} 
            color="text-rose-500" 
        />
        <MetricStripItem 
            icon={<Clock size={14} />} 
            label="Avg Sprint Delay" 
            value={executionStats.avgSprintDelay} 
            color="text-amber-500" 
        />
        <MetricStripItem 
            icon={<Shield size={14} />} 
            label="Active Blockers" 
            value={executionStats.activeBlockers} 
            color="text-sky-500" 
        />
        <MetricStripItem 
            icon={<Users size={14} />} 
            label="Teams Overloaded" 
            value={executionStats.teamsOverloaded} 
            color="text-orange-500" 
        />
        <MetricStripItem 
            icon={executionStats.velocityTrend.direction === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />} 
            label="Velocity Trend" 
            value={executionStats.velocityTrend.value} 
            color={executionStats.velocityTrend.direction === 'down' ? 'text-rose-500' : 'text-emerald-500'} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Section - Team Performance Grid */}
        <div className="lg:col-span-8 space-y-6">
          
          <DashboardSection title="TEAM PERFORMANCE" icon={<Users size={12} />}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-widest font-black">
                    <th className="py-4 px-4 bg-slate-900/30">Functional Team</th>
                    <th className="py-4 px-4 bg-slate-900/30 text-center">Sprint Progress</th>
                    <th className="py-4 px-4 bg-slate-900/30 text-center">Velocity</th>
                    <th className="py-4 px-4 bg-slate-900/30 text-center">Avg Load</th>
                    <th className="py-4 px-4 bg-slate-900/30 text-center">Blockers</th>
                    <th className="py-4 px-4 bg-slate-900/30 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {teamGrid.map((row, i) => (
                    <tr key={i} 
                      onClick={() => handleDrilldown(row.team)}
                      className="border-b border-slate-900 hover:bg-slate-900/40 transition-all cursor-pointer group">
                      <td className="py-5 px-4 font-black text-slate-100 group-hover:text-sky-400 transition-colors uppercase tracking-tight">
                        {row.team} Team
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex flex-col items-center gap-2">
                           <span className="text-[11px] font-bold text-slate-400">{row.progress}</span>
                           <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                             <div 
                                className={`h-full ${parseInt(row.progress) > 70 ? 'bg-emerald-500' : parseInt(row.progress) > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                                style={{ width: row.progress }}
                             ></div>
                           </div>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <VelocityIndicator direction={row.velocity} />
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-black ${parseInt(row.load) > 100 ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'bg-slate-800/50 text-slate-400'}`}>
                          {row.load}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`font-mono ${row.blockers > 0 ? 'text-rose-500 font-black animate-pulse' : 'text-slate-600'}`}>
                          {row.blockers}
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
            <div className="mt-4 p-3 bg-slate-900/30 border border-slate-800 rounded text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Shield size={12} className="text-sky-500" />
               Critical Insights: {teamGrid.some(t => t.status === 'red') ? "High risk detection in active functional pipelines. Immediate rebalancing required." : "System performance within acceptable execution parameters."}
            </div>
          </DashboardSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardSection title="Sprint Execution" icon={<Shield size={12} />}>
              <div className="space-y-6 py-2">
                <div id="sprint" className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Progress</span>
                    <div className="text-3xl font-black text-white">{sprintExecution.progress}%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Spillover Risk</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-black uppercase tracking-widest ${sprintExecution.risk === 'HIGH' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {sprintExecution.risk}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-1000" style={{ width: `${sprintExecution.progress}%` }}></div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <SprintCounter label="Completed" value={`${sprintExecution.completed} tasks`} color="text-emerald-500" />
                  <SprintCounter label="In Progress" value={sprintExecution.inProgress} color="text-sky-500" />
                  <SprintCounter label="Blocked" value={sprintExecution.blocked} color="text-rose-500" />
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
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight">
                      <span className="text-slate-400">{team.team}</span>
                      <span className={parseInt(team.load) > 100 ? 'text-rose-500' : 'text-slate-200'}>{team.load} Load</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 ${parseInt(team.load) > 100 ? 'bg-rose-500' : parseInt(team.load) > 85 ? 'bg-amber-500' : 'bg-slate-500'}`} 
                        style={{ width: `${Math.min(parseInt(team.load), 100)}%` }}
                      ></div>
                    </div>
                    {parseInt(team.load) > 100 && (
                      <p className="text-[9px] text-rose-500 italic uppercase">Rebalance Recommended: Shift tasks to underloaded units.</p>
                    )}
                  </div>
                ))}

                <div className="mt-6 p-3 bg-sky-500/5 border border-sky-500/20 rounded">
                  <h4 className="text-[10px] font-black text-sky-500 uppercase flex items-center gap-1 mb-2">
                    <Target size={12} /> Analysis
                  </h4>
                  <p className="text-[11px] text-sky-300 italic">
                    Shift 2 high-priority tasks from {teamGrid.sort((a,b) => parseInt(b.load)-parseInt(a.load))[0]?.team} → {teamGrid.sort((a,b) => parseInt(a.load)-parseInt(b.load))[0]?.team} to stabilize delivery velocity.
                  </p>
                </div>
              </div>
            </DashboardSection>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="lg:col-span-4 space-y-6">
          
          <DashboardSection title="Team Blockers" icon={<AlertTriangle size={12} />}>
            <div id="vp-blockers" className="space-y-6">
              {Object.keys(blockers).map((teamName, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                    {teamName} Team
                  </h4>
                  <ul className="space-y-2">
                    {blockers[teamName].map((item, i) => (
                      <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2 bg-slate-900/50 p-2 rounded border border-transparent hover:border-slate-800 transition-colors">
                        <span className="text-rose-500/50 mt-0.5">•</span>
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
                 <div key={idx} className="flex justify-between items-center p-3 bg-slate-900/40 rounded border border-slate-800 group hover:border-slate-700 transition-all">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-sky-400 transition-colors uppercase">{item.project}</span>
                      <span className="text-[10px] text-slate-600 tracking-tighter uppercase font-bold">Current Drift Analysis</span>
                    </div>
                    <div className={`text-[11px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${item.status === 'green' ? 'bg-emerald-500/10 text-emerald-500' : item.status === 'yellow' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {item.drift}
                    </div>
                 </div>
               ))}
               <p className="text-[9px] text-slate-600 text-center uppercase tracking-widest pt-2 italic">Projections based on current team velocity trends</p>
            </div>
          </DashboardSection>

          {/* 7. Engineering Activity Feed */}
          <DashboardSection title="Engineering Activity" icon={<Activity size={12} />}>
            <div id="vp-feed" className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {activity?.map((item, i) => (
                <div key={i} className="flex flex-col gap-1 border-l-2 border-slate-900 pl-4 py-1 hover:border-sky-500/50 transition-all group">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">{item.time}</span>
                    <div className="w-1 h-1 bg-slate-800 rounded-full group-hover:bg-sky-500 transition-colors"></div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-black tracking-tight uppercase group-hover:text-slate-200">{item.text}</p>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>
      </div>

       {/* Team Drilldown Modal */}
       {drilldown.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0a0f18] border border-slate-800 rounded-xl w-full max-w-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic">
                  Team Drill-Down: {drilldown.category}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 underline decoration-sky-500/50 underline-offset-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono italic">Functional Unit Operations & Load Profiling [V1.0]</span>
                </div>
              </div>
              <button 
                onClick={closeDrilldown} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800 text-xl font-mono"
              >
                ×
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left font-mono">
                <thead className="bg-[#0e141f] sticky top-0 z-10 border-b border-slate-800">
                  <tr className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-black">
                    <th className="py-4 px-6">Personnel</th>
                    <th className="py-4 px-6">Active Tasks</th>
                    <th className="py-4 px-6">Load Profile</th>
                    <th className="py-4 px-6 text-right">Capacity</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {drilldown.data.map((person, i) => (
                    <tr key={i} className="border-b border-slate-900 hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-100 group-hover:text-sky-400 uppercase tracking-tighter transition-colors">{person.name}</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest">{person.role}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-bold">{person.tasks}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                           <span className={`text-xs font-black ${person.load > 100 ? 'text-rose-500' : 'text-slate-300'}`}>{person.load}%</span>
                           <div className="w-24 h-1 bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${person.load > 100 ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : person.load > 80 ? 'bg-amber-500' : 'bg-slate-700'}`} 
                                style={{ width: `${Math.min(person.load, 100)}%` }}
                              ></div>
                           </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className={`w-2 h-2 rounded-full inline-block ${person.status === 'red' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-emerald-500 opacity-60'}`}></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {drilldown.data.length === 0 && (
                <div className="p-12 text-center">
                   <Users className="mx-auto mb-4 text-slate-800" size={48} />
                   <p className="text-slate-600 uppercase tracking-widest text-xs font-bold font-mono">No personnel linked to this functional unit in current cycle</p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-center">
               <div className="text-[9px] text-slate-600 uppercase tracking-[0.4em] font-black italic">
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
  <div className="bg-slate-900/50 p-2 rounded border border-slate-800 flex flex-col gap-1 text-center">
    <span className="text-[9px] text-slate-500 uppercase font-black">{label}</span>
    <span className={`text-sm font-black ${color}`}>{value}</span>
  </div>
);

const VelocityIndicator = ({ direction }) => {
  if (direction === 'up') return (
    <div className="flex items-center justify-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit mx-auto">
      <TrendingUp size={12} strokeWidth={3} />
      <span className="text-[10px] font-black italic">OPTIMAL</span>
    </div>
  );
  if (direction === 'down') return (
    <div className="flex items-center justify-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 w-fit mx-auto">
      <TrendingDown size={12} strokeWidth={3} />
      <span className="text-[10px] font-black italic">DROPPING</span>
    </div>
  );
  return (
    <div className="flex items-center justify-center gap-1 text-slate-400 bg-slate-800/30 px-2 py-0.5 rounded w-fit mx-auto border border-slate-700/50">
      <Minus size={12} strokeWidth={3} />
      <span className="text-[10px] font-black italic">STABLE</span>
    </div>
  );
};

const StatusIndicator = ({ color }) => {
  const colors = {
    red: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]',
    yellow: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    green: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
  };
  return (
    <div className="flex items-center justify-end gap-2">
       <span className={`text-[10px] font-black uppercase tracking-widest ${color === 'red' ? 'text-rose-500' : color === 'yellow' ? 'text-amber-500' : 'text-emerald-500'}`}>
         {color === 'red' ? 'Critical' : color === 'yellow' ? 'At Risk' : 'Healthy'}
       </span>
       <div className={`w-2 h-2 rounded-full ${colors[color] || 'bg-slate-700'} animate-pulse`}></div>
    </div>
  );
};

export default VPEDashboard;

import React from 'react';
import CenteredLoading from '../components/atoms/CenteredLoading';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import { AlertTriangle, Clock, Shield, Target, Users, TrendingDown, TrendingUp, Minus, Activity, ChevronRight, Zap, Target as TargetIcon, ShieldAlert, BarChart3, Terminal } from 'lucide-react';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';
import DrilldownModal from '../components/molecules/dashboard/DrilldownModal';
import SystemIntegrityStatus from '../components/dashboard/SystemIntegrityStatus';

/**
 * VP Engineering (VPE) Dashboard
 * High-level engineering execution and performance visibility.
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

  if (isLoading || !data) return <CenteredLoading />;
  
  if (error) return (
    <div className="p-12 text-status-error bg-black min-h-screen font-mono font-bold uppercase text-center flex items-center justify-center border border-status-error/20">
      {error?.message || 'CRITICAL_ERROR: SYSTEM_DATA_UNAVAILABLE'}
    </div>
  );

  const { 
    executionStats = { projectsDelayed: 0, avgSprintDelay: '0d', activeBlockers: 0, teamsOverloaded: 0, velocityTrend: { direction: 'stable', value: '0%' } }, 
    teamGrid = [], 
    sprintExecution = { progress: 0, risk: 'UNKNOWN', completed: 0, inProgress: 0, blocked: 0 }, 
    blockers = {}, 
    timeline = [], 
    activity = [] 
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1700px] mx-auto flex flex-col gap-12">
      
      {/* 1. Global Performance metrics */}
      <div id="vpe-execution-strip" className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricStripItem 
            icon={<AlertTriangle size={14} />} 
            label="Delayed Projects" 
            value={executionStats.projectsDelayed} 
            color="text-status-error" 
            accent="bg-status-error"
        />
        <MetricStripItem 
            icon={<Clock size={14} />} 
            label="Average Delay" 
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
            accent="bg-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 2. Main Column: Execution Metrics */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          <DashboardSection title="Team Performance Matrix" icon={<Terminal size={14} />}>
            <div className="overflow-x-auto py-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-white/30 uppercase font-bold tracking-widest border-b border-white/5">
                    <th className="pb-4 px-2">Team</th>
                    <th className="pb-4 px-2 text-center">Progress</th>
                    <th className="pb-4 px-2 text-center">Velocity</th>
                    <th className="pb-4 px-2 text-center">Load</th>
                    <th className="pb-4 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {teamGrid.map((row, i) => (
                    <tr key={i} 
                      onClick={() => handleDrilldown(row.team)}
                      className="group hover:bg-white/[0.015] transition-all cursor-pointer">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-4">
                          <span className="text-[12px] font-bold text-white group-hover:text-primary transition-colors uppercase tracking-tight">{row.team}</span>
                          {row.blockers > 0 && <span className="text-[8px] text-status-error font-bold uppercase tracking-widest tabular-nums">{row.blockers} BLOCKED</span>}
                        </div>
                      </td>
                      <td className="py-4 px-2">
                         <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-bold text-white/40 tabular-nums">{row.progress}</span>
                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <div 
                                 className={`h-full ${parseInt(row.progress) > 70 ? 'bg-status-success' : parseInt(row.progress) > 40 ? 'bg-status-warning' : 'bg-status-error'} transition-all duration-700`} 
                                 style={{ width: row.progress }}
                              ></div>
                            </div>
                         </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex justify-center">
                           <VelocityIndicator direction={row.velocity} />
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-widest leading-none ${parseInt(row.load) > 100 ? 'text-status-error border-status-error/30 bg-status-error/5' : 'text-white/40 border-white/5 bg-white/5'}`}>
                          {row.load}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <StatusIndicator color={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <DashboardSection title="Sprint Progress" icon={<BarChart3 size={14} />}>
              <div className="flex flex-col gap-10 py-4 px-2">
                <div className="flex justify-between items-end leading-none">
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Aggregate Progress</span>
                    <div className="text-5xl font-bold text-white tracking-tighter tabular-nums">{sprintExecution?.progress || 0}%</div>
                  </div>
                  <div className="pb-1">
                    <span className={`px-4 py-1.5 border rounded text-[10px] font-bold uppercase tracking-[0.2em] leading-none ${sprintExecution?.risk === 'HIGH' ? 'bg-status-error/5 text-status-error border-status-error/30' : 'bg-status-success/5 text-status-success border-status-success/30'}`}>
                        RISK: {sprintExecution?.risk || 'NONE'}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${sprintExecution?.progress || 0}%` }}></div>
                </div>

                <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 rounded overflow-hidden">
                  <SprintCounter label="COMPLETED" value={sprintExecution?.completed || 0} color="text-status-success" />
                  <SprintCounter label="IN PROGRESS" value={sprintExecution?.inProgress || 0} color="text-primary" />
                  <SprintCounter label="BLOCKED" value={sprintExecution?.blocked || 0} color="text-status-error" />
                </div>
              </div>
            </DashboardSection>

            <DashboardSection title="Recommendations" icon={<TargetIcon size={14} />}>
              <div className="flex flex-col gap-8 py-4 px-2">
                <div className="bg-white/[0.015] border border-white/5 p-6 rounded group hover:border-primary/40 transition-all border-l-2 border-l-primary/40">
                  <h4 className="text-[10px] font-bold text-primary uppercase flex items-center gap-3 mb-4 tracking-widest leading-none">
                    <Zap size={14} fill="currentColor" /> Optimization Suggestion
                  </h4>
                  <p className="text-[12px] text-white/60 uppercase font-bold tracking-tight leading-relaxed italic">
                    Re-allocate resources to {teamGrid.sort((a,b) => parseInt(a.load)-parseInt(b.load))[0]?.team || 'available'} team to reduce workload in high-load areas.
                  </p>
                </div>
                
                <div className="flex flex-col gap-5">
                   {teamGrid.slice(0, 3).map((team, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end text-[9px] font-bold uppercase tracking-widest leading-none">
                        <span className="text-white/20">{team.team}</span>
                        <span className={parseInt(team.load) > 100 ? 'text-status-error' : 'text-white/40 tabular-nums'}>{team.load}</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className={`h-full transition-all duration-1000 ${parseInt(team.load) > 100 ? 'bg-status-error' : parseInt(team.load) > 85 ? 'bg-status-warning' : 'bg-primary/40'}`} 
                          style={{ width: `${Math.min(parseInt(team.load), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardSection>
          </div>
        </div>

        {/* 3. Sidebar Column: Intelligence Registries */}
        <div className="lg:col-span-4 flex flex-col gap-12">
          <SystemIntegrityStatus />
          
          <DashboardSection title="Top Blockers" icon={<ShieldAlert size={14} />}>
            <div className="flex flex-col gap-px bg-white/10 border border-white/10 rounded overflow-hidden mt-2">
              {Object.keys(blockers).map((teamName, idx) => (
                <div key={idx} className="bg-black p-6 border-b border-white/[0.05] last:border-0 flex flex-col gap-4">
                  <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-3">
                    <div className="w-1 h-3 bg-status-error" />
                    {teamName}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {blockers[teamName].map((item, i) => (
                      <div key={i} className="text-[11px] text-white/60 font-bold uppercase tracking-tight flex items-start gap-4 p-4 bg-white/[0.015] border border-white/5 rounded group hover:border-status-error/40 transition-all italic leading-tight">
                        <span className="text-status-error shrink-0">::</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(blockers).length === 0 && (
                <div className="py-20 text-center opacity-10 italic border border-white/5 border-dashed rounded">
                  <span className="text-[10px] uppercase font-bold tracking-[0.4em]">No critical blockers found.</span>
                </div>
              )}
            </div>
          </DashboardSection>

          <DashboardSection title="Timeline Risks" icon={<Clock size={14} />}>
            <div className="flex flex-col gap-3 py-2">
                {timeline.map((item, idx) => (
                 <div key={idx} className="flex justify-between items-center p-6 bg-white/[0.015] border border-white/5 rounded group hover:border-primary/40 transition-all">
                    <div className="flex flex-col gap-2">
                      <span className="text-[12px] font-bold text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-none">{item.project}</span>
                      <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest leading-none">Schedule Delay</span>
                    </div>
                    <div className={`text-[10px] font-bold uppercase px-3 py-1 rounded border tabular-nums tracking-widest leading-none ${item.status === 'green' ? 'bg-status-success/5 text-status-success border-status-success/30' : item.status === 'yellow' ? 'bg-status-warning/5 text-status-warning border-status-warning/30' : 'bg-status-error/5 text-status-error border-status-error/30'}`}>
                      {item.drift}
                    </div>
                 </div>
               ))}
            </div>
          </DashboardSection>
          
          <DashboardSection title="Recent Activity" icon={<Activity size={14} />}>
            <div className="space-y-px max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {activity?.map((item, i) => (
                <ActivityItem key={i} text={item.text} time={item.time} mini />
              ))}
            </div>
          </DashboardSection>
        </div>
      </div>

       {/* Drilldown Modal */}
       {drilldown.isOpen && (
         <DrilldownModal 
          isOpen={drilldown.isOpen}
          onClose={closeDrilldown}
          title={`${drilldown.category} Overview`}
          subtitle="Detailed team workload and operational status."
          data={drilldown.data}
         />
       )}
    </div>
  );
};

const SprintCounter = ({ label, value, color }) => (
  <div className="bg-black p-6 flex flex-col gap-2 text-center group hover:bg-white/[0.02] transition-colors">
    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest leading-none mb-1">{label}</span>
    <span className={`text-[16px] font-bold uppercase tracking-widest tabular-nums leading-none ${color}`}>{value}</span>
  </div>
);

const VelocityIndicator = ({ direction }) => {
  if (direction === 'up') return (
    <div className="flex items-center gap-2 text-status-success bg-status-success/5 px-3 py-1 rounded border border-status-success/30 leading-none">
      <TrendingUp size={12} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Improving</span>
    </div>
  );
  if (direction === 'down') return (
    <div className="flex items-center gap-2 text-status-error bg-status-error/5 px-3 py-1 rounded border border-status-error/30 leading-none">
      <TrendingDown size={12} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Declining</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 text-white/30 bg-white/5 px-3 py-1 rounded border border-white/10 leading-none">
      <Minus size={12} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Stable</span>
    </div>
  );
};

const StatusIndicator = ({ color }) => {
  const labels = {
    red: 'Critical',
    yellow: 'At Risk',
    green: 'Healthy'
  };
  const colors = {
    red: 'text-status-error',
    yellow: 'text-status-warning',
    green: 'text-status-success'
  };
  const dots = {
    red: 'bg-status-error',
    yellow: 'bg-status-warning',
    green: 'bg-status-success'
  };
  return (
    <div className="flex items-center justify-end gap-3 leading-none">
       <span className={`text-[10px] font-bold uppercase tracking-widest ${colors[color] || 'text-white/40'}`}>
         {labels[color] || 'Healthy'}
       </span>
       <div className={`w-1.5 h-1.5 rounded-full ${dots[color] || 'bg-white/20'}`}></div>
    </div>
  );
};

export default VPEDashboard;

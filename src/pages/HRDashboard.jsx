import React from 'react';
import { 
  Users, Heart, TrendingUp, TrendingDown, AlertCircle, 
  Briefcase, Zap, Activity, ArrowRight, ShieldAlert, 
  UserPlus, Stethoscope, Target, BarChart2, RefreshCw, 
  Clock, LayoutGrid, ChevronRight
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';
import DrilldownModal from '../components/molecules/dashboard/DrilldownModal';

/**
 * HR / Workforce Engineering Dashboard
 * Focused on workforce health, capacity optimization, and organizational stability.
 */
const HRDashboard = () => {
  const { 
    data, 
    isLoading, 
    handleDrilldown, 
    drilldown, 
    closeDrilldown
  } = useRoleDashboard('hr');

  if (isLoading) return <CenteredLoading />;

  const { 
    workforceHealth = { totalEmployees: 0, avgUtilization: 0, overloadedTeams: 0, openPositions: 0, burnoutRisk: 'LOW' }, 
    teamCapacity = [], 
    individualSignals = [], 
    burnoutRisk = [], 
    hiringImpact = { openRoles: [], impactInsight: { text: 'NO_DATA' } }, 
    orgActivity = [],
    workforceTrend = { avgLoad: { now: 0, last: 0 }, hiringGap: { now: 0, last: 0 } },
    retentionSignals = [],
    rebalanceSuggestions = [] 
  } = data || {};

  return (
    <div className="min-h-screen bg-background text-text px-4 lg:px-6 py-2 lg:py-4 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      {/* 1. Workforce Integrity Strip */}
      <div id="people-metrics-strip" className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricStripItem 
            label="Total Headcount" 
            value={workforceHealth.totalEmployees} 
            icon={<Users size={14} />} 
            accent="bg-primary"
        />
        <MetricStripItem 
            label="Workload Index" 
            value={`${workforceHealth.avgUtilization}%`} 
            icon={<Activity size={14} />} 
            color={workforceHealth.avgUtilization > 90 ? 'text-status-error' : 'text-status-success'} 
            accent={workforceHealth.avgUtilization > 90 ? 'bg-status-error' : 'bg-status-success'}
        />
        <MetricStripItem 
            label="Overloaded Units" 
            value={workforceHealth.overloadedTeams} 
            icon={<ShieldAlert size={14} />} 
            color={workforceHealth.overloadedTeams > 0 ? 'text-status-error' : 'text-white/40'} 
            accent={workforceHealth.overloadedTeams > 0 ? 'bg-status-error' : 'bg-white/5'}
        />
        <MetricStripItem 
            label="Open Requisitions" 
            value={workforceHealth.openPositions} 
            icon={<Briefcase size={14} />} 
            accent="bg-white/10"
        />
        <MetricStripItem 
            label="Risk Status" 
            value={workforceHealth.burnoutRisk} 
            icon={<Heart size={14} />} 
            color={workforceHealth.burnoutRisk === 'HIGH' ? 'text-status-error' : 'text-status-success'} 
            accent={workforceHealth.burnoutRisk === 'HIGH' ? 'bg-status-error' : 'bg-status-success'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Workforce Capacity Hub */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            <DashboardSection title="Structural Capacity Matrix" icon={<LayoutGrid size={14} />}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="text-[8px] text-white/20 uppercase font-black tracking-[0.2em] border-b border-white/10">
                             <th className="py-3 px-3">ENGINEERING_UNIT</th>
                             <th className="py-3 px-3">HEADCOUNT</th>
                             <th className="py-3 px-3 w-1/3 text-center">UTILIZATION</th>
                             <th className="py-3 px-3 text-right">INTEGRITY</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5 text-[10px] font-black uppercase tracking-widest">
                          {teamCapacity?.map((t, idx) => (
                            <tr 
                              key={idx} 
                              className="group hover:bg-white/5 transition-colors cursor-pointer"
                              onClick={() => handleDrilldown(t.team, 'individual')}
                            >
                               <td className="py-3 px-3 text-white group-hover:text-primary transition-colors">{t.team}</td>
                               <td className="py-3 px-3 text-white/40">{t.headcount}</td>
                               <td className="py-3 px-3">
                                  <div className="flex flex-col items-center gap-1.5">
                                     <div className="w-24 h-0.5 bg-white/5 rounded-none overflow-hidden border border-white/5">
                                        <div className={`h-full ${t.load > 100 ? 'bg-status-error' : 'bg-primary'}`} style={{ width: `${Math.min(t.load, 100)}%` }} />
                                     </div>
                                     <span className={`text-[8px] font-black ${t.load > 100 ? 'text-status-error' : 'text-white/40'}`}>{t.load}%</span>
                                  </div>
                               </td>
                               <td className="py-3 px-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                     <span className={`text-[7px] font-black tracking-[0.2em] ${t.status === 'Overloaded' ? 'text-status-error' : 'text-status-success'}`}>
                                       {t.status === 'Overloaded' ? 'CRITICAL' : 'NOMINAL'}
                                     </span>
                                     <div className={`w-1.5 h-1.5 rounded-none ${t.status === 'Overloaded' ? 'bg-status-error' : 'bg-status-success'}`} />
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
            </DashboardSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DashboardSection title="Active Transitions" icon={<Briefcase size={14} />}>
                  <div className="flex flex-col gap-2">
                     {hiringImpact?.openRoles.map((role, idx) => (
                        <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-none flex justify-between items-center group hover:bg-white/10 transition-colors">
                           <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-black border border-white/10 text-primary rounded-none">
                                 <UserPlus size={12} />
                              </div>
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">{role.role}</span>
                           </div>
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-none border ${
                              role.urgency === 'Critical' ? 'bg-status-error/5 text-status-error border-status-error/20' : 'bg-white/5 text-white/20 border-white/10'
                           }`}>{role.count}_REQS</span>
                        </div>
                     ))}
                  </div>
               </DashboardSection>

               <DashboardSection title="Stability Directives" icon={<RefreshCw size={14} />}>
                  <div className="flex flex-col gap-2">
                      {rebalanceSuggestions?.map((sug, idx) => (
                        <div key={idx} className="flex gap-3 p-3 border-l-2 border-primary bg-white/5 rounded-none group hover:bg-white/10 transition-colors justify-between items-center">
                           <div className="flex gap-3">
                              <AlertCircle size={14} className="text-primary shrink-0" />
                              <div className="flex flex-col gap-1">
                                 <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{sug.suggestion}</span>
                                 <span className="text-[7px] text-primary/60 font-black uppercase tracking-[0.2em]">{sug.priority}_PRIORITY</span>
                              </div>
                           </div>
                           <button className="px-2 py-1 bg-primary text-black text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                              ACTIVATE
                           </button>
                        </div>
                      ))}
                  </div>
               </DashboardSection>
            </div>
        </div>

        {/* 3. Sidebar: Health & Signals */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <DashboardSection title="Integrity Signals" icon={<Stethoscope size={14} />}>
              <div className="flex flex-col gap-3">
                 {burnoutRisk?.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-none group hover:bg-white/10 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-none border ${r.risk === 'HIGH' ? 'bg-status-error/10 text-status-error border-status-error/20' : 'bg-status-warning/10 text-status-warning border-status-warning/20'}`}>
                             <ShieldAlert size={12} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{r.team}</span>
                             <span className="text-[7px] font-black uppercase text-white/20 tracking-[0.2em] leading-none">{r.risk}_RISK</span>
                          </div>
                       </div>
                       <div className={r.trend === 'increasing' ? 'text-status-error' : 'text-status-success'}>
                          {r.trend === 'increasing' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                       </div>
                    </div>
                 ))}
                 
                 <div className="mt-2 p-3 bg-primary/5 border border-primary/10 rounded-none flex items-start gap-3">
                    <Zap size={14} className="text-primary shrink-0" />
                    <div className="flex flex-col gap-1">
                        <h4 className="text-[8px] font-black text-primary uppercase tracking-[0.2em] leading-none">AI_STRUCTURAL_INSIGHT</h4>
                        <p className="text-[9px] font-black text-white/40 uppercase leading-relaxed tracking-widest italic"> 
                           "{hiringImpact?.impactInsight.text}"
                        </p>
                    </div>
                 </div>
              </div>
           </DashboardSection>

           <DashboardSection title="EVENT STREAM" icon={<Activity size={14} />}>
              <div className="flex flex-col gap-1">
                 {orgActivity?.slice(0, 4).map((act, idx) => (
                    <ActivityItem 
                      key={idx} 
                      icon={<Target size={10} />} 
                      text={act.text.toUpperCase()} 
                      time={act.time} 
                      type="info"
                    />
                 ))}
              </div>
           </DashboardSection>

           <DashboardSection title="Structural Dynamics" icon={<BarChart2 size={14} />}>
              <div className="flex flex-col gap-6 py-2 px-1">
                 <TrendIndicator label="UTILIZATION_VARIANCE" now={workforceTrend?.avgLoad.now} last={workforceTrend?.avgLoad.last} unit="%" />
                 <TrendIndicator label="REQUISITION_GAP" now={workforceTrend?.hiringGap.now} last={workforceTrend?.hiringGap.last} unit=" REQ" inverse />
              </div>
           </DashboardSection>
        </div>
      </div>

      {/* Bottom Column: Personnel Granularity */}
      <DashboardSection title="Personnel Capacity Analysis" icon={<TrendingUp size={14} />}>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {individualSignals?.map((sig, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-none group hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => handleDrilldown(sig.name, 'individual')}
                >
                   <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-none border flex items-center justify-center text-[9px] font-black ${
                        sig.load > 100 ? 'border-status-error/40 text-status-error bg-status-error/5' : 'border-primary/40 text-primary bg-primary/5'
                      }`}>
                        {sig.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{sig.name}</span>
                         <span className="text-[7px] text-white/20 uppercase font-black tracking-[0.2em] leading-none">{sig.team}_UNIT</span>
                      </div>
                   </div>
                   <span className={`text-[11px] font-black ${sig.load > 100 ? 'text-status-error' : 'text-white/40'}`}>{sig.load}%</span>
                </div>
             ))}
         </div>
      </DashboardSection>

      {/* Drilldown Modal */}
      <DrilldownModal 
        isOpen={drilldown.isOpen} 
        onClose={closeDrilldown} 
        title={`Detailed Capacity: ${drilldown.category}`}
        data={drilldown.data}
      />
    </div>
  );
};

const TrendIndicator = ({ label, now, last, unit, inverse }) => {
  const diff = now - last;
  const isUp = diff > 0;
  const color = (isUp && !inverse) || (!isUp && inverse) ? 'text-status-error' : 'text-status-success';

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">{label}</span>
      <div className="flex items-end gap-2 leading-none">
         <span className="text-2xl font-black text-white tracking-widest">{now}{unit}</span>
         <div className={`flex flex-col gap-0.5 ${color}`}>
            <div className="text-[8px] font-black flex items-center gap-1 uppercase tracking-widest">
               {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
               {Math.abs(diff)}{unit}
            </div>
            <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.2em]">CYCLE_VAR</span>
         </div>
      </div>
    </div>
  );
};

export default HRDashboard;

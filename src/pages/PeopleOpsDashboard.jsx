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

/**
 * People Operations / Workforce Engineering Dashboard
 * Focused on workforce health, capacity optimization, and organizational stability.
 */
const PeopleOpsDashboard = () => {
  const { data, isLoading } = useRoleDashboard('people-ops');

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
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1600px] mx-auto flex flex-col gap-12">
      
      {/* 1. Workforce Integrity Strip */}
      <div id="people-metrics-strip" className="grid grid-cols-1 md:grid-cols-5 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 2. Workforce Capacity Hub */}
        <div className="lg:col-span-8 flex flex-col gap-12">
            <DashboardSection title="Structural Capacity Matrix" icon={<LayoutGrid size={14} />}>
                <div className="overflow-x-auto py-2">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="text-[10px] text-white/30 uppercase font-bold tracking-widest border-b border-white/5">
                             <th className="pb-4 px-2">Engineering Unit</th>
                             <th className="pb-4 px-2">Headcount</th>
                             <th className="pb-4 px-2 w-1/3">Utilization</th>
                             <th className="pb-4 px-2 text-right">Integrity Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/[0.02]">
                          {teamCapacity?.map((t, idx) => (
                            <tr key={idx} className="group hover:bg-white/[0.015] transition-all">
                               <td className="py-4 px-2 text-[12px] font-bold text-white uppercase tracking-tight">{t.team}</td>
                               <td className="py-4 px-2 text-[11px] font-bold text-white/60 tracking-widest">{t.headcount}</td>
                               <td className="py-4 px-2">
                                  <div className="flex items-center gap-4">
                                     <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${t.load > 100 ? 'bg-status-error shadow-[0_0_8px_rgba(var(--color-status-error),0.4)]' : 'bg-primary'}`} style={{ width: `${Math.min(t.load, 100)}%` }} />
                                     </div>
                                     <span className={`text-[11px] font-bold ${t.load > 100 ? 'text-status-error' : 'text-white/80'}`}>{t.load}%</span>
                                  </div>
                               </td>
                               <td className="py-4 px-2 text-right">
                                  <StatusBadge 
                                    status={t.status === 'Overloaded' ? 'error' : t.status === 'Balanced' ? 'success' : 'pending'} 
                                    text={t.status === 'Overloaded' ? 'Critical Load' : t.status === 'Balanced' ? 'Nominal' : t.status} 
                                  />
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
            </DashboardSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <DashboardSection title="Active Transitions" icon={<Briefcase size={14} />}>
                  <div className="flex flex-col gap-2 py-2">
                     {hiringImpact?.openRoles.map((role, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-lg flex justify-between items-center group hover:border-primary/30 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="p-2 bg-primary/10 text-primary border border-primary/20 rounded">
                                 <UserPlus size={14} />
                              </div>
                              <span className="text-[11px] font-bold text-white/80 uppercase tracking-tight">{role.role}</span>
                           </div>
                           <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              role.urgency === 'Critical' ? 'bg-status-error/10 text-status-error' : 'bg-white/10 text-white/40'
                           }`}>{role.count} Units</span>
                        </div>
                     ))}
                  </div>
               </DashboardSection>

               <DashboardSection title="Stability Directives" icon={<RefreshCw size={14} />}>
                  <div className="flex flex-col gap-3 py-2">
                      {rebalanceSuggestions?.map((sug, idx) => (
                        <div key={idx} className="flex gap-4 p-4 border-l-2 border-primary bg-primary/5 rounded-r group hover:bg-primary/10 transition-all">
                           <AlertCircle size={14} className="text-primary shrink-0 mt-0.5" />
                           <div className="flex flex-col gap-1">
                              <span className="text-[11px] font-bold text-white uppercase tracking-tight leading-snug">{sug.suggestion}</span>
                              <span className="text-[9px] text-primary/60 font-bold uppercase tracking-widest">{sug.priority} URGENCY</span>
                           </div>
                        </div>
                      ))}
                  </div>
               </DashboardSection>
            </div>
        </div>

        {/* 3. Sidebar: Health & Signals */}
        <div className="lg:col-span-4 flex flex-col gap-12">
           <DashboardSection title="Workforce Integrity Signals" icon={<Stethoscope size={14} />}>
              <div className="flex flex-col gap-4 py-2">
                 {burnoutRisk?.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-lg group hover:border-status-error/40 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`p-2 rounded border ${r.risk === 'HIGH' ? 'bg-status-error/10 text-status-error border-status-error/20' : 'bg-status-warning/10 text-status-warning border-status-warning/20'}`}>
                             <ShieldAlert size={14} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[11px] font-bold text-white uppercase tracking-tight leading-none mb-1">{r.team}</span>
                             <span className="text-[9px] font-bold uppercase text-white/20 tracking-widest leading-none">{r.risk} RISK VECTOR</span>
                          </div>
                       </div>
                       <div className={r.trend === 'increasing' ? 'text-status-error' : 'text-status-success'}>
                          {r.trend === 'increasing' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                       </div>
                    </div>
                 ))}
                 
                 <div className="mt-4 p-5 bg-primary/5 border border-primary/10 rounded-lg flex items-start gap-4">
                    <Zap size={18} className="text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-2">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">AI Structural Insight</h4>
                        <p className="text-[10px] font-bold text-white/40 uppercase leading-relaxed tracking-tight italic"> 
                           "{hiringImpact?.impactInsight.text}"
                        </p>
                    </div>
                 </div>
              </div>
           </DashboardSection>

           <DashboardSection title="Real-time Event Stream" icon={<Activity size={14} />}>
              <div className="flex flex-col gap-1 py-1">
                 {orgActivity?.slice(0, 4).map((act, idx) => (
                    <ActivityItem 
                      key={idx} 
                      icon={<Target size={12} />} 
                      text={act.text} 
                      time={act.time} 
                      type="info"
                    />
                 ))}
              </div>
           </DashboardSection>

           <DashboardSection title="Structural Dynamics" icon={<BarChart2 size={14} />}>
              <div className="flex flex-col gap-8 py-4 px-2">
                 <TrendIndicator label="Utilization Variance" now={workforceTrend?.avgLoad.now} last={workforceTrend?.avgLoad.last} unit="%" />
                 <TrendIndicator label="Requisition Gap" now={workforceTrend?.hiringGap.now} last={workforceTrend?.hiringGap.last} unit=" REQ" inverse />
              </div>
           </DashboardSection>
        </div>
      </div>

      {/* Bottom Column: Personnel Granularity */}
      <DashboardSection title="Personnel Capacity Analysis" icon={<TrendingUp size={14} />}>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
             {individualSignals?.map((sig, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-lg group hover:border-primary/20 transition-all">
                   <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded border flex items-center justify-center text-[10px] font-bold ${
                        sig.load > 100 ? 'border-status-error/40 text-status-error bg-status-error/5' : 'border-primary/40 text-primary bg-primary/5'
                      }`}>
                        {sig.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-white uppercase tracking-tight leading-none mb-1">{sig.name}</span>
                         <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest leading-none">{sig.team} UNIT</span>
                      </div>
                   </div>
                   <span className={`text-[12px] font-black ${sig.load > 100 ? 'text-status-error' : 'text-white/60'}`}>{sig.load}%</span>
                </div>
             ))}
         </div>
      </DashboardSection>
    </div>
  );
};

const TrendIndicator = ({ label, now, last, unit, inverse }) => {
  const diff = now - last;
  const isUp = diff > 0;
  const color = (isUp && !inverse) || (!isUp && inverse) ? 'text-status-error' : 'text-status-success';

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">{label}</span>
      <div className="flex items-end gap-3 leading-none">
         <span className="text-4xl font-black text-white">{now}{unit}</span>
         <div className={`flex flex-col gap-0.5 ${color}`}>
            <div className="text-[10px] font-bold flex items-center gap-1">
               {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
               {Math.abs(diff)}{unit}
            </div>
            <span className="text-[8px] font-bold text-white/10 uppercase">Cycle Variance</span>
         </div>
      </div>
    </div>
  );
};

export default PeopleOpsDashboard;

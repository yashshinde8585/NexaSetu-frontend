import React from 'react';
import { 
  Users, 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Briefcase, 
  Zap, 
  Activity, 
  ArrowRight,
  ShieldAlert,
  UserPlus,
  Stethoscope,
  Target,
  BarChart2,
  RefreshCw,
  Clock,
  PieChart,
  LayoutGrid
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';

/**
 * People Ops / HR Manager Dashboard
 */
const PeopleOpsDashboard = () => {
  const { data, isLoading } = useRoleDashboard('people-ops');

  if (isLoading) return <CenteredLoading />;

  const { 
    workforceHealth, 
    teamCapacity, 
    individualSignals, 
    burnoutRisk, 
    hiringImpact, 
    orgActivity,
    workforceTrend,
    retentionSignals,
    rebalanceSuggestions 
  } = data || {};

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 pt-8 pb-12 space-y-12 bg-background-dark min-h-screen font-sans">
      
      {/* 1. Workforce Health Strip (Top) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <MetricStripItem label="Total Employees" value={workforceHealth?.totalEmployees} icon={<Users size={20} />} />
        <MetricStripItem label="Avg Utilization" value={`${workforceHealth?.avgUtilization}%`} icon={<Activity size={20} />} color={workforceHealth?.avgUtilization > 90 ? 'text-rose-500' : 'text-emerald-500'} />
        <MetricStripItem label="Overloaded" value={workforceHealth?.overloadedTeams} icon={<ShieldAlert size={20} />} color={workforceHealth?.overloadedTeams > 0 ? 'text-amber-500' : 'text-emerald-500'} />
        <MetricStripItem label="Open Roles" value={workforceHealth?.openPositions} icon={<Briefcase size={20} />} />
        <MetricStripItem label="Burnout Risk" value={workforceHealth?.burnoutRisk} icon={<Heart size={20} />} color={workforceHealth?.burnoutRisk === 'HIGH' ? 'text-rose-500' : 'text-emerald-500'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Team Capacity Overview (Main Grid) */}
        <div className="lg:col-span-8">
            <DashboardSection title="Organization Capacity" icon={<LayoutGrid size={18} />} description="Workforce distribution and team stability">
                <div className="overflow-x-auto mt-6">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-[10px] text-text-muted uppercase tracking-[0.2em] border-b border-white/5">
                             <th className="font-black pb-4 px-2">Team</th>
                             <th className="font-black pb-4">Count</th>
                             <th className="font-black pb-4 w-1/3">Utilization</th>
                             <th className="font-black pb-4 text-right">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/[0.02]">
                          {teamCapacity?.map((t, idx) => (
                            <tr key={idx} className="group hover:bg-white/[0.015] transition-all">
                               <td className="py-5 px-2 font-bold text-[14px] text-white/90">{t.team}</td>
                               <td className="py-5 font-mono text-[13px] text-white/60">{t.headcount}</td>
                               <td className="py-5">
                                  <div className="flex items-center gap-4">
                                     <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${t.load > 100 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-primary'}`} style={{ width: `${Math.min(t.load, 100)}%` }} />
                                     </div>
                                     <span className={`text-[12px] font-black ${t.load > 100 ? 'text-rose-500' : 'text-white/80'}`}>{t.load}%</span>
                                  </div>
                               </td>
                               <td className="py-5 text-right px-2">
                                  <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    t.status === 'Overloaded' ? 'bg-rose-500/10 text-rose-500' : 
                                    t.status === 'Balanced' ? 'bg-emerald-500/10 text-emerald-500' :
                                    'bg-primary/10 text-primary'
                                  }`}>
                                     {t.status}
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
            </DashboardSection>
        </div>

        {/* 4. Burnout Risk Panel */}
        <div className="lg:col-span-4">
           <DashboardSection title="Health Signals" icon={<Stethoscope size={18} />}>
              <div className="flex flex-col gap-4 mt-8">
                 {burnoutRisk?.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-rose-500/30 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${r.risk === 'HIGH' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                             <ShieldAlert size={14} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[13px] font-bold text-white/90">{r.team}</span>
                             <span className="text-[10px] font-black uppercase text-text-muted/40 tracking-widest leading-none mt-1">{r.risk} RISK LEVEL</span>
                          </div>
                       </div>
                       <div className={r.trend === 'increasing' ? 'text-rose-500' : 'text-emerald-500'}>
                          {r.trend === 'increasing' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                       </div>
                    </div>
                 ))}
                 
                 <div className="mt-4 p-5 bg-primary/5 border border-primary/20 rounded-3xl flex items-start gap-4">
                    <Zap size={20} className="text-primary shrink-0" />
                    <div>
                        <h4 className="text-[12px] font-black text-white/90 uppercase tracking-widest">Hiring Impact Analysis</h4>
                        <p className="text-[11px] text-text-muted leading-relaxed mt-2 italic font-medium"> 
                           "{hiringImpact?.impactInsight.text}"
                        </p>
                    </div>
                 </div>
              </div>
           </DashboardSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <DashboardSection title="Hiring Pipeline" icon={<Briefcase size={18} />}>
            <div className="flex flex-col gap-3 mt-6">
               {hiringImpact?.openRoles.map((role, idx) => (
                  <div key={idx} className="p-4 bg-white/[0.015] border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-white/[0.03] transition-all">
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                           <UserPlus size={14} />
                        </div>
                        <span className="text-[12px] font-bold text-white/90">{role.role}</span>
                     </div>
                     <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        role.urgency === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-white/5 text-white/40'
                     }`}>{role.count} POS</span>
                  </div>
               ))}
            </div>
         </DashboardSection>

         <DashboardSection title="Staffing Recommendations" icon={<RefreshCw size={18} />}>
            <div className="flex flex-col gap-4 mt-6">
                {rebalanceSuggestions?.map((sug, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border-l-2 border-primary bg-primary/5 rounded-r-2xl items-start">
                     <AlertCircle size={14} className="text-primary shrink-0 mt-1" />
                     <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-bold text-white/90 leading-tight">{sug.suggestion}</span>
                        <span className="text-[9px] text-primary/60 font-black uppercase tracking-widest italic">{sug.priority} PRIORITY</span>
                     </div>
                  </div>
                ))}
            </div>
         </DashboardSection>

         <DashboardSection title="Organization Activity" icon={<Activity size={18} />}>
            <div className="flex flex-col gap-3 mt-6">
               {orgActivity?.slice(0, 3).map((act, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-3 hover:bg-white/[0.02] rounded-xl transition-all">
                     <div className="text-primary/40 pt-1"><Target size={12} /></div>
                     <div className="flex flex-col">
                        <span className="text-[12px] text-white/70 leading-relaxed font-medium">{act.text}</span>
                        <span className="text-[9px] font-mono text-text-muted/40 uppercase">{act.time} ago</span>
                     </div>
                  </div>
               ))}
            </div>
         </DashboardSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Individual Load Signals */}
          <DashboardSection title="Personnel Load Signals" icon={<TrendingUp size={18} />}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                 {individualSignals?.map((sig, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.015] border border-white/5 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black ${
                            sig.load > 100 ? 'border-rose-500/40 text-rose-500 bg-rose-500/5' : 'border-primary/40 text-primary bg-primary/5'
                          }`}>
                            {sig.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[13px] font-bold text-white/90">{sig.name}</span>
                             <span className="text-[10px] text-text-muted uppercase font-black tracking-widest">{sig.team}</span>
                          </div>
                       </div>
                       <span className={`text-[13px] font-black ${sig.load > 100 ? 'text-rose-500' : 'text-white/60'}`}>{sig.load}%</span>
                    </div>
                 ))}
             </div>
          </DashboardSection>

          {/* Retention & Trends */}
          <DashboardSection title="Stability Trend Center" icon={<BarChart2 size={18} />}>
              <div className="grid grid-cols-2 gap-10 mt-8 px-4">
                 <TrendIndicator label="Utilization Stress" now={workforceTrend?.avgLoad.now} last={workforceTrend?.avgLoad.last} unit="%" />
                 <TrendIndicator label="Staffing Gap" now={workforceTrend?.hiringGap.now} last={workforceTrend?.hiringGap.last} unit=" PX" inverse />
              </div>
              <div className="mt-10 grid grid-cols-2 gap-4">
                  {retentionSignals?.map((ret, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col gap-2">
                       <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-widest">{ret.team} Retention</span>
                       <span className="text-[15px] font-black text-white/90">{ret.attritionRisk} ATTRITION RISK</span>
                    </div>
                  ))}
              </div>
          </DashboardSection>
      </div>
    </div>
  );
};

const TrendIndicator = ({ label, now, last, unit, inverse }) => {
  const diff = now - last;
  const isUp = diff > 0;
  const color = (isUp && !inverse) || (!isUp && inverse) ? 'text-rose-500' : 'text-emerald-500';

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/50">{label}</span>
      <div className="flex items-end gap-3">
         <span className="text-4xl font-black text-white/90">{now}{unit}</span>
         <div className={`flex flex-col items-center mb-1 ${color}`}>
            <div className="text-[11px] font-black flex items-center gap-0.5 whitespace-nowrap">
               {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
               {Math.abs(diff)}{unit}
            </div>
            <span className="text-[8px] font-mono text-text-muted/30 uppercase opacity-40">Monthly</span>
         </div>
      </div>
    </div>
  );
};

export default PeopleOpsDashboard;

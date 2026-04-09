import React from 'react';
import { 
  Search, 
  BarChart3, 
  ShieldAlert, 
  Bug, 
  TrendingUp, 
  Target, 
  Activity, 
  Users, 
  Zap,
  Microscope,
  Info,
  ChevronRight,
  Fingerprint,
  PieChart,
  Network
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';

/**
 * SQA Dashboard
 */
const SQADashboard = () => {
  const { data, isLoading } = useRoleDashboard('sqa');

  if (isLoading) return <CenteredLoading />;

  const { 
    qualitySignals, 
    failureAnalysis, 
    advancedBlockers, 
    bugIntelligence, 
    coverageGaps, 
    supportSignals,
    releaseRiskBreakdown,
    qualityTrends,
    regressionFailures,
    flakyTests
  } = data || {};

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 pt-8 pb-12 space-y-12 bg-background-dark min-h-screen font-sans">
      
      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <MetricStripItem label="Failure Rate" value={`${qualitySignals?.failureRate}%`} icon={<TrendingUp size={20} />} accent="bg-rose-500/20" />
        <MetricStripItem label="Blocked Tests" value={qualitySignals?.blockedTests} icon={<ShieldAlert size={20} />} color="text-amber-500" />
        <MetricStripItem label="Critical Bugs" value={qualitySignals?.criticalBugs} color="text-rose-500" icon={<Bug size={20} />} />
        <MetricStripItem label="Flaky Tests" value={qualitySignals?.flakyTests} color="text-amber-500" icon={<Zap size={20} />} />
        <MetricStripItem label="Release Risk" value={qualitySignals?.releaseRisk} color={qualitySignals?.releaseRisk === 'HIGH' ? 'text-rose-500' : 'text-emerald-500'} icon={<Target size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Failure Analysis Panel */}
        <div className="lg:col-span-12">
            <DashboardSection title="Failure Analysis" icon={<Microscope size={18} />} description="Analysis of recurring failure patterns">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {failureAnalysis?.map((item, idx) => (
                      <div key={idx} className="p-5 bg-white/[0.015] border border-white/5 rounded-[2.5rem] flex flex-col gap-4 group hover:bg-white/[0.03] transition-all">
                          <div className="flex justify-between items-start">
                             <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase text-text-muted/40 tracking-widest">{item.module}</span>
                                <span className="text-3xl font-black text-white">{item.failures} Failures</span>
                             </div>
                             <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl group-hover:scale-110 transition-transform">
                                <Fingerprint size={16} />
                             </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-400">
                             <TrendingUp size={12} />
                             {item.trend}
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-rose-500/40" style={{ width: `${(item.failures / 10) * 100}%` }} />
                          </div>
                      </div>
                    ))}
                </div>
            </DashboardSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <DashboardSection title="Blockers" icon={<Network size={18} />}>
            <div className="flex flex-col gap-3 mt-6">
                {advancedBlockers?.map((block, idx) => (
                   <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-3xl flex justify-between items-center group hover:border-amber-500/30 transition-all">
                      <div className="flex flex-col gap-0.5">
                         <span className="text-[12px] font-bold text-white/90">{block.issue}</span>
                         <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest">{block.impactScope}</span>
                      </div>
                      <ChevronRight size={14} className="text-text-muted group-hover:text-amber-500" />
                   </div>
                ))}
            </div>
         </DashboardSection>

         <DashboardSection title="Bug Trends" icon={<PieChart size={18} />}>
            <div className="flex flex-col mt-6">
                <table className="w-full text-left">
                   <thead>
                      <tr className="text-[9px] text-text-muted uppercase tracking-widest border-b border-white/5 pb-2">
                         <th className="pb-3 px-2">Impact Area</th>
                         <th className="pb-3">Trend</th>
                         <th className="pb-3 text-right pr-2">State</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/[0.02]">
                      {bugIntelligence?.map((bug, idx) => (
                        <tr key={idx} className="group hover:bg-white/5">
                           <td className="py-4 px-2">
                              <div className="flex flex-col">
                                 <span className="text-[11px] font-bold text-white/80">{bug.module}</span>
                                 <span className="text-[9px] text-text-muted uppercase tracking-widest">{bug.severity}</span>
                              </div>
                           </td>
                           <td className={`py-4 text-[10px] font-black uppercase tracking-tighter ${bug.trend.includes('Increasing') ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {bug.trend}
                           </td>
                           <td className="py-4 text-right pr-2">
                              <div className="h-2 w-2 rounded-full bg-rose-500 inline-block ml-auto border border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
            </div>
         </DashboardSection>

         {/* 5. Flaky Tests (Stability) */}
         <DashboardSection title="Flaky Tests" icon={<Zap size={18} />}>
            <div className="flex flex-col gap-3 mt-6">
                {flakyTests?.map((test, idx) => (
                  <div key={idx} className="p-4 bg-white/[0.015] border border-white/5 rounded-3xl group hover:bg-amber-500/5 transition-all">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[13px] font-bold text-white/80">{test.title}</span>
                         <span className="text-[10px] font-black uppercase text-amber-400">{test.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/40">Impact: {test.impact}</span>
                         <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500/30" style={{ width: test.frequency.includes('25%') ? '25%' : '10%' }} />
                         </div>
                      </div>
                  </div>
                ))}
            </div>
         </DashboardSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* 6. Quality Trends */}
         <DashboardSection title="Quality Trends" icon={<TrendingUp size={18} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 px-4">
               <TrendDisplay label="Failure Rate" value={`${qualityTrends?.failureRate?.now}%`} lastValue={`${qualityTrends?.failureRate?.lastWeek}%`} color="text-rose-500" upIsBad />
               <TrendDisplay label="Pass Rate" value={`${qualityTrends?.passRate?.now}%`} lastValue={`${qualityTrends?.passRate?.lastWeek}%`} color="text-emerald-500" />
            </div>
         </DashboardSection>

         <DashboardSection title="Release Risk" icon={<ShieldAlert size={18} />} className={releaseRiskBreakdown?.risk === 'HIGH' ? 'border-rose-500/20 bg-rose-500/[0.01]' : 'border-emerald-500/20 bg-emerald-500/[0.01]'}>
            <div className="flex flex-wrap mt-8 gap-8 items-center px-4">
                <div className="flex flex-col items-center">
                    <div className={`p-4 rounded-full border-4 ${releaseRiskBreakdown?.risk === 'HIGH' ? 'border-rose-500/20' : 'border-emerald-500/20'}`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-xl shadow-[0_0_30px_rgba(244,63,94,0.3)] ${releaseRiskBreakdown?.risk === 'HIGH' ? 'text-rose-500 bg-rose-500/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
                            {releaseRiskBreakdown?.risk}
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest mt-3 text-text-muted/50">Overall Risk</span>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-3 min-w-[200px]">
                   <MiniMetric label="Crit. Bugs" value={releaseRiskBreakdown?.criticalBugs} color="text-rose-400" />
                   <MiniMetric label="High Failures" value={releaseRiskBreakdown?.highFailures} color="text-rose-400" />
                   <MiniMetric label="Flaky Tests" value={releaseRiskBreakdown?.flakyTests} color="text-amber-400" />
                </div>
            </div>
         </DashboardSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
         {/* 8. Coverage Gap Analysis */}
         <DashboardSection title="Coverage Gaps" icon={<Target size={18} />}>
            <div className="flex flex-col gap-4 mt-6">
                {coverageGaps?.map((gap, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-4 bg-white/[0.01] rounded-2xl">
                     <div className="flex justify-between items-center">
                        <span className="text-[12px] font-bold text-white/80">{gap.module}</span>
                        <span className="text-[10px] font-black uppercase text-rose-500">{gap.alert}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                           <div className={`h-full ${gap.coverage > 80 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${gap.coverage}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-text-muted">{gap.coverage}%</span>
                     </div>
                  </div>
                ))}
            </div>
         </DashboardSection>

         <DashboardSection title="Regression Analysis" icon={<BarChart3 size={18} />}>
            <div className="flex flex-col gap-2 mt-6">
                {regressionFailures?.map((fail, idx) => (
                  <div key={idx} className="flex items-center p-3 hover:bg-white/5 rounded-2xl transition-colors">
                     <div className="w-1.5 h-6 bg-rose-500/40 rounded-full mr-4" />
                     <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-white/90">{fail.module}</span>
                        <span className="text-[9px] font-black uppercase text-rose-500/60 tracking-widest">{fail.failures} Recurring Failures</span>
                     </div>
                     <div className="ml-auto px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-widest rounded-lg">
                        {fail.impact} Impact
                     </div>
                  </div>
                ))}
            </div>
         </DashboardSection>

         {/* 10. QA Support Signals */}
         <DashboardSection title="Team Signals" icon={<Users size={18} />}>
            <div className="flex flex-col gap-4 mt-6">
                {supportSignals?.map((sig, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/[0.015] border border-white/5 rounded-[2rem] group hover:border-primary/30 transition-all">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-primary font-black text-xs">
                         {sig.user[0]}
                      </div>
                      <div className="flex flex-col gap-0.5">
                         <span className="text-[11px] font-bold text-white/80">{sig.user}</span>
                         <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{sig.issue}</p>
                      </div>
                  </div>
                ))}
            </div>
         </DashboardSection>
      </div>
    </div>
  );
};

const MiniMetric = ({ label, value, color }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-3xl min-w-[70px]">
     <span className={`text-lg font-black ${color}`}>{value}</span>
     <span className="text-[8px] font-black text-text-muted/40 uppercase tracking-tighter text-center">{label}</span>
  </div>
);

const TrendDisplay = ({ label, value, lastValue, color, upIsBad }) => {
  const isUp = parseFloat(value) > parseFloat(lastValue);
  const trendColor = isUp ? (upIsBad ? 'text-rose-500' : 'text-emerald-500') : (upIsBad ? 'text-emerald-500' : 'text-rose-500');

  return (
    <div className="flex flex-col gap-1">
       <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/50">{label}</span>
       <div className="flex items-end gap-3 px-1">
          <span className={`text-4xl font-black ${color}`}>{value}</span>
          <div className="flex flex-col gap-0 mb-1.5">
             <span className={`text-[10px] font-black ${trendColor}`}>{isUp ? '↑' : '↓'}</span>
             <span className="text-[8px] font-mono text-text-muted/40">wk: {lastValue}</span>
          </div>
       </div>
    </div>
  );
};

export default SQADashboard;

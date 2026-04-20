import React from 'react';
import { 
  Search, BarChart3, ShieldAlert, Bug, TrendingUp, 
  Target, Activity, Users, Zap, Microscope, Info, 
  ChevronRight, Fingerprint, PieChart, Network,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';

/**
 * Senior Quality Assurance (SQA) Dashboard
 * Focused on deep failure analysis, regression patterns, and release risk intelligence.
 */
const SQADashboard = () => {
  const { data, isLoading } = useRoleDashboard('sqa');

  if (isLoading) return <CenteredLoading />;

  const { 
    qualitySignals = { failureRate: 0, blockedTests: 0, criticalBugs: 0, flakyTests: 0, releaseRisk: 'UNKNOWN' }, 
    failureAnalysis = [], 
    advancedBlockers = [], 
    bugIntelligence = [], 
    coverageGaps = [], 
    supportSignals = [],
    releaseRiskBreakdown = { risk: 'UNDEFINED', criticalBugs: 0, highFailures: 0, flakyTests: 0 },
    qualityTrends = { failureRate: { now: 0, lastWeek: 0 }, passRate: { now: 0, lastWeek: 0 } },
    regressionFailures = [],
    flakyTests = []
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1700px] mx-auto flex flex-col gap-12">
      
      {/* 1. Quality Intelligence Strip */}
      <div id="sqa-metrics-strip" className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <MetricStripItem 
            label="Vector Failure Rate" 
            value={`${qualitySignals.failureRate}%`} 
            icon={<TrendingUp size={14} />} 
            color={qualitySignals.failureRate > 5 ? 'text-status-error' : 'text-status-success'}
            accent={qualitySignals.failureRate > 5 ? 'bg-status-error' : 'bg-status-success'}
        />
        <MetricStripItem 
            label="Blocked Validations" 
            value={qualitySignals.blockedTests} 
            icon={<ShieldAlert size={14} />} 
            color={qualitySignals.blockedTests > 0 ? "text-status-warning" : "text-white/40"} 
            accent={qualitySignals.blockedTests > 0 ? "bg-status-warning" : "bg-white/5"}
        />
        <MetricStripItem 
            label="Critical Defects" 
            value={qualitySignals.criticalBugs} 
            icon={<Bug size={14} />} 
            color={qualitySignals.criticalBugs > 0 ? 'text-status-error' : 'text-status-success'} 
            accent={qualitySignals.criticalBugs > 0 ? 'bg-status-error' : 'bg-status-success'}
        />
        <MetricStripItem 
            label="Instability (Flaky)" 
            value={qualitySignals.flakyTests} 
            icon={<Zap size={14} />} 
            accent="bg-white/10"
        />
        <MetricStripItem 
            label="Deployment Risk" 
            value={qualitySignals.releaseRisk} 
            icon={<Target size={14} />} 
            color={qualitySignals.releaseRisk === 'HIGH' ? 'text-status-error' : 'text-status-success'}
            accent={qualitySignals.releaseRisk === 'HIGH' ? 'bg-status-error' : 'bg-status-success'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 2. Failure Analysis Board */}
        <div className="lg:col-span-12">
            <DashboardSection title="Structural Failure Analysis" icon={<Microscope size={14} />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-2">
                    {failureAnalysis?.map((item, idx) => (
                      <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded flex flex-col gap-4 group hover:bg-white/[0.04] transition-all">
                          <div className="flex justify-between items-start">
                             <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold uppercase text-white/20 tracking-widest">{item.module} Sector</span>
                                <span className="text-4xl font-black text-white tracking-tighter leading-none">{item.failures} ERR</span>
                             </div>
                             <div className="p-2 bg-status-error/10 text-status-error border border-status-error/20 rounded group-hover:scale-105 transition-transform">
                                <Fingerprint size={16} />
                             </div>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-status-error/60">
                             <TrendingUp size={12} />
                             {item.trend} CYCLICAL
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-status-error" style={{ width: `${(item.failures / 10) * 100}%` }} />
                          </div>
                      </div>
                    ))}
                </div>
            </DashboardSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-4 flex flex-col gap-10">
            <DashboardSection title="Validation Blockades" icon={<Network size={14} />}>
               <div className="flex flex-col gap-3 py-2">
                   {advancedBlockers?.map((block, idx) => (
                      <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded flex justify-between items-center group hover:border-status-warning/40 transition-all">
                         <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-white uppercase tracking-tight leading-none mb-1">{block.issue}</span>
                            <span className="text-[9px] font-bold uppercase text-status-warning tracking-widest">{block.impactScope} IMPACT</span>
                         </div>
                         <ChevronRight size={14} className="text-white/10 group-hover:text-status-warning transition-all" />
                      </div>
                   ))}
               </div>
            </DashboardSection>

            <DashboardSection title="Instability Vector" icon={<Zap size={14} />}>
               <div className="flex flex-col gap-3 py-2">
                   {flakyTests?.map((test, idx) => (
                     <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded group hover:bg-status-warning/[0.05] hover:border-status-warning/20 transition-all">
                         <div className="flex justify-between items-center mb-4 leading-none">
                            <span className="text-[11px] font-bold text-white uppercase tracking-tight">{test.title}</span>
                            <span className="text-[10px] font-bold text-status-warning uppercase tracking-widest">{test.frequency}</span>
                         </div>
                         <div className="flex flex-col gap-2">
                            <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">System Impact: {test.impact}</span>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-status-warning/40" style={{ width: test.frequency.includes('25%') ? '25%' : '10%' }} />
                            </div>
                         </div>
                     </div>
                   ))}
               </div>
            </DashboardSection>
         </div>

         <div className="lg:col-span-8 flex flex-col gap-10">
            <DashboardSection title="Integrity Intelligence" icon={<PieChart size={14} />}>
               <div className="overflow-x-auto py-2 px-1">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="text-[9px] text-white/20 uppercase font-bold tracking-widest border-b border-white/5">
                           <th className="pb-4 px-2">Subsystem Domain</th>
                           <th className="pb-4 px-2">Cyclical Trend</th>
                           <th className="pb-4 px-2 text-right">Integrity</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/[0.02]">
                        {bugIntelligence?.map((bug, idx) => (
                          <tr key={idx} className="group hover:bg-white/[0.015] transition-all">
                             <td className="py-4 px-2">
                                <div className="flex flex-col gap-1">
                                   <span className="text-[12px] font-bold text-white uppercase tracking-tight leading-none mb-1">{bug.module}</span>
                                   <span className="text-[9px] text-status-error/60 font-bold uppercase tracking-widest">{bug.severity} PRIORITY</span>
                                </div>
                             </td>
                             <td className={`py-4 px-2 text-[10px] font-bold uppercase tracking-widest ${bug.trend.includes('Increasing') ? 'text-status-error' : 'text-status-success'}`}>
                                {bug.trend}
                             </td>
                             <td className="py-4 px-2 text-right">
                                <div className={`h-1.5 w-1.5 rounded-full inline-block ml-auto ${bug.trend.includes('Increasing') ? 'bg-status-error shadow-[0_0_8px_rgba(var(--color-status-error),0.6)]' : 'bg-status-success'}`} />
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </DashboardSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <DashboardSection title="Regression Recurrence" icon={<BarChart3 size={14} />}>
                  <div className="flex flex-col gap-3 py-2">
                      {regressionFailures?.map((fail, idx) => (
                        <div key={idx} className="flex items-center p-4 bg-white/[0.02] hover:bg-white/[0.04] border-l-2 border-status-error rounded-r transition-all group">
                           <div className="flex flex-col gap-1">
                              <span className="text-[12px] font-bold text-white uppercase tracking-tight leading-none mb-1">{fail.module}</span>
                              <span className="text-[9px] font-bold uppercase text-status-error/40 tracking-widest">{fail.failures} RECURRING TRACES</span>
                           </div>
                           <div className="ml-auto flex flex-col items-end gap-1">
                              <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">IMPACT</span>
                              <span className="text-[9px] font-bold text-status-error uppercase tracking-widest leading-none">{fail.impact}</span>
                           </div>
                        </div>
                      ))}
                  </div>
               </DashboardSection>

               <DashboardSection title="Integrity Feedback" icon={<Users size={14} />}>
                  <div className="flex flex-col gap-4 py-2">
                      {supportSignals?.map((sig, idx) => (
                        <ActivityItem 
                           key={idx} 
                           icon={<Target size={12} />} 
                           text={sig.issue} 
                           time={sig.user} 
                           type="info"
                        />
                      ))}
                  </div>
               </DashboardSection>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-8">
         {/* 6. Release Authority Analysis */}
         <div className="lg:col-span-8">
            <DashboardSection title="Strategic Quality Variance" icon={<TrendingUp size={14} />}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 py-8 px-8 bg-white/[0.01] rounded border border-white/5">
                  <TrendDisplay label="Aggregate Failure Quota" value={`${qualityTrends.failureRate.now}%`} lastValue={`${qualityTrends.failureRate.lastWeek}%`} color="text-status-error" upIsBad />
                  <TrendDisplay label="Global Validation Quota" value={`${qualityTrends.passRate.now}%`} lastValue={`${qualityTrends.passRate.lastWeek}%`} color="text-status-success" />
               </div>
            </DashboardSection>
         </div>

         <div className="lg:col-span-4">
            <DashboardSection title="Deployment Integrity Risk" icon={<ShieldAlert size={14} />}>
               <div className={`py-1 rounded border ${releaseRiskBreakdown.risk === 'HIGH' ? 'border-status-error/20 bg-status-error/[0.02]' : 'border-status-success/20 bg-status-success/[0.02]'}`}>
                  <div className="flex flex-col items-center py-6">
                      <div className={`p-4 rounded-full border-2 ${releaseRiskBreakdown.risk === 'HIGH' ? 'border-status-error/20' : 'border-status-success/20'}`}>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl tracking-tighter shadow-[0_0_20px_rgba(var(--color-${releaseRiskBreakdown.risk === 'HIGH' ? 'status-error' : 'status-success'}),0.2)] ${releaseRiskBreakdown.risk === 'HIGH' ? 'text-status-error bg-status-error/10' : 'text-status-success bg-status-success/10'}`}>
                              {releaseRiskBreakdown.risk || 'NONE'}
                          </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest mt-4 text-white/30">Vector Risk Appraisal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-white/5 border-t border-white/5">
                     <div className="flex flex-col items-center justify-center p-4 bg-black">
                        <span className="text-xl font-bold text-status-error leading-none">{releaseRiskBreakdown.criticalBugs}</span>
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2">DEFECTS</span>
                     </div>
                     <div className="flex flex-col items-center justify-center p-4 bg-black">
                        <span className="text-xl font-bold text-status-error leading-none">{releaseRiskBreakdown.highFailures}</span>
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2">FAILURES</span>
                     </div>
                     <div className="flex flex-col items-center justify-center p-4 bg-black">
                        <span className="text-xl font-bold text-status-warning leading-none">{releaseRiskBreakdown.flakyTests}</span>
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2">FLAKY</span>
                     </div>
                  </div>
               </div>
            </DashboardSection>
         </div>
      </div>

      <DashboardSection title="Domain Coverage Gaps" icon={<Target size={14} />}>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-2">
             {coverageGaps?.map((gap, idx) => (
               <div key={idx} className="flex flex-col gap-4 p-5 bg-white/[0.02] border border-white/5 rounded group hover:border-status-error/40 transition-all">
                  <div className="flex justify-between items-center leading-none">
                     <span className="text-[11px] font-bold text-white uppercase tracking-tight">{gap.module} Vector</span>
                     <span className="text-[9px] font-bold uppercase text-status-error tracking-widest">{gap.alert}</span>
                  </div>
                  <div className="flex items-center gap-4 py-1">
                     <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${gap.coverage > 80 ? 'bg-status-success' : 'bg-status-error'}`} style={{ width: `${gap.coverage}%` }} />
                     </div>
                     <span className="text-[11px] font-bold text-white/40 tracking-tighter tabular-nums">{gap.coverage}%</span>
                  </div>
               </div>
             ))}
         </div>
      </DashboardSection>
    </div>
  );
};

const TrendDisplay = ({ label, value, lastValue, color, upIsBad }) => {
  const isUp = parseFloat(value) > parseFloat(lastValue);
  const trendColor = isUp ? (upIsBad ? 'text-status-error' : 'text-status-success') : (upIsBad ? 'text-status-success' : 'text-status-error');

  return (
    <div className="flex flex-col gap-2">
       <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">{label}</span>
       <div className="flex items-end gap-3 px-1 leading-none">
          <span className={`text-5xl font-black tracking-tighter ${color}`}>{value}</span>
          <div className="flex flex-col gap-1 mb-1.5">
             <div className={`flex items-center gap-1 text-[11px] font-bold ${trendColor}`}>
                {isUp ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
                {isUp ? 'SEC' : 'DEC'}
             </div>
             <span className="text-[8px] font-bold text-white/10 uppercase tracking-tighter">vs Cycle Base</span>
          </div>
       </div>
    </div>
  );
};

export default SQADashboard;

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

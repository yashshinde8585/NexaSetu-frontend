import React from 'react';
import { 
  Search, BarChart3, ShieldAlert, Bug, TrendingUp, 
  Target, Activity, Users, Zap, Microscope, Info, 
  ChevronRight, Fingerprint, PieChart, Network,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-black text-white p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      
      {/* 1. Quality Intelligence Strip */}
      <div id="sqa-metrics-strip" className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Failure Analysis Board */}
        <div className="lg:col-span-12">
            <DashboardSection title="Structural Failure Analysis" icon={<Microscope size={14} />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                    {failureAnalysis?.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 bg-white/5 border border-white/10 rounded-none flex flex-col gap-4 group hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => navigate(`/quality-control?module=${item.module}`)}
                      >
                          <div className="flex justify-between items-start">
                             <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black uppercase text-white/20 tracking-[0.2em]">{item.module}_SECTOR</span>
                                <span className="text-2xl font-black text-white tracking-widest leading-none">{item.failures} ERR</span>
                             </div>
                             <div className="p-1.5 bg-status-error/10 text-status-error border border-status-error/20 rounded-none transition-colors">
                                <Fingerprint size={14} />
                             </div>
                          </div>
                          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-status-error/60">
                             <TrendingUp size={10} />
                             {item.trend}_CYCLICAL
                          </div>
                          <div className="w-full h-0.5 bg-white/5 rounded-none overflow-hidden">
                             <div className="h-full bg-status-error" style={{ width: `${Math.min(100, (item.failures / 5) * 100)}%` }} />
                          </div>
                      </div>
                    ))}
                    {(!failureAnalysis || failureAnalysis.length === 0) && (
                       <div className="col-span-3 py-12 text-center text-[9px] text-white/10 uppercase font-black tracking-[0.3em] italic">ZERO_STRUCTURAL_FAILURES</div>
                    )}
                </div>
            </DashboardSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-4 flex flex-col gap-6">
            <DashboardSection title="Validation Blockades" icon={<Network size={14} />}>
               <div className="flex flex-col gap-2 py-2">
                   {advancedBlockers?.map((block, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 bg-white/5 border border-white/10 rounded-none flex justify-between items-center group hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => navigate('/my-tasks?scope=blocked')}
                      >
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{block.issue}</span>
                            <span className="text-[8px] font-black uppercase text-status-warning tracking-[0.2em]">{block.impactScope}_IMPACT</span>
                         </div>
                         <ChevronRight size={12} className="text-white/10 group-hover:text-status-warning transition-colors" />
                      </div>
                   ))}
                   {(!advancedBlockers || advancedBlockers.length === 0) && (
                      <div className="py-8 text-center text-[9px] text-white/10 uppercase font-black tracking-widest italic">NO_CRITICAL_BLOCKADES</div>
                   )}
               </div>
            </DashboardSection>

            <DashboardSection title="Instability Vector" icon={<Zap size={14} />}>
               <div className="flex flex-col gap-2 py-2">
                   {flakyTests?.map((test, idx) => (
                     <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-none group hover:bg-white/10 transition-colors">
                         <div className="flex justify-between items-center mb-3 leading-none">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{test.title}</span>
                            <span className="text-[9px] font-black text-status-warning uppercase tracking-[0.2em]">{test.frequency}</span>
                         </div>
                         <div className="flex flex-col gap-2">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">SYSTEM_IMPACT: {test.impact}</span>
                            <div className="h-0.5 bg-white/5 rounded-none overflow-hidden border border-white/5">
                               <div className="h-full bg-status-warning/40 transition-all duration-1000" style={{ width: test.frequency.includes('25%') ? '25%' : '10%' }} />
                            </div>
                         </div>
                     </div>
                   ))}
                   {(!flakyTests || flakyTests.length === 0) && (
                      <div className="py-12 text-center text-[9px] text-white/10 uppercase font-black tracking-widest italic">STABLE_ENVIRONMENT</div>
                   )}
               </div>
            </DashboardSection>
         </div>

         <div className="lg:col-span-8 flex flex-col gap-6">
            <DashboardSection title="Integrity Intelligence" icon={<PieChart size={14} />}>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="text-[8px] text-white/20 uppercase font-black tracking-[0.2em] border-b border-white/5">
                           <th className="py-3 px-3">SUBSYSTEM_DOMAIN</th>
                           <th className="py-3 px-3">CYCLICAL_TREND</th>
                           <th className="py-3 px-3 text-right">INTEGRITY</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/[0.02]">
                        {bugIntelligence?.map((bug, idx) => (
                          <tr 
                            key={idx} 
                            className="group hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => navigate(`/quality-control?module=${bug.module}&priority=${bug.severity}`)}
                          >
                             <td className="py-3 px-3">
                                <div className="flex flex-col gap-1">
                                   <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{bug.module}</span>
                                   <span className="text-[8px] text-status-error/60 font-black uppercase tracking-[0.2em]">{bug.severity}_PRIORITY</span>
                                </div>
                             </td>
                             <td className={`py-3 px-3 text-[9px] font-black uppercase tracking-[0.2em] ${bug.trend.includes('Increasing') ? 'text-status-error' : 'text-status-success'}`}>
                                {bug.trend}
                             </td>
                             <td className="py-3 px-3 text-right">
                                <div className={`h-1.5 w-1.5 rounded-none inline-block ml-auto ${bug.trend.includes('Increasing') ? 'bg-status-error' : 'bg-status-success'}`} />
                             </td>
                          </tr>
                        ))}
                        {(!bugIntelligence || bugIntelligence.length === 0) && (
                          <tr>
                            <td colSpan="3" className="py-12 text-center text-[9px] text-white/10 uppercase font-black tracking-widest italic">NO_SUBSYSTEM_DATA</td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </DashboardSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DashboardSection title="Regression Recurrence" icon={<BarChart3 size={14} />}>
                  <div className="flex flex-col gap-2 py-2">
                      {regressionFailures?.map((fail, idx) => (
                        <div key={idx} className="flex items-center p-3 bg-white/5 hover:bg-white/10 border-l-2 border-status-error rounded-none transition-colors group">
                           <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{fail.module}</span>
                              <span className="text-[8px] font-black uppercase text-status-error/40 tracking-[0.2em]">{fail.failures}_RECURRING_TRACES</span>
                           </div>
                           <div className="ml-auto flex flex-col items-end gap-1">
                              <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.2em]">IMPACT</span>
                              <span className="text-[9px] font-black text-status-error uppercase tracking-[0.2em] leading-none">{fail.impact}</span>
                           </div>
                        </div>
                      ))}
                  </div>
               </DashboardSection>

               <DashboardSection title="Integrity Feedback" icon={<Users size={14} />}>
                  <div className="flex flex-col gap-2 py-2">
                      {supportSignals?.map((sig, idx) => (
                        <ActivityItem 
                           key={idx} 
                           text={sig.issue} 
                           time={sig.user} 
                        />
                      ))}
                  </div>
               </DashboardSection>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">
         {/* 6. Release Authority Analysis */}
         <div className="lg:col-span-8">
            <DashboardSection title="Strategic Quality Variance" icon={<TrendingUp size={14} />}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 px-4 bg-white/5 border border-white/10 rounded-none">
                  <TrendDisplay label="FAILURE_QUOTA" value={`${qualityTrends.failureRate.now}%`} lastValue={`${qualityTrends.failureRate.lastWeek}%`} color="text-status-error" upIsBad />
                  <TrendDisplay label="VALIDATION_QUOTA" value={`${qualityTrends.passRate.now}%`} lastValue={`${qualityTrends.passRate.lastWeek}%`} color="text-status-success" />
               </div>
            </DashboardSection>
         </div>

         <div className="lg:col-span-4">
            <DashboardSection title="Deployment Risk" icon={<ShieldAlert size={14} />}>
               <div className={`rounded-none border ${releaseRiskBreakdown.risk === 'HIGH' ? 'border-status-error/20 bg-status-error/[0.02]' : 'border-status-success/20 bg-status-success/[0.02]'}`}>
                  <div className="flex flex-col items-center py-4">
                      <div className={`p-3 rounded-none border-2 ${releaseRiskBreakdown.risk === 'HIGH' ? 'border-status-error/20' : 'border-status-success/20'}`}>
                          <div className={`w-12 h-12 rounded-none flex items-center justify-center font-black text-xl tracking-widest ${releaseRiskBreakdown.risk === 'HIGH' ? 'text-status-error bg-status-error/10' : 'text-status-success bg-status-success/10'}`}>
                              {releaseRiskBreakdown.risk || 'NONE'}
                          </div>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-3 text-white/20">VECTOR_RISK</span>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-white/5 border-t border-white/5">
                     <div className="flex flex-col items-center justify-center p-3 bg-black">
                        <span className="text-lg font-black text-status-error leading-none">{releaseRiskBreakdown.criticalBugs}</span>
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">DEFECTS</span>
                     </div>
                     <div className="flex flex-col items-center justify-center p-3 bg-black">
                        <span className="text-lg font-black text-status-error leading-none">{releaseRiskBreakdown.highFailures}</span>
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">FAILURES</span>
                     </div>
                     <div className="flex flex-col items-center justify-center p-3 bg-black">
                        <span className="text-lg font-black text-status-warning leading-none">{releaseRiskBreakdown.flakyTests}</span>
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">FLAKY</span>
                     </div>
                  </div>
               </div>
            </DashboardSection>
         </div>
      </div>

      <DashboardSection title="Domain Coverage Gaps" icon={<Target size={14} />}>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
             {coverageGaps?.map((gap, idx) => (
               <div key={idx} className="flex flex-col gap-3 p-3 bg-white/5 border border-white/10 rounded-none group hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-center leading-none">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{gap.module}_VECTOR</span>
                     <span className="text-[8px] font-black uppercase text-status-error tracking-[0.2em]">{gap.alert}</span>
                  </div>
                  <div className="flex items-center gap-4 py-1">
                     <div className="h-0.5 flex-1 bg-white/5 rounded-none overflow-hidden">
                        <div className={`h-full ${gap.coverage > 80 ? 'bg-status-success' : 'bg-status-error'}`} style={{ width: `${gap.coverage}%` }} />
                     </div>
                     <span className="text-[10px] font-black text-white/40 tracking-widest tabular-nums">{gap.coverage}%</span>
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
       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">{label}</span>
       <div className="flex items-end gap-2 px-1 leading-none">
          <span className={`text-3xl font-black tracking-widest ${color}`}>{value}</span>
          <div className="flex flex-col gap-1 mb-1">
             <div className={`flex items-center gap-1 text-[10px] font-black ${trendColor}`}>
                {isUp ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
                {isUp ? 'SEC' : 'DEC'}
             </div>
             <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.2em]">CYCLE_BASE</span>
          </div>
       </div>
    </div>
  );
};


export default SQADashboard;

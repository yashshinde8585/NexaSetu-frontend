import React from 'react';
import { 
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2, BarChart3, 
  Users, Zap, LayoutGrid, Activity, Flag, ArrowRight, 
  TrendingDown, TrendingUp, Box, Layers, History, ChevronRight,
  ShieldAlert, Target
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';

/**
 * Quality Leadership Dashboard (QA Lead)
 * Focused on enterprise-grade stability, cross-team defect density, and release command authority.
 */
const QALeadDashboard = () => {
  const { data, isLoading } = useRoleDashboard('qa-lead');

  if (isLoading) return <CenteredLoading />;

  const { 
    globalControl = { releaseStatus: 'STANDBY', criticalBugs: 0, failedTests: 0, teamsAtRisk: 0, blockedPipelines: 0 }, 
    teamOverview = [], 
    releaseDecision = { decision: 'PENDING', isHold: true, reason: 'UNDEFINED', responsibleTeams: [], metrics: { criticalBugs: 0, highFailures: 0, blockedTests: 0 } }, 
    crossTeamBlockers = [], 
    criticalWatchlist = [], 
    teamSignals = [],
    qualityTrend = { passRate: { now: 0, last: 0 }, bugCount: { now: 0, last: 0 } },
    coverageOverview = [],
    regressionHealth = { passed: 0, total: 0, failed: 0, pending: 0, status: 'UNKNOWN' },
    activityFeed = [] 
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      
      {/* 1. Global Quality Command Strip */}
      <div id="qa-command-strip" className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricStripItem 
            label="Release Readiness" 
            value={globalControl.releaseStatus} 
            icon={<Flag size={14} />} 
            color={globalControl.releaseStatus === 'READY' ? 'text-status-success' : 'text-status-error'} 
            accent={globalControl.releaseStatus === 'READY' ? 'bg-status-success' : 'bg-status-error'}
        />
        <MetricStripItem 
            label="Critical Defects" 
            value={globalControl.criticalBugs} 
            icon={<AlertTriangle size={14} />} 
            color={globalControl.criticalBugs > 0 ? 'text-status-error' : 'text-status-success'} 
            accent={globalControl.criticalBugs > 0 ? 'bg-status-error' : 'bg-status-success'}
        />
        <MetricStripItem 
            label="Validation Failures" 
            value={globalControl.failedTests} 
            icon={<XCircle size={14} />} 
            accent="bg-white/10"
        />
        <MetricStripItem 
            label="Units at Risk" 
            value={globalControl.teamsAtRisk} 
            icon={<Users size={14} />} 
            color={globalControl.teamsAtRisk > 0 ? "text-status-warning" : "text-white/40"} 
            accent={globalControl.teamsAtRisk > 0 ? "bg-status-warning" : "bg-white/5"}
        />
        <MetricStripItem 
            label="Blocked Pipelines" 
            value={globalControl.blockedPipelines} 
            icon={<Zap size={14} />} 
            accent="bg-white/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Cross-Team Quality Matrix */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            <DashboardSection title="Structural Quality Matrix" icon={<LayoutGrid size={14} />}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="text-[8px] text-white/30 uppercase font-black tracking-[0.2em] border-b border-white/5">
                             <th className="py-3 px-3">PRODUCTION_UNIT</th>
                             <th className="py-3 px-3">VALIDATION_QUOTA</th>
                             <th className="py-3 px-3 text-center">DEFECTS</th>
                             <th className="py-3 px-3 text-center">BLOCKERS</th>
                             <th className="py-3 px-3 text-right">INTEGRITY_STATUS</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/[0.02]">
                          {teamOverview?.map((t, idx) => (
                            <tr key={idx} className="group hover:bg-white/5 transition-colors text-white/80">
                               <td className="py-3 px-3">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-1.5 h-1.5 rounded-none ${t.status === 'red' ? 'bg-status-error' : 'bg-status-success'}`} />
                                     <span className="text-[10px] font-black uppercase tracking-widest">{t.team}</span>
                                  </div>
                               </td>
                               <td className="py-3 px-3">
                                  <div className="flex flex-col gap-1.5 w-32">
                                     <span className={`text-[9px] font-black ${t.passRate < 80 ? 'text-status-error' : 'text-status-success'}`}>{t.passRate}%</span>
                                     <div className="w-full h-0.5 bg-white/5 rounded-none overflow-hidden">
                                        <div className={`h-full ${t.passRate < 80 ? 'bg-status-error' : 'bg-status-success'}`} style={{ width: `${t.passRate}%` }} />
                                     </div>
                                  </div>
                               </td>
                               <td className="py-3 px-3 text-center text-[10px] font-black tabular-nums">{t.bugs}</td>
                               <td className="py-3 px-3 text-center text-[10px] font-black tabular-nums">{t.blockers}</td>
                               <td className="py-3 px-3 text-right">
                                  <StatusBadge 
                                    status={t.status === 'red' ? 'error' : t.status === 'yellow' ? 'warning' : 'success'} 
                                    text={t.status === 'red' ? 'CRITICAL' : t.status === 'yellow' ? 'WARNING' : 'NOMINAL'} 
                                  />
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
            </DashboardSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DashboardSection title="Structural Defect Trends" icon={<BarChart3 size={14} />}>
                  <div className="flex flex-col gap-6 py-4 px-2">
                      <TrendMetric label="AGGREGATE_PASS_RATE" now={qualityTrend.passRate.now} last={qualityTrend.passRate.last} unit="%" upIsGood />
                      <TrendMetric label="GLOBAL_BUG_DENSITY" now={qualityTrend.bugCount.now} last={qualityTrend.bugCount.last} unit="" upIsGood={false} />
                  </div>
               </DashboardSection>

               <DashboardSection title="Integrity Exceptions" icon={<AlertTriangle size={14} />}>
                  <div className="flex flex-col gap-2 py-2">
                     {crossTeamBlockers?.map((b, idx) => (
                        <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-none flex gap-4 items-start group hover:bg-white/10 transition-colors">
                           <div className="p-1.5 bg-status-warning/10 text-status-warning border border-status-warning/20 rounded-none">
                              <Activity size={12} />
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{b.issue}</span>
                              <span className="text-[8px] font-black uppercase text-white/20 tracking-[0.2em]">{b.impact}_IMPACT</span>
                           </div>
                           <div className="ml-auto">
                              <span className="text-[8px] font-black italic text-status-warning uppercase tracking-[0.2em]">{b.severity}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </DashboardSection>
            </div>
        </div>

        {/* 3. Release Command Authority */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <DashboardSection title="Release Decision Center" icon={<ShieldCheck size={14} />}>
              <div className={`mt-2 flex flex-col items-center py-4 rounded-none border ${releaseDecision.isHold ? 'border-status-error/20 bg-status-error/[0.02]' : 'border-status-success/20 bg-status-success/[0.02]'}`}>
                 <div className={`text-2xl font-black tracking-widest mb-2 ${releaseDecision.isHold ? 'text-status-error' : 'text-status-success'}`}>
                    {releaseDecision.decision || 'AWAITING_PROTOCOLS'}
                 </div>
                 <p className="text-[9px] text-center px-6 text-white/40 uppercase font-black leading-relaxed tracking-[0.2em] mb-4">
                    "{releaseDecision.reason}"
                 </p>
                 <div className="grid grid-cols-2 gap-2 w-full px-4">
                    {releaseDecision.responsibleTeams.map((team, idx) => (
                      <div key={idx} className="px-2 py-1 bg-white/5 border border-white/10 rounded-none text-[8px] font-black text-white/60 uppercase tracking-[0.2em] text-center">
                         {team}_DOMAIN
                      </div>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 px-1">
                  <div className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-none">
                     <span className="text-lg font-black text-status-error leading-none">{releaseDecision.metrics.criticalBugs}</span>
                     <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mt-2">CRITICAL</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-none">
                     <span className="text-lg font-black text-status-error leading-none">{releaseDecision.metrics.highFailures}</span>
                     <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mt-2">FAILURES</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-none">
                     <span className="text-lg font-black text-status-warning leading-none">{releaseDecision.metrics.blockedTests}</span>
                     <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] mt-2">BLOCKED</span>
                  </div>
              </div>
           </DashboardSection>

           <DashboardSection title="Integrity Watchlist" icon={<ShieldAlert size={14} />}>
              <div className="flex flex-col gap-2 py-2">
                  {criticalWatchlist?.map((bug, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-none group hover:bg-white/10 transition-colors">
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{bug.title}</span>
                          <span className="text-[8px] font-black uppercase text-status-error/40 tracking-[0.2em]">{bug.team}_UNIT</span>
                       </div>
                       <ChevronRight size={12} className="text-white/10 group-hover:text-status-error transition-colors" />
                    </div>
                  ))}
              </div>
           </DashboardSection>

           <DashboardSection title="Transactional Feed" icon={<Activity size={14} />}>
              <div className="flex flex-col gap-2 py-1">
                 {activityFeed?.slice(0, 5).map((act, idx) => (
                    <ActivityItem 
                       key={idx} 
                       text={act.text} 
                       time={act.time} 
                    />
                 ))}
              </div>
           </DashboardSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardSection title="Structural Coverage Distribution" icon={<Layers size={14} />}>
            <div className="flex flex-col gap-4 py-4 px-2">
                {coverageOverview?.map((cov, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                     <div className="flex justify-between items-center leading-none">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">{cov.area}_VECTOR</span>
                        <span className={`text-[10px] font-black ${cov.status === 'stable' ? 'text-status-success' : 'text-status-error'}`}>{cov.coverage}%</span>
                     </div>
                     <div className="w-full h-0.5 bg-white/5 rounded-none overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${cov.status === 'stable' ? 'bg-status-success' : 'bg-status-error'}`} style={{ width: `${cov.coverage}%` }} />
                     </div>
                  </div>
                ))}
            </div>
          </DashboardSection>

          <DashboardSection title="Aggregate Regression Stability" icon={<History size={14} />}>
            <div className="flex flex-col gap-6 py-4 px-2">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-black text-white tracking-widest leading-none">{regressionHealth.passed}</span>
                        <span className="text-[8px] font-black uppercase text-white/20 tracking-[0.2em]">SUCCESS_QUOTA</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] leading-none">
                            <span className="text-status-error">FAIL: {regressionHealth.failed}</span>
                            <span className="text-status-warning">PEND: {regressionHealth.pending}</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-none overflow-hidden flex border border-white/5">
                            <div className="h-full bg-status-success" style={{ width: `${(regressionHealth.passed / regressionHealth.total) * 100}%` }} />
                            <div className="h-full bg-status-error" style={{ width: `${(regressionHealth.failed / regressionHealth.total) * 100}%` }} />
                            <div className="h-full bg-status-warning" style={{ width: `${(regressionHealth.pending / regressionHealth.total) * 100}%` }} />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-none bg-status-error" />
                            <span className="text-[8px] font-black uppercase text-white/40 tracking-[0.2em]">PROTOCOL_STATE: <span className="text-status-error">{regressionHealth.status}</span></span>
                        </div>
                    </div>
                </div>
            </div>
          </DashboardSection>
      </div>

      <DashboardSection title="Strategic Resource Allocation" icon={<Users size={14} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
              {teamSignals?.map((sig, idx) => (
                <div key={idx} className="p-3 bg-white/5 border-l-2 border-primary group hover:bg-white/10 transition-colors rounded-none">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${sig.priority === 'critical' ? 'text-status-error' : 'text-primary'}`}>
                            {sig.priority}_{sig.type}
                        </span>
                        <Zap size={12} className="text-primary/20 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[10px] font-black text-white/80 uppercase tracking-widest leading-tight">{sig.alert}</p>
                </div>
              ))}
          </div>
      </DashboardSection>
    </div>
  );
};

const TrendMetric = ({ label, now, last, unit, upIsGood }) => {
  const diff = now - last;
  const isUp = diff > 0;
  const color = (isUp && upIsGood) || (!isUp && !upIsGood) ? 'text-status-success' : 'text-status-error';

  return (
    <div className="flex flex-col gap-2">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">{label}</span>
        <div className="flex items-end gap-2 leading-none">
            <span className="text-3xl font-black text-white tracking-widest leading-none">{now}{unit}</span>
            <div className={`flex flex-col gap-1 ${color}`}>
               <div className="flex items-center gap-1 text-[10px] font-black">
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(diff)}{unit}
               </div>
               <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.2em]">CYCLE_VAR</span>
            </div>
        </div>
    </div>
  );
};

export default QALeadDashboard;

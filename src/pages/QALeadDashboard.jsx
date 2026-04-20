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
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1700px] mx-auto flex flex-col gap-12">
      
      {/* 1. Global Quality Command Strip */}
      <div id="qa-command-strip" className="grid grid-cols-1 md:grid-cols-5 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 2. Cross-Team Quality Matrix */}
        <div className="lg:col-span-8 flex flex-col gap-10">
            <DashboardSection title="Structural Quality Matrix" icon={<LayoutGrid size={14} />}>
                <div className="overflow-x-auto py-2">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="text-[10px] text-white/30 uppercase font-bold tracking-widest border-b border-white/5">
                             <th className="pb-4 px-2">Production Unit</th>
                             <th className="pb-4 px-2">Validation Quota</th>
                             <th className="pb-4 px-2 text-center">Defects</th>
                             <th className="pb-4 px-2 text-center">Blockers</th>
                             <th className="pb-4 px-2 text-right">Integrity Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/[0.02]">
                          {teamOverview?.map((t, idx) => (
                            <tr key={idx} className="group hover:bg-white/[0.015] transition-all text-white/80">
                               <td className="py-4 px-2">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'red' ? 'bg-status-error' : 'bg-status-success'} shadow-[0_0_8px_rgba(var(--color-${t.status === 'red' ? 'status-error' : 'status-success'}),0.4)]`} />
                                     <span className="text-[12px] font-bold uppercase tracking-tight">{t.team}</span>
                                  </div>
                               </td>
                               <td className="py-4 px-2">
                                  <div className="flex flex-col gap-1.5 w-32">
                                     <span className={`text-[11px] font-bold ${t.passRate < 80 ? 'text-status-error' : 'text-status-success'}`}>{t.passRate}%</span>
                                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${t.passRate < 80 ? 'bg-status-error' : 'bg-status-success'}`} style={{ width: `${t.passRate}%` }} />
                                     </div>
                                  </div>
                               </td>
                               <td className="py-4 px-2 text-center text-[12px] font-bold tabular-nums">{t.bugs}</td>
                               <td className="py-4 px-2 text-center text-[12px] font-bold tabular-nums">{t.blockers}</td>
                               <td className="py-4 px-2 text-right">
                                  <StatusBadge 
                                    status={t.status === 'red' ? 'error' : t.status === 'yellow' ? 'warning' : 'success'} 
                                    text={t.status === 'red' ? 'Critical Unit' : t.status === 'yellow' ? 'Warning' : 'Nominal'} 
                                  />
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
            </DashboardSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <DashboardSection title="Structural Defect Trends" icon={<BarChart3 size={14} />}>
                  <div className="flex flex-col gap-8 py-4 px-2">
                      <TrendMetric label="Aggregate Pass Rate" now={qualityTrend.passRate.now} last={qualityTrend.passRate.last} unit="%" upIsGood />
                      <TrendMetric label="Global Bug Density" now={qualityTrend.bugCount.now} last={qualityTrend.bugCount.last} unit="" upIsGood={false} />
                  </div>
               </DashboardSection>

               <DashboardSection title="Integrity Exceptions" icon={<AlertTriangle size={14} />}>
                  <div className="flex flex-col gap-3 py-2">
                     {crossTeamBlockers?.map((b, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded flex gap-4 items-start group hover:border-status-warning/40 transition-all">
                           <div className="p-2 bg-status-warning/10 text-status-warning border border-status-warning/20 rounded">
                              <Activity size={14} />
                           </div>
                           <div className="flex flex-col gap-1">
                              <span className="text-[11px] font-bold text-white uppercase tracking-tight leading-tight">{b.issue}</span>
                              <span className="text-[9px] font-bold uppercase text-white/20 tracking-widest">{b.impact} IMPACT</span>
                           </div>
                           <div className="ml-auto">
                              <span className="text-[9px] font-bold italic text-status-warning uppercase tracking-widest">{b.severity}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </DashboardSection>
            </div>
        </div>

        {/* 3. Release Command Authority */}
        <div className="lg:col-span-4 flex flex-col gap-10">
           <DashboardSection title="Release Decision Center" icon={<ShieldCheck size={14} />}>
              <div className={`mt-2 flex flex-col items-center py-8 rounded border ${releaseDecision.isHold ? 'border-status-error/20 bg-status-error/[0.02]' : 'border-status-success/20 bg-status-success/[0.02]'}`}>
                 <div className={`text-4xl font-black tracking-tighter mb-2 ${releaseDecision.isHold ? 'text-status-error' : 'text-status-success'}`}>
                    {releaseDecision.decision || 'AWAITING_PROTOCOLS'}
                 </div>
                 <p className="text-[10px] text-center px-10 text-white/40 uppercase font-bold leading-relaxed tracking-tight mb-8">
                    "{releaseDecision.reason}"
                 </p>
                 <div className="grid grid-cols-2 gap-2 w-full px-8">
                    {releaseDecision.responsibleTeams.map((team, idx) => (
                      <div key={idx} className="px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded text-[9px] font-bold text-white/60 uppercase tracking-widest text-center">
                         {team} DOMAIN
                      </div>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 px-2">
                  <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded">
                     <span className="text-xl font-bold text-status-error leading-none">{releaseDecision.metrics.criticalBugs}</span>
                     <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2">CRITICAL</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded">
                     <span className="text-xl font-bold text-status-error leading-none">{releaseDecision.metrics.highFailures}</span>
                     <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2">FAILURES</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] border border-white/5 rounded">
                     <span className="text-xl font-bold text-status-warning leading-none">{releaseDecision.metrics.blockedTests}</span>
                     <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2">BLOCKED</span>
                  </div>
              </div>
           </DashboardSection>

           <DashboardSection title="Integrity Watchlist" icon={<ShieldAlert size={14} />}>
              <div className="flex flex-col gap-2 py-2">
                  {criticalWatchlist?.map((bug, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded group hover:bg-status-error/[0.05] hover:border-status-error/20 transition-all">
                       <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-bold text-white uppercase tracking-tight leading-none mb-1">{bug.title}</span>
                          <span className="text-[9px] font-bold uppercase text-status-error/40 tracking-widest">{bug.team} UNIT</span>
                       </div>
                       <ChevronRight size={14} className="text-white/10 group-hover:text-status-error transition-all" />
                    </div>
                  ))}
              </div>
           </DashboardSection>

           <DashboardSection title="Transactional Feed" icon={<Activity size={14} />}>
              <div className="flex flex-col gap-1 py-1">
                 {activityFeed?.slice(0, 5).map((act, idx) => (
                    <ActivityItem 
                       key={idx} 
                       icon={<Target size={12} />} 
                       text={act.text} 
                       time={act.time} 
                       type={act.type === 'test-fail' ? 'error' : act.type === 'bug-critical' ? 'warning' : 'info'}
                    />
                 ))}
              </div>
           </DashboardSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <DashboardSection title="Structural Coverage Distribution" icon={<Layers size={14} />}>
            <div className="flex flex-col gap-6 py-4 px-2">
                {coverageOverview?.map((cov, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                     <div className="flex justify-between items-center leading-none">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{cov.area} Vector</span>
                        <span className={`text-[12px] font-black ${cov.status === 'stable' ? 'text-status-success' : 'text-status-error'}`}>{cov.coverage}%</span>
                     </div>
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${cov.status === 'stable' ? 'bg-status-success' : 'bg-status-error'}`} style={{ width: `${cov.coverage}%` }} />
                     </div>
                  </div>
                ))}
            </div>
          </DashboardSection>

          <DashboardSection title="Aggregate Regression Stability" icon={<History size={14} />}>
            <div className="flex flex-col gap-8 py-4 px-2">
                <div className="flex items-center gap-12">
                    <div className="flex flex-col gap-1">
                        <span className="text-5xl font-black text-white tracking-tighter leading-none">{regressionHealth.passed}</span>
                        <span className="text-[9px] font-bold uppercase text-white/20 tracking-widest">Aggregate Success Quota</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest leading-none">
                            <span className="text-status-error">FAILED: {regressionHealth.failed}</span>
                            <span className="text-status-warning">PENDING: {regressionHealth.pending}</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                            <div className="h-full bg-status-success" style={{ width: `${(regressionHealth.passed / regressionHealth.total) * 100}%` }} />
                            <div className="h-full bg-status-error" style={{ width: `${(regressionHealth.failed / regressionHealth.total) * 100}%` }} />
                            <div className="h-full bg-status-warning" style={{ width: `${(regressionHealth.pending / regressionHealth.total) * 100}%` }} />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-status-error shadow-[0_0_8px_rgba(var(--color-status-error),0.6)]" />
                            <span className="text-[9px] font-bold uppercase text-white/40 tracking-widest">Protocol State: <span className="text-status-error">{regressionHealth.status}</span></span>
                        </div>
                    </div>
                </div>
            </div>
          </DashboardSection>
      </div>

      <DashboardSection title="Strategic Resource Allocation" icon={<Users size={14} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
              {teamSignals?.map((sig, idx) => (
                <div key={idx} className="p-5 bg-white/[0.02] border-l border-primary group hover:bg-primary/[0.03] transition-all rounded-r">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${sig.priority === 'critical' ? 'text-status-error' : 'text-primary'}`}>
                            {sig.priority} {sig.type}
                        </span>
                        <Zap size={14} className="text-primary/20 group-hover:text-primary transition-all" />
                    </div>
                    <p className="text-[12px] font-bold text-white/80 uppercase tracking-tight leading-snug">{sig.alert}</p>
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
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">{label}</span>
        <div className="flex items-end gap-3 leading-none">
            <span className="text-5xl font-black text-white tracking-tighter leading-none">{now}{unit}</span>
            <div className={`flex flex-col gap-1 ${color}`}>
               <div className="flex items-center gap-1 text-[11px] font-bold">
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(diff)}{unit}
               </div>
               <span className="text-[8px] font-bold text-white/10 uppercase tracking-tighter">Cycle Variance</span>
            </div>
        </div>
    </div>
  );
};

export default QALeadDashboard;

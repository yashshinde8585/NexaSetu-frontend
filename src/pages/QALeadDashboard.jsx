import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  BarChart3, 
  Users, 
  Zap, 
  LayoutGrid,
  Activity,
  Flag,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Box,
  Layers,
  History
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';

const QALeadDashboard = () => {
  const { data, isLoading } = useRoleDashboard('qa-lead');

  if (isLoading) return <CenteredLoading />;

  const { 
    globalControl, 
    teamOverview, 
    releaseDecision, 
    crossTeamBlockers, 
    criticalWatchlist, 
    teamSignals,
    qualityTrend,
    coverageOverview,
    regressionHealth,
    activityFeed 
  } = data || {};

  return (
    <div className="p-6 bg-[#020202] min-h-screen text-text-main flex flex-col gap-6 font-sans">
      
      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricStripItem label="Release Readiness" value={globalControl?.releaseStatus} icon={<Flag size={18} />} color={globalControl?.releaseStatus === 'READY' ? 'text-emerald-500' : 'text-rose-500'} />
        <MetricStripItem label="Critical Bugs" value={globalControl?.criticalBugs} icon={<AlertTriangle size={18} />} color={globalControl?.criticalBugs > 0 ? 'text-rose-500' : 'text-emerald-500'} />
        <MetricStripItem label="Failed Tests" value={globalControl?.failedTests} icon={<XCircle size={18} />} />
        <MetricStripItem label="Teams at Risk" value={globalControl?.teamsAtRisk} icon={<Users size={18} />} color="text-amber-500" />
        <MetricStripItem label="Blocked Pipelines" value={globalControl?.blockedPipelines} icon={<Zap size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Team-wise Quality Overview (CORE VIEW) */}
        <div className="lg:col-span-8">
            <DashboardSection title="Team Quality Status" icon={<LayoutGrid size={18} />} description="Overview of team performance and stability">
                <div className="overflow-x-auto mt-6 px-2">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-[10px] text-text-muted uppercase tracking-[0.2em] border-b border-white/5 pb-4">
                             <th className="font-black pb-4">Team Cluster</th>
                             <th className="font-black pb-4">Pass Rate</th>
                             <th className="font-black pb-4 text-center">Bugs</th>
                             <th className="font-black pb-4 text-center">Blockers</th>
                             <th className="font-black pb-4 text-right">Integrity</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/[0.02]">
                          {teamOverview?.map((t, idx) => (
                            <tr key={idx} className="group hover:bg-white/[0.015] transition-all">
                               <td className="py-5">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-2 h-2 rounded-full ${t.status === 'red' ? 'bg-rose-500' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(244,63,94,0.3)]`} />
                                     <span className="text-[14px] font-black text-white/90">{t.team}</span>
                                  </div>
                               </td>
                               <td className="py-5 font-mono text-[13px]">
                                  <span className={t.passRate < 80 ? 'text-rose-400' : 'text-emerald-400'}>{t.passRate}%</span>
                                  <div className="w-16 h-1.5 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                                     <div className={`h-full ${t.passRate < 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${t.passRate}%` }} />
                                  </div>
                               </td>
                               <td className="py-5 text-center font-bold text-white/70">{t.bugs}</td>
                               <td className="py-5 text-center font-bold text-white/70">{t.blockers}</td>
                               <td className="py-5 text-right">
                                  <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    t.status === 'red' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                                    t.status === 'yellow' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                  }`}>
                                     {t.status === 'red' ? 'Critical' : t.status === 'yellow' ? 'Warning' : 'Stable'}
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
            </DashboardSection>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <DashboardSection title="Release Status" icon={<ShieldCheck size={18} />} className={releaseDecision?.isHold ? 'border-rose-500/40 bg-rose-500/[0.02]' : 'border-emerald-500/40'}>
              <div className="mt-6 flex flex-col items-center justify-center py-8 rounded-[2.5rem] bg-white/[0.015] border border-white/5">
                 <div className={`text-4xl font-black mb-2 ${releaseDecision?.isHold ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {releaseDecision?.decision}
                 </div>
                 <p className="text-[11px] text-center px-10 text-text-muted italic leading-relaxed">
                    "{releaseDecision?.reason}"
                 </p>
                 <div className="grid grid-cols-2 gap-3 mt-8 w-full px-8">
                    {releaseDecision?.responsibleTeams.map((team, idx) => (
                      <div key={idx} className="px-3 py-2 bg-white/5 rounded-2xl text-[10px] font-black text-white/70 border border-white/5 text-center">
                         {team} Team
                      </div>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-[2rem]">
                     <span className="text-2xl font-black text-rose-500">{releaseDecision?.metrics.criticalBugs}</span>
                     <span className="text-[8px] font-black text-text-muted uppercase tracking-widest text-center">Critical</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-[2rem]">
                     <span className="text-2xl font-black text-rose-500">{releaseDecision?.metrics.highFailures}</span>
                     <span className="text-[8px] font-black text-text-muted uppercase tracking-widest text-center">Failures</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-[2rem]">
                     <span className="text-2xl font-black text-amber-500">{releaseDecision?.metrics.blockedTests}</span>
                     <span className="text-[8px] font-black text-text-muted uppercase tracking-widest text-center">Blocked</span>
                  </div>
              </div>
           </DashboardSection>

           {/* 4. Cross-Team Blockers */}
           <DashboardSection title="Blockers" icon={<AlertTriangle size={18} />}>
              <div className="flex flex-col gap-3 mt-4">
                 {crossTeamBlockers?.map((b, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.02] rounded-3xl border border-white/5 flex gap-4 items-start group hover:border-amber-500/30 transition-all">
                       <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                          <Activity size={14} />
                       </div>
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[12px] font-bold text-white/90">{b.issue}</span>
                          <span className="text-[9px] font-black uppercase text-text-muted/50 tracking-widest">{b.impact}</span>
                       </div>
                       <div className="ml-auto">
                          <span className="text-[8px] font-black italic text-amber-500 uppercase">{b.severity}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </DashboardSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* 5. Quality Trend (Org-Level) */}
         <DashboardSection title="Quality Trends" icon={<BarChart3 size={18} />}>
            <div className="grid grid-cols-2 gap-6 mt-6">
                <TrendMetric label="Org Pass Rate" now={qualityTrend?.passRate.now} last={qualityTrend?.passRate.last} unit="%" upIsGood />
                <TrendMetric label="Global Bugs" now={qualityTrend?.bugCount.now} last={qualityTrend?.bugCount.last} unit="" upIsGood={false} />
            </div>
         </DashboardSection>

         {/* 6. Critical Bug Watchlist */}
         <DashboardSection title="Critical Bug Watchlist" icon={<AlertTriangle size={18} />}>
            <div className="flex flex-col gap-2 mt-4">
                {criticalWatchlist?.map((bug, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-white/[0.015] border border-white/5 rounded-2xl group hover:bg-rose-500/[0.03] transition-all">
                     <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-white/90">{bug.title}</span>
                        <span className="text-[8px] font-black uppercase text-rose-500 tracking-widest">{bug.team}</span>
                     </div>
                     <ArrowRight size={14} className="text-text-muted group-hover:text-rose-500" />
                  </div>
                ))}
            </div>
         </DashboardSection>

         {/* 7. Coverage Overview (Across Teams) */}
         <DashboardSection title="Coverage Status" icon={<Layers size={18} />}>
            <div className="flex flex-col gap-5 mt-6">
                {coverageOverview?.map((cov, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                     <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">{cov.area}</span>
                        <span className={`text-[10px] font-black ${cov.status === 'stable' ? 'text-emerald-500' : 'text-rose-500'}`}>{cov.coverage}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${cov.status === 'stable' ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${cov.coverage}%` }} />
                     </div>
                  </div>
                ))}
            </div>
         </DashboardSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* 8. Regression Health (Global) */}
          <DashboardSection title="Regression Status" icon={<History size={18} />}>
            <div className="flex items-center gap-12 mt-6">
                <div className="flex flex-col items-center">
                    <div className="text-5xl font-black text-white/90">{regressionHealth?.passed}</div>
                    <span className="text-[10px] font-black uppercase text-text-muted/40 tracking-widest mt-1">Global Passed</span>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex justify-between text-[11px] font-bold px-2">
                        <span className="text-rose-500">FAILED: {regressionHealth?.failed}</span>
                        <span className="text-amber-500">PENDING: {regressionHealth?.pending}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500" style={{ width: '75%' }} />
                        <div className="h-full bg-rose-500" style={{ width: '18.75%' }} />
                        <div className="h-full bg-amber-500" style={{ width: '6.25%' }} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                        <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest">Build Status: {regressionHealth?.status}</span>
                    </div>
                </div>
            </div>
          </DashboardSection>

          {/* 9. QA Activity Feed (Cross-Team) */}
          <DashboardSection title="Activity Stream" icon={<Activity size={18} />}>
             <div className="flex flex-col gap-3 mt-4">
                {activityFeed?.map((act, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-white/[0.015] border border-white/5 rounded-3xl group hover:bg-white/[0.03] transition-all">
                     <div className={`p-2 rounded-xl shrink-0 ${
                       act.type === 'test-fail' ? 'bg-rose-500/10 text-rose-500' :
                       act.type === 'bug-critical' ? 'bg-rose-600/10 text-rose-600' :
                       'bg-primary/10 text-primary'
                     }`}>
                        <Box size={14} />
                     </div>
                     <span className="text-[12px] font-semibold text-white/80">{act.text}</span>
                     <span className="ml-auto text-[10px] font-mono text-text-muted">{act.time}</span>
                  </div>
                ))}
             </div>
          </DashboardSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <DashboardSection title="QA Resourcing" icon={<Users size={18} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {teamSignals?.map((sig, idx) => (
                    <div key={idx} className="p-5 bg-white/[0.015] border-l-4 border-l-primary rounded-3xl group hover:bg-primary/5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${sig.priority === 'critical' ? 'text-rose-500' : 'text-primary'}`}>
                                {sig.priority} {sig.type}
                            </span>
                            <Zap size={14} className="text-primary/40 group-hover:text-primary transition-all" />
                        </div>
                        <p className="text-[13px] font-bold text-white/90">{sig.alert}</p>
                    </div>
                  ))}
              </div>
          </DashboardSection>
      </div>
    </div>
  );
};



const TrendMetric = ({ label, now, last, unit, upIsGood }) => {
  const diff = now - last;
  const isUp = diff > 0;
  const color = (isUp && upIsGood) || (!isUp && !upIsGood) ? 'text-emerald-500' : 'text-rose-500';

  return (
    <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/50">{label}</span>
        <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-white/90">{now}{unit}</span>
            <div className="flex flex-col mb-1.5">
               <div className={`flex items-center gap-0.5 text-[11px] font-black ${color}`}>
                  {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(diff)}{unit}
               </div>
               <span className="text-[8px] font-mono text-text-muted/30 uppercase tracking-tighter">vs Last Wk</span>
            </div>
        </div>
    </div>
  );
};

export default QALeadDashboard;

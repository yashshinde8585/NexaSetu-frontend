import React from 'react';
import { 
  TestTube, AlertCircle, CheckCircle2, Activity, ShieldCheck, 
  Layers, Cpu, Zap, Play, Bug, ChevronRight, ShieldAlert, 
  Server, Crosshair, ClipboardList, Target, Terminal, 
  BarChart3, RefreshCcw
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';

/**
 * QA Dashboard
 * Strategic focus on test execution, defect tracking, and release readiness.
 */
const QADashboard = () => {
  const { data, isLoading } = useRoleDashboard('qa');

  if (isLoading) return <CenteredLoading />;

  const { 
    controlStrip = { testCount: 0, failed: 0, blocked: 0, releaseRisk: 'UNKNOWN' }, 
    executionBoard = [], 
    bugTracker = [], 
    cycleProgress = { percentage: 0, executed: 0, total: 0, passed: 0, failed: 0 }, 
    releaseStatus = { status: 'STANDBY', isReady: false, criticalBugs: 0, failedTests: 0, blockedTests: 0 }, 
    buildStatus = { environment: 'UNKNOWN', version: 'v0.0.0', status: 'UNKNOWN' }, 
    coverage = {},
    regressionStatus = { passed: 0, total: 0, failed: 0, pending: 0 },
    activity = [] 
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1600px] mx-auto flex flex-col gap-12">
      
      {/* 1. Global Performance Metrics */}
      <div id="qa-metrics-strip" className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricStripItem 
            label="Total Tests" 
            value={controlStrip.testCount} 
            icon={<ClipboardList size={14} />} 
            accent="bg-primary" 
        />
        <MetricStripItem 
            label="Failed Tests" 
            value={controlStrip.failed} 
            icon={<AlertCircle size={14} />} 
            color={controlStrip.failed > 0 ? "text-status-error" : "text-white/40"} 
            accent={controlStrip.failed > 0 ? "bg-status-error" : "bg-white/5"} 
        />
        <MetricStripItem 
            label="Blocked Tests" 
            value={controlStrip.blocked} 
            icon={<ShieldAlert size={14} />} 
            color={controlStrip.blocked > 0 ? "text-status-warning" : "text-white/40"} 
            accent={controlStrip.blocked > 0 ? "bg-status-warning" : "bg-white/5"} 
        />
        <MetricStripItem 
          label="Release Risk" 
          value={controlStrip.releaseRisk} 
          icon={<Zap size={14} />} 
          color={controlStrip.releaseRisk === 'HIGH' ? 'text-status-error' : 'text-status-success'} 
          accent={controlStrip.releaseRisk === 'HIGH' ? 'bg-status-error' : 'bg-status-success'} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 2. Main Column: Execution Board */}
        <div className="lg:col-span-8 flex flex-col gap-12">
           <DashboardSection title="Execution Board" icon={<Terminal size={14} />}>
              <div className="overflow-x-auto py-2">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="text-[10px] text-white/30 uppercase font-bold tracking-widest border-b border-white/5">
                          <th className="pb-4 px-2">Test Name</th>
                          <th className="pb-4 px-2">Module</th>
                          <th className="pb-4 px-2">Status</th>
                          <th className="pb-4 px-2">Priority</th>
                          <th className="pb-4 px-2 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                       {executionBoard?.map((item, idx) => (
                         <tr key={idx} className="group hover:bg-white/[0.015] transition-all">
                            <td className="py-4 px-2">
                               <div className="flex flex-col gap-1 pr-6">
                                  <span className="text-[12px] font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">{item.title}</span>
                                  {item.blocked && <span className="text-[9px] text-status-warning font-bold uppercase tracking-widest leading-none italic">Blocked By: {item.blockedBy}</span>}
                               </div>
                            </td>
                            <td className="py-4 px-2 text-[10px] font-bold text-white/30 tracking-widest uppercase tabular-nums">{item.module}</td>
                            <td className="py-4 px-2">
                               <StatusBadge status={item.status} text={item.status} mini />
                            </td>
                            <td className="py-4 px-2">
                               <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                 item.priority === 'high' || item.priority === 'critical' ? 'text-status-error' : 'text-white/20'
                               }`}>{item.priority}</span>
                            </td>
                            <td className="py-4 px-2 text-right">
                               <button className="p-2 bg-white/[0.03] border border-white/10 rounded hover:border-primary/40 hover:bg-white/[0.1] transition-all text-white/20 hover:text-white">
                                  <ChevronRight size={14} />
                                </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </DashboardSection>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <DashboardSection title="Bug Tracker" icon={<Bug size={14} />}>
                  <div className="flex flex-col gap-px bg-white/10 border border-white/10 rounded overflow-hidden mt-2">
                     {bugTracker?.map((bug, idx) => (
                        <div key={idx} className="p-5 bg-black flex justify-between items-center group hover:bg-white/[0.02] transition-all border-b border-white/[0.05] last:border-0">
                           <div className="flex flex-col gap-1">
                              <span className="text-[11px] font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-none truncate pr-4">{bug.title}</span>
                              <span className="text-[8px] font-bold uppercase text-status-error/40 tracking-[0.2em] leading-none">{bug.severity} Severity</span>
                           </div>
                           <StatusBadge status={bug.status} text={bug.status} mini />
                        </div>
                     ))}
                  </div>
               </DashboardSection>

               <DashboardSection title="Recent Activity" icon={<Activity size={14} />}>
                  <div className="flex flex-col gap-px bg-white/10 border border-white/10 rounded overflow-hidden mt-2 max-h-[320px] overflow-y-auto custom-scrollbar">
                      {activity?.slice(0, 6).map((sign, idx) => (
                        <div key={idx} className="bg-black border-b border-white/[0.05] last:border-0 px-2">
                           <ActivityItem 
                              icon={sign.type === 'test-fail' ? <AlertCircle size={12} /> : sign.type === 'bug-log' ? <Bug size={12} /> : <Crosshair size={12} />} 
                              text={sign.text} 
                              time={sign.time} 
                              type={sign.type === 'test-fail' ? 'error' : sign.type === 'bug-log' ? 'warning' : 'info'}
                              mini
                           />
                        </div>
                      ))}
                  </div>
               </DashboardSection>
           </div>
        </div>

        {/* 3. Sidebar Column: Release & Status */}
        <div className="lg:col-span-4 flex flex-col gap-12">
           <DashboardSection title="Release Status" icon={<ShieldCheck size={14} />}>
              <div className="flex flex-col items-center py-10 bg-white/[0.015] rounded border border-white/5 gap-10 mt-2 relative overflow-hidden group">
                 <div className={`text-4xl font-bold tracking-tighter tabular-nums leading-none transition-colors ${releaseStatus?.isReady ? 'text-status-success' : 'text-status-error'}`}>
                    {releaseStatus?.status || 'AWAITING_PROTOCOLS'}
                 </div>
                 <div className="grid grid-cols-3 gap-px bg-white/10 border-y border-white/10 w-full text-center">
                    <div className="bg-black py-6 flex flex-col gap-2">
                       <span className="text-2xl font-bold text-status-error leading-none tabular-nums tracking-tighter">{releaseStatus?.criticalBugs}</span>
                       <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none italic">BUGS</span>
                    </div>
                    <div className="bg-black py-6 flex flex-col gap-2">
                       <span className="text-2xl font-bold text-status-error leading-none tabular-nums tracking-tighter">{releaseStatus?.failedTests}</span>
                       <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none italic">FAILED</span>
                    </div>
                    <div className="bg-black py-6 flex flex-col gap-2">
                       <span className="text-2xl font-bold text-status-warning leading-none tabular-nums tracking-tighter">{releaseStatus?.blockedTests}</span>
                       <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none italic">BLOCKED</span>
                    </div>
                 </div>
                 {!releaseStatus?.isReady && (
                   <button className="w-4/5 py-4 bg-status-error/10 text-status-error border border-status-error/30 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-status-error hover:text-black transition-all active:scale-95">
                      Address Blockers
                   </button>
                 )}
              </div>
           </DashboardSection>

           <DashboardSection title="Build Status" icon={<Server size={14} />}>
              <div className="flex flex-col gap-px bg-white/10 border border-white/10 rounded overflow-hidden mt-2">
                 <div className="bg-black p-6 flex justify-between items-center group hover:bg-white/[0.02] transition-all">
                    <div className="flex flex-col gap-2">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 leading-none">Environment</span>
                       <span className="text-[12px] font-bold text-white uppercase tracking-tight leading-none">{buildStatus?.environment}</span>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded text-primary text-[10px] font-bold uppercase tracking-widest tabular-nums">
                       {buildStatus?.version}
                    </div>
                 </div>
                 <div className={`p-6 flex items-center justify-between transition-colors ${
                    buildStatus?.status === 'Stable' ? 'bg-status-success/5 border-t border-white/10' : 'bg-status-error/5 border-t border-white/10'
                 }`}>
                    <span className="text-[11px] font-bold text-white/40 uppercase tracking-tight leading-none">Status</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${
                       buildStatus?.status === 'Stable' ? 'text-status-success' : 'text-status-error'
                    }`}>{buildStatus?.status}</span>
                 </div>
              </div>
           </DashboardSection>

           <DashboardSection title="Cycle Progress" icon={<RefreshCcw size={14} />}>
              <div className="flex flex-col gap-8 py-6 px-2">
                  <div className="flex items-end justify-between leading-none">
                     <span className="text-5xl font-bold text-white tracking-tighter tabular-nums leading-none">{cycleProgress?.percentage}%</span>
                     <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest tabular-nums">{cycleProgress?.executed} / {cycleProgress?.total} Executed</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${cycleProgress?.percentage}%` }}
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-4 bg-status-success/5 border border-status-success/20 rounded text-center group hover:bg-status-success/10 transition-all">
                        <span className="block text-2xl font-bold text-status-success leading-none tabular-nums tracking-tighter">{cycleProgress?.passed}</span>
                        <span className="text-[9px] font-bold uppercase text-status-success/40 tracking-[0.2em] mt-2 block">Passed</span>
                     </div>
                     <div className="p-4 bg-status-error/5 border border-status-error/20 rounded text-center group hover:bg-status-error/10 transition-all">
                        <span className="block text-2xl font-bold text-status-error leading-none tabular-nums tracking-tighter">{cycleProgress?.failed}</span>
                        <span className="text-[9px] font-bold uppercase text-status-error/40 tracking-[0.2em] mt-2 block">Failed</span>
                     </div>
                  </div>
              </div>
           </DashboardSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <DashboardSection title="Coverage" icon={<Layers size={14} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 py-6 px-4">
               {Object.entries(coverage || {}).map(([mod, val], idx) => (
                 <div key={idx} className="flex flex-col gap-3 group">
                    <div className="flex justify-between items-end leading-none">
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest group-hover:text-white transition-colors">{mod}</span>
                       <span className={`text-[12px] font-bold tabular-nums ${val > 80 ? 'text-status-success' : 'text-status-warning'}`}>{val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                       <div className={`h-full transition-all duration-1000 ${val > 80 ? 'bg-status-success' : 'bg-status-warning'}`} style={{ width: `${val}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </DashboardSection>

         <DashboardSection title="Regression Status" icon={<BarChart3 size={14} />}>
            <div className="flex flex-col gap-10 py-6 px-4">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <span className="text-5xl font-bold text-white tracking-tighter leading-none tabular-nums">{regressionStatus?.passed} / {regressionStatus?.total}</span>
                    <span className="text-[10px] font-bold uppercase text-white/20 tracking-widest italic">Passed Tests</span>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex flex-col items-center px-6 py-3 bg-white/[0.015] border border-white/10 rounded group hover:border-status-error/40 transition-all">
                        <span className="text-xl font-bold text-status-error leading-none tabular-nums tracking-tighter">{regressionStatus?.failed}</span>
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2 whitespace-nowrap">FAILED</span>
                     </div>
                     <div className="flex flex-col items-center px-6 py-3 bg-white/[0.015] border border-white/10 rounded group hover:border-status-warning/40 transition-all">
                        <span className="text-xl font-bold text-status-warning leading-none tabular-nums tracking-tighter">{regressionStatus?.pending}</span>
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-2 whitespace-nowrap">PENDING</span>
                      </div>
                  </div>
               </div>
               <div className="w-full h-2.5 bg-white/5 rounded-full flex overflow-hidden border border-white/5">
                  <div className="h-full bg-status-success transition-all duration-1000" style={{ width: `${(regressionStatus?.passed / regressionStatus?.total) * 100 || 0}%` }} />
                  <div className="h-full bg-status-error transition-all duration-1000" style={{ width: `${(regressionStatus?.failed / regressionStatus?.total) * 100 || 0}%` }} />
                  <div className="h-full bg-status-warning transition-all duration-1000" style={{ width: `${(regressionStatus?.pending / regressionStatus?.total) * 100 || 0}%` }} />
               </div>
            </div>
         </DashboardSection>
      </div>
    </div>
  );
};

export default QADashboard;

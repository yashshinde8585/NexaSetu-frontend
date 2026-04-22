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
    <div className="min-h-screen bg-black text-white p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      
      {/* 1. Global Performance Metrics */}
      <div id="qa-metrics-strip" className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Main Column: Execution Board */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            <DashboardSection title="Execution Board" icon={<Terminal size={14} />}>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="text-[8px] text-white/20 uppercase font-black tracking-[0.2em] border-b border-white/5">
                           <th className="py-3 px-3">TEST_UNIT</th>
                           <th className="py-3 px-3">MODULE</th>
                           <th className="py-3 px-3">STATUS</th>
                           <th className="py-3 px-3">PRIORITY</th>
                           <th className="py-3 px-3 text-right">OP</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/[0.02]">
                        {executionBoard?.map((item, idx) => (
                          <tr key={idx} className="group hover:bg-white/5 transition-colors">
                             <td className="py-3 px-3">
                                <div className="flex flex-col gap-1 pr-6">
                                   <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors leading-tight">{item.title}</span>
                                   {item.blocked && <span className="text-[8px] text-status-warning font-black uppercase tracking-[0.2em] leading-none italic">BLOCKED_BY: {item.blockedBy}</span>}
                                </div>
                             </td>
                             <td className="py-3 px-3 text-[9px] font-black text-white/30 tracking-[0.2em] uppercase tabular-nums">{item.module}</td>
                             <td className="py-3 px-3">
                                <StatusBadge status={item.status} />
                             </td>
                             <td className="py-3 px-3">
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                                  item.priority === 'high' || item.priority === 'critical' ? 'text-status-error' : 'text-white/20'
                                }`}>{item.priority}</span>
                             </td>
                             <td className="py-3 px-3 text-right">
                                <button className="p-1.5 bg-white/5 border border-white/10 rounded-none hover:border-primary/40 transition-colors text-white/20 hover:text-white">
                                   <ChevronRight size={12} />
                                 </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </DashboardSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DashboardSection title="Bug Tracker" icon={<Bug size={14} />}>
                  <div className="flex flex-col gap-px bg-white/5 border border-white/10 rounded-none mt-2 overflow-hidden">
                     {bugTracker?.map((bug, idx) => (
                        <div key={idx} className="p-3 bg-black flex justify-between items-center group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                           <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors leading-none truncate pr-4">{bug.title}</span>
                              <span className="text-[8px] font-black uppercase text-status-error/40 tracking-[0.2em] leading-none">{bug.severity} SEVERITY</span>
                           </div>
                           <StatusBadge status={bug.status} />
                        </div>
                     ))}
                  </div>
               </DashboardSection>

               <DashboardSection title="Activity Register" icon={<Activity size={14} />}>
                  <div className="flex flex-col gap-px bg-white/5 border border-white/10 rounded-none mt-2 overflow-hidden max-h-[320px] overflow-y-auto custom-scrollbar">
                      {activity?.slice(0, 6).map((sign, idx) => (
                        <div key={idx} className="bg-black border-b border-white/5 last:border-0 px-3">
                           <ActivityItem 
                              text={sign.text} 
                              time={sign.time} 
                           />
                        </div>
                      ))}
                  </div>
               </DashboardSection>
            </div>
        </div>

        {/* 3. Sidebar Column: Release & Status */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <DashboardSection title="Release Readiness" icon={<ShieldCheck size={14} />}>
               <div className="flex flex-col items-center py-6 bg-white/5 rounded-none border border-white/10 gap-8 mt-2 relative overflow-hidden group">
                  <div className={`text-2xl font-black tracking-widest leading-none transition-colors ${releaseStatus?.isReady ? 'text-status-success' : 'text-status-error'}`}>
                     {releaseStatus?.status || 'AWAITING_PROTOCOLS'}
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-white/10 border-y border-white/10 w-full text-center">
                     <div className="bg-black py-4 flex flex-col gap-1">
                        <span className="text-xl font-black text-status-error leading-none tabular-nums tracking-widest">{releaseStatus?.criticalBugs}</span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none italic">BUGS</span>
                     </div>
                     <div className="bg-black py-4 flex flex-col gap-1">
                        <span className="text-xl font-black text-status-error leading-none tabular-nums tracking-widest">{releaseStatus?.failedTests}</span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none italic">FAILED</span>
                     </div>
                     <div className="bg-black py-4 flex flex-col gap-1">
                        <span className="text-xl font-black text-status-warning leading-none tabular-nums tracking-widest">{releaseStatus?.blockedTests}</span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none italic">BLOCKED</span>
                     </div>
                  </div>
                  {!releaseStatus?.isReady && (
                    <button className="w-4/5 py-3 bg-status-error/10 text-status-error border border-status-error/30 rounded-none text-[9px] font-black uppercase tracking-[0.2em] hover:bg-status-error hover:text-black transition-colors active:scale-95">
                       ADDRESS_BLOCKERS
                    </button>
                  )}
               </div>
           </DashboardSection>

           <DashboardSection title="Build Status" icon={<Server size={14} />}>
               <div className="flex flex-col gap-px bg-white/10 border border-white/10 rounded-none overflow-hidden mt-2">
                  <div className="bg-black p-4 flex justify-between items-center group hover:bg-white/5 transition-colors">
                     <div className="flex flex-col gap-1.5">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 leading-none">ENVIRONMENT</span>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{buildStatus?.environment}</span>
                     </div>
                     <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded-none text-primary text-[9px] font-black uppercase tracking-[0.2em] tabular-nums">
                        {buildStatus?.version}
                     </div>
                  </div>
                  <div className={`p-4 flex items-center justify-between border-t border-white/5 ${
                     buildStatus?.status === 'Stable' ? 'bg-status-success/5' : 'bg-status-error/5'
                  }`}>
                     <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">STATUS</span>
                     <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${
                        buildStatus?.status === 'Stable' ? 'text-status-success' : 'text-status-error'
                     }`}>{buildStatus?.status}</span>
                  </div>
               </div>
           </DashboardSection>

           <DashboardSection title="Cycle Progress" icon={<RefreshCcw size={14} />}>
               <div className="flex flex-col gap-6 py-4 px-4 bg-white/5 border border-white/10 rounded-none mt-2">
                  <div className="flex items-end justify-between leading-none">
                     <span className="text-3xl font-black text-white tracking-widest tabular-nums leading-none">{cycleProgress?.percentage}%</span>
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] tabular-nums">{cycleProgress?.executed} / {cycleProgress?.total} EXEC</span>
                  </div>
                  <div className="w-full h-0.5 bg-white/5 rounded-none overflow-hidden border border-white/5">
                      <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${cycleProgress?.percentage}%` }}
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="p-3 bg-status-success/5 border border-status-success/20 rounded-none text-center group hover:bg-status-success/10 transition-colors">
                        <span className="block text-xl font-black text-status-success leading-none tabular-nums tracking-widest">{cycleProgress?.passed}</span>
                        <span className="text-[8px] font-black uppercase text-status-success/40 tracking-[0.2em] mt-1.5 block">PASSED</span>
                     </div>
                     <div className="p-3 bg-status-error/5 border border-status-error/20 rounded-none text-center group hover:bg-status-error/10 transition-colors">
                        <span className="block text-xl font-black text-status-error leading-none tabular-nums tracking-widest">{cycleProgress?.failed}</span>
                        <span className="text-[8px] font-black uppercase text-status-error/40 tracking-[0.2em] mt-1.5 block">FAILED</span>
                     </div>
                  </div>
               </div>
           </DashboardSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <DashboardSection title="Metric Coverage" icon={<Layers size={14} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-4 px-4">
               {Object.entries(coverage || {}).map(([mod, val], idx) => (
                 <div key={idx} className="flex flex-col gap-2 group">
                    <div className="flex justify-between items-end leading-none">
                       <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{mod}</span>
                       <span className={`text-[10px] font-black tabular-nums ${val > 80 ? 'text-status-success' : 'text-status-warning'}`}>{val}%</span>
                    </div>
                    <div className="w-full h-0.5 bg-white/5 rounded-none overflow-hidden border border-white/5">
                       <div className={`h-full transition-all duration-1000 ${val > 80 ? 'bg-status-success' : 'bg-status-warning'}`} style={{ width: `${val}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </DashboardSection>

         <DashboardSection title="Regression Strategy" icon={<BarChart3 size={14} />}>
            <div className="flex flex-col gap-6 py-4 px-4 bg-white/5 border border-white/10 rounded-none mt-2">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-3xl font-black text-white tracking-widest leading-none tabular-nums">{regressionStatus?.passed} / {regressionStatus?.total}</span>
                    <span className="text-[8px] font-black uppercase text-white/20 tracking-[0.2em] italic">PASSED_TESTS</span>
                  </div>
                  <div className="flex gap-2">
                     <div className="flex flex-col items-center px-4 py-2 bg-black border border-white/10 rounded-none group hover:border-status-error/40 transition-colors">
                        <span className="text-lg font-black text-status-error leading-none tabular-nums tracking-widest">{regressionStatus?.failed}</span>
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest mt-1 whitespace-nowrap">FAILED</span>
                     </div>
                     <div className="flex flex-col items-center px-4 py-2 bg-black border border-white/10 rounded-none group hover:border-status-warning/40 transition-colors">
                        <span className="text-lg font-black text-status-warning leading-none tabular-nums tracking-widest">{regressionStatus?.pending}</span>
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-widest mt-1 whitespace-nowrap">PENDING</span>
                      </div>
                  </div>
               </div>
               <div className="w-full h-0.5 bg-white/5 rounded-none flex overflow-hidden border border-white/5">
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

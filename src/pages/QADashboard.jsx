import React from 'react';
import { 
  TestTube, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Zap, 
  Play, 
  Bug,
  ChevronRight,
  ShieldAlert,
  Server,
  Crosshair,
  ClipboardList
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';

/**
 * QA Dashboard
 */
const QADashboard = () => {
  const { data, isLoading } = useRoleDashboard('qa');

  if (isLoading) return <CenteredLoading />;

  const { 
    controlStrip, 
    executionBoard, 
    bugTracker, 
    cycleProgress, 
    releaseStatus, 
    buildStatus, 
    coverage,
    regressionStatus,
    activity 
  } = data || {};

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 pt-8 pb-12 space-y-12 bg-background-dark min-h-screen font-sans">
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricStripItem label="Test Cases Today" value={controlStrip?.testCount} icon={<ClipboardList size={20} />} accent="bg-primary/20" />
        <MetricStripItem label="Failed" value={controlStrip?.failed} icon={<AlertCircle size={20} />} color="text-rose-500" highlight={controlStrip?.failed > 0} />
        <MetricStripItem label="Blocked" value={controlStrip?.blocked} icon={<ShieldAlert size={20} />} color="text-amber-500" />
        <MetricStripItem 
          label="Release Risk" 
          value={controlStrip?.releaseRisk} 
          icon={<Zap size={20} />} 
          color={controlStrip?.releaseRisk === 'HIGH' ? 'text-rose-600' : 'text-emerald-500'} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Test Execution */}
        <div className="lg:col-span-8">
           <DashboardSection title="Test Execution" icon={<Play size={18} />} description="Status tracking for active test cases">
              <div className="overflow-x-auto mt-6">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[10px] text-text-muted uppercase tracking-[0.2em] border-b border-white/5 pb-2">
                          <th className="font-black pb-4 px-2">Test Case</th>
                          <th className="font-black pb-4">Module</th>
                          <th className="font-black pb-4">Status</th>
                          <th className="font-black pb-4">Priority</th>
                          <th className="font-black pb-4 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                       {executionBoard?.map((item, idx) => (
                         <tr key={idx} className="group hover:bg-white/[0.015] transition-all">
                            <td className="py-5 px-2">
                               <div className="flex flex-col gap-1">
                                  <span className="text-[14px] font-bold text-white/90">{item.title}</span>
                                  {item.blocked && <span className="text-[10px] text-amber-500 italic font-medium">Blocked By: {item.blockedBy}</span>}
                               </div>
                            </td>
                            <td className="py-5 font-mono text-[12px] text-white/60">{item.module}</td>
                            <td className="py-5">
                               <StatusBadge status={item.status} />
                            </td>
                            <td className="py-5">
                               <span className={`text-[10px] font-black uppercase tracking-widest ${
                                 item.priority === 'high' || item.priority === 'critical' ? 'text-rose-400' : 'text-text-muted'
                               }`}>{item.priority}</span>
                            </td>
                            <td className="py-5 text-right px-2">
                               <button className="p-2 bg-white/5 rounded-xl hover:bg-primary/20 transition-all text-text-muted hover:text-primary">
                                  <ChevronRight size={16} />
                                </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </DashboardSection>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
           {/* Release Readiness */}
           <DashboardSection title="Release Status" icon={<ShieldCheck size={18} />}>
              <div className="mt-8 flex flex-col items-center py-8 bg-white/[0.01] rounded-3xl border border-white/5 gap-6">
                 <div className={`text-4xl font-black ${releaseStatus?.isReady ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {releaseStatus?.status}
                 </div>
                 <div className="grid grid-cols-3 gap-6 w-full px-6 text-center">
                    <div className="flex flex-col gap-1">
                       <span className="text-xl font-black text-rose-500">{releaseStatus?.criticalBugs}</span>
                       <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">CRITICAL</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-xl font-black text-rose-500">{releaseStatus?.failedTests}</span>
                       <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">FAILED</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-xl font-black text-amber-500">{releaseStatus?.blockedTests}</span>
                       <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">BLOCKED</span>
                    </div>
                 </div>
                 {!releaseStatus?.isReady && (
                   <button className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all">
                      Address Critical Blockers
                   </button>
                 )}
              </div>
           </DashboardSection>

           {/* Build Status */}
           <DashboardSection title="Build Health" icon={<Server size={18} />}>
              <div className="flex flex-col gap-4 mt-8">
                 <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex flex-col gap-1">
                       <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/40">Environment</span>
                       <span className="text-[13px] font-bold text-white">{buildStatus?.environment}</span>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest">
                       {buildStatus?.version}
                    </div>
                 </div>
                 <div className={`p-4 rounded-2xl flex items-center justify-between border ${
                   buildStatus?.status === 'Stable' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'
                 }`}>
                    <span className="text-[13px] font-bold text-white/70">Build State</span>
                    <span className={`text-[12px] font-black uppercase tracking-widest ${
                      buildStatus?.status === 'Stable' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>{buildStatus?.status}</span>
                 </div>
              </div>
           </DashboardSection>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Bug Tracker */}
         <DashboardSection title="Bugs" icon={<Bug size={18} />}>
            <div className="flex flex-col gap-3 mt-8">
               {bugTracker?.map((bug, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.015] border border-white/5 rounded-2xl group hover:border-rose-500/30 transition-all">
                    <div className="flex flex-col gap-1">
                       <span className="text-[13px] font-bold text-white/80">{bug.title}</span>
                       <span className="text-[10px] font-black uppercase text-rose-400 font-mono tracking-widest">{bug.severity}</span>
                    </div>
                    <StatusBadge status={bug.status} mini />
                 </div>
               ))}
            </div>
         </DashboardSection>

         {/* Cycle Progress */}
         <DashboardSection title="Cycle Progress" icon={<Activity size={18} />}>
            <div className="mt-8 flex flex-col gap-6">
                <div className="flex items-end justify-between px-1">
                    <span className="text-4xl font-black text-white">{cycleProgress?.percentage}%</span>
                    <span className="text-[10px] font-bold text-text-muted mb-1">{cycleProgress?.executed} / {cycleProgress?.total} Executed</span>
                </div>
                <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                    <div 
                        className="h-full bg-primary shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] transition-all duration-1000" 
                        style={{ width: `${cycleProgress?.percentage}%` }}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                      <span className="block text-xl font-black text-emerald-500">{cycleProgress?.passed}</span>
                      <span className="text-[9px] font-black uppercase text-emerald-500/50">Passed</span>
                   </div>
                   <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center">
                      <span className="block text-xl font-black text-rose-500">{cycleProgress?.failed}</span>
                      <span className="text-[9px] font-black uppercase text-rose-500/50">Failed</span>
                   </div>
                </div>
            </div>
         </DashboardSection>

         {/* Coverage */}
         <DashboardSection title="Module Coverage" icon={<Layers size={18} />}>
            <div className="space-y-6 mt-8 px-2">
               {Object.entries(coverage || {}).map(([mod, val], idx) => (
                 <div key={idx} className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                       <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">{mod}</span>
                       <span className={`text-[12px] font-black ${val > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${val > 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-amber-500'}`} style={{ width: `${val}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </DashboardSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
         <DashboardSection title="Regression Suite" icon={<ShieldAlert size={18} />}>
            <div className="flex flex-col gap-8 mt-8">
               <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-white">{regressionStatus?.passed} / {regressionStatus?.total}</span>
                    <span className="text-[10px] font-black uppercase text-text-muted/40 tracking-[0.2em] block mt-1">Resolution Efficiency</span>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex flex-col items-center px-4 py-2 bg-white/5 rounded-2xl">
                        <span className="text-base font-black text-rose-500">{regressionStatus?.failed}</span>
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Failed</span>
                     </div>
                     <div className="flex flex-col items-center px-4 py-2 bg-white/5 rounded-2xl">
                        <span className="text-base font-black text-amber-500">{regressionStatus?.pending}</span>
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Pending</span>
                     </div>
                  </div>
               </div>
               <div className="w-full h-3 bg-white/5 rounded-full flex overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: '75%' }} />
                  <div className="h-full bg-rose-500" style={{ width: '12.5%' }} />
                  <div className="h-full bg-amber-500 rounded-r-full" style={{ width: '12.5%' }} />
               </div>
            </div>
         </DashboardSection>

         <DashboardSection title="Activity" icon={<Activity size={18} />}>
            <div className="flex flex-col gap-4 mt-8">
                {activity?.map((sign, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl group hover:bg-white/[0.02] transition-all">
                     <div className={`p-2 rounded-xl ${
                       sign.type === 'test-fail' ? 'bg-rose-500/10 text-rose-500' :
                       sign.type === 'bug-log' ? 'bg-amber-500/10 text-amber-500' :
                       'bg-primary/10 text-primary'
                     }`}>
                        {sign.type === 'test-fail' ? <AlertCircle size={14} /> : sign.type === 'bug-log' ? <Bug size={14} /> : <Crosshair size={14} />}
                     </div>
                     <span className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors">{sign.text}</span>
                     <span className="ml-auto text-[10px] font-mono text-text-muted shrink-0 opacity-40">{sign.time}</span>
                  </div>
                ))}
            </div>
         </DashboardSection>
      </div>
    </div>
  );
};

export default QADashboard;

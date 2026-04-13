import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  MessageSquare, 
  HelpCircle,
  GitPullRequest,
  Check,
  ChevronRight,
  Zap,
  Star,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';

const JREDashboard = () => {
  const { data, isLoading } = useRoleDashboard('jre');

  if (isLoading) return <CenteredLoading />;

  const { 
    dayMetrics, 
    guidedTasks, 
    stuckGuidance, 
    progress, 
    nextSteps,
    activity,
    prStats 
  } = data || {};

  return (
    <div className="p-6 bg-black min-h-screen text-white flex flex-col gap-10 font-mono selection:bg-primary/30 max-w-[1400px] mx-auto">
      
      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <MetricStripItem label="Active Assignments" value={dayMetrics?.tasksToday} color="text-white" icon={<Star size={16} />} />
         <MetricStripItem label="Imminent Deadline" value={dayMetrics?.dueToday} color="text-status-warning" icon={<Clock size={16} />} />
         <MetricStripItem label="Execution Blocked" value={dayMetrics?.blocked} color="text-status-error" icon={<ShieldAlert size={16} />} />
      </div>

      {/* Primary Mission Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 flex flex-col gap-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 flex items-center gap-6 px-4">
               GUIDED MISSIONS <div className="h-0.5 bg-white/10 flex-1" />
            </h2>
            
            <div className="grid grid-cols-1 gap-10">
               {guidedTasks?.map((task, idx) => (
                 <div key={idx} className="bg-black border-2 border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group hover:border-primary/40 transition-all">
                    {/* Status indicator strip */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-white/5 group-hover:bg-primary transition-all" />
                    
                    <div className="flex flex-col md:flex-row gap-10">
                       <div className="flex-1">
                          <div className="flex items-center gap-4 mb-6">
                             <span className="px-3 py-1 bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-full">MISSION ALPHA</span>
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest italic font-mono">// DEADLINE: {task.due}</span>
                          </div>
                          <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight group-hover:text-primary transition-colors">{task.title}</h3>
                          <p className="text-[12px] font-black text-white/40 uppercase leading-relaxed tracking-tight mb-10 max-w-xl italic">{task.description || 'Focus on completing accuracy over speed. Follow the steps below point-by-point.'}</p>
                          
                          <div className="grid grid-cols-1 gap-4">
                             {task.steps?.map((step, sIdx) => (
                               <div key={sIdx} className="flex items-center gap-5 p-5 bg-black border border-white/10 rounded-2xl hover:border-primary transition-all cursor-pointer group/step">
                                  <div className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all ${
                                    step.completed ? 'bg-status-success text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-white/5 text-white/20 border border-white/10'
                                  }`}>
                                     {step.completed ? <Check size={14} strokeWidth={4} /> : <span className="text-[10px] font-black font-mono">{sIdx + 1}</span>}
                                  </div>
                                  <span className={`text-[12px] font-black uppercase tracking-tight ${step.completed ? 'text-status-success/60 line-through' : 'text-white/60 group-hover/step:text-white'}`}>{step.text}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <div className="md:w-56 flex flex-col border-l border-white/10 pl-10 shrink-0">
                          <div className="mb-10">
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 block mb-4">DEPLOYMENT STATUS</span>
                             <button className="w-full py-4 bg-black border-2 border-primary/20 text-primary rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-primary/10 transition-all shadow-lg">
                                {task.status}
                             </button>
                             
                             {task.blocked && (
                               <div className="mt-4 p-5 bg-black border-2 border-status-error/40 rounded-2xl animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                  <span className="text-[10px] font-black text-status-error uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                     <ShieldAlert size={14} /> STUCK DETECTED
                                  </span>
                               </div>
                             )}
                          </div>
                          
                          <button className="flex items-center justify-center gap-3 text-[10px] font-black text-white/20 hover:text-primary transition-all uppercase tracking-[0.4em] mt-auto group/btn italic">
                             TECH SPEC <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
               {!guidedTasks?.length && (
                 <div className="py-24 text-center flex flex-col items-center gap-6 bg-black border-2 border-dashed border-white/10 rounded-[3rem] shadow-inner font-mono">
                    <div className="p-6 bg-white/5 rounded-full text-white/10"><Zap size={40} /></div>
                    <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white/20 italic">No missions initialized in current sector.</span>
                 </div>
               )}
            </div>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-10">
            <DashboardSection title="SUPPORT VECTORS" icon={<HelpCircle size={16} />} className="bg-black border-status-error/10">
               <div className="space-y-6 mt-8">
                  {stuckGuidance?.map((s, idx) => (
                    <div key={idx} className="bg-black border-2 border-white/5 p-6 rounded-[2rem] shadow-xl group hover:border-status-error/40 transition-all">
                       <span className="block text-[12px] font-black text-white mb-4 uppercase tracking-tight group-hover:text-status-error transition-colors">{s.issue}</span>
                       <div className="flex flex-col gap-3 p-5 bg-black border border-status-error/20 rounded-2xl mb-4 shadow-inner">
                          <span className="text-[9px] font-black text-status-error uppercase tracking-[0.3em] italic underline">RECOMMENDED ACTION</span>
                          <p className="text-[11px] font-black text-white/60 leading-relaxed uppercase">{s.suggestedAction}</p>
                       </div>
                       <div className="flex items-center gap-3 mt-4 border-t border-white/5 pt-4">
                          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><MessageSquare size={12} className="text-white/20" /></div>
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">QUERY LEAD // </span>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{s.suggestedPerson}</span>
                       </div>
                    </div>
                  ))}
                  {!stuckGuidance?.length && (
                    <div className="py-10 text-center text-[10px] text-white/10 uppercase font-black italic tracking-[0.5em] flex flex-col items-center justify-center gap-4">
                       <ShieldCheck size={24} className="text-status-success/20" /> OPERATIONAL INTEGRITY NOMINAL
                    </div>
                  )}
               </div>
            </DashboardSection>

            <DashboardSection title="PERFORMANCE TELEMETRY" icon={<Zap size={16} />}>
               <div className="mt-10 flex flex-col gap-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                     <div className="flex flex-col gap-2">
                        <span className="text-5xl font-black text-white tracking-tighter">{progress?.percentage}%</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">EFFICIENCY QUOTIENT</span>
                     </div>
                     <div className="p-6 bg-black border border-primary/20 rounded-[2rem] flex flex-col items-center shadow-lg group hover:border-primary transition-all">
                        <span className="text-3xl font-black text-primary group-hover:scale-110 transition-all">{progress?.completed}</span>
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-1">FINALIZED</span>
                     </div>
                  </div>
                  <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-white/10 shadow-inner">
                     <div 
                        className="h-full bg-primary shadow-[0_0_20px_rgba(var(--color-primary),0.5)] transition-all duration-1000 ease-out"
                        style={{ width: `${progress?.percentage}%` }}
                     />
                  </div>
               </div>
            </DashboardSection>

            <DashboardSection title="SEQUENTIAL TARGETING" icon={<Sparkles size={16} />} className="bg-black">
               <div className="mt-8 flex flex-col gap-4">
                  <div className="p-8 bg-black border-2 border-white/10 rounded-[2.5rem] relative overflow-hidden group hover:border-primary transition-all shadow-xl">
                     <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-40 transition-all"><ArrowRight size={32} className="text-primary" /></div>
                     <span className="block text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 font-mono flex items-center gap-2 italic">
                        <Zap size={12} fill="currentColor" /> NEXT TARGET // ALPHA
                     </span>
                     <p className="text-[15px] font-black text-white uppercase tracking-tight leading-tight mb-3 group-hover:text-primary transition-colors">{nextSteps?.main}</p>
                     <p className="text-[11px] font-black text-white/20 uppercase tracking-widest italic">{nextSteps?.minor}</p>
                  </div>
               </div>
            </DashboardSection>
         </div>
      </div>

      {/* Grid Bottom: Help Section & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
         {/* 6. Help / Ask Section */}
         <div className="bg-black border-2 border-white/10 rounded-[3rem] p-12 flex flex-col md:flex-row gap-10 items-center justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
            <div className="flex flex-col gap-4 text-center md:text-left z-10">
               <h3 className="text-2xl font-black text-white tracking-widest uppercase">SUPPORT PORTAL</h3>
               <p className="text-[12px] font-black text-white/30 max-w-sm uppercase leading-relaxed tracking-tight italic">Request intervention. Technical blockers and review latency will be resolved via direct lead engagement.</p>
            </div>
            <div className="flex gap-6 z-10">
               <HelpAction icon={<Star size={20} />} label="LEAD" sub="TECHNICAL" />
               <HelpAction icon={<MessageCircle size={20} />} label="SENIOR" sub="ASSESSMENT" />
            </div>
         </div>

         <DashboardSection title="OPERATIONAL LOG: UPDATES" icon={<ShieldCheck size={16} />}>
            <div className="flex flex-col gap-5 mt-8 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
               {activity?.map((a, idx) => (
                 <div key={idx} className="flex items-center gap-5 p-5 bg-black border border-white/10 rounded-2xl group hover:border-white/30 transition-all shadow-md">
                    <div className={`p-3 rounded-xl shrink-0 border ${
                      a.type === 'approval' ? 'border-status-success/30 text-status-success bg-status-success/5' : 
                      a.type === 'review' ? 'border-primary/30 text-primary bg-primary/5' : 
                      'border-status-warning/30 text-status-warning bg-status-warning/5'
                    }`}>
                       <Sparkles size={16} />
                    </div>
                    <span className="text-[13px] font-black text-white/60 uppercase tracking-tight group-hover:text-white transition-colors leading-tight">{a.text}</span>
                    <span className="ml-auto text-[10px] font-mono font-black text-white/10 uppercase tracking-widest shrink-0 italic">NOW</span>
                 </div>
               ))}
               {!activity?.length && (
                 <div className="py-12 text-center text-[11px] text-white/10 uppercase font-black italic tracking-[0.5em]">Zero operational logs recorded.</div>
               )}
            </div>
         </DashboardSection>
      </div>
    </div>
  );
};



const HelpAction = ({ icon, label, sub }) => (
  <button className="flex flex-col items-center gap-4 p-8 bg-black rounded-[2rem] border-2 border-white/10 hover:border-primary group transition-all w-36 shadow-lg active:scale-95">
     <div className="p-4 bg-black border border-white/10 rounded-2xl group-hover:border-primary group-hover:text-primary transition-all text-white/30">{icon}</div>
     <div className="flex flex-col text-center gap-1">
        <span className="text-[12px] font-black text-white uppercase tracking-widest">{label}</span>
        <span className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em] group-hover:text-primary transition-colors">{sub} // ALPHA</span>
     </div>
  </button>
);

export default JREDashboard;

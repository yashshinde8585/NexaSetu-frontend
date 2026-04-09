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
    <div className="p-6 bg-[#050505] min-h-screen text-text-main flex flex-col gap-6 font-sans max-w-7xl mx-auto">
      
      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <MetricStripItem label="Tasks Today" value={dayMetrics?.tasksToday} color="text-primary" icon={<Star size={16} />} />
         <MetricStripItem label="Due Today" value={dayMetrics?.dueToday} color="text-amber-500" icon={<Clock size={16} />} />
         <MetricStripItem label="Blocked" value={dayMetrics?.blocked} color="text-rose-500" icon={<ShieldAlert size={16} />} />
      </div>

      {/* My Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 flex flex-col gap-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3 ml-2">
               Tasks <div className="h-px bg-white/5 flex-1" />
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
               {guidedTasks?.map((task, idx) => (
                 <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group hover:bg-white/[0.03] transition-all">
                    {/* Progress Background */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-all" />
                    
                    <div className="flex flex-col md:flex-row gap-8">
                       <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                             <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-lg">Task</span>
                             <span className="text-[10px] font-bold text-text-muted">{task.due}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3 tracking-tight leading-tight">{task.title}</h3>
                          <p className="text-xs text-text-muted/80 leading-relaxed mb-6 max-w-lg">{task.description || 'Focus on completing accuracy over speed. Follow the steps below point-by-point.'}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                             {task.steps?.map((step, sIdx) => (
                               <div key={sIdx} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.03] rounded-xl hover:border-white/10 transition-all cursor-pointer">
                                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                                    step.completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/20'
                                  }`}>
                                     {step.completed ? <Check size={12} strokeWidth={4} /> : <div className="w-1 h-1 bg-white/20 rounded-full" />}
                                  </div>
                                  <span className={`text-[11px] font-bold ${step.completed ? 'text-emerald-500/80 line-through' : 'text-white/60'}`}>{step.text}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <div className="md:w-48 flex flex-col justify-between border-l border-white/5 pl-8 shrink-0">
                          <div>
                             <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/40 block mb-2">Status</span>
                             <button className="w-full py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4">
                                {task.status}
                             </button>
                             
                             {task.blocked && (
                               <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-pulse">
                                  <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                                     <ShieldAlert size={10} /> Stuck
                                  </span>
                               </div>
                             )}
                          </div>
                          
                          <button className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest mt-auto group">
                             Full Instruction <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
               {!guidedTasks?.length && (
                 <div className="py-20 text-center flex flex-col items-center gap-4 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                    <div className="p-4 bg-white/5 rounded-full text-white/20"><Zap size={32} /></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted/40">No missions assigned yet.</span>
                 </div>
               )}
            </div>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-8">
            <DashboardSection title="Support" icon={<HelpCircle size={16} />} className="bg-rose-500/[0.015] border-rose-500/10">
               <div className="space-y-4 mt-6">
                  {stuckGuidance?.map((s, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                       <span className="block text-[11px] font-bold text-white mb-2">{s.issue}</span>
                       <div className="flex flex-col gap-2 p-3 bg-rose-500/5 rounded-xl border border-rose-500/10 mb-2">
                          <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Next Action</span>
                          <p className="text-[10px] font-medium text-rose-200/80 leading-relaxed">{s.suggestedAction}</p>
                       </div>
                       <div className="flex items-center gap-2 mt-2">
                          <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-bold text-white/40"><MessageSquare size={10} /></div>
                          <span className="text-[10px] font-bold text-white/40">Ask </span>
                          <span className="text-[10px] font-bold text-primary">{s.suggestedPerson}</span>
                       </div>
                    </div>
                  ))}
                  {!stuckGuidance?.length && (
                    <div className="py-6 text-center text-[10px] text-text-muted/40 uppercase font-bold italic tracking-widest flex items-center justify-center gap-2">
                       <ShieldCheck size={14} className="text-emerald-500/40" /> All systems green
                    </div>
                  )}
               </div>
            </DashboardSection>

            <DashboardSection title="Performance" icon={<Zap size={16} />}>
               <div className="mt-8 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-4xl font-black text-white">{progress?.percentage}%</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted/40">Performance</span>
                     </div>
                     <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex flex-col items-center">
                        <span className="text-xl font-black text-primary">{progress?.completed}</span>
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">Completed</span>
                     </div>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <div 
                        className="h-full bg-gradient-to-r from-primary to-emerald-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-1000"
                        style={{ width: `${progress?.percentage}%` }}
                     />
                  </div>
               </div>
            </DashboardSection>

            <DashboardSection title="What's Next" icon={<Sparkles size={16} />} className="bg-primary/[0.02]">
               <div className="mt-6 flex flex-col gap-4">
                  <div className="p-5 bg-white/[0.03] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-primary/20 transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity"><ArrowRight size={24} className="text-primary" /></div>
                     <span className="block text-[9px] font-black text-primary uppercase tracking-widest mb-2 font-mono flex items-center gap-1.5 underline decoration-primary/30">
                        <Zap size={10} fill="currentColor" /> Priority
                     </span>
                     <p className="text-[13px] font-bold text-white leading-tight mb-2">{nextSteps?.main}</p>
                     <p className="text-[10px] font-medium text-text-muted/60">{nextSteps?.minor}</p>
                  </div>
               </div>
            </DashboardSection>
         </div>
      </div>

      {/* Grid Bottom: Help Section & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
         {/* 6. Help / Ask Section */}
         <div className="bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent border border-indigo-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex flex-col gap-2 text-center md:text-left">
               <h3 className="text-xl font-bold text-white tracking-tight">Need Support?</h3>
               <p className="text-xs text-text-muted max-w-xs font-medium leading-relaxed">Raising a doubt isn't a weakness—it's how you grow. One-click help is available.</p>
            </div>
            <div className="flex gap-4">
               <HelpAction icon={<Star size={16} />} label="Lead" sub="Technical" />
               <HelpAction icon={<MessageCircle size={16} />} label="Senior" sub="Review" />
            </div>
         </div>

         <DashboardSection title="Recent Updates" icon={<ShieldCheck size={16} />}>
            <div className="flex flex-col gap-4 mt-6">
               {activity?.map((a, idx) => (
                 <div key={idx} className="flex items-center gap-4 p-4 bg-white/[0.015] border border-white/5 rounded-2xl group hover:bg-white/[0.03] transition-all">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      a.type === 'approval' ? 'bg-emerald-500/10 text-emerald-500' : 
                      a.type === 'review' ? 'bg-primary/10 text-primary' : 
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                       <Sparkles size={14} />
                    </div>
                    <span className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors">{a.text}</span>
                    <span className="ml-auto text-[10px] font-mono text-text-muted tracking-tighter shrink-0">Now</span>
                 </div>
               ))}
               {!activity?.length && (
                 <div className="py-8 text-center text-[10px] text-text-muted/40 uppercase font-black italic">No feedback signals today.</div>
               )}
            </div>
         </DashboardSection>
      </div>
    </div>
  );
};



const HelpAction = ({ icon, label, sub }) => (
  <button className="flex flex-col items-center gap-2 p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-primary/20 hover:border-primary/40 group transition-all w-28">
     <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">{icon}</div>
     <div className="flex flex-col text-center">
        <span className="text-[10px] font-bold text-white">{label}</span>
        <span className="text-[8px] font-black uppercase text-text-muted/50 tracking-tighter leading-none mt-1 group-hover:text-primary transition-colors">{sub}</span>
     </div>
  </button>
);

export default JREDashboard;

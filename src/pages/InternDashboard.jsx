import React from 'react';
import { 
  GraduationCap, BookOpen, UserCheck, Smile, Compass, HelpCircle, 
  ExternalLink, MessageCircle, CheckCircle2, Clock, ShieldAlert, 
  ArrowRight, Target, Users, Award, ChevronRight, Zap, Terminal,
  Cpu, Layers, Rocket
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';

/**
 * Intern Dashboard
 * Focused on task execution, learning path coordination, and technical mentorship.
 */
const InternDashboard = () => {
  const { data, isLoading } = useRoleDashboard('intern');

  if (isLoading) return <CenteredLoading />;

  const { 
    assignmentMetrics = { assigned: 0, dueToday: 0, blocked: 0 }, 
    currentTask, 
    learningSection = { topic: 'NONE', resources: [] }, 
    progress = { percentage: 0, completed: 0, total: 0 }, 
    feedback = [],
    blockerOptions = [] 
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1600px] mx-auto flex flex-col gap-12">
      
      {/* 1. Global Performance metrics */}
      <div id="intern-metrics-strip" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricStripItem 
            icon={<Target size={14} />} 
            label="Daily Assignments" 
            value={assignmentMetrics.assigned} 
            accent="bg-primary"
        />
        <MetricStripItem 
            icon={<Clock size={14} />} 
            label="Critical Deadlines" 
            value={assignmentMetrics.dueToday} 
            color={assignmentMetrics.dueToday > 0 ? "text-status-warning" : "text-white/40"} 
            accent={assignmentMetrics.dueToday > 0 ? "bg-status-warning" : "bg-white/5"}
        />
        <MetricStripItem 
            icon={<ShieldAlert size={14} />} 
            label="Operation Blockers" 
            value={assignmentMetrics.blocked} 
            color={assignmentMetrics.blocked > 0 ? "text-status-error" : "text-white/40"} 
            accent={assignmentMetrics.blocked > 0 ? "bg-status-error" : "bg-white/5"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* 2. Main Track: Current Assignment */}
         <div className="lg:col-span-8 flex flex-col gap-12">
            
            <DashboardSection title="Current Assignment" icon={<Terminal size={14} />}>
               {currentTask ? (
                 <div className="flex flex-col gap-10 py-2">
                    <div className="flex items-center gap-4">
                        <StatusBadge status="active" text="Executing" mini />
                        <div className="h-px bg-white/5 flex-1" />
                        <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest tabular-nums">ID: {currentTask.id || 'TASK-####'}</span>
                    </div>
                    
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tight leading-tight">{currentTask.title}</h2>
                        <div className="bg-white/[0.015] border border-white/5 p-8 rounded">
                           <span className="text-[9px] font-bold uppercase tracking-widest text-primary block mb-4">OBJECTIVE</span>
                           <p className="text-[12px] font-bold text-white/60 uppercase leading-relaxed tracking-tight">{currentTask.objective}</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Steps</span>
                        {currentTask.steps?.map((step, idx) => (
                           <div key={idx} className="flex items-center gap-6 p-5 bg-white/[0.01] border border-white/5 rounded group/step transition-all hover:bg-white/[0.02]">
                              <div className={`w-10 h-10 rounded border flex items-center justify-center transition-all ${
                                step.completed ? 'bg-status-success/10 border-status-success/30 text-status-success' : 'border-white/10 text-white/10'
                              }`}>
                                 {step.completed ? <CheckCircle2 size={18} /> : <span className="text-[12px] font-bold tabular-nums">{idx + 1}</span>}
                              </div>
                              <span className={`text-[12px] font-bold uppercase tracking-tight transition-all ${step.completed ? 'text-white/20 line-through' : 'text-white/60 group-hover/step:text-white'}`}>
                                 {step.text}
                              </span>
                           </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/10 rounded group hover:border-primary/40 transition-all">
                       <span className="text-[10px] font-bold text-white/20 flex items-center gap-3 uppercase tracking-widest leading-none">
                          <ExternalLink size={14} className="text-primary/40" /> Documentation Repository
                       </span>
                       <a href={currentTask.reference} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 group-hover:translate-x-1">
                          OPEN_LINK <ChevronRight size={12} />
                       </a>
                    </div>
                 </div>
               ) : (
                 <div className="py-24 text-center flex flex-col items-center gap-6 bg-white/[0.01] border border-white/5 border-dashed rounded">
                    <Compass size={48} className="text-white/5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/10 italic">Awaiting strategic assignment...</span>
                 </div>
               )}
            </DashboardSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <DashboardSection title="Feedback Cluster" icon={<Award size={14} />}>
                  <div className="flex flex-col gap-4 py-2">
                     {feedback?.map((f, idx) => (
                       <div key={idx} className="p-6 bg-white/[0.015] border border-white/5 rounded flex flex-col gap-3 group hover:border-status-success/40 transition-all border-l-2 border-l-white/20">
                          <span className="text-[11px] font-bold text-status-success uppercase tracking-widest leading-none">{f.title}</span>
                          <p className="text-[10px] font-bold text-white/30 uppercase leading-snug tracking-tight group-hover:text-white/60 italic">"{f.message}"</p>
                       </div>
                     ))}
                     {(!feedback || feedback.length === 0) && (
                       <div className="py-16 text-center text-[10px] text-white/10 uppercase font-bold tracking-widest italic border border-white/5 border-dashed rounded">No performance data clusters identified.</div>
                     )}
                  </div>
               </DashboardSection>

               <div className="bg-primary/5 border border-primary/20 rounded p-10 flex flex-col items-center text-center gap-8 group hover:border-primary/40 transition-all relative overflow-hidden">
                  <div className="w-20 h-20 bg-black border border-primary/20 rounded flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                     <GraduationCap size={40} />
                  </div>
                  <div className="flex flex-col gap-3">
                     <h3 className="text-xl font-bold text-white tracking-widest uppercase leading-none">Initiate Review</h3>
                     <p className="text-[10px] font-bold text-white/20 uppercase leading-relaxed max-w-[15rem]">Signal module completion to mentoring units for performance audit.</p>
                  </div>
                  <button className="w-full py-4 bg-primary text-black text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white transition-all shadow-2xl shadow-primary/20 active:scale-95">
                     SIGNAL_COMPLETION
                  </button>
               </div>
            </div>
         </div>

         {/* 3. Sidebar Track: Logistics & Progression */}
         <div className="lg:col-span-4 flex flex-col gap-12">
            
            <DashboardSection title="Mentorship Coordination" icon={<Users size={14} />}>
               <div className="flex flex-col items-center text-center py-6">
                  <div className="w-24 h-24 rounded bg-white/[0.02] border border-white/10 p-2 mb-6 group hover:border-primary/40 transition-all relative overflow-hidden">
                      <div className="w-full h-full rounded border border-white/5 flex items-center justify-center bg-black relative z-10 transition-colors group-hover:bg-primary/5">
                        <UserCheck size={36} className="text-white/10 group-hover:text-primary transition-colors" />
                      </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2 leading-none">{currentTask?.mentor?.name || 'CENTRAL_UNIT'}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-10 leading-none">Engineering Mentor Lead</p>
                  
                  <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded overflow-hidden w-full">
                     <button className="flex flex-col items-center justify-center gap-2 py-5 bg-black text-[9px] font-bold uppercase tracking-widest hover:text-primary transition-all">
                        <MessageCircle size={16} /> COMM-LINK
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 py-5 bg-black text-[9px] font-bold uppercase tracking-widest hover:text-primary transition-all">
                        <HelpCircle size={16} /> SYNC_REQ
                     </button>
                  </div>
               </div>
            </DashboardSection>

            <DashboardSection title="Learning Resources" icon={<Layers size={14} />}>
               <div className="flex flex-col gap-6 py-2">
                  <div className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest rounded self-start leading-none">
                     MODULE: {learningSection?.topic || 'UNASSIGNED'}
                  </div>
                  <div className="flex flex-col gap-3">
                     {learningSection?.resources?.map((res, idx) => (
                        <a 
                          key={idx} 
                          href={res.link} 
                          className="flex items-center justify-between p-5 bg-white/[0.015] border border-white/5 rounded hover:border-primary/40 hover:bg-white/[0.03] transition-all group"
                        >
                           <span className="text-[11px] font-bold text-white/30 group-hover:text-white uppercase tracking-tight leading-none truncate pr-4">{res.title}</span>
                           <ChevronRight size={14} className="text-white/10 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                        </a>
                     ))}
                  </div>
               </div>
            </DashboardSection>

            <DashboardSection title="Operation Blockers" icon={<ShieldAlert size={14} />}>
               <div className="flex flex-col gap-3 py-2">
                  {blockerOptions?.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className="flex items-center justify-between p-5 bg-white/[0.015] border border-white/5 rounded text-[10px] font-bold uppercase tracking-widest text-white/10 hover:bg-status-error/5 hover:border-status-error/40 hover:text-status-error transition-all group"
                    >
                       {opt.label}
                       <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
               </div>
            </DashboardSection>

            <DashboardSection title="Overall Progress" icon={<Target size={14} />}>
               <div className="flex flex-col gap-8 py-4 px-2">
                  <div className="flex items-end justify-between leading-none">
                     <div className="flex flex-col gap-2">
                        <span className="text-5xl font-bold text-white tracking-tighter tabular-nums">{progress?.percentage || 0}%</span>
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Aggregate Efficiency</span>
                     </div>
                     <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1 tabular-nums">{progress?.completed || 0} / {progress?.total || 0} UNITS</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <div 
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${progress?.percentage || 0}%` }}
                     />
                  </div>
               </div>
            </DashboardSection>
         </div>
      </div>
    </div>
  );
};

export default InternDashboard;

import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  Smile, 
  Compass, 
  HelpCircle,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Target,
  Users,
  Award
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';

/**
 * Intern Dashboard
 */
const InternDashboard = () => {
  const { data, isLoading } = useRoleDashboard('intern');

  if (isLoading) return <CenteredLoading />;

  const { 
    assignmentMetrics, 
    currentTask, 
    learningSection, 
    progress, 
    feedback,
    blockerOptions 
  } = data || {};

  return (
    <div className="p-6 bg-black min-h-screen text-white flex flex-col gap-10 font-mono selection:bg-primary/30 max-w-[1400px] mx-auto">
      
      {/* Assignment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricStripItem label="Assigned Missions" value={assignmentMetrics?.assigned} icon={<Target size={20} />} color="text-white" />
        <MetricStripItem label="Imminent Deadline" value={assignmentMetrics?.dueToday} icon={<Clock size={20} />} color={assignmentMetrics?.dueToday > 0 ? 'text-status-warning' : 'text-white/40'} />
        <MetricStripItem label="Execution Blocked" value={assignmentMetrics?.blocked} icon={<ShieldAlert size={20} />} color={assignmentMetrics?.blocked > 0 ? 'text-status-error' : 'text-white/40'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 flex flex-col gap-8">
            
            <DashboardSection title="PRIMARY MISSION DIRECTIVE" icon={<BookOpen size={18} />}>
               {currentTask ? (
                 <div className="mt-6">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl border border-primary/20">
                          Active Task
                       </span>
                       <div className="h-px bg-white/5 flex-1" />
                    </div>
                    
                    <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">{currentTask.title}</h2>
                    
                    <div className="bg-black border-2 border-white/10 rounded-[2.5rem] p-10 mb-10 shadow-2xl relative overflow-hidden group hover:border-primary/40 transition-all">
                       <div className="absolute top-0 left-0 w-2 h-full bg-white/5 group-hover:bg-primary transition-all" />
                       <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4 italic">// STRATEGIC OBJECTIVE</h4>
                       <p className="text-[14px] font-black text-white uppercase leading-relaxed tracking-tight mb-12 italic">{currentTask.objective}</p>
                       
                       <div className="flex flex-col gap-5">
                          {currentTask.steps?.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-5 group/step p-4 bg-black border border-white/5 rounded-2xl hover:border-white/20 transition-all">
                               <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${
                                 step.completed ? 'bg-status-success border-status-success text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-black border-white/10 text-white/20'
                               }`}>
                                  {step.completed ? <CheckCircle2 size={16} /> : <span className="text-[11px] font-black font-mono">{idx + 1}</span>}
                               </div>
                               <span className={`text-[13px] font-black uppercase tracking-tight transition-all ${step.completed ? 'text-status-success/40 line-through' : 'text-white/60 group-hover/step:text-white'}`}>
                                  {step.text}
                               </span>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-black border-2 border-dashed border-white/10 rounded-2xl group hover:border-white/30 transition-all shadow-inner">
                       <span className="text-[11px] font-black text-white/20 flex items-center gap-3 uppercase tracking-widest italic">
                          <ExternalLink size={14} /> REFERENCE VECTOR:
                       </span>
                       <a href={currentTask.reference} target="_blank" rel="noreferrer" className="text-[11px] font-black text-primary uppercase tracking-[0.3em] hover:text-white transition-all underline decoration-primary/20 hover:decoration-white">
                          ACCESS DOCUMENTATION
                       </a>
                    </div>
                 </div>
               ) : (
                 <div className="py-24 text-center flex flex-col items-center gap-6 bg-black border-2 border-dashed border-white/10 rounded-[3rem] shadow-inner mt-8">
                    <div className="p-6 bg-white/5 rounded-full text-white/10"><Compass size={40} /></div>
                    <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white/20 italic">AWAITING MISSION INITIALIZATION...</span>
                 </div>
               )}
            </DashboardSection>

            {/* Success Signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <DashboardSection title="MISSION SUCCESS LOG" icon={<Award size={18} />}>
                  <div className="flex flex-col gap-5 mt-8">
                     {feedback?.map((f, idx) => (
                       <div key={idx} className="p-6 bg-black border border-status-success/20 rounded-[1.5rem] flex flex-col gap-3 group hover:border-status-success transition-all shadow-lg">
                          <span className="text-[12px] font-black text-status-success uppercase tracking-widest">{f.title}</span>
                          <p className="text-[11px] font-black text-white/40 leading-tight uppercase italic group-hover:text-white/60">"{f.message}"</p>
                       </div>
                     ))}
                     {!feedback?.length && (
                       <div className="py-10 text-center text-[10px] text-white/10 uppercase font-black italic tracking-[0.3em]">ZERO SUCCESS TELEMETRY LOGGED.</div>
                     )}
                  </div>
               </DashboardSection>

               {/* Submission Card - High Priority CTA */}
               <div className="bg-black border-2 border-primary/20 rounded-[3rem] p-10 flex flex-col justify-center items-center text-center gap-6 shadow-2xl relative overflow-hidden group hover:border-primary transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/20 transition-all" />
                  <div className="w-20 h-20 bg-black border border-primary/20 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-all shadow-[0_0_30px_rgba(var(--color-primary),0.1)]">
                     <GraduationCap size={36} />
                  </div>
                  <div className="flex flex-col gap-2">
                     <h3 className="text-xl font-black text-white tracking-[0.2em] uppercase">FINALIZE MISSION</h3>
                     <p className="text-[11px] font-black text-white/20 leading-relaxed max-w-[14rem] uppercase">Execute notification protocol to mentor for terminal assessment.</p>
                  </div>
                  <button className="w-full py-5 bg-primary text-black text-[12px] font-black uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-white transition-all shadow-2xl shadow-primary/20 active:scale-95">
                     NOTIFY COMMAND
                  </button>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-10">
            {/* Mentor Hub */}
            <DashboardSection title="DIRECT COMMAND LIAISON" icon={<Users size={18} />}>
               <div className="mt-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-black border-2 border-primary/20 p-1 mb-6 shadow-2xl relative group overflow-hidden">
                     <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/20 transition-all" />
                     <div className="w-full h-full rounded-[2.2rem] bg-black border border-white/5 flex items-center justify-center relative z-10">
                        <Smile size={40} className="text-white/10 group-hover:text-primary transition-colors" />
                     </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{currentTask?.mentor?.name}</h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary mb-8 italic">OFFICIAL MENTOR // COMMAND</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                     <button className="flex items-center justify-center gap-3 py-4 bg-black border-2 border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95 shadow-lg">
                        <MessageCircle size={16} /> QUERY
                     </button>
                     <button className="flex items-center justify-center gap-3 py-4 bg-black border-2 border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95 shadow-lg">
                        <HelpCircle size={16} /> BRIEFING
                     </button>
                  </div>
               </div>
            </DashboardSection>

            {/* Learning Registry */}
            <DashboardSection title="INTEL REPOSITORY" icon={<GraduationCap size={18} />}>
               <div className="mt-8 flex flex-col gap-6">
                  <div className="px-5 py-2 bg-primary text-black text-[9px] font-black uppercase tracking-[0.4em] rounded-full self-start shadow-lg">
                     TOPIC: {learningSection?.topic}
                  </div>
                  <div className="flex flex-col gap-3">
                     {learningSection?.resources?.map((res, idx) => (
                       <a 
                         key={idx} 
                         href={res.link} 
                         className="flex items-center justify-between p-5 bg-black border-2 border-white/5 rounded-2xl hover:border-primary hover:translate-x-2 transition-all group shadow-md"
                       >
                          <span className="text-[12px] font-black text-white/40 group-hover:text-white uppercase tracking-tight">{res.title}</span>
                          <ArrowRight size={14} className="text-white/10 group-hover:text-primary transition-colors" />
                       </a>
                     ))}
                  </div>
               </div>
            </DashboardSection>

            <DashboardSection title="SUPPORT VECTORS" icon={<ShieldAlert size={18} />}>
               <div className="grid grid-cols-1 gap-4 mt-8">
                  {blockerOptions?.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className="flex items-center justify-between p-5 bg-black border-2 border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-white/20 hover:bg-status-error/5 hover:border-status-error hover:text-status-error transition-all group shadow-md active:scale-95"
                    >
                       {opt.label}
                       <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
               </div>
            </DashboardSection>

            {/* Progress Visualization */}
            <DashboardSection title="MISSION INTEGRITY" icon={<Target size={18} />}>
               <div className="mt-10 flex flex-col gap-5">
                  <div className="flex items-end justify-between px-2">
                     <span className="text-5xl font-black text-white tracking-tighter">{progress?.percentage}%</span>
                     <span className="text-[10px] font-black text-white/20 mb-2 uppercase tracking-widest italic">{progress?.completed} / {progress?.total} NOMINAL</span>
                  </div>
                  <div className="w-full h-4 bg-black rounded-full overflow-hidden p-1 border-2 border-white/10 shadow-inner">
                     <div 
                        className="h-full bg-primary rounded-full shadow-[0_0_25px_rgba(var(--color-primary),0.5)] transition-all duration-1000 ease-out"
                        style={{ width: `${progress?.percentage}%` }}
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

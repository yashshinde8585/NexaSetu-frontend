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
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 pt-8 pb-12 space-y-12 bg-background-dark min-h-screen font-sans">
      
      {/* Assignment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricStripItem label="Tasks for You" value={assignmentMetrics?.assigned} icon={<Target size={20} />} accent="bg-primary/20" />
        <MetricStripItem label="Due Today" value={assignmentMetrics?.dueToday} icon={<Clock size={20} />} color="text-amber-500" />
        <MetricStripItem label="Blocked" value={assignmentMetrics?.blocked} icon={<ShieldAlert size={20} />} color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 flex flex-col gap-8">
            
            <DashboardSection title="Current Assignment" icon={<BookOpen size={18} />}>
               {currentTask ? (
                 <div className="mt-6">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl border border-primary/20">
                          Active Task
                       </span>
                       <div className="h-px bg-white/5 flex-1" />
                    </div>
                    
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">{currentTask.title}</h2>
                    
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 mb-8">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/40 mb-3 ml-1">The Goal</h4>
                       <p className="text-sm font-medium text-text-muted leading-relaxed mb-8">{currentTask.objective}</p>
                       
                       <div className="flex flex-col gap-4">
                          {currentTask.steps?.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                               <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                 step.completed ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/20'
                               }`}>
                                  {step.completed ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                               </div>
                               <span className={`text-[13px] font-bold transition-all ${step.completed ? 'text-emerald-500/50 line-through' : 'text-white/80'}`}>
                                  {step.text}
                               </span>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                       <span className="text-[10px] font-bold text-text-muted/60 flex items-center gap-2">
                          <ExternalLink size={12} /> Reference Material:
                       </span>
                       <a href={currentTask.reference} target="_blank" rel="noreferrer" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                          View Documentation
                       </a>
                    </div>
                 </div>
               ) : (
                 <div className="py-20 text-center flex flex-col items-center gap-4">
                    <div className="p-4 bg-white/5 rounded-full text-white/10"><Compass size={32} /></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-text-muted/40">Waiting for next assignment...</span>
                 </div>
               )}
            </DashboardSection>

            {/* Success Signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DashboardSection title="Recent Success" icon={<Award size={18} />}>
                  <div className="flex flex-col gap-4 mt-6">
                     {feedback?.map((f, idx) => (
                       <div key={idx} className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col gap-2">
                          <span className="text-[11px] font-bold text-emerald-400">{f.title}</span>
                          <p className="text-[10px] text-emerald-200/60 leading-tight italic">"{f.message}"</p>
                       </div>
                     ))}
                     {!feedback?.length && (
                       <div className="py-6 text-center text-[10px] text-text-muted/40 uppercase font-black">Ready to win?</div>
                     )}
                  </div>
               </DashboardSection>

               {/* Submission Card - High Priority CTA */}
               <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center gap-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.2)]">
                     <GraduationCap size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Ready to Submit?</h3>
                  <p className="text-[10px] text-text-muted leading-relaxed max-w-[12rem]">Once you're done, notify your mentor to review your progress.</p>
                  <button className="mt-2 w-full py-4 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20">
                     Notify Mentor
                  </button>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Mentor Hub */}
            <DashboardSection title="Your Mentor" icon={<Users size={18} />}>
               <div className="mt-8 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-indigo-600 p-0.5 mb-4 shadow-xl">
                     <div className="w-full h-full rounded-[1.8rem] bg-background-dark flex items-center justify-center">
                        <Smile size={32} className="text-white/20" />
                     </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{currentTask?.mentor?.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Mentor</p>
                  
                  <div className="grid grid-cols-2 gap-3 w-full">
                     <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-tighter hover:bg-white/10 transition-all">
                        <MessageCircle size={14} /> Ask Question
                     </button>
                     <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-tighter hover:bg-white/10 transition-all">
                        <HelpCircle size={14} /> Quick Chat
                     </button>
                  </div>
               </div>
            </DashboardSection>

            {/* Learning Registry */}
            <DashboardSection title="Learn While Doing" icon={<GraduationCap size={18} />}>
               <div className="mt-6 flex flex-col gap-4">
                  <div className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-lg self-start">
                     Topic: {learningSection?.topic}
                  </div>
                  <div className="flex flex-col gap-1">
                     {learningSection?.resources?.map((res, idx) => (
                       <a 
                         key={idx} 
                         href={res.link} 
                         className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 hover:border-primary/30 transition-all group"
                       >
                          <span className="text-[11px] font-bold text-white/70 group-hover:text-white">{res.title}</span>
                          <ArrowRight size={12} className="text-text-muted/40 group-hover:text-primary transition-colors" />
                       </a>
                     ))}
                  </div>
               </div>
            </DashboardSection>

            <DashboardSection title="Request Support" icon={<ShieldAlert size={18} />}>
               <div className="grid grid-cols-1 gap-3 mt-6">
                  {blockerOptions?.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all group"
                    >
                       {opt.label}
                       <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
               </div>
            </DashboardSection>

            {/* Progress Visualization */}
            <DashboardSection title="Mission Progress" icon={<Target size={18} />}>
               <div className="mt-8 flex flex-col gap-4">
                  <div className="flex items-end justify-between px-1">
                     <span className="text-4xl font-black text-white">{progress?.percentage}%</span>
                     <span className="text-[10px] font-bold text-text-muted mb-1">{progress?.completed} / {progress?.total} Completed</span>
                  </div>
                  <div className="w-full h-4 bg-white/5 rounded-3xl overflow-hidden p-1 border border-white/5">
                     <div 
                        className="h-full bg-gradient-to-r from-primary via-indigo-500 to-emerald-500 rounded-2xl shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] transition-all duration-1000"
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

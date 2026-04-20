import React from 'react';
import { 
  CheckCircle2, Clock, ShieldAlert, ArrowRight, MessageSquare, 
  HelpCircle, Check, ChevronRight, Zap, Star, MessageCircle, 
  ShieldCheck, Sparkles, Target, Award
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';

/**
 * Junior Engineer Dashboard
 * Focused on task execution, learning path coordination, and technical mentorship.
 */
const JREDashboard = () => {
  const { data, isLoading } = useRoleDashboard('jre');

  if (isLoading) return <CenteredLoading />;

  const { 
    dayMetrics = { tasksToday: 0, dueToday: 0, blocked: 0 }, 
    guidedTasks = [], 
    stuckGuidance = [], 
    progress = { percentage: 0, completed: 0 }, 
    nextSteps = { main: 'AWAITING_INPUT', minor: 'STANDBY' },
    activity = []
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1600px] mx-auto flex flex-col gap-12">
      
      {/* 1. Performance Overview */}
      <div id="jre-metrics-strip" className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <MetricStripItem 
            icon={<Target size={14} />} 
            label="Daily Assignments" 
            value={dayMetrics.tasksToday} 
            accent="bg-primary"
         />
         <MetricStripItem 
            icon={<Clock size={14} />} 
            label="Critical Deadlines" 
            value={dayMetrics.dueToday} 
            color={dayMetrics.dueToday > 0 ? "text-status-warning" : "text-white/40"} 
            accent={dayMetrics.dueToday > 0 ? "bg-status-warning" : "bg-white/5"}
         />
         <MetricStripItem 
            icon={<ShieldAlert size={14} />} 
            label="Operation Blockers" 
            value={dayMetrics.blocked} 
            color={dayMetrics.blocked > 0 ? "text-status-error" : "text-white/40"} 
            accent={dayMetrics.blocked > 0 ? "bg-status-error" : "bg-white/5"}
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Main Column: Active Engineering Sprint */}
         <div className="lg:col-span-8 flex flex-col gap-12">
            <DashboardSection title="Active Engineering Tasks" icon={<Zap size={14} />}>
               <div className="flex flex-col gap-8 py-2">
                  {guidedTasks?.map((task, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded p-8 group hover:border-primary/30 transition-all relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-white/5 group-hover:bg-primary/40 transition-all" />
                       
                       <div className="flex flex-col md:flex-row gap-8">
                          <div className="flex-1">
                             <div className="flex items-center gap-4 mb-6">
                                <StatusBadge status={task.status === 'ACTIVE' ? 'active' : 'pending'} text={task.status} mini />
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">DEADLINE: {task.due}</span>
                             </div>
                             
                             <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-primary transition-colors">{task.title}</h3>
                             <p className="text-[11px] font-bold text-white/40 uppercase leading-relaxed tracking-tight mb-8 max-w-xl">{task.description || 'Follow standard execution protocols. Ensure quality validation benchmarks are met.'}</p>
                             
                             <div className="flex flex-col gap-2">
                                {task.steps?.map((step, sIdx) => (
                                  <div key={sIdx} className="flex items-center gap-4 p-4 bg-black border border-white/5 rounded hover:border-white/20 transition-all group/step cursor-pointer">
                                     <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                                       step.completed ? 'bg-status-success/20 text-status-success border border-status-success/30' : 'bg-white/5 text-white/20 border border-white/5'
                                     }`}>
                                        {step.completed ? <Check size={12} strokeWidth={3} /> : <span className="text-[10px] font-bold">{sIdx + 1}</span>}
                                     </div>
                                     <span className={`text-[11px] font-bold uppercase tracking-tight ${step.completed ? 'text-white/20 line-through' : 'text-white/60 group-hover/step:text-white'}`}>{step.text}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                          
                          <div className="md:w-56 flex flex-col gap-6 md:border-l border-white/10 md:pl-8">
                             <div className="flex flex-col gap-3">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Task Controls</span>
                                <button className="w-full py-3 bg-white/[0.02] border border-white/10 rounded text-white/60 text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                                   Update Status
                                </button>
                             </div>
                             
                             {task.blocked && (
                               <div className="p-4 bg-status-error/5 border border-status-error/20 rounded flex flex-col gap-1 items-center justify-center">
                                  <ShieldAlert size={16} className="text-status-error mb-1" />
                                  <span className="text-[10px] font-bold text-status-error uppercase tracking-widest leading-none">Operation Blocked</span>
                               </div>
                             )}
                             
                             <button className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/20 hover:text-white transition-all uppercase tracking-widest mt-auto group/btn">
                                SPECIFICATIONS <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
                  {(!guidedTasks || guidedTasks.length === 0) && (
                    <div className="py-24 text-center flex flex-col items-center gap-4 bg-white/[0.01] border border-white/5 border-dashed rounded">
                       <Zap size={32} className="text-white/10" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">Operational Quotas Meta. No active tasks.</span>
                    </div>
                  )}
               </div>
            </DashboardSection>

            {/* Bottom Grid: Mentorship & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <DashboardSection title="Mentorship Hub" icon={<MessageSquare size={14} />}>
                  <div className="flex flex-col gap-6 py-4">
                     <p className="text-[11px] font-bold text-white/30 uppercase tracking-tight leading-relaxed italic">Direct communication channels with engineering leadership units.</p>
                     <div className="flex flex-col gap-3">
                        <MentorAction icon={<Star size={16} />} label="Technical Lead" sub="Performance Review" />
                        <MentorAction icon={<MessageCircle size={16} />} label="Senior Mentor" sub="Strategic Guidance" />
                     </div>
                  </div>
               </DashboardSection>

               <DashboardSection title="Engagement Log" icon={<ShieldCheck size={14} />}>
                  <div className="flex flex-col gap-4 py-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                     {activity?.map((a, idx) => (
                       <ActivityItem 
                          key={idx} 
                          text={a.text} 
                          time="RECENT" 
                          type={a.type === 'approval' ? 'success' : a.type === 'review' ? 'info' : 'warning'}
                          mini
                       />
                     ))}
                     {(!activity || activity.length === 0) && (
                       <div className="py-12 text-center text-[10px] text-white/10 uppercase font-bold tracking-widest">No transaction history.</div>
                     )}
                  </div>
               </DashboardSection>
            </div>
         </div>

         {/* Sidebar: Coordination & Progress */}
         <div className="lg:col-span-4 flex flex-col gap-12">
            <DashboardSection title="Bottleneck Mitigation" icon={<HelpCircle size={14} />}>
               <div className="flex flex-col gap-4 py-2">
                  {stuckGuidance?.map((s, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-5 rounded group hover:border-status-error/30 transition-all">
                       <span className="block text-[11px] font-bold text-white/80 mb-3 uppercase tracking-tight">{s.issue}</span>
                       <div className="p-4 bg-status-error/5 border border-status-error/10 rounded mb-4">
                          <span className="text-[9px] font-bold text-status-error uppercase tracking-widest block mb-1">Recommended Action</span>
                          <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase">{s.suggestedAction}</p>
                       </div>
                       <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Escalate To:</span>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{s.suggestedPerson}</span>
                       </div>
                    </div>
                  ))}
                  {(!stuckGuidance || stuckGuidance.length === 0) && (
                    <div className="py-12 text-center text-[10px] text-white/10 uppercase font-bold tracking-widest flex flex-col items-center gap-4">
                       <ShieldCheck size={24} className="text-status-success/20" /> No active blockers.
                    </div>
                  )}
               </div>
            </DashboardSection>

            <DashboardSection title="Execution Efficiency" icon={<Zap size={14} />}>
               <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col gap-1">
                        <span className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none">{progress?.percentage || 0}%</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Efficiency Rate</span>
                     </div>
                     <div className="px-4 py-3 bg-white/[0.02] border border-primary/20 rounded flex flex-col items-center">
                        <span className="text-xl font-black text-primary leading-none tabular-nums">{progress?.completed || 0}</span>
                        <span className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Units</span>
                     </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <div 
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${progress?.percentage || 0}%` }}
                     />
                  </div>
               </div>
            </DashboardSection>

            <DashboardSection title="Next Operational Phase" icon={<Sparkles size={14} />}>
               <div className="flex flex-col gap-4 py-2">
                  <div className="p-6 bg-white/[0.02] border border-white/10 rounded relative overflow-hidden group hover:border-primary/20 transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.1] transition-all">
                        <ArrowRight size={48} className="text-primary" />
                     </div>
                     <span className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest mb-3">
                        <Zap size={12} fill="currentColor" /> Priority Directive
                     </span>
                     <p className="text-[14px] font-bold text-white uppercase tracking-tight leading-tight mb-2">{nextSteps?.main || 'AWAITING_PROTOCOLS'}</p>
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">{nextSteps?.minor || 'STANDBY'}</p>
                  </div>
               </div>
            </DashboardSection>
         </div>
      </div>
    </div>
  );
};

const MentorAction = ({ icon, label, sub }) => (
  <button className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-lg hover:border-primary/40 hover:bg-white/[0.04] group transition-all w-full text-left">
     <div className="flex items-center gap-4">
        <div className="p-3 bg-black border border-white/10 rounded group-hover:border-primary/40 text-white/20 group-hover:text-primary transition-all">
           {icon}
        </div>
        <div className="flex flex-col">
           <span className="text-[11px] font-bold text-white uppercase tracking-widest leading-none mb-1">{label}</span>
           <span className="text-[9px] font-bold uppercase text-white/20 tracking-widest leading-none group-hover:text-primary/60 transition-colors">{sub}</span>
        </div>
     </div>
     <ChevronRight size={14} className="text-white/10 group-hover:text-primary transition-transform group-hover:translate-x-1" />
  </button>
);

export default JREDashboard;

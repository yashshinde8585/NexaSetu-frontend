import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle2, Clock, ShieldAlert, ArrowRight, MessageSquare, 
  HelpCircle, Check, ChevronRight, Zap, Star, MessageCircle, 
  ShieldCheck, Sparkles, Target, Award
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import taskService from '../api/taskService';
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const handleStatusUpdate = async (taskId, currentStatus) => {
    try {
      const nextMap = {
        'todo': 'in_progress',
        'in_progress': 'in_review',
        'in_review': 'done',
        'done': 'todo'
      };
      const nextStatus = nextMap[currentStatus] || 'in_progress';
      await taskService.updateTaskStatus(taskId, nextStatus, 0); // versioning stubbed for simplicity as per requirement
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'jre'] });
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleStepToggle = async (taskId, stepIndex, currentSteps) => {
    try {
      const updatedSteps = currentSteps.map((s, idx) => 
        idx === stepIndex ? { ...s, completed: !s.completed } : s
      );
      await taskService.updateTaskSteps(taskId, updatedSteps);
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'jre'] });
    } catch (err) {
      console.error('Step toggle failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      
      {/* 1. Performance Overview */}
      <div id="jre-metrics-strip" className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Main Column: Active Engineering Sprint */}
         <div className="lg:col-span-8 flex flex-col gap-6">
            <DashboardSection title="Active Engineering Tasks" icon={<Zap size={14} />}>
               <div className="flex flex-col gap-6 py-2">
                  {guidedTasks?.map((task, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-sm p-6 group hover:border-primary/40 transition-colors relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-0.5 h-full bg-white/10 group-hover:bg-primary transition-colors" />
                       
                       <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                             <div className="flex items-center gap-4 mb-4">
                                <StatusBadge status={task.status} />
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">DEADLINE: {task.due}</span>
                             </div>
                             
                             <h3 
                                className="text-lg font-black text-white mb-2 uppercase tracking-widest group-hover:text-primary transition-colors cursor-pointer"
                                onClick={() => navigate(`/task/${task.id}`)}
                             >
                                {task.title}
                             </h3>
                             <p className="text-[9px] font-black text-white/40 uppercase leading-relaxed tracking-widest mb-6 max-w-xl">{task.description || 'FOLLOW_STANDARD_PROTOCOLS'}</p>
                             
                             <div className="flex flex-col gap-2">
                                {task.steps?.map((step, sIdx) => (
                                  <div 
                                    key={sIdx} 
                                    className="flex items-center gap-3 p-3 bg-black border border-white/5 rounded-none hover:border-white/20 transition-colors group/step cursor-pointer"
                                    onClick={() => handleStepToggle(task.id, sIdx, task.steps)}
                                  >
                                     <div className={`w-5 h-5 rounded-none flex items-center justify-center transition-all ${
                                       step.completed ? 'bg-status-success/20 text-status-success border border-status-success/30' : 'bg-white/5 text-white/20 border border-white/5'
                                     }`}>
                                        {step.completed ? <Check size={10} strokeWidth={3} /> : <span className="text-[9px] font-black">{sIdx + 1}</span>}
                                     </div>
                                     <span className={`text-[10px] font-black uppercase tracking-widest ${step.completed ? 'text-white/20 line-through' : 'text-white/60 group-hover/step:text-white'}`}>{step.text}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                          
                          <div className="md:w-48 flex flex-col gap-4 md:border-l border-white/10 md:pl-6">
                             <div className="flex flex-col gap-2">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">TASK_CONTROLS</span>
                                <button 
                                  className="w-full py-2 bg-white/5 border border-white/10 rounded-none text-white/60 text-[9px] font-black uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-colors"
                                  onClick={() => handleStatusUpdate(task.id, task.status)}
                                >
                                   UPDATE_STATUS
                                </button>
                             </div>
                             
                             {task.blocked && (
                               <div className="p-3 bg-status-error/5 border border-status-error/20 rounded-none flex flex-col gap-1 items-center justify-center">
                                  <ShieldAlert size={14} className="text-status-error mb-1" />
                                  <span className="text-[9px] font-black text-status-error uppercase tracking-widest leading-none">BLOCKED</span>
                               </div>
                             )}
                             
                             <button 
                                className="flex items-center justify-center gap-2 text-[9px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-[0.2em] mt-auto group/btn"
                                onClick={() => navigate(`/task/${task.id}`)}
                             >
                                SPEC <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
                  {(!guidedTasks || guidedTasks.length === 0) && (
                    <div className="py-16 text-center flex flex-col items-center gap-4 bg-white/5 border border-white/10 border-dashed rounded-none">
                       <Zap size={24} className="text-white/10" />
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">NO_ACTIVE_TASKS</span>
                    </div>
                  )}
               </div>
            </DashboardSection>

            {/* Bottom Grid: Mentorship & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DashboardSection title="Mentorship Hub" icon={<MessageSquare size={14} />}>
                  <div className="flex flex-col gap-4 py-4">
                     <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-relaxed italic">DIRECT_COMMUNICATION_CHANNELS</p>
                     <div className="flex flex-col gap-2">
                        <MentorAction icon={<Star size={16} />} label="TECH_LEAD" sub="REVIEW" />
                        <MentorAction icon={<MessageCircle size={16} />} label="SENIOR_MENTOR" sub="GUIDANCE" />
                     </div>
                  </div>
               </DashboardSection>

               <DashboardSection title="Engagement Log" icon={<ShieldCheck size={14} />}>
                  <div className="flex flex-col gap-2 py-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                     {activity?.map((a, idx) => (
                       <ActivityItem 
                          key={idx} 
                          text={a.text} 
                          time={a.time || "RECENT"} 
                          type={a.type === 'approval' ? 'success' : a.type === 'review' ? 'info' : 'warning'}
                          mini
                       />
                     ))}
                     {(!activity || activity.length === 0) && (
                       <div className="py-12 text-center text-[9px] text-white/10 uppercase font-black tracking-widest">ZERO_HISTORY</div>
                     )}
                  </div>
               </DashboardSection>
            </div>
         </div>

         {/* Sidebar: Coordination & Progress */}
         <div className="lg:col-span-4 flex flex-col gap-6">
            <DashboardSection title="Bottleneck Mitigation" icon={<HelpCircle size={14} />}>
               <div className="flex flex-col gap-3 py-2">
                  {stuckGuidance?.map((s, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-none group hover:bg-white/10 transition-colors">
                       <span className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">{s.issue}</span>
                       <div className="p-3 bg-status-error/5 border border-status-error/20 rounded-none mb-3">
                          <span className="text-[8px] font-black text-status-error uppercase tracking-[0.2em] block mb-1">RECOMMENDED_ACTION</span>
                          <p className="text-[9px] font-black text-white/60 leading-relaxed uppercase tracking-widest">{s.suggestedAction}</p>
                       </div>
                       <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">ESCALATE_TO</span>
                          <span className="text-[9px] font-black text-primary uppercase tracking-widest">{s.suggestedPerson}</span>
                       </div>
                    </div>
                  ))}
                  {(!stuckGuidance || stuckGuidance.length === 0) && (
                    <div className="py-12 text-center text-[9px] text-white/10 uppercase font-black tracking-widest flex flex-col items-center gap-4">
                       <ShieldCheck size={20} className="text-status-success/20" /> ZERO_BLOCKERS
                    </div>
                  )}
               </div>
            </DashboardSection>

            <DashboardSection title="Execution Efficiency" icon={<Zap size={14} />}>
               <div className="flex flex-col gap-4 py-4 px-5 bg-white/5 border border-white/10 rounded-none">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col gap-1">
                        <span className="text-3xl font-black text-white tracking-widest leading-none">{progress?.percentage || 0}%</span>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">EFFICIENCY_RATE</span>
                     </div>
                     <div className="px-3 py-2 bg-black border border-primary/20 rounded-none flex flex-col items-center">
                        <span className="text-lg font-black text-primary leading-none">{progress?.completed || 0}</span>
                        <span className="text-[7px] font-black text-primary uppercase tracking-[0.2em] mt-1">UNITS</span>
                     </div>
                  </div>
                  <div className="w-full h-0.5 bg-white/5 rounded-none overflow-hidden border border-white/5">
                     <div 
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${progress?.percentage || 0}%` }}
                     />
                  </div>
               </div>
            </DashboardSection>

            <DashboardSection title="Next Operational Phase" icon={<Sparkles size={14} />}>
               <div className="flex flex-col gap-2 py-2">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-none relative overflow-hidden group hover:bg-white/10 transition-colors">
                     <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-colors">
                        <ArrowRight size={40} className="text-primary" />
                     </div>
                     <span className="flex items-center gap-2 text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                        <Zap size={10} fill="currentColor" /> PRIORITY_DIRECTIVE
                     </span>
                     <p className="text-[12px] font-black text-white uppercase tracking-widest leading-tight mb-1">{nextSteps?.main || 'AWAITING_PROTOCOLS'}</p>
                     <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">{nextSteps?.minor || 'STANDBY'}</p>
                  </div>
               </div>
            </DashboardSection>
         </div>
      </div>
    </div>
  );
};

const MentorAction = ({ icon, label, sub }) => (
  <button className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-none hover:bg-white/10 group transition-colors w-full text-left">
     <div className="flex items-center gap-3">
        <div className="p-2.5 bg-black border border-white/10 rounded-none group-hover:border-primary text-white/20 group-hover:text-primary transition-colors">
           {icon}
        </div>
        <div className="flex flex-col">
           <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{label}</span>
           <span className="text-[8px] font-black uppercase text-white/20 tracking-[0.2em] leading-none group-hover:text-primary/60 transition-colors">{sub}</span>
        </div>
     </div>
     <ChevronRight size={14} className="text-white/10 group-hover:text-primary transition-transform group-hover:translate-x-1" />
  </button>
);

export default JREDashboard;

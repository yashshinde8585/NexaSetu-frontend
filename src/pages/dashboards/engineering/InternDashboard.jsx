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
  Award,
  ChevronRight,
  Zap,
  Terminal,
  Cpu,
  Layers,
  Rocket,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import taskApi from '../../../api/taskApi';
import CenteredLoading from '../../../components/atoms/CenteredLoading';
import DashboardSection from '../../../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../../../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../../../components/molecules/dashboard/StatusBadge';

/**
 * Intern Dashboard
 * Focused on task execution, learning path coordination, and technical mentorship.
 */
const InternDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useRoleDashboard('intern');

  if (isLoading) return <CenteredLoading />;

  const {
    assignmentMetrics = { assigned: 0, dueToday: 0, blocked: 0 },
    currentTask,
    learningSection = { topic: 'NONE', resources: [] },
    progress = { percentage: 0, completed: 0, total: 0 },
    feedback = [],
    blockerOptions = [],
    nextSteps = { main: '', minor: '' },
  } = data || {};

  // --- Handlers ---

  const handleStepToggle = async (stepIdx) => {
    if (!currentTask) return;

    const newSteps = [...(currentTask.steps || [])];
    newSteps[stepIdx] = {
      ...newSteps[stepIdx],
      completed: !newSteps[stepIdx].completed,
    };

    try {
      await taskApi.updateTaskSteps(currentTask.id, newSteps);
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'intern'] });
    } catch (err) {
      console.error('Failed to update step:', err);
    }
  };

  const handleSignalCompletion = async () => {
    if (!currentTask) return;

    try {
      await taskApi.updateTaskStatus(currentTask.id, 'in_review');
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'intern'] });
    } catch (err) {
      console.error('Failed to signal completion:', err);
    }
  };

  const handleBlockerAction = async (label) => {
    if (!currentTask) return;

    try {
      await taskApi.toggleTaskBlockage(currentTask.id, true, label);
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'intern'] });
    } catch (err) {
      console.error('Failed to set blocker:', err);
    }
  };

  const handleMentorContact = () => {
    if (currentTask?.mentor?.email) {
      window.location.href = `mailto:${currentTask.mentor.email}`;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      {/* 1. Global Performance metrics */}
      <div
        id="intern-metrics-strip"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
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
          color={
            assignmentMetrics.dueToday > 0
              ? 'text-status-warning'
              : 'text-white/40'
          }
          accent={
            assignmentMetrics.dueToday > 0 ? 'bg-status-warning' : 'bg-white/5'
          }
        />
        <MetricStripItem
          icon={<ShieldAlert size={14} />}
          label="Blocked Tasks"
          value={assignmentMetrics.blocked}
          color={
            assignmentMetrics.blocked > 0
              ? 'text-status-error'
              : 'text-white/40'
          }
          accent={
            assignmentMetrics.blocked > 0 ? 'bg-status-error' : 'bg-white/5'
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Main Track: Current Assignment */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <DashboardSection
            title="Current Assignment"
            icon={<Terminal size={14} />}
          >
            {currentTask ? (
              <div className="flex flex-col gap-6 py-2">
                <div className="flex items-center gap-4">
                  <StatusBadge
                    status={
                      currentTask.status === 'in_progress' ? 'active' : 'idle'
                    }
                  />
                  <div className="h-px bg-white/5 flex-1" />
                  <span className="text-[9px] text-white/20 uppercase font-black tracking-[0.2em] tabular-nums">
                    ID: {currentTask.id || 'TASK-####'}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <h2
                    className="text-xl font-black text-white uppercase tracking-widest leading-tight cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/task/${currentTask.id}`)}
                  >
                    {currentTask.title}
                  </h2>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-none">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary block mb-3">
                      TASK DESCRIPTION
                    </span>
                    <p className="text-[10px] font-black text-white/60 uppercase leading-relaxed tracking-widest">
                      {currentTask.description || 'No objective defined.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">
                    STEPS
                  </span>
                  {currentTask.steps?.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-black border border-white/5 rounded-none group/step transition-colors hover:bg-white/5 cursor-pointer"
                      onClick={() => handleStepToggle(idx)}
                    >
                      <div
                        className={`w-8 h-8 rounded-none border flex items-center justify-center transition-all ${
                          step.completed
                            ? 'bg-status-success/10 border-status-success/30 text-status-success'
                            : 'border-white/10 text-white/10 group-hover/step:border-primary/40'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <span className="text-[10px] font-black tabular-nums">
                            {idx + 1}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest transition-all ${step.completed ? 'text-white/20 line-through' : 'text-white/60 group-hover/step:text-white'}`}
                      >
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-none group hover:border-primary/40 transition-colors">
                  <span className="text-[9px] font-black text-white/20 flex items-center gap-3 uppercase tracking-widest leading-none">
                    <ExternalLink size={12} className="text-primary/40" />{' '}
                    DOCUMENTATION REPO
                  </span>
                  <a
                    href={currentTask.githubUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] font-black text-primary uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 group-hover:translate-x-1"
                  >
                    OPEN LINK <ChevronRight size={10} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center flex flex-col items-center gap-4 bg-white/5 border border-white/10 border-dashed rounded-none">
                <Compass size={32} className="text-white/5" />
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10 italic">
                  Awaiting Assignment
                </span>
              </div>
            )}
          </DashboardSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardSection
              title="Feedback Cluster"
              icon={<Award size={14} />}
            >
              <div className="flex flex-col gap-3 py-2">
                {feedback?.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/5 border border-white/10 rounded-none flex flex-col gap-2 group hover:border-status-success/40 transition-colors border-l-2 border-l-white/20"
                  >
                    <span className="text-[9px] font-black text-status-success uppercase tracking-[0.2em] leading-none">
                      {f.title}
                    </span>
                    <p className="text-[9px] font-black text-white/30 uppercase leading-snug tracking-widest group-hover:text-white/60 italic">
                      "{f.message}"
                    </p>
                  </div>
                ))}
                {(!feedback || feedback.length === 0) && (
                  <div className="py-12 text-center text-[9px] text-white/10 uppercase font-black tracking-widest italic border border-white/10 border-dashed rounded-none">
                    No Feedback Yet
                  </div>
                )}
              </div>
            </DashboardSection>

            <div className="bg-primary/5 border border-primary/20 rounded-none p-6 flex flex-col items-center text-center gap-6 group hover:bg-primary/10 transition-colors relative overflow-hidden">
              <div className="w-16 h-16 bg-black border border-primary/20 rounded-none flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                <GraduationCap size={32} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-black text-white tracking-widest uppercase leading-none">
                  Initiate Review
                </h3>
                <p className="text-[9px] font-black text-white/20 uppercase leading-relaxed max-w-[15rem]">
                  SUBMIT FOR REVIEW
                </p>
              </div>
              <button
                className="w-full py-3 bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-none hover:bg-primary/90 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSignalCompletion}
                disabled={!currentTask || currentTask.status === 'in_review'}
              >
                {currentTask?.status === 'in_review'
                  ? 'UNDER REVIEW'
                  : 'SUBMIT TASK'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Sidebar Track: Logistics & Progression */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <DashboardSection
            title="Mentorship Coordination"
            icon={<Users size={14} />}
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 rounded-none bg-white/5 border border-white/10 p-2 mb-4 group hover:border-primary/40 transition-colors relative overflow-hidden">
                <div className="w-full h-full rounded-none border border-white/5 flex items-center justify-center bg-black relative z-10 transition-colors group-hover:bg-primary/5">
                  <UserCheck
                    size={32}
                    className="text-white/10 group-hover:text-primary transition-colors"
                  />
                </div>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-1 leading-none">
                {currentTask?.mentor?.name || 'CENTRAL MENTOR'}
              </h3>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-8 leading-none">
                MENTOR LEAD
              </p>

              <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-none overflow-hidden w-full">
                <button
                  className="flex flex-col items-center justify-center gap-1.5 py-4 bg-black text-[8px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors disabled:opacity-20"
                  onClick={handleMentorContact}
                  disabled={!currentTask?.mentor?.email}
                >
                  <MessageCircle size={14} /> CONTACT MENTOR
                </button>
                <button
                  className="flex flex-col items-center justify-center gap-1.5 py-4 bg-black text-[8px] font-black uppercase tracking-[0.2em] hover:text-primary transition-colors"
                  onClick={() => navigate('/chat')}
                >
                  <HelpCircle size={14} /> ASK HELP
                </button>
              </div>
            </div>
          </DashboardSection>

          <DashboardSection
            title="Learning Resources"
            icon={<Layers size={14} />}
          >
            <div className="flex flex-col gap-4 py-2">
              <div className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-[0.2em] rounded-none self-start leading-none">
                MODULE: {learningSection?.topic || 'UNASSIGNED'}
              </div>
              <div className="flex flex-col gap-2">
                {learningSection?.resources?.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-none hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest leading-none truncate pr-4">
                      {res.title}
                    </span>
                    <ChevronRight
                      size={12}
                      className="text-white/10 group-hover:text-primary transition-transform group-hover:translate-x-1"
                    />
                  </a>
                ))}
              </div>
            </div>
          </DashboardSection>

          <DashboardSection
            title="Blocked Tasks"
            icon={<ShieldAlert size={14} />}
          >
            <div className="flex flex-col gap-2 py-2">
              {blockerOptions?.map((opt, idx) => (
                <button
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-none text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:bg-status-error/5 hover:border-status-error/40 hover:text-status-error transition-colors group"
                  onClick={() => handleBlockerAction(opt.label)}
                >
                  {opt.label}
                  <ArrowRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                  />
                </button>
              ))}
            </div>
          </DashboardSection>

          <DashboardSection title="Progress" icon={<Target size={14} />}>
            <div className="flex flex-col gap-6 py-4 px-4 bg-white/5 border border-white/10 rounded-none">
              <div className="flex items-end justify-between leading-none">
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-2 text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                    <Zap size={10} fill="currentColor" /> PRIORITY TASK
                  </span>
                  <p className="text-[12px] font-black text-white uppercase tracking-widest leading-tight mb-1">
                    {nextSteps?.main || 'AWAITING TASK'}
                  </p>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">
                    {nextSteps?.minor || 'QUEUE EMPTY'}
                  </p>
                </div>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 tabular-nums">
                  {progress?.completed || 0} / {progress?.total || 0}
                </span>
              </div>
              <div className="w-full h-0.5 bg-white/5 rounded-none overflow-hidden border border-white/5">
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

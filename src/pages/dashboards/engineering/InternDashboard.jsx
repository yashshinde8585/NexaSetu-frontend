import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import DashboardSkeleton from '../../../components/atoms/DashboardSkeleton';
import {
  Flame,
  MessageCircle,
  PlayCircle,
  CheckCircle2,
  Circle,
  ArrowRight,
  GitMerge,
  GitCommit,
  GitPullRequest,
  Users,
  Shield,
  Lightbulb,
  ExternalLink,
  BookOpen,
  Code,
  Lock,
  Zap,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

/**
 * Learning Workspace Dashboard
 * Refactored to align with the Admin Dashboard's industrial aesthetic.
 */
const InternDashboard = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useRoleDashboard('intern');
  const [activeTaskTab, setActiveTaskTab] = useState('To Do');

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    console.error('[InternDashboard] Connection Error:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background text-status-error gap-4 p-6 border border-status-error/20 m-6 rounded-none">
        <h2 className="text-xl font-black uppercase tracking-widest">
          Workspace Connection Failed
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-text-subtle max-w-md text-center">
          {error?.message ||
            'Failed to establish connection with the backend data provider.'}
        </p>
        <button
          onClick={() =>
            queryClient.invalidateQueries(['roleDashboard', 'intern'])
          }
          className="px-6 py-2 mt-4 bg-background-elevated border border-border-subtle hover:bg-background text-[9px] font-black uppercase tracking-widest text-text transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const {
    myTasks = [],
    workItemsStatus = { todo: 0, inProgress: 0, done: 0, total: 0 },
    codeHealthScore = 100,
    recentActivity = [],
    gamification = {},
    mentor = { name: 'Lead', role: 'Mentor', avatar: null },
  } = data || {};

  const {
    progressData = {
      xp: 0,
      totalXp: 100,
      level: 1,
      nextLevelXp: 100,
      percentage: 0,
    },
    streakDays = 0,
    upcomingEvents = [],
    badges = [],
    tips = [],
    goals = [],
    learningLessons = [],
  } = gamification;

  const iconMap = {
    Zap: <Zap size={16} />,
    GitPullRequest: <GitPullRequest size={16} />,
    Users: <Users size={16} />,
    Lock: <Lock size={16} />,
  };

  const formattedTasks = myTasks.map((t) => ({
    id: t.githubId
      ? `#${t.githubId}`
      : t.taskNumber
        ? `NC-${t.taskNumber}`
        : t.id,
    title: t.title,
    priority: t.priority
      ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1)
      : 'Medium',
    date: t.dueDate
      ? `Due ${new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      : 'No Deadline',
    tag: t.category
      ? t.category.charAt(0).toUpperCase() + t.category.slice(1)
      : 'Task',
    status:
      t.status === 'in_progress'
        ? 'In Progress'
        : t.status === 'done'
          ? 'Done'
          : 'To Do',
    progress: t.status === 'done' ? 100 : t.status === 'in_progress' ? 50 : 0,
  }));

  const filteredTasks = formattedTasks.filter(
    (t) => t.status === activeTaskTab
  );

  const WidgetCard = ({ title, action, children, className = '' }) => (
    <div
      className={`bg-card border border-border-subtle p-3 flex flex-col rounded-none group hover:border-border-subtle/80 hover:shadow-[0_0_12px_rgba(var(--primary-rgb),0.02)] transition-all duration-300 ${className}`}
    >
      {(title || action) && (
        <div className="flex justify-between items-center mb-2.5 border-b border-border-subtle pb-2 shrink-0">
          {title && (
            <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-text-subtle">
              {title}
            </h3>
          )}
          {action && (
            <button className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary hover:text-text transition-colors cursor-pointer">
              {action}
            </button>
          )}
        </div>
      )}
      <div className="flex-1 flex flex-col min-h-0">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-text p-3 lg:p-4 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-3.5 select-none animate-fade-in">
      {/* ROW 1: Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-3.5 md:h-[110px] lg:h-[125px] shrink-0">
        {/* My Progress */}
        <WidgetCard
          title="My Progress"
          className="col-span-2 sm:col-span-1 md:col-span-3"
        >
          <div className="flex items-center gap-4 h-full mt-1">
            <div className="relative w-14 h-14 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { value: progressData.percentage },
                      { value: 100 - progressData.percentage },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={26}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    dataKey="value"
                  >
                    <Cell fill="var(--color-secondary)" />
                    <Cell fill="rgba(255,255,255,0.05)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-text text-xs font-black tracking-tighter tabular-nums">
                  {progressData.percentage}%
                </span>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-1.5 min-w-0">
              <div className="flex justify-between items-end leading-none">
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-text">
                  Level {progressData.level}
                </span>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-subtle tabular-nums">
                  {progressData.xp}{' '}
                  <span className="text-text-subtler">
                    / {progressData.totalXp} XP
                  </span>
                </span>
              </div>
              <div className="h-1 w-full bg-border-subtle rounded-none overflow-hidden mt-0.5">
                <div
                  className="h-full bg-secondary"
                  style={{ width: `${progressData.percentage}%` }}
                />
              </div>
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-text-subtle text-right">
                {progressData.nextLevelXp} XP to next
              </span>
            </div>
          </div>
        </WidgetCard>

        {/* Tasks Overview */}
        <WidgetCard
          title="Tasks Overview"
          className="col-span-2 sm:col-span-1 md:col-span-3"
        >
          <div className="flex justify-between items-center h-full mt-1">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-text leading-none tracking-tighter tabular-nums">
                {workItemsStatus.total}
              </span>
              <span className="text-[9px] md:text-[10px] text-text-subtle font-black uppercase tracking-widest mt-1.5">
                Total Tasks
              </span>
            </div>
            <div className="flex gap-4 text-center">
              <div className="flex flex-col">
                <span className="text-lg font-black text-status-success tracking-tighter tabular-nums">
                  {workItemsStatus.todo}
                </span>
                <span className="text-[8px] md:text-[9px] text-text-subtle font-black uppercase tracking-widest">
                  To Do
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-status-warning tracking-tighter tabular-nums">
                  {workItemsStatus.inProgress}
                </span>
                <span className="text-[8px] md:text-[9px] text-text-subtle font-black uppercase tracking-widest">
                  WIP
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-status-info tracking-tighter tabular-nums">
                  {workItemsStatus.done}
                </span>
                <span className="text-[8px] md:text-[9px] text-text-subtle font-black uppercase tracking-widest">
                  Done
                </span>
              </div>
            </div>
          </div>
        </WidgetCard>

        {/* Learning Streak */}
        <WidgetCard
          title="Learning Streak"
          className="col-span-1 md:col-span-2"
        >
          <div className="flex flex-col items-center justify-center h-full gap-0.5 mt-1">
            <div className="flex items-center gap-1.5">
              <Flame size={16} className="text-[#f97316]" fill="#f97316" />
              <span className="text-2xl font-black text-text tracking-tighter tabular-nums">
                {streakDays}
              </span>
            </div>
            <span className="text-[8px] md:text-[9px] text-text-subtle font-black uppercase tracking-widest mt-0.5">
              Days Streak
            </span>
            <span className="text-[8px] text-status-success font-black uppercase tracking-widest mt-0.5">
              Keep it up
            </span>
          </div>
        </WidgetCard>

        {/* Code Health Score */}
        <WidgetCard
          title="Code Health Score"
          className="col-span-1 md:col-span-2"
        >
          <div className="flex items-center gap-3 h-full mt-1 justify-center">
            <div className="relative w-12 h-12 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { value: codeHealthScore },
                      { value: 100 - codeHealthScore },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={16}
                    outerRadius={22}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    dataKey="value"
                  >
                    <Cell fill="var(--color-status-success)" />
                    <Cell fill="rgba(255,255,255,0.05)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-text text-[10px] font-black tracking-tighter tabular-nums">
                  {codeHealthScore}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[8px] text-status-success font-black uppercase tracking-widest bg-status-success/10 px-1.5 py-0.5 rounded-none w-max">
                Good Health
              </span>
            </div>
          </div>
        </WidgetCard>

        {/* Mentor */}
        <WidgetCard
          title="Mentor"
          className="col-span-2 sm:col-span-1 md:col-span-2"
        >
          <div className="flex flex-col justify-between h-full mt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-none bg-background-elevated flex items-center justify-center text-text text-xs font-black uppercase overflow-hidden border border-border-subtle shrink-0">
                {mentor.avatar ? (
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  mentor.name.charAt(0)
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text truncate">
                  {mentor.name}
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-text-subtle truncate">
                  {mentor.role}
                </span>
              </div>
            </div>
            <button className="flex items-center gap-1 text-[8.5px] md:text-[9.5px] font-black uppercase tracking-widest text-secondary hover:text-text transition-colors mt-2 w-max cursor-pointer">
              <MessageCircle size={10} /> Message
            </button>
          </div>
        </WidgetCard>
      </div>

      {/* TWO-COLUMN BODY LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Column (Core Activities) */}
        <div className="lg:col-span-8 flex flex-col gap-3.5 min-w-0">
          {/* My Tasks */}
          <WidgetCard
            title="My Tasks"
            action="View All"
            className="h-auto lg:h-[300px] flex flex-col overflow-hidden"
          >
            <div className="flex gap-4 border-b border-border-subtle pb-0 mb-2.5 text-[8.5px] md:text-[9.5px] font-black uppercase tracking-widest shrink-0">
              <button
                onClick={() => setActiveTaskTab('To Do')}
                className={`pb-1.5 border-b-2 transition-colors cursor-pointer ${activeTaskTab === 'To Do' ? 'text-secondary border-secondary' : 'text-text-subtle border-transparent hover:text-text'}`}
              >
                To Do ({workItemsStatus.todo})
              </button>
              <button
                onClick={() => setActiveTaskTab('In Progress')}
                className={`pb-1.5 border-b-2 transition-colors cursor-pointer ${activeTaskTab === 'In Progress' ? 'text-secondary border-secondary' : 'text-text-subtle border-transparent hover:text-text'}`}
              >
                In Progress ({workItemsStatus.inProgress})
              </button>
              <button
                onClick={() => setActiveTaskTab('Done')}
                className={`pb-1.5 border-b-2 transition-colors cursor-pointer ${activeTaskTab === 'Done' ? 'text-secondary border-secondary' : 'text-text-subtle border-transparent hover:text-text'}`}
              >
                Done ({workItemsStatus.done})
              </button>
            </div>
            <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none">
              {filteredTasks.map((t, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-none border transition-all duration-200 flex flex-col gap-1.5 hover:translate-x-0.5 ${t.status === 'In Progress' ? 'bg-secondary/5 border-secondary/20' : 'bg-transparent border-transparent hover:bg-background-elevated'}`}
                >
                  <div className="flex items-start gap-2">
                    {t.status === 'In Progress' ? (
                      <PlayCircle
                        size={14}
                        className="text-secondary mt-0.5 shrink-0 animate-pulse"
                      />
                    ) : (
                      <Circle
                        size={14}
                        className="text-text-subtler mt-0.5 shrink-0"
                      />
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span
                          className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-text truncate pr-2"
                          title={t.title}
                        >
                          {t.title}
                        </span>
                        <span
                          className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-none shrink-0 ${t.tag === 'Frontend' ? 'bg-secondary/10 text-secondary' : t.tag === 'Backend' ? 'bg-primary/10 text-primary' : 'bg-status-success/10 text-status-success'}`}
                        >
                          {t.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[8.5px] sm:text-[9px] font-black uppercase tracking-widest text-text-subtle">
                        <span>{t.id}</span>
                        <span className="text-text-subtler">•</span>
                        <span
                          className={
                            t.priority === 'High'
                              ? 'text-status-error'
                              : t.priority === 'Medium'
                                ? 'text-status-warning'
                                : 'text-status-success'
                          }
                        >
                          {t.priority}
                        </span>
                        <span className="text-text-subtler">•</span>
                        <span>{t.date}</span>
                      </div>
                    </div>
                  </div>
                  {t.status === 'In Progress' && t.progress && (
                    <div className="flex items-center gap-2 pl-5 mt-0.5">
                      <div className="flex-1 h-0.5 bg-secondary/20 rounded-none overflow-hidden">
                        <div
                          className="h-full bg-secondary"
                          style={{ width: `${t.progress}%` }}
                        />
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-text-subtle tabular-nums">
                        {t.progress}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-10 text-[9px] md:text-[10px] text-text-subtler font-black uppercase tracking-widest italic">
                  Zero tasks in {activeTaskTab}
                </div>
              )}
            </div>
            <button className="text-[8.5px] md:text-[9.5px] font-black uppercase tracking-widest text-secondary hover:text-text transition-colors mt-2 shrink-0 flex items-center gap-1 cursor-pointer">
              + Add Task
            </button>
          </WidgetCard>

          {/* My Learning Path */}
          <WidgetCard
            title="My Learning Path"
            className="h-auto lg:h-[240px] flex flex-col overflow-hidden"
          >
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none pt-1">
              {learningLessons.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 hover:translate-x-0.5 transition-transform duration-200"
                >
                  <div
                    className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border ${i === 0 ? 'bg-status-warning/10 text-status-warning border-status-warning/20' : i === 1 ? 'bg-status-success/10 text-status-success border-status-success/20' : i === 2 ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-status-error/10 text-status-error border-status-error/20'}`}
                  >
                    <BookOpen size={14} />
                  </div>
                  <div className="flex flex-col flex-1 gap-1 min-w-0">
                    <div className="flex justify-between items-end leading-none">
                      <div className="flex flex-col min-w-0">
                        <span
                          className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-text truncate pr-1"
                          title={l.title}
                        >
                          {l.title}
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-text-subtle tabular-nums mt-0.5">
                          {l.completed}/{l.total} lessons
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-subtle tabular-nums shrink-0">
                        {l.progress}%
                      </span>
                    </div>
                    <div className="w-full h-0.5 bg-border-subtle rounded-none overflow-hidden mt-0.5">
                      <div
                        className="h-full bg-status-success"
                        style={{ width: `${l.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {learningLessons.length === 0 && (
                <div className="text-center py-10 text-[9px] md:text-[10px] text-text-subtler font-black uppercase tracking-widest italic">
                  No active learning path
                </div>
              )}
            </div>
            <button className="text-[8.5px] md:text-[9.5px] font-black uppercase tracking-widest text-secondary hover:underline transition-colors mt-2 shrink-0 self-start flex items-center gap-1 cursor-pointer">
              Browse all modules <ArrowRight size={8} />
            </button>
          </WidgetCard>

          {/* Recent Activity */}
          <WidgetCard
            title="Recent Activity"
            action="View All"
            className="h-auto lg:h-[220px] flex flex-col overflow-hidden"
          >
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none pt-1">
              {recentActivity.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 hover:translate-x-0.5 transition-transform duration-200"
                >
                  <div className="w-6 h-6 rounded-none bg-background-elevated flex items-center justify-center shrink-0 border border-border-subtle text-text-subtle">
                    {a.type === 'commit' && <GitCommit size={10} />}
                    {a.type === 'merge' && <GitMerge size={10} />}
                    {a.type === 'pr' && <MessageCircle size={10} />}
                    {a.type === 'team' && <Users size={10} />}
                  </div>
                  <span
                    className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-text flex-1 truncate pr-1"
                    title={a.action}
                  >
                    {a.action}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-text-subtle whitespace-nowrap tabular-nums">
                      {a.time}
                    </span>
                    <div className="w-1 h-1 rounded-none bg-secondary" />
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="text-center py-10 text-[9px] md:text-[10px] text-text-subtler font-black uppercase tracking-widest italic">
                  Zero recent activity
                </div>
              )}
            </div>
          </WidgetCard>

          {/* My Goals */}
          <WidgetCard
            title="My Goals"
            action="Edit Goals"
            className="h-auto lg:h-[200px] flex flex-col overflow-hidden"
          >
            <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none pt-1">
              <div className="flex flex-col gap-1.5 p-2 bg-card border border-border-subtle rounded-none">
                <div className="flex justify-between items-center leading-none">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-text">
                    <div className="w-3 h-3 rounded-none border border-border flex items-center justify-center shrink-0">
                      <div className="w-1 h-1 rounded-none bg-border" />
                    </div>
                    Complete 3 tasks
                  </div>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-text-subtle tabular-nums shrink-0">
                    {Math.min(3, workItemsStatus.done)} / 3
                  </span>
                </div>
                <div className="w-full h-0.5 bg-border-subtle rounded-none overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-status-success"
                    style={{
                      width: `${Math.min(100, Math.round((workItemsStatus.done / 3) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 px-0.5">
                {goals.map((g, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center leading-none hover:translate-x-0.5 transition-transform duration-200"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {g.completed ? (
                        <CheckCircle2
                          size={11}
                          className="text-status-success shrink-0"
                        />
                      ) : (
                        <div className="w-3 h-3 rounded-none border border-primary flex items-center justify-center bg-primary/20 shrink-0">
                          <CheckCircle2
                            size={6}
                            className="text-primary opacity-0"
                          />
                        </div>
                      )}
                      <span
                        className={`text-[10px] sm:text-xs font-black uppercase tracking-widest truncate ${g.completed ? 'text-text-subtle' : 'text-text'}`}
                        title={g.title}
                      >
                        {g.title}
                      </span>
                    </div>
                    {g.completed ? (
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-status-success flex items-center gap-0.5 shrink-0">
                        <CheckCircle2 size={9} /> Done
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-subtle tabular-nums shrink-0">
                        {g.progress}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Right Column (Sidebar context & helpers) */}
        <div className="lg:col-span-4 flex flex-col gap-3.5 min-w-0">
          {/* Upcoming Events */}
          <WidgetCard
            title="Upcoming Events"
            action="View All"
            className="h-auto lg:h-[180px] flex flex-col overflow-hidden"
          >
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none pt-1">
              {upcomingEvents.map((e, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 hover:translate-x-0.5 transition-transform duration-200"
                >
                  <div className="flex flex-col items-center justify-center bg-background-elevated rounded-none w-10 h-10 shrink-0 border border-border-subtle">
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-secondary">
                      {e.date.split(' ')[0]}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-text leading-none mt-0.5">
                      {e.date.split(' ')[1]}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center h-10 min-w-0">
                    <span
                      className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-text truncate pr-1"
                      title={e.title}
                    >
                      {e.title}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-text-subtle mt-0.5 truncate">
                      {e.time}
                    </span>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <div className="text-center py-10 text-[9px] md:text-[10px] text-text-subtler font-black uppercase tracking-widest italic">
                  Zero upcoming events
                </div>
              )}
            </div>
          </WidgetCard>

          {/* Badges */}
          <WidgetCard
            title="Badges"
            action="View All"
            className="h-auto lg:h-[160px] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between overflow-x-auto gap-4 py-2 flex-1 min-h-0 scrollbar-none">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 shrink-0 hover:scale-105 transition-transform duration-300"
                >
                  <div
                    className={`w-10 h-10 rotate-45 rounded-none flex items-center justify-center ${b.bg} ${b.border} border`}
                  >
                    <div className={`-rotate-45 ${b.color}`}>
                      {iconMap[b.iconName] || <Lock size={14} />}
                    </div>
                  </div>
                  <div className="flex flex-col items-center mt-2.5">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text">
                      {b.title}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-text-subtle mt-0.5">
                      {b.date}
                    </span>
                  </div>
                </div>
              ))}
              {badges.length === 0 && (
                <div className="w-full text-center py-10 text-[9px] md:text-[10px] text-text-subtler font-black uppercase tracking-widest italic">
                  Zero badges unlocked
                </div>
              )}
            </div>
          </WidgetCard>

          {/* AI Assistant */}
          <WidgetCard
            title="AI Assistant"
            className="h-auto lg:h-[200px] flex flex-col overflow-hidden"
          >
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-subtle mb-2 block shrink-0">
              Ask me anything about the project
            </span>
            <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none">
              {[
                'How do I run the project locally?',
                'Where is the authentication logic?',
                'Show me coding best practices',
              ].map((q, i) => (
                <button
                  key={i}
                  className="w-full text-left p-1.5 rounded-none bg-card border border-border-subtle hover:bg-background-elevated hover:text-text transition-colors text-[8.5px] sm:text-[9px] font-black uppercase tracking-widest text-text-subtle cursor-pointer truncate"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="mt-2.5 relative shrink-0">
              <input
                type="text"
                placeholder="ASK A QUESTION..."
                className="w-full bg-background-elevated border border-border-subtle rounded-none py-1.5 pl-2.5 pr-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text placeholder:text-text-subtle focus:outline-none focus:border-secondary/50"
              />
              <button className="absolute right-0.5 top-0.5 w-5.5 h-5.5 bg-secondary rounded-none flex items-center justify-center text-background-dark hover:bg-secondary/80 transition-colors cursor-pointer">
                <ArrowRight size={10} />
              </button>
            </div>
          </WidgetCard>

          {/* Tips for You */}
          <WidgetCard
            title="Tips for You"
            className="h-auto lg:h-[180px] flex flex-col overflow-hidden"
          >
            <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none pt-1">
              {tips.map((t, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2 rounded-none bg-card border border-border-subtle hover:translate-x-0.5 transition-transform duration-200"
                >
                  <div className={`mt-0.5 shrink-0 ${t.color}`}>
                    <Lightbulb size={11} />
                  </div>
                  <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text truncate">
                      {t.title}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-text-subtle mt-0.5 leading-normal">
                      {t.desc}
                    </span>
                  </div>
                  <span
                    className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-none bg-background-elevated border border-border-subtle shrink-0 ${t.color}`}
                  >
                    Tip
                  </span>
                </div>
              ))}
              {tips.length === 0 && (
                <div className="text-center py-8 text-[9px] md:text-[10px] text-text-subtler font-black uppercase tracking-widest italic">
                  Zero active tips
                </div>
              )}
            </div>
          </WidgetCard>

          {/* Useful Links */}
          <WidgetCard
            title="Useful Links"
            className="h-auto lg:h-[180px] flex flex-col overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none pt-1">
              {[
                {
                  title: 'Getting Started Guide',
                  desc: 'Start your journey here',
                  icon: <PlayCircle size={10} />,
                },
                {
                  title: 'How to Contribute',
                  desc: 'Guidelines for new contributors',
                  icon: <Shield size={10} />,
                },
                {
                  title: 'Team Playbook',
                  desc: 'Processes & best practices',
                  icon: <BookOpen size={10} />,
                },
                {
                  title: 'Code Standards',
                  desc: 'Best practices & guidelines',
                  icon: <Code size={10} />,
                },
              ].map((l, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center justify-between p-1.5 rounded-none bg-card border border-border-subtle hover:bg-background-elevated transition-all duration-200 hover:translate-x-0.5 group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-none bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                      {l.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text group-hover:text-primary transition-colors truncate">
                        {l.title}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-text-subtle truncate">
                        {l.desc}
                      </span>
                    </div>
                  </div>
                  <ExternalLink
                    size={8}
                    className="text-text-subtler group-hover:text-text-subtle transition-colors shrink-0 ml-1"
                  />
                </a>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-text-subtle pt-2.5 border-t border-border-subtle shrink-0">
        <div className="flex items-center gap-4">
          <span>Last updated: 2 minutes ago</span>
          <div className="flex items-center gap-1 text-status-success">
            <span>Auto-refresh: On</span>
            <div className="w-1.5 h-1.5 rounded-none bg-status-success animate-pulse" />
          </div>
        </div>
        <span>Data as of: May 18, 2025 10:24 AM IST</span>
      </div>
    </div>
  );
};

export default InternDashboard;

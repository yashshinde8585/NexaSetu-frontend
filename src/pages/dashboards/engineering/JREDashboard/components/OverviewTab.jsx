import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  GitMerge,
  CheckCircle,
  FileCode2,
  GitPullRequest,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  BookOpen,
  ThumbsUp,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

const OverviewTab = ({
  burndownData,
  recentActivity,
  upcomingDeadlines,
  deployments,
  inProgressTasks,
  learningLessons,
  codeQuality,
  pullRequestsList,
  aiInsights,
  setActiveTab,
}) => {
  const [activeWorkFilter, setActiveWorkFilter] = useState('in_progress');
  const [activePRFilter, setActivePRFilter] = useState('Open');

  // Filter tasks based on activeWorkFilter
  const filteredTasks =
    inProgressTasks?.filter((task) => {
      if (activeWorkFilter === 'in_progress')
        return task.status === 'in_progress' || task.status === 'todo';
      if (activeWorkFilter === 'in_review') return task.status === 'in_review';
      if (activeWorkFilter === 'done') return task.status === 'done';
      return true;
    }) || [];

  // Filter PRs based on activePRFilter
  const filteredPRs =
    pullRequestsList?.filter((pr) => {
      if (activePRFilter === 'Open')
        return pr.status === 'Open' || pr.status === 'In Progress';
      if (activePRFilter === 'In Review')
        return pr.status === 'Review' || pr.status === 'In Review';
      if (activePRFilter === 'Merged') return pr.status === 'Merged';
      return true;
    }) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-start">
      {/* ROW 1 */}

      {/* My Work */}
      <div className="lg:col-span-3 bg-card border border-border-subtle rounded-none p-3 lg:p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
            My Work
          </h3>
          <button
            onClick={() => setActiveTab('my_work')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
          >
            View Board
          </button>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActiveWorkFilter('in_progress')}
            className={`text-[9px] font-black px-2 py-1 uppercase border transition-colors ${activeWorkFilter === 'in_progress' ? 'bg-status-info/20 text-status-info border-status-info/30' : 'bg-transparent text-text-subtle border-transparent hover:text-text'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveWorkFilter('in_review')}
            className={`text-[9px] font-black px-2 py-1 uppercase border transition-colors ${activeWorkFilter === 'in_review' ? 'bg-status-warning/20 text-status-warning border-status-warning/30' : 'bg-transparent text-text-subtle border-transparent hover:text-text'}`}
          >
            In Review
          </button>
          <button
            onClick={() => setActiveWorkFilter('done')}
            className={`text-[9px] font-black px-2 py-1 uppercase border transition-colors ${activeWorkFilter === 'done' ? 'bg-status-success/20 text-status-success border-status-success/30' : 'bg-transparent text-text-subtle border-transparent hover:text-text'}`}
          >
            Done
          </button>
        </div>

        <div className="flex flex-col gap-3 min-h-[160px]">
          {filteredTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className="p-2 bg-card border border-border-subtle rounded-none"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-none flex items-center justify-center ${task.status === 'done' ? 'bg-status-success/20' : 'bg-background-elevated'}`}
                  >
                    {task.status === 'done' ? (
                      <CheckCircle size={8} className="text-status-success" />
                    ) : (
                      <div className="w-1.5 h-1.5 bg-status-info rounded-none" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-text block">
                      {task.id}
                    </span>
                    <span className="text-[9px] text-text-subtle block truncate max-w-[120px]">
                      {task.title}
                    </span>
                  </div>
                </div>
                <span className="text-[8px] bg-status-info/10 text-status-info font-black px-1.5 py-0.5 uppercase">
                  {task.category || 'Backend'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[8px] text-text-subtle font-black mb-1">
                <span className="text-status-info uppercase">
                  {task.status.replace('_', ' ')}
                </span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full h-1 bg-background-elevated rounded-none overflow-hidden">
                <div
                  className="h-full bg-status-info transition-all duration-500"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-[9px] font-black uppercase tracking-widest text-text-subtle p-4 text-center">
              No tasks in this state
            </div>
          )}
        </div>
        <button
          onClick={() => setActiveTab('my_work')}
          className="text-[9px] font-black text-status-info uppercase tracking-widest hover:underline mt-4 flex items-center gap-1"
        >
          + View all work items
        </button>
      </div>

      {/* Sprint Burndown */}
      <div className="lg:col-span-6 bg-card border border-border-subtle rounded-none p-3 lg:p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
            Sprint Burndown
          </h3>
          <button
            onClick={() => setActiveTab('insights')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
          >
            View Chart
          </button>
        </div>

        <div className="flex gap-3 lg:gap-4 justify-center mb-6 text-[9px] font-black tracking-widest text-text-subtle uppercase">
          <span className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-border" />{' '}
            Ideal
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-none" /> Remaining
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-status-success rounded-none" />{' '}
            Completed
          </span>
        </div>

        <div className="h-40 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={burndownData}
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.3)"
                fontSize={9}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                fontSize={9}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0px',
                }}
                itemStyle={{ fontSize: 10, fontWeight: 'bold' }}
              />
              <Line
                type="monotone"
                dataKey="ideal"
                stroke="rgba(255,255,255,0.3)"
                strokeDasharray="4 4"
                dot={false}
                strokeWidth={1.5}
                name="Ideal"
              />
              <Line
                type="monotone"
                dataKey="remaining"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--color-secondary)' }}
                name="Remaining"
              />
              <Line
                type="monotone"
                dataKey="ideal"
                stroke="var(--color-status-success)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--color-status-success)' }}
                name="Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="lg:col-span-3 bg-card border border-border-subtle rounded-none p-3 lg:p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
            Recent Activity
          </h3>
          <button
            onClick={() => setActiveTab('feedback')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="flex gap-3 relative">
              {idx !== recentActivity.length - 1 && (
                <div className="absolute top-3 left-3 -bottom-5 w-[1px] bg-border" />
              )}
              <div className="w-6 h-6 rounded-none flex items-center justify-center shrink-0 bg-card border border-border text-text-subtle relative z-10">
                {activity.type === 'merge' && (
                  <GitMerge size={10} className="text-primary" />
                )}
                {activity.type === 'approval' && (
                  <CheckCircle size={10} className="text-status-success" />
                )}
                {activity.type === 'commit' && (
                  <FileCode2 size={10} className="text-status-info" />
                )}
                {activity.type === 'review' && (
                  <GitPullRequest size={10} className="text-status-warning" />
                )}
                {activity.type === 'close' && (
                  <CheckCircle2 size={10} className="text-text-subtle" />
                )}
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-none bg-status-success" />
              </div>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-text leading-tight pr-2">
                    {activity.title}
                  </span>
                  <span className="text-[8px] text-text-subtle font-black uppercase whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
                <span className="text-[9px] text-text-subtle mt-1">
                  {activity.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 2 */}

      {/* Learning Path */}
      <div className="lg:col-span-3 bg-card border border-border-subtle rounded-none p-3 lg:p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
            Learning Path
          </h3>
          <button
            onClick={() => setActiveTab('learn')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {learningLessons?.slice(0, 4).map((lesson, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-card border border-border flex flex-col items-center justify-center text-status-warning">
                <BookOpen size={10} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <span className="text-[10px] font-bold text-text block">
                      {lesson.name}
                    </span>
                    <span className="text-[8px] text-text-subtle font-black uppercase">
                      {lesson.completed}/{lesson.total} lessons
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-text-subtle">
                    {lesson.progress}%
                  </span>
                </div>
                <div className="w-full h-1 bg-background-elevated rounded-none overflow-hidden">
                  <div
                    className="h-full bg-status-success"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setActiveTab('learn')}
          className="text-[9px] font-black text-status-info uppercase tracking-widest hover:underline mt-4 flex items-center gap-1"
        >
          See recommended for you <ArrowRight size={10} />
        </button>
      </div>

      {/* Code Quality */}
      <div className="lg:col-span-3 bg-card border border-border-subtle rounded-none p-3 lg:p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
            Code Quality
          </h3>
          <button
            onClick={() => setActiveTab('code')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
          >
            View Details
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-card border border-border text-text-subtle">
                <Shield size={10} />
              </div>
              <span className="text-[10px] font-bold text-text-subtle">
                Code Coverage
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-text">
                {codeQuality?.coverage}%
              </span>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-status-success">
                  +{codeQuality?.coverageDiff}%
                </span>
                <span className="text-[7px] font-black uppercase text-text-subtle">
                  vs last sprint
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-card border border-border text-text-subtle">
                <Zap size={10} />
              </div>
              <span className="text-[10px] font-bold text-text-subtle">
                ESLint Issues
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-text">
                {codeQuality?.eslint}
              </span>
              <span className="text-[8px] font-black text-status-success">
                +{codeQuality?.eslintDiff}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-status-warning/10 border border-status-warning/20 text-status-warning">
                <Shield size={10} />
              </div>
              <span className="text-[10px] font-bold text-text-subtle">
                Security Issues
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-text">
                {codeQuality?.security}
              </span>
              <span className="text-[8px] font-black text-text-subtle">
                No change
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 border border-primary/20 text-primary">
                <GitMerge size={10} />
              </div>
              <span className="text-[10px] font-bold text-text-subtle">
                Technical Debt
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-text">
                {codeQuality?.techDebt} days
              </span>
              <span className="text-[8px] font-black text-status-success">
                ↓ {Math.abs(codeQuality?.techDebtDiff)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pull Requests */}
      <div className="lg:col-span-3 bg-card border border-border-subtle rounded-none p-3 lg:p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
            Pull Requests
          </h3>
          <button
            onClick={() => setActiveTab('code')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="flex gap-4 mb-3 border-b border-border-subtle pb-2 text-[9px] font-black uppercase tracking-widest">
          <button
            onClick={() => setActivePRFilter('Open')}
            className={`pb-2 -mb-2 transition-colors ${activePRFilter === 'Open' ? 'text-primary border-b border-primary' : 'text-text-subtle hover:text-text'}`}
          >
            Open
          </button>
          <button
            onClick={() => setActivePRFilter('In Review')}
            className={`pb-2 -mb-2 transition-colors ${activePRFilter === 'In Review' ? 'text-primary border-b border-primary' : 'text-text-subtle hover:text-text'}`}
          >
            In Review
          </button>
          <button
            onClick={() => setActivePRFilter('Merged')}
            className={`pb-2 -mb-2 transition-colors ${activePRFilter === 'Merged' ? 'text-primary border-b border-primary' : 'text-text-subtle hover:text-text'}`}
          >
            Merged
          </button>
        </div>
        <div className="flex flex-col gap-3 min-h-[100px]">
          {filteredPRs.slice(0, 2).map((pr, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-card border border-border-subtle"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-none bg-primary/20 flex items-center justify-center">
                  <GitPullRequest size={10} className="text-primary" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text flex items-center gap-1.5">
                    {pr.number}{' '}
                    <span className="text-[9px] font-normal text-text-subtle truncate max-w-[100px]">
                      {pr.title}
                    </span>
                  </span>
                </div>
              </div>
              <span
                className={`text-[8px] font-black uppercase px-1.5 py-0.5 ${pr.status === 'In Progress' ? 'bg-status-info/10 text-status-info' : 'bg-status-warning/10 text-status-warning'}`}
              >
                {pr.status}
              </span>
            </div>
          ))}
          {filteredPRs.length === 0 && (
            <div className="text-[9px] font-black uppercase tracking-widest text-text-subtle p-2 text-center">
              No PRs in this state
            </div>
          )}
        </div>
        <button
          onClick={() => setActiveTab('code')}
          className="text-[9px] font-black text-status-info uppercase tracking-widest hover:underline mt-4 flex items-center gap-1"
        >
          View all pull requests
        </button>
      </div>

      {/* Quick Links */}
      <div className="lg:col-span-3 bg-card border border-border-subtle rounded-none p-3 lg:p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
            Quick Links
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => console.log('Link: Coding Standards')}
            className="flex justify-between items-center p-2 bg-card border border-border-subtle hover:border-border transition-colors group w-full text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-status-info/10 text-status-info">
                <FileCode2 size={10} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text">
                  Coding Standards
                </span>
                <span className="text-[8px] font-black uppercase text-text-subtle">
                  Best practices & guidelines
                </span>
              </div>
            </div>
            <ArrowRight
              size={12}
              className="text-text-subtler group-hover:text-primary transition-colors"
            />
          </button>
          <button
            onClick={() => console.log('Link: How to Contribute')}
            className="flex justify-between items-center p-2 bg-card border border-border-subtle hover:border-border transition-colors group w-full text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 text-primary">
                <GitPullRequest size={10} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text">
                  How to Contribute
                </span>
                <span className="text-[8px] font-black uppercase text-text-subtle">
                  Guide for new contributors
                </span>
              </div>
            </div>
            <ArrowRight
              size={12}
              className="text-text-subtler group-hover:text-primary transition-colors"
            />
          </button>
          <button
            onClick={() => console.log('Link: Ask for Help')}
            className="flex justify-between items-center p-2 bg-card border border-border-subtle hover:border-border transition-colors group w-full text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-status-info/10 text-status-info">
                <AlertCircle size={10} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text">
                  Ask for Help
                </span>
                <span className="text-[8px] font-black uppercase text-text-subtle">
                  Get help from the team
                </span>
              </div>
            </div>
            <ArrowRight
              size={12}
              className="text-text-subtler group-hover:text-primary transition-colors"
            />
          </button>
          <button
            onClick={() => console.log('Link: Team Playbook')}
            className="flex justify-between items-center p-2 bg-card border border-border-subtle hover:border-border transition-colors group w-full text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-status-warning/10 text-status-warning">
                <BookOpen size={10} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text">
                  Team Playbook
                </span>
                <span className="text-[8px] font-black uppercase text-text-subtle">
                  Processes & workflows
                </span>
              </div>
            </div>
            <ArrowRight
              size={12}
              className="text-text-subtler group-hover:text-primary transition-colors"
            />
          </button>
        </div>
      </div>

      {/* ROW 3 */}

      {/* Deployments */}
      <div className="lg:col-span-6 bg-card border border-border-subtle rounded-none p-3 lg:p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
            Deployments
          </h3>
          <button
            onClick={() => console.log('Open Deployments Details')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border-subtle text-[9px] text-text-subtle uppercase font-black tracking-widest">
                <th className="py-2 font-black">Environment</th>
                <th className="py-2 font-black">Version</th>
                <th className="py-2 font-black">Deployed By</th>
                <th className="py-2 font-black">Time</th>
                <th className="py-2 font-black text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-subtle text-[10px]">
              {deployments?.map((d, idx) => (
                <tr key={idx} className="hover:bg-card transition-colors">
                  <td className="py-2 text-text font-bold">{d.environment}</td>
                  <td className="py-2">{d.version}</td>
                  <td className="py-2 font-bold">{d.deployedBy}</td>
                  <td className="py-2">{d.time}</td>
                  <td className="py-2 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-none bg-status-success" />
                      <span className="text-status-success font-black uppercase">
                        {d.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips & Insights */}
      <div className="lg:col-span-3 bg-card border border-border-subtle rounded-none p-3 lg:p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
            Tips & Insights
          </h3>
          <button
            onClick={() => setActiveTab('insights')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {aiInsights?.slice(0, 3).map((insight, idx) => (
            <div
              key={idx}
              className="flex gap-3 items-start p-2 bg-card border border-border-subtle"
            >
              <div
                className={`p-1.5 ${insight.type === 'Positive' ? 'text-status-success bg-status-success/10' : insight.type === 'Tip' ? 'text-status-warning bg-status-warning/10' : 'text-primary bg-primary/10'}`}
              >
                {insight.type === 'Positive' ? (
                  <ThumbsUp size={10} />
                ) : insight.type === 'Tip' ? (
                  <Lightbulb size={10} />
                ) : (
                  <AlertCircle size={10} />
                )}
              </div>
              <div className="flex-1">
                <span className="text-[9px] text-text-subtle leading-snug block mb-1">
                  {insight.text}
                </span>
              </div>
              <span
                className={`text-[7px] font-black uppercase px-1.5 py-0.5 ${insight.type === 'Positive' ? 'text-status-success bg-status-success/10' : insight.type === 'Tip' ? 'text-status-warning bg-status-warning/10' : 'text-primary bg-primary/10'}`}
              >
                {insight.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="lg:col-span-3 bg-card border border-border-subtle rounded-none p-3 lg:p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">
            Upcoming Deadlines
          </h3>
          <button
            onClick={() => console.log('Open Calendar view')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
          >
            View Calendar
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {upcomingDeadlines?.map((deadline, idx) => {
            let colorClass = 'text-status-success';
            if (deadline.daysLeft < 6) colorClass = 'text-status-error';
            else if (deadline.daysLeft < 10) colorClass = 'text-status-warning';
            return (
              <div
                key={idx}
                className="flex justify-between items-center p-2 bg-card border border-border-subtle rounded-none"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-text">
                    {deadline.title}
                  </span>
                  <span className="text-[8px] text-text-subtle font-black uppercase mt-0.5">
                    {deadline.date}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-black uppercase ${colorClass}`}
                >
                  {deadline.daysLeft} days left
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

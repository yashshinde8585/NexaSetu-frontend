import React, { useState, useMemo } from 'react';
import {
  Package,
  Clock,
  ShieldAlert,
  Flame,
  GitPullRequest,
  CheckCircle2,
  Bug,
  Activity,
  Zap,
  Users,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Shield,
  FileText,
  Target,
  Lightbulb,
  TrendingUp,
  Terminal,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import taskApi from '../../../api/taskApi';
import CenteredLoading from '../../../components/atoms/CenteredLoading';
import ErrorBoundary from '../../../components/atoms/ErrorBoundary';

// Recharts components
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Reuse detailed sub-tab components from SWEDashboard
import MyWorkTab from './SWEDashboard/components/MyWorkTab';
import CodeTab from './SWEDashboard/components/CodeTab';
import PRsTab from './SWEDashboard/components/PRsTab';
import QualityTab from './SWEDashboard/components/QualityTab';
import DeploymentsTab from './SWEDashboard/components/DeploymentsTab';
import InsightsTab from './SWEDashboard/components/InsightsTab';

const TABS = [
  'Overview',
  'My Work',
  'Code',
  'Pull Requests',
  'Quality',
  'Deployments',
  'Insights',
];

// Helper to render sparklines in metric cards
const Sparkline = ({ data, color }) => (
  <div className="w-16 h-8 shrink-0">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="val"
          stroke={color}
          strokeWidth={1.5}
          fillOpacity={1}
          fill={`url(#grad-${color})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const SEDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useRoleDashboard('se');
  const [activeTab, setActiveTab] = useState('Overview');
  const [internalPRTab, setInternalPRTab] = useState('Open');

  // Mutation for updating status
  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }) =>
      taskApi.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'se'] });
    },
  });

  // Mutation for toggling blocker status
  const blockMutation = useMutation({
    mutationFn: ({ taskId, blocked }) =>
      taskApi.toggleTaskBlockage(taskId, blocked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'se'] });
    },
  });

  const handleUpdateStatus = (taskId, status) => {
    statusMutation.mutate({ taskId, status });
  };

  const handleToggleBlock = (taskId, blocked) => {
    blockMutation.mutate({ taskId, blocked });
  };

  if (isLoading || !data) return <CenteredLoading />;

  // Destructure base response data fields directly from server data with no hardcoded fallback values
  const {
    sprintName,
    sprintDaysLeft,
    sprintProgress,
    workItemsStatus,
    pullRequestMetrics,
    pullRequestsList,
    codeHealthScore,
    myVelocity,
    burndownData,
    recentActivity,
    codeQuality,
    myCodeImpact,
    deployments,
    aiInsights,
    upcomingDeadlines,
    myTasks,
  } = data;

  // Standardize tasks arrays
  const inProgressTasks = myTasks
    ? myTasks.filter((t) => t.status === 'in_progress')
    : [];
  const inReviewTasks = myTasks
    ? myTasks.filter((t) => t.status === 'in_review')
    : [];
  const doneTasks = myTasks ? myTasks.filter((t) => t.status === 'done') : [];

  const filesChangedList = myCodeImpact?.topFilesChanged;

  const currentPRsList = () => {
    if (!pullRequestsList) return [];
    return pullRequestsList.filter((pr) => {
      if (internalPRTab === 'Open')
        return pr.status === 'Open' || pr.status === 'In Progress';
      if (internalPRTab === 'In Review') return pr.status === 'In Review';
      return pr.status === 'Merged' || pr.status === 'Closed';
    });
  };

  const deploymentsList = deployments;
  const activityList = recentActivity;

  const insightsList = aiInsights?.map((insight, idx) => ({
    title: insight.title,
    text: insight.text,
    val: insight.type || 'Suggestion',
    color:
      idx % 3 === 0
        ? 'text-status-success bg-status-success/10 border-status-success/20'
        : idx % 3 === 1
          ? 'text-purple bg-purple/10 border-purple/20'
          : 'text-status-warning bg-status-warning/10 border-status-warning/20',
  }));

  const deadlinesList = upcomingDeadlines?.map((dl) => ({
    title: dl.title,
    date: dl.date,
    daysLeft: dl.daysLeft,
    color:
      dl.daysLeft <= 5
        ? 'text-status-error'
        : dl.daysLeft <= 10
          ? 'text-status-warning'
          : 'text-status-success',
  }));

  // Render core Overview layout
  const renderOverview = () => {
    return (
      <div className="flex flex-col gap-6">
        {/* 1. Top Row Metrics Cards (6 Cards Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Card 1: My Code Health */}
          <div className="bg-background-elevated border border-border-subtle p-4 flex items-center gap-3 hover:border-border-subtle/80 transition-colors min-h-[96px] rounded-sm">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <PieChart width={48} height={48}>
                <Pie
                  data={[
                    {
                      value: codeHealthScore,
                      color: 'var(--color-status-success)',
                    },
                    {
                      value: 100 - codeHealthScore,
                      color: 'var(--color-border-subtler)',
                    },
                  ]}
                  dataKey="value"
                  innerRadius={15}
                  outerRadius={21}
                  startAngle={225}
                  endAngle={-45}
                >
                  <Cell fill="var(--color-status-success)" />
                  <Cell fill="var(--color-border-subtler)" />
                </Pie>
              </PieChart>
              <span className="absolute text-[8px] font-black text-text leading-none">
                {codeHealthScore}
              </span>
            </div>
            <div className="leading-none">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-subtle block mb-1">
                My Code Health
              </span>
              <span className="text-xl font-black text-text">
                {codeHealthScore}/100
              </span>
              <span className="block text-[7px] font-black uppercase tracking-widest text-status-success mt-1">
                Excellent
              </span>
            </div>
          </div>

          {/* Card 2: Pull Requests Merged */}
          <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col justify-between hover:border-border-subtle/80 transition-colors min-h-[96px] rounded-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-subtle">
                Pull Requests Merged
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="leading-none">
                <span className="text-2xl font-black text-text block">
                  {pullRequestMetrics?.merged || 0}
                </span>
                {myCodeImpact?.prsMergedDiff !== undefined ? (
                  <span
                    className={`flex items-center gap-0.5 text-[7px] font-black uppercase tracking-wider mt-1 ${
                      myCodeImpact.prsMergedDiff > 0
                        ? 'text-status-success'
                        : myCodeImpact.prsMergedDiff < 0
                          ? 'text-status-error'
                          : 'text-text-subtle'
                    }`}
                  >
                    {myCodeImpact.prsMergedDiff > 0 ? (
                      <TrendingUp size={8} />
                    ) : myCodeImpact.prsMergedDiff < 0 ? (
                      <TrendingDown size={8} />
                    ) : null}
                    {myCodeImpact.prsMergedDiff > 0
                      ? `+${myCodeImpact.prsMergedDiff}`
                      : myCodeImpact.prsMergedDiff < 0
                        ? myCodeImpact.prsMergedDiff
                        : '0'}{' '}
                    vs last sprint
                  </span>
                ) : (
                  <span className="text-[7px] font-black text-text-subtle uppercase tracking-wider mt-1">
                    No change vs last sprint
                  </span>
                )}
              </div>
              <Sparkline data={myVelocity?.sparkline} color="#a855f7" />
            </div>
          </div>

          {/* Card 3: Code Contributions */}
          <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col justify-between hover:border-border-subtle/80 transition-colors min-h-[96px] rounded-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-subtle">
                Code Contributions
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="leading-none">
                <span className="text-2xl font-black text-text block">
                  {(myCodeImpact?.commits || 0).toLocaleString()}
                </span>
                {myCodeImpact?.commitsDiff !== undefined ? (
                  <span
                    className={`flex items-center gap-0.5 text-[7px] font-black uppercase tracking-wider mt-1 ${
                      myCodeImpact.commitsDiff > 0
                        ? 'text-status-success'
                        : myCodeImpact.commitsDiff < 0
                          ? 'text-status-error'
                          : 'text-text-subtle'
                    }`}
                  >
                    {myCodeImpact.commitsDiff > 0 ? (
                      <TrendingUp size={8} />
                    ) : myCodeImpact.commitsDiff < 0 ? (
                      <TrendingDown size={8} />
                    ) : null}
                    {myCodeImpact.commitsDiff > 0
                      ? `+${myCodeImpact.commitsDiff}`
                      : myCodeImpact.commitsDiff < 0
                        ? myCodeImpact.commitsDiff
                        : '0'}{' '}
                    commits vs last sprint
                  </span>
                ) : (
                  <span className="text-[7px] font-black text-text-subtle uppercase tracking-wider mt-1">
                    No change vs last sprint
                  </span>
                )}
              </div>
              <Sparkline data={myVelocity?.sparkline} color="#60a5fa" />
            </div>
          </div>

          {/* Card 4: PR Cycle Time (Avg) */}
          <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col justify-between hover:border-border-subtle/80 transition-colors min-h-[96px] rounded-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-subtle">
                PR Cycle Time (Avg)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="leading-none">
                <span className="text-2xl font-black text-text block">
                  {data?.avgPRCycleTime || '0.0h'}
                </span>
                {data?.avgPRCycleTimeDiff ? (
                  <span
                    className={`flex items-center gap-0.5 text-[7px] font-black uppercase tracking-wider mt-1 ${
                      parseFloat(data.avgPRCycleTimeDiff) < 0
                        ? 'text-status-success'
                        : parseFloat(data.avgPRCycleTimeDiff) > 0
                          ? 'text-status-error'
                          : 'text-text-subtle'
                    }`}
                  >
                    {parseFloat(data.avgPRCycleTimeDiff) < 0 ? (
                      <TrendingDown size={8} />
                    ) : parseFloat(data.avgPRCycleTimeDiff) > 0 ? (
                      <TrendingUp size={8} />
                    ) : null}
                    {data.avgPRCycleTimeDiff} vs last sprint
                  </span>
                ) : (
                  <span className="text-[7px] font-black text-text-subtle uppercase tracking-wider mt-1">
                    No change vs last sprint
                  </span>
                )}
              </div>
              <Sparkline data={myVelocity?.sparkline} color="#22c55e" />
            </div>
          </div>

          {/* Card 5: Bugs Introduced */}
          <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col justify-between hover:border-border-subtle/80 transition-colors min-h-[96px] rounded-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-subtle">
                Bugs Introduced
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="leading-none">
                <span className="text-2xl font-black text-text block">
                  {inProgressTasks
                    ? inProgressTasks.filter((t) =>
                        t.title?.toLowerCase().includes('bug')
                      ).length
                    : 0}
                </span>
                {codeQuality?.eslintDiff !== undefined ? (
                  <span
                    className={`flex items-center gap-0.5 text-[7px] font-black uppercase tracking-wider mt-1 ${
                      codeQuality.eslintDiff < 0
                        ? 'text-status-success'
                        : codeQuality.eslintDiff > 0
                          ? 'text-status-error'
                          : 'text-text-subtle'
                    }`}
                  >
                    {codeQuality.eslintDiff < 0 ? (
                      <TrendingDown size={8} />
                    ) : codeQuality.eslintDiff > 0 ? (
                      <TrendingUp size={8} />
                    ) : null}
                    {codeQuality.eslintDiff < 0
                      ? `↓ ${Math.abs(codeQuality.eslintDiff)} bugs`
                      : codeQuality.eslintDiff > 0
                        ? `↑ ${codeQuality.eslintDiff} bugs`
                        : 'No change'}{' '}
                    vs last sprint
                  </span>
                ) : (
                  <span className="text-[7px] font-black text-text-subtle uppercase tracking-wider mt-1">
                    No change vs last sprint
                  </span>
                )}
              </div>
              <Sparkline data={myVelocity?.sparkline} color="#f87171" />
            </div>
          </div>

          {/* Card 6: Review Feedback Score */}
          <div className="bg-background-elevated border border-border-subtle p-4 flex items-center gap-3 hover:border-border-subtle/80 transition-colors min-h-[96px] rounded-sm">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <PieChart width={48} height={48}>
                <Pie
                  data={[
                    { value: data?.avgFeedbackScore || 0, color: '#3b82f6' },
                    {
                      value: 5.0 - (data?.avgFeedbackScore || 0),
                      color: 'var(--color-border-subtler)',
                    },
                  ]}
                  dataKey="value"
                  innerRadius={15}
                  outerRadius={21}
                  startAngle={225}
                  endAngle={-45}
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="var(--color-border-subtler)" />
                </Pie>
              </PieChart>
              <span className="absolute text-[8px] font-black text-text leading-none">
                {data?.avgFeedbackScore || 0}
              </span>
            </div>
            <div className="leading-none">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-subtle block mb-1">
                Feedback Score
              </span>
              <span className="text-xl font-black text-text">
                {data?.avgFeedbackScore || 0}/5.0
              </span>
              <span
                className={`block text-[7px] font-black uppercase tracking-widest mt-1 ${
                  (data?.avgFeedbackScore || 0) >= 4.5
                    ? 'text-status-success'
                    : (data?.avgFeedbackScore || 0) >= 3.5
                      ? 'text-primary'
                      : 'text-status-warning'
                }`}
              >
                {(data?.avgFeedbackScore || 0) >= 4.5
                  ? 'Excellent'
                  : (data?.avgFeedbackScore || 0) >= 3.5
                    ? 'Great'
                    : 'Needs Focus'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Three Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1 (Left) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* My Work Items */}
            <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col rounded-sm">
              <div className="flex justify-between items-center mb-4 border-b border-border-subtler pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
                  My Work Items
                </span>
                <button
                  onClick={() => setActiveTab('My Work')}
                  className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
                >
                  View All
                </button>
              </div>

              {/* Status breakdown bar */}
              <div className="grid grid-cols-4 gap-1 text-center py-2 bg-background-light/50 border border-border-subtle/50 mb-3 text-[10px]">
                <div>
                  <span className="block text-md font-black text-text">
                    {workItemsStatus?.inProgress || 0}
                  </span>
                  <span className="text-[6px] font-black uppercase tracking-wider text-text-subtle/50">
                    In Progress
                  </span>
                </div>
                <div className="border-x border-border-subtler">
                  <span className="block text-md font-black text-status-warning">
                    {workItemsStatus?.inReview || 0}
                  </span>
                  <span className="text-[6px] font-black uppercase tracking-wider text-text-subtle/50">
                    In Review
                  </span>
                </div>
                <div>
                  <span className="block text-md font-black text-status-error">
                    {workItemsStatus?.blocked || 0}
                  </span>
                  <span className="text-[6px] font-black uppercase tracking-wider text-text-subtle/50">
                    Blocked
                  </span>
                </div>
                <div className="border-l border-border-subtler">
                  <span className="block text-md font-black text-status-success">
                    {workItemsStatus?.done || 0}
                  </span>
                  <span className="text-[6px] font-black uppercase tracking-wider text-text-subtle/50">
                    Done
                  </span>
                </div>
              </div>

              {/* Work item list */}
              <div className="flex flex-col gap-2">
                {myTasks?.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/task/${task.id}`)}
                    className="p-2.5 bg-background-light hover:bg-background-light/80 border border-border-subtler transition-all cursor-pointer flex flex-col gap-1 rounded-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-primary font-bold">
                        {task.taskKey || 'NC-TASK'}
                      </span>
                      <span
                        className={`text-[6px] font-black uppercase tracking-wider px-1 py-0.5 rounded-sm border ${
                          task.status === 'in_progress'
                            ? 'border-primary/20 text-primary bg-primary/5'
                            : task.status === 'in_review'
                              ? 'border-status-warning/20 text-status-warning bg-status-warning/5'
                              : task.blocked
                                ? 'border-status-error/20 text-status-error bg-status-error/5'
                                : 'border-status-success/20 text-status-success bg-status-success/5'
                        }`}
                      >
                        {task.status === 'in_progress'
                          ? 'In Progress'
                          : task.status === 'in_review'
                            ? 'In Review'
                            : task.blocked
                              ? 'Blocked'
                              : 'Done'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-text leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {task.title}
                    </span>
                    {task.status === 'in_progress' && (
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 bg-border-subtler h-1 rounded-sm overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all"
                            style={{ width: '70%' }}
                          />
                        </div>
                        <span className="text-[8px] text-text-subtle font-bold">
                          70%
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {(!myTasks || myTasks.length === 0) && (
                  <div className="text-center py-6 text-[8px] text-text-subtle uppercase font-black tracking-widest italic border border-dashed border-border-subtle rounded-sm">
                    No work items assigned
                  </div>
                )}
              </div>
            </div>

            {/* Code Quality */}
            <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col rounded-sm">
              <div className="flex justify-between items-center mb-4 border-b border-border-subtler pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
                  Code Quality
                </span>
                <button
                  onClick={() => setActiveTab('Quality')}
                  className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
                >
                  View Details
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="p-2 bg-background-light/50 border border-border-subtler rounded-sm">
                  <span className="text-[7px] font-black uppercase tracking-wider text-text-subtle block">
                    Coverage
                  </span>
                  <span className="text-md font-black text-text block mt-0.5">
                    {codeQuality?.coverage || 0}%
                  </span>
                  <span
                    className={`text-[6px] font-bold block ${
                      (codeQuality?.coverageDiff || 0) > 0
                        ? 'text-status-success'
                        : (codeQuality?.coverageDiff || 0) < 0
                          ? 'text-status-error'
                          : 'text-text-subtler'
                    }`}
                  >
                    {(codeQuality?.coverageDiff || 0) > 0
                      ? `+${codeQuality.coverageDiff}%`
                      : (codeQuality?.coverageDiff || 0) < 0
                        ? `${codeQuality.coverageDiff}%`
                        : 'No change'}{' '}
                    vs last sprint
                  </span>
                </div>
                <div className="p-2 bg-background-light/50 border border-border-subtler rounded-sm">
                  <span className="text-[7px] font-black uppercase tracking-wider text-text-subtle block">
                    ESLint Issues
                  </span>
                  <span className="text-md font-black text-text block mt-0.5">
                    {codeQuality?.eslint || 0}
                  </span>
                  <span
                    className={`text-[6px] font-bold block ${
                      (codeQuality?.eslintDiff || 0) < 0
                        ? 'text-status-success'
                        : (codeQuality?.eslintDiff || 0) > 0
                          ? 'text-status-error'
                          : 'text-text-subtler'
                    }`}
                  >
                    {(codeQuality?.eslintDiff || 0) < 0
                      ? `↓ ${Math.abs(codeQuality.eslintDiff)}`
                      : (codeQuality?.eslintDiff || 0) > 0
                        ? `↑ ${codeQuality.eslintDiff}`
                        : 'No change'}{' '}
                    issues
                  </span>
                </div>
                <div className="p-2 bg-background-light/50 border border-border-subtler rounded-sm">
                  <span className="text-[7px] font-black uppercase tracking-wider text-text-subtle block">
                    Security Issues
                  </span>
                  <span className="text-md font-black text-status-success block mt-0.5">
                    {codeQuality?.security || 0}
                  </span>
                  <span
                    className={`text-[6px] font-bold block ${
                      (codeQuality?.securityDiff || 0) < 0
                        ? 'text-status-success'
                        : (codeQuality?.securityDiff || 0) > 0
                          ? 'text-status-error'
                          : 'text-text-subtler'
                    }`}
                  >
                    {(codeQuality?.securityDiff || 0) < 0
                      ? `↓ ${Math.abs(codeQuality.securityDiff)}`
                      : (codeQuality?.securityDiff || 0) > 0
                        ? `↑ ${codeQuality.securityDiff}`
                        : 'No change'}
                  </span>
                </div>
              </div>

              {/* SonarQube rating */}
              <div className="flex flex-col gap-2 p-3 bg-background-light border border-border-subtler rounded-sm">
                <span className="text-[8px] font-black uppercase tracking-wider text-text-subtle mb-1">
                  SonarQube Rating
                </span>
                <div className="flex justify-between items-center text-[9px] font-bold text-text">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-status-success/15 text-status-success border border-status-success/30 flex items-center justify-center text-[9px] font-black">
                      {codeQuality?.maintainabilityGrade || 'A'}
                    </span>
                    <span>
                      Maintainable Code (
                      {codeQuality?.maintainabilityScore !== undefined
                        ? `${codeQuality.maintainabilityScore}%`
                        : '100%'}
                      )
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-status-success/15 text-status-success border border-status-success/30 flex items-center justify-center text-[7px] font-black">
                        {codeQuality?.reliabilityGrade || 'A'}
                      </span>
                      <span className="text-text-subtle text-[8px]">
                        Reliability
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-status-success/15 text-status-success border border-status-success/30 flex items-center justify-center text-[7px] font-black">
                        {codeQuality?.securityGrade || 'A'}
                      </span>
                      <span className="text-text-subtle text-[8px]">
                        Security
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[7px] font-bold mt-1 border-t border-border-subtler/50 pt-2 block ${
                    (codeQuality?.techDebtDiff || 0) < 0
                      ? 'text-status-success'
                      : (codeQuality?.techDebtDiff || 0) > 0
                        ? 'text-status-error'
                        : 'text-text-subtler'
                  }`}
                >
                  {(codeQuality?.techDebtDiff || 0) < 0
                    ? `↓ ${Math.abs(codeQuality.techDebtDiff)}d`
                    : (codeQuality?.techDebtDiff || 0) > 0
                      ? `↑ ${codeQuality.techDebtDiff}d`
                      : 'No change in'}{' '}
                  technical debt vs last sprint
                </span>
              </div>
            </div>

            {/* My Code Impact */}
            <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col rounded-sm">
              <div className="flex justify-between items-center mb-4 border-b border-border-subtler pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
                  My Code Impact
                </span>
                <button
                  onClick={() => setActiveTab('Code')}
                  className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
                >
                  View Details
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-[9px] text-text font-bold mb-4">
                <div className="py-2 bg-background-light border border-border-subtler rounded-sm">
                  <span className="block text-sm font-black">
                    {(myCodeImpact?.commits || 0).toLocaleString()}
                  </span>
                  <span className="text-[5px] text-text-subtle uppercase">
                    Commits
                  </span>
                  <span
                    className={`block text-[5px] font-black mt-0.5 ${
                      (myCodeImpact?.commitsDiff || 0) > 0
                        ? 'text-status-success'
                        : (myCodeImpact?.commitsDiff || 0) < 0
                          ? 'text-status-error'
                          : 'text-text-subtler'
                    }`}
                  >
                    {(myCodeImpact?.commitsDiff || 0) > 0
                      ? `+${myCodeImpact.commitsDiff}`
                      : myCodeImpact?.commitsDiff || 'No change'}
                  </span>
                </div>
                <div className="py-2 bg-background-light border border-border-subtler rounded-sm">
                  <span className="block text-sm font-black">
                    {(myCodeImpact?.linesChanged || 0).toLocaleString()}
                  </span>
                  <span className="text-[5px] text-text-subtle uppercase">
                    Lines Changed
                  </span>
                  <span
                    className={`block text-[5px] font-black mt-0.5 ${
                      (myCodeImpact?.linesChangedDiff || 0) > 0
                        ? 'text-status-success'
                        : (myCodeImpact?.linesChangedDiff || 0) < 0
                          ? 'text-status-error'
                          : 'text-text-subtler'
                    }`}
                  >
                    {(myCodeImpact?.linesChangedDiff || 0) > 0
                      ? `+${myCodeImpact.linesChangedDiff}`
                      : myCodeImpact?.linesChangedDiff || 'No change'}
                  </span>
                </div>
                <div className="py-2 bg-background-light border border-border-subtler rounded-sm">
                  <span className="block text-sm font-black">
                    {(myCodeImpact?.filesChanged || 0).toLocaleString()}
                  </span>
                  <span className="text-[5px] text-text-subtle uppercase">
                    Files Changed
                  </span>
                  <span
                    className={`block text-[5px] font-black mt-0.5 ${
                      (myCodeImpact?.filesChangedDiff || 0) > 0
                        ? 'text-status-success'
                        : (myCodeImpact?.filesChangedDiff || 0) < 0
                          ? 'text-status-error'
                          : 'text-text-subtler'
                    }`}
                  >
                    {(myCodeImpact?.filesChangedDiff || 0) > 0
                      ? `+${myCodeImpact.filesChangedDiff}`
                      : myCodeImpact?.filesChangedDiff || 'No change'}
                  </span>
                </div>
                <div className="py-2 bg-background-light border border-border-subtler rounded-sm">
                  <span className="block text-sm font-black">
                    {(myCodeImpact?.prsMerged || 0).toLocaleString()}
                  </span>
                  <span className="text-[5px] text-text-subtle uppercase">
                    PRs Merged
                  </span>
                  <span
                    className={`block text-[5px] font-black mt-0.5 ${
                      (myCodeImpact?.prsMergedDiff || 0) > 0
                        ? 'text-status-success'
                        : (myCodeImpact?.prsMergedDiff || 0) < 0
                          ? 'text-status-error'
                          : 'text-text-subtler'
                    }`}
                  >
                    {(myCodeImpact?.prsMergedDiff || 0) > 0
                      ? `+${myCodeImpact.prsMergedDiff}`
                      : myCodeImpact?.prsMergedDiff || 'No change'}
                  </span>
                </div>
              </div>

              {/* Top files changed */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[8px] font-black uppercase tracking-wider text-text-subtle mb-1">
                  Top Files Changed
                </span>
                {filesChangedList && filesChangedList.length > 0 ? (
                  filesChangedList.slice(0, 5).map((file, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[9px] font-bold text-text-subtle">
                        <span className="truncate max-w-[80%] font-mono leading-none">
                          {file.name || file.filename}
                        </span>
                        <span className="text-status-success leading-none">
                          +{file.count || file.additions || 100}
                        </span>
                      </div>
                      <div className="w-full bg-border-subtler h-1 rounded-sm overflow-hidden">
                        <div
                          className="bg-status-success h-full transition-all"
                          style={{
                            width: `${((file.count || file.additions || 100) / (filesChangedList[0]?.count || filesChangedList[0]?.additions || 400)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-[8px] text-text-subtler uppercase font-black tracking-widest italic border border-dashed border-border-subtle rounded-sm">
                    No files modified
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 2 (Middle) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Sprint Progress & Burndown */}
            <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col rounded-sm">
              <div className="flex justify-between items-center mb-4 border-b border-border-subtler pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
                  Sprint Progress
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-text-subtle">
                  View Sprint
                </span>
              </div>

              <div className="flex justify-between items-baseline mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-text">
                    {sprintProgress || 0}%
                  </span>
                  <span className="text-[8px] font-bold text-text-subtle uppercase">
                    Completed
                  </span>
                </div>
                <span className="text-[8px] text-text-subtle font-bold uppercase">
                  {sprintDaysLeft || 0} days left • {sprintName || 'Sprint end'}
                </span>
              </div>

              <div className="w-full bg-border-subtler h-1.5 rounded-sm overflow-hidden mb-4">
                <div
                  className="bg-primary h-full transition-all"
                  style={{ width: `${sprintProgress || 0}%` }}
                />
              </div>

              {/* Burndown Chart */}
              <div className="w-full h-48 mt-2">
                <div className="flex items-center justify-end gap-3 text-[8px] font-bold text-text-subtle uppercase mb-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-text-subtler border-dashed" />
                    <span>Ideal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-[#8B5CF6]" />
                    <span>Remaining</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-status-success" />
                    <span>Completed</span>
                  </div>
                </div>
                {burndownData && burndownData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={burndownData}
                      margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border-subtler)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="var(--color-text-subtle)"
                        tick={{ fontSize: 7 }}
                      />
                      <YAxis
                        stroke="var(--color-text-subtle)"
                        tick={{ fontSize: 7 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-background-elevated)',
                          border: '1px solid var(--color-border-subtle)',
                          fontSize: '9px',
                          color: 'var(--color-text)',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="ideal"
                        stroke="var(--color-text-subtler)"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="remaining"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="var(--color-status-success)"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[150px] text-[8px] text-text-subtler uppercase tracking-widest italic border border-dashed border-border-subtle rounded-sm">
                    No burndown data logged for active sprint
                  </div>
                )}
              </div>
            </div>

            {/* Pull Requests list */}
            <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col rounded-sm">
              <div className="flex justify-between items-center mb-4 border-b border-border-subtler pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
                  Pull Requests
                </span>
                <button
                  onClick={() => setActiveTab('Pull Requests')}
                  className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
                >
                  View All
                </button>
              </div>

              {/* Internal tabs selector */}
              <div className="flex border-b border-border-subtler gap-4 mb-3 text-[10px] font-bold">
                {['Open', 'In Review', 'Merged'].map((pTab) => {
                  const count =
                    pTab === 'Open'
                      ? pullRequestMetrics?.open || 0
                      : pTab === 'In Review'
                        ? pullRequestMetrics?.review || 0
                        : pullRequestMetrics?.merged || 0;
                  return (
                    <button
                      key={pTab}
                      onClick={() => setInternalPRTab(pTab)}
                      className={`pb-2 uppercase tracking-wide relative cursor-pointer border-none bg-transparent ${
                        internalPRTab === pTab
                          ? 'text-primary font-black'
                          : 'text-text-subtle'
                      }`}
                    >
                      {pTab} ({count})
                      {internalPRTab === pTab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2">
                {currentPRsList() && currentPRsList().length > 0 ? (
                  currentPRsList().map((pr, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-background-light hover:bg-background-light/80 border border-border-subtler flex justify-between items-center rounded-sm"
                    >
                      <div className="flex flex-col gap-0.5 leading-snug">
                        <span className="text-[10px] font-bold text-text">
                          {pr.title}
                        </span>
                        <span className="text-[8px] text-text-subtle font-semibold flex items-center gap-1.5">
                          <span className="font-mono text-primary">
                            {pr.number}
                          </span>
                          {pr.comments > 0 && (
                            <span className="flex items-center gap-0.5 text-text-subtler">
                              <MessageSquare size={8} /> {pr.comments} comments
                            </span>
                          )}
                        </span>
                      </div>
                      <span
                        className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${
                          pr.status === 'Merged'
                            ? 'border-status-success/20 text-status-success bg-status-success/5'
                            : pr.status === 'In Review'
                              ? 'border-status-warning/20 text-status-warning bg-status-warning/5'
                              : pr.status === 'Changes Requested'
                                ? 'border-status-error/20 text-status-error bg-status-error/5'
                                : 'border-primary/20 text-primary bg-primary/5'
                        }`}
                      >
                        {pr.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-[8px] text-text-subtler uppercase font-black tracking-widest italic border border-dashed border-border-subtle rounded-sm">
                    No pull requests found
                  </div>
                )}
              </div>
            </div>

            {/* Deployments status logs */}
            <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col rounded-sm">
              <div className="flex justify-between items-center mb-4 border-b border-border-subtler pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
                  Deployments
                </span>
                <button
                  onClick={() => setActiveTab('Deployments')}
                  className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {deploymentsList && deploymentsList.length > 0 ? (
                  deploymentsList.map((dep, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-background-light hover:bg-background-light/80 border border-border-subtler flex justify-between items-center rounded-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-0.5 leading-snug">
                          <span className="text-[10px] font-black text-text">
                            {dep.environment}
                          </span>
                          <span className="text-[8px] text-text-subtle">
                            {dep.version} • {dep.time}
                          </span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            dep.status === 'Healthy' || dep.status === 'Success'
                              ? 'bg-status-success animate-pulse-node'
                              : 'bg-primary'
                          }`}
                        />
                        <span className="text-[8px] font-black text-text-subtle uppercase">
                          {dep.status}
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-[8px] text-text-subtler uppercase font-black tracking-widest italic border border-dashed border-border-subtle rounded-sm">
                    No deployments found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3 (Right) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Recent Activity */}
            <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col rounded-sm">
              <div className="flex justify-between items-center mb-4 border-b border-border-subtler pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
                  Recent Activity
                </span>
                <button
                  onClick={() => setActiveTab('Code')}
                  className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-3 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-border-subtler">
                {activityList && activityList.length > 0 ? (
                  activityList.slice(0, 5).map((act, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 text-[10px] items-start relative pl-1.5"
                    >
                      <div className="mt-1 relative flex items-center justify-center shrink-0">
                        <div
                          className={`w-2 h-2 rounded-full border border-background-elevated ${
                            act.type === 'deploy'
                              ? 'bg-status-success'
                              : act.type === 'pr_merge'
                                ? 'bg-primary'
                                : act.type === 'pr_open'
                                  ? 'bg-status-info'
                                  : act.type === 'build_fail'
                                    ? 'bg-status-error'
                                    : 'bg-text-subtler'
                          }`}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 leading-tight">
                        <span className="text-text font-bold">{act.title}</span>
                        <span className="text-text-subtle text-[8.5px]">
                          {act.desc}
                        </span>
                      </div>
                      <span className="ml-auto text-[8px] text-text-subtler font-black uppercase whitespace-nowrap">
                        {act.time}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-[8px] text-text-subtler uppercase font-black tracking-widest italic border border-dashed border-border-subtle rounded-sm">
                    No recent activity logged
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights For You */}
            <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col rounded-sm">
              <div className="flex justify-between items-center mb-4 border-b border-border-subtler pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
                  AI Insights For You
                </span>
                <button
                  onClick={() => setActiveTab('Insights')}
                  className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {insightsList && insightsList.length > 0 ? (
                  insightsList.slice(0, 3).map((ins, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-background-light hover:bg-background-light/80 border border-border-subtler rounded-sm flex items-start gap-2.5 hover:border-border-subtle/50 transition-colors"
                    >
                      <div
                        className={`p-1.5 rounded-sm border shrink-0 ${
                          idx === 0
                            ? 'border-status-success/20 text-status-success bg-status-success/5'
                            : idx === 1
                              ? 'border-purple/20 text-purple bg-purple/5'
                              : 'border-status-warning/20 text-status-warning bg-status-warning/5'
                        }`}
                      >
                        <Lightbulb size={12} />
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5 leading-snug">
                        <span className="text-[10px] font-black text-text">
                          {ins.title}
                        </span>
                        <p className="text-[8.5px] text-text-subtle leading-tight">
                          {ins.text}
                        </p>
                        <span className="text-[7.5px] text-text-subtler mt-1 font-bold">
                          {ins.val}
                        </span>
                      </div>
                      <button className="px-2 py-1 bg-border-subtler border border-border-subtle rounded-sm text-[8px] text-text font-black hover:bg-border-subtle hover:text-primary transition-all">
                        View
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-[8px] text-text-subtler uppercase font-black tracking-widest italic border border-dashed border-border-subtle rounded-sm">
                    No AI insights generated
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-background-elevated border border-border-subtle p-4 flex flex-col rounded-sm">
              <div className="flex justify-between items-center mb-4 border-b border-border-subtler pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
                  Upcoming Deadlines
                </span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-text-subtle">
                  View All
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {deadlinesList && deadlinesList.length > 0 ? (
                  deadlinesList.map((dl, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-background-light hover:bg-background-light/80 border border-border-subtler flex justify-between items-center rounded-sm"
                    >
                      <div className="flex flex-col gap-0.5 leading-snug">
                        <span className="text-[10px] font-bold text-text">
                          {dl.title}
                        </span>
                        <span className="text-[8px] text-text-subtle">
                          {dl.date}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider ${dl.color}`}
                      >
                        {dl.daysLeft} days left
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-[8px] text-text-subtler uppercase font-black tracking-widest italic border border-dashed border-border-subtle rounded-sm">
                    No upcoming deadlines
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Footer Stats */}
        <div className="flex flex-wrap justify-between items-center text-[8px] text-text-subtler font-black uppercase tracking-[0.2em] pt-4 border-t border-border-subtler">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse-node" />
            <span>Last updated: Just now</span>
          </div>
          <div>Auto-refresh: On</div>
          <div>Data as of: {new Date().toLocaleString()}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      {/* Dynamic Navigation Tabs Header */}
      <div className="flex border-b border-border-subtle overflow-x-auto scrollbar-none gap-8 mb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all active:scale-[0.98] cursor-pointer border-none bg-transparent whitespace-nowrap ${
              activeTab === tab
                ? 'text-primary'
                : 'text-text-subtle hover:text-text'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* Main Tab Panel Routing Router */}
      <div className="flex-1">
        {activeTab === 'Overview' && renderOverview()}

        {activeTab === 'My Work' && (
          <ErrorBoundary>
            <MyWorkTab
              filteredMyTasks={myTasks}
              handleUpdateStatus={handleUpdateStatus}
              handleToggleBlock={handleToggleBlock}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'Code' && (
          <ErrorBoundary>
            <CodeTab myVelocity={myVelocity} myCodeImpact={myCodeImpact} />
          </ErrorBoundary>
        )}

        {activeTab === 'Pull Requests' && (
          <ErrorBoundary>
            <PRsTab
              pullRequestMetrics={pullRequestMetrics}
              pullRequestsList={pullRequestsList}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'Quality' && (
          <ErrorBoundary>
            <QualityTab codeQuality={codeQuality} />
          </ErrorBoundary>
        )}

        {activeTab === 'Deployments' && (
          <ErrorBoundary>
            <DeploymentsTab deployments={deployments} />
          </ErrorBoundary>
        )}

        {activeTab === 'Insights' && (
          <ErrorBoundary>
            <InsightsTab aiInsights={aiInsights} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default SEDashboard;

import React from 'react';
import {
  Activity,
  Clock,
  AlertCircle,
  Package,
  ShieldCheck,
  Target,
  Bug,
  Shield,
  BarChart3,
  GitPullRequest,
  GitBranch,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

const TLOverviewTab = ({
  sprintProgress = 0,
  storiesCompleted = { completed: 0, total: 0 },
  cycleTime = { value: 0, unit: 'days' },
  deploymentFrequency = { value: 0, unit: 'week' },
  changeFailureRate = { value: 0 },
  codeHealthScore = 0,
  workItemsStatus = {
    done: 0,
    inProgress: 0,
    inReview: 0,
    blocked: 0,
    total: 0,
  },
  burndownData = [],
  topPriorities = [],
  teamVelocity = [],
  codeHealthOverview = { coverage: 0, eslint: 0, security: 0, debtDays: 0 },
  pullRequestMetrics = {
    prCycleTime: '0h',
    prsMerged: 0,
    prsOpen: 0,
    reviewTime: '0h',
    prCycleTimeHistory: [],
    prsMergedHistory: [],
    prReviewTimeHistory: [],
  },
  recentActivity = [],
  crossTeamDependencies = [],
  teamWorkload = [],
  aiInsights = [],
  upcomingDeadlines = [],
  comparisons = null,
  prComparisons = null,
  sparklineDone = [],
  sparklineCycle = [],
  sparklineFreq = [],
  sparklineFailure = [],
  workItemsChartData = [],
  setActiveTab,
}) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Row 1: Six Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Sprint Progress */}
        <div className="bg-white/[0.02] border border-white/5 p-3.5 flex flex-col justify-between group hover:border-white/10 transition-all rounded-none min-h-[96px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Sprint Progress
            </span>
            <span className="text-[#10B981]">
              <Activity size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <span className="text-2xl font-black tracking-tight">
                {sprintProgress}%
              </span>
              {comparisons?.sprintProgress ? (
                <div
                  className={`text-[8px] font-black mt-1 flex items-center gap-0.5 ${
                    comparisons.sprintProgress.direction === 'up'
                      ? 'text-[#10B981]'
                      : 'text-[#EF4444]'
                  }`}
                >
                  <span>
                    {comparisons.sprintProgress.direction === 'up' ? '↑' : '↓'}{' '}
                    {Math.abs(comparisons.sprintProgress.diff)}%
                  </span>
                  <span className="text-gray-400 font-bold uppercase tracking-wider">
                    vs last sprint
                  </span>
                </div>
              ) : (
                <div className="text-[8px] text-gray-500 font-bold mt-1 uppercase tracking-wider">
                  No comparison data
                </div>
              )}
            </div>
          </div>
          {/* Horizontal Progress Bar */}
          <div className="w-full bg-white/5 h-1.5 rounded-none mt-2.5 overflow-hidden">
            <div
              className="bg-[#10B981] h-full"
              style={{ width: `${sprintProgress}%` }}
            />
          </div>
        </div>

        {/* Card 2: Stories Completed */}
        <div className="bg-white/[0.02] border border-white/5 p-3.5 flex flex-col justify-between group hover:border-white/10 transition-all rounded-none min-h-[96px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Stories Completed
            </span>
            <span className="text-blue-400">
              <ShieldCheck size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <span className="text-2xl font-black tracking-tight">
                {storiesCompleted.completed}{' '}
                <span className="text-gray-400 text-sm font-normal">
                  / {storiesCompleted.total}
                </span>
              </span>
              {comparisons?.storiesCompleted ? (
                <div
                  className={`text-[8px] font-black mt-1 flex items-center gap-0.5 ${
                    comparisons.storiesCompleted.direction === 'up'
                      ? 'text-[#10B981]'
                      : 'text-[#EF4444]'
                  }`}
                >
                  <span>
                    {comparisons.storiesCompleted.direction === 'up'
                      ? '↑'
                      : '↓'}{' '}
                    {Math.abs(comparisons.storiesCompleted.diff)}
                  </span>
                  <span className="text-gray-400 font-bold uppercase tracking-wider">
                    vs last sprint
                  </span>
                </div>
              ) : (
                <div className="text-[8px] text-gray-500 font-bold mt-1 uppercase tracking-wider">
                  No comparison data
                </div>
              )}
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={sparklineDone}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#3B82F6"
                  fill="rgba(59, 130, 246, 0.1)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </div>
          </div>
        </div>

        {/* Card 3: Avg. Cycle Time */}
        <div className="bg-white/[0.02] border border-white/5 p-3.5 flex flex-col justify-between group hover:border-white/10 transition-all rounded-none min-h-[96px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Avg. Cycle Time
            </span>
            <span className="text-purple-400">
              <Clock size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <span className="text-2xl font-black tracking-tight">
                {cycleTime.value}{' '}
                <span className="text-gray-400 text-xs font-normal">days</span>
              </span>
              {comparisons?.cycleTime ? (
                <div
                  className={`text-[8px] font-black mt-1 flex items-center gap-0.5 ${
                    comparisons.cycleTime.direction === 'down'
                      ? 'text-[#10B981]'
                      : 'text-[#EF4444]'
                  }`}
                >
                  <span>
                    {comparisons.cycleTime.direction === 'down' ? '↓' : '↑'}{' '}
                    {Math.abs(comparisons.cycleTime.diff)} days
                  </span>
                  <span className="text-gray-400 font-bold uppercase tracking-wider">
                    vs last sprint
                  </span>
                </div>
              ) : (
                <div className="text-[8px] text-gray-500 font-bold mt-1 uppercase tracking-wider">
                  No comparison data
                </div>
              )}
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={sparklineCycle}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#EC4899"
                  fill="rgba(236, 72, 153, 0.1)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </div>
          </div>
        </div>

        {/* Card 4: Deployment Frequency */}
        <div className="bg-white/[0.02] border border-white/5 p-3.5 flex flex-col justify-between group hover:border-white/10 transition-all rounded-none min-h-[96px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Deployment Freq
            </span>
            <span className="text-[#10B981]">
              <Package size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <span className="text-2xl font-black tracking-tight">
                {deploymentFrequency.value}{' '}
                <span className="text-gray-400 text-xs font-normal">
                  / {deploymentFrequency.unit}
                </span>
              </span>
              {comparisons?.deployCount ? (
                <div
                  className={`text-[8px] font-black mt-1 flex items-center gap-0.5 ${
                    comparisons.deployCount.direction === 'up'
                      ? 'text-[#10B981]'
                      : 'text-[#EF4444]'
                  }`}
                >
                  <span>
                    {comparisons.deployCount.direction === 'up' ? '↑' : '↓'}{' '}
                    {Math.abs(comparisons.deployCount.diff)}
                  </span>
                  <span className="text-gray-400 font-bold uppercase tracking-wider">
                    vs last sprint
                  </span>
                </div>
              ) : (
                <div className="text-[8px] text-gray-500 font-bold mt-1 uppercase tracking-wider">
                  No comparison data
                </div>
              )}
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={sparklineFreq}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#10B981"
                  fill="rgba(16, 185, 129, 0.1)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </div>
          </div>
        </div>

        {/* Card 5: Change Failure Rate */}
        <div className="bg-white/[0.02] border border-white/5 p-3.5 flex flex-col justify-between group hover:border-white/10 transition-all rounded-none min-h-[96px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Change Failure Rate
            </span>
            <span className="text-yellow-500">
              <AlertCircle size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <span className="text-2xl font-black tracking-tight">
                {changeFailureRate.value}%
              </span>
              {comparisons?.failureRate ? (
                <div
                  className={`text-[8px] font-black mt-1 flex items-center gap-0.5 ${
                    comparisons.failureRate.direction === 'down'
                      ? 'text-[#10B981]'
                      : 'text-[#EF4444]'
                  }`}
                >
                  <span>
                    {comparisons.failureRate.direction === 'down' ? '↓' : '↑'}{' '}
                    {Math.abs(comparisons.failureRate.diff)}%
                  </span>
                  <span className="text-gray-400 font-bold uppercase tracking-wider">
                    vs last sprint
                  </span>
                </div>
              ) : (
                <div className="text-[8px] text-gray-500 font-bold mt-1 uppercase tracking-wider">
                  No comparison data
                </div>
              )}
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={sparklineFailure}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#F59E0B"
                  fill="rgba(245, 158, 11, 0.1)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </div>
          </div>
        </div>

        {/* Card 6: Code Health Score */}
        <div className="bg-white/[0.02] border border-white/5 p-3.5 flex flex-col justify-between group hover:border-white/10 transition-all rounded-none min-h-[96px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              Code Health Score
            </span>
            <span className="text-[#8B5CF6]">
              <Shield size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <span className="text-2xl font-black tracking-tight">
                {codeHealthScore}{' '}
                <span className="text-gray-400 text-sm font-normal">/ 100</span>
              </span>
              {comparisons?.codeHealth ? (
                <div
                  className={`text-[8px] font-black mt-1 flex items-center gap-0.5 ${
                    comparisons.codeHealth.direction === 'up'
                      ? 'text-[#10B981]'
                      : 'text-[#EF4444]'
                  }`}
                >
                  <span>
                    {comparisons.codeHealth.direction === 'up' ? '↑' : '↓'}{' '}
                    {Math.abs(comparisons.codeHealth.diff)} pts
                  </span>
                  <span className="text-gray-400 font-bold uppercase tracking-wider">
                    vs last sprint
                  </span>
                </div>
              ) : (
                <div className="text-[8px] text-gray-500 font-bold mt-1 uppercase tracking-wider">
                  No comparison data
                </div>
              )}
            </div>

            {/* Circular Gauge Chart */}
            <div className="w-10 h-10 relative flex items-center justify-center">
              <PieChart width={40} height={40}>
                <Pie
                  data={[
                    { value: codeHealthScore },
                    { value: 100 - codeHealthScore },
                  ]}
                  dataKey="value"
                  innerRadius={13}
                  outerRadius={18}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#10B981" />
                  <Cell fill="rgba(255,255,255,0.05)" />
                </Pie>
              </PieChart>
              <span className="absolute text-[8px] font-bold text-white leading-none">
                {codeHealthScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Work Items status, Sprint Burndown, Top Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel 1: Work Items Status */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Work Items by Status
            </span>
            <div className="flex items-center justify-center h-44 mt-4 relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={workItemsChartData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={2}
                  >
                    {workItemsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center leading-none">
                <span className="text-2xl font-black text-white">
                  {workItemsStatus.total}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-gray-400 mt-1 font-bold">
                  Total
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[9px] font-black uppercase mt-4">
            {workItemsChartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-400">{item.name}</span>
                <span className="ml-auto text-white">
                  {item.value} (
                  {workItemsStatus.total > 0
                    ? Math.round((item.value / workItemsStatus.total) * 100)
                    : 0}
                  %)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Sprint Burndown */}
        <div className="lg:col-span-6 bg-white/[0.02] border border-white/5 p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Sprint Burndown
            </span>
            <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <span className="w-2 h-0.5 bg-gray-400 border-dashed" />
                <span className="text-gray-400">Ideal</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-[#8B5CF6]" />
                <span className="text-white">Remaining</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-[#10B981]" />
                <span className="text-white">Completed</span>
              </div>
            </div>
          </div>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart
                data={burndownData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.03)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fontSize: 8 }}
                />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131622',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '10px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ideal"
                  stroke="rgba(255,255,255,0.25)"
                  strokeDasharray="4 4"
                  strokeWidth={1}
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
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 3: Top Priorities */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Top Priorities
            </span>
            <button
              onClick={() => setActiveTab('delivery')}
              className="text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
            >
              View All
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {topPriorities?.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex flex-col gap-1.5 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#8B5CF6] text-[8px] font-bold uppercase tracking-wider">
                      {item.code}
                    </span>
                    <span className="text-[8px] text-gray-400">•</span>
                    <span className="text-[8px] text-gray-400 lowercase tracking-wide font-black">
                      {item.tasksCount} tasks
                    </span>
                  </div>
                  <span
                    className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 leading-none ${
                      item.severity === 'High'
                        ? 'border border-red-500/20 text-[#EF4444] bg-red-500/5'
                        : item.severity === 'Medium'
                          ? 'border border-yellow-500/20 text-[#F59E0B] bg-yellow-500/5'
                          : 'border border-green-500/20 text-[#10B981] bg-green-500/5'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-white truncate lowercase tracking-wide first-letter:uppercase leading-none">
                  {item.title}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 bg-white/5 h-1 rounded-none overflow-hidden">
                    <div
                      className="bg-[#8B5CF6] h-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-bold text-gray-400 tabular-nums">
                    {item.progress}%
                  </span>
                </div>
              </div>
            ))}
            {(!topPriorities || topPriorities.length === 0) && (
              <div className="py-12 text-center text-[9px] text-white/10 uppercase tracking-widest italic font-bold">
                No active priorities
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Team Velocity, Code Health Overview, PR Metrics, Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Panel 1: Team Velocity */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Team Velocity
            </span>
            <span className="text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer">
              View Trends
            </span>
          </div>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={teamVelocity}
                margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.03)"
                  vertical={false}
                />
                <XAxis
                  dataKey="sprint"
                  stroke="rgba(255,255,255,0.2)"
                  tick={{ fontSize: 7 }}
                />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 7 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131622',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '9px',
                  }}
                />
                <Bar
                  dataKey="completed"
                  fill="#10B981"
                  radius={0}
                  maxBarSize={15}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 2: Code Health Overview */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Code Health Overview
            </span>
            <button
              onClick={() => setActiveTab('quality')}
              className="text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
            >
              View Details
            </button>
          </div>
          <div className="flex flex-col gap-1 mt-1 justify-center flex-1">
            <div className="flex items-center justify-between p-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Target size={13} className="text-[#10B981]" />
                <span className="text-[10px] font-bold text-gray-300">
                  Code Coverage
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-white">
                  {codeHealthOverview.coverage}%
                </span>
                {comparisons?.coverage ? (
                  <span
                    className={`text-[8px] font-black ${comparisons.coverage.direction === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
                  >
                    {comparisons.coverage.direction === 'up' ? '↑' : '↓'}{' '}
                    {Math.abs(comparisons.coverage.diff)}%
                  </span>
                ) : (
                  <span className="text-[8px] text-gray-500 font-bold">--</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between p-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bug size={13} className="text-yellow-500" />
                <span className="text-[10px] font-bold text-gray-300">
                  ESLint Issues
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-white">
                  {codeHealthOverview.eslint}
                </span>
                {comparisons?.eslint ? (
                  <span
                    className={`text-[8px] font-black ${comparisons.eslint.direction === 'down' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
                  >
                    {comparisons.eslint.direction === 'down' ? '↓' : '↑'}{' '}
                    {Math.abs(comparisons.eslint.diff)}
                  </span>
                ) : (
                  <span className="text-[8px] text-gray-500 font-bold">--</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between p-2.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Shield size={13} className="text-[#EF4444]" />
                <span className="text-[10px] font-bold text-gray-300">
                  Security Issues
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-white">
                  {codeHealthOverview.security}
                </span>
                {comparisons?.security ? (
                  <span
                    className={`text-[8px] font-black ${comparisons.security.direction === 'down' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
                  >
                    {comparisons.security.direction === 'down' ? '↓' : '↑'}{' '}
                    {Math.abs(comparisons.security.diff)}
                  </span>
                ) : (
                  <span className="text-[8px] text-gray-500 font-bold">--</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between p-2.5">
              <div className="flex items-center gap-2">
                <BarChart3 size={13} className="text-[#8B5CF6]" />
                <span className="text-[10px] font-bold text-gray-300">
                  Technical Debt
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-white">
                  {codeHealthOverview.debtDays} days
                </span>
                {comparisons?.debtDays ? (
                  <span
                    className={`text-[8px] font-black ${comparisons.debtDays.direction === 'down' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
                  >
                    {comparisons.debtDays.direction === 'down' ? '↓' : '↑'}{' '}
                    {Math.abs(comparisons.debtDays.diff)}
                  </span>
                ) : (
                  <span className="text-[8px] text-gray-500 font-bold">--</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Pull Request Metrics */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Pull Request Metrics
            </span>
            <button
              onClick={() => setActiveTab('code')}
              className="text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
            >
              View All
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-1 justify-center flex-1">
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <div>
                <span className="text-[8px] uppercase font-bold text-gray-400 block">
                  Median PR Cycle Time
                </span>
                <span className="text-[13px] font-black text-white mt-0.5 block">
                  {pullRequestMetrics.prCycleTime}
                </span>
              </div>
              <div className="text-right">
                {prComparisons?.cycleTime ? (
                  <span
                    className={`text-[8px] font-black block ${prComparisons.cycleTime.direction === 'down' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
                  >
                    {prComparisons.cycleTime.direction === 'down' ? '↓' : '↑'}{' '}
                    {Math.abs(prComparisons.cycleTime.diff)}h
                  </span>
                ) : (
                  <span className="text-[8px] text-gray-500 font-bold block">
                    --
                  </span>
                )}
                <div className="w-12 h-4 opacity-50 mt-1">
                  <AreaChart
                    width={48}
                    height={16}
                    data={pullRequestMetrics.prCycleTimeHistory || []}
                  >
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke="#8B5CF6"
                      fill="rgba(139, 92, 246, 0.1)"
                      strokeWidth={1}
                      dot={false}
                    />
                  </AreaChart>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <div>
                <span className="text-[8px] uppercase font-bold text-gray-400 block">
                  PRs Merged
                </span>
                <span className="text-[13px] font-black text-white mt-0.5 block">
                  {pullRequestMetrics.prsMerged}
                </span>
              </div>
              <div className="text-right">
                {prComparisons?.mergedCount ? (
                  <span
                    className={`text-[8px] font-black block ${prComparisons.mergedCount.direction === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
                  >
                    {prComparisons.mergedCount.direction === 'up' ? '↑' : '↓'}{' '}
                    {Math.abs(prComparisons.mergedCount.diff)}
                  </span>
                ) : (
                  <span className="text-[8px] text-gray-500 font-bold block">
                    --
                  </span>
                )}
                <div className="w-12 h-4 opacity-50 mt-1">
                  <AreaChart
                    width={48}
                    height={16}
                    data={pullRequestMetrics.prsMergedHistory || []}
                  >
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke="#10B981"
                      fill="rgba(16, 185, 129, 0.1)"
                      strokeWidth={1}
                      dot={false}
                    />
                  </AreaChart>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-[8px] uppercase font-bold text-gray-400 block">
                  Review Time (Avg.)
                </span>
                <span className="text-[13px] font-black text-white mt-0.5 block">
                  {pullRequestMetrics.reviewTime}
                </span>
              </div>
              <div className="text-right">
                {prComparisons?.reviewTime ? (
                  <span
                    className={`text-[8px] font-black block ${prComparisons.reviewTime.direction === 'down' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
                  >
                    {prComparisons.reviewTime.direction === 'down' ? '↓' : '↑'}{' '}
                    {Math.abs(prComparisons.reviewTime.diff)}h
                  </span>
                ) : (
                  <span className="text-[8px] text-gray-500 font-bold block">
                    --
                  </span>
                )}
                <div className="w-12 h-4 opacity-50 mt-1">
                  <AreaChart
                    width={48}
                    height={16}
                    data={pullRequestMetrics.prReviewTimeHistory || []}
                  >
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke="#3B82F6"
                      fill="rgba(59, 130, 246, 0.1)"
                      strokeWidth={1}
                      dot={false}
                    />
                  </AreaChart>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 4: Recent Activity */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Recent Activity
            </span>
            <button
              onClick={() => setActiveTab('code')}
              className="text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
            >
              View All
            </button>
          </div>
          <div className="flex flex-col gap-2.5 overflow-hidden flex-1 justify-center">
            {recentActivity?.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-[9px]">
                <div className="mt-0.5">
                  {activity.type === 'pr_merge' && (
                    <GitPullRequest size={11} className="text-[#10B981]" />
                  )}
                  {activity.type === 'deploy' && (
                    <Package size={11} className="text-blue-400" />
                  )}
                  {activity.type === 'pr_open' && (
                    <GitBranch size={11} className="text-[#8B5CF6]" />
                  )}
                  {activity.type === 'build_fail' && (
                    <XCircle size={11} className="text-[#EF4444]" />
                  )}
                  {activity.type === 'commit' && (
                    <Activity size={11} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold truncate tracking-wide">
                      {activity.title}
                    </span>
                    <span className="text-gray-500 font-bold text-[8px] tracking-normal">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-gray-400 lowercase tracking-wide font-medium mt-0.5 truncate">
                    {activity.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Dependencies, Team Workload, AI Insights, Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel 1: Cross-team Dependencies */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Cross-team Dependencies
            </span>
            <button
              onClick={() => setActiveTab('dependencies')}
              className="text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
            >
              View Graph
            </button>
          </div>
          <div className="flex flex-col gap-3 py-1 flex-1 justify-center">
            {crossTeamDependencies && crossTeamDependencies.length > 0 ? (
              crossTeamDependencies.map((dep, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-2 rounded-none hover:bg-white/[0.04]"
                >
                  <div className="flex flex-col gap-0.5 truncate">
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">
                      {dep.source}
                    </span>
                    <span className="text-[7px] text-gray-500 uppercase tracking-widest">
                      {dep.sourceTeam}
                    </span>
                  </div>
                  <ArrowRight size={12} className="text-gray-400" />
                  <div className="flex flex-col gap-0.5 truncate">
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">
                      {dep.target}
                    </span>
                    <span className="text-[7px] text-gray-500 uppercase tracking-widest">
                      {dep.targetTeam}
                    </span>
                  </div>
                  <span
                    className={`text-[7px] font-black px-1.5 py-0.5 uppercase tracking-wider ${
                      dep.status === 'On Track'
                        ? 'bg-green-500/10 border border-green-500/20 text-[#10B981]'
                        : dep.status === 'At Risk'
                          ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/10 border border-red-500/20 text-[#EF4444]'
                    }`}
                  >
                    {dep.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-[9px] text-white/10 uppercase tracking-widest italic font-bold">
                No cross-team dependencies
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Team Workload */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Team Workload
            </span>
            <button
              onClick={() => setActiveTab('team')}
              className="text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
            >
              View Capacity
            </button>
          </div>
          <div className="flex flex-col gap-2.5 py-1 flex-1 justify-center">
            {teamWorkload?.slice(0, 5)?.map((user, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[9px] font-black uppercase">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[7px] text-white">
                      {user.member?.[0] || ''}
                    </div>
                    <span className="text-white truncate max-w-[100px]">
                      {user.member}
                    </span>
                  </div>
                  <span
                    className={`${
                      user.status === 'Overallocated'
                        ? 'text-[#EF4444]'
                        : user.status === 'Committed'
                          ? 'text-yellow-500'
                          : 'text-[#10B981]'
                    }`}
                  >
                    {user.load}%
                  </span>
                </div>
                {/* Workload bar */}
                <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                  <div
                    className={`h-full ${
                      user.status === 'Overallocated'
                        ? 'bg-[#EF4444]'
                        : user.status === 'Committed'
                          ? 'bg-yellow-500'
                          : 'bg-[#10B981]'
                    }`}
                    style={{ width: `${user.load}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: AI Recommendations */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              AI Insights & Recommendations
            </span>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-[#8B5CF6] text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
            >
              View All
            </button>
          </div>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {aiInsights?.map((insight, idx) => (
              <div
                key={idx}
                className="bg-white/[0.01] border border-white/5 p-2 rounded-none flex items-center justify-between hover:bg-white/[0.03]"
              >
                <div className="flex flex-col gap-0.5 pr-2 truncate">
                  <span className="text-[8px] font-black uppercase text-white truncate tracking-wider leading-none">
                    {insight.title}
                  </span>
                  <span className="text-[7px] text-gray-400 font-semibold lowercase tracking-wide truncate">
                    {insight.desc}
                  </span>
                </div>
                <button
                  className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-none border leading-none ${
                    insight.action === 'Positive'
                      ? 'text-[#10B981] border-green-500/20 bg-green-500/5'
                      : insight.action === 'Review'
                        ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'
                        : 'text-[#8B5CF6] border-purple-500/20 bg-purple-500/5'
                  }`}
                >
                  {insight.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4: Upcoming Deadlines */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Upcoming Deadlines
            </span>
          </div>
          <div className="flex flex-col gap-3 py-1 flex-1 justify-center">
            {upcomingDeadlines?.map((deadline, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[9px] font-black"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-white uppercase tracking-wider">
                    {deadline.title}
                  </span>
                  <span className="text-[7px] text-gray-500 font-bold">
                    {deadline.date}
                  </span>
                </div>
                <span
                  className={`text-[8px] font-black text-right ${
                    deadline.daysLeft <= 5
                      ? 'text-[#EF4444]'
                      : deadline.daysLeft <= 8
                        ? 'text-yellow-500'
                        : 'text-[#10B981]'
                  }`}
                >
                  {deadline.daysLeft} days left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TLOverviewTab);

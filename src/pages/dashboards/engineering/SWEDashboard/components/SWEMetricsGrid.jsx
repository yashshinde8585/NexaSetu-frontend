import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

const SWEMetricsGrid = ({
  sprintProgress = 0,
  sprintDaysLeft = 0,
  workItemsStatus = {
    done: 0,
    inProgress: 0,
    inReview: 0,
    blocked: 0,
    todo: 0,
    total: 0,
  },
  pullRequestMetrics = { open: 0, review: 0, merged: 0 },
  codeHealthScore = 0,
  myVelocity = { points: 0, diff: 0, direction: 'up', sparkline: [] },
  setActiveTab,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Metric Card 1: Sprint Progress */}
      <div className="bg-[#0A0C14] border border-white/5 p-4 flex flex-col justify-between hover:border-white/10 transition-colors min-h-[96px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
            Sprint Progress
          </span>
          <button
            onClick={() => setActiveTab('My Work')}
            className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
          >
            View Sprint
          </button>
        </div>
        <div className="flex items-baseline gap-1 mt-1 leading-none">
          <span className="text-3xl font-black text-white">
            {sprintProgress}%
          </span>
          <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">
            Completed
          </span>
        </div>
        <div className="mt-3">
          <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${sprintProgress}%` }}
            />
          </div>
          <p className="text-[8px] text-white/30 font-black uppercase tracking-wider mt-2">
            {sprintDaysLeft} days left Sprint end
          </p>
        </div>
      </div>

      {/* Metric Card 2: My Work Items */}
      <div className="bg-[#0A0C14] border border-white/5 p-4 flex flex-col justify-between hover:border-white/10 transition-colors min-h-[96px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
            My Work Items
          </span>
          <button
            onClick={() => setActiveTab('My Work')}
            className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1 mt-2 text-center">
          <div>
            <span className="block text-lg font-black text-white">
              {workItemsStatus.inProgress || 0}
            </span>
            <span className="text-[6px] font-black uppercase tracking-wider text-white/20">
              In Progress
            </span>
          </div>
          <div className="border-x border-white/5">
            <span className="block text-lg font-black text-status-warning">
              {workItemsStatus.inReview || 0}
            </span>
            <span className="text-[6px] font-black uppercase tracking-wider text-white/20">
              In Review
            </span>
          </div>
          <div>
            <span className="block text-lg font-black text-status-error">
              {workItemsStatus.blocked || 0}
            </span>
            <span className="text-[6px] font-black uppercase tracking-wider text-white/20">
              Blocked
            </span>
          </div>
          <div className="border-l border-white/5">
            <span className="block text-lg font-black text-status-success">
              {workItemsStatus.done || 0}
            </span>
            <span className="text-[6px] font-black uppercase tracking-wider text-white/20">
              Done
            </span>
          </div>
        </div>
      </div>

      {/* Metric Card 3: PRs Assigned */}
      <div className="bg-[#0A0C14] border border-white/5 p-4 flex flex-col justify-between hover:border-white/10 transition-colors min-h-[96px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
            PRs Assigned
          </span>
          <button
            onClick={() => setActiveTab('Pull Requests')}
            className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
          >
            View PRs
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1 mt-2 text-center">
          <div>
            <span className="block text-lg font-black text-white">
              {pullRequestMetrics.open || 0}
            </span>
            <span className="text-[6px] font-black uppercase tracking-wider text-white/20">
              Open
            </span>
          </div>
          <div className="border-x border-white/5">
            <span className="block text-lg font-black text-status-warning">
              {pullRequestMetrics.review || 0}
            </span>
            <span className="text-[6px] font-black uppercase tracking-wider text-white/20">
              Review
            </span>
          </div>
          <div>
            <span className="block text-lg font-black text-status-success">
              {pullRequestMetrics.merged || 0}
            </span>
            <span className="text-[6px] font-black uppercase tracking-wider text-white/20">
              Merged
            </span>
          </div>
        </div>
      </div>

      {/* Metric Card 4: Code Health Score */}
      <div className="bg-[#0A0C14] border border-white/5 p-4 flex flex-col justify-between hover:border-white/10 transition-colors min-h-[96px]">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
            Code Health Score
          </span>
          <button
            onClick={() => setActiveTab('Quality')}
            className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
          >
            View Details
          </button>
        </div>
        <div className="flex items-center gap-4 mt-1">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <PieChart width={48} height={48}>
              <Pie
                data={[
                  { value: codeHealthScore, color: '#10B981' },
                  {
                    value: Math.max(0, 100 - codeHealthScore),
                    color: 'rgba(255,255,255,0.05)',
                  },
                ]}
                dataKey="value"
                innerRadius={15}
                outerRadius={21}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#10B981" />
                <Cell fill="rgba(255,255,255,0.05)" />
              </Pie>
            </PieChart>
            <span className="absolute text-[8px] font-black text-white leading-none">
              {codeHealthScore}
            </span>
          </div>
          <div className="leading-none">
            <span className="text-lg font-black text-white">
              {codeHealthScore}/100
            </span>
            <span className="block text-[8px] font-black uppercase tracking-widest text-[#10B981] mt-1">
              Great
            </span>
          </div>
        </div>
      </div>

      {/* Metric Card 5: My Velocity */}
      <div className="bg-[#0A0C14] border border-white/5 p-4 flex flex-col justify-between hover:border-white/10 transition-colors min-h-[96px]">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
            My Velocity
          </span>
          <button
            onClick={() => setActiveTab('Code')}
            className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
          >
            View Trends
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="leading-none">
            <span className="text-lg font-black text-white">
              {myVelocity.points} Points
            </span>
            <div className="flex items-center gap-0.5 text-[7px] font-black uppercase tracking-wider text-[#10B981] mt-1">
              <TrendingUp size={10} />
              <span>{myVelocity.diff}% vs last sprint</span>
            </div>
          </div>
          <div className="w-16 h-8">
            <AreaChart width={64} height={32} data={myVelocity.sparkline || []}>
              <defs>
                <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="val"
                stroke="#60A5FA"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#velocityGrad)"
                dot={false}
              />
            </AreaChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SWEMetricsGrid);

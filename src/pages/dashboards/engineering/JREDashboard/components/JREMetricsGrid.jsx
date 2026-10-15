import React from 'react';
import { TrendingUp } from 'lucide-react';

const JREMetricsGrid = ({
  sprintProgress,
  sprintDaysLeft,
  workItemsStatus,
  pullRequestMetrics,
  codeHealthScore,
  xp,
  level,
  xpToNextLevel,
  setActiveTab,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {/* Card 1: Sprint Progress */}
      <div className="bg-card border border-border-subtle rounded-none p-3 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">
              Sprint Progress
            </h4>
            <span className="text-xl leading-none font-bold text-text block mt-2 font-black">
              {sprintProgress}%
            </span>
            <span className="text-[10px] text-text-subtle font-medium">
              Completed
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-text-subtle font-medium block mt-1">
              {sprintDaysLeft} days left
            </span>
            <span className="text-[9px] text-text-subtle font-black uppercase">
              Sprint end
            </span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-border-subtle rounded-none overflow-hidden mt-2">
          <div
            className="h-full bg-status-success rounded-none"
            style={{ width: `${sprintProgress}%` }}
          />
        </div>
      </div>

      {/* Card 2: My Tasks */}
      <div className="bg-card border border-border-subtle rounded-none p-3 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">
            My Tasks
          </h4>
          <button
            onClick={() => setActiveTab('my_work')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer uppercase"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center mt-2">
          <div>
            <span className="text-xl leading-none font-black text-text">
              {workItemsStatus.inProgress}
            </span>
            <span className="text-[9px] text-text-subtle block mt-1">
              In Progress
            </span>
          </div>
          <div>
            <span className="text-xl leading-none font-black text-text">
              {workItemsStatus.inReview}
            </span>
            <span className="text-[9px] text-text-subtle block mt-1">
              In Review
            </span>
          </div>
          <div>
            <span className="text-xl leading-none font-black text-text">
              {workItemsStatus.blocked}
            </span>
            <span className="text-[9px] text-text-subtle block mt-1">
              Blocked
            </span>
          </div>
          <div>
            <span className="text-xl leading-none font-black text-text">
              {workItemsStatus.done}
            </span>
            <span className="text-[9px] text-text-subtle block mt-1">Done</span>
          </div>
        </div>
      </div>

      {/* Card 3: PRs Assigned */}
      <div className="bg-card border border-border-subtle rounded-none p-3 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">
            PRs Assigned
          </h4>
          <button
            onClick={() => setActiveTab('code')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer uppercase"
          >
            View PRs
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1 text-center mt-2">
          <div>
            <span className="text-xl leading-none font-black text-text">
              {pullRequestMetrics.open}
            </span>
            <span className="text-[9px] text-text-subtle block mt-1">Open</span>
          </div>
          <div>
            <span className="text-xl leading-none font-black text-text">
              {pullRequestMetrics.review}
            </span>
            <span className="text-[9px] text-text-subtle block mt-1">
              Review
            </span>
          </div>
          <div>
            <span className="text-xl leading-none font-black text-text">
              {pullRequestMetrics.merged}
            </span>
            <span className="text-[9px] text-text-subtle block mt-1">
              Merged
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: Code Health Score */}
      <div className="bg-card border border-border-subtle rounded-none p-3 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">
            Code Health Score
          </h4>
          <button
            onClick={() => setActiveTab('code')}
            className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer uppercase"
          >
            View Details
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="var(--color-status-success)"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 16}
                strokeDashoffset={
                  2 * Math.PI * 16 * (1 - codeHealthScore / 100)
                }
              />
            </svg>
            <span className="absolute text-[8px] font-bold text-text">
              {codeHealthScore}%
            </span>
          </div>
          <div>
            <span className="text-xl leading-none font-black text-text">
              {codeHealthScore}
              <span className="text-xs text-text-subtle">/100</span>
            </span>
            <span className="text-[9px] text-status-success font-semibold block uppercase">
              Good
            </span>
          </div>
        </div>
      </div>

      {/* Card 5: My Progress */}
      <div className="bg-card border border-border-subtle rounded-none p-3 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">
            My Progress
          </h4>
          <button className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer uppercase">
            View Progress
          </button>
        </div>
        <div className="mt-1">
          <div className="flex justify-between items-end">
            <span className="text-xl leading-none font-black text-text">
              {xp} <span className="text-xs text-text-subtle">/1000 XP</span>
            </span>
          </div>
          <div className="w-full h-1.5 bg-border-subtle rounded-none overflow-hidden mt-1.5 mb-1.5">
            <div
              className="h-full bg-status-info rounded-none"
              style={{ width: `${(xp / 1000) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] text-text-subtle font-black">
            <span className="flex items-center gap-0.5 text-status-success">
              <TrendingUp size={10} /> Level {level}
            </span>
            <span>{xpToNextLevel} XP to next level</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JREMetricsGrid;

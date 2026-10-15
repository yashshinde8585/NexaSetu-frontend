import React from 'react';
import {
  GitPullRequest,
  GitBranch,
  Package,
  XCircle,
  Activity,
} from 'lucide-react';

const TLCodeTab = ({
  pullRequestMetrics = {
    prCycleTime: '0h',
    prsMerged: 0,
    prsOpen: 0,
    reviewTime: '0h',
  },
  recentActivity = [],
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      <div className="lg:col-span-5 bg-card border border-border-subtle p-4 flex flex-col gap-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle block">
          Code Execution Indicators
        </span>
        <div className="flex flex-col gap-3 justify-center flex-1">
          <div className="flex items-center justify-between p-3 border border-border-subtle bg-card">
            <span className="text-[10px] text-text-subtle font-bold uppercase tracking-wider">
              Median PR Cycle Time
            </span>
            <span className="text-[12px] font-black text-text">
              {pullRequestMetrics.prCycleTime}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-border-subtle bg-card">
            <span className="text-[10px] text-text-subtle font-bold uppercase tracking-wider">
              PRs Merged (Today)
            </span>
            <span className="text-[12px] font-black text-status-success">
              {pullRequestMetrics.prsMerged}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-border-subtle bg-card">
            <span className="text-[10px] text-text-subtle font-bold uppercase tracking-wider">
              PRs Open
            </span>
            <span className="text-[12px] font-black text-blue-400">
              {pullRequestMetrics.prsOpen}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-border-subtle bg-card">
            <span className="text-[10px] text-text-subtle font-bold uppercase tracking-wider">
              Review Duration (Avg)
            </span>
            <span className="text-[12px] font-black text-purple-400">
              {pullRequestMetrics.reviewTime}
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-card border border-border-subtle p-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle block mb-4">
          Recent Commits & Merges
        </span>
        <div className="flex flex-col gap-3">
          {recentActivity?.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 text-[10px] p-3 border border-border-subtle bg-card"
            >
              <div className="mt-0.5">
                {activity.type === 'pr_merge' && (
                  <GitPullRequest size={12} className="text-status-success" />
                )}
                {activity.type === 'deploy' && (
                  <Package size={12} className="text-blue-400" />
                )}
                {activity.type === 'pr_open' && (
                  <GitBranch size={12} className="text-secondary" />
                )}
                {activity.type === 'build_fail' && (
                  <XCircle size={12} className="text-status-error" />
                )}
                {activity.type === 'commit' && (
                  <Activity size={12} className="text-text-subtler" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-text font-bold truncate tracking-wide">
                    {activity.title}
                  </span>
                  <span className="text-text-subtler font-bold text-[8px]">
                    {activity.time}
                  </span>
                </div>
                <p className="text-text-subtle lowercase tracking-wide font-medium mt-1 truncate">
                  {activity.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TLCodeTab;

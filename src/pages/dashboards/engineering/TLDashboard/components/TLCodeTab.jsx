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
      <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 p-4 flex flex-col gap-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
          Code Execution Indicators
        </span>
        <div className="flex flex-col gap-3 justify-center flex-1">
          <div className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.01]">
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
              Median PR Cycle Time
            </span>
            <span className="text-[12px] font-black text-white">
              {pullRequestMetrics.prCycleTime}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.01]">
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
              PRs Merged (Today)
            </span>
            <span className="text-[12px] font-black text-[#10B981]">
              {pullRequestMetrics.prsMerged}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.01]">
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
              PRs Open
            </span>
            <span className="text-[12px] font-black text-blue-400">
              {pullRequestMetrics.prsOpen}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.01]">
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
              Review Duration (Avg)
            </span>
            <span className="text-[12px] font-black text-purple-400">
              {pullRequestMetrics.reviewTime}
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 p-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">
          Recent Commits & Merges
        </span>
        <div className="flex flex-col gap-3">
          {recentActivity?.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 text-[10px] p-3 border border-white/5 bg-white/[0.01]"
            >
              <div className="mt-0.5">
                {activity.type === 'pr_merge' && (
                  <GitPullRequest size={12} className="text-[#10B981]" />
                )}
                {activity.type === 'deploy' && (
                  <Package size={12} className="text-blue-400" />
                )}
                {activity.type === 'pr_open' && (
                  <GitBranch size={12} className="text-[#8B5CF6]" />
                )}
                {activity.type === 'build_fail' && (
                  <XCircle size={12} className="text-[#EF4444]" />
                )}
                {activity.type === 'commit' && (
                  <Activity size={12} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold truncate tracking-wide">
                    {activity.title}
                  </span>
                  <span className="text-gray-500 font-bold text-[8px]">
                    {activity.time}
                  </span>
                </div>
                <p className="text-gray-400 lowercase tracking-wide font-medium mt-1 truncate">
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

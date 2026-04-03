import React from 'react';

// A sticky navigation bar component that presents real-time project analytics and completion metrics.
const ProjectAnalyticsBar = ({ analytics }) => {
  if (!analytics) return null;

  return (
    <div className="sticky top-[68px] sm:top-[72px] z-40 bg-background/80 backdrop-blur-md pb-6 pt-2 mb-4 -mx-4 px-4 border-b border-white/5 transition-all duration-300">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Completion Rate',
            value: `${analytics.completionRate}%`,
            color: 'text-primary',
          },
          {
            label: 'Avg. Cycle Time',
            value: `${analytics.avgCompletionTime}m`,
            color: 'text-status-success',
          },
          {
            label: 'Delayed Tasks',
            value: analytics.delayedTasks,
            color:
              analytics.delayedTasks > 0
                ? 'text-status-error'
                : 'text-text-muted',
          },
          {
            label: 'At Risk',
            value: analytics.atRiskTasks,
            color:
              analytics.atRiskTasks > 0
                ? 'text-status-warning'
                : 'text-text-muted',
          },
          {
            label: 'Completed',
            value: analytics.completedTasks,
            color: 'text-white',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-background-light p-4 rounded-xl border border-white/5 flex flex-col items-center"
          >
            <span className="text-[10px] uppercase font-bold text-text-muted mb-1">
              {item.label}
            </span>
            <span className={`text-2xl font-black ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectAnalyticsBar;

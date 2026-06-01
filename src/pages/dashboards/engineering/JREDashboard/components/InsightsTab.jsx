import React from 'react';

const InsightsTab = ({ aiInsights }) => {
  return (
    <div className="bg-card border border-border-subtle rounded-none p-5">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
          Tips &amp; Insights
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {aiInsights.map((insight, idx) => (
          <div
            key={idx}
            className="p-3 bg-card border border-border-subtle rounded-none flex flex-col gap-1"
          >
            <div className="flex justify-between items-center">
              <span
                className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase ${
                  insight.type === 'Positive'
                    ? 'bg-status-success/10 text-status-success border border-emerald-500/20'
                    : insight.type === 'Suggestion'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-status-warning/10 text-status-warning border border-amber-500/20'
                }`}
              >
                {insight.type}
              </span>
            </div>
            <p className="text-xs text-text-subtle leading-relaxed mt-1">
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsTab;

import React from 'react';

const TLInsightsTab = ({ aiInsights = [] }) => {
  return (
    <div className="bg-card border border-border-subtle p-4 animate-fade-in">
      <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle block mb-4">
        Strategic AI Recommendations
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiInsights?.map((insight, idx) => (
          <div
            key={idx}
            className="p-4 bg-background-elevated border border-border rounded-none flex items-center justify-between hover:bg-background-elevated transition-colors"
          >
            <div className="flex flex-col gap-1 pr-4 truncate">
              <span className="text-[11px] font-black uppercase text-text truncate tracking-wider">
                {insight.title}
              </span>
              <span className="text-[9px] text-text-subtle font-semibold lowercase tracking-wide truncate">
                {insight.desc}
              </span>
            </div>
            <button
              className={`text-[8px] font-black uppercase px-3 py-1 rounded-none border leading-none ${
                insight.action === 'Positive'
                  ? 'text-status-success border-green-500/20 bg-green-500/5'
                  : insight.action === 'Review'
                    ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'
                    : 'text-secondary border-purple-500/20 bg-purple-500/5'
              }`}
            >
              {insight.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TLInsightsTab;

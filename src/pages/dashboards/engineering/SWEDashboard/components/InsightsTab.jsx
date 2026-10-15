import React from 'react';
import { Sparkles } from 'lucide-react';

const InsightsTab = ({ aiInsights = [] }) => {
  return (
    <div className="bg-card border border-border-subtle p-6 flex flex-col gap-4 animate-in fade-in duration-300">
      <h3 className="text-sm font-black uppercase tracking-widest text-text">
        AI Assistant Insights
      </h3>
      <div className="flex flex-col gap-4">
        {aiInsights?.map((insight, idx) => (
          <div
            key={idx}
            className="p-4 bg-card border border-border-subtle flex flex-col gap-2"
          >
            <div className="flex justify-between items-center leading-none">
              <span
                className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                  insight.type === 'Action'
                    ? 'bg-status-warning/15 text-status-warning border border-status-warning/20'
                    : insight.type === 'Suggestion'
                      ? 'bg-status-info/15 text-status-info border border-status-info/20'
                      : 'bg-status-success/15 text-[#10B981] border border-status-success/20'
                }`}
              >
                {insight.type}
              </span>
              <Sparkles size={14} className="text-primary/40" />
            </div>
            <h4 className="text-xs font-bold text-text">{insight.title}</h4>
            <p className="text-[10px] text-text-subtle leading-relaxed font-medium">
              {insight.text}
            </p>
          </div>
        ))}
        {(!aiInsights || aiInsights.length === 0) && (
          <div className="text-center py-12 text-[8px] text-text-subtler uppercase font-black tracking-widest italic">
            No AI insights generated
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsTab;

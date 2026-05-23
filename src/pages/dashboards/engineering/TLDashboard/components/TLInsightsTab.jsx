import React from 'react';

const TLInsightsTab = ({ aiInsights = [] }) => {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-4 animate-fade-in">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">
        Strategic AI Recommendations
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiInsights?.map((insight, idx) => (
          <div
            key={idx}
            className="p-4 bg-white/5 border border-white/10 rounded-none flex items-center justify-between hover:bg-white/10 transition-colors"
          >
            <div className="flex flex-col gap-1 pr-4 truncate">
              <span className="text-[11px] font-black uppercase text-white truncate tracking-wider">
                {insight.title}
              </span>
              <span className="text-[9px] text-gray-400 font-semibold lowercase tracking-wide truncate">
                {insight.desc}
              </span>
            </div>
            <button
              className={`text-[8px] font-black uppercase px-3 py-1 rounded-none border leading-none ${
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
  );
};

export default TLInsightsTab;

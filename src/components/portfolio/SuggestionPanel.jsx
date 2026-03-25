import React from 'react';

const SuggestionPanel = ({ recommendations, setRecommendations }) => {
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-background-dark/40 border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 text-8xl opacity-5 pointer-events-none">🧠</div>
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2 bg-primary/20 rounded-lg text-primary text-xl">🤖</span>
        <div className="flex flex-col">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">AI Strategy Advisor</h2>
          <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Real-time Project Optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.slice(0, 6).map((rec, idx) => (
          <div key={idx} className="bg-background-light/40 border border-white/5 p-6 rounded-[2rem] hover:border-primary/20 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border ${
                  rec.priority === 'high' ? 'bg-status-error/10 text-status-error border-status-error/20' :
                  rec.priority === 'medium' ? 'bg-status-warning/10 text-status-warning border-status-warning/20' :
                  'bg-status-info/10 text-status-info border-status-info/20'
                }`}>
                  {rec.priority} Priority
                </span>
                <span className="text-xs grayscale group-hover:grayscale-0 transition-all">
                  {rec.type === 'delay' ? '⏱️' : rec.type === 'resource' ? '👥' : '📈'}
                </span>
              </div>
              <p className="text-sm font-bold text-white mb-2 leading-tight">{rec.message}</p>
              <p className="text-xs text-text-muted italic">“{rec.action}”</p>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button className="flex-1 text-[10px] font-black uppercase tracking-widest py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all border border-primary/10">
                Apply
              </button>
              <button 
                onClick={() => setRecommendations(prev => prev.filter((_, i) => i !== idx))}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-text-muted text-[10px] rounded-xl transition-all border border-white/5"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionPanel;

import React, { useState } from 'react';
import { executeMagicCommand } from '../api/magicService';

const MagicBar = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsProcessing(true);
    setResult(null);
    setShowResults(true);

    try {
      const res = await executeMagicCommand(query);
      setResult(res.data);
    } catch (error) {
      setResult({ message: 'Error processing magic command. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const closeResults = () => {
    setShowResults(false);
    setQuery('');
    setResult(null);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50 mb-10">
      <form 
        onSubmit={handleSubmit}
        className="relative group h-14"
      >
        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
        <div className="relative flex items-center h-full bg-[#1E1E2E]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 focus-within:border-primary/50 transition-all shadow-2xl">
          <span className="text-xl mr-4 group-hover:scale-110 transition-transform">✨</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI to 'Show healthy projects' or 'Reassign tasks'..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-text-muted/60 font-medium"
            disabled={isProcessing}
          />
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <button type="submit" className="text-primary hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {showResults && (
        <div className="absolute top-20 left-0 right-0 bg-[#1E1E2E] border border-white/10 rounded-3xl p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary"></span>
              AI Response
            </h4>
            <button onClick={closeResults} className="text-text-muted hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>

          {!result ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
              <div className="h-20 bg-white/5 rounded-2xl"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {(result.actions || []).map((action, actionIdx) => (
                <div key={actionIdx} className={`${actionIdx > 0 ? 'pt-4 border-t border-white/5' : ''} space-y-4`}>
                    <div className="flex items-start gap-3">
                        {result.actions.length > 1 && (
                            <span className="flex-none w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black italic">
                                {actionIdx + 1}
                            </span>
                        )}
                        <p className="text-lg font-bold text-white leading-relaxed">
                            {action.message}
                        </p>
                    </div>

                    {/* Step Specific Results */}
                    {action.results && action.results.length > 0 && (
                        <div className="ml-8 space-y-2">
                            <p className="text-[10px] font-black uppercase text-text-muted tracking-tighter">Step Results:</p>
                            <div className="max-h-40 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                {action.results.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center group/item hover:bg-white/10 transition-all">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-white/90">{item.title || item.name}</span>
                                            {item.assignedUser && (
                                                <span className="text-[10px] text-text-muted italic">Assigned: {item.assignedUser.name}</span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                            (item.status === 'done' || item.healthLabel === 'Healthy') ? 'bg-status-success/10 text-status-success border-status-success/20' : 'bg-primary/20 text-primary border-primary/20'
                                        }`}>
                                            {item.status || item.healthLabel || 'Active'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {action.intent === 'UNKNOWN' && actionIdx === (result.actions.length - 1) && (
                        <div className="pt-4 flex flex-wrap gap-2">
                            <p className="w-full text-[10px] text-text-muted uppercase font-bold mb-1">Try these instead:</p>
                            {['Show healthy projects', 'Analyze bottlenecks', 'Summarize weekly velocity'].map(p => (
                                <button 
                                    key={p} onClick={() => { setQuery(p); handleSubmit(); }}
                                    className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-text-muted hover:text-white transition-all shadow-sm"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
              ))}

              {result.actionTriggered && (
                  <div className="p-4 bg-status-success/10 border border-status-success/20 rounded-2xl text-status-success text-xs font-bold flex items-center gap-2 shadow-inner">
                      <span className="w-2 h-2 rounded-full bg-status-success animate-ping"></span>
                      ⚡ System actions staged for approval.
                  </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MagicBar;

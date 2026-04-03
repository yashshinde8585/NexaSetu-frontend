import React from 'react';
import { useMagic } from '../../context/MagicContext';
import { TASK_STATUS } from '../../constants';

// A component that displays AI-generated strategic reports and actionable recommendations.
const MagicResults = () => {
  const { magicResult, showResults, closeGlobalResults, triggerCommand } =
    useMagic();

  if (!showResults) return null;

  return (
    <div className="w-full bg-background-dark/40 border-b border-white/5 animate-in slide-in-from-top-4 duration-500 overflow-hidden">
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-10 transition-all duration-500`}
      >
        <div className="bg-[#1E1E2E]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl overflow-hidden relative group">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/[0.05]">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--color-primary),1)] animate-pulse"></span>
              Nexa Strategic Report
            </h4>
            <button
              onClick={closeGlobalResults}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-text-muted hover:text-white transition-all group-hover:rotate-90 duration-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {!magicResult ? (
            <div className="space-y-6 animate-pulse px-2">
              <div className="h-6 bg-white/5 rounded-full w-3/4"></div>
              <div className="h-32 bg-white/5 rounded-[2rem]"></div>
            </div>
          ) : (
            <div className="space-y-8 px-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-6">
              {(magicResult.actions || []).map((action, actionIdx) => (
                <div
                  key={actionIdx}
                  className={`${actionIdx > 0 ? 'pt-10 border-t border-white/5' : ''} space-y-6 relative`}
                >
                  <div className="flex items-start gap-6">
                    {magicResult.actions.length > 1 && (
                      <span className="flex-none mt-1 w-8 h-8 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black border border-primary/20 shadow-[0_0_20px_rgba(var(--color-primary),0.2)]">
                        {actionIdx + 1}
                      </span>
                    )}
                    <p className="text-[15px] sm:text-[17px] font-medium text-white/90 leading-relaxed tracking-wide">
                      {action.message}
                    </p>
                  </div>

                  {action.results && action.results.length > 0 && (
                    <div className="ml-14 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {action.results.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              triggerCommand(
                                `Analyze deeper telemetry for ${item.title || item.name}`
                              )
                            }
                            className="p-5 bg-white/[0.03] border border-white/[0.05] rounded-3xl flex justify-between items-center group/item hover:bg-white/[0.06] transition-all duration-300 hover:border-primary/30 cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-white tracking-wide flex items-center gap-2 group-hover/item:text-primary transition-colors">
                                {item.title || item.name}
                                <svg
                                  className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-all transform group-hover/item:translate-x-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                              {item.assignedUser && (
                                <span className="text-[11px] text-text-muted mt-1.5 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                                  {item.assignedUser.name}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-[10px] px-4 py-2 rounded-full border border-b-2 font-black uppercase tracking-widest ${
                                item.status === TASK_STATUS.DONE ||
                                item.healthLabel === 'Healthy'
                                  ? 'bg-status-success/10 text-status-success border-status-success/20 border-b-status-success/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                  : 'bg-primary/10 text-primary border-primary/20 border-b-primary/40'
                              }`}
                            >
                              {item.status || item.healthLabel || 'Active'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {magicResult.actionTriggered && (
                <div className="mt-10 p-6 bg-primary/5 border border-primary/10 rounded-[2rem] text-primary text-sm font-bold flex items-center gap-4 shadow-inner overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                  <span className="relative w-3 h-3 rounded-full bg-primary animate-ping shrink-0"></span>
                  <span className="relative flex-1 tracking-wide">
                    ⚡ Strategic optimization staged. Deployment pending
                    executive oversight.
                  </span>
                </div>
              )}

              {/* Proactive Strategic Recommendations */}
              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black uppercase text-text-muted/60 tracking-[4px] mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-white/10"></span>
                  AI-Driven Recommendations
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      label: 'Optimize Overall Portofolio',
                      cmd: 'Optimize project resource distribution globbaly',
                    },
                    {
                      label: 'Fix Mission Delays',
                      cmd: 'Fix all stalled project bottlenecks',
                    },
                    {
                      label: 'Audit Team Bandwidth',
                      cmd: 'Show team capacity and suggest reassignments',
                    },
                  ].map((rec, i) => (
                    <button
                      key={rec.label}
                      onClick={() => triggerCommand(rec.cmd)}
                      className="px-5 py-3 bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/30 rounded-2xl text-[11px] font-bold text-text-muted hover:text-primary transition-all duration-300 flex items-center gap-3 group/rec shadow-lg"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/rec:bg-primary transition-all"></span>
                      {rec.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MagicResults;

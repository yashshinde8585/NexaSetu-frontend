import React from 'react';
import PropTypes from 'prop-types';

// A modal component that presents an AI-generated summary and key metrics upon sprint completion.
const SprintSummaryModal = ({ finalSummary, setFinalSummary }) => {
  if (!finalSummary) return null;

  const stats = [
    {
      label: 'Velocity',
      value: finalSummary.metrics.velocity,
      color: 'text-white',
    },
    {
      label: 'Retention',
      value: finalSummary.metrics.retention.toFixed(1) + '%',
      color: 'text-status-success',
    },
    {
      label: 'Spillover',
      value: finalSummary.metrics.spillover,
      color: 'text-status-warning',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
      <div className="bg-background w-full max-w-2xl rounded-xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-primary uppercase tracking-tighter">
              Sprint Summary
            </h2>
            <p className="text-xs text-text-muted font-mono">
              {finalSummary.sprint} Overview
            </p>
          </div>
          <button
            onClick={() => setFinalSummary(null)}
            className="text-text-muted hover:text-white transition-colors text-2xl font-light"
          >
            ×
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div className="flex gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex-1 bg-white/5 p-4 rounded-lg border border-white/5 text-center"
              >
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">
                  {stat.label}
                </p>
                <p className={`text-2xl font-black ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              AI Tactical Summary
            </h3>
            <div className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-6 rounded-xl border border-white/5 font-mono italic">
              {finalSummary.summary}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Top Contributors
            </h3>
            <div className="space-y-3">
              {finalSummary.topContributors.map((c, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
                      {c.name[0]}
                    </div>
                    <span className="text-sm font-bold text-white">
                      {c.name}
                    </span>
                  </div>
                  <span className="text-xs text-primary font-mono font-bold">
                    {c.missions} Tasks Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
          <button
            onClick={() => setFinalSummary(null)}
            className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-white/5 text-text-muted rounded-lg hover:bg-white/10 transition-all border border-white/5"
          >
            Acknowledge & Archive
          </button>
        </div>
      </div>
    </div>
  );
};

SprintSummaryModal.propTypes = {
  finalSummary: PropTypes.object,
  setFinalSummary: PropTypes.func.isRequired,
};

export default SprintSummaryModal;

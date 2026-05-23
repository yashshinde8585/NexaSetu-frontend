import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from '../atoms/ErrorBoundary';

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
      value: (finalSummary.metrics.retention || 0).toFixed(1) + '%',
      color: 'text-status-success',
    },
    {
      label: 'Spillover',
      value: finalSummary.metrics.spillover,
      color: 'text-status-warning',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black animate-in fade-in slide-in-from-top-4">
      <div className="bg-black w-full max-w-2xl rounded-2xl border border-white/20 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="p-6 border-b border-white/20 bg-black flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-primary uppercase tracking-tighter">
              Sprint Summary
            </h2>
            <p className="text-[10px] uppercase font-black tracking-widest text-white/50">
              {finalSummary.sprint} Overview
            </p>
          </div>
          <button
            onClick={() => setFinalSummary(null)}
            className="text-white/40 hover:text-primary transition-colors text-3xl font-light leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div className="flex gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex-1 bg-black p-4 rounded-xl border border-white/20 text-center shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border-primary transition-all group"
              >
                <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-1 group-hover:text-white/80 transition-colors">
                  {stat.label}
                </p>
                <p className={`text-2xl font-black ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              AI Sprint Summary
            </h3>
            <div className="text-[11px] text-white/80 uppercase tracking-widest leading-loose whitespace-pre-wrap bg-black p-6 rounded-xl border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] font-black">
              {finalSummary.summary}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 mt-2">
              Top Contributors
            </h3>
            <div className="space-y-3">
              {finalSummary.topContributors.map((c, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-black rounded-xl border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border-primary transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-primary font-black text-[10px] border border-primary shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                      {c.name[0]}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-tight text-white">
                      {c.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-primary uppercase font-black tracking-widest">
                    {c.missions} Tasks Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-black border-t border-white/20 flex gap-3">
          <button
            onClick={() => setFinalSummary(null)}
            className="flex-1 py-4 text-[11px] font-black uppercase tracking-[0.3em] bg-black text-white/50 rounded-xl hover:text-white hover:border-white transition-all border border-white/20 shadow-none"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};

const SafeSprintSummaryModal = (props) => (
  <ErrorBoundary>
    <SprintSummaryModal {...props} />
  </ErrorBoundary>
);

SafeSprintSummaryModal.propTypes = {
  finalSummary: PropTypes.object,
  setFinalSummary: PropTypes.func.isRequired,
};

export default SafeSprintSummaryModal;

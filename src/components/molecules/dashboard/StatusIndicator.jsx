import React from 'react';

/**
 * StatusIndicator - Accessible status dot with ripple effect.
 * @param {('red'|'yellow'|'green')} color 
 * @param {string} label - Optional accessible label (defaults to color name)
 */
const StatusIndicator = ({ color, label }) => {
  const colors = {
    red: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
    yellow: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]',
    green: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
  };

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`w-2 h-2 rounded-full ${colors[color] || 'bg-slate-500'} relative`}
        aria-hidden="true"
      >
        <span className={`absolute inset-0 rounded-full animate-ping opacity-20 ${colors[color] || 'bg-slate-500'}`}></span>
      </div>
      {(label || color) && (
        <span className="sr-only font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Status: {label || color}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;

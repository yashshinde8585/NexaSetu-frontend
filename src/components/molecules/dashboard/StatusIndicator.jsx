import React from 'react';

/**
 * StatusIndicator - Accessible status dot with ripple effect.
 * @param {('red'|'yellow'|'green')} color 
 * @param {string} label - Optional accessible label (defaults to color name)
 */
const StatusIndicator = ({ color, label }) => {
  const colors = {
    red: 'bg-status-error shadow-[0_0_10px_rgba(239,68,68,0.4)]',
    yellow: 'bg-status-warning shadow-[0_0_10px_rgba(245,158,11,0.4)]',
    green: 'bg-status-success shadow-[0_0_10px_rgba(34,197,94,0.4)]'
  };

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`w-2 h-2 rounded-full ${colors[color] || 'bg-white/20'} relative`}
        aria-hidden="true"
      >
        <span className={`absolute inset-0 rounded-full animate-ping opacity-20 ${colors[color] || 'bg-white/20'}`}></span>
      </div>
      {(label || color) && (
        <span className="sr-only">
          Status: {label || color}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;

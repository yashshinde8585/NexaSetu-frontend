import React from 'react';

// Status dot indicator component.
const StatusIndicator = ({ color, label }) => {
  const colors = {
    red: 'bg-status-error',
    yellow: 'bg-status-warning',
    green: 'bg-status-success',
    default: 'bg-white/20',
  };

  const statusColor = colors[color] || colors.default;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-1.5 h-1.5 rounded-none ${statusColor}`}
        aria-hidden="true"
      />
      {(label || color) && (
        <span className="sr-only">Status: {label || color}</span>
      )}
    </div>
  );
};

export default StatusIndicator;

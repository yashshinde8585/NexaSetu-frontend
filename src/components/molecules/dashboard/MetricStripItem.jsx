import React from 'react';

// Dashboard metric strip item component.
const MetricStripItem = ({
  icon,
  label,
  value,
  color = 'text-white',
  accent = 'bg-white/10',
  className = '',
}) => (
  <div
    className={`bg-white/5 border border-white/10 p-3 rounded-none flex flex-col gap-2 relative group hover:bg-white/10 transition-colors ${className}`}
  >
    {/* Minimal Accent Indicator */}
    <div
      className={`absolute left-0 top-0 bottom-0 w-0.5 ${accent} opacity-40 group-hover:opacity-100 transition-opacity`}
    />

    <div className="flex items-center gap-2">
      {icon && (
        <div
          className={`${color} opacity-60 group-hover:opacity-100 transition-opacity`}
        >
          {icon}
        </div>
      )}
      <span className="text-[8px] text-white/40 uppercase tracking-[0.2em] font-black leading-none group-hover:text-white transition-colors truncate">
        {label}
      </span>
    </div>

    <div className="flex items-baseline gap-2">
      <span
        className={`text-[14px] font-black uppercase ${color} tracking-[0.2em] leading-none`}
      >
        {value}
      </span>
    </div>
  </div>
);

export default MetricStripItem;

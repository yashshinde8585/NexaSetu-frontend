import React from 'react';

/**
 * Standardized metric display for dashboard header strips.
 */
const MetricStripItem = ({ icon, label, value, color = "text-white", accent = "bg-white/20", className = "" }) => (
  <div className={`bg-black border border-white/20 p-5 rounded-2xl flex flex-col gap-3 relative group hover:border-white/40 transition-all shadow-none overflow-hidden ${className}`}>
    {/* Dynamic Accent Bar */}
    <div className={`absolute top-0 right-0 w-16 h-[2px] ${accent.replace('bg-', 'bg-')} opacity-60 group-hover:opacity-100 transition-opacity blur-[1px]`}></div>
    
    <div className="flex items-center gap-2.5">
      {icon && <div className={`${color} opacity-60 group-hover:opacity-100 transition-opacity scale-90`}>{icon}</div>}
      <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-black leading-none group-hover:text-white transition-colors">
        {label}
      </span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`text-3xl font-black ${color} tracking-tighter leading-none`}>
        {value}
      </span>
      <div className={`w-1 h-1 rounded-full ${accent.replace('bg-', 'bg-')} opacity-40 animate-pulse`}></div>
    </div>
  </div>
);

export default MetricStripItem;

import React from 'react';

/**
 * Standardized metric display for dashboard header strips.
 */
const MetricStripItem = ({ icon, label, value, color = "text-slate-300", accent = "bg-slate-800", className = "" }) => (
  <div className={`bg-slate-900/40 border border-white/[0.03] p-5 rounded-2xl flex flex-col gap-3 relative group hover:border-white/10 transition-all shadow-2xl overflow-hidden backdrop-blur-md ${className}`}>
    {/* Dynamic Accent Bar */}
    <div className={`absolute top-0 right-0 w-16 h-[2px] ${accent.replace('bg-', 'bg-')} opacity-60 group-hover:opacity-100 transition-opacity blur-[1px]`}></div>
    
    <div className="flex items-center gap-2.5">
      {icon && <div className={`${color} opacity-60 group-hover:opacity-100 transition-opacity scale-90`}>{icon}</div>}
      <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black leading-none group-hover:text-slate-200 transition-colors">
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

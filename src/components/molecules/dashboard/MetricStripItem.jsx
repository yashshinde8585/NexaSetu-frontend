import React from 'react';

/**
 * Standardized metric display for dashboard header strips.
 * Uses a rigid 8px grid system and clear visual hierarchy.
 */
const MetricStripItem = ({ icon, label, value, color = "text-white", accent = "bg-white/10", className = "" }) => (
  <div className={`bg-[#0A0A0A] border border-white/10 p-6 rounded-xl flex flex-col gap-4 relative group hover:border-white/20 transition-colors shadow-sm overflow-hidden ${className}`}>
    {/* Minimal Accent Indicator */}
    <div className={`absolute top-0 left-0 w-1 h-full ${accent.replace('bg-', 'bg-')} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
    
    <div className="flex items-center gap-3">
      {icon && <div className={`${color} opacity-80 group-hover:opacity-100 transition-opacity`}>{icon}</div>}
      <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold leading-none group-hover:text-white transition-colors">
        {label}
      </span>
    </div>
    
    <div className="flex items-baseline gap-2">
      <span className={`text-2xl font-black ${color} tracking-tight leading-none`}>
        {value}
      </span>
    </div>
  </div>
);

export default MetricStripItem;


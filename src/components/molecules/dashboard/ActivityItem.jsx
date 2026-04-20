import React from 'react';

/**
 * Individual log entry for the activity register.
 */
const ActivityItem = ({ text, time }) => (
  <div className="flex justify-between items-center gap-4 py-3 px-1 border-b border-white/[0.03] last:border-b-0 group">
    <div className="flex items-center gap-3">
      <div className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></div>
      <p className="text-[11px] text-white/50 group-hover:text-white/80 transition-colors leading-tight font-bold uppercase tracking-tight">
        {text}
      </p>
    </div>
    <span className="text-[9px] text-white/20 whitespace-nowrap uppercase font-bold tracking-widest bg-white/[0.02] px-2 py-0.5 rounded border border-white/5">
      {time}
    </span>
  </div>
);

export default ActivityItem;


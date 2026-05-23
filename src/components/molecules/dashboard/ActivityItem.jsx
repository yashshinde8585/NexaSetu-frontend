import React from 'react';

// Individual activity item component.
const ActivityItem = ({ text, time }) => (
  <div className="flex justify-between items-center gap-4 py-2 border-b border-white/[0.03] last:border-b-0 group">
    <div className="flex items-center gap-2">
      <div className="w-1 h-1 bg-white/20 group-hover:bg-primary transition-colors" />
      <p className="text-[9px] text-white/50 group-hover:text-white/80 transition-colors leading-tight font-black uppercase tracking-[0.2em] line-clamp-1">
        {text}
      </p>
    </div>
    <span className="text-[8px] text-white/20 whitespace-nowrap uppercase font-black tracking-widest bg-white/5 px-2 py-0.5 rounded-none border border-white/5">
      {time}
    </span>
  </div>
);

export default ActivityItem;

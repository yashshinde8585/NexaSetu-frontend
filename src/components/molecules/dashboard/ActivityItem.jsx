import React from 'react';

const ActivityItem = ({ text, time }) => (
  <div className="flex justify-between items-start text-[11px] border-l border-slate-800/60 pl-4 py-2 hover:bg-white/[0.02] transition-colors rounded-r-md group">
    <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-normal">{text}</p>
    <span className="text-[9px] text-slate-600 whitespace-nowrap ml-3 uppercase font-black tracking-tighter self-center">
      {time}
    </span>
  </div>
);

export default ActivityItem;

import React from 'react';

const ActivityItem = ({ text, time }) => (
  <div className="flex justify-between items-start text-[11px] border-l border-white/20 pl-4 py-3 hover:bg-white/5 transition-colors rounded-r-xl group">
    <p className="text-white/60 group-hover:text-white transition-colors leading-normal font-black uppercase tracking-tight">{text}</p>
    <span className="text-[9px] text-white/30 whitespace-nowrap ml-3 uppercase font-black tracking-widest self-center">
      {time}
    </span>
  </div>
);

export default ActivityItem;

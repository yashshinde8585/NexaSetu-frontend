import React from 'react';

/**
 * Functional unit summary card for strategic dashboards.
 * Optimized for high-density information display.
 */
const FunctionalCard = ({ title, metrics, focus, id, onClick }) => (
  <div 
    id={id} 
    onClick={onClick} 
    className="bg-white/5 border border-white/10 p-4 rounded-none hover:bg-white/10 transition-colors group cursor-pointer flex flex-col gap-3"
  >
    <header className="flex justify-between items-center">
      <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
        {title}
      </h3>
      <span className="text-[7px] opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 px-2 py-0.5 rounded-none text-white/40 tracking-[0.2em]">
        VIEW_DETAILS
      </span>
    </header>

    <div className="grid grid-cols-2 gap-3">
      {metrics.map((m, i) => (
        <div key={i} className="flex flex-col gap-1 border-l border-white/10 pl-3 first:border-l-0 first:pl-0">
          <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] truncate">{m.label}</span>
          <span className={`text-[12px] font-black uppercase tracking-[0.2em] ${m.color || 'text-white'}`}>{m.value}</span>
        </div>
      ))}
    </div>

    <footer className="mt-auto pt-3 border-t border-white/10 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-none bg-primary/40" />
      <span className="text-[7px] text-white/40 uppercase font-black tracking-[0.2em] truncate">
        FOCUS: <span className="text-white/60">{focus}</span>
      </span>
    </footer>
  </div>
);

export default FunctionalCard;


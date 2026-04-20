import React from 'react';

/**
 * Functional unit summary card for strategic dashboards.
 * Optimized for high-density information display.
 */
const FunctionalCard = ({ title, metrics, focus, id, onClick }) => (
  <div 
    id={id} 
    onClick={onClick} 
    className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl hover:border-primary/50 transition-all group cursor-pointer flex flex-col gap-6"
  >
    <header className="flex justify-between items-center">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
        {title}
      </h3>
      <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-white/40 tracking-widest">
        VIEW DETAILS ↗
      </span>
    </header>

    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
      {metrics.map((m, i) => (
        <div key={i} className="flex flex-col gap-1.5 border-l border-white/5 pl-4 first:border-l-0 first:pl-0">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{m.label}</span>
          <span className={`text-lg font-black ${m.color || 'text-white'} leading-tight`}>{m.value}</span>
        </div>
      ))}
    </div>

    <footer className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2">
      <div className="w-1 h-1 rounded-full bg-primary/40"></div>
      <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">
        Focus: <span className="text-white/50">{focus}</span>
      </span>
    </footer>
  </div>
);

export default FunctionalCard;


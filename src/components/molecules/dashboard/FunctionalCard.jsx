import React from 'react';

/**
 * Functional unit summary card for strategic dashboards.
 * @param {string} title - Card title
 * @param {Array} metrics - Array of {label, value, color} objects
 * @param {string} focus - Focus area description
 * @param {string} id - Component ID
 * @param {function} onClick - Click handler
 */
const FunctionalCard = ({ title, metrics, focus, id, onClick }) => (
  <div id={id} onClick={onClick} className="bg-black border border-white/20 p-5 rounded-2xl hover:border-primary transition-all shadow-none group cursor-pointer">
    <h3 className="text-[11px] font-black uppercase tracking-widest mb-6 flex justify-between items-center text-white">
      {title}
      <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 px-2 py-1 rounded text-white/60 tracking-widest cursor-pointer">DRILL DOWN ↗</span>
    </h3>
    <div className="grid grid-cols-2 gap-y-3">
      {metrics.map((m, i) => (
        <div key={i} className="flex flex-col gap-1 border-l border-white/10 pl-3">
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{m.label}</span>
          <span className={`text-xl font-black ${m.color || 'text-white'}`}>{m.value}</span>
        </div>
      ))}
    </div>
    <div className="mt-5 pt-4 border-t border-white/10">
      <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Focus: {focus}</span>
    </div>
  </div>
);

export default FunctionalCard;

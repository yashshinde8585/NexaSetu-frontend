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
  <div id={id} onClick={onClick} className="bg-slate-900 border border-slate-800 p-5 rounded-lg hover:border-slate-700 transition-all shadow-lg group cursor-pointer">
    <h3 className="text-sm font-bold mb-4 flex justify-between items-center text-slate-100 italic">
      {title}
      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-0.5 rounded uppercase text-slate-500 tracking-widest cursor-pointer">Drill Down ↗</span>
    </h3>
    <div className="grid grid-cols-2 gap-y-3">
      {metrics.map((m, i) => (
        <div key={i} className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase">{m.label}</span>
          <span className={`text-lg font-bold ${m.color || 'text-slate-300'}`}>{m.value}</span>
        </div>
      ))}
    </div>
    <div className="mt-4 pt-3 border-t border-slate-800/50">
      <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Focus: {focus}</span>
    </div>
  </div>
);

export default FunctionalCard;

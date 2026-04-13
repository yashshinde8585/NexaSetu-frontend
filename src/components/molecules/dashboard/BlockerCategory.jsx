import React from 'react';

const BlockerCategory = ({ label, items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="animate-in slide-in-from-left-2 duration-500">
      <span className="text-[10px] font-black text-white/40 uppercase mb-3 block tracking-widest">
        {label}:
      </span>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-[11px] text-status-error font-black uppercase tracking-tight flex items-start gap-3 bg-black border border-white/20 p-3 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <span className="text-status-error font-black shrink-0">•</span>
            <span className="leading-tight">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockerCategory;

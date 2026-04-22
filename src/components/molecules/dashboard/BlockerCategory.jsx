import React from 'react';

/**
 * Categorized display for active blockers.
 */
const BlockerCategory = ({ label, items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
        {label}
      </span>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li 
            key={i} 
            className="text-[9px] text-status-error font-black uppercase tracking-widest flex items-start gap-2 bg-red-500/10 border border-red-500/20 p-2 rounded-none hover:border-red-500/40 transition-colors"
          >
            <span className="shrink-0 mt-1 w-1.5 h-1.5 bg-status-error" />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockerCategory;


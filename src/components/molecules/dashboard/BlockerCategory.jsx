import React from 'react';

/**
 * Categorized display for active blockers.
 */
const BlockerCategory = ({ label, items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">
        {label}
      </span>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li 
            key={i} 
            className="text-[11px] text-status-error font-bold uppercase tracking-tight flex items-start gap-3 bg-red-500/5 border border-red-500/10 p-3 rounded-lg hover:border-red-500/30 transition-colors"
          >
            <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-status-error"></span>
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockerCategory;


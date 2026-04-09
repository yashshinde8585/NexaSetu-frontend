import React from 'react';

const BlockerCategory = ({ label, items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="animate-in slide-in-from-left-2 duration-500">
      <span className="text-[10px] font-black text-slate-600 uppercase mb-2 block tracking-tight">
        {label}:
      </span>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-rose-400/90 flex items-start gap-2 bg-rose-500/5 border border-rose-500/10 p-2 rounded-lg">
            <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
            <span className="leading-tight">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockerCategory;

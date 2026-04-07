import React from 'react';
import { Activity, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const ItemBreakdownHeader = ({ metrics, statsLoading }) => {
  const items = [
    { label: 'Open', count: metrics.open, icon: <AlertCircle size={14} />, color: 'text-status-error', bg: 'bg-status-error/10' },
    { label: 'In Progress', count: metrics.active, icon: <Activity size={14} />, color: 'text-status-warning', bg: 'bg-status-warning/10' },
    { label: 'In Review', count: metrics.review, icon: <Clock size={14} />, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Completed', count: metrics.completed, icon: <CheckCircle2 size={14} />, color: 'text-status-success', bg: 'bg-status-success/10' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 hover:border-white/10 transition-all cursor-default"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/60 group-hover:text-text-muted transition-colors opacity-60">
              {item.label}
            </span>
            <div className={`p-1.5 rounded-lg ${item.bg} ${item.color}`}>
              {item.icon}
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-black ${item.color} ${statsLoading ? 'animate-pulse' : ''}`}>
              {item.count}
            </span>
            <span className="text-[9px] font-bold text-text-muted/30 uppercase tracking-tighter">
              Tasks
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemBreakdownHeader;

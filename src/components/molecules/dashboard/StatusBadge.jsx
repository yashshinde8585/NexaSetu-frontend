import React from 'react';

/**
 * Standard StatusBadge for tactical dashboard tasks
 * @param {string} status - done, in_progress, in_review, todo, blocked
 */
const StatusBadge = ({ status }) => {
  const configs = {
    'done': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'in_progress': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    'in_review': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'todo': 'bg-slate-800 text-slate-400 border-slate-700',
    'blocked': 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  };

  const getLabel = () => {
    switch(status) {
      case 'in_progress': return 'Executing';
      case 'in_review': return 'Validating';
      default: return status?.replace('_', ' ');
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-[0.2em] border ${configs[status] || configs.todo}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;

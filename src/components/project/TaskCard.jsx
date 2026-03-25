import React from 'react';

const TaskCard = ({ task, user, columns, handleStatusChange }) => {
  return (
    <div key={task._id} className="bg-background-light p-4 rounded-lg shadow border border-background-dark/20 hover:border-primary/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-1 gap-2">
        <h4 className="font-semibold text-text leading-tight">{task.title}</h4>
        {task.delayStatus !== 'On Track' && (
          <span className={`shrink-0 text-[7px] font-black border px-1.5 py-0.5 rounded uppercase ${
            task.delayStatus === 'Delayed' ? 'bg-status-error/10 text-status-error border-status-error/20' :
            'bg-status-warning/10 text-status-warning border-status-warning/20'
          }`}>
            {task.delayStatus}
          </span>
        )}
      </div>
      {task.description && <p className="text-sm text-text-muted line-clamp-2">{task.description}</p>}
      {task.assignedUser && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary border border-primary/30">
            {task.assignedUser.name[0].toUpperCase()}
          </div>
          <span className="text-[11px] text-text-muted">{task.assignedUser.name}</span>
        </div>
      )}
      {task.status === 'done' && task.actualDuration !== null && (
        <div className="mt-3 py-1.5 border-t border-white/5 text-[10px] text-status-success font-bold flex items-center gap-1 opacity-80">
          ⏱️ Completed in {task.actualDuration} minutes
        </div>
      )}
      {task.source === 'github' && (
        <div className="mt-2 text-[9px] font-bold text-primary flex items-center gap-1 opacity-70 border border-primary/20 bg-primary/5 w-fit px-2 py-0.5 rounded" title="Auto-created from GitHub">
          🐙 GitHub
        </div>
      )}
      {task.timelineHistory?.length > 0 && (
        <div className="mt-2 text-[9px] font-bold text-status-warning flex items-center gap-1 opacity-90 animate-pulse">
          ⏳ Rescheduled by AI Scheduler
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-1 items-center pb-1">
          {columns.map(c => {
            const isRestrictedForIntern = user?.role === 'INTERN' && c.id === 'done';
            
            return c.id !== task.status && !isRestrictedForIntern && (
              <button 
                key={c.id}
                onClick={() => handleStatusChange(task._id, c.id)}
                className="text-[8px] px-1.5 py-0.5 rounded border border-white/5 hover:border-primary/40 text-text-muted hover:text-primary transition-all uppercase font-bold bg-background-dark/20"
                title={`Move to ${c.title}`}
              >
                {c.id === 'in_progress' ? 'Prog' : (c.id === 'in_review' ? 'Rev' : c.id)}
              </button>
            );
          })}
        </div>
        
        {task.status !== 'done' && (
          <button 
            onClick={() => {
              const next = task.status === 'todo' ? 'in_progress' : (task.status === 'in_progress' ? 'in_review' : 'done');
              handleStatusChange(task._id, next);
            }}
            className={`text-[10px] px-3 py-1.5 rounded font-bold shadow-lg transition-all active:scale-95 flex items-center gap-1.5 ${
              (user?.role === 'INTERN' && task.status === 'in_review') ? 'hidden' : ''
            } ${
              task.status === 'todo' ? 'bg-primary text-white hover:bg-primary-dark ring-1 ring-primary/20' : 
              task.status === 'in_progress' ? 'bg-status-warning text-white hover:bg-status-warning/80 ring-1 ring-status-warning/20' :
              'bg-secondary text-white hover:bg-secondary-light ring-1 ring-secondary/20'
            }`}
          >
            <span>{task.status === 'todo' ? '⚡ Start' : (task.status === 'in_progress' ? '🔍 Review' : '🚀 Complete')}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

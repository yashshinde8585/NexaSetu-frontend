import React from 'react';
import { TASK_STATUS, USER_ROLES } from '../../constants';
import { ChevronRight, Clock, ShieldCheck, GitBranch, Activity } from 'lucide-react';

/**
 * Tactical Task Card.
 * High-density information container for task orchestration and status lifecycle.
 * Optimized for sunlight legibility and rapid data verification.
 */
const TaskCard = ({ task, user, columns, handleStatusChange, onTaskClick }) => {
  return (
    <div
      key={task._id}
      onClick={() => onTaskClick(task)}
      className="bg-black p-4 rounded-xl border border-white/20 hover:border-primary/60 transition-all duration-300 relative overflow-hidden cursor-pointer active:scale-[0.98] group shadow-xl"
    >
      <div className="flex justify-between items-start mb-3 gap-4">
        <div className="flex flex-col min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 border border-primary/40 px-2 py-0.5 rounded">
              {task.projectKey || 'NEXA'}-{task.taskNumber || '0'}
            </span>
            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest flex items-center gap-1.5">
              <Clock size={10} /> {task.createdFormatted}
            </span>
            {task.sprintInfo && (
              <span className="text-[8px] font-black bg-white/10 border border-white/20 px-2 py-0.5 rounded text-white/70 uppercase tracking-widest">
                {task.sprintInfo.name}
              </span>
            )}
            {task.dueDate && (
              <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${new Date(task.dueDate) < new Date() && task.status !== TASK_STATUS.DONE ? 'bg-status-error/10 border-status-error text-status-error shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-primary/5 border-primary/30 text-primary-light'}`}>
                DUE: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          <h4 className="text-sm font-black text-white leading-tight uppercase tracking-tight group-hover:text-primary-light transition-colors truncate">
            {task.title}
          </h4>
        </div>
        {task.delayStatus !== 'On Track' && (
          <span
            className={`shrink-0 text-[8px] font-black border px-2 py-1 rounded uppercase tracking-[0.1em] ${
              task.delayStatus === 'Delayed'
                ? 'bg-status-error text-black border-status-error'
                : 'bg-status-warning text-black border-status-warning'
            }`}
          >
            {task.delayStatus}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-[11px] font-medium text-white/70 line-clamp-2 leading-relaxed mb-4 uppercase tracking-normal">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 mt-auto">
        {task.assignedUser && (
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded bg-white/15 flex items-center justify-center text-[10px] font-black text-white border border-white/30">
               {task.assignedUser.name[0].toUpperCase()}
             </div>
             <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">
               {task.assignedUser.name}
             </span>
          </div>
        )}
        
        {task.source === 'github' && (
           <div className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.05] border border-white/20 rounded text-[8px] font-black text-white/60 uppercase tracking-widest">
              <GitBranch size={10} /> SYSTEM SYNC
           </div>
        )}
      </div>

      {task.status === TASK_STATUS.DONE && task.actualDuration !== null && (
        <div className="mt-4 pt-3 border-t border-white/10 text-[9px] font-black text-status-success uppercase tracking-[0.25em] flex items-center gap-2">
           <ShieldCheck size={12} /> CYCLE COMPLETE: {task.actualDuration}M
        </div>
      )}

      {task.timelineHistory?.length > 0 && (
        <div className="mt-3 text-[9px] font-black text-status-warning uppercase tracking-[0.15em] flex items-center gap-2">
           <Activity size={12} className="animate-pulse" /> AI RE-SCHEDULED
        </div>
      )}

      {task.status !== TASK_STATUS.DONE && (
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex gap-1.5 items-center">
            {columns.map((c) => {
              const isRestrictedForIntern = user?.role === USER_ROLES.INTERN && c.id === TASK_STATUS.DONE;
              const isTaskDone = task.status === TASK_STATUS.DONE;
              if (c.id === task.status || isRestrictedForIntern || isTaskDone) return null;

              return (
                <button
                  key={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(task._id, c.id);
                  }}
                  className="text-[8px] px-1.5 py-1 rounded-lg border border-white/20 hover:border-primary/60 text-white/50 hover:text-white transition-all uppercase font-black bg-white/5"
                  title={`Move to ${c.title}`}
                >
                  {c.id.slice(0, 3)}
                </button>
              );
            })}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              let next;
              if (task.status === TASK_STATUS.TODO) next = TASK_STATUS.IN_PROGRESS;
              else if (task.status === TASK_STATUS.IN_PROGRESS) next = TASK_STATUS.IN_REVIEW;
              else next = TASK_STATUS.DONE;

              handleStatusChange(task._id, next);
            }}
            className={`text-[9px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center gap-2 ${
              user?.role === USER_ROLES.INTERN && task.status === TASK_STATUS.IN_REVIEW ? 'hidden' : ''
            } ${
              task.status === TASK_STATUS.TODO
                ? 'bg-primary text-black hover:bg-primary-dark shadow-primary/40'
                : task.status === TASK_STATUS.IN_PROGRESS
                  ? 'bg-status-warning text-black shadow-status-warning/40'
                  : 'bg-secondary text-white shadow-secondary/40'
            }`}
          >
            {task.status === TASK_STATUS.TODO ? 'START' : task.status === TASK_STATUS.IN_PROGRESS ? 'IN REVIEW' : 'DONE'}
            <ChevronRight size={12} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Hover Indicator */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
    </div>
  );
};

export default TaskCard;

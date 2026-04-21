import React from 'react';
import { TASK_STATUS, USER_ROLES } from '../../constants';
import { ChevronRight, Clock, ShieldCheck, GitBranch, Activity } from 'lucide-react';

/**
 * Tactical Task Card.
 * High-density information container for task orchestration and status lifecycle.
 * Optimized for sunlight legibility and rapid data verification.
 */
const TaskCard = ({ task, user, columns, handleStatusChange, onTaskClick, cardLayout = 'standard' }) => {
  const isCompact = cardLayout === 'compact';
  const isMinimal = cardLayout === 'minimal';
  const isList = cardLayout === 'list';

  if (isList) {
    return (
      <div
        key={task._id}
        onClick={() => onTaskClick(task)}
        className="bg-background-elevated hover:bg-white/5 p-3 rounded-xl border-2 border-white/20 relative overflow-hidden cursor-pointer group shadow-xl flex items-center gap-3 h-14 transition-all"
      >
        <div className="flex-1 min-w-0">
          <h4 className="text-[11px] font-black text-white leading-none truncate uppercase tracking-tight">
            {task.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {task.assignedUser && (
             <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[8px] font-black text-white border-2 border-white/30 group-hover:border-primary transition-all">
               {task.assignedUser.name[0].toUpperCase()}
             </div>
          )}
          
          {task.status !== TASK_STATUS.DONE && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                let next;
                if (task.status === TASK_STATUS.TODO) next = TASK_STATUS.IN_PROGRESS;
                else if (task.status === TASK_STATUS.IN_PROGRESS) next = TASK_STATUS.IN_REVIEW;
                else next = TASK_STATUS.DONE;
                handleStatusChange(task._id, next);
              }}
              className={`text-[8px] px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/60 font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95 ${
                user?.role === USER_ROLES.INTERN && task.status === TASK_STATUS.IN_REVIEW ? 'hidden' : ''
              }`}
            >
              {task.status === TASK_STATUS.TODO ? 'GO' : task.status === TASK_STATUS.IN_PROGRESS ? 'REV' : 'DONE'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      key={task._id}
      onClick={() => onTaskClick(task)}
      className={`bg-background-light p-5 border-2 border-white/20 relative overflow-hidden cursor-pointer group transition-all duration-300 hover:border-primary hover:bg-background-elevated flex flex-col shadow-lg ${
        isMinimal ? 'h-28' : isCompact ? 'h-40' : 'h-52'
      }`}
    >
      {/* Dynamic Status Glow */}
      {['HIGH', 'URGENT'].includes(task.priority?.toUpperCase()) && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-status-error/5 blur-2xl" />
      )}

      <div className={`flex justify-between items-start gap-4 ${isMinimal ? 'mb-1' : 'mb-4'}`}>
        <div className="flex flex-col min-w-0">
          {!isMinimal && (
            <div className={`flex flex-wrap items-center gap-3 ${isCompact ? 'mb-2' : 'mb-3'}`}>
              <span className="text-[10px] font-black text-primary font-mono uppercase tracking-widest bg-primary/15 border-2 border-primary/40 px-2.5 py-1">
                {task.projectKey || 'NEXA'}-{task.taskNumber || '0'}
              </span>
              {!isCompact && (
                <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em]">
                  {task.createdFormatted}
                </span>
              )}
            </div>
          )}
          <h4 className={`${isMinimal ? 'text-[11px]' : 'text-[13px]'} font-black text-white leading-tight tracking-tight truncate group-hover:text-primary transition-colors uppercase`}>
            {task.title}
          </h4>
        </div>
        {!isMinimal && task.delayStatus !== 'On Track' && (
          <div className="flex flex-col items-end">
            <span
              className={`shrink-0 text-[7px] font-black border px-2 py-1 uppercase tracking-[0.2em] ${
                task.delayStatus === 'Delayed'
                  ? 'bg-status-error/10 text-status-error border-status-error/30'
                  : 'bg-status-warning/10 text-status-warning border-status-warning/30'
              }`}
            >
              {task.delayStatus}
            </span>
          </div>
        )}
      </div>

      {!isMinimal && task.status === TASK_STATUS.DONE && task.actualDuration !== null && (
        <div className="mt-2 pt-2 border-t border-white/5 text-[9px] font-black text-status-success uppercase tracking-[0.3em] flex items-center gap-2">
           <ShieldCheck size={12} strokeWidth={3} /> CYCLE: {task.actualDuration}M
        </div>
      )}

      {!isMinimal && task.timelineHistory?.length > 0 && (
        <div className="mt-2 text-[9px] font-black text-secondary uppercase tracking-[0.2em] flex items-center gap-2 bg-secondary/5 border border-secondary/20 px-2 py-1 w-fit">
           <Activity size={10} className="animate-pulse" strokeWidth={3} /> AI OPTIMIZED
        </div>
      )}

      {/* Footer Section */}
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {task.assignedUser && (
            <div className="flex items-center gap-2.5">
               <div className={`${isMinimal ? 'w-5 h-5 text-[8px]' : 'w-7 h-7 text-[10px]'} bg-white/5 flex items-center justify-center font-black text-white/60 border border-white/10 group-hover:border-white/30 transition-all`}>
                 {task.assignedUser.name[0].toUpperCase()}
               </div>
               {!isMinimal && (
                 <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white/70 transition-colors">
                   {task.assignedUser.name.split(' ')[0]}
                 </span>
               )}
            </div>
          )}
          
          {task.source === 'github' && !isMinimal && (
             <div className="h-4 w-[1px] bg-white/10 mx-1" />
          )}
          {task.source === 'github' && !isMinimal && (
             <GitBranch size={12} strokeWidth={3} className="text-white/20" />
          )}
        </div>

        {task.status !== TASK_STATUS.DONE && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              let next;
              if (task.status === TASK_STATUS.TODO) next = TASK_STATUS.IN_PROGRESS;
              else if (task.status === TASK_STATUS.IN_PROGRESS) next = TASK_STATUS.IN_REVIEW;
              else next = TASK_STATUS.DONE;
              handleStatusChange(task._id, next);
            }}
            className={`${isMinimal ? 'text-[7px] px-3 py-1' : 'text-[9px] px-4 py-2'} font-black uppercase tracking-[0.3em] transition-all active:scale-95 flex items-center gap-2 ${
              user?.role === USER_ROLES.INTERN && task.status === TASK_STATUS.IN_REVIEW ? 'hidden' : ''
            } ${
              task.status === TASK_STATUS.TODO
                ? 'bg-primary text-black hover:brightness-110'
                : task.status === TASK_STATUS.IN_PROGRESS
                  ? 'bg-status-warning text-black hover:brightness-110'
                  : 'bg-secondary text-white hover:brightness-110'
            }`}
          >
            {task.status === TASK_STATUS.TODO ? 'START' : task.status === TASK_STATUS.IN_PROGRESS ? 'REVIEW' : 'DONE'}
            {!isMinimal && <ChevronRight size={14} strokeWidth={4} className="opacity-40" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

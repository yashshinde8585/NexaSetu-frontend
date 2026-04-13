import React from 'react';
import { TASK_STATUS, USER_ROLES } from '../../constants';

// A compact task card component that displays essential task data and role-based status actions.
const TaskCard = ({ task, user, columns, handleStatusChange, onTaskClick }) => {
  return (
    <div
      key={task._id}
      onClick={() => onTaskClick(task)}
      className="bg-background-light p-4 rounded-lg shadow border border-background-dark/20 hover:border-primary/30 transition-all duration-300 relative overflow-hidden cursor-pointer active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-2 gap-4">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">
              {task.projectKey || 'NEXA'}-{task.taskNumber || '0'}
            </span>
            <span className="text-[9px] font-bold text-text-muted/40 lowercase italic">
              {task.createdFormatted}
            </span>
            {task.sprintInfo && (
              <span className="text-[7px] font-black bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-text-muted/60 uppercase tracking-tighter">
                {task.sprintInfo.name}
              </span>
            )}
          </div>
          <h4 className="font-semibold text-text leading-tight">
            {task.title}
          </h4>
        </div>
        {task.delayStatus !== 'On Track' && (
          <span
            className={`shrink-0 text-[7px] font-black border px-1.5 py-0.5 rounded uppercase ${
              task.delayStatus === 'Delayed'
                ? 'bg-status-error/10 text-status-error border-status-error/20'
                : 'bg-status-warning/10 text-status-warning border-status-warning/20'
            }`}
          >
            {task.delayStatus}
          </span>
        )}
      </div>
      {task.description && (
        <p className="text-sm text-text-muted line-clamp-2">
          {task.description}
        </p>
      )}
      {task.assignedUser && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary border border-primary/30">
            {task.assignedUser.name[0].toUpperCase()}
          </div>
          <span className="text-[11px] text-text-muted">
            {task.assignedUser.name}
          </span>
        </div>
      )}
      {task.status === TASK_STATUS.DONE && task.actualDuration !== null && (
        <div className="mt-3 py-1.5 border-t border-white/5 text-[10px] text-status-success font-bold flex items-center gap-1 opacity-80 uppercase tracking-tighter">
          Completed in {task.actualDuration} minutes
        </div>
      )}
      {task.source === 'github' && (
        <div
          className="mt-2 text-[9px] font-bold text-primary flex items-center gap-1 opacity-70 border border-primary/20 bg-primary/5 w-fit px-2 py-0.5 rounded"
          title="Auto-created from GitHub"
        >
          GitHub
        </div>
      )}
      {task.timelineHistory?.length > 0 && (
        <div className="mt-2 text-[9px] font-bold text-status-warning flex items-center gap-1 opacity-90 animate-pulse">
          Rescheduled by AI Scheduler
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-1 items-center pb-1">
          {columns.map((c) => {
            const isRestrictedForIntern =
              user?.role === USER_ROLES.INTERN && c.id === TASK_STATUS.DONE;

            return (
              c.id !== task.status &&
              !isRestrictedForIntern && (
                <button
                  key={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(task._id, c.id);
                  }}
                  className="text-[8px] px-1.5 py-0.5 rounded border border-white/5 hover:border-primary/40 text-text-muted hover:text-primary transition-all uppercase font-bold bg-background-dark/20"
                  title={`Move to ${c.title}`}
                >
                  {c.id === TASK_STATUS.IN_PROGRESS
                    ? 'Prog'
                    : c.id === TASK_STATUS.IN_REVIEW
                      ? 'Rev'
                      : c.id}
                </button>
              )
            );
          })}
        </div>

        {task.status !== TASK_STATUS.DONE && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              let next;
              if (task.status === TASK_STATUS.TODO)
                next = TASK_STATUS.IN_PROGRESS;
              else if (task.status === TASK_STATUS.IN_PROGRESS)
                next = TASK_STATUS.IN_REVIEW;
              else next = TASK_STATUS.DONE;

              handleStatusChange(task._id, next);
            }}
            className={`text-[10px] px-3 py-1.5 rounded font-bold shadow-lg transition-all active:scale-95 flex items-center gap-1.5 ${
              user?.role === USER_ROLES.INTERN &&
              task.status === TASK_STATUS.IN_REVIEW
                ? 'hidden'
                : ''
            } ${
              task.status === TASK_STATUS.TODO
                ? 'bg-primary text-white hover:bg-primary-dark ring-1 ring-primary/20'
                : task.status === TASK_STATUS.IN_PROGRESS
                  ? 'bg-status-warning text-white hover:bg-status-warning/80 ring-1 ring-status-warning/20'
                  : 'bg-secondary text-white hover:bg-secondary-light ring-1 ring-secondary/20'
            }`}
          >
            <span>
              {task.status === TASK_STATUS.TODO
                ? 'Start'
                : task.status === TASK_STATUS.IN_PROGRESS
                  ? 'Review'
                  : 'Complete'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

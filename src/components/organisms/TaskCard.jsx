import React from 'react';
import PropTypes from 'prop-types';
import { Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { TASK_STATUS } from '../../constants';

// A card component that displays task details, status, and management actions.
const TaskCard = ({
  task,
  onNavigate,
  onStatusChange,
  showAssignedUser = false,
}) => {
  return (
    <div
      onClick={onNavigate}
      className="group glass-dark border border-white/5 rounded-3xl p-8 hover:border-primary/30 transition-all duration-500 flex flex-col gap-6 relative overflow-hidden cursor-pointer"
    >
      {/* Status Glow */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-30 ${
          task.status === TASK_STATUS.IN_PROGRESS
            ? 'bg-secondary'
            : task.status === TASK_STATUS.IN_REVIEW
              ? 'bg-primary'
              : 'bg-status-warning'
        }`}
      />

      <div className="space-y-2 relative z-10">
        <div className="flex justify-between items-start mb-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin size={10} className="text-primary" />
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">
                {task.project?.name || 'General'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
              {task.title}
            </h3>
          </div>
          <div
            className={`px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-tighter ${
              task.status === TASK_STATUS.DONE
                ? 'bg-status-success/10 border-status-success/20 text-status-success'
                : task.status === TASK_STATUS.IN_PROGRESS
                  ? 'bg-secondary/10 border-secondary/20 text-secondary'
                  : task.status === TASK_STATUS.IN_REVIEW
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-background-light/20 border-white/5 text-text-muted'
            }`}
          >
            {task.status === TASK_STATUS.DONE
              ? 'Completed'
              : task.status.replace('_', ' ')}
          </div>
        </div>
        <p className="text-sm text-text-muted leading-relaxed line-clamp-3 font-medium">
          {task.description}
        </p>

        {showAssignedUser && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-black text-primary border border-primary/20">
              {task.assignedUser?.name?.charAt(0) || '?'}
            </div>
            <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
              {task.assignedUser?.name || 'Unassigned'}
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/5 space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
              task.delayStatus === 'delayed'
                ? 'bg-status-error/10 border-status-error/20 text-status-error'
                : 'bg-white/5 border-white/10 text-text-muted'
            }`}
          >
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : 'No Due Date'}
            </span>
          </div>

          <div className="flex gap-2">
            {task.status !== TASK_STATUS.IN_PROGRESS && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(task._id, TASK_STATUS.IN_PROGRESS);
                }}
                className="p-2 border border-white/5 bg-white/5 rounded-xl hover:bg-secondary hover:text-white transition-all text-text-muted"
                title="Start Task"
              >
                <div className="animate-spin-slow">
                  <Clock size={18} />
                </div>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task._id, TASK_STATUS.DONE);
              }}
              className="p-2 border border-white/5 bg-white/5 rounded-xl hover:bg-status-success hover:text-white transition-all text-text-muted"
              title="Complete Task"
            >
              <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  showAssignedUser: PropTypes.bool,
};

export default TaskCard;

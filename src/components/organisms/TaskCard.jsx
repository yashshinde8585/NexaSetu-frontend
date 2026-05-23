import React from 'react';
import PropTypes from 'prop-types';
import { Clock, MapPin, CheckCircle2, Play, Paperclip } from 'lucide-react';
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
      className="group glass-dark border border-white/5 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden cursor-pointer"
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
              <span className="mx-2 text-white/5">•</span>
              <span
                className={`text-[10px] font-black uppercase tracking-widest leading-none ${
                  task.priority === 'low'
                    ? 'text-status-success'
                    : task.priority === 'high'
                      ? 'text-status-warning'
                      : task.priority === 'urgent'
                        ? 'text-status-error'
                        : 'text-primary'
                }`}
              >
                {task.priority || 'Medium'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
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
        {/* <p className="text-sm text-text-muted leading-relaxed line-clamp-3 font-medium">
          {task.description}
        </p> */}

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
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : 'No Due Date'}
              </span>
              {task.estimatedDuration > 0 && (
                <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.15em]">
                  Est:{' '}
                  {task.estimatedDuration >= 60
                    ? `${Math.floor(task.estimatedDuration / 60)}h${task.estimatedDuration % 60 > 0 ? ` ${task.estimatedDuration % 60}m` : ''}`
                    : `${task.estimatedDuration}m`}
                </span>
              )}
            </div>
          </div>

          {task.attachments?.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white/5 border-white/10 text-primary-light/60">
              <Paperclip size={14} />
              <span className="text-[10px] font-black">
                {task.attachments.length}
              </span>
            </div>
          )}
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

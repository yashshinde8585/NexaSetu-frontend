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
      className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden cursor-pointer transition-all duration-300"
    >
      <div className="space-y-1.5 relative z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[8px] text-primary font-black uppercase tracking-[0.2em] truncate max-w-[120px]">
                {task.project?.name || 'General'}
              </span>
              <span className="text-white/10">•</span>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                task.priority === 'low' ? 'text-status-success/60' :
                task.priority === 'high' ? 'text-status-warning/60' :
                task.priority === 'urgent' ? 'text-status-error/60' :
                'text-primary/60'
              }`}>
                {task.priority || 'Medium'}
              </span>
            </div>
            <h3 className="text-[13px] font-bold text-white/90 tracking-tight leading-snug group-hover:text-white transition-colors truncate">
              {task.title}
            </h3>
          </div>
          <div
            className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${
              task.status === TASK_STATUS.DONE
                ? 'bg-status-success/10 border-status-success/20 text-status-success'
                : task.status === TASK_STATUS.IN_PROGRESS
                  ? 'bg-secondary/10 border-secondary/20 text-secondary'
                  : task.status === TASK_STATUS.IN_REVIEW
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            {task.status === TASK_STATUS.DONE ? 'COMPLETED' : task.status.replace('_', ' ')}
          </div>
        </div>

        {showAssignedUser && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[7px] font-black text-white/60 border border-white/10">
              {task.assignedUser?.name?.charAt(0) || '?'}
            </div>
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest truncate">
              {task.assignedUser?.name || 'Unassigned'}
            </span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 ${task.delayStatus === 'delayed' ? 'text-status-error' : 'text-white/20'}`}>
            <Clock size={10} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'NO DATE'}
            </span>
          </div>
          
          {task.estimatedDuration > 0 && (
            <div className="flex items-center gap-1 text-white/10">
              <span className="text-[8px] font-black uppercase">
                {task.estimatedDuration >= 60 
                  ? `${Math.floor(task.estimatedDuration / 60)}H` 
                  : `${task.estimatedDuration}M`}
              </span>
            </div>
          )}
        </div>

        {task.attachments?.length > 0 && (
          <div className="flex items-center gap-1 text-white/20">
            <Paperclip size={10} />
            <span className="text-[8px] font-black">{task.attachments.length}</span>
          </div>
        )}
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

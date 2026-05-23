import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';

const COL_LIMIT = 15; // max cards rendered per column before showing overflow

const MyWorkTab = ({
  filteredMyTasks = [],
  handleUpdateStatus,
  handleToggleBlock,
}) => {
  const navigate = useNavigate();

  // Slice each column — prevents mounting hundreds of DOM nodes for long sprints
  const { todoTasks, inProgressTasks, inReviewTasks, doneTasks } = useMemo(
    () => ({
      todoTasks: filteredMyTasks.filter((t) => t.status === 'todo'),
      inProgressTasks: filteredMyTasks.filter(
        (t) => t.status === 'in_progress'
      ),
      inReviewTasks: filteredMyTasks.filter((t) => t.status === 'in_review'),
      doneTasks: filteredMyTasks.filter((t) => t.status === 'done'),
    }),
    [filteredMyTasks]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-black uppercase tracking-widest text-white">
          Work Console Board
        </h2>
        <button
          onClick={() => navigate('/my-tasks')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-black text-[9px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all rounded-sm cursor-pointer border-none"
        >
          <Plus size={12} /> Add Task
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Column: To Do */}
        <div className="bg-[#0A0C14] border border-white/5 p-4 flex flex-col gap-3 min-h-[500px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              To Do
            </span>
            <span className="px-2 py-0.5 bg-white/5 text-[9px] font-black text-white/60">
              {todoTasks.length}
            </span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] scrollbar-none">
            {todoTasks.slice(0, COL_LIMIT).map((task) => (
              <div
                key={task.id}
                className="p-3 bg-white/[0.01] border border-white/5 hover:border-primary/40 cursor-pointer group flex flex-col gap-2 relative"
                onClick={() => navigate(`/task/${task.id}`)}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-mono text-primary">
                    {task.taskKey}
                  </span>
                  <span
                    className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 leading-none ${
                      task.priority === 'urgent' || task.priority === 'high'
                        ? 'bg-status-error/15 text-status-error border border-status-error/20'
                        : task.priority === 'medium'
                          ? 'bg-status-warning/15 text-status-warning border border-status-warning/20'
                          : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-white group-hover:text-primary transition-colors leading-tight">
                  {task.title}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[8px] font-black uppercase tracking-wider text-white/30">
                  <span>Due: {task.due}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(task.id, 'in_progress');
                    }}
                    className="text-primary hover:underline cursor-pointer border-none bg-transparent"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
            {todoTasks.length > COL_LIMIT && (
              <button
                onClick={() => navigate('/my-tasks?filter=todo')}
                className="flex items-center justify-center gap-1.5 py-2 text-[8px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors border border-dashed border-white/10 hover:border-primary/30 cursor-pointer bg-transparent w-full"
              >
                <ArrowRight size={10} /> {todoTasks.length - COL_LIMIT} more
                tasks
              </button>
            )}
          </div>
        </div>

        {/* Column: In Progress */}
        <div className="bg-[#0A0C14] border border-white/5 p-4 flex flex-col gap-3 min-h-[500px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              In Progress
            </span>
            <span className="px-2 py-0.5 bg-white/5 text-[9px] font-black text-white/60">
              {inProgressTasks.length}
            </span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] scrollbar-none">
            {inProgressTasks.slice(0, COL_LIMIT).map((task) => (
              <div
                key={task.id}
                className="p-3 bg-white/[0.01] border border-white/5 hover:border-primary/40 cursor-pointer group flex flex-col gap-2 relative"
                onClick={() => navigate(`/task/${task.id}`)}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-mono text-primary">
                    {task.taskKey}
                  </span>
                  <span
                    className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 leading-none ${
                      task.priority === 'urgent' || task.priority === 'high'
                        ? 'bg-status-error/15 text-status-error border border-status-error/20'
                        : task.priority === 'medium'
                          ? 'bg-status-warning/15 text-status-warning border border-status-warning/20'
                          : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-white group-hover:text-primary transition-colors leading-tight">
                  {task.title}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[8px] font-black uppercase tracking-wider text-white/30">
                  <span>Due: {task.due}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBlock(task.id, !task.blocked);
                      }}
                      className={`${task.blocked ? 'text-status-success' : 'text-status-error'} hover:underline cursor-pointer border-none bg-transparent`}
                    >
                      {task.blocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(task.id, 'in_review');
                      }}
                      className="text-status-warning hover:underline cursor-pointer border-none bg-transparent"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {inProgressTasks.length > COL_LIMIT && (
              <button
                onClick={() => navigate('/my-tasks?filter=in_progress')}
                className="flex items-center justify-center gap-1.5 py-2 text-[8px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors border border-dashed border-white/10 hover:border-primary/30 cursor-pointer bg-transparent w-full"
              >
                <ArrowRight size={10} /> {inProgressTasks.length - COL_LIMIT}{' '}
                more tasks
              </button>
            )}
          </div>
        </div>

        {/* Column: In Review */}
        <div className="bg-[#0A0C14] border border-white/5 p-4 flex flex-col gap-3 min-h-[500px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              In Review
            </span>
            <span className="px-2 py-0.5 bg-white/5 text-[9px] font-black text-white/60">
              {inReviewTasks.length}
            </span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] scrollbar-none">
            {inReviewTasks.slice(0, COL_LIMIT).map((task) => (
              <div
                key={task.id}
                className="p-3 bg-white/[0.01] border border-white/5 hover:border-primary/40 cursor-pointer group flex flex-col gap-2 relative"
                onClick={() => navigate(`/task/${task.id}`)}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-mono text-primary">
                    {task.taskKey}
                  </span>
                  <span
                    className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 leading-none ${
                      task.priority === 'urgent' || task.priority === 'high'
                        ? 'bg-status-error/15 text-status-error border border-status-error/20'
                        : task.priority === 'medium'
                          ? 'bg-status-warning/15 text-status-warning border border-status-warning/20'
                          : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-white group-hover:text-primary transition-colors leading-tight">
                  {task.title}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[8px] font-black uppercase tracking-wider text-white/30">
                  <span>Due: {task.due}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(task.id, 'done');
                    }}
                    className="text-status-success hover:underline cursor-pointer border-none bg-transparent"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
            {inReviewTasks.length > COL_LIMIT && (
              <button
                onClick={() => navigate('/my-tasks?filter=in_review')}
                className="flex items-center justify-center gap-1.5 py-2 text-[8px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors border border-dashed border-white/10 hover:border-primary/30 cursor-pointer bg-transparent w-full"
              >
                <ArrowRight size={10} /> {inReviewTasks.length - COL_LIMIT} more
                tasks
              </button>
            )}
          </div>
        </div>

        {/* Column: Done */}
        <div className="bg-[#0A0C14] border border-white/5 p-4 flex flex-col gap-3 min-h-[500px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Done
            </span>
            <span className="px-2 py-0.5 bg-white/5 text-[9px] font-black text-white/60">
              {doneTasks.length}
            </span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] scrollbar-none">
            {doneTasks.slice(0, COL_LIMIT).map((task) => (
              <div
                key={task.id}
                className="p-3 bg-white/[0.01] border border-white/5 hover:border-primary/40 cursor-pointer group flex flex-col gap-2 relative"
                onClick={() => navigate(`/task/${task.id}`)}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-mono text-primary">
                    {task.taskKey}
                  </span>
                  <span className="text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 leading-none bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20">
                    Done
                  </span>
                </div>
                <p className="text-[10px] font-bold text-white/40 line-through leading-tight">
                  {task.title}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[8px] font-black uppercase tracking-wider text-white/20">
                  <span>Finished</span>
                </div>
              </div>
            ))}
            {doneTasks.length > COL_LIMIT && (
              <button
                onClick={() => navigate('/my-tasks?filter=completed')}
                className="flex items-center justify-center gap-1.5 py-2 text-[8px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors border border-dashed border-white/10 hover:border-primary/30 cursor-pointer bg-transparent w-full"
              >
                <ArrowRight size={10} /> {doneTasks.length - COL_LIMIT} more
                tasks
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MyWorkTab);

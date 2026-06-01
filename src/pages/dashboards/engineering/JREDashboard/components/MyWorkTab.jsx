import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyWorkTab = ({ inProgressTasks, handleStatusUpdate }) => {
  const navigate = useNavigate();
  const [activeWorkTab, setActiveWorkTab] = useState('in_progress');

  return (
    <div className="bg-card border border-border-subtle rounded-none p-5">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
          My Work Console
        </h3>
        <div className="flex gap-2">
          {['in_progress', 'in_review', 'done'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveWorkTab(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-none border transition-all ${
                activeWorkTab === tab
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'bg-transparent text-text-subtle border-transparent hover:text-text'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inProgressTasks
          .filter((t) => {
            if (activeWorkTab === 'in_progress')
              return t.status === 'in_progress' || t.status === 'todo';
            return t.status === activeWorkTab;
          })
          .map((task, idx) => (
            <div
              key={idx}
              className="bg-card border border-border-subtle p-4 rounded-none hover:border-muted transition-all flex flex-col gap-3 relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-text-subtle font-bold block mb-1">
                    {task.id}
                  </span>
                  <h4
                    className="text-sm font-black text-text tracking-wide hover:text-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/task/${task.id}`)}
                  >
                    {task.title}
                  </h4>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-semibold bg-secondary text-status-info border border-border rounded uppercase">
                  {task.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-status-info">
                  {task.status.replace('_', ' ')}
                </span>
                <div className="flex-1 h-1.5 bg-secondary rounded-none overflow-hidden">
                  <div
                    className="h-full bg-status-info rounded-none"
                    style={{ width: `${task.progress || 0}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-text-subtle">
                  {task.progress || 0}%
                </span>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => handleStatusUpdate(task.id, task.status)}
                  className="px-3 py-1.5 bg-secondary hover:bg-primary/20 hover:text-primary border border-border hover:border-primary/30 rounded text-xs font-semibold transition-all"
                >
                  Advance State
                </button>
              </div>
            </div>
          ))}
        {inProgressTasks.filter((t) => {
          if (activeWorkTab === 'in_progress')
            return t.status === 'in_progress' || t.status === 'todo';
          return t.status === activeWorkTab;
        }).length === 0 && (
          <div className="text-sm text-text-subtle p-4">
            No tasks found in this state.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorkTab;

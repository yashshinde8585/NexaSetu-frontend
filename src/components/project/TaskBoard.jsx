import React, { useState } from 'react';
import TaskCard from './TaskCard';

// Kanban task board component.
const TaskBoard = ({
  groupedTasks,
  user,
  columns,
  handleStatusChange,
  onTaskClick,
  cardLayout,
  currentPage = 1,
  pageSize = 10,
}) => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return (
    <div>
      <div className="bg-background-light border-2 border-white/20 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x-2 divide-white/15 items-stretch">
          {columns.map((column) => {
            const allColumnTasks = groupedTasks[column.id] || [];
            const paginatedColumnTasks = allColumnTasks.slice(
              startIndex,
              endIndex
            );

            return (
              <div
                key={column.id}
                className="flex-1 min-w-[280px] flex flex-col h-full bg-background-light"
              >
                {/* Tactical Column Header */}
                <div className="p-6 border-b-2 border-white/20 flex items-center justify-between bg-background-elevated sticky top-0 z-20">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className={`w-3.5 h-3.5 ${column.color.replace('text-', 'bg-')} shadow-[0_0_20px_rgba(255,255,255,0.15)]`}
                      />
                      <div
                        className={`absolute inset-0 w-3.5 h-3.5 ${column.color.replace('text-', 'bg-')} animate-ping opacity-30`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white leading-none">
                        {column.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-[1px] bg-white/20" />
                    <span className="px-2.5 py-1 bg-black/40 border-2 border-white/30 text-[10px] font-black text-white font-mono">
                      {allColumnTasks.length.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div className="px-2 py-3 space-y-3 flex-grow min-h-[500px]">
                  {paginatedColumnTasks.length > 0 ? (
                    paginatedColumnTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        user={user}
                        columns={columns}
                        handleStatusChange={handleStatusChange}
                        onTaskClick={onTaskClick}
                        cardLayout={cardLayout}
                      />
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center grayscale opacity-30 py-32 select-none pointer-events-none">
                      <div className="w-20 h-1 bg-white/40 mb-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                        Sector Clear
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;

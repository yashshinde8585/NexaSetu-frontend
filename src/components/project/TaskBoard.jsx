import React, { useState } from 'react';
import TaskCard from './TaskCard';

/**
 * Tactical Kanban Board.
 * Implements a high-density, status-driven workspace for task orchestration.
 */
const TaskBoard = ({
  groupedTasks,
  user,
  columns,
  handleStatusChange,
  onTaskClick,
}) => {
  const [pageState, setPageState] = useState({});
  const ITEMS_PER_PAGE = 10;

  const handlePageChange = (columnId, newPage) => {
    setPageState((prev) => ({ ...prev, [columnId]: newPage }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
      {columns.map((column) => {
        const currentTasks = groupedTasks[column.id] || [];
        const totalPages = Math.ceil(currentTasks.length / ITEMS_PER_PAGE) || 1;
        const currentPage = Math.min(pageState[column.id] || 1, totalPages);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedTasks = currentTasks.slice(
          startIndex,
          startIndex + ITEMS_PER_PAGE
        );

        return (
          <div 
            key={column.id} 
            className="flex-1 min-w-[280px] flex flex-col h-full bg-white/[0.04] border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Column Header */}
            <div className={`p-5 border-b-2 border-white/10 ${column.color.replace('text-', 'bg-')}/10 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${column.color.replace('text-', 'bg-')} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-white/90">{column.title}</h3>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/20 text-[9px] font-black text-white/70">
                  {currentTasks.length}
                </span>
              </div>
            </div>
            
            <div className="p-3 space-y-4 flex-grow">
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    user={user}
                    columns={columns}
                    handleStatusChange={handleStatusChange}
                    onTaskClick={onTaskClick}
                  />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 grayscale">
                   <div className="w-12 h-1 bg-white/40 mb-2 rounded-full" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Zone Clear</span>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mx-6 mb-6 mt-2 flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(column.id, currentPage - 1)}
                  className="text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 disabled:opacity-20 rounded-lg hover:bg-white/10 transition-colors text-white/60"
                >
                  Prev
                </button>
                <span className="text-[9px] text-white/40 font-black tracking-[0.3em] uppercase">
                  {currentPage} — {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(column.id, currentPage + 1)}
                  className="text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 disabled:opacity-20 rounded-lg hover:bg-white/10 transition-colors text-white/60"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoard;

import React, { useState } from 'react';
import TaskCard from './TaskCard';

const TaskBoard = ({ groupedTasks, user, columns, handleStatusChange }) => {
  const [pageState, setPageState] = useState({});
  const ITEMS_PER_PAGE = 10;

  const handlePageChange = (columnId, newPage) => {
    setPageState(prev => ({ ...prev, [columnId]: newPage }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
      {columns.map(column => {
        const currentTasks = groupedTasks[column.id] || [];
        const totalPages = Math.ceil(currentTasks.length / ITEMS_PER_PAGE) || 1;
        const currentPage = Math.min(pageState[column.id] || 1, totalPages);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedTasks = currentTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        return (
          <div key={column.id} className="bg-background-dark/50 rounded-xl border border-background-light/20 flex flex-col min-h-[400px]">
            <div className={`sticky top-40 z-30 bg-background/90 backdrop-blur-md pt-4 px-4 pb-2 border-b-2 rounded-t-xl flex justify-between items-end text-sm font-bold uppercase tracking-wider shadow-sm ${column.color}`}>
              <span>{column.title}</span>
              <span className="text-text-muted text-[10px] bg-background-light px-2 py-0.5 rounded-full">{currentTasks.length}</span>
            </div>
            <div className="p-4 space-y-3 flex-grow">
              {paginatedTasks.map(task => (
                <TaskCard key={task._id} task={task} user={user} columns={columns} handleStatusChange={handleStatusChange} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mx-4 mb-4 mt-1 flex items-center justify-between pt-3 border-t border-white/5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(column.id, currentPage - 1)}
                  className="text-xs px-3 py-1 bg-background-light disabled:opacity-30 rounded hover:bg-white/10 transition-colors text-text-muted font-bold"
                >
                  Prev
                </button>
                <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(column.id, currentPage + 1)}
                  className="text-xs px-3 py-1 bg-background-light disabled:opacity-30 rounded hover:bg-white/10 transition-colors text-text-muted font-bold"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )})}
    </div>
  );
};

export default TaskBoard;

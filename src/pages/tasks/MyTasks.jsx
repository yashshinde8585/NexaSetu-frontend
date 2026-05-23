import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TASK_STATUS } from '../../constants';
import useTasks from '../../hooks/useTasks';
import TaskCard from '../../components/organisms/TaskCard';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import CenteredLoading from '../../components/atoms/CenteredLoading';

const CARDS_PER_PAGE = 16;

// A task management page that allows users to filter, search, and track their assigned or workspace missions.
const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Set the initial filter and scope based on the URL parameters.
  const queryFilter = searchParams.get('filter') || 'active';
  const queryUserId = searchParams.get('userId');
  const queryScope = queryUserId
    ? 'workspace'
    : searchParams.get('scope') || 'personal';

  // Manage task data and logic using a custom hook.
  const {
    tasks,
    loading,
    filter,
    setFilter,
    scope,
    setScope,
    search,
    setSearch,
    handleStatusChange,
  } = useTasks(queryScope, queryFilter, queryUserId);

  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the filter/scope/search changes
  useEffect(() => {
    setPage(1);
  }, [filter, scope, search]);

  // Update the URL parameters whenever the filter or scope changes.
  useEffect(() => {
    setSearchParams({ filter, scope });
  }, [filter, scope, setSearchParams]);

  const totalPages = Math.max(1, Math.ceil(tasks.length / CARDS_PER_PAGE));
  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * CARDS_PER_PAGE;
    return tasks.slice(start, start + CARDS_PER_PAGE);
  }, [tasks, page]);

  if (loading) return <CenteredLoading />;

  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-6 animate-in fade-in duration-700">
      {/* Page header with the title and description. */}
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-[14px] font-black tracking-widest uppercase text-white">
            {scope === 'personal' ? 'MY MISSIONS' : 'WORKSPACE MISSIONS'}
          </h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] max-w-xl">
            {scope === 'personal'
              ? 'MANAGE AND TRACK YOUR ASSIGNED TASKS ACROSS ALL ACTIVE PROJECTS.'
              : 'OVERVIEW OF ALL TACTICAL DIRECTIVES ACROSS THE ENTIRE WORKSPACE.'}
          </p>
        </div>

        {/* Buttons to switch between different task scopes. */}
        <div className="flex bg-black border border-white/10 rounded p-1 shrink-0 h-fit mb-1 gap-1">
          {[
            { id: 'personal', label: 'My Tasks' },
            { id: 'workspace', label: 'Overall Tasks' },
          ].map((s) => (
            <Button
              key={s.id}
              variant={scope === s.id ? 'primary' : 'ghost'}
              size="sm"
              className={`rounded text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap !shadow-none px-4 py-1.5 ${
                scope === s.id
                  ? 'bg-primary text-black'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setScope(s.id)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Sub-toolbar */}
      <div className="flex flex-col md:flex-row gap-4 p-1 justify-between items-center border-b border-white/10 pb-4">
        <div className="relative w-full md:w-80 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors z-10"
            size={14}
          />
          <input
            type="text"
            placeholder="SEARCH MISSIONS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 bg-black border border-white/10 text-white rounded px-4 pl-10 focus:outline-none focus:border-primary/50 transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-white/10"
          />
        </div>

        <div className="flex bg-black border border-white/10 rounded p-1 shrink-0 overflow-x-auto max-w-full no-scrollbar gap-1 w-full md:w-auto">
          {[
            'active',
            'in_review',
            'completed',
            'due',
            'todo',
            'in_progress',
            'all',
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-primary/20 border border-primary text-primary shadow-none'
                  : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {f === 'active'
                ? 'Active'
                : f === 'completed'
                  ? 'Completed'
                  : f === 'due'
                    ? 'Critical Blockers'
                    : f === TASK_STATUS.TODO
                      ? 'To Do'
                      : f === TASK_STATUS.IN_REVIEW
                        ? 'In Review'
                        : f === TASK_STATUS.IN_PROGRESS
                          ? 'In Progress'
                          : 'All Tasks'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of task cards based on the selected filters. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedTasks.length > 0 ? (
          paginatedTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onNavigate={() => navigate(`/task/${task._id}`)}
              onStatusChange={handleStatusChange}
              showAssignedUser={scope === 'workspace'}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white/5 border border-dashed border-white/10 rounded-xl animate-in zoom-in-95 duration-500">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4 opacity-80" />
            <h3 className="text-[14px] font-black text-white tracking-widest uppercase">
              {filter === 'due'
                ? 'No Critical Blockers'
                : filter === 'completed'
                  ? 'No Completed Tasks'
                  : filter === 'in_review'
                    ? 'No Tasks to Review'
                    : filter === 'active'
                      ? 'No Active Tasks'
                      : 'All Clear'}
            </h3>
            <p className="text-white/50 font-black uppercase tracking-widest text-[10px] mt-4">
              {filter === 'due'
                ? 'ALL YOUR PENDING ITEMS ARE CURRENTLY ON SCHEDULE.'
                : filter === 'completed'
                  ? "YOU HAVEN'T FINALIZED ANY TASKS IN THIS VIEW YET."
                  : filter === 'in_review'
                    ? 'YOU ARE ALL CAUGHT UP WITH YOUR TEAM REVIEWS.'
                    : 'YOUR WORKSPACE IS FULLY SYNCHRONIZED AND UP TO DATE.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination bar — only shown when there are multiple pages */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
            {(page - 1) * CARDS_PER_PAGE + 1}–
            {Math.min(page * CARDS_PER_PAGE, tasks.length)} of {tasks.length}{' '}
            missions
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 border border-white/10 bg-white/5 text-white/40 hover:text-white disabled:opacity-20 transition-colors cursor-pointer rounded-none"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 border border-white/10 bg-white/5 text-white/40 hover:text-white disabled:opacity-20 transition-colors cursor-pointer rounded-none"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;

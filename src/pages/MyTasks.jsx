import React, { useEffect } from 'react';
import { CheckCircle2, Search } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TASK_STATUS } from '../constants';
import useTasks from '../hooks/useTasks';
import TaskCard from '../components/organisms/TaskCard';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import CenteredLoading from '../components/atoms/CenteredLoading';

// A task management page that allows users to filter, search, and track their assigned or workspace missions.
const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Set the initial filter and scope based on the URL parameters.
  const queryFilter = searchParams.get('filter') || 'active';
  const queryUserId = searchParams.get('userId');
  const queryScope = queryUserId ? 'workspace' : (searchParams.get('scope') || 'personal');

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

  // Update the URL parameters whenever the filter or scope changes.
  useEffect(() => {
    setSearchParams({ filter, scope });
  }, [filter, scope, setSearchParams]);

  if (loading) return <CenteredLoading />;

  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-4 bg-black min-h-screen animate-in fade-in duration-700">
      {/* Page header with the title and description. */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
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
        <div className="flex bg-black border border-white/10 rounded-lg p-0.5 shrink-0 h-fit">
          {[
            { id: 'personal', label: 'My Tasks' },
            { id: 'workspace', label: 'Overall Tasks' },
          ].map((s) => (
            <button
              key={s.id}
              className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                scope === s.id
                  ? 'bg-primary text-black'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setScope(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-toolbar: Unified Filter Command Bar */}
      <div className="flex flex-col xl:flex-row gap-3 p-1 justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl px-2 py-2">
        <div className="relative w-full xl:w-96 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors z-10"
            size={14}
          />
          <input
            type="text"
            placeholder="FILTER MISSIONS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 text-white rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-primary/40 transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-white/10"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar pb-1 xl:pb-0">
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
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                filter === f
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'bg-transparent border-transparent text-white/30 hover:text-white hover:bg-white/5'
              }`}
            >
              {f === 'active'
                ? 'Active'
                : f === 'completed'
                  ? 'Completed'
                  : f === 'due'
                    ? 'Critical'
                    : f === TASK_STATUS.TODO
                      ? 'To Do'
                      : f === TASK_STATUS.IN_REVIEW
                        ? 'In Review'
                        : f === TASK_STATUS.IN_PROGRESS
                          ? 'In Progress'
                          : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of task cards based on the selected filters. */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onNavigate={() => navigate(`/task/${task._id}`)}
              onStatusChange={handleStatusChange}
              showAssignedUser={scope === 'workspace'}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-black border border-dashed border-white/10 rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-status-success mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-black text-white/40 uppercase tracking-widest">
              {filter === 'due'
                ? 'No Critical Blockers'
                : filter === 'completed'
                  ? 'No Completed Tasks'
                  : 'Sector Clear'}
            </h3>
            <p className="text-white/20 font-black uppercase tracking-[0.2em] text-[8px] mt-2">
              ALL TACTICAL DIRECTIVES ARE SYNCHRONIZED.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;

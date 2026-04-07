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
  const queryScope = searchParams.get('scope') || 'personal';

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
  } = useTasks(queryScope, queryFilter);

  // Update the URL parameters whenever the filter or scope changes.
  useEffect(() => {
    setSearchParams({ filter, scope });
  }, [filter, scope, setSearchParams]);

  if (loading) return <CenteredLoading />;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 py-10 space-y-12 animate-in fade-in duration-700">
      {/* Page header with the title and description. */}
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
            {scope === 'personal' ? 'My Missions' : 'Workspace Missions'}
          </h1>
          <p className="text-text-muted text-sm md:text-base font-medium opacity-60 leading-relaxed max-w-2xl">
            {scope === 'personal'
              ? 'Manage and track your assigned tasks across all active projects.'
              : 'Overview of all tactical directives across the entire workspace.'}
          </p>
        </div>

        {/* Buttons to switch between different task scopes. */}
        <div className="flex glass border border-white/5 rounded-2xl p-1 shrink-0 h-fit mb-1">
          {[
            { id: 'personal', label: 'My Tasks' },
            { id: 'workspace', label: 'Overall Tasks' },
          ].map((s) => (
            <Button
              key={s.id}
              variant={scope === s.id ? 'primary' : 'ghost'}
              size="sm"
              className={`rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap !shadow-none ${
                scope === s.id
                  ? 'scale-105'
                  : 'text-text-muted hover:text-white'
              }`}
              onClick={() => setScope(s.id)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Sub-toolbar */}
      <div className="flex flex-col md:flex-row gap-6 p-1 justify-between items-center border-b border-white/5 pb-8">
        <div className="relative w-full md:w-96 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors z-10"
            size={16}
          />
          <Input
            placeholder="Search missions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 py-3 rounded-2xl"
          />
        </div>

        <div className="flex bg-white/[0.02] border border-white/5 rounded-2xl p-1 shrink-0 overflow-x-auto max-w-full no-scrollbar">
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
              className={`px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-primary/20 border border-primary/30 text-primary shadow-lg shadow-primary/10'
                  : 'text-text-muted hover:text-white hover:bg-white/5'
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
          <div className="col-span-full py-32 text-center glass border border-dashed border-white/5 rounded-[3rem]">
            <CheckCircle2 className="w-16 h-16 text-status-success mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
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
            <p className="text-text-muted font-bold uppercase tracking-widest text-[10px] mt-2">
              {filter === 'due'
                ? 'All your pending items are currently on schedule.'
                : filter === 'completed'
                  ? "You haven't finalized any tasks in this view yet."
                  : filter === 'in_review'
                    ? 'You are all caught up with your team reviews.'
                    : 'Your workspace is fully synchronized and up to date.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;

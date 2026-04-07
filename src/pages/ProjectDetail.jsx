import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjectManagement } from '../hooks/useProjectManagement';
import { TICKETS_PROJECT_ID, TASK_STATUS } from '../constants';

// Components
import GithubPanel from '../components/project/GithubPanel';
import AIExtractionPanel from '../components/project/AIExtractionPanel';
import TaskBoard from '../components/project/TaskBoard';
import TaskForm from '../components/project/TaskForm';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import CenteredLoading from '../components/atoms/CenteredLoading';

// Project board with task management and AI analysis.
const ProjectDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Orchestration hooks
  const {
    project,
    analytics,
    isLoading,
    error,
    ui,
    statusMutation,
    createTaskMutation,
    groupedTasks,
    ai,
    github,
    sprints,
    updateProjectMutation,
    newTask,
    setNewTask,
    queryClient,
  } = useProjectManagement(id, user);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [assigneeFilter, setAssigneeFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('all');

  // Get unique assignees
  const allAssignees = React.useMemo(() => {
    const map = new Map();
    const allTasks = [
      ...groupedTasks[TASK_STATUS.TODO],
      ...groupedTasks[TASK_STATUS.IN_PROGRESS],
      ...groupedTasks[TASK_STATUS.IN_REVIEW],
      ...groupedTasks[TASK_STATUS.DONE],
    ];
    allTasks.forEach((t) => {
      if (t.assignedUser?._id) {
        map.set(t.assignedUser._id, t.assignedUser);
      }
    });
    return Array.from(map.values());
  }, [groupedTasks]);

  // Filter helpers
  const getDateStart = (filter) => {
    const now = new Date();
    if (filter === 'week') {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      return start;
    }
    if (filter === 'month') {
      const start = new Date(now);
      start.setMonth(now.getMonth() - 1);
      return start;
    }
    return null;
  };

  const hasActiveFilters =
    assigneeFilter !== 'all' || dateFilter !== 'all' || searchTerm.trim() !== '';

  const clearAllFilters = () => {
    setSearchTerm('');
    setAssigneeFilter('all');
    setDateFilter('all');
  };

  const DATE_OPTIONS = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const filteredGroupedTasks = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const dateStart = getDateStart(dateFilter);

    const filterFn = (t) => {
      // Search content
      if (term) {
        const matches =
          t.title?.toLowerCase().includes(term) ||
          t.description?.toLowerCase().includes(term) ||
          t.assignedUser?.name?.toLowerCase().includes(term) ||
          t.taskNumber?.toString().includes(term);
        if (!matches) return false;
      }

      // Filter assignees
      if (assigneeFilter !== 'all') {
        if (t.assignedUser?._id !== assigneeFilter) return false;
      }

      // Filter dates
      if (dateStart) {
        const taskDate = new Date(t.createdAt);
        if (taskDate < dateStart) return false;
      }

      return true;
    };

    return {
      [TASK_STATUS.TODO]: groupedTasks[TASK_STATUS.TODO].filter(filterFn),
      [TASK_STATUS.IN_PROGRESS]: groupedTasks[TASK_STATUS.IN_PROGRESS].filter(filterFn),
      [TASK_STATUS.IN_REVIEW]: groupedTasks[TASK_STATUS.IN_REVIEW].filter(filterFn),
      [TASK_STATUS.DONE]: groupedTasks[TASK_STATUS.DONE].filter(filterFn),
    };
  }, [groupedTasks, searchTerm, assigneeFilter, dateFilter]);

  const isTicketView = id === TICKETS_PROJECT_ID;

  const columns = isTicketView
    ? [
        {
          id: TASK_STATUS.TODO,
          title: 'To Do',
          color: 'border-status-error text-status-error',
        },
        {
          id: TASK_STATUS.IN_PROGRESS,
          title: 'In Progress',
          color: 'border-status-warning text-status-warning',
        },
        {
          id: TASK_STATUS.IN_REVIEW,
          title: 'In Review',
          color: 'border-secondary text-secondary',
        },
        {
          id: TASK_STATUS.DONE,
          title: 'Done',
          color: 'border-status-success text-status-success',
        },
      ]
    : [
        {
          id: TASK_STATUS.TODO,
          title: 'To-do',
          color: 'border-status-info text-status-info',
        },
        {
          id: TASK_STATUS.IN_PROGRESS,
          title: 'In Progress',
          color: 'border-status-warning text-status-warning',
        },
        {
          id: TASK_STATUS.IN_REVIEW,
          title: 'In Review',
          color: 'border-secondary text-secondary',
        },
        {
          id: TASK_STATUS.DONE,
          title: 'Done',
          color: 'border-status-success text-status-success',
        },
      ];

  if (isLoading) return <CenteredLoading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10 space-y-8">
      {error && (
        <div className="bg-status-error/20 border border-status-error text-status-error px-4 py-3 rounded mb-4 animate-in fade-in duration-300">
          <span className="font-bold uppercase text-[10px] tracking-widest block mb-1">
            Access Failure
          </span>
          <p className="text-xs">
            {error.message ||
              (typeof error === 'object' ? JSON.stringify(error) : error)}
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-primary font-bold text-lg sm:text-xl shadow-lg shrink-0">
            {isTicketView ? 'T' : project?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-white/90 truncate max-w-[200px] sm:max-w-md">
              {project?.name}
            </h1>
            <div className="flex items-center gap-4">
              {project?.createdBy?.name && (
                <span className="text-[9px] sm:text-[10px] font-black text-text-muted uppercase tracking-wider">
                  Lead: {project.createdBy.name}
                </span>
              )}
              {!isTicketView && user?.role !== 'INTERN' && (
                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                  <span className="text-[9px] font-black text-text-muted/40 uppercase tracking-widest">
                    Sprint
                  </span>
                  <select
                    className="bg-transparent text-[10px] font-bold text-primary focus:outline-none cursor-pointer hover:underline"
                    value={project?.sprint || ''}
                    onChange={(e) =>
                      updateProjectMutation.mutate({ sprint: e.target.value })
                    }
                  >
                    <option value="" className="bg-[#1E1E2E]">
                      None
                    </option>
                    {(sprints || []).map((s) => (
                      <option
                        key={s._id}
                        value={s._id}
                        className="bg-[#1E1E2E]"
                      >
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {[
            'CTO',
            'VP Engineering',
            'Engineering Manager',
            'Tech Lead',
          ].includes(user?.jobTitle) &&
            !isTicketView && (
              <button
                onClick={() => ui.setShowGithubPanel(!ui.showGithubPanel)}
                className={`flex-1 sm:flex-none h-11 px-4 sm:px-6 bg-background-light hover:bg-background-dark text-text-muted hover:text-primary font-bold text-xs sm:text-sm rounded-xl transition duration-200 border border-background-dark/30 shadow-md flex items-center justify-center gap-2 ${ui.showGithubPanel ? 'ring-2 ring-primary border-primary' : ''}`}
              >
                <span className="text-base sm:text-lg"></span>{' '}
                <span className="hidden sm:inline">Github</span>{' '}
                {project?.githubRepo ? '· ' + project.githubRepo.repo : ''}
              </button>
            )}
          <button
            onClick={() => ui.setShowAiInput(!ui.showAiInput)}
            className={`flex-1 sm:flex-none h-11 px-4 sm:px-6 bg-secondary hover:bg-secondary-light text-white font-bold text-xs sm:text-sm rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 ${ui.showAiInput ? 'ring-2 ring-primary' : ''}`}
          >
            <span className="hidden sm:inline">
              {isTicketView ? 'AI Task Generator' : 'AI Analysis'}
            </span>
            <span className="sm:hidden">AI</span>
          </button>
          <button
            onClick={() => ui.setShowTaskForm(!ui.showTaskForm)}
            className="flex-1 sm:flex-none h-11 px-4 sm:px-6 bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm rounded-xl transition duration-200 shadow-md whitespace-nowrap"
          >
            {ui.showTaskForm
              ? 'Cancel'
              : isTicketView
                ? 'Create Ticket'
                : 'Add Task'}
          </button>
        </div>
      </div>

      {ui.showGithubPanel &&
        ['CTO', 'VP Engineering', 'Engineering Manager', 'Tech Lead'].includes(
          user?.jobTitle
        ) && (
          <GithubPanel
            project={project}
            githubConnected={github.connected}
            githubToken={github.token}
            setGithubToken={github.setToken}
            handleConnectGithub={github.connect}
            repos={github.repos}
            loadingRepos={github.loadingRepos}
            handleLinkRepo={github.linkRepo}
            fetchRepos={github.fetchRepos}
            githubSuggestions={github.suggestions}
            fetchGithubActivity={github.syncActivity}
            isFetchingGithub={github.isFetchingActivity}
            handleApproveGithubTask={(s) => github.approveTasks([s])}
            handleApproveAllGithubTasks={() =>
              github.approveTasks(github.suggestions)
            }
            setProject={(proj) =>
              queryClient.setQueryData(['project', id], proj)
            }
            setGithubSuggestions={github.setSuggestions}
          />
        )}

      {ui.showAiInput && (
        <AIExtractionPanel
          aiInput={ai.input}
          setAiInput={ai.setInput}
          handleAiExtract={ai.extract}
          isAiProcessing={ai.processing}
          aiSuggestion={ai.suggestion}
          setAiSuggestion={ai.setSuggestion}
          handleCreateTask={(task) => createTaskMutation.mutate(task)}
          project={project}
          sprints={sprints}
        />
      )}

      {ui.showTaskForm && (
        <TaskForm
          sprints={sprints}
          newTask={newTask}
          setNewTask={setNewTask}
          handleCreateTask={(task) => createTaskMutation.mutate(task)}
        />
      )}

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl px-4 h-14 shadow-inner focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">


          <Search size={16} className="text-text-muted/40 shrink-0" />
          <input
            type="text"
            placeholder="Search by title, description, assignee, or ticket number..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-text-muted/30 focus:outline-none min-w-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 shrink-0" />

          <select
            id="filter-assignee"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-text-muted focus:outline-none cursor-pointer hover:text-white transition-colors shrink-0"
          >
            <option value="all" className="bg-[#1E1E2E]">Everyone</option>
            <option value={user?._id} className="bg-[#1E1E2E]">My Tasks</option>
          </select>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 shrink-0" />

          <div className="flex items-center gap-1.5 shrink-0">
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                id={`filter-date-${opt.value}`}
                onClick={() => setDateFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-150 whitespace-nowrap ${
                  dateFilter === opt.value
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <>
              <div className="w-px h-6 bg-white/10 shrink-0" />
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-bold uppercase tracking-widest text-text-muted/40 hover:text-status-error transition-colors shrink-0"
              >
                ✕ Clear
              </button>
            </>
          )}
        </div>
      </div>

      <TaskBoard
        groupedTasks={filteredGroupedTasks}
        user={user}
        columns={columns}
        handleStatusChange={(taskId, status) =>
          statusMutation.mutate({ taskId, status })
        }
        onTaskClick={(task) => navigate(`/task/${task._id}`)}
      />
    </div>
  );
};

export default ProjectDetail;

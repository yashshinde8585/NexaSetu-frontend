import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  GitBranch, 
  Sparkles, 
  Search, 
  LayoutGrid, 
  List, 
  X as CloseIcon, 
  ChevronDown, 
  Users, 
  Calendar,
  Settings,
  MoreVertical,
  ChevronLeft, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjectManagement } from '../hooks/useProjectManagement';
import { TICKETS_PROJECT_ID, TASK_STATUS } from '../constants';
import { USER_ROLES } from '../constants/auth';

// Clean UI Components
import GithubPanel from '../components/project/GithubPanel';
import AIExtractionPanel from '../components/project/AIExtractionPanel';
import TaskBoard from '../components/project/TaskBoard';
import TaskTable from '../components/project/TaskTable';
import TaskForm from '../components/project/TaskForm';
import CenteredLoading from '../components/atoms/CenteredLoading';
import Button from '../components/atoms/Button';
import { ResilientPage } from '../components/states';

const ProjectDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Core Management Engine
  const {
    project,
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
    setNewTask,
    newTask,
    queryClient,
    directives
  } = useProjectManagement(id, user);

  const activeStabilize = directives?.find(d => d.type === 'STABILIZE' && d.status === 'issued');
  const isManager = user?.role === USER_ROLES.TECH_LEAD || user?.role === USER_ROLES.WORKSPACE_ADMIN;
  const isProjectLocked = !!activeStabilize && !isManager;

  const [searchTerm, setSearchTerm] = React.useState('');
  const [assigneeFilter, setAssigneeFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('all');
  const [cardLayout, setCardLayout] = React.useState('standard');
  const [activeDropdown, setActiveDropdown] = React.useState(null); // 'operator' | 'date' | 'layout' | 'sprint' | 'pagesize' | null

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClick = () => setActiveDropdown(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const DATE_OPTIONS = [
    { value: 'all', label: 'ALL TIME' },
    { value: 'week', label: 'THIS WEEK' },
    { value: 'month', label: 'THIS MONTH' },
  ];

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

  const hasActiveFilters = assigneeFilter !== 'all' || dateFilter !== 'all' || searchTerm.trim() !== '';

  const clearAllFilters = () => {
    setSearchTerm('');
    setAssigneeFilter('all');
    setDateFilter('all');
  };

  const filteredGroupedTasks = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const dateStart = getDateStart(dateFilter);

    const filterFn = (t) => {
      if (term) {
        const matches =
          t.title?.toLowerCase().includes(term) ||
          t.description?.toLowerCase().includes(term) ||
          t.assignedUser?.name?.toLowerCase().includes(term) ||
          t.taskNumber?.toString().includes(term);
        if (!matches) return false;
      }
      if (assigneeFilter !== 'all' && t.assignedUser?._id !== assigneeFilter) return false;
      if (dateStart && new Date(t.createdAt) < dateStart) return false;
      return true;
    };

    return {
      [TASK_STATUS.TODO]: (groupedTasks[TASK_STATUS.TODO] || []).filter(filterFn),
      [TASK_STATUS.IN_PROGRESS]: (groupedTasks[TASK_STATUS.IN_PROGRESS] || []).filter(filterFn),
      [TASK_STATUS.IN_REVIEW]: (groupedTasks[TASK_STATUS.IN_REVIEW] || []).filter(filterFn),
      [TASK_STATUS.DONE]: (groupedTasks[TASK_STATUS.DONE] || []).filter(filterFn),
    };
  }, [groupedTasks, searchTerm, assigneeFilter, dateFilter]);

  const filteredTasks = React.useMemo(() => {
    const allTasks = Object.values(filteredGroupedTasks).flat();
    
    // Sort strictly by Ticket ID (taskNumber) in descending order
    return [...allTasks].sort((a, b) => {
      const numA = parseInt(a.taskNumber, 10) || 0;
      const numB = parseInt(b.taskNumber, 10) || 0;
      return numB - numA;
    });
  }, [filteredGroupedTasks]);

  // Tactical Pagination Logic
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const totalTasks = filteredTasks.length;
  const totalPages = Math.ceil(totalTasks / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalTasks);
  
  const paginatedTasks = React.useMemo(() => {
    return filteredTasks.slice(startIndex, endIndex);
  }, [filteredTasks, startIndex, endIndex]);

  const paginatedGroupedTasks = React.useMemo(() => {
    // For Board view, we show all columns but limit total visible tasks if needed.
    // However, usually boards don't paginate well. 
    // We'll show the grouped version of paginatedTasks to keep it consistent.
    const result = {
      [TASK_STATUS.TODO]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.IN_REVIEW]: [],
      [TASK_STATUS.DONE]: [],
    };
    
    paginatedTasks.forEach(task => {
      if (result[task.status]) result[task.status].push(task);
    });
    
    return result;
  }, [paginatedTasks]);

  // Sync: Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, assigneeFilter, dateFilter]);

  const isTicketView = id === TICKETS_PROJECT_ID;

  const columns = [
    { id: TASK_STATUS.TODO, title: isTicketView ? 'OPEN TICKETS' : 'TO-DO', color: 'border-status-error text-status-error' },
    { id: TASK_STATUS.IN_PROGRESS, title: 'IN PROGRESS', color: 'border-status-warning text-status-warning' },
    { id: TASK_STATUS.IN_REVIEW, title: 'IN REVIEW', color: 'border-secondary text-secondary' },
    { id: TASK_STATUS.DONE, title: isTicketView ? 'RESOLVED' : 'DONE', color: 'border-status-success text-status-success' },
  ];

  return (
    <ResilientPage 
      isLoading={isLoading} 
      error={error}
      onRetry={() => queryClient.invalidateQueries({ queryKey: ['project', id] })}
    >
      <div className="min-h-screen bg-black text-white px-3 sm:px-4 lg:px-6 py-4">
        <div className="w-full space-y-6 max-w-7xl mx-auto">

        {/* --- DIRECTIVE ENFORCEMENT HUD --- */}
        {activeStabilize && (
          <div className="bg-status-error/10 border-2 border-status-error/50 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="bg-status-error p-3 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                <ShieldAlert className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-[12px] font-black text-status-error uppercase tracking-[0.3em]">ACTIVE DIRECTIVE: STABILIZE</h2>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{activeStabilize.title}</p>
              </div>
            </div>
            <div className="bg-status-error/20 px-4 py-2 rounded-xl border border-status-error/30">
              <span className="text-[9px] font-black text-status-error uppercase tracking-widest">
                SYSTEM LOCK: NEW TASKS DISABLED • ONLY REVIEWS ALLOWED
              </span>
            </div>
          </div>
        )}

        {/* High-Contrast Tactical Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b border-white/10">
          <div className="space-y-4 flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3">
            </div>
            
            {/* Project Name Removed */}

            <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex flex-col gap-1.5 relative" onClick={(e) => e.stopPropagation()}>
                   <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">ACTIVE SPRINT</span>
                   <button
                     disabled={isProjectLocked}
                     onClick={() => setActiveDropdown(activeDropdown === 'sprint' ? null : 'sprint')}
                     className={`flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded hover:bg-white/10 transition-all group ${isProjectLocked ? 'opacity-20 cursor-not-allowed' : ''}`}
                   >
                      <Calendar size={12} className="text-primary-light" />
                      <span className="text-[11px] font-black text-white uppercase tracking-tight">
                        {sprints?.find(s => s._id === project?.sprint)?.name || 'NO SPRINT'}
                      </span>
                      {!isProjectLocked && <ChevronDown size={12} className={`text-white/40 transition-transform ${activeDropdown === 'sprint' ? 'rotate-180' : ''}`} />}
                   </button>

                       {activeDropdown === 'sprint' && !isProjectLocked && (
                         <div className="absolute top-full left-0 mt-2 w-64 bg-[#141414] border-2 border-white/20 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[70] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                           <div className="p-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                             <button
                               onClick={() => { updateProjectMutation.mutate({ sprint: null }); setActiveDropdown(null); }}
                               className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${
                                 !project?.sprint ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
                               }`}
                             >
                               NO SPRINT SELECTED
                             </button>
                             {(sprints || []).map((s) => (
                               <button
                                 key={s._id}
                                 onClick={() => { updateProjectMutation.mutate({ sprint: s._id }); setActiveDropdown(null); }}
                                 className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${
                                   project?.sprint === s._id ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
                                 }`}
                               >
                                 {s.name}
                               </button>
                             ))}
                           </div>
                         </div>
                       )}
                </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
             {!isTicketView && isManager && (
                <button
                  onClick={() => ui.setShowGithubPanel(!ui.showGithubPanel)}
                  className={`h-9 px-4 rounded border font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2 ${
                    ui.showGithubPanel ? 'bg-white text-black border-white' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  {ui.showGithubPanel ? <CloseIcon size={14} /> : <GitBranch size={14} />}
                  {ui.showGithubPanel ? 'ABORT' : 'REPO'}
                </button>
             )}

             <button
               disabled={isProjectLocked}
               onClick={() => ui.setShowAiInput(!ui.showAiInput)}
               className={`h-9 px-4 rounded border font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2 ${isProjectLocked ? 'opacity-20 cursor-not-allowed' : ''} ${
                 ui.showAiInput 
                   ? 'bg-status-error text-white border-status-error' 
                   : 'bg-primary text-black border-primary'
               }`}
             >
               {ui.showAiInput ? <CloseIcon size={14} /> : <Sparkles size={14} />}
               {ui.showAiInput ? 'ABORT' : (isTicketView ? 'AI GEN' : 'AI TASK')}
             </button>
             
             <button
                disabled={isProjectLocked}
                onClick={() => ui.setShowTaskForm(!ui.setShowTaskForm)}
                className={`h-9 px-4 rounded border font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-all active:scale-95 ${isProjectLocked ? 'opacity-20 cursor-not-allowed' : ''} ${
                  ui.showTaskForm
                    ? 'bg-status-error text-white border-status-error'
                    : 'bg-primary text-black border-primary hover:bg-primary/90'
                }`}
              >
                {ui.showTaskForm ? <CloseIcon size={14} /> : <Plus size={14} strokeWidth={3} />}
                {ui.showTaskForm ? 'ABORT' : (isTicketView ? 'NEW TICKET' : 'NEW TASK')}
              </button>

             {!isTicketView && (
                <button
                  onClick={() => navigate(`/war-room/${id}`)}
                  className="h-9 px-4 rounded border border-secondary text-secondary bg-secondary/5 font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 transition-all hover:bg-secondary hover:text-white"
                >
                  <Zap size={14} />
                  WAR ROOM
                </button>
             )}
          </div>
        </div>

        {/* Dynamic Context Panels */}
        {(ui.showGithubPanel || ui.showAiInput || ui.showTaskForm) && (
          <div className="space-y-6">
             {ui.showGithubPanel && (
                <div>
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
                     handleApproveAllGithubTasks={() => github.approveTasks(github.suggestions)}
                     setProject={(proj) => queryClient.setQueryData(['project', id], proj)}
                     setGithubSuggestions={github.setSuggestions}
                   />
                </div>
             )}
  
             {ui.showAiInput && (
                <div>
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
                </div>
             )}
  
             {ui.showTaskForm && (
                <div>
                   <TaskForm
                     sprints={sprints}
                     newTask={newTask}
                     setNewTask={setNewTask}
                     handleCreateTask={(task) => createTaskMutation.mutate(task)}
                   />
                </div>
             )}
          </div>
        )}

        {/* Unified Work Console */}
        <div className="space-y-2">
          {/* Tactical Search & Filter Bar */}
          <div className="bg-white/5 border border-white/20 rounded-xl flex flex-row items-center p-1 gap-1 shadow-2xl">
            {/* Primary Search Container - Flexible */}
            <div className="flex-1 flex items-center h-10 bg-white/[0.03] rounded-lg px-3 border border-white/5 focus-within:border-primary/50 transition-all group min-w-0">
              <Search size={14} className="text-white/40 group-focus-within:text-primary shrink-0 transition-colors" />
              <input
                type="text"
                placeholder="SEARCH ENGINE..."
                className="flex-1 bg-transparent px-2 text-[10px] font-black text-white placeholder:text-white/20 focus:outline-none tracking-widest truncate uppercase"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-white/20 hover:text-white transition-colors p-1 hidden sm:block">
                  <CloseIcon size={14} />
                </button>
              )}
            </div>

            {/* Secondary Controls - Custom Icon Bar */}
            <div className="flex items-center gap-1">
              {/* Operator Select */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'operator' ? null : 'operator')}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                    activeDropdown === 'operator' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                  }`}
                >
                  <Users size={14} />
                </button>
                {activeDropdown === 'operator' && (
                  <div className="absolute top-full mt-2 right-0 w-48 bg-[#141414] border-2 border-white/20 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1.5 space-y-1">
                      {[
                        { id: 'all', label: 'ALL OPERATORS' },
                        { id: user?._id, label: 'SELF ONLY' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => { setAssigneeFilter(opt.id); setActiveDropdown(null); }}
                          className={`w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${
                            assigneeFilter === opt.id ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Temporal Dropdown */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'date' ? null : 'date')}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                    activeDropdown === 'date' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                  }`}
                >
                  <Calendar size={14} />
                </button>
                {activeDropdown === 'date' && (
                  <div className="absolute top-full mt-2 right-0 w-48 bg-[#141414] border-2 border-white/20 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1.5 space-y-1">
                      {DATE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setDateFilter(opt.value); setActiveDropdown(null); }}
                          className={`w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${
                            dateFilter === opt.value ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Layout Toggle */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'layout' ? null : 'layout')}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                    activeDropdown === 'layout' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                  }`}
                >
                  {cardLayout === 'list' ? <List size={14} /> : <LayoutGrid size={14} />}
                </button>
                {activeDropdown === 'layout' && (
                  <div className="absolute top-full mt-2 right-0 w-48 bg-[#141414] border-2 border-white/20 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1.5 space-y-1">
                      {[
                        { id: 'standard', label: 'BOARD VIEW', icon: <LayoutGrid size={12} /> },
                        { id: 'list', label: 'LIST VIEW', icon: <List size={12} /> }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => { setCardLayout(opt.id); setActiveDropdown(null); }}
                          className={`w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all flex items-center gap-2.5 ${
                            cardLayout === opt.id ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {opt.icon}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear All - Tactical Reset */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="h-10 w-10 flex items-center justify-center bg-status-error/10 border border-status-error/30 text-status-error rounded-lg hover:bg-status-error hover:text-white transition-all active:scale-95"
                  title="RESET FILTERS"
                >
                  <CloseIcon size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Global Task Execution Engine */}
          <div className="relative z-10 space-y-4">
            {cardLayout === 'list' ? (
              <div className="w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 pb-4 px-1 sm:px-0">
                <div className="min-w-[1000px]">
                  <TaskTable
                    tasks={paginatedTasks}
                    onTaskClick={(task) => navigate(`/task/${task._id}`)}
                    handleStatusChange={(taskId, status) => statusMutation.mutate({ taskId, status })}
                  />
                </div>
              </div>
            ) : (
              <TaskBoard
                groupedTasks={filteredGroupedTasks}
                user={user}
                columns={columns}
                handleStatusChange={(taskId, status) => statusMutation.mutate({ taskId, status })}
                onTaskClick={(task) => navigate(`/task/${task._id}`)}
                cardLayout={cardLayout}
                currentPage={currentPage}
                pageSize={pageSize}
              />
            )}

            {/* Tactical Pagination Interface */}
            {totalTasks > 0 && (
              <div className="flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 mt-4 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                {/* Left: Page Size Selector - Custom UI */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'pagesize' ? null : 'pagesize')}
                    className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-2.5 h-8 hover:border-primary/60 transition-all"
                  >
                    <span className="text-[10px] font-black text-white tracking-tighter">{pageSize}</span>
                    <ChevronDown size={10} className={`text-white/40 transition-transform ${activeDropdown === 'pagesize' ? 'rotate-180' : ''}`} />
                  </button>

                  {activeDropdown === 'pagesize' && (
                    <div className="absolute bottom-full left-0 mb-2 w-20 bg-[#141414] border-2 border-white/20 rounded-xl shadow-2xl z-[70] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-1 space-y-1">
                        {[10, 20, 30].map(size => (
                          <button
                            key={size}
                            onClick={() => { setPageSize(size); setCurrentPage(1); setActiveDropdown(null); }}
                            className={`w-full text-center py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                              pageSize === size ? 'bg-white text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Info & Controls Grouped */}
                <div className="flex items-center gap-1.5">
                  <div className="hidden sm:flex h-8 bg-black/40 border border-white/10 rounded-lg px-3 items-center gap-2 shadow-inner">
                    <span className="text-[10px] font-black text-white">{currentPage}</span>
                    <span className="text-[10px] font-black text-white/40">/</span>
                    <span className="text-[10px] font-black text-white/90">{totalPages}</span>
                  </div>
                  
                  <div className="flex items-center bg-black/40 border border-white/10 rounded-lg overflow-hidden h-8">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="w-8 h-full flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-all disabled:opacity-10 disabled:cursor-not-allowed border-r border-white/10"
                    >
                      <ChevronLeft size={14} strokeWidth={4} />
                    </button>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="w-8 h-full flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-all disabled:opacity-10 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={14} strokeWidth={4} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ResilientPage>
  );
};

export default ProjectDetail;

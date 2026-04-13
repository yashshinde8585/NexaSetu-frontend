import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Activity, GitBranch, Cpu, Plus, Sparkles, X as CloseIcon, User as UserIcon, Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjectManagement } from '../hooks/useProjectManagement';
import { TICKETS_PROJECT_ID, TASK_STATUS } from '../constants';

// Clean UI Components
import GithubPanel from '../components/project/GithubPanel';
import AIExtractionPanel from '../components/project/AIExtractionPanel';
import TaskBoard from '../components/project/TaskBoard';
import TaskForm from '../components/project/TaskForm';
import CenteredLoading from '../components/atoms/CenteredLoading';
import Button from '../components/atoms/Button';

/**
 * High-performance Project Board Interface.
 * Optimized for tactical clarity, high-density orchestration, and sunlight legibility.
 */
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
    newTask,
    setNewTask,
    queryClient,
  } = useProjectManagement(id, user);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [assigneeFilter, setAssigneeFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('all');

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

  const isTicketView = id === TICKETS_PROJECT_ID;

  const columns = [
    { id: TASK_STATUS.TODO, title: isTicketView ? 'OPEN TICKETS' : 'TO-DO', color: 'border-status-error text-status-error' },
    { id: TASK_STATUS.IN_PROGRESS, title: 'IN PROGRESS', color: 'border-status-warning text-status-warning' },
    { id: TASK_STATUS.IN_REVIEW, title: 'IN REVIEW', color: 'border-secondary text-secondary' },
    { id: TASK_STATUS.DONE, title: isTicketView ? 'RESOLVED' : 'DONE', color: 'border-status-success text-status-success' },
  ];

  if (isLoading) return <CenteredLoading />;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 lg:p-12 pr-6 sm:pr-12 lg:pr-20">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* Error Manifest */}
        {error && (
          <div className="p-4 bg-status-error/10 border border-status-error/40 rounded-xl flex items-center gap-4 text-status-error overflow-hidden shadow-2xl">
             <div className="w-1.5 h-10 bg-status-error rounded-full shrink-0" />
             <div className="flex-1">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">System Warning</div>
                <p className="text-xs font-bold leading-relaxed">{error.message || 'Linkage synchronization failed.'}</p>
             </div>
          </div>
        )}

        {/* High-Contrast Tactical Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/15 pb-8">
          <div className="space-y-4 flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3">
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] flex flex-col gap-1">
              {isTicketView && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-secondary/10 border border-secondary/40 rounded text-[9px] font-bold text-secondary uppercase tracking-widest">Global Support</span>
                  <span className="px-2 py-0.5 bg-secondary/10 border border-secondary/40 rounded text-[9px] font-bold text-secondary uppercase tracking-wider">Global Support</span>
                </div>
              )}
              {project?.name || 'Loading Project...'}
            </h1>

            <div className="flex flex-wrap items-center gap-8 pt-2">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Lead Operator</span>
                  <div className="flex items-center gap-2.5">
                     <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white border border-white/20">
                        {project?.lead?.name ? project.lead.name[0].toUpperCase() : 'A'}
                     </div>
                     <span className="text-[13px] font-bold text-white uppercase tracking-tight">{project?.lead?.name || 'ALPH-1'}</span>
                  </div>
               </div>

               <div className="w-px h-10 bg-white/20" />

               {!isTicketView && (
                 <>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Active Sprint</span>
                      <div className="flex items-center gap-2.5">
                         <CalendarIcon size={14} className="text-primary-light" />
                         <select
                           className="bg-transparent text-[13px] font-bold text-white uppercase focus:outline-none cursor-pointer hover:text-primary transition-colors pr-4"
                           value={project?.sprint || ''}
                           onChange={(e) => updateProjectMutation.mutate({ sprint: e.target.value })}
                         >
                           <option value="" className="bg-[#121212]">NO SPRINT SELECTED</option>
                           {(sprints || []).map((s) => (
                             <option key={s._id} value={s._id} className="bg-[#121212]">{s.name}</option>
                           ))}
                         </select>
                      </div>
                   </div>
                 </>
               )}


            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
             {!isTicketView && (
                <button
                  onClick={() => ui.setShowGithubPanel(!ui.showGithubPanel)}
                  className={`flex-1 sm:flex-none h-12 px-8 rounded-xl border font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-3 shadow-xl ${
                    ui.showGithubPanel 
                      ? 'bg-white/20 text-white border-white/40 ring-1 ring-white/20' 
                      : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <GitBranch size={16} /> REPO
                </button>
             )}

             <button
               onClick={() => ui.setShowAiInput(!ui.showAiInput)}
               className={`flex-1 sm:flex-none h-12 px-8 rounded-xl border font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-3 shadow-xl ${
                 ui.showAiInput 
                   ? 'bg-status-success text-black border-status-success shadow-status-success/40' 
                   : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
               }`}
             >
               <Sparkles size={16} /> {isTicketView ? 'AI ASST' : 'AI ENGINE'}
             </button>
             
             <button
                onClick={() => ui.setShowTaskForm(!ui.showTaskForm)}
                className={`flex-1 sm:flex-none h-12 px-8 rounded-xl font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 ${
                  ui.showTaskForm
                    ? 'bg-status-error text-white shadow-status-error/20'
                    : 'bg-primary text-black hover:bg-primary-dark shadow-primary/40'
                }`}
              >
                {ui.showTaskForm ? <CloseIcon size={18} /> : <Plus size={18} strokeWidth={3} />}
                {ui.showTaskForm ? 'ABORT' : (isTicketView ? 'NEW TICKET' : 'NEW TASK')}
              </button>
          </div>
        </div>

        {/* Dynamic Context Panels */}
        <div className="space-y-6">
           {ui.showGithubPanel && (
              <div className="animate-in slide-in-from-top-4 duration-500">
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
              <div className="animate-in slide-in-from-top-4 duration-500">
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
              <div className="animate-in slide-in-from-top-4 duration-500">
                 <TaskForm
                   sprints={sprints}
                   newTask={newTask}
                   setNewTask={setNewTask}
                   handleCreateTask={(task) => createTaskMutation.mutate(task)}
                 />
              </div>
           )}
        </div>

        {/* Tactical Search & Filter Bar */}
        <div className="bg-black border border-white/20 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center p-1.5 gap-1.5 shadow-2xl">
          {/* Primary Search Container - Expanded on Desktop */}
          <div className="flex-1 flex items-center h-12 bg-white/[0.03] rounded-xl px-4 border border-white/5 focus-within:border-primary/50 transition-all group">
            <Search size={16} className="text-white/40 group-focus-within:text-primary shrink-0 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH NOMENCLATURE..."
              className="flex-1 bg-transparent px-3 text-[10px] font-bold text-white uppercase placeholder:text-white/20 focus:outline-none tracking-widest truncate"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-white/20 hover:text-white transition-colors p-1">
                <CloseIcon size={14} />
              </button>
            )}
          </div>

          {/* Secondary Controls - Grid on mobile, Horizontal Flex on desktop */}
          <div className="grid grid-cols-2 md:flex items-center gap-1.5">
            {/* Operator Select */}
            <div className="h-12 bg-white/[0.03] border border-white/5 rounded-xl px-3 flex items-center gap-2 hover:border-white/20 transition-all overflow-hidden">
              <UserIcon size={14} className="text-white/30 shrink-0" />
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="bg-transparent text-[9px] font-black text-white/80 uppercase tracking-widest focus:outline-none cursor-pointer truncate min-w-0"
              >
                <option value="all" className="bg-[#000]">OPERATOR: ALL</option>
                <option value={user?._id} className="bg-[#000]">SELF ONLY</option>
              </select>
            </div>

            {/* Temporal Dropdown */}
            <div className="h-12 bg-white/[0.03] border border-white/5 rounded-xl px-3 flex items-center gap-2 hover:border-white/20 transition-all overflow-hidden">
              <ClockIcon size={14} className="text-white/30 shrink-0" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent text-[9px] font-black text-white/80 uppercase tracking-widest focus:outline-none cursor-pointer truncate min-w-0"
              >
                {DATE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#000]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear All - Full width on smallest mobile, inline on desktop */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="col-span-2 md:col-auto h-12 px-5 bg-status-error/10 border border-status-error/30 text-status-error rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-status-error hover:text-white transition-all active:scale-95"
              >
                RESET
              </button>
            )}
          </div>
        </div>

        {/* Global Task Execution Engine */}
        <div className="relative z-10 animate-in slide-in-from-bottom-6 duration-1000">
           <TaskBoard
             groupedTasks={filteredGroupedTasks}
             user={user}
             columns={columns}
             handleStatusChange={(taskId, status) => statusMutation.mutate({ taskId, status })}
             onTaskClick={(task) => navigate(`/task/${task._id}`)}
           />
        </div>

      </div>
    </div>
  );
};

export default ProjectDetail;

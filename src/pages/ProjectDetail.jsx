import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjectManagement } from '../hooks/useProjectManagement';
import { TICKETS_PROJECT_ID } from '../utils/constants';

// Sub-components
import ProjectAnalyticsBar from '../components/project/ProjectAnalyticsBar';
import GithubPanel from '../components/project/GithubPanel';
import AIExtractionPanel from '../components/project/AIExtractionPanel';
import TaskBoard from '../components/project/TaskBoard';
import TaskForm from '../components/project/TaskForm';

const ProjectDetail = () => {
    const { user } = useAuth();
    const { id } = useParams();
    
    // Leverage the new Orchestration Hook
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
        queryClient
    } = useProjectManagement(id, user);

    const isTicketView = id === TICKETS_PROJECT_ID;

    const columns = isTicketView ? [
        { id: 'todo', title: 'To Do', color: 'border-status-error text-status-error' },
        { id: 'in_progress', title: 'In Progress', color: 'border-status-warning text-status-warning' },
        { id: 'in_review', title: 'In Review', color: 'border-secondary text-secondary' },
        { id: 'done', title: 'Done', color: 'border-status-success text-status-success' }
    ] : [
        { id: 'todo', title: 'To-do', color: 'border-status-info text-status-info' },
        { id: 'in_progress', title: 'In Progress', color: 'border-status-warning text-status-warning' },
        { id: 'in_review', title: 'In Review', color: 'border-secondary text-secondary' },
        { id: 'done', title: 'Done', color: 'border-status-success text-status-success' }
    ];

    if (isLoading) return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10 space-y-8">
            {error && (
                <div className="bg-status-error/20 border border-status-error text-status-error px-4 py-3 rounded mb-4 animate-in fade-in duration-300">
                    <span className="font-bold uppercase text-[10px] tracking-widest block mb-1">Access Failure</span>
                    <p className="text-xs">{error.message || (typeof error === 'object' ? JSON.stringify(error) : error)}</p>
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
                                    <span className="text-[9px] font-black text-text-muted/40 uppercase tracking-widest">Sprint</span>
                                    <select 
                                        className="bg-transparent text-[10px] font-bold text-primary focus:outline-none cursor-pointer hover:underline"
                                        value={project?.sprint || ''}
                                        onChange={(e) => updateProjectMutation.mutate({ sprint: e.target.value })}
                                    >
                                        <option value="" className="bg-[#1E1E2E]">None</option>
                                        {(sprints || []).map(s => (
                                            <option key={s._id} value={s._id} className="bg-[#1E1E2E]">{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    {user?.role !== 'INTERN' && !isTicketView && (
                        <button 
                            onClick={() => ui.setShowGithubPanel(!ui.showGithubPanel)} 
                            className={`flex-1 sm:flex-none h-11 px-4 sm:px-6 bg-background-light hover:bg-background-dark text-text-muted hover:text-primary font-bold text-xs sm:text-sm rounded-xl transition duration-200 border border-background-dark/30 shadow-md flex items-center justify-center gap-2 ${ui.showGithubPanel ? 'ring-2 ring-primary border-primary' : ''}`}
                        >
                            <span className="text-base sm:text-lg"></span> <span className="hidden sm:inline">Github</span> {project?.githubRepo ? '· ' + project.githubRepo.repo : ''}
                        </button>
                    )}
                    <button 
                        onClick={() => ui.setShowAiInput(!ui.showAiInput)} 
                        className={`flex-1 sm:flex-none h-11 px-4 sm:px-6 bg-secondary hover:bg-secondary-light text-white font-bold text-xs sm:text-sm rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 ${ui.showAiInput ? 'ring-2 ring-primary' : ''}`}
                    >
                        <span className="hidden sm:inline">{isTicketView ? 'AI Task Generator' : 'AI Analysis'}</span><span className="sm:hidden">AI</span>
                    </button>
                    <button 
                        onClick={() => ui.setShowTaskForm(!ui.showTaskForm)} 
                        className="flex-1 sm:flex-none h-11 px-4 sm:px-6 bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm rounded-xl transition duration-200 shadow-md whitespace-nowrap"
                    >
                        {ui.showTaskForm ? 'Cancel' : (isTicketView ? 'Create Ticket' : 'Add Task')}
                    </button>
                </div>
            </div>

            {ui.showGithubPanel && (
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

            {ui.showTaskForm && <TaskForm sprints={sprints} newTask={newTask} setNewTask={setNewTask} handleCreateTask={(task) => createTaskMutation.mutate(task)} />}

            {!isTicketView && <ProjectAnalyticsBar analytics={analytics} />}

            <TaskBoard 
                groupedTasks={groupedTasks} 
                user={user} 
                columns={columns} 
                handleStatusChange={(taskId, status) => statusMutation.mutate({ taskId, status })} 
            />
        </div>
    );
};

export default ProjectDetail;

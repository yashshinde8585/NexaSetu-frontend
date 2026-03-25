import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjectManagement } from '../hooks/useProjectManagement';

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
        newTask,
        setNewTask,
        queryClient
    } = useProjectManagement(id, user);

    const columns = [
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error && <div className="bg-status-error/20 border border-status-error text-status-error px-4 py-3 rounded mb-4">{error}</div>}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-primary font-bold text-lg shadow-lg">
                        {project?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h1 className="text-2xl font-black tracking-tighter text-white/90 truncate max-w-md">
                            {project?.name}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Lead: {project?.createdBy?.name}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    {user?.role !== 'INTERN' && (
                        <button 
                            onClick={() => ui.setShowGithubPanel(!ui.showGithubPanel)} 
                            className={`bg-background-light hover:bg-background-dark text-text-muted hover:text-primary font-bold py-2 px-6 rounded transition duration-200 border border-background-dark/30 shadow-md flex items-center gap-2 ${ui.showGithubPanel ? 'ring-2 ring-primary border-primary' : ''}`}
                        >
                            <span className="text-lg">🐙</span> Github {project?.githubRepo ? '· ' + project.githubRepo.repo : ''}
                        </button>
                    )}
                    <button 
                        onClick={() => ui.setShowAiInput(!ui.showAiInput)} 
                        className={`bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-6 rounded transition duration-200 shadow-md flex items-center gap-2 ${ui.showAiInput ? 'ring-2 ring-primary' : ''}`}
                    >
                        ✨ AI Extractions
                    </button>
                    <button 
                        onClick={() => ui.setShowTaskForm(!ui.showTaskForm)} 
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded transition duration-200 shadow-md"
                    >
                        {ui.showTaskForm ? 'Cancel' : 'Add Task'}
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
                />
            )}

            {ui.showTaskForm && <TaskForm newTask={newTask} setNewTask={setNewTask} handleCreateTask={(task) => createTaskMutation.mutate(task)} />}

            <ProjectAnalyticsBar analytics={analytics} />

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

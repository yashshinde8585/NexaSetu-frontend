import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../api/projectService';
import { getTasksByProject, createTask, updateTaskStatus } from '../api/taskService';
import { extractTaskFromText } from '../api/aiService';
import * as githubService from '../api/githubService';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
    const [showTaskForm, setShowTaskForm] = useState(false);
    
    // AI Extraction States
    const [aiInput, setAiInput] = useState('');
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [showAiInput, setShowAiInput] = useState(false);

    // GitHub Integration States
    const [githubConnected, setGithubConnected] = useState(false);
    const [githubToken, setGithubToken] = useState('');
    const [repos, setRepos] = useState([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [showGithubPanel, setShowGithubPanel] = useState(false);
    const [githubSuggestions, setGithubSuggestions] = useState([]);
    const [isFetchingGithub, setIsFetchingGithub] = useState(false);
    const [showRepoLinker, setShowRepoLinker] = useState(false);

    useEffect(() => {
        fetchData();
        fetchRepos(); // Try fetching github if already connected
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projRes, tasksRes] = await Promise.all([
                getProject(id),
                getTasksByProject(id)
            ]);
            setProject(projRes.data.project);
            setTasks(tasksRes.data.tasks);
        } catch (err) {
            setError('Failed to fetch project details or tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleConnectGithub = async () => {
        if (!githubToken.trim()) return;
        try {
            await githubService.connectGithub(githubToken);
            setGithubConnected(true);
            setGithubToken('');
            fetchRepos();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to connect GitHub. Please check your token.';
            setError(msg);
        }
    };

    const fetchRepos = async () => {
        try {
            setLoadingRepos(true);
            const res = await githubService.getRepositories();
            setRepos(res.data.data);
            setGithubConnected(true);
        } catch (err) {
            setGithubConnected(false);
        } finally {
            setLoadingRepos(false);
        }
    };

    const handleLinkRepo = async (repo) => {
        try {
            const repoInfo = { owner: repo.owner, repo: repo.name, fullName: repo.fullName };
            await githubService.linkProject(id, repoInfo);
            setProject({ ...project, githubRepo: repoInfo });
            setShowRepoLinker(false);
            fetchData();
        } catch (err) {
            setError('Failed to link repository');
        }
    };

    const fetchGithubActivity = async () => {
        try {
            setIsFetchingGithub(true);
            const response = await githubService.getActivitySuggestions(id);
            setGithubSuggestions(response.data.data);
            setShowGithubPanel(true);
        } catch (error) {
            setError('Failed to fetch GitHub activity');
        } finally {
            setIsFetchingGithub(false);
        }
    };

    const handleApproveGithubTask = async (task) => {
        try {
            await githubService.approveTasks(id, [task]);
            setGithubSuggestions(prev => prev.filter(t => t.githubId !== task.githubId));
            fetchData();
        } catch (error) {
            setError('Failed to save task');
        }
    };

    const handleApproveAllGithubTasks = async () => {
        try {
            await githubService.approveTasks(id, githubSuggestions);
            setGithubSuggestions([]);
            fetchData();
        } catch (error) {
            setError('Failed to save all tasks');
        }
    };

    const handleCreateTask = async (taskToSave) => {
        try {
            await createTask({ ...taskToSave, project: id });
            setNewTask({ title: '', description: '', status: 'todo' });
            setShowTaskForm(false);
            setAiSuggestion(null);
            fetchData();
        } catch (err) {
            setError('Failed to create task');
        }
    };

    const handleAiExtract = async () => {
        if (!aiInput.trim()) return;
        try {
            setIsAiProcessing(true);
            setError(''); 
            const res = await extractTaskFromText(aiInput);
            setAiSuggestion(res.data.suggestion);
            setAiInput('');
        } catch (err) {
            const msg = err.response?.data?.message || 'AI extraction failed. Please try again.';
            setError(msg);
        } finally {
            setIsAiProcessing(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            // Optimistic update for better performance
            const oldTasks = [...tasks];
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
            
            await updateTaskStatus(taskId, newStatus);
        } catch (err) {
            setError('Failed to update task status. Reverting change.');
            fetchData(); // Re-sync on failure
        }
    };

    // Performance Optimization: Memoize task grouping to prevent recalculating on every re-render
    const groupedTasks = React.useMemo(() => {
        return {
            todo: tasks.filter(t => t.status === 'todo'),
            in_progress: tasks.filter(t => t.status === 'in_progress'),
            done: tasks.filter(t => t.status === 'done')
        };
    }, [tasks]);

    if (loading) return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-status-error/20 border border-status-error text-status-error px-4 py-3 rounded">{error}</div>
            <Link to="/dashboard" className="text-primary mt-4 inline-block hover:underline">Back to Dashboard</Link>
        </div>
    );

    const columns = [
        { id: 'todo', title: 'To-do', color: 'border-status-info text-status-info' },
        { id: 'in_progress', title: 'In Progress', color: 'border-status-warning text-status-warning' },
        { id: 'done', title: 'Done', color: 'border-status-success text-status-success' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{project?.name}</h1>
                    <Link to="/dashboard" className="text-text-muted hover:text-primary flex items-center gap-1 transition-colors">
                        ← Back to Dashboard
                    </Link>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowGithubPanel(!showGithubPanel)}
                        className={`bg-background-light hover:bg-background-dark text-text-muted hover:text-primary font-bold py-2 px-6 rounded transition duration-200 border border-background-dark/30 shadow-md flex items-center gap-2 ${showGithubPanel ? 'ring-2 ring-primary border-primary' : ''}`}
                    >
                        🐙 Github {project?.githubRepo ? '· ' + project.githubRepo.repo : ''}
                    </button>
                    <button
                        onClick={() => setShowAiInput(!showAiInput)}
                        className={`bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-6 rounded transition duration-200 shadow-md flex items-center gap-2 ${showAiInput ? 'ring-2 ring-primary' : ''}`}
                    >
                        ✨ AI Extractions
                    </button>
                    <button
                        onClick={() => setShowTaskForm(!showTaskForm)}
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded transition duration-200 shadow-md"
                    >
                        {showTaskForm ? 'Cancel' : 'Add Task'}
                    </button>
                </div>
            </div>

            {/* GitHub Connection Panel */}
            {showGithubPanel && (
                <div className="bg-background-dark/40 backdrop-blur-md p-6 rounded-xl mb-8 border border-white/10 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🐙</span>
                            <div>
                                <h3 className="text-xl font-bold">GitHub Integration</h3>
                                <p className="text-sm text-text-muted">Automate task detection from commits and PRs</p>
                            </div>
                        </div>
                        {githubConnected && project?.githubRepo && (
                            <button 
                                onClick={fetchGithubActivity}
                                disabled={isFetchingGithub}
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-primary/20"
                            >
                                {isFetchingGithub ? (
                                    <><div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div> Fetching...</>
                                ) : '🔄 Sync Latest Activity'}
                            </button>
                        )}
                    </div>

                    {!githubConnected ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-status-info/10 border border-status-info/20 rounded-lg text-sm text-status-info">
                                Connect your GitHub account using a Personal Access Token to get started. 
                                <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline ml-1">Generate one here</a>.
                            </div>
                            <div className="flex gap-4">
                                <input
                                    type="password"
                                    placeholder="Paste your GitHub Personal Access Token"
                                    className="flex-1 bg-background-light border border-white/5 text-text px-4 py-2 rounded-lg focus:ring-primary focus:ring-1 focus:outline-none"
                                    value={githubToken}
                                    onChange={(e) => setGithubToken(e.target.value)}
                                />
                                <button
                                    onClick={handleConnectGithub}
                                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-8 rounded-lg transition-all active:scale-95"
                                >
                                    Connect Account
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {!project?.githubRepo ? (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-semibold text-primary">Select a repository for this project</h4>
                                        <button onClick={fetchRepos} className="text-sm text-text-muted hover:text-primary">Refresh Repos</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {loadingRepos ? (
                                            <div className="col-span-full py-10 flex flex-col items-center gap-3">
                                                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                                                <span className="text-text-muted">Loading your repositories...</span>
                                            </div>
                                        ) : (
                                            repos.map(r => (
                                                <button
                                                    key={r.id}
                                                    onClick={() => handleLinkRepo(r)}
                                                    className="text-left bg-background-light hover:bg-background-dark p-3 rounded-lg border border-white/5 hover:border-primary/30 transition-all flex flex-col gap-1 group"
                                                >
                                                    <span className="font-medium text-sm group-hover:text-primary transition-colors">{r.fullName}</span>
                                                    {r.description && <span className="text-xs text-text-muted line-clamp-1">{r.description}</span>}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center justify-between p-4 bg-background-dark rounded-xl border border-white/5 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-2xl">📁</div>
                                            <div>
                                                <div className="font-bold text-lg">{project.githubRepo.fullName}</div>
                                                <div className="text-xs text-text-muted">Linked Repository</div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setProject({...project, githubRepo: null})}
                                            className="text-xs text-status-error/60 hover:text-status-error px-3 py-1 bg-status-error/5 hover:bg-status-error/10 rounded border border-status-error/10"
                                        >
                                            Change Repo
                                        </button>
                                    </div>

                                    {githubSuggestions.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end mb-2">
                                                <h4 className="font-bold text-secondary-light">Suggested Tasks ({githubSuggestions.length})</h4>
                                                <button 
                                                    onClick={handleApproveAllGithubTasks}
                                                    className="text-xs font-bold text-primary hover:underline"
                                                >
                                                    Approve All Suggestions
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                                                {githubSuggestions.map((s, idx) => (
                                                    <div 
                                                        key={idx}
                                                        className="bg-background-light/80 p-5 rounded-xl border border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 right-0 p-2">
                                                            <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full bg-white/5 ${s.type === 'commit' ? 'text-status-info' : 'text-status-warning'}`}>
                                                                {s.type}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                                            <div className="flex-1">
                                                                <h5 className="font-bold mb-1">{s.title}</h5>
                                                                <p className="text-sm text-text-muted mb-3 line-clamp-2 italic">“{s.originalMessage}”</p>
                                                                {s.description && (
                                                                    <div className="text-xs text-text-disabled bg-black/20 p-2 rounded mb-3 border-l-2 border-primary/40">
                                                                        {s.description}
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-3 text-[11px] text-text-muted">
                                                                    <span className="flex items-center gap-1">👤 {s.author}</span>
                                                                    <span className="flex items-center gap-1">📍 {s.status}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-row md:flex-col gap-2 justify-end min-w-[120px]">
                                                                <button 
                                                                    onClick={() => handleApproveGithubTask(s)}
                                                                    className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2 px-4 rounded-lg transition-all"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button 
                                                                    onClick={() => setGithubSuggestions(prev => prev.filter(t => t.githubId !== s.githubId))}
                                                                    className="flex-1 bg-white/5 hover:bg-white/10 text-text-muted text-xs font-bold py-2 px-4 rounded-lg transition-all"
                                                                >
                                                                    Ignore
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {githubSuggestions.length === 0 && !isFetchingGithub && (
                                        <div className="text-center py-8 bg-background-light rounded-xl border border-dashed border-white/10">
                                            <p className="text-text-muted text-sm mb-4">No new suggestions detected yet.</p>
                                            <button 
                                                onClick={fetchGithubActivity}
                                                className="text-primary font-semibold hover:underline"
                                            >
                                                Scan repository activity now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* AI Extraction Input */}
            {showAiInput && (
                <div className="bg-background-light p-6 rounded-lg mb-8 shadow-md border border-secondary/30">
                    <h3 className="text-lg font-semibold mb-3 text-secondary-light">Extract Task with AI</h3>
                    <div className="space-y-4">
                        <textarea
                            className="w-full bg-background-dark border border-secondary/20 text-text px-4 py-3 rounded focus:ring-secondary focus:ring-1 focus:outline-none"
                            placeholder="e.g., 'I finished fixing the login bug and updated the dashboard API. It's done now.'"
                            rows="3"
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                        />
                        <button 
                            onClick={handleAiExtract}
                            disabled={isAiProcessing || !aiInput.trim()}
                            className="w-full bg-secondary hover:bg-secondary-light disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded transition duration-200 flex justify-center items-center gap-2 shadow-lg hover:shadow-secondary/20"
                        >
                            {isAiProcessing ? (
                                <><div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div> Processing...</>
                            ) : 'Generate Smart Task'}
                        </button>
                    </div>
                </div>
            )}

            {/* AI Review UI */}
            {aiSuggestion && (
                <div className="bg-background-dark/80 backdrop-blur-sm p-6 rounded-xl mb-8 border-2 border-primary animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-2xl">🤖</span> AI Suggestion
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-widest bg-primary/20 text-primary-light px-2 py-1 rounded">Review Needed</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-background-light border border-primary/20 text-text px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none"
                                    value={aiSuggestion.title}
                                    onChange={(e) => setAiSuggestion({...aiSuggestion, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Status</label>
                                <select
                                    className="w-full bg-background-light border border-primary/20 text-text px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none"
                                    value={aiSuggestion.status}
                                    onChange={(e) => setAiSuggestion({...aiSuggestion, status: e.target.value})}
                                >
                                    <option value="todo">To-do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Description</label>
                            <textarea
                                className="w-full bg-background-light border border-primary/20 text-text px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none h-[116px]"
                                value={aiSuggestion.description}
                                onChange={(e) => setAiSuggestion({...aiSuggestion, description: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button 
                            onClick={() => handleCreateTask(aiSuggestion)}
                            className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-primary/20 active:scale-95"
                        >
                            ✓ Confirm & Save
                        </button>
                        <button 
                            onClick={() => setAiSuggestion(null)}
                            className="bg-status-error/10 text-status-error hover:bg-status-error/20 font-bold py-3 px-8 rounded-lg transition-all"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            )}

            {showTaskForm && (
                <div className="bg-background-light p-6 rounded-lg mb-8 shadow-md border border-background-dark/30">
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateTask(newTask);
                        }} 
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">Task Title</label>
                            <input
                                type="text"
                                className="w-full bg-background-dark border border-background-dark text-text px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                            <textarea
                                className="w-full bg-background-dark border border-background-dark text-text px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none"
                                rows="2"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded w-full transition duration-200">
                            Create Task
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map(column => (
                    <div key={column.id} className="bg-background-dark/50 p-4 rounded-xl border border-background-light/20 flex flex-col min-h-[400px]">
                        <div className={`text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 ${column.color}`}>
                            {column.title}
                        </div>
                        <div className="space-y-3 flex-grow">
                            {groupedTasks[column.id].map(task => (
                                <div key={task._id} className="bg-background-light p-4 rounded-lg shadow border border-background-dark/20 hover:border-primary/30 transition-all duration-300">
                                    <h4 className="font-semibold text-text mb-1">{task.title}</h4>
                                    {task.description && <p className="text-sm text-text-muted line-clamp-2">{task.description}</p>}
                                    {task.assignedUser && (
                                        <div className="mt-2 flex items-center gap-1.5">
                                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary border border-primary/30">
                                                {task.assignedUser.name[0].toUpperCase()}
                                            </div>
                                            <span className="text-[11px] text-text-muted">{task.assignedUser.name}</span>
                                        </div>
                                    )}
                                    <div className="mt-4 flex justify-end gap-2">
                                        {column.id !== 'todo' && (
                                            <button 
                                                onClick={() => handleStatusChange(task._id, 'todo')}
                                                className="text-xs px-2 py-1 rounded bg-background-dark hover:bg-status-info/20 text-text-muted hover:text-status-info transition-all"
                                            >
                                                To Todo
                                            </button>
                                        )}
                                        {column.id !== 'in_progress' && (
                                            <button 
                                                onClick={() => handleStatusChange(task._id, 'in_progress')}
                                                className="text-xs px-2 py-1 rounded bg-background-dark hover:bg-status-warning/20 text-text-muted hover:text-status-warning transition-all"
                                            >
                                                To In Progress
                                            </button>
                                        )}
                                        {column.id !== 'done' && (
                                            <button 
                                                onClick={() => handleStatusChange(task._id, 'done')}
                                                className="text-xs px-2 py-1 rounded bg-background-dark hover:bg-status-success/20 text-text-muted hover:text-status-success transition-all"
                                            >
                                                To Done
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectDetail;

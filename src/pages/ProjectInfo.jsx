import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import { Rocket } from 'lucide-react';

const ProjectInfo = () => {
    const { user } = useAuth();
    const { 
        projects, 
        workload, 
        isLoading,
        newProjectName,
        setNewProjectName,
        showForm,
        setShowForm,
        handleCreateProject,
        sprints,
        selectedSprintId,
        setSelectedSprintId,
        sprintStats,
        sprintStatsLoading,
        createSprint,
        createSprintLoading,
        createTicket,
        createTicketLoading,
        linkProjectToSprint: handleLinkProject,
        getFinalSummary
    } = useDashboard(user);

    const [finalSummary, setFinalSummary] = React.useState(null);
    const [finalizing, setFinalizing] = React.useState(false);

    const [showSprintForm, setShowSprintForm] = React.useState(false);
    const [quickTicketProject, setQuickTicketProject] = React.useState(null);
    const [quickTicketTitle, setQuickTicketTitle] = React.useState('');
    const [sprintData, setSprintData] = React.useState({ 
        name: '', 
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    React.useEffect(() => {
        if (!selectedSprintId && sprints?.length > 0) {
            setSelectedSprintId(sprints[0]._id);
        }
    }, [sprints, selectedSprintId, setSelectedSprintId]);

    const isGlobalViewer = user?.role === 'WORKSPACE_ADMIN' || user?.role === 'ADMIN' || user?.role === 'WORKSPACE_MANAGER' || user?.role === 'MANAGER';

    const sprintMetrics = React.useMemo(() => {
        const sprintProjects = projects.filter(p => {
            const pSprintId = (p.sprint?._id || p.sprint)?.toString();
            return pSprintId === selectedSprintId?.toString();
        });
        
        // If high-resolution sprint stats are available from the backend, use them for the global matrix
        if (sprintStats) {
            return {
                completionRate: sprintStats.metrics?.completionRate || '0%',
                open: sprintStats.metrics?.raw?.totalOpen || sprintStats.metrics?.raw?.pending || 0, // Fallback to raw pending/todo
                active: sprintStats.metrics?.raw?.inProgress || 0,
                review: sprintStats.metrics?.raw?.inReview || 0,
                completed: sprintStats.metrics?.raw?.completed || 0
            }
        }

        // Fallback: Aggregate from visible projects if backend stats aren't available yet
        const metrics = sprintProjects.reduce((acc, p) => {
            acc.total += (p.totalTasks || 0);
            acc.completed += (p.completedTasks || 0);
            acc.open += (p.pendingTasks || 0);
            acc.active += (p.inProgressTasks || 0);
            acc.review += (p.inReviewTasks || 0);
            return acc;
        }, { total: 0, completed: 0, open: 0, active: 0, review: 0 });

        return {
            completionRate: metrics.total > 0 ? ((metrics.completed / metrics.total) * 100).toFixed(0) + '%' : '0%',
            open: metrics.open,
            active: metrics.active,
            review: metrics.review,
            completed: metrics.completed
        };
    }, [isGlobalViewer, projects, selectedSprintId, sprintStats]);



    const canCreate = (
        user?.role === 'WORKSPACE_ADMIN' || 
        user?.role === 'ADMIN' || 
        user?.role === 'WORKSPACE_MANAGER' || 
        user?.role === 'MANAGER'
      ) && 
      !['TECH_LEAD', 'SENIOR_ENGINEER', 'SOFTWARE_ENGINEER', 'INTERN'].includes(user?.role);

    const handleAddSprint = () => {
        setShowSprintForm(true);
    };

    const submitSprint = (e) => {
        e.preventDefault();
        createSprint(sprintData, {
            onSuccess: () => setShowSprintForm(false)
        });
    };

    const selectedSprint = React.useMemo(() => {
        const sprint = (sprints || []).find(s => s._id === selectedSprintId);
        if (!sprint) return null;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const start = new Date(sprint.startDate);
        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
        const end = new Date(sprint.endDate);
        const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();

        let derivedStatus = sprint.status || 'active';
        if (derivedStatus !== 'completed') {
            if (today < startDate) derivedStatus = 'upcoming';
            else if (today > endDate) derivedStatus = 'completed';
            else derivedStatus = 'active';
        }

        return { ...sprint, derivedStatus };
    }, [sprints, selectedSprintId]);

    if (isLoading) return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative">
            {/* Sprint Creation Modal */}
            {showSprintForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-[#1E1E2E] border border-white/10 rounded-3xl p-8 shadow-2xl shadow-primary/20 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <Rocket className="text-primary" size={24} />
                            <h3 className="text-xl font-bold text-white tracking-tight">Create New Sprint</h3>
                        </div>
                        
                        <form onSubmit={submitSprint} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest pl-1">Sprint Name</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    value={sprintData.name}
                                    onChange={e => setSprintData({...sprintData, name: e.target.value})}
                                    placeholder="e.g. Gamma Sprint"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest pl-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                        value={sprintData.startDate}
                                        onChange={e => setSprintData({...sprintData, startDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest pl-1">End Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                        value={sprintData.endDate}
                                        onChange={e => setSprintData({...sprintData, endDate: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="submit" 
                                    disabled={createSprintLoading}
                                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {createSprintLoading ? 'Saving...' : 'Create Sprint'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowSprintForm(false)}
                                    className="px-6 bg-white/5 hover:bg-white/10 text-text-muted font-bold rounded-2xl transition-all border border-white/5"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="flex-1">
                     {canCreate && (
                        <div className="flex items-center gap-4">
                            {!showForm ? (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center gap-3 text-xs uppercase tracking-widest transform hover:-translate-y-0.5"
                                >
                                    <span className="text-lg font-light">+</span> Create Project
                                </button>
                            ) : (
                                <form onSubmit={handleCreateProject} className="flex items-center gap-3 w-full max-w-md animate-in fade-in slide-in-from-left-4 duration-500">
                                    <input
                                        type="text"
                                        placeholder="Project Name..."
                                        className="flex-1 bg-white/[0.03] text-white border border-white/10 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs transition-all font-bold"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-primary/20"
                                    >
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="bg-white/5 hover:bg-white/10 text-text-muted px-5 py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest transition-all border border-white/5"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                     )}
                </div>
            </header>

            {/* Sprint Results Section */}
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Rocket className="text-primary" size={26} />
                            Sprint Management
                        </h2>
                        <p className="text-text-muted text-sm font-medium mt-1 opacity-70">Manage your project timelines and team velocity.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
                            {(sprints || []).map((sprint) => (
                               <button
                                 key={sprint._id}
                                 onClick={() => setSelectedSprintId(sprint._id)}
                                 className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${
                                   selectedSprintId === sprint._id 
                                   ? 'bg-primary/20 border border-primary/20 text-primary shadow-lg shadow-primary/10' 
                                   : 'text-text-muted/60 hover:text-white hover:bg-white/5'
                                 }`}
                               >
                                 {sprint.name}
                               </button>
                            ))}
                            {canCreate && (
                                <div className="flex items-center gap-2 border-l border-white/5 ml-2 pl-2">
                                    <button 
                                        onClick={handleAddSprint}
                                        className="w-10 h-10 text-text-muted/40 hover:text-primary transition-all flex items-center justify-center rounded-xl hover:bg-white/5"
                                        title="Create New Sprint"
                                    >
                                        <span className="text-xl">+</span>
                                    </button>
                                    {selectedSprintId && (
                                        <button 
                                            onClick={async () => {
                                                setFinalizing(true);
                                                try {
                                                    const summary = await getFinalSummary(selectedSprintId);
                                                    setFinalSummary(summary);
                                                } catch (err) {
                                                    console.error(err);
                                                } finally {
                                                    setFinalizing(false);
                                                }
                                            }}
                                            disabled={finalizing}
                                            className="px-4 py-2.5 text-[10px] uppercase font-black tracking-widest bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 h-10"
                                        >
                                            {finalizing ? 'Syncing...' : 'Finalize'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-[#1E1E2E]/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    {selectedSprint && (
                        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center mb-6 pb-6 border-b border-white/5">
                            <div className="col-span-12 md:col-span-5 flex items-center gap-4 w-full">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 p-[1px] shadow-xl border border-white/10 flex items-center justify-center text-primary font-black text-xl">
                                    {selectedSprint.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-white font-black truncate text-lg tracking-tight">{selectedSprint.name}</span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">ID: {selectedSprint._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-6 md:col-span-3 flex flex-col justify-center">
                                <span className="text-sm font-bold text-white/90">
                                    {new Date(selectedSprint.startDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-0.5 opacity-60">Start Date</span>
                            </div>

                            <div className="col-span-6 md:col-span-2 flex flex-col justify-center">
                                <span className="text-sm font-bold text-white/90">
                                    {Math.max(1, Math.ceil((new Date(selectedSprint.endDate) - new Date(selectedSprint.startDate)) / (1000 * 60 * 60 * 24)))} Days
                                </span>
                                <span className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-0.5 opacity-60">Duration</span>
                            </div>

                            <div className="col-span-12 md:col-span-2 flex items-center justify-end">
                                <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                    selectedSprint.derivedStatus === 'active'
                                    ? 'bg-status-success/10 text-status-success border-status-success/20 shadow-status-success/10' 
                                    : selectedSprint.derivedStatus === 'completed'
                                        ? 'bg-primary/10 text-primary border-primary/20 shadow-primary/10' 
                                        : 'bg-white/5 text-text-muted border-white/10 shadow-white/5'
                                }`}>
                                    {selectedSprint.derivedStatus?.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Completion Rate', value: sprintMetrics.completionRate, trend: sprintStats?.trends?.completion || '+0%', color: 'text-status-success' },
                            { label: 'Avg Task Flux', value: sprintStats?.metrics?.avgTaskFlux || '0d', trend: sprintStats?.trends?.flux || '0d', color: 'text-primary' },
                            { label: 'Blocker Density', value: sprintStats?.metrics?.blockerDensity || 'None', trend: sprintStats?.trends?.blockers || 'Stable', color: 'text-status-info' },
                            { label: 'Strategic Debt', value: sprintStats?.metrics?.strategicDebt || '0%', trend: sprintStats?.trends?.debt || '0%', color: 'text-status-warning' },
                        ].map((metric, idx) => (
                            <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/20 hover:bg-white/[0.05] transition-all group">
                                <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] mb-3 opacity-70 group-hover:opacity-100 transition-opacity">{metric.label}</div>
                                <div className="flex items-end justify-between">
                                    <div className={`text-3xl font-black tracking-tight ${metric.color} ${sprintStatsLoading ? 'animate-pulse opacity-50' : ''}`}>
                                        {metric.value}
                                    </div>
                                    <div className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded text-white/40 group-hover:text-white/60 transition-colors border border-white/5">
                                        {metric.trend}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Open Tasks', count: sprintMetrics.open, color: 'text-status-error', icon: '🎯' },
                                { label: 'In Progress', count: sprintMetrics.active, color: 'text-status-warning', icon: '🔍' },
                                { label: 'In Review', count: sprintMetrics.review, color: 'text-secondary', icon: '⚙️' },
                                { label: 'Completed', count: sprintMetrics.completed, color: 'text-status-success', icon: '🎉' },
                            ].map((step, idx) => (
                                <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="text-xl grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">{step.icon}</div>
                                        <div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-60 group-hover:opacity-100 transition-opacity">{step.label}</div>
                                            <div className="flex items-baseline gap-1.5 mt-0.5">
                                                <span className={`text-xl font-black ${step.color}`}>{step.count}</span>
                                                <span className="text-[9px] font-bold text-text-muted/40 uppercase tracking-tighter">Units</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-10 w-1 bg-current rounded-full opacity-5"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tactical Personnel Distribution */}
                    {sprintStats?.metrics?.workload?.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/60 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    Team Workload Overview
                                </h4>
                                <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded tracking-tighter">Velocity Pulse</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sprintStats.metrics.workload.map((wp, idx) => (
                                    <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3 hover:bg-white/[0.06] transition-all hover:-translate-y-0.5 shadow-sm group">
                                        <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20 uppercase tracking-tighter">
                                            {wp.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white/80 group-hover:text-white transition-colors">{wp.name}</span>
                                            <span className="text-[9px] font-bold text-text-muted/40 group-hover:text-text-muted/60 transition-colors uppercase tracking-widest leading-none">{wp.count} Tasks</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>



                <div className="grid grid-cols-1 gap-8">
                    {/* Mission Heatmap */}
                    <div className="space-y-6">
                        <div className="bg-[#1E1E2E]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-lg font-black text-white">Project Status Overview</h3>
                                <p className="text-xs text-text-muted mt-1">
                                    {selectedSprintId ? 'Status for projects in active sprint' : 'Real-time status of all workspace projects'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[10px] px-2 py-1 bg-status-success/10 text-status-success border border-status-success/20 rounded font-black">STABLE</span>
                                <span className="text-[10px] px-2 py-1 bg-status-warning/10 text-status-warning border border-status-warning/20 rounded font-black">AT RISK</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {(projects || []).map(project => (
                                <div key={project._id} className={`group p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all ${
                                    selectedSprintId && (project.sprint === selectedSprintId || project.sprint?._id === selectedSprintId)
                                    ? 'ring-1 ring-primary/30 border-primary/20 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                                    : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                                }`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${project.percentage >= 80 ? 'bg-status-success shadow-[0_0_10px_rgba(34,197,94,0.5)]' : project.percentage >= 40 ? 'bg-status-warning' : 'bg-status-error animate-pulse'}`} />
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-primary transition-colors">{project.name}</h4>
                                                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-0.5">{project.status || 'Active'}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-3">
                                                {selectedSprintId && (project.sprint === selectedSprintId || project.sprint?._id === selectedSprintId) && (
                                                    <button 
                                                        onClick={() => {
                                                            setQuickTicketProject(quickTicketProject === project._id ? null : project._id);
                                                            setQuickTicketTitle('');
                                                        }}
                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all border ${
                                                            quickTicketProject === project._id 
                                                            ? 'bg-status-success text-white border-status-success shadow-lg shadow-status-success/20' 
                                                            : 'bg-white/5 text-text-muted border-white/5 hover:border-primary/40 hover:text-primary'
                                                        }`}
                                                        title="Quick Directive"
                                                    >
                                                        <span className="text-lg font-light">{quickTicketProject === project._id ? '×' : '+'}</span>
                                                    </button>
                                                )}
                                                {selectedSprintId && ((project.sprint?._id || project.sprint)?.toString() !== selectedSprintId.toString()) && (
                                                    <button 
                                                        onClick={() => {
                                                            const queryClient = new (require('@tanstack/react-query').QueryClient)(); // This is a bit hacky, better use the instance
                                                            // Instead, I'll use a local handler in ProjectInfo
                                                            handleLinkProject(project._id);
                                                        }}
                                                        className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20 hover:bg-primary/20 transition-all"
                                                    >
                                                        Add to Sprint
                                                    </button>
                                                )}
                                                <div className="text-right">
                                                    <div className="text-lg font-black text-white">{project.percentage}%</div>
                                                    <div className="text-[9px] text-text-muted font-bold capitalize">Completion</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${project.percentage >= 80 ? 'bg-status-success' : project.percentage >= 40 ? 'bg-primary' : 'bg-status-error'}`}
                                            style={{ width: `${project.percentage}%` }}
                                        />
                                    </div>

                                    {quickTicketProject === project._id && (
                                        <div className="mt-4 pt-4 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                                            <form 
                                                className="flex gap-2"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (!quickTicketTitle.trim()) return;
                                                    createTicket({ 
                                                        title: quickTicketTitle.trim(), 
                                                        project: project._id, 
                                                        sprint: selectedSprintId 
                                                    }, {
                                                        onSuccess: () => {
                                                            setQuickTicketTitle('');
                                                            setQuickTicketProject(null);
                                                        }
                                                    });
                                                }}
                                            >
                                                <input 
                                                    type="text"
                                                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-medium text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:opacity-30"
                                                    placeholder="Task Title..."
                                                    value={quickTicketTitle}
                                                    onChange={e => setQuickTicketTitle(e.target.value)}
                                                    autoFocus
                                                    required
                                                />
                                                <button 
                                                    type="submit"
                                                    disabled={createTicketLoading}
                                                    className="bg-primary/20 hover:bg-primary/30 text-primary text-[10px] font-black uppercase tracking-widest px-4 rounded-xl border border-primary/20 transition-all disabled:opacity-50"
                                                >
                                                    {createTicketLoading ? '...' : 'Create'}
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {(projects || []).length === 0 && (
                                <div className="p-8 text-center text-text-muted italic opacity-40 text-xs font-bold uppercase tracking-widest bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                                    No projects available in workspace
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                </div>
            </div>
            {/* Sprint Results Modal */}
            {finalSummary && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
                    <div className="bg-background w-full max-w-2xl rounded-xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4">
                        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Sprint Summary</h2>
                                <p className="text-xs text-text-muted font-mono">{finalSummary.sprint} Overview</p>
                            </div>
                            <button onClick={() => setFinalSummary(null)} className="text-text-muted hover:text-white">×</button>
                        </div>
                        
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <div className="flex gap-4 mb-8">
                                <div className="flex-1 bg-white/5 p-4 rounded-lg border border-white/5 text-center">
                                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Velocity</p>
                                    <p className="text-2xl font-black text-white">{finalSummary.metrics.velocity}</p>
                                </div>
                                <div className="flex-1 bg-white/5 p-4 rounded-lg border border-white/5 text-center">
                                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Retention</p>
                                    <p className="text-2xl font-black text-status-success">{finalSummary.metrics.retention.toFixed(1)}%</p>
                                </div>
                                <div className="flex-1 bg-white/5 p-4 rounded-lg border border-white/5 text-center">
                                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1">Spillover</p>
                                    <p className="text-2xl font-black text-status-warning">{finalSummary.metrics.spillover}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                                    AI Tactical Summary
                                </h3>
                                <div className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-6 rounded-xl border border-white/5 font-mono italic">
                                    {finalSummary.summary}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Top Contributors</h3>
                                <div className="space-y-3">
                                    {finalSummary.topContributors.map((c, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
                                                    {c.name[0]}
                                                </div>
                                                <span className="text-sm font-bold text-white">{c.name}</span>
                                            </div>
                                            <span className="text-xs text-primary font-mono font-bold">{c.missions} Tasks Completed</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
                            <button 
                                onClick={() => setFinalSummary(null)} 
                                className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-white/5 text-text-muted rounded-lg hover:bg-white/10 transition-all"
                            >
                                Acknowledge & Archive
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectInfo;

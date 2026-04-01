import React, { useState, useEffect } from 'react';
import { Layout, Calendar, AlertCircle, CheckCircle2, Clock, MapPin, Search, ArrowLeft } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getMyTasks, updateTaskStatus } from '../api/taskService';

const MyTasks = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialFilter = searchParams.get('filter') || 'active';
    const initialScope = searchParams.get('scope') || 'personal';

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(initialFilter);
    const [scope, setScope] = useState(initialScope);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const queryFilter = searchParams.get('filter') || 'active';
        const queryScope = searchParams.get('scope') || 'personal';
        setFilter(queryFilter);
        setScope(queryScope);
    }, [searchParams]);

    useEffect(() => {
        fetchTasks();
    }, [filter, scope]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await getMyTasks(scope);
            setTasks(res.data.tasks);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);
            fetchTasks(); // Refresh
        } catch (err) {
            console.error('Status update failed:', err);
        }
    };

    const filteredTasks = tasks.filter(t => {
        let matchesFilter = filter === 'active' ? t.status !== 'done' : (filter === 'all' || t.status === filter);
        if (filter === 'due') {
            matchesFilter = t.delayStatus?.toLowerCase() === 'delayed' && t.status !== 'done';
        }
        if (filter === 'completed') {
            matchesFilter = t.status === 'done';
        }
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.project?.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 py-10 space-y-12 animate-in fade-in duration-700">
            {/* Header Content */}
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

                {/* Scope Toggle */}
                <div className="flex bg-white/[0.02] border border-white/5 rounded-2xl p-1 shrink-0 h-fit mb-1">
                    {[
                        { id: 'personal', label: 'My Tasks' },
                        { id: 'workspace', label: 'Overall Tasks' }
                    ].map(s => (
                        <button
                            key={s.id}
                            onClick={() => {
                                setScope(s.id);
                                setSearchParams({ filter, scope: s.id });
                            }}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${scope === s.id
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105'
                                    : 'text-text-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sub-toolbar */}
            <div className="flex flex-col md:flex-row gap-6 p-1 justify-between items-center border-b border-white/5 pb-8">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search by project or task..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                    />
                </div>

                <div className="flex bg-white/[0.02] border border-white/5 rounded-2xl p-1 shrink-0 overflow-x-auto max-w-full no-scrollbar">
                    {['active', 'in_review', 'completed', 'due', 'todo', 'in_progress', 'all'].map(f => (
                        <button
                            key={f}
                            onClick={() => {
                                setFilter(f);
                                setSearchParams({ filter: f });
                            }}
                            className={`px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${filter === f ? 'bg-primary/20 border border-primary/30 text-primary shadow-lg shadow-primary/10' : 'text-text-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f === 'active' ? 'Active' :
                                f === 'completed' ? 'Completed' :
                                    f === 'due' ? 'Critical Blockers' :
                                        f === 'todo' ? 'To Do' :
                                            f === 'in_review' ? 'In Review' :
                                                f === 'in_progress' ? 'In Progress' : 'All Tasks'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredTasks.length > 0 ? filteredTasks.map(task => (
                    <div
                        key={task._id}
                        onClick={() => navigate(`/task/${task._id}`)}
                        className="group glass-dark border border-white/5 rounded-3xl p-8 hover:border-primary/30 transition-all duration-500 flex flex-col gap-6 relative overflow-hidden cursor-pointer"
                    >
                        {/* Status Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-30 ${task.status === 'in_progress' ? 'bg-secondary' : task.status === 'in_review' ? 'bg-primary' : 'bg-status-warning'
                            }`} />

                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between items-start mb-1">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={10} className="text-primary" />
                                        <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">{task.project?.name || 'General'}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">{task.title}</h3>
                                </div>
                                <div className={`px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-tighter ${task.status === 'done' ? 'bg-status-success/10 border-status-success/20 text-status-success' :
                                    task.status === 'in_progress' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                                        task.status === 'in_review' ? 'bg-primary/10 border-primary/20 text-primary' :
                                            'bg-background-light/20 border-white/5 text-text-muted'
                                    }`}>
                                    {task.status === 'done' ? 'Completed' : task.status.replace('_', ' ')}
                                </div>
                            </div>
                            <p className="text-sm text-text-muted leading-relaxed line-clamp-3 font-medium">{task.description}</p>

                            {scope === 'workspace' && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-black text-primary border border-primary/20">
                                        {task.assignedUser?.name?.charAt(0) || '?'}
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                        {task.assignedUser?.name || 'Unassigned'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${task.delayStatus === 'delayed' ? 'bg-status-error/10 border-status-error/20 text-status-error' : 'bg-white/5 border-white/10 text-text-muted'
                                    }`}>
                                    <Clock size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {task.status !== 'in_progress' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange(task._id, 'in_progress');
                                            }}
                                            className="p-2 border border-white/5 bg-white/5 rounded-xl hover:bg-secondary hover:text-white transition-all text-text-muted"
                                            title="Start Task"
                                        >
                                            <CLOCK_LOADER size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(task._id, 'done');
                                        }}
                                        className="p-2 border border-white/5 bg-white/5 rounded-xl hover:bg-status-success hover:text-white transition-all text-text-muted"
                                        title="Complete Task"
                                    >
                                        <CheckCircle2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-32 text-center glass border border-dashed border-white/5 rounded-[3rem]">
                        <CheckCircle2 className="w-16 h-16 text-status-success mx-auto mb-6 opacity-20" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                            {filter === 'due' ? 'No Critical Blockers' :
                                filter === 'completed' ? 'No Completed Tasks' :
                                    filter === 'in_review' ? 'No Tasks to Review' :
                                        filter === 'active' ? 'No Active Tasks' : 'All Clear'}
                        </h3>
                        <p className="text-text-muted font-bold uppercase tracking-widest text-[10px] mt-2">
                            {filter === 'due' ? 'All your pending items are currently on schedule.' :
                                filter === 'completed' ? 'You haven\'t finalized any tasks in this view yet.' :
                                    filter === 'in_review' ? 'You are all caught up with your team reviews.' :
                                        'Your workspace is fully synchronized and up to date.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CLOCK_LOADER = ({ size }) => (
    <div className="animate-spin-slow">
        <Clock size={size} />
    </div>
);

export default MyTasks;

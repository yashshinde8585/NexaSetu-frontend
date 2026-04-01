import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateTaskStatus, updateTask } from '../api/taskService';
import { getTeamMembers } from '../api/teamService';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, User, Tag, Clock, CheckCircle2, AlertCircle, History, Code, ArrowRight, ArrowLeft, UserPlus, ChevronDown } from 'lucide-react';

const TaskDetailPage = () => {
    const { taskId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isAssigning, setIsAssigning] = React.useState(false);

    const { data: taskData, isLoading, error } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById(taskId).then(res => res.data.task)
    });

    const { data: membersResponse = [] } = useQuery({
        queryKey: ['team-members'],
        queryFn: () => getTeamMembers(),
        enabled: !!taskData
    });

    const members = membersResponse?.data?.members || membersResponse?.members || [];

    const assignMutation = useMutation({
        mutationFn: (userId) => updateTask(taskId, { assignedUser: userId }),
        onSuccess: () => {
             queryClient.invalidateQueries(['task', taskId]);
             setIsAssigning(false);
        }
    });

    const statusMutation = useMutation({
        mutationFn: ({ taskId, status }) => updateTaskStatus(taskId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['task', taskId]);
            queryClient.invalidateQueries(['tasks']);
        }
    });

    if (isLoading) return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (error || !taskData) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Task Not Found</h2>
            <p className="text-text-muted mb-8">This task could not be retrieved. It may have been deleted or moved.</p>
            <button onClick={() => navigate(-1)} className="bg-primary px-8 py-3 rounded-xl font-bold text-white">Go Back</button>
        </div>
    );

    const columns = [
        { id: 'todo', title: 'To Do', color: 'text-status-error' },
        { id: 'in_progress', title: 'In Progress', color: 'text-status-warning' },
        { id: 'in_review', title: 'In Review', color: 'text-secondary' },
        { id: 'done', title: 'Done', color: 'text-status-success' }
    ];

    const getStatusColor = (status) => {
        const col = columns.find(c => c.id === status);
        return col ? col.color : 'text-text-muted';
    };

    const getStatusTitle = (status) => {
        const col = columns.find(c => c.id === status);
        return col ? col.title : status;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-110px)] flex flex-col gap-3 py-3 overflow-hidden animate-in fade-in duration-500 font-sans">
            {/* Header Area - More Compact */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 pb-3 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all shadow-sm"
                        title="Back"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                             <span className="text-[9px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded uppercase tracking-wider">
                                {taskData.projectKey}-{taskData.taskNumber || '0'}
                            </span>
                            <span className="text-text-muted/40 text-[10px] px-1">•</span>
                            <span className="text-[10px] font-semibold text-text-muted">
                                {taskData.project?.name}
                            </span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight truncate max-w-lg">
                            {taskData.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-6 self-end md:self-center">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-bold text-text-muted/50 uppercase tracking-[0.2em] mb-0.5">Current Status</span>
                        <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${getStatusColor(taskData.status)}`}>
                             <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                             {getStatusTitle(taskData.status)}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Dashboard */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
                {/* Information Side (Left) */}
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden min-h-0">
                    <section className="flex-1 flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden min-h-0 shadow-lg">
                        <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
                            <h3 className="text-[10px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                                <Tag size={12} className="text-primary" /> Description
                            </h3>
                            {taskData.source === 'github' && (
                                <div className="flex items-center gap-1.5 text-[8px] font-bold bg-secondary/10 text-secondary px-2 py-0.5 rounded-md border border-secondary/20">
                                    <Code size={10} /> GitHub Linked
                                </div>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            <article className="text-sm md:text-base text-white/90 leading-relaxed font-medium whitespace-pre-wrap max-w-3xl">
                                {taskData.description || (
                                    <p className="text-text-muted italic opacity-40 text-sm">No description available for this mission objective.</p>
                                )}
                            </article>
                        </div>
                    </section>

                    {taskData.timelineHistory?.length > 0 && (
                        <section className="h-[28%] flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shrink-0 min-h-0 shadow-md">
                            <div className="px-6 py-3 border-b border-white/5 shrink-0 bg-white/[0.01]">
                                <h3 className="text-[10px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                                    <History size={12} className="text-status-warning" /> Activity Log
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 py-3 space-y-3 custom-scrollbar">
                                {taskData.timelineHistory.map((log, idx) => (
                                    <div key={idx} className="flex gap-3 items-start py-1 border-l border-white/5 pl-4 ml-1 relative">
                                        <div className="absolute left-[-2px] top-2 w-1 h-1 rounded-full bg-status-warning" />
                                        <div className="flex flex-col">
                                            <p className="text-[12px] text-white/70 leading-normal">{log.reason}</p>
                                            <span className="text-[9px] text-text-muted mt-1 opacity-50 font-bold uppercase tracking-tighter">
                                                {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Controls & Metadata Side (Right) */}
                <aside className="lg:col-span-4 flex flex-col gap-4 overflow-hidden min-h-0">
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-4 min-h-0">
                        {/* Summary Card */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-5 shadow-xl shrink-0">
                            {/* Assignee */}
                            <div className="space-y-2">
                                <span className="text-[9px] font-bold text-text-muted/50 uppercase tracking-widest block">Assignee</span>
                                {taskData.assignedUser ? (
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-xl">
                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/20 shrink-0">
                                            {taskData.assignedUser.name[0].toUpperCase()}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-bold text-white truncate">{taskData.assignedUser.name}</span>
                                            <span className="text-[9px] text-text-muted truncate opacity-60 font-medium">{taskData.assignedUser.email}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {!isAssigning ? (
                                            <div className="flex flex-col gap-2">
                                                <div className="text-[10px] text-text-muted italic py-1 px-1">Awaiting assignment</div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => assignMutation.mutate(user._id)}
                                                        className="flex-1 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary/20 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <UserPlus size={12} /> Claim Task
                                                    </button>
                                                    <button 
                                                        onClick={() => setIsAssigning(true)}
                                                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <ChevronDown size={12} /> Assign Member
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative group/assign">
                                                <select 
                                                    className="w-full bg-background-dark border border-white/10 text-white rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest appearance-none outline-none focus:border-primary/40 transition-all cursor-pointer"
                                                    onChange={(e) => assignMutation.mutate(e.target.value)}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Select Operative...</option>
                                                    {members.map(m => (
                                                        <option key={m._id} value={m._id} className="bg-[#121826]">{m.name} ({m.jobTitle})</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted/40">
                                                    <ChevronDown size={12} />
                                                </div>
                                                <button 
                                                    onClick={() => setIsAssigning(false)}
                                                    className="mt-2 text-[8px] font-black text-text-muted/40 hover:text-red-400 uppercase tracking-widest block mx-auto py-1"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Creator */}
                            <div className="space-y-2 pt-4 border-t border-white/10">
                                <span className="text-[9px] font-bold text-text-muted/50 uppercase tracking-widest block">Creator</span>
                                {taskData.createdBy ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted border border-white/10 shrink-0 shadow-inner">
                                            <User size={14} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-bold text-white/90 truncate">{taskData.createdBy.name}</span>
                                            <span className="text-[9px] text-text-muted opacity-50 font-bold uppercase tracking-tighter">
                                                {new Date(taskData.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-[10px] text-text-muted italic py-1 opacity-40">System Core</div>
                                )}
                            </div>

                            {/* Metadata */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] font-bold text-text-muted/50 uppercase tracking-widest">Sprint Target</span>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/90">
                                        <Calendar size={12} className="text-primary/70" />
                                        {taskData.sprintInfo?.name || 'Backlog'}
                                    </div>
                                </div>

                                {taskData.status === 'done' && (
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[9px] font-bold text-text-muted/50 uppercase tracking-widest">Time Consumed</span>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-status-success">
                                            <Clock size={12} />
                                            {taskData.actualDuration || 0}m Recorded
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Transition Protocol */}
                        <div className="space-y-3 shrink-0 pb-2">
                            <h3 className="text-[9px] font-bold text-text-muted/40 uppercase tracking-widest pl-1">
                                 Move To
                            </h3>
                            <div className="flex flex-col gap-2">
                                {columns.map(c => {
                                    const isRestrictedForIntern = user?.role === 'INTERN' && c.id === 'done';
                                    if (c.id === taskData.status || isRestrictedForIntern) return null;
                                    
                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => statusMutation.mutate({ taskId: taskData._id, status: c.id })}
                                            className={`w-full py-2 px-5 rounded-xl text-[9px] font-extrabold uppercase tracking-[0.15em] border transition-all duration-300 flex justify-between items-center active:scale-[0.98] ${
                                                c.id === 'todo' ? 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10' :
                                                c.id === 'in_progress' ? 'bg-status-warning/10 border-status-warning/20 text-status-warning hover:bg-status-warning/20' :
                                                c.id === 'in_review' ? 'bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary/20' :
                                                'bg-status-success/10 border-status-success/20 text-status-success hover:bg-status-success/20 shadow-lg shadow-status-success/5'
                                            }`}
                                        >
                                            {c.title}
                                            <ArrowRight size={14} className="opacity-40" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>


                </aside>
            </main>
        </div>
    );
};

export default TaskDetailPage;


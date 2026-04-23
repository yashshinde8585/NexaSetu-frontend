import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TaskService from '../api/taskService';
import TeamService from '../api/teamService';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  User,
  Clock,
  AlertCircle,
  Code,
  ShieldAlert,
  ArrowLeft,
  UserPlus,
  Rocket,
  ChevronDown,
  BrainCircuit,
  Tag,
  Loader2,
  Minus,
  Plus,
  Paperclip,
  File,
  ExternalLink,
  Wand2
} from 'lucide-react';
import { BackButton } from '../components/atoms';
import TaskComments from '../components/organisms/TaskComments';
import { ResilientPage } from '../components/states';
import TaskEPIExplanation from '../components/tasks/TaskEPIExplanation';
import { TASK_STATUS, USER_ROLES } from '../constants';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(false);
  const [isEpiExpanded, setIsEpiExpanded] = React.useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = React.useState(false);
  const [blockReason, setBlockReason] = React.useState('');
  const [isEpiLoading, setIsEpiLoading] = React.useState(false);
  const statusMenuRef = React.useRef(null);

  const { data: taskData, isLoading, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => TaskService.getTaskById(taskId).then((res) => res.data?.task),
  });

  const [confirmModal, setConfirmModal] = React.useState({ isOpen: false, targetStatus: null });

  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }) => TaskService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId]);
      queryClient.invalidateQueries(['tasks']);
      setIsStatusMenuOpen(false);
    },
  });

  const blockMutation = useMutation({
    mutationFn: ({ blocked, reason }) => TaskService.toggleTaskBlockage(taskId, blocked, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId]);
      setIsBlockModalOpen(false);
      setBlockReason('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => TaskService.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId]);
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // Close menu on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setIsStatusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [displayRemaining, setDisplayRemaining] = React.useState(taskData?.remainingDuration);

  React.useEffect(() => {
    let intervalId;
    if (taskData?.status === TASK_STATUS.IN_PROGRESS && taskData?.lastStartedAt) {
      // Timer logic
      const calculate = () => {
        if (!taskData?.lastStartedAt) return;
        const elapsedMinutes = (new Date() - new Date(taskData?.lastStartedAt)) / (1000 * 60);
        setDisplayRemaining(Math.max(0, (taskData?.remainingDuration || 0) - elapsedMinutes));
      };
      
      calculate();
      intervalId = setInterval(calculate, 60000); // UI updates every minute
      
      return () => clearInterval(intervalId);
    } else {
      setDisplayRemaining(taskData?.remainingDuration);
    }
  }, [taskData]);

  const formatDuration = (mins) => {
    const rounded = Math.round(mins);
    if (rounded >= 60) {
      const h = Math.floor(rounded / 60);
      const m = rounded % 60;
      return `${h}h${m > 0 ? ` ${m}m` : ''}`;
    }
    return `${rounded || 0}m`;
  };

  const columns = [
    { id: TASK_STATUS.TODO, title: 'To Do', color: 'text-status-error', bg: 'bg-black', border: 'border-status-error' },
    { id: TASK_STATUS.IN_PROGRESS, title: 'In Progress', color: 'text-status-warning', bg: 'bg-black', border: 'border-status-warning' },
    { id: TASK_STATUS.IN_REVIEW, title: 'In Review', color: 'text-secondary', bg: 'bg-black', border: 'border-secondary' },
    { id: TASK_STATUS.DONE, title: 'Done', color: 'text-status-success', bg: 'bg-black', border: 'border-status-success' },
  ];

  const getStatusColor = (status) => columns.find((c) => c.id === status)?.color || 'text-text-muted';
  const getStatusTitle = (status) => columns.find((c) => c.id === status)?.title || status;

  const getAutoDueDate = () => {
    if (!taskData?.estimatedDuration) return null;
    const mins = taskData.estimatedDuration;
    const durationInMs = mins * 60 * 1000;
    return new Date(Date.now() + durationInMs);
  };

  const handleAutoDueDate = () => {
    const newDate = getAutoDueDate();
    if (newDate) updateMutation.mutate({ dueDate: newDate });
  };

  if (!isLoading && !taskData && !error) {
    return (
      <ResilientPage 
        isLoading={false} 
        error={{ uiState: 'not-found' }} 
        onRetry={() => queryClient.invalidateQueries({ queryKey: ['task', taskId] })}
      />
    );
  }

  return (
    <ResilientPage 
      isLoading={isLoading} 
      error={error}
      onRetry={() => queryClient.invalidateQueries({ queryKey: ['task', taskId] })}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-screen md:h-[calc(100vh-80px)] flex flex-col gap-3 py-3 md:overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <BackButton className="shrink-0" />
          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <span className="text-[9px] font-black text-primary px-1.5 py-0.5 bg-black rounded uppercase tracking-wider border border-primary shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.2)]">{taskData?.projectKey || 'NEXA'}-{taskData?.taskNumber || '0'}</span>
              
              <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest border px-2 py-0.5 rounded shrink-0 ${
                taskData?.type === 'bug' ? 'border-status-error text-status-error bg-status-error/10' :
                taskData?.type === 'epic' ? 'border-secondary text-secondary bg-secondary/10' :
                taskData?.type === 'story' ? 'border-status-success text-status-success bg-status-success/10' :
                taskData?.type === 'spike' ? 'border-primary text-primary bg-primary/10' :
                taskData?.type === 'tech_debt' ? 'border-status-warning text-status-warning bg-status-warning/10' :
                'border-white/20 text-white/40 bg-white/5'
              }`}>
                {taskData?.type || 'TASK'}
              </span>

              {taskData?.blocked && (
                <span className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-widest animate-pulse shrink-0">
                  <ShieldAlert size={10} /> BLOCKED
                </span>
              )}
              {taskData?.source === 'github' && (
                <span className="hidden sm:flex items-center gap-1.5 text-[9px] font-bold text-secondary uppercase tracking-[0.2em] border border-secondary/20 px-2 py-0.5 rounded bg-secondary/5 shrink-0"><Code size={12}/> GITHUB SYNCED</span>
              )}
            </div>
            <h1 className="text-lg md:text-xl font-black text-white tracking-tighter truncate max-w-full mt-1">{taskData?.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:gap-8 w-full md:w-auto">
            <div className="text-left md:text-right flex-1 md:flex-none">
              <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.4em] mb-1 block">Priority</span>
              <span className={`text-[10px] font-bold flex items-center gap-1.5 justify-start md:justify-end uppercase tracking-widest ${
                taskData?.priority === 'low' ? 'text-status-success' :
                taskData?.priority === 'high' ? 'text-status-warning' :
                taskData?.priority === 'urgent' ? 'text-status-error' :
                'text-primary'
              }`}>
                <AlertCircle size={10}/> {taskData?.priority || 'Medium'}
              </span>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => {
                  if (taskData?.blocked) {
                    blockMutation.mutate({ blocked: false });
                  } else {
                    setIsBlockModalOpen(true);
                  }
                }}
                className={`flex-1 sm:flex-none px-5 py-2.5 md:py-1.5 rounded-xl border text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                  taskData?.blocked 
                  ? 'bg-black border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:bg-emerald-500/5' 
                  : 'bg-black border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:bg-rose-500/5'
                }`}
                disabled={blockMutation.isPending}
              >
                {blockMutation.isPending ? 'SAVING...' : taskData?.blocked ? 'Unblock' : 'Block'}
              </button>

              <div className="relative flex-1 sm:flex-none" ref={statusMenuRef}>
                <button 
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  className={`w-full flex items-center justify-between gap-3 font-black text-[9px] md:text-[10px] uppercase tracking-widest py-2.5 md:py-1.5 px-4 rounded-xl border transition-all ${getStatusColor(taskData?.status)} ${columns.find(c => c.id === taskData?.status)?.bg} ${columns.find(c => c.id === taskData?.status)?.border} shadow-lg hover:border-white/40 active:scale-95`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor] animate-pulse" />
                    {getStatusTitle(taskData?.status)}
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isStatusMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-56 bg-black border border-white/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[110] animate-in slide-in-from-top-2 duration-300">
                    <div className="px-4 py-3 border-b border-white/20 bg-white/[0.02]">
                       <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em]">Update status</span>
                    </div>
                    {columns.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (c.id !== taskData?.status) {
                            setConfirmModal({ isOpen: true, targetStatus: c });
                          }
                          setIsStatusMenuOpen(false);
                        }}
                        className={`w-full px-5 py-4 text-left flex items-center justify-between group hover:bg-white/[0.05] transition-all ${c.id === taskData?.status ? 'bg-white/[0.02] cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full bg-current ${c.color} ${c.id === taskData?.status ? 'shadow-[0_0_8px_currentColor]' : 'opacity-40 group-hover:opacity-100'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${c.id === taskData?.status ? c.color : 'text-white/60 group-hover:text-white'}`}>
                            {c.title}
                          </span>
                        </div>
                        {c.id === taskData?.status && <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_5px_rgba(59,130,246,0.8)]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 md:overflow-hidden min-h-0 pb-6 md:pb-0">
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden min-h-0">
          {/* Task Description */}
          <section className="flex-1 flex flex-col bg-white/5 border border-white/20 rounded-2xl overflow-hidden shadow-2xl min-h-[250px] md:min-h-0">
             <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
                <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">
                   TASK BRIEF
                </h3>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => !isEpiLoading && setIsEpiExpanded(!isEpiExpanded)}
                    disabled={isEpiLoading}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${isEpiExpanded ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-black border-white/30 text-white/50 hover:bg-white/5 hover:text-white'} disabled:opacity-50 disabled:cursor-wait`}
                  >
                    {isEpiLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <BrainCircuit size={14} className={isEpiExpanded ? 'animate-pulse' : ''} />
                    )}
                    <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">AI insights</span>
                    <span className="text-[9px] font-black uppercase tracking-widest sm:hidden">Insights</span>
                    {!isEpiLoading && <ChevronDown size={12} className={`transition-transform duration-300 ${isEpiExpanded ? 'rotate-180' : ''}`} />}
                  </button>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar leading-relaxed">
                <p className="text-[12px] md:text-[13px] text-white/80 font-black whitespace-pre-wrap selection:bg-primary selection:text-white tracking-tight">{taskData?.description || "No description provided."}</p>
                
                {/* Attachments Display */}
                {taskData?.attachments?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                      MISSION ASSETS ({taskData?.attachments?.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {taskData?.attachments?.map((file, idx) => (
                        <a 
                          key={idx} 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 bg-white/[0.03] border border-white/10 p-2.5 rounded-xl group hover:bg-white/5 hover:border-primary/30 transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center text-primary/60 group-hover:text-primary transition-colors shrink-0">
                              <File size={14} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] font-black text-white/80 truncate group-hover:text-white">{file.name}</span>
                              <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none mt-0.5">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>
                          <ExternalLink size={12} className="text-white/20 group-hover:text-primary transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <TaskEPIExplanation 
                   taskId={taskId} 
                   isExpanded={isEpiExpanded}
                   isOverdue={taskData?.dueDate && new Date() > new Date(taskData?.dueDate) && taskData?.status !== TASK_STATUS.DONE} 
                   onLoadingChange={setIsEpiLoading}
                />
             </div>
          </section>

          {/* Task Metrics */}
          <section className="bg-white/5 border border-white/20 p-4 rounded-xl grid grid-cols-2 md:flex md:flex-row items-center justify-between gap-4 shrink-0 shadow-xl overflow-hidden px-6">
              <div className="flex items-center gap-2 shrink-0">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-black border border-primary flex items-center justify-center text-[8px] font-black text-primary shadow-[0_0_10px_rgba(59,130,246,0.1)] uppercase">
                     {taskData?.assignedUser?.name?.[0] || '?'}
                 </div>
                <div className="min-w-0">
                    <span className="block text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">ASSIGNEE</span>
                    <p className="text-[10px] md:text-[11px] font-black text-white truncate tracking-tight uppercase leading-none">{taskData?.assignedUser?.name?.split(' ')[0] || 'Unassigned'}</p>
                </div>
             </div>

             <div className="hidden md:block w-px h-8 bg-white/10 shrink-0" />

             <div className="flex items-center gap-2 shrink-0">
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-black border border-white/20 flex items-center justify-center text-white/50 group-hover:border-primary transition-all">
                    <User size={10} />
                </div>
                <div className="min-w-0">
                   <span className="block text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">CREATED BY</span>
                   <p className="text-[10px] md:text-[11px] font-black text-white/60 tracking-tight uppercase truncate leading-none">{taskData?.createdBy?.name?.split(' ')[0] || 'System'}</p>
                </div>
             </div>

             <div className="hidden md:block w-px h-8 bg-white/10 shrink-0" />

             <div className="flex items-center gap-2 shrink-0">
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-black border border-secondary flex items-center justify-center text-secondary shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                    <Calendar size={10} />
                </div>
                <div className="min-w-0">
                   <span className="block text-[8px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">SPRINT</span>
                   <p className="text-[10px] md:text-[11px] font-black text-secondary tracking-tight uppercase truncate leading-none">{taskData?.sprintInfo?.name || 'Backlog'}</p>
                </div>
             </div>

             <div className="hidden md:block w-px h-8 bg-white/10 shrink-0" />

               {/* Task Duration Metric */}
              <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-6 h-6 md:w-7 md:h-7 rounded-lg bg-black border flex items-center justify-center transition-all ${taskData?.status === TASK_STATUS.IN_PROGRESS ? 'border-status-success shadow-[0_0_10px_rgba(16,185,129,0.1)] animate-pulse' : 'border-status-success/30'}`}>
                      <Clock size={10} className="text-status-success" />
                  </div>
                  <div className="flex flex-col">
                     <span className="block text-[8px] font-black text-white/50 uppercase tracking-[0.4em] mb-1">EST. TIME</span>
                     <p className="text-lg font-black text-white tracking-tighter uppercase leading-none">
                       {(() => {
                         const mins = taskData?.estimatedDuration || 0;
                         if (mins >= 1440) {
                           const d = mins / 1440;
                           return Number.isInteger(d) ? `${d} DAYS` : `${d.toFixed(1)} DAYS`;
                         }
                         if (mins >= 60) {
                           const h = mins / 60;
                           return Number.isInteger(h) ? `${h} HOURS` : `${h.toFixed(1)} HOURS`;
                         }
                         return `${Math.round(mins)} MINS`;
                       })()}
                     </p>
                  </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-white/10 shrink-0" />

               {/* Mission Deadline Metric */}
              <div className="flex items-center gap-3 shrink-0 group">
                  <div className={`w-6 h-6 md:w-7 md:h-7 rounded-lg bg-black border flex items-center justify-center transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)] ${taskData?.dueDate && new Date(taskData?.dueDate) < new Date() && taskData?.status !== TASK_STATUS.DONE ? 'border-status-error animate-pulse' : 'border-primary/40'}`}>
                      <Calendar size={10} className="text-primary" />
                  </div>
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="block text-[8px] font-black text-white/50 uppercase tracking-[0.4em]">DUE DATE</span>
                     </div>
                     <div className="relative">
                        <p 
                           className={`text-lg font-black tracking-tighter uppercase leading-none transition-all ${taskData?.dueDate && new Date(taskData?.dueDate) < new Date() && taskData?.status !== TASK_STATUS.DONE ? 'text-status-error' : (taskData?.dueDate ? 'text-white' : 'text-primary hover:text-primary-light cursor-pointer underline decoration-dotted')}`}
                           onClick={() => !taskData?.dueDate && handleAutoDueDate()}
                        >
                           {taskData?.dueDate 
                             ? new Date(taskData?.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() 
                             : taskData?.estimatedDuration 
                               ? `~ ${getAutoDueDate()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`
                               : 'NOT SET'}
                        </p>
                     </div>
                  </div>
              </div>
          </section>
        </div>

        {/* Activity Feed */}
        <aside className="lg:col-span-4 flex flex-col gap-4 md:overflow-hidden min-h-[300px] md:min-h-0">
          <section className="flex-1 flex flex-col min-h-0 bg-white/5 border border-white/20 rounded-2xl overflow-hidden shadow-xl">
             <TaskComments taskId={taskId} />
          </section>
        </aside>
      </main>

      {/* Confirm Status Change */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-black border border-white/30 w-full max-w-sm rounded-[2.5rem] p-10 shadow-3xl animate-in zoom-in-95 duration-500 text-center">
             <div className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center border-2 mb-8 shadow-large ${confirmModal.targetStatus?.bg} ${confirmModal.targetStatus?.border} ${confirmModal.targetStatus?.color}`}>
                    <Rocket size={36} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-3 uppercase">Update status</h2>
                 <p className="text-[11px] text-white/50 font-black uppercase tracking-widest leading-loose mb-10 px-6">Are you sure you want to change the status to <span className={confirmModal.targetStatus?.color}>{confirmModal.targetStatus?.title}</span>?</p>
                <div className="grid grid-cols-2 gap-4 w-full">
                   <button onClick={() => setConfirmModal({ isOpen: false, targetStatus: null })} className="py-4 bg-black text-white/60 rounded-xl text-[11px] font-black uppercase tracking-widest border border-white/30 hover:bg-white/5 hover:text-white transition-all active:scale-95">Cancel</button>
                   <button onClick={() => { statusMutation.mutate({ taskId: taskData?._id || taskId, status: confirmModal.targetStatus.id }); setConfirmModal({ isOpen: false, targetStatus: null }); }} className={`py-4 rounded-xl font-black text-[11px] text-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 hover:brightness-110 ${confirmModal.targetStatus?.id === TASK_STATUS.DONE ? 'bg-status-success' : 'bg-primary'}`}>Update</button>
                </div>
             </div>
          </div>
        </div>
      )}
      {/* Block Mission Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black animate-in fade-in duration-500">
           <div className="bg-black border border-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-3xl animate-in zoom-in-95 duration-500 text-center">
             <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-[1.75rem] bg-black border-2 border-status-error flex items-center justify-center text-status-error mb-8 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                    <ShieldAlert size={36} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter mb-3 uppercase">Block task</h2>
                <p className="text-[10px] text-white font-black uppercase tracking-widest leading-loose mb-6 px-6">Why are you blocking this task?</p>
                
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Reason for blocking..."
                  className="w-full bg-black border border-white/30 rounded-xl p-4 text-white text-xs font-black tracking-widest uppercase mb-8 focus:outline-none focus:border-status-error/50 min-h-[100px] resize-none placeholder:text-white/20"
                />

                <div className="grid grid-cols-2 gap-4 w-full">
                   <button onClick={() => setIsBlockModalOpen(false)} className="py-4 bg-black text-white/60 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] border border-white/30 hover:bg-white/5 hover:text-white transition-all active:scale-95">Cancel</button>
                   <button 
                    onClick={() => blockMutation.mutate({ blocked: true, reason: blockReason })} 
                    className="py-4 bg-status-error text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 disabled:opacity-50 hover:brightness-110"
                    disabled={!blockReason.trim() || blockMutation.isPending}
                   >
                     {blockMutation.isPending ? 'SAVING...' : 'Block task'}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
    </ResilientPage>
  );
};

export default TaskDetailPage;

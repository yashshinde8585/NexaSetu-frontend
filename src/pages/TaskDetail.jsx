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
    onError: () => {
    }
  });

  const blockMutation = useMutation({
    mutationFn: ({ blocked, reason }) => TaskService.toggleTaskBlockage(taskId, blocked, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['task', taskId]);
      setIsBlockModalOpen(false);
      setBlockReason('');
    },
    onError: () => {
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => TaskService.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId]);
      queryClient.invalidateQueries(['tasks']);
    },
    onError: () => {
    }
  });

  const reviewMutation = useMutation({
    mutationFn: ({ result, notes }) => TaskService.submitTaskReview(taskId, result, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId]);
      setReviewNotes('');
    }
  });

  const [reviewNotes, setReviewNotes] = React.useState('');

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-auto lg:min-h-0 lg:h-[calc(100vh-60px)] flex flex-col gap-2 py-2 lg:overflow-hidden animate-in fade-in duration-500">
      {/* Ultra-Compact Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 shrink-0 pb-1 border-b border-white/10">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <BackButton className="shrink-0" />
          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-black rounded uppercase tracking-wider border border-primary/40 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                {taskData?.projectKey || 'NEXA'}-{taskData?.taskNumber || '0'}
              </span>
              
              <span className={`text-[9px] font-black uppercase tracking-widest border px-2 py-0.5 rounded shrink-0 ${
                taskData?.type === 'bug' ? 'border-status-error/30 text-status-error bg-status-error/5' :
                taskData?.type === 'epic' ? 'border-secondary/30 text-secondary bg-secondary/5' :
                taskData?.type === 'story' ? 'border-status-success/30 text-status-success bg-status-success/5' :
                taskData?.type === 'spike' ? 'border-primary/30 text-primary bg-primary/5' :
                taskData?.type === 'tech_debt' ? 'border-status-warning/30 text-status-warning bg-status-warning/5' :
                'border-white/10 text-white/40 bg-white/5'
              }`}>
                {taskData?.type || 'TASK'}
              </span>

              {taskData?.blocked && (
                <span className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/30 uppercase tracking-widest animate-pulse shrink-0">
                  <ShieldAlert size={10} /> BLOCKED
                </span>
              )}
              {taskData?.source === 'github' && (
                <span className="hidden sm:flex items-center gap-1.5 text-[9px] font-bold text-secondary uppercase tracking-[0.2em] border border-secondary/20 px-2 py-0.5 rounded bg-secondary/5 shrink-0">
                  <Code size={12}/> REPO SYNC
                </span>
              )}
            </div>
            <h1 className="text-base font-black text-white tracking-tighter truncate max-w-full mt-0.5">
              {taskData?.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Priority Status */}
            <div className="hidden sm:flex flex-col items-end gap-0.5 px-3 border-r border-white/10">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">PRIORITY</span>
              <span className={`text-[10px] font-black flex items-center gap-1.5 uppercase tracking-widest ${
                taskData?.priority === 'low' ? 'text-status-success' :
                taskData?.priority === 'high' ? 'text-status-warning' :
                taskData?.priority === 'urgent' ? 'text-status-error' :
                'text-primary'
              }`}>
                {taskData?.priority || 'Medium'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Tactical Blocking Action */}
              <button 
                onClick={() => {
                  if (taskData?.blocked) {
                    blockMutation.mutate({ blocked: false });
                  } else {
                    setIsBlockModalOpen(true);
                  }
                }}
                className={`h-9 px-4 rounded border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                  taskData?.blocked 
                  ? 'bg-status-success text-black border-status-success' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30'
                }`}
                disabled={blockMutation.isPending}
              >
                {blockMutation.isPending ? 'SYNC...' : taskData?.blocked ? 'RESOLVE' : 'BLOCK'}
              </button>

              {/* Status Command Interface */}
              <div className="relative flex-1 sm:flex-none" ref={statusMenuRef}>
                <button 
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  className={`h-9 w-full sm:w-40 flex items-center justify-between gap-3 font-black text-[10px] uppercase tracking-widest px-4 rounded border transition-all active:scale-95 ${
                    taskData?.status === TASK_STATUS.DONE ? 'bg-status-success text-black border-status-success' :
                    taskData?.status === TASK_STATUS.IN_PROGRESS ? 'bg-primary text-black border-primary' :
                    taskData?.status === TASK_STATUS.IN_REVIEW ? 'bg-secondary text-white border-secondary' :
                    'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {getStatusTitle(taskData?.status)}
                  </div>
                  <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isStatusMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-[#141414] border-2 border-white/20 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    <div className="px-4 py-3 border-b border-white/10 bg-white/[0.03]">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">UPDATE STATUS</span>
                    </div>
                    <div className="p-1.5 space-y-1">
                      {columns.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            if (c.id !== taskData?.status) {
                              setConfirmModal({ isOpen: true, targetStatus: c });
                            }
                            setIsStatusMenuOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left flex items-center justify-between rounded-xl transition-all ${
                            c.id === taskData?.status 
                              ? 'bg-white text-black' 
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{c.title}</span>
                          {c.id === taskData?.status && <div className="w-1.5 h-1.5 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.5)]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 lg:overflow-hidden min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
          {/* Task Briefing Area */}
          <section className="flex flex-col bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-h-[400px] lg:min-h-0 lg:flex-1">
             <div className="px-5 py-2 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">
                   TASK BRIEFING
                </h3>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => !isEpiLoading && setIsEpiExpanded(!isEpiExpanded)}
                    disabled={isEpiLoading}
                    className={`flex items-center gap-2 px-2 py-1 rounded-lg border transition-all text-[8px] font-black uppercase tracking-widest active:scale-95 ${
                      isEpiExpanded 
                        ? 'bg-primary text-black border-primary' 
                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                    } disabled:opacity-50`}
                  >
                    {isEpiLoading ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <BrainCircuit size={10} />
                    )}
                    AI INSIGHTS
                  </button>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar-thin">
                <div className="text-[13px] text-white/80 font-bold whitespace-pre-wrap leading-relaxed tracking-tight selection:bg-primary/30">
                  {taskData?.description || "AWAITING MISSION DATA..."}
                </div>
                
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

          {/* Review Section */}
          {taskData?.status === TASK_STATUS.IN_REVIEW && (
            <section className="bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/30 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-secondary/20 p-2 rounded-lg border border-secondary/40">
                  <ShieldAlert className="text-secondary" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight uppercase">Task Review Required</h3>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest leading-loose">Verify quality and artifacts before completion</p>
                </div>
              </div>

              <textarea 
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Provide feedback for the team..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs font-black tracking-widest uppercase mb-6 focus:outline-none focus:border-secondary/50 min-h-[120px] resize-none placeholder:text-white/20"
              />

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => reviewMutation.mutate({ result: 'approved', notes: reviewNotes })}
                  disabled={reviewMutation.isPending || !reviewNotes.trim()}
                  className="flex-1 bg-status-success text-black py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  Approve & Close
                </button>
                <button 
                  onClick={() => reviewMutation.mutate({ result: 'rejected', notes: reviewNotes })}
                  disabled={reviewMutation.isPending || !reviewNotes.trim()}
                  className="flex-1 bg-status-error text-white py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  Reject (Needs Rework)
                </button>
              </div>
            </section>
          )}

          {/* Tactical Logistics Hub */}
          <section className="bg-white/5 border border-white/10 p-2 rounded-xl flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 shrink-0 shadow-xl px-4">
              <div className="flex items-center gap-2.5 shrink-0">
                  <div className="w-7 h-7 rounded-lg bg-black border border-primary/40 flex items-center justify-center text-[10px] font-black text-primary shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                     {taskData?.assignedUser?.name?.[0] || '?'}
                  </div>
                <div className="min-w-0">
                    <span className="block text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">OPERATOR</span>
                    <p className="text-[10px] font-black text-white truncate tracking-tight uppercase">{taskData?.assignedUser?.name?.split(' ')[0] || 'UNASSIGNED'}</p>
                </div>
             </div>

             <div className="hidden lg:block w-px h-6 bg-white/5 shrink-0" />

             <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-black border border-white/10 flex items-center justify-center text-white/30">
                    <Calendar size={10} />
                </div>
                <div className="min-w-0">
                   <span className="block text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">SPRINT</span>
                   <p className="text-[10px] font-black text-secondary tracking-tight uppercase truncate">{taskData?.sprintInfo?.name || 'BACKLOG'}</p>
                </div>
             </div>

             <div className="hidden lg:block w-px h-6 bg-white/5 shrink-0" />

               {/* Time Budgeting */}
              <div className="flex items-center gap-3 shrink-0">
                  <div className={`w-7 h-7 rounded-lg bg-black border flex items-center justify-center transition-all ${taskData?.status === TASK_STATUS.IN_PROGRESS ? 'border-status-success shadow-[0_0_10px_rgba(16,185,129,0.1)] animate-pulse' : 'border-white/10'}`}>
                      <Clock size={10} className="text-status-success" />
                  </div>
                  <div className="flex flex-col">
                     <span className="block text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">ALLOCATION</span>
                     <p className="text-base font-black text-white tracking-tighter uppercase leading-none">
                       {(() => {
                         const mins = taskData?.estimatedDuration || 0;
                         if (mins >= 1440) return `${(mins / 1440).toFixed(1)}D`;
                         if (mins >= 60) return `${(mins / 60).toFixed(1)}H`;
                         return `${Math.round(mins)}M`;
                       })()}
                     </p>
                  </div>
              </div>

              <div className="hidden lg:block w-px h-8 bg-white/5 shrink-0" />

               {/* Deadline Tracking */}
              <div className="flex items-center gap-3 shrink-0 group">
                  <div className={`w-7 h-7 rounded-lg bg-black border flex items-center justify-center transition-all ${taskData?.dueDate && new Date(taskData?.dueDate) < new Date() && taskData?.status !== TASK_STATUS.DONE ? 'border-status-error animate-pulse' : 'border-primary/30'}`}>
                      <Calendar size={10} className="text-primary" />
                  </div>
                  <div className="flex flex-col">
                     <span className="block text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">DEADLINE</span>
                     <div className="relative">
                        <p 
                           className={`text-base font-black tracking-tighter uppercase leading-none transition-all ${taskData?.dueDate && new Date(taskData?.dueDate) < new Date() && taskData?.status !== TASK_STATUS.DONE ? 'text-status-error' : (taskData?.dueDate ? 'text-white' : 'text-primary hover:text-primary-light cursor-pointer underline decoration-dotted decoration-primary/30')}`}
                           onClick={() => !taskData?.dueDate && handleAutoDueDate()}
                        >
                           {taskData?.dueDate 
                             ? new Date(taskData?.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() 
                             : 'ESTABLISHING...'}
                        </p>
                     </div>
                  </div>
              </div>
          </section>
        </div>

        {/* Tactical Interaction Panel */}
        <aside className="lg:col-span-4 flex flex-col gap-2 min-h-[400px] lg:min-h-0 lg:overflow-hidden">
          <section className="flex flex-col min-h-0 bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-xl flex-1">
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

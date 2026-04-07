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
  ArrowLeft,
  UserPlus,
  Rocket,
  ChevronDown,
  BrainCircuit,
  Tag,
  Loader2
} from 'lucide-react';
import TaskComments from '../components/organisms/TaskComments';
import TaskEPIExplanation from '../components/tasks/TaskEPIExplanation';
import { TASK_STATUS, USER_ROLES } from '../constants';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(false);
  const [isEpiExpanded, setIsEpiExpanded] = React.useState(false);
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
    if (taskData?.status === TASK_STATUS.IN_PROGRESS && taskData?.lastStartedAt) {
      // Timer logic
      const calculate = () => {
        const elapsedMinutes = (new Date() - new Date(taskData.lastStartedAt)) / (1000 * 60);
        setDisplayRemaining(Math.max(0, taskData.remainingDuration - elapsedMinutes));
      };
      
      calculate();

      return () => clearInterval(interval);
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

  if (isLoading) return <div className="flex justify-center items-center h-[calc(100vh-110px)] bg-black/20"><div className="relative"><div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full animate-pulse" /><Loader2 size={40} className="text-primary animate-spin relative" /></div></div>;

  if (error || !taskData) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><h2 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">Mission Terminated</h2><button onClick={() => navigate(-1)} className="bg-primary/20 text-primary border border-primary/30 px-6 py-2 rounded-xl font-bold">Go Back</button></div>;

  const columns = [
    { id: TASK_STATUS.TODO, title: 'To Do', color: 'text-status-error', bg: 'bg-status-error/10', border: 'border-status-error/20' },
    { id: TASK_STATUS.IN_PROGRESS, title: 'In Progress', color: 'text-status-warning', bg: 'bg-status-warning/10', border: 'border-status-warning/20' },
    { id: TASK_STATUS.IN_REVIEW, title: 'In Review', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
    { id: TASK_STATUS.DONE, title: 'Done', color: 'text-status-success', bg: 'bg-status-success/10', border: 'border-status-success/20' },
  ];

  const getStatusColor = (status) => columns.find((c) => c.id === status)?.color || 'text-text-muted';
  const getStatusTitle = (status) => columns.find((c) => c.id === status)?.title || status;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-110px)] flex flex-col gap-4 py-4 overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex items-center justify-between shrink-0 pb-4 border-b border-white/5">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all shadow-sm"><ArrowLeft size={18} /></button>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded uppercase tracking-wider border border-primary/20 shrink-0">{taskData.projectKey}-{taskData.taskNumber || '0'}</span>
            <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight truncate max-w-xl">{taskData.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em] mb-1 block">Priority</span>
              <span className={`text-[10px] font-bold flex items-center gap-1.5 justify-end uppercase tracking-widest ${
                taskData.priority === 'low' ? 'text-status-success' :
                taskData.priority === 'high' ? 'text-status-warning' :
                taskData.priority === 'urgent' ? 'text-status-error' :
                'text-primary'
              }`}>
                <AlertCircle size={10}/> {taskData.priority || 'Medium'}
              </span>
            </div>
            
            <div className="w-px h-8 bg-white/5 hidden md:block" />

            {/* Status Select */}
            <div className="relative" ref={statusMenuRef}>
              <div className="text-right">
                <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em] mb-1 block mr-4">Mission State</span>
                <button 
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  className={`flex items-center gap-2.5 font-bold text-[10px] uppercase tracking-widest py-1.5 px-3 rounded-lg border transition-all ${getStatusColor(taskData.status)} ${columns.find(c => c.id === taskData.status)?.bg} ${columns.find(c => c.id === taskData.status)?.border} hover:bg-white/5`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor] animate-pulse" />
                  {getStatusTitle(taskData.status)}
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Dropdown Menu */}
              {isStatusMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0A0B14] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[110] animate-in slide-in-from-top-2 duration-200 backdrop-blur-3xl">
                  {columns.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        if (c.id !== taskData.status) {
                          setConfirmModal({ isOpen: true, targetStatus: c });
                        }
                        setIsStatusMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between group hover:bg-white/[0.03] transition-colors ${c.id === taskData.status ? 'bg-white/[0.02] cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full bg-current ${c.color} ${c.id === taskData.status ? 'shadow-[0_0_8px_currentColor]' : 'opacity-40 group-hover:opacity-100'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${c.id === taskData.status ? c.color : 'text-white/40 group-hover:text-white'}`}>
                          {c.title}
                        </span>
                      </div>
                      {c.id === taskData.status && <div className="w-1 h-1 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden min-h-0">
          {/* Task Description */}
          <section className="flex-1 flex flex-col bg-white/[0.015] border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-3xl min-h-0">
             <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] flex items-center gap-2.5">
                   <Tag size={14} className="text-primary" /> Intelligence Brief
                </h3>
                
                <div className="flex items-center gap-4">
                  {taskData.source === 'github' && <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] border border-secondary/20 px-2 py-0.5 rounded bg-secondary/5 flex items-center gap-1.5"><Code size={12}/> GitHub Sync</span>}
                  
                  <button 
                    onClick={() => setIsEpiExpanded(!isEpiExpanded)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${isEpiExpanded ? 'bg-primary/10 border-primary/30 text-primary shadow-lg shadow-primary/5' : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:text-white'}`}
                  >
                    <BrainCircuit size={14} className={isEpiExpanded ? 'animate-pulse' : ''} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Tactical Intelligence</span>
                    {isEpiExpanded && <ChevronDown size={12} className="rotate-180 transition-all animate-in fade-in zoom-in-75 duration-300" />}
                  </button>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/5">
                <p className="text-[15px] text-white/70 leading-relaxed font-medium whitespace-pre-wrap">{taskData.description || "No mission instructions provided."}</p>
                <TaskEPIExplanation 
                   taskId={taskId} 
                   isExpanded={isEpiExpanded}
                   isOverdue={taskData.dueDate && new Date() > new Date(taskData.dueDate) && taskData.status !== TASK_STATUS.DONE} 
                />
             </div>
          </section>

          {/* Task Metrics */}
          <section className="bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl backdrop-blur-md flex flex-nowrap items-center justify-between gap-4 shrink-0 shadow-lg px-6 overflow-hidden">
             {/* Assignee */}
             <div className="flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary shadow-lg">
                    {taskData.assignedUser?.name[0].toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                    <span className="block text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mb-0.5">Strategist</span>
                    <p className="text-[10px] font-bold text-white truncate tracking-tight uppercase leading-none">{taskData.assignedUser?.name || 'Unassigned'}</p>
                </div>
             </div>

             <div className="w-px h-6 bg-white/5 shrink-0" />

             {/* Creator */}
             <div className="flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shadow-sm">
                    <User size={13} />
                </div>
                <div className="min-w-0">
                   <span className="block text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mb-0.5">Originator</span>
                   <p className="text-[10px] font-bold text-white/70 tracking-tight uppercase truncate leading-none">{taskData.createdBy?.name || 'System'}</p>
                </div>
             </div>

             <div className="w-px h-6 bg-white/5 shrink-0" />

             {/* Sprint */}
             <div className="flex items-center gap-3 shrink-0 max-w-[20%]">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-sm">
                    <Calendar size={13} />
                </div>
                <div className="min-w-0">
                   <span className="block text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mb-0.5">Objective</span>
                   <p className="text-[10px] font-bold text-secondary tracking-tight uppercase truncate leading-none">{taskData.sprintInfo?.name || 'Backlog'}</p>
                </div>
             </div>

             <div className="w-px h-6 bg-white/5 shrink-0" />

               {/* Timer */}
               <div className="flex items-center gap-3 shrink-0">
                 <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shadow-sm transition-all ${taskData.status === TASK_STATUS.IN_PROGRESS ? 'bg-primary/20 border-primary/30 text-primary animate-pulse' : 'bg-status-success/10 border-status-success/20 text-status-success'}`}>
                     <Clock size={13} />
                 </div>
                 <div>
                    <span className="block text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mb-0.5">Duration</span>
                    <p className="text-[10px] font-bold text-white/80 tracking-tight uppercase leading-none mb-1">
                      Est: {formatDuration(taskData.estimatedDuration)}
                    </p>
                    <p className={`text-[9px] font-bold tracking-tight uppercase leading-none transition-all ${
                      taskData.status === TASK_STATUS.IN_PROGRESS ? 'text-primary' : 'text-status-success/80 opacity-60'
                    }`}>
                      Rem: {formatDuration(displayRemaining || taskData.remainingDuration || taskData.estimatedDuration)}
                    </p>
                 </div>
               </div>
          </section>
        </div>

        {/* Activity Feed */}
        <aside className="lg:col-span-4 flex flex-col gap-6 overflow-hidden min-h-0">
          <section className="flex-1 flex flex-col min-h-0 bg-white/[0.015] border border-white/5 rounded-[1.75rem] shadow-xl overflow-hidden">
             <TaskComments taskId={taskId} />
          </section>
        </aside>
      </main>

      {/* Confirm Status Change */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-[#0A0A0F] border border-white/10 w-full max-w-sm rounded-[2.5rem] p-10 shadow-full animate-in zoom-in-95 duration-500 text-center">
             <div className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center border-2 mb-8 shadow-large ${confirmModal.targetStatus?.bg} ${confirmModal.targetStatus?.border} ${confirmModal.targetStatus?.color}`}>
                    <Rocket size={36} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-3 uppercase">Authorize Reroute</h2>
                <p className="text-[11px] text-white/40 font-semibold uppercase tracking-widest leading-loose mb-10 px-6">Proceed with transitioning current objective to <span className={confirmModal.targetStatus?.color}>{confirmModal.targetStatus?.title}</span> command state?</p>
                <div className="grid grid-cols-2 gap-4 w-full">
                   <button onClick={() => setConfirmModal({ isOpen: false, targetStatus: null })} className="py-4 bg-white/5 text-white/30 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all active:scale-95">Abort Mission</button>
                   <button onClick={() => { statusMutation.mutate({ taskId: taskData._id, status: confirmModal.targetStatus.id }); setConfirmModal({ isOpen: false, targetStatus: null }); }} className={`py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 ${confirmModal.targetStatus?.id === TASK_STATUS.DONE ? 'bg-status-success' : 'bg-primary'}`}>Confirm Transition</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;

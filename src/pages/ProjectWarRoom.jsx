import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { 
  ShieldAlert, 
  Target, 
  Zap, 
  Clock, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  ClipboardCheck,
  Activity,
  Flame,
  RefreshCw
} from 'lucide-react';
import { ResilientPage } from '../components/states';
import { BackButton } from '../components/atoms';

const ProjectWarRoom = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: warRoomData, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['war-room', projectId],
    queryFn: () => apiClient.get(`/leadership/war-room/${projectId}`).then(res => res.data || null),
  });

  if (isLoading) return <ResilientPage isLoading={true} />;
  
  if (error || !warRoomData) return (
    <ResilientPage 
      error={error || { message: 'TACTICAL_DATA_UNAVAILABLE' }} 
      onRetry={() => window.location.reload()} 
    />
  );

  const { 
    project = { name: 'Unknown', key: '???', progress: 0, health: 'ON_TRACK' }, 
    metrics = { total: 0, blocked: 0, critical: 0, drift: '0d' }, 
    blockers = [], 
    directives = [], 
    reviewQueue = [], 
    burnoutRisks = [], 
    eventFeed = [] 
  } = warRoomData;

  const getHealthColor = (health) => {
    switch (health) {
      case 'AT_RISK': return 'text-status-error border-status-error bg-status-error/10';
      case 'NEEDS_ATTENTION': return 'text-status-warning border-status-warning bg-status-warning/10';
      default: return 'text-status-success border-status-success bg-status-success/10';
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-4 lg:p-6 space-y-6 animate-in fade-in duration-700">
      {/* Header Context */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{project.key} CONTEXT</span>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest ${getHealthColor(project.health)}`}>
                {project.health.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white">{project.name}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:gap-8">
          <button 
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group disabled:opacity-50"
          >
            <RefreshCw size={12} className={`text-primary transition-transform ${isFetching ? 'animate-spin' : 'group-hover:rotate-180 duration-500'}`} />
            <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Sync</span>
          </button>

          <div className="flex items-center gap-4">
             <div className="text-right">
                <span className="block text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">Velocity</span>
                <div className="flex items-center gap-2">
                   <span className="text-sm font-black text-white">{project.progress}%</span>
                   <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Strategic & Critical Path */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Execution Metrics Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {[
               { label: 'Total', value: metrics.total, icon: Target, color: 'text-white' },
               { label: 'Blocked', value: metrics.blocked, icon: ShieldAlert, color: 'text-status-error' },
               { label: 'Critical', value: metrics.critical, icon: Zap, color: 'text-secondary' },
               { label: 'Drift', value: metrics.drift, icon: Clock, color: 'text-status-warning' },
             ].map((m, i) => (
               <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col gap-1">
                 <div className="flex justify-between items-start">
                   <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{m.label}</span>
                   <m.icon size={12} className={m.color} />
                 </div>
                 <span className={`text-xl font-black ${m.color}`}>{m.value}</span>
               </div>
             ))}
          </section>

          {/* Review Queue: Enforcement Layer */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <ClipboardCheck size={12} className="text-secondary" /> Quality Review Queue
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reviewQueue.length > 0 ? reviewQueue.map((r, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 bg-secondary/5 border border-secondary/20 rounded-lg group hover:border-secondary transition-all">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[11px] font-bold text-white group-hover:text-secondary transition-colors line-clamp-1">{r.title}</h4>
                    <span className="text-[7px] font-black text-secondary px-1 py-0.5 border border-secondary/30 rounded uppercase tracking-widest">PENDING</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-white/40 font-bold uppercase tracking-widest">
                    <span>Owner: {r.owner}</span>
                    <button onClick={() => navigate(`/task/${r.id}`)} className="text-secondary hover:underline">Review</button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-6 text-center text-white/10 text-[9px] font-black uppercase tracking-widest">No pending reviews</div>
              )}
            </div>
          </section>

          {/* Active Directives: Control Flow */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Zap size={12} className="text-primary" /> Tactical Directives
            </h3>
            <div className="space-y-3">
              {directives.length > 0 ? directives.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-lg group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] text-primary font-black">
                      {d.type[0]}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-white group-hover:text-primary transition-colors">{d.title}</h4>
                      <p className="text-[8px] text-white/40 uppercase tracking-widest">P{d.priority} Control</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-white" />
                </div>
              )) : (
                <div className="py-6 text-center text-white/20 text-[9px] font-black uppercase tracking-widest">Awaiting Directives</div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Blockers & Intelligence */}
        <div className="lg:col-span-4 space-y-6">
           {/* Autonomous Intelligence: Sentinel Action */}
           <section className="bg-gradient-to-br from-status-error/5 to-transparent border border-status-error/10 rounded-xl p-4">
              <h3 className="text-[10px] font-black text-status-error uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <ShieldAlert size={12} /> Autonomous Sentinel
              </h3>
              <div className="space-y-3">
                 {blockers.map((b, i) => (
                   <div key={i} className="p-3 bg-black/40 border border-status-error/10 rounded-lg space-y-2">
                      <h4 className="text-[10px] font-bold text-white">{b.title}</h4>
                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/40">
                         <span>STAGNATION: 48h+</span>
                         <span className="text-status-error">CRITICAL</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/task/${b.id}`)}
                        className="w-full py-1.5 bg-status-error border border-status-error/30 text-white text-[8px] font-black uppercase tracking-widest hover:brightness-110 transition-all rounded"
                      >
                        Enforce Intervention
                      </button>
                   </div>
                 ))}
                 {blockers.length === 0 && (
                    <div className="py-2 text-center text-status-success text-[8px] font-black uppercase tracking-widest">Signals Green</div>
                 )}
              </div>
           </section>

           {/* Personnel Intelligence: Burnout Risk */}
           <section className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Flame size={12} className="text-status-warning" /> Burnout Sentinel
              </h3>
              <div className="space-y-2">
                 {burnoutRisks.length > 0 ? burnoutRisks.map((m, i) => (
                   <div key={i} className="flex justify-between items-center p-2 bg-white/[0.02] border border-white/5 rounded-lg">
                      <div>
                        <span className="block text-[10px] font-bold text-white">{m.name}</span>
                        <span className="text-[8px] text-white/30 uppercase tracking-widest">{m.role}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-black text-status-warning">{m.load}%</span>
                        <span className="text-[7px] font-black text-status-error uppercase">Overload</span>
                      </div>
                   </div>
                 )) : (
                   <div className="py-2 text-center text-white/10 text-[9px] font-black uppercase tracking-widest">Load Nominal</div>
                 )}
              </div>
           </section>

           {/* Event Log: Real-time Feed */}
           <section className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Activity size={12} className="text-primary" /> Event Feed
              </h3>
              <div className="space-y-4">
                 {eventFeed.map((e, i) => (
                   <div key={i} className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:bg-primary before:rounded-full after:absolute after:left-0.5 after:top-3.5 after:w-[1px] after:h-[calc(100%+4px)] after:bg-white/10 last:after:hidden">
                      <p className="text-[10px] font-bold text-white/80 leading-tight">{e.text}</p>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{e.time}</span>
                   </div>
                 ))}
                 {eventFeed.length === 0 && (
                   <div className="py-2 text-center text-white/10 text-[9px] font-black uppercase tracking-widest">Awaiting Events</div>
                 )}
              </div>
           </section>
        </div>
      </main>
    </div>
  );
};

export default ProjectWarRoom;

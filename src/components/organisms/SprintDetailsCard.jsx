import React from 'react';
import PropTypes from 'prop-types';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Users, 
  Clock, 
  AlertCircle, 
  Plus, 
  Activity,
  Zap
} from 'lucide-react';
import VelocityIndicator from '../molecules/VelocityIndicator';
import ItemBreakdownHeader from '../molecules/ItemBreakdownHeader';

/**
 * Tactical Sprint Intelligence Module.
 * Orchestrates deep performance analytics and workforce saturation metrics.
 * Optimized for industrial sunlight legibility and decision-first engineering.
 */
const SprintDetailsCard = ({
  sprint,
  metrics,
  stats,
  statsLoading,
  showWorkload,
  setShowWorkload,
  onDownload,
  sprints = [],
  onSprintChange,
  selectedSprintId,
  onAddSprint,
  onFinalize,
  finalizing,
  canCreate
}) => {
  if (!sprint) return null;

  return (
    <div className="bg-black border border-white/30 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-3xl relative overflow-hidden group">
      
      {/* Dynamic Background Telemetry */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />

      {/* Header Overview - Tactical Orchestration */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-12 pb-10 border-b border-white/15 relative z-20">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
             {/* Dynamic Cycle Selector */}
            <div className="relative group/cycle z-50 w-full lg:w-auto">
               <div className="flex flex-col bg-black border border-white/30 rounded-xl min-w-0 lg:min-w-[320px] transition-all hover:border-primary shadow-xl overflow-hidden">
                 <div className="flex items-center justify-between px-6 py-4 bg-black border-b border-white/30 cursor-pointer hover:bg-white/5 transition-all">
                   <div className="flex flex-col gap-1">
                     <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                       <Clock size={14} className="text-primary" />
                       {sprint.name.toUpperCase()}
                     </span>
                     <span className="text-[9px] text-white/60 font-black uppercase tracking-widest flex items-center gap-2">
                        <Activity size={10} className="text-status-success" />
                        CORE CYCLE STATUS: {sprint.status?.toUpperCase() || 'UNKNOWN'}
                     </span>
                   </div>
                   <ChevronDown className="w-5 h-5 text-white/20 group-hover/cycle:text-primary transition-all duration-500" />
                 </div>
                 
                 {/* Standardized Dropdown */}
                 <div className="absolute top-full left-0 w-full bg-black border border-white/30 opacity-0 invisible group-hover/cycle:opacity-100 group-hover/cycle:visible transition-all duration-300 z-50 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                   {sprints.map(s => (
                     <button 
                       key={s._id} 
                       onClick={() => onSprintChange(s._id)}
                       className={`w-full text-left px-6 py-4 border-b border-white/5 last:border-0 transition-all ${selectedSprintId === s._id ? 'bg-primary/20 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                     >
                       <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
                     </button>
                   ))}
                 </div>
               </div>
            </div>

            {/* Tactical Control Suite */}
            {canCreate && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={onAddSprint}
                  className="w-14 h-14 flex items-center justify-center bg-black border border-white/30 rounded-xl hover:border-primary text-white/60 hover:text-primary transition-all shadow-xl group/add active:scale-95"
                  title="Initialize New Cycle"
                >
                  <Plus size={20} strokeWidth={3} className="group-hover/add:rotate-90 transition-transform" />
                </button>
                {sprint.status !== 'completed' && (
                  <button
                    onClick={onFinalize}
                    disabled={finalizing}
                    className="h-14 px-10 bg-black border border-status-success/40 text-status-success hover:bg-status-success hover:text-black rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95 disabled:opacity-50 shadow-xl"
                  >
                    {finalizing ? 'PROCESSING...' : 'COMPLETE CYCLE'}
                  </button>
                )}
              </div>
            )}
          </div>


        </div>

        {/* Temporal Metrics Row */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 lg:border-l lg:border-white/15 lg:pl-10">
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-white/50 font-black uppercase tracking-widest">Inception Date</span>
            <span className="text-sm font-black text-white uppercase tracking-tight">
              {new Date(sprint.startDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-white/50 font-black uppercase tracking-widest">Termination Point</span>
            <span className="text-sm font-black text-white uppercase tracking-tight">
              {new Date(sprint.endDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="flex flex-col gap-1.5">
             <span className="text-[9px] text-white/50 font-black uppercase tracking-widest">Mission Span</span>
             <span className="text-sm font-black text-primary uppercase tracking-tight">
              {Math.max(1, Math.ceil((new Date(sprint.endDate) - new Date(sprint.startDate)) / (1000 * 60 * 60 * 24)))} CYCLES
            </span>
          </div>
          {canCreate && (
            <button
               onClick={onDownload}
               className="ml-auto w-12 h-12 bg-black border border-white/30 rounded-xl hover:border-primary text-primary transition-all flex items-center justify-center shadow-xl group/export active:scale-95"
               title="Export Protocol Intelligence"
            >
              <FileText className="w-5 h-5 group-hover/export:scale-110 transition-all" />
            </button>
          )}
        </div>
      </div>

      {/* Intelligence Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        <div className="lg:col-span-4 bg-black border border-white/15 rounded-2xl p-6 shadow-inner relative overflow-hidden flex flex-col justify-between">

          <VelocityIndicator data={metrics.velocitySpark} statsLoading={statsLoading} />
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <ItemBreakdownHeader metrics={metrics} statsLoading={statsLoading} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
             <div className="bg-black border border-white/30 rounded-xl p-5 group hover:border-primary transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <div className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-3 flex items-center justify-between">
                   FLOW EFFICIENCY
                   <Zap size={10} className="text-secondary" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-black text-white">{metrics.flowEfficiency || '0'}<span className="text-xs text-white/50 ml-1">%</span></div>
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-secondary shadow-[0_0_10px_rgba(236,72,153,0.5)]" style={{width: `${metrics.flowEfficiency || 0}%`}} />
                  </div>
                </div>
             </div>

             <div className="bg-black border border-white/30 rounded-xl p-5 group hover:border-status-warning transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <div className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-3 flex items-center justify-between">
                   STRATEGIC DEBT
                   <Clock size={10} className="text-status-warning" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-black text-status-warning">{metrics.strategicDebt || 0}</div>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">PENDING UNITS</div>
                </div>
             </div>

             <div className="bg-black border border-white/30 rounded-xl p-5 group hover:border-status-info transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <div className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-3 flex items-center justify-between">
                   BLOCKER DENSITY
                   <AlertCircle size={10} className="text-status-info" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-black text-status-info">{metrics.blockerDensity || 0}</div>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">ACTIVE STALLS</div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Workforce Saturation (Pulse) */}
      {canCreate && (
        <div className="mt-10 pt-10 border-t border-white/15 relative z-10">
          <button 
            onClick={() => setShowWorkload(!showWorkload)}
            className="flex justify-between items-center w-full px-6 py-4 bg-black border border-white/30 rounded-xl hover:bg-white/5 hover:border-primary transition-all select-none shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <Users size={18} className="text-white/60" />
               </div>
               <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80">
                  Execution Pulse Matrix
               </span>
            </div>
            {showWorkload ? <ChevronDown size={20} className="text-primary" /> : <ChevronRight size={20} className="text-white/20" />}
          </button>

          {showWorkload && (
            <div className="mt-8 animate-[fadeIn_500ms_ease_forwards,slideInFromTop_500ms_ease_forwards]">
               {metrics.workload?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {metrics.workload.map((wp, idx) => (
                    <div
                      key={idx}
                      className="bg-black border border-white/15 rounded-xl px-6 py-5 flex items-center gap-5 hover:border-primary/60 hover:bg-white/5 transition-all shadow-xl group/person"
                    >
                      <div className="w-12 h-12 rounded-lg bg-black border border-white/30 flex items-center justify-center text-[11px] font-black text-white group-hover/person:border-primary/40 group-hover/person:text-primary transition-all shadow-inner uppercase">
                        {wp.name.charAt(0)}
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[11px] font-black text-white uppercase tracking-tight truncate">
                          {wp.name}
                        </span>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">
                            {wp.count} ACTIVE
                           </span>
                           <div className={`w-1 h-1 rounded-full ${wp.count > 5 ? 'bg-status-error' : 'bg-status-success'}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
               ) : (
                 <div className="py-20 text-center bg-black border border-dashed border-white/30 rounded-2xl flex flex-col items-center gap-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    <Users size={40} className="text-white/10" />
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Zero Personnel Linked to Active Cycle</span>
                 </div>
               )}
            </div>
          )}
        </div>
      )}
      

    </div>
  );
};

SprintDetailsCard.propTypes = {
  sprint: PropTypes.object,
  metrics: PropTypes.object.isRequired,
  stats: PropTypes.object,
  statsLoading: PropTypes.bool,
  showWorkload: PropTypes.bool,
  setShowWorkload: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default SprintDetailsCard;

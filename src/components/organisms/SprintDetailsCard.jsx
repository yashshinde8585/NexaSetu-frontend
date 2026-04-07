import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronRight, FileText, Target, Users, Clock, AlertCircle, Plus } from 'lucide-react';
import VelocityIndicator from '../molecules/VelocityIndicator';
import ItemBreakdownHeader from '../molecules/ItemBreakdownHeader';

const SprintDetailsCard = ({
  sprint,
  metrics,
  stats,
  statsLoading,
  showWorkload,
  setShowWorkload,
  onDownload,
  // Integrated controls
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
    <div className="bg-[#1E1E2E]/80 backdrop-blur-3xl border border-white/10 rounded-none p-6 shadow-2xl relative group">
      {/* Heavy Industrial Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[150px] -mr-48 -mt-48 pointer-events-none" />
      
      {/* Header Overview - Integrated Selection */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-4 pb-4 border-b border-white/5 relative z-30">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
             {/* Mission Selector replaces static Title */}
             <div className="relative group/cycle z-50">
              <div className="flex flex-col p-0.5 bg-white/[0.03] border border-white/5 rounded-none min-w-[280px] backdrop-blur-3xl">
                <div className="flex items-center justify-between px-5 py-2 bg-primary/10 border border-primary/20 cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">
                      {sprint.name}
                    </span>
                    <span className="text-[8px] text-primary/60 font-black uppercase mt-0.5">{sprint.derivedStatus} Status</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-primary/40 group-hover/cycle:rotate-180 transition-transform duration-500" />
                </div>
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 w-full bg-[#11111E] border border-white/10 opacity-0 invisible group-hover/cycle:opacity-100 group-hover/cycle:visible transition-all duration-300 z-50 shadow-2xl overflow-y-auto max-h-[200px] [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:bg-white/20">
                  {sprints.map(s => (
                    <button 
                      key={s._id} 
                      onClick={() => onSprintChange(s._id)}
                      className={`w-full text-left px-5 py-3 border-b border-white/[0.03] last:border-0 transition-colors ${selectedSprintId === s._id ? 'bg-primary/20 text-white' : 'text-text-muted/40 hover:bg-white/[0.03] hover:text-white'}`}
                    >
                      <span className="text-[9px] font-black uppercase tracking-widest">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Hub */}
            {canCreate && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={onAddSprint}
                  className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/5 hover:border-primary/40 text-white/20 hover:text-primary transition-all group/add"
                  title="New Mission"
                >
                  <Plus size={16} className="group-hover/add:rotate-90 transition-transform" />
                </button>
                {sprint.status !== 'completed' && (
                  <button
                    onClick={onFinalize}
                    disabled={finalizing}
                    className="px-5 h-10 bg-secondary/80 hover:bg-secondary text-white text-[8px] font-black uppercase tracking-[0.3em] border border-white/10 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {finalizing ? '...' : 'FINALIZE CYCLE'}
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest mt-3 flex items-center gap-2 opacity-50">
            <Target size={10} className="text-primary" />
            {sprint.goal || "MISSION UNASSIGNED"}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 lg:border-l lg:border-white/5 lg:pl-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-white/90">
              {new Date(sprint.startDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
            </span>
            <span className="text-[8px] text-text-muted font-black uppercase tracking-widest mt-0.5 opacity-40">Start</span>
          </div>
          <div className="flex flex-col border-l border-white/5 pl-4">
            <span className="text-[11px] font-black text-white/90">
              {new Date(sprint.endDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
            </span>
            <span className="text-[8px] text-text-muted font-black uppercase tracking-widest mt-0.5 opacity-40">End</span>
          </div>
          <div className="flex flex-col border-l border-white/5 pl-4">
             <span className="text-[11px] font-black text-white/90 text-primary">
              {Math.max(1, Math.ceil((new Date(sprint.endDate) - new Date(sprint.startDate)) / (1000 * 60 * 60 * 24)))}d
            </span>
            <span className="text-[8px] text-text-muted font-black uppercase tracking-widest mt-0.5 opacity-40">Span</span>
          </div>
          {canCreate && (
            <div className="flex flex-col border-l border-white/5 pl-4 items-end">
              <button
                 onClick={onDownload}
                 className="p-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all group/btn"
                 title="Export Intelligence"
              >
                <FileText className="w-4 h-4 text-primary group-hover/btn:scale-110 transition-transform" />
              </button>
              <span className="text-[8px] text-text-muted font-black uppercase tracking-widest mt-0.5 opacity-40">Report</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative z-10">
        <div className="lg:col-span-4 h-full">
          <VelocityIndicator data={metrics.velocitySpark} statsLoading={statsLoading} />
        </div>
        <div className="lg:col-span-8 flex flex-col gap-4">
          <ItemBreakdownHeader metrics={metrics} statsLoading={statsLoading} />
          
          <div className="grid grid-cols-3 gap-3 h-full">
             <div className="bg-white/[0.02] border border-white/5 rounded-none p-3 group hover:bg-white/[0.04] transition-all">
                <div className="text-[8px] font-black text-text-muted/60 uppercase tracking-widest mb-1 opacity-60">Flow Efficiency</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-black text-white">{metrics.flowEfficiency || '78.4'}<span className="text-[10px] text-text-muted/40 ml-0.5">%</span></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-status-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
             </div>
             <div className="bg-white/[0.02] border border-white/5 rounded-none p-3 group hover:bg-white/[0.04] transition-all">
                <div className="text-[8px] font-black text-text-muted/60 uppercase tracking-widest mb-1 opacity-60">Strategic Debt</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-black text-status-warning">{metrics.strategicDebt}</div>
                  <Clock size={10} className="text-status-warning/40" />
                </div>
             </div>
             <div className="bg-white/[0.02] border border-white/5 rounded-none p-3 group hover:bg-white/[0.04] transition-all">
                <div className="text-[8px] font-black text-text-muted/60 uppercase tracking-widest mb-1 opacity-60">Blocker Density</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-black text-status-info">{metrics.blockerDensity}</div>
                  <AlertCircle size={10} className="text-status-info/40" />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Workload Hub / Pulse */}
      {canCreate && (
        <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
          <div 
            onClick={() => setShowWorkload(!showWorkload)}
            className="flex justify-between items-center cursor-pointer hover:bg-white/5 -mx-2 px-2 py-1.5 rounded-none transition-all select-none"
          >
            <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted/60 flex items-center gap-3">
               <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <Users size={12} className="opacity-60" />
               </div>
               Execution Pulse & Workload
            </h4>
            {showWorkload ? <ChevronDown size={14} className="text-text-muted" /> : <ChevronRight size={14} className="text-text-muted" />}
          </div>

          {showWorkload && metrics.workload?.length > 0 && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {metrics.workload.map((wp, idx) => (
                  <div
                    key={idx}
                    className="bg-white/[0.03] border border-white/10 rounded-none px-4 py-3 flex items-center gap-3 hover:bg-white/[0.08] transition-all"
                  >
                    <div className="w-8 h-8 rounded-none bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20 uppercase tracking-tighter shadow-inner">
                      {wp.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white/90">
                        {wp.name}
                      </span>
                      <span className="text-[8px] font-bold text-text-muted/40 uppercase tracking-widest">
                        {wp.count} active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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

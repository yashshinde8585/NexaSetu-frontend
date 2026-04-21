import React from 'react';
import PropTypes from 'prop-types';
import { Plus, ArrowRight, Zap, Target, Activity, Layout, Search, ExternalLink } from 'lucide-react';
import { Button, Input } from '../atoms';

/**
 * Tactical Sector Inventory Module.
 * Orchestrates operational tracking of all mission-critical projects.
 * Optimized for industrial sunlight legibility and high-density performance audit.
 */
const ProjectStatusList = ({
  projects,
  selectedSprintId,
  quickTicketProject,
  setQuickTicketProject,
  quickTicketTitle,
  setQuickTicketTitle,
  createTicket,
  createTicketLoading,
  handleLinkProject,
}) => {
  return (
    <div className="bg-black border border-white/20 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-3xl space-y-8 md:space-y-12 relative overflow-hidden group">
      
      {/* Header Context */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/20 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary/15 border border-secondary/30 rounded-lg flex items-center justify-center text-secondary shadow-xl">
               <Layout size={20} />
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tighter uppercase leading-none">
              Sector <span className="text-secondary">Inventory</span>
            </h3>
          </div>
          <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.4em] ml-1">
            Operational Status of Active Deployment Nodes
          </p>
        </div>

        <div className="flex items-center gap-4">
           <span className="text-[10px] font-black text-white/60 uppercase tracking-widest bg-white/5 px-5 py-2.5 rounded-xl border border-white/20 shadow-lg">
             {projects.length} ACTIVE NODES
           </span>
        </div>
      </div>

      {/* Grid Manifest */}
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => {
          const isAssigned = selectedSprintId && (project.sprint?._id || project.sprint)?.toString() === selectedSprintId?.toString();
          const progress = project.percentage || 0;
          const status = progress > 80 ? 'healthy' : progress > 40 ? 'warning' : 'critical';

          return (
            <div
              key={project._id}
              className="bg-black border border-white/20 rounded-2xl p-6 sm:p-8 hover:border-primary/60 hover:bg-white/5 transition-all flex flex-col xl:flex-row xl:items-center gap-10 relative overflow-hidden group/item shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />

              <div className="flex items-center gap-6 min-w-0 xl:w-1/3">
                <div className="w-16 h-16 bg-white/5 border border-white/20 rounded-xl flex items-center justify-center text-xl font-black text-white/50 group-hover/item:text-primary group-hover/item:border-primary/40 transition-all shadow-inner uppercase shrink-0">
                  {project.name.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0 gap-1.5">
                  <h4 className="text-xl font-black text-white truncate tracking-tight group-hover/item:text-primary transition-colors uppercase leading-tight">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
                      NODE ID: {project._id?.slice(-8).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/20">
                      <div className={`w-1.5 h-1.5 rounded-full ${isAssigned ? 'bg-status-success animate-pulse' : 'bg-white/10'}`} />
                      <span className="text-[9px] font-black uppercase text-white/60 tracking-widest">
                        {isAssigned ? 'SYNCED' : 'DETACHED'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tactical Progress Trace */}
              <div className="flex-1 flex flex-col gap-4 relative z-10 px-2 lg:px-6 border-l border-white/5 lg:border-r">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Operational Strength</span>
                  <div className="flex items-center gap-2">
                     <span className={`text-base font-black tracking-tight ${
                        status === 'healthy' ? 'text-status-success' : 
                        status === 'warning' ? 'text-status-warning' : 
                        'text-status-error'
                     }`}>
                        {progress}%
                     </span>
                     <Activity size={14} className={status === 'healthy' ? 'text-status-success/40' : 'text-white/10'} />
                  </div>
                </div>
                <div className="w-full h-2.5 bg-black border border-white/20 rounded-full overflow-hidden shadow-inner">
                   <div 
                    className={`h-full transition-all duration-[1500ms] ease-out ${
                      status === 'healthy' ? 'bg-status-success shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 
                      status === 'warning' ? 'bg-status-warning shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 
                      'bg-status-error shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                    }`}
                    style={{ width: `${progress}%` }}
                   />
                </div>
              </div>

              {/* Command Interaction Zone */}
              <div className="flex items-center gap-6 shrink-0 relative z-10 xl:w-1/4 justify-end">
                {isAssigned ? (
                  <div className="flex items-center gap-4">
                    {quickTicketProject === project._id ? (
                        <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          createTicket(project._id, selectedSprintId);
                        }}
                        className="flex items-center gap-3 animate-[fadeIn_500ms_ease_forwards,slideInFromRight_500ms_ease_forwards]"
                      >
                        <div className="relative">
                          <input
                            placeholder="MISSION..."
                            value={quickTicketTitle}
                            onChange={(e) => setQuickTicketTitle(e.target.value)}
                            autoFocus
                            className="h-14 w-full sm:w-64 bg-black border border-primary/40 px-6 rounded-xl text-white font-black text-[11px] uppercase tracking-widest focus:outline-none focus:border-primary focus:bg-white/5 transition-all shadow-xl"
                          />
                          <div className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/20 tracking-tighter">CMD+ENT</div>
                        </div>
                        <button 
                          type="submit" 
                          disabled={createTicketLoading}
                          className="h-14 px-6 md:px-8 bg-primary text-black hover:bg-primary-dark rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all disabled:opacity-50"
                        >
                          {createTicketLoading ? '...' : 'DISPATCH'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => setQuickTicketProject(null)}
                          className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-white transition-colors shrink-0"
                        >
                          <Plus size={20} className="rotate-45" />
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setQuickTicketProject(project._id)}
                        className="flex items-center gap-4 px-10 h-14 bg-black border border-white/30 hover:border-primary/60 text-white/60 hover:text-white rounded-xl transition-all shadow-xl active:scale-95 group/btn"
                      >
                        <Plus size={18} className="text-primary group-hover/btn:rotate-90 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.25em]">QUICK MISSION</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleLinkProject(project._id, selectedSprintId)}
                    className="h-14 px-10 bg-white/5 border border-white/20 text-white/50 hover:bg-primary hover:text-black hover:border-primary rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 flex items-center gap-4"
                  >
                    <Target size={18} />
                    SYNC TO CYCLE
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State Manifest */}
      {projects.length === 0 && (
        <div className="py-32 text-center bg-white/5 border border-dashed border-white/20 rounded-3xl space-y-6">
           <Zap size={64} className="mx-auto text-white/10" />
           <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.5em]">Zero Sectors Detected in Current Roster</p>
        </div>
      )}

    </div>
  );
};

ProjectStatusList.propTypes = {
  projects: PropTypes.array.isRequired,
  selectedSprintId: PropTypes.string,
  quickTicketProject: PropTypes.string,
  setQuickTicketProject: PropTypes.func.isRequired,
  quickTicketTitle: PropTypes.string.isRequired,
  setQuickTicketTitle: PropTypes.func.isRequired,
  createTicket: PropTypes.func.isRequired,
  createTicketLoading: PropTypes.bool.isRequired,
  handleLinkProject: PropTypes.func.isRequired,
};

export default ProjectStatusList;

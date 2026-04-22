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
    <div className="bg-white/5 border border-white/20 rounded-xl p-4 sm:p-5 shadow-2xl space-y-6 relative overflow-hidden group">
      
      {/* Header Context */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-secondary/15 border border-secondary/30 rounded flex items-center justify-center text-secondary shadow-xl">
               <Layout size={18} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
              SECTOR <span className="text-secondary">INVENTORY</span>
            </h3>
          </div>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
            OPERATIONAL STATUS OF ACTIVE DEPLOYMENT NODES
          </p>
        </div>

        <div className="flex items-center gap-4">
           <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded border border-white/10 shadow-lg">
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
              className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 hover:border-primary/50 transition-all flex flex-col xl:flex-row xl:items-center gap-6 relative overflow-hidden group/item"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />

              <div className="flex items-center gap-4 min-w-0 xl:w-1/3">
                <div className="w-12 h-12 bg-black border border-white/10 rounded flex items-center justify-center text-lg font-black text-white/30 group-hover/item:text-primary transition-all uppercase shrink-0">
                  {project.name.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0 gap-1">
                  <h4 className="text-lg font-black text-white truncate tracking-tight group-hover/item:text-primary transition-colors uppercase leading-tight">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.1em]">
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
              <div className="flex-1 flex flex-col gap-2.5 relative z-10 px-2 lg:px-6 border-l border-white/5 lg:border-r">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">OPERATIONAL STRENGTH</span>
                  <div className="flex items-center gap-2">
                     <span className={`text-sm font-black tracking-tight ${
                        status === 'healthy' ? 'text-status-success' : 
                        status === 'warning' ? 'text-status-warning' : 
                        'text-status-error'
                     }`}>
                        {progress}%
                     </span>
                     <Activity size={12} className={status === 'healthy' ? 'text-status-success/40' : 'text-white/10'} />
                  </div>
                </div>
                <div className="w-full h-1.5 bg-black border border-white/10 rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-[1500ms] ease-out ${
                      status === 'healthy' ? 'bg-status-success' : 
                      status === 'warning' ? 'bg-status-warning' : 
                      'bg-status-error'
                    }`}
                    style={{ width: `${progress}%` }}
                   />
                </div>
              </div>

              {/* Command Interaction Zone */}
              <div className="flex items-center gap-4 shrink-0 relative z-10 xl:w-1/4 justify-end">
                {isAssigned ? (
                  <div className="flex items-center gap-2">
                    {quickTicketProject === project._id ? (
                        <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          createTicket(project._id, selectedSprintId);
                        }}
                        className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300"
                      >
                        <input
                          placeholder="MISSION..."
                          value={quickTicketTitle}
                          onChange={(e) => setQuickTicketTitle(e.target.value)}
                          autoFocus
                          className="h-9 w-full sm:w-48 bg-black border border-primary/40 px-4 rounded text-white font-black text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary transition-all"
                        />
                        <button 
                          type="submit" 
                          disabled={createTicketLoading}
                          className="h-9 px-4 bg-primary text-black hover:bg-primary-dark rounded text-[9px] font-black uppercase tracking-[0.1em] transition-all disabled:opacity-50"
                        >
                          {createTicketLoading ? '...' : 'DISPATCH'}
                        </button>
                        <button 
                          type="button"
                          onClick={() => setQuickTicketProject(null)}
                          className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-white transition-colors shrink-0"
                        >
                          <Plus size={16} className="rotate-45" />
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setQuickTicketProject(project._id)}
                        className="flex items-center gap-3 px-6 h-9 bg-white/5 border border-white/10 hover:border-primary/50 text-white/40 hover:text-white rounded transition-all active:scale-95 group/btn"
                      >
                        <Plus size={14} className="text-primary group-hover/btn:rotate-90 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">QUICK MISSION</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleLinkProject(project._id, selectedSprintId)}
                    className="h-9 px-6 bg-white/5 border border-white/10 text-white/40 hover:bg-primary hover:text-black hover:border-primary rounded text-[9px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center gap-3"
                  >
                    <Target size={14} />
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
        <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-xl space-y-4">
           <Zap size={40} className="mx-auto text-white/10" />
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Zero Sectors Detected in Current Roster</p>
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

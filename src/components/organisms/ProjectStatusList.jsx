import React from 'react';
import PropTypes from 'prop-types';
import { Plus, ArrowRight, Zap, Target } from 'lucide-react';
import { Button, Input } from '../atoms';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
          <Zap size={14} className="text-secondary" />
          Operation Registry
        </h3>
        <span className="text-[9px] font-bold text-text-muted/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
          {projects.length} Active Deployments
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => {
          const isAssigned = selectedSprintId && (project.sprint?._id || project.sprint)?.toString() === selectedSprintId?.toString();
          const progress = project.percentage || 0;
          const status = progress > 80 ? 'healthy' : progress > 40 ? 'warning' : 'critical';

          return (
            <div
              key={project._id}
              className="group bg-white/[0.015] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden"
            >
              <div className="flex items-center gap-5 min-w-[280px]">
                <div className="flex flex-col min-w-0">
                  <h4 className="text-lg font-black text-white truncate group-hover:text-primary transition-colors tracking-tight">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[9px] font-black text-text-muted/30 uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                      {project.key || 'NODE'}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                      <div className={`w-1.5 h-1.5 rounded-full ${isAssigned ? 'bg-status-success animate-pulse' : 'bg-text-muted/20'}`} />
                      <span className="text-[8px] font-bold uppercase text-text-muted/40 tracking-widest leading-none">
                        {isAssigned ? 'SYNCED' : 'DETACHED'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3 relative z-10">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[9px] font-black text-text-muted/40 uppercase tracking-[0.3em]">Operational Track</span>
                  <span className={`text-[10px] font-black tracking-widest ${
                    status === 'healthy' ? 'text-status-success' : 
                    status === 'warning' ? 'text-status-warning' : 
                    'text-status-error'
                  }`}>
                    {progress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 shadow-inner">
                   <div 
                    className={`h-full transition-all duration-[1500ms] ease-out ${
                      status === 'healthy' ? 'bg-status-success shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 
                      status === 'warning' ? 'bg-status-warning shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 
                      'bg-status-error shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                    }`}
                    style={{ width: `${progress}%` }}
                   />
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 relative z-10">
                {isAssigned ? (
                  <div className="flex items-center gap-2">
                    {quickTicketProject === project._id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          createTicket(project._id, selectedSprintId);
                        }}
                        className="flex items-center gap-2 animate-in fade-in slide-in-from-right-8 duration-300"
                      >
                        <div className="relative">
                          <Input
                            placeholder="SET MISSION..."
                            size="sm"
                            value={quickTicketTitle}
                            onChange={(e) => setQuickTicketTitle(e.target.value)}
                            autoFocus
                            className="h-10 w-56 text-[10px] font-bold bg-white/5 rounded-xl border-white/5 focus:border-primary/40 focus:bg-white/[0.08] transition-all tracking-widest uppercase"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-text-muted/20 tracking-tighter">CMD+ENT</div>
                        </div>
                        <Button 
                          type="submit" 
                          size="sm" 
                          isLoading={createTicketLoading}
                          className="h-10 px-6 rounded-xl text-[10px] uppercase font-black tracking-widest shadow-lg shadow-primary/10"
                        >
                          DISPATCH
                        </Button>
                        <button 
                          type="button"
                          onClick={() => setQuickTicketProject(null)}
                          className="px-4 py-2 text-[10px] font-black text-text-muted/40 hover:text-white transition-colors"
                        >
                          CANCEL
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setQuickTicketProject(project._id)}
                        className="flex items-center gap-3 px-8 py-2.5 bg-white/[0.03] hover:bg-primary/10 hover:border-primary/20 text-text-muted hover:text-white rounded-xl border border-white/5 transition-all shadow-sm"
                      >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">+ QUICK TASK</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => handleLinkProject(project._id, selectedSprintId)}
                    variant="secondary"
                    size="sm"
                    className="h-11 rounded-xl px-8 text-[10px] font-black uppercase tracking-[0.3em] hover:translate-x-1 shadow-2xl active:scale-95 transition-all bg-white/[0.05] border-white/10 hover:bg-primary hover:border-primary"
                  >
                    SYNC TO CYCLE
                  </Button>
                )}
              </div>
              
              {/* Background Decorator */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          );
        })}
      </div>
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

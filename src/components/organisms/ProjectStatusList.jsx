import React from 'react';
import PropTypes from 'prop-types';

// A list component that provides a real-time status overview of all projects in the workspace.
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
    <div className="grid grid-cols-1 gap-8">
      <div className="space-y-6">
        <div className="bg-[#1E1E2E]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-black text-white px-1">
                Project Status Overview
              </h3>
              <p className="text-xs text-text-muted mt-1 px-1">
                {selectedSprintId
                  ? 'Status for projects in active sprint'
                  : 'Real-time status of all workspace projects'}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] px-2 py-1 bg-status-success/10 text-status-success border border-status-success/20 rounded font-black">
                STABLE
              </span>
              <span className="text-[10px] px-2 py-1 bg-status-warning/10 text-status-warning border border-status-warning/20 rounded font-black">
                AT RISK
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {(projects || []).map((project) => (
              <div
                key={project._id}
                className={`group p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all ${
                  selectedSprintId &&
                  (project.sprint === selectedSprintId ||
                    project.sprint?._id === selectedSprintId)
                    ? 'ring-1 ring-primary/30 border-primary/20 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                    : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        project.percentage >= 80
                          ? 'bg-status-success shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                          : project.percentage >= 40
                            ? 'bg-status-warning'
                            : 'bg-status-error animate-pulse'
                      }`}
                    />
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">
                        {project.name}
                      </h4>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-0.5">
                        {project.status || 'Active'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3">
                      {selectedSprintId &&
                        (project.sprint === selectedSprintId ||
                          project.sprint?._id === selectedSprintId) && (
                          <button
                            onClick={() => {
                              setQuickTicketProject(
                                quickTicketProject === project._id
                                  ? null
                                  : project._id
                              );
                              setQuickTicketTitle('');
                            }}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all border ${
                              quickTicketProject === project._id
                                ? 'bg-status-success text-white border-status-success shadow-lg shadow-status-success/20'
                                : 'bg-white/5 text-text-muted border-white/5 hover:border-primary/40 hover:text-primary'
                            }`}
                            title="Quick Directive"
                          >
                            <span className="text-lg font-light">
                              {quickTicketProject === project._id ? '×' : '+'}
                            </span>
                          </button>
                        )}
                      {selectedSprintId &&
                        (project.sprint?._id || project.sprint)?.toString() !==
                          selectedSprintId.toString() && (
                          <button
                            onClick={() => handleLinkProject(project._id)}
                            className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20 hover:bg-primary/20 transition-all"
                          >
                            Add to Sprint
                          </button>
                        )}
                      <div className="text-right">
                        <div className="text-lg font-black text-white">
                          {project.percentage}%
                        </div>
                        <div className="text-[9px] text-text-muted font-bold capitalize">
                          {project.completedTasks || 0} /{' '}
                          {project.totalTasks || 0} Tickets
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      project.percentage >= 80
                        ? 'bg-status-success'
                        : project.percentage >= 40
                          ? 'bg-primary'
                          : 'bg-status-error'
                    }`}
                    style={{ width: `${project.percentage}%` }}
                  />
                </div>

                {quickTicketProject === project._id && (
                  <div className="mt-4 pt-4 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                    <form
                      className="flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!quickTicketTitle.trim()) return;
                        createTicket(
                          {
                            title: quickTicketTitle.trim(),
                            project: project._id,
                            sprint: selectedSprintId,
                          },
                          {
                            onSuccess: () => {
                              setQuickTicketTitle('');
                              setQuickTicketProject(null);
                            },
                          }
                        );
                      }}
                    >
                      <input
                        type="text"
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-medium text-white focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:opacity-30"
                        placeholder="Task Title..."
                        value={quickTicketTitle}
                        onChange={(e) => setQuickTicketTitle(e.target.value)}
                        autoFocus
                        required
                      />
                      <button
                        type="submit"
                        disabled={createTicketLoading}
                        className="bg-primary/20 hover:bg-primary/30 text-primary text-[10px] font-black uppercase tracking-widest px-4 rounded-xl border border-primary/20 transition-all disabled:opacity-50"
                      >
                        {createTicketLoading ? '...' : 'Create'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
            {(projects || []).length === 0 && (
              <div className="p-8 text-center text-text-muted italic opacity-40 text-xs font-bold uppercase tracking-widest bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                No projects available in workspace
              </div>
            )}
          </div>
        </div>
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
  createTicketLoading: PropTypes.bool,
  handleLinkProject: PropTypes.func.isRequired,
};

export default ProjectStatusList;

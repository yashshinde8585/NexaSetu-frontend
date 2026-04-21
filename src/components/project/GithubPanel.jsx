import React from 'react';
import { GitBranch, RefreshCw, Link, ExternalLink, Activity, Check, X as CloseIcon, Cpu } from 'lucide-react';
import Button from '../atoms/Button';

/**
 * Tactical GitHub Orchestration Panel.
 * Manages repository synchronization and intelligent task extraction from Git history.
 * Optimized for high-contrast sunlight legibility.
 */
const GithubPanel = ({
  project,
  githubConnected,
  githubToken,
  setGithubToken,
  handleConnectGithub,
  repos,
  loadingRepos,
  handleLinkRepo,
  fetchRepos,
  githubSuggestions,
  fetchGithubActivity,
  isFetchingGithub,
  handleApproveGithubTask,
  handleApproveAllGithubTasks,
  setProject,
  setGithubSuggestions,
}) => {
  return (
    <div className="bg-white/5 border border-white/20 p-8 rounded-2xl mb-10 shadow-3xl animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-black border border-white/25 rounded-xl flex items-center justify-center text-primary-light shadow-xl">
              <GitBranch size={28} />
           </div>
           <div className="space-y-1">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Source Integration</h3>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none">
                 Synchronizing project tasks with distributed version control
              </p>
           </div>
        </div>
        
        {githubConnected && project?.githubRepo && (
          <Button
            onClick={fetchGithubActivity}
            disabled={isFetchingGithub}
            variant="primary"
            className="h-12 px-8 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/40 bg-primary text-black"
          >
            {isFetchingGithub ? (
              <RefreshCw size={14} className="animate-spin mr-2" />
            ) : (
              <RefreshCw size={14} className="mr-2" />
            )}
            {isFetchingGithub ? 'SYNCING...' : 'SYNC REPO ACTIVITY'}
          </Button>
        )}
      </div>

      {!githubConnected ? (
        <div className="space-y-6">
          <div className="p-5 bg-primary/10 border border-primary/40 rounded-xl flex items-center gap-4 text-primary">
             <Activity size={18} className="shrink-0" />
             <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                INTEGRATION REQUIRED: PROVIDE A GITHUB PERSONAL ACCESS TOKEN (PAT) TO ENABLE TASK DETECTION.
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-white border-b border-white hover:text-primary transition-colors font-black"
                >
                  TOKEN GENERATOR
                </a>
             </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="password"
              placeholder="PASTE GITHUB PAT..."
              className="flex-1 h-12 bg-black border border-white/25 text-white rounded-xl px-6 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary focus:bg-white/5 transition-all placeholder:text-white/40"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
            />
            <Button
              onClick={handleConnectGithub}
              className="h-12 px-10 text-[10px] font-black tracking-widest bg-primary text-black hover:bg-primary-dark"
            >
              LINK ACCOUNT
            </Button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          {!project?.githubRepo ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/15 pb-4">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/80">Repository Inventory</h4>
                <button
                  onClick={fetchRepos}
                  className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors border border-primary/40 px-3 py-1.5 rounded-lg"
                >
                  RE-SCAN REPOS
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                {loadingRepos ? (
                  <div className="col-span-full py-16 flex flex-col items-center gap-4 opacity-60">
                    <RefreshCw size={32} className="animate-spin text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest">FETCHING DATA...</span>
                  </div>
                ) : (
                  repos.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleLinkRepo(r)}
                      className="p-5 text-left bg-black border border-white/15 rounded-xl hover:border-primary hover:bg-white/10 transition-all group relative overflow-hidden"
                    >
                      <h5 className="text-[11px] font-black uppercase tracking-widest text-white mb-2 group-hover:text-primary">
                        {r.fullName}
                      </h5>
                      {r.description && (
                         <p className="text-[9px] font-black text-white/60 uppercase tracking-widest line-clamp-2">
                            {r.description}
                         </p>
                      )}
                      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Link size={14} className="text-primary" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-black border border-white/20 rounded-2xl shadow-xl transition-all hover:bg-white/5">
                <div className="flex items-center gap-5 w-full">
                  <div className="w-14 h-14 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center text-primary">
                    <ExternalLink size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black uppercase tracking-tighter text-white">
                      {project.githubRepo.fullName}
                    </h4>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-status-success flex items-center gap-2">
                       <span className="w-2 h-2 bg-status-success rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" /> TARGET REPOSITORY LINKED
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setProject({ ...project, githubRepo: null })}
                  className="mt-6 sm:mt-0 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-status-error border border-status-error/40 hover:bg-status-error hover:text-black rounded-lg transition-all"
                >
                  DE-LINK REPOSITORY
                </button>
              </div>

              {githubSuggestions.length > 0 && (
                <section className="space-y-6 animate-in slide-in-from-bottom-6 duration-700">
                  <div className="flex justify-between items-end border-b border-primary/40 pb-4">
                    <div className="space-y-1">
                       <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                          <Cpu size={18} /> Extraction Engine
                       </h4>
                       <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                          Found {githubSuggestions.length} potential task updates from Git telemetry
                       </p>
                    </div>
                    <button
                      onClick={handleApproveAllGithubTasks}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-primary transition-colors border-b-2 border-primary px-1"
                    >
                      COMMIT ALL SUGGESTIONS
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                    {githubSuggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-black p-6 rounded-2xl border border-white/20 hover:border-primary transition-all group relative"
                      >
                        <div className="absolute top-4 right-4 text-[9px] font-black px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white/80 uppercase tracking-[0.2em]">
                           {s.type} EVENT
                        </div>
                        
                        <div className="flex flex-col h-full">
                           <h5 className="text-[12px] font-black uppercase tracking-widest text-white mb-3 leading-tight group-hover:text-primary transition-colors">
                              {s.title}
                           </h5>
                           <div className="p-3 bg-white/5 border border-white/15 rounded-xl mb-6">
                              <p className="text-[10px] font-black text-white/70 uppercase tracking-widest italic line-clamp-3">
                                 &ldquo;{s.originalMessage}&rdquo;
                              </p>
                           </div>
                           
                           <div className="mt-auto flex items-center gap-3">
                             <button
                               onClick={() => handleApproveGithubTask(s)}
                               className="flex-1 bg-primary text-black text-[10px] font-black uppercase tracking-[0.1em] py-3 rounded-xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
                             >
                               <Check size={14} strokeWidth={3} /> APPROVE
                             </button>
                             <button
                               onClick={() => setGithubSuggestions((prev) => prev.filter((t) => t.githubId !== s.githubId))}
                               className="flex-1 bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.1em] py-3 rounded-xl hover:bg-white/20 hover:text-white transition-all flex items-center justify-center gap-2 border border-white/20"
                             >
                               <CloseIcon size={14} strokeWidth={3} /> IGNORE
                             </button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GithubPanel;

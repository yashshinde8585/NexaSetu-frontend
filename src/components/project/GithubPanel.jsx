import React, { useState } from 'react';

// A component that handles GitHub integration, repository linking, and automated task extraction from Git activity.
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
    <div className="bg-background-dark/40 backdrop-blur-md p-6 rounded-xl mb-8 border border-white/10 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐙</span>
          <div>
            <h3 className="text-xl font-bold">GitHub Integration</h3>
            <p className="text-sm text-text-muted">
              Automate task detection from commits and PRs
            </p>
          </div>
        </div>
        {githubConnected && project?.githubRepo && (
          <button
            onClick={fetchGithubActivity}
            disabled={isFetchingGithub}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-primary/20"
          >
            {isFetchingGithub ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>{' '}
                Fetching...
              </>
            ) : (
              '🔄 Sync Latest Activity'
            )}
          </button>
        )}
      </div>

      {!githubConnected ? (
        <div className="space-y-4">
          <div className="p-4 bg-status-info/10 border border-status-info/20 rounded-lg text-sm text-status-info">
            Connect your GitHub account using a Personal Access Token to get
            started.
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              Generate one here
            </a>
            .
          </div>
          <div className="flex gap-4">
            <input
              type="password"
              placeholder="Paste your GitHub Token"
              className="flex-1 bg-background-light border border-white/5 text-text px-4 py-2 rounded-lg"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
            />
            <button
              onClick={handleConnectGithub}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-8 rounded-lg transition-all"
            >
              Connect Account
            </button>
          </div>
        </div>
      ) : (
        <div>
          {!project?.githubRepo ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-primary">
                  Select a repository
                </h4>
                <button
                  onClick={fetchRepos}
                  className="text-sm text-text-muted hover:text-primary"
                >
                  Refresh
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {loadingRepos ? (
                  <div className="col-span-full py-10 flex flex-col items-center gap-3">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  repos.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleLinkRepo(r)}
                      className="text-left bg-background-light hover:bg-background-dark p-3 rounded-lg border border-white/5 flex flex-col gap-1 group"
                    >
                      <span className="font-medium text-sm group-hover:text-primary transition-colors">
                        {r.fullName}
                      </span>
                      {r.description && (
                        <span className="text-xs text-text-muted line-clamp-1">
                          {r.description}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between p-4 bg-background-dark rounded-xl border border-white/5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-2xl">
                    📁
                  </div>
                  <div>
                    <div className="font-bold text-lg">
                      {project.githubRepo.fullName}
                    </div>
                    <div className="text-xs text-text-muted">
                      Linked Repository
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setProject({ ...project, githubRepo: null })}
                  className="text-xs text-status-error/60 hover:text-status-error px-3 py-1 bg-status-error/5 hover:bg-status-error/10 rounded border border-status-error/10"
                >
                  Change Repo
                </button>
              </div>
              {githubSuggestions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="font-bold text-secondary-light">
                      Suggested Tasks ({githubSuggestions.length})
                    </h4>
                    <button
                      onClick={handleApproveAllGithubTasks}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Approve All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                    {githubSuggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-background-light/80 p-5 rounded-xl border border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 ${s.type === 'commit' ? 'text-status-info' : 'text-status-warning'}`}
                          >
                            {s.type}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <h5 className="font-bold mb-1">{s.title}</h5>
                            <p className="text-sm text-text-muted mb-3 line-clamp-2 italic">
                              “{s.originalMessage}”
                            </p>
                          </div>
                          <div className="flex flex-row md:flex-col gap-2 justify-end min-w-[120px]">
                            <button
                              onClick={() => handleApproveGithubTask(s)}
                              className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2 px-4 rounded-lg"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                setGithubSuggestions((prev) =>
                                  prev.filter((t) => t.githubId !== s.githubId)
                                )
                              }
                              className="flex-1 bg-white/5 hover:bg-white/10 text-text-muted text-xs font-bold py-2 px-4 rounded-lg"
                            >
                              Ignore
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GithubPanel;

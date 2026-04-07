import React from 'react';

// A specialized panel that leverages AI to generate and refine task details from natural language input.
const AIExtractionPanel = ({
  aiInput,
  setAiInput,
  handleAiExtract,
  isAiProcessing,
  aiSuggestion,
  setAiSuggestion,
  handleCreateTask,
  project,
  sprints,
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-[#1A1A2E]/50 p-6 rounded-2xl mb-8 shadow-2xl border border-white/5 backdrop-blur-xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-primary">
          AI Task Generation
        </h3>
        <div className="space-y-4">
          <textarea
            className="w-full bg-[#0F0F13] border border-white/5 text-sm text-white px-5 py-4 rounded-xl focus:ring-primary/30 focus:ring-1 focus:outline-none placeholder:text-text-muted/30 transition-all font-medium"
            placeholder="e.g., 'Refactor the authentication middleware to use JWT standard and update the API documentation.'"
            rows="3"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
          <button
            onClick={handleAiExtract}
            disabled={isAiProcessing || !aiInput.trim()}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-white/5 disabled:text-text-muted/30 text-white font-black py-4 px-6 rounded-xl transition duration-500 flex justify-center items-center gap-3 text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            {isAiProcessing ? (
              <>
                <div className="animate-spin h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full"></div>{' '}
                Processing...
              </>
            ) : (
              <>
                <span className="text-base text-white/50">✨</span> Generate
                Task
              </>
            )}
          </button>
        </div>
      </div>

      {aiSuggestion && (
        <div className="bg-[#1A1A2E]/80 backdrop-blur-2xl p-8 rounded-[2rem] mb-8 border border-primary/30 shadow-[0_30px_60px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
            <h3 className="text-sm font-black flex items-center gap-3 uppercase tracking-[0.2em] text-white">
              <span className="p-2 bg-primary/10 rounded-lg text-primary">
                🤖
              </span>{' '}
              AI Recommendation
            </h3>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
              Review Details
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">
                  Task Title
                </label>
                <input
                  type="text"
                  className="w-full bg-[#0F0F13] border border-white/5 text-sm font-bold text-white px-5 py-3 rounded-xl focus:ring-primary/20 focus:ring-1 focus:outline-none focus:border-primary/30 transition-all"
                  value={aiSuggestion.title}
                  onChange={(e) =>
                    setAiSuggestion({ ...aiSuggestion, title: e.target.value })
                  }
                />
              </div>
              <div className="group">
                <label className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">
                  Assignee
                </label>
                <select
                  className="w-full bg-[#0F0F13] border border-white/5 text-xs font-bold text-white px-5 py-3 rounded-xl focus:ring-primary/20 focus:ring-1 focus:outline-none focus:border-primary/30 appearance-none cursor-pointer"
                  value={aiSuggestion.assignedUser || ''}
                  onChange={(e) =>
                    setAiSuggestion({
                      ...aiSuggestion,
                      assignedUser: e.target.value,
                    })
                  }
                >
                  <option value="">Unassigned</option>
                  {project?.members
                    ?.filter((member) => member.role !== 'WORKSPACE_ADMIN')
                    .map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">
                  Sprint
                </label>
                <select
                  className="w-full bg-[#0F0F13] border border-white/5 text-xs font-bold text-white px-5 py-3 rounded-xl focus:ring-primary/20 focus:ring-1 focus:outline-none focus:border-primary/30 appearance-none cursor-pointer"
                  value={aiSuggestion.sprint || ''}
                  onChange={(e) =>
                    setAiSuggestion({ ...aiSuggestion, sprint: e.target.value })
                  }
                >
                  <option value="">No Active Sprint</option>
                  {(sprints || []).map((sprint) => (
                    <option key={sprint._id} value={sprint._id}>
                      {sprint.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">
                  Priority
                </label>
                <select
                  className="w-full bg-[#0F0F13] border border-white/5 text-xs font-bold text-white px-5 py-3 rounded-xl focus:ring-primary/20 focus:ring-1 focus:outline-none focus:border-primary/30 appearance-none cursor-pointer"
                  value={aiSuggestion.priority || 'medium'}
                  onChange={(e) =>
                    setAiSuggestion({
                      ...aiSuggestion,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Priority</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">
                  Estimated Time
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    className="w-full bg-[#0F0F13] border border-white/5 text-sm font-bold text-white px-5 py-3 rounded-xl focus:ring-primary/20 focus:ring-1 focus:outline-none focus:border-primary/30 transition-all"
                    placeholder="30"
                    value={aiSuggestion.estimatedDuration || 30}
                    onChange={(e) =>
                      setAiSuggestion({
                        ...aiSuggestion,
                        estimatedDuration: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <select
                    className="w-full bg-[#0F0F13] border border-white/5 text-[10px] font-bold text-white px-4 py-3 rounded-xl focus:ring-primary/20 focus:ring-1 focus:outline-none focus:border-primary/30 appearance-none cursor-pointer uppercase tracking-widest"
                    value={aiSuggestion.durationUnit || 'min'}
                    onChange={(e) =>
                      setAiSuggestion({
                        ...aiSuggestion,
                        durationUnit: e.target.value,
                      })
                    }
                  >
                    <option value="min">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 ml-1 group-focus-within:text-primary transition-colors">
                  Task Description
                </label>
                <textarea
                  className="w-full bg-[#0F0F13] border border-white/5 text-sm font-medium text-white/80 px-5 py-3 rounded-xl focus:ring-primary/20 focus:ring-1 focus:outline-none focus:border-primary/30 transition-all h-[200px] resize-none overflow-y-auto"
                  value={aiSuggestion.description || ''}
                  onChange={(e) =>
                    setAiSuggestion({
                      ...aiSuggestion,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => handleCreateTask(aiSuggestion)}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-black py-4 px-6 rounded-xl transition-all shadow-lg active:scale-95 text-[10px] uppercase tracking-widest shadow-primary/20"
            >
              ✓ Create Task
            </button>
            <button
              onClick={() => setAiSuggestion(null)}
              className="bg-status-error/10 text-status-error hover:bg-status-error/20 font-black py-4 px-10 rounded-xl transition-all text-[10px] uppercase tracking-widest border border-status-error/20"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIExtractionPanel;

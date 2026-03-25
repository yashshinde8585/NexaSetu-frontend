import React from 'react';

const AIExtractionPanel = ({ 
  aiInput, 
  setAiInput, 
  handleAiExtract, 
  isAiProcessing, 
  aiSuggestion, 
  setAiSuggestion, 
  handleCreateTask 
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-background-light p-6 rounded-lg mb-8 shadow-md border border-secondary/30">
        <h3 className="text-lg font-semibold mb-3 text-secondary-light">Extract Task with AI</h3>
        <div className="space-y-4">
          <textarea className="w-full bg-background-dark border border-secondary/20 text-text px-4 py-3 rounded focus:ring-secondary focus:ring-1 focus:outline-none" placeholder="e.g., 'I finished fixing the login bug and updated the dashboard API. It's done now.'" rows="3" value={aiInput} onChange={(e) => setAiInput(e.target.value)} />
          <button onClick={handleAiExtract} disabled={isAiProcessing || !aiInput.trim()} className="w-full bg-secondary hover:bg-secondary-light disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded transition duration-200 flex justify-center items-center gap-2">
            {isAiProcessing ? <><div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div> Processing...</> : 'Generate Smart Task'}
          </button>
        </div>
      </div>

      {aiSuggestion && (
        <div className="bg-background-dark/80 backdrop-blur-sm p-6 rounded-xl mb-8 border-2 border-primary animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex items-center gap-2">🤖 AI Suggestion</h3><span className="text-xs font-bold uppercase tracking-widest bg-primary/20 text-primary-light px-2 py-1 rounded">Review Needed</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div><label className="block text-xs font-bold text-text-muted uppercase mb-1">Title</label>
                <input type="text" className="w-full bg-background-light border border-primary/20 text-text px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none" value={aiSuggestion.title} onChange={(e) => setAiSuggestion({...aiSuggestion, title: e.target.value})} />
              </div>
              <div><label className="block text-xs font-bold text-text-muted uppercase mb-1">Status</label>
                <select className="w-full bg-background-light border border-primary/20 text-text px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none" value={aiSuggestion.status} onChange={(e) => setAiSuggestion({...aiSuggestion, status: e.target.value})}>
                  <option value="todo">To-do</option><option value="in_progress">In Progress</option><option value="in_review">In Review</option><option value="done">Done</option>
                </select>
              </div>
            </div>
            <div><label className="block text-xs font-bold text-text-muted uppercase mb-1">Description</label>
              <textarea className="w-full bg-background-light border border-primary/20 text-text px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none h-[116px]" value={aiSuggestion.description} onChange={(e) => setAiSuggestion({...aiSuggestion, description: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={() => handleCreateTask(aiSuggestion)} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all active:scale-95">✓ Confirm & Save</button>
            <button onClick={() => setAiSuggestion(null)} className="bg-status-error/10 text-status-error hover:bg-status-error/20 font-bold py-3 px-8 rounded-lg transition-all">Discard</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIExtractionPanel;

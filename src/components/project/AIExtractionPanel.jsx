import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Cpu, Check, X as DiscardIcon, Sparkles, RefreshCw, UserPlus, Layers, Zap, Clock, Type, Activity, Calendar, Minus, Plus } from 'lucide-react';
import Button from '../atoms/Button';

/**
 * Tactical AI Extraction Engine.
 * Converts natural language directives into structured task objects with high-precision metadata.
 * Optimized for industrial sunlight legibility.
 */
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
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* AI Intelligence Core */}
      <div className="bg-white/5 p-8 rounded-2xl shadow-3xl border border-white/20 transition-all hover:bg-white/[0.07]">
        <div className="flex items-center gap-4 mb-6">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">
             DESCRIBE YOUR TASK TO AUTO-GENERATE DETAILS
           </h3>
        </div>
        
        <div className="space-y-6">
          <textarea
            className="w-full bg-black border border-white/25 text-[13px] font-black text-white px-6 py-5 rounded-xl focus:border-primary focus:bg-white/5 focus:outline-none placeholder:text-white/40 transition-all leading-relaxed min-h-[140px] tracking-widest shadow-inner"
            placeholder="e.g., 'OPTIMIZE AUTHENTICATION MIDDLEWARE FOR JWT STANDARDS AND UPDATE API DOCUMENTATION...'"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
          <Button
            onClick={handleAiExtract}
            disabled={isAiProcessing || !aiInput.trim()}
            variant="primary"
            className="w-full h-14 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/40 bg-primary text-black"
          >
            {isAiProcessing ? (
              <RefreshCw size={18} className="animate-spin mr-3" />
            ) : (
              <Sparkles size={18} className="mr-3 text-black/40" />
            )}
            {isAiProcessing ? 'EXTRACTING PARAMETERS...' : 'INITIATE EXTRACTION'}
          </Button>
        </div>
      </div>

      {/* Suggested Object Manifest */}
      {aiSuggestion && (
        <div className="bg-black p-6 sm:p-8 rounded-3xl border border-white/10 shadow-3xl animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">VERIFIED AI TASK RECOMMENDATION</h3>
                </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Primary Command Row: Title & Priority */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-white/70 uppercase tracking-[0.3em] ml-1">
                  <Type size={12} className="text-primary" /> TITLE
                </label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/25 text-sm font-black text-white px-6 py-4 rounded-xl focus:border-primary focus:outline-none transition-all tracking-tighter"
                  value={aiSuggestion.title}
                  onChange={(e) => setAiSuggestion({ ...aiSuggestion, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-white/70 uppercase tracking-[0.3em] ml-1">
                  <Activity size={12} className="text-primary" /> PRIORITY
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-white/5 border border-white/25 text-[11px] font-black text-white px-6 py-4 rounded-xl focus:border-primary transition-all appearance-none cursor-pointer tracking-widest"
                    value={aiSuggestion.priority || 'medium'}
                    onChange={(e) => setAiSuggestion({ ...aiSuggestion, priority: e.target.value })}
                  >
                    <option value="low" className="bg-[#121212]">P-4 LOW</option>
                    <option value="medium" className="bg-[#121212]">P-3 STANDARD</option>
                    <option value="high" className="bg-[#121212]">P-2 HIGH</option>
                    <option value="urgent" className="bg-[#121212]">P-1 URGENT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Expansive Mission Objective workspace */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-white/70 uppercase tracking-[0.3em] ml-1">
                <Activity size={12} className="text-primary" /> DESCRIPTION
              </div>
                <textarea
                className="w-full bg-white/5 border border-white/10 text-[11px] font-black text-white px-8 py-6 rounded-2xl focus:border-primary transition-all h-[120px] resize-none tracking-widest leading-relaxed shadow-inner"
                placeholder="DETAILED OPERATIONAL SPECIFICATIONS..."
                value={aiSuggestion.description}
                onChange={(e) => setAiSuggestion({ ...aiSuggestion, description: e.target.value })}
              />
            </div>

            {/* Secondary Fieldset Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 pt-6 border-t border-white/5">
              <div className="space-y-6">
                {/* Compact Operator Alignment */}
                <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5">
                  <div className="flex items-center gap-3 shrink-0">
                    <UserPlus size={12} className="text-white/20" />
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">ASSIGN TO</label>
                  </div>
                  <select
                    className="bg-white/5 border border-white/10 text-[10px] font-black text-white px-4 py-1.5 rounded-lg focus:border-primary transition-all cursor-pointer tracking-widest outline-none min-w-[160px]"
                    value={aiSuggestion.assignedUser || ''}
                    onChange={(e) => setAiSuggestion({ ...aiSuggestion, assignedUser: e.target.value })}
                  >
                    <option value="" className="bg-[#121212]">UNASSIGNED</option>
                    {project?.members?.filter(m => m.role !== 'WORKSPACE_ADMIN').map(m => (
                      <option key={m._id} value={m._id} className="bg-[#121212]">{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-white/70 uppercase tracking-[0.3em] ml-1">
                    <Layers size={12} className="text-primary" /> SPRINT PHASE
                  </label>
                    <select
                    className="w-full bg-white/5 border border-white/25 text-[11px] font-black text-white px-6 py-4 rounded-xl focus:border-primary transition-all cursor-pointer tracking-widest"
                    value={aiSuggestion.sprint || ''}
                    onChange={(e) => setAiSuggestion({ ...aiSuggestion, sprint: e.target.value })}
                  >
                    <option value="" className="bg-[#121212]">NO ACTIVE SPRINT</option>
                    {(sprints || []).map(s => (
                      <option key={s._id} value={s._id} className="bg-[#121212]">{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time & Constraints Parameters */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-8 py-1 border-b border-white/5">
                  <div className="flex items-center gap-3 shrink-0">
                    <Clock size={12} className="text-white/20" />
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">DURATION</label>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 justify-start">
                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10 shrink-0 h-9 overflow-hidden">
                      <button type="button" onClick={() => setAiSuggestion({ ...aiSuggestion, estimatedDuration: Math.max(0, (aiSuggestion.estimatedDuration || 0) - 5) })} className="w-9 h-full flex items-center justify-center text-white/30 hover:text-white transition-all border-r border-white/5"><Minus size={14}/></button>
                      <input type="number" className="bg-transparent text-xs font-black text-white text-center w-10 focus:outline-none" value={aiSuggestion.estimatedDuration || 30} onChange={(e) => setAiSuggestion({ ...aiSuggestion, estimatedDuration: parseInt(e.target.value) || 0 })} />
                      <button type="button" onClick={() => setAiSuggestion({ ...aiSuggestion, estimatedDuration: (aiSuggestion.estimatedDuration || 0) + 5 })} className="w-9 h-full flex items-center justify-center text-white/30 hover:text-white transition-all border-l border-white/5"><Plus size={14}/></button>
                    </div>
                    <button type="button" onClick={() => {const u=['min','hours','days']; setAiSuggestion({...aiSuggestion, durationUnit:u[(u.indexOf(aiSuggestion.durationUnit||'min')+1)%3]});}} className="px-4 h-9 bg-primary/10 border border-primary/20 rounded-lg text-[9px] font-black text-primary uppercase transition-all hover:bg-primary/20 active:scale-95">{aiSuggestion.durationUnit||'min'}</button>
                    <div className="flex gap-4 pl-6 border-l border-white/10 h-9 items-center ml-2">
                      {['30M','1H','1D'].map((l,i) => <button key={l} type="button" onClick={()=>setAiSuggestion({...aiSuggestion, estimatedDuration:[30,1,1][i], durationUnit:['min','hours','days'][i]})} className="text-[10px] font-black text-white/20 hover:text-white transition-all uppercase tracking-tighter">{l}</button>)}
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-white/10">
            <Button
              onClick={() => handleCreateTask(aiSuggestion)}
              variant="primary"
              className="flex-1 h-14 text-[11px] font-black uppercase tracking-[0.3em] bg-primary text-black"
            >
              <Check size={18} strokeWidth={3} className="mr-3" /> COMMIT OBJECTIVE
            </Button>
            <Button
              onClick={() => setAiSuggestion(null)}
              variant="danger"
              className="h-14 px-12 text-[11px] font-black uppercase tracking-[0.3em] bg-white/10 border border-white/20 text-white hover:bg-status-error hover:text-black hover:border-status-error transition-all"
            >
              <DiscardIcon size={18} strokeWidth={3} className="mr-3" /> DISCARD
            </Button>
          </div>

          {/* Tactical Overlay */}

        </div>
      )}
    </div>
  );
};

export default AIExtractionPanel;

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Cpu,
  Check,
  X as DiscardIcon,
  Sparkles,
  RefreshCw,
  UserPlus,
  Layers,
  Zap,
  Clock,
  Type,
  Activity,
  Calendar,
  Minus,
  Plus,
  Paperclip,
  FileIcon,
  Loader2,
  X,
} from 'lucide-react';
import StorageService from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import Button from '../atoms/Button';

import { TASK_TYPE } from '../../constants';

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
  const { user } = useAuth();
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map((file) =>
        StorageService.uploadAttachment(
          file,
          user.workspaceId,
          project?._id || 'global',
          'ai-extract'
        )
      );

      const results = await Promise.all(uploadPromises);
      setAiSuggestion((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...results],
      }));
    } catch (err) {
      alert('Failed to upload one or more files. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAiSuggestion((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  return (
    <div
      className={`grid grid-cols-1 ${aiSuggestion ? 'xl:grid-cols-[400px_1fr] gap-6' : 'max-w-4xl mx-auto'} items-start animate-in fade-in slide-in-from-top-4 duration-500`}
    >
      {/* AI Intelligence Core (Input Section) */}
      <div
        className={`bg-background-elevated p-6 rounded-2xl border border-border-subtle transition-all hover:bg-white/[0.08] ${aiSuggestion ? 'sticky top-6' : ''}`}
      >
        <div className="flex items-center gap-4 mb-4 pb-3 border-b border-border-subtle">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-text-subtle">
            DESCRIBE YOUR TASK TO AUTO-GENERATE DETAILS
          </h3>
        </div>

        <div className="space-y-6">
          <textarea
            className="w-full bg-background-dark border border-white/25 text-[13px] font-black text-text px-5 py-4 rounded-xl focus:border-primary focus:bg-background-elevated focus:outline-none placeholder:text-text-subtle transition-all leading-relaxed min-h-[200px] tracking-widest shadow-inner"
            placeholder="e.g., 'OPTIMIZE AUTHENTICATION MIDDLEWARE FOR JWT STANDARDS...'"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
          <div className="pt-5 border-t border-border-subtle">
            <Button
              onClick={handleAiExtract}
              disabled={isAiProcessing || !aiInput.trim()}
              variant="primary"
              className="w-full h-12 text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-background-dark border-none hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              {isAiProcessing ? (
                <RefreshCw size={18} className="animate-spin mr-3" />
              ) : (
                <Sparkles size={18} className="mr-3 text-background-dark/40" />
              )}
              {isAiProcessing
                ? 'EXTRACTING PARAMETERS...'
                : 'INITIATE EXTRACTION'}
            </Button>
          </div>
        </div>
      </div>

      {/* Suggested Object Manifest */}
      {aiSuggestion && (
        <div className="bg-background-elevated p-6 rounded-2xl border border-border-subtle transition-all hover:bg-white/[0.08] animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-text-subtle">
                  VERIFIED AI TASK RECOMMENDATION
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Phase 1: Identity (Title & Priority) */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-black text-text-subtle uppercase tracking-[0.3em] ml-1">
                  TASK TITLE
                </label>
                <input
                  type="text"
                  className="w-full bg-background-elevated border border-border-subtle text-[13px] font-black text-text px-5 py-3.5 rounded-xl focus:border-primary/50 focus:bg-white/[0.08] focus:outline-none transition-all tracking-tight"
                  value={aiSuggestion.title}
                  onChange={(e) =>
                    setAiSuggestion({ ...aiSuggestion, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-black text-text-subtle uppercase tracking-[0.3em] ml-1">
                  TYPE
                </label>
                <select
                  className="w-full bg-background-elevated border border-border-subtle text-[11px] font-black text-text px-5 py-3.5 rounded-xl focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer tracking-widest"
                  value={aiSuggestion.type || TASK_TYPE.TASK}
                  onChange={(e) =>
                    setAiSuggestion({ ...aiSuggestion, type: e.target.value })
                  }
                >
                  <option value={TASK_TYPE.EPIC} className="bg-[#121212]">
                    EPIC
                  </option>
                  <option value={TASK_TYPE.STORY} className="bg-[#121212]">
                    STORY
                  </option>
                  <option value={TASK_TYPE.TASK} className="bg-[#121212]">
                    TASK
                  </option>
                  <option value={TASK_TYPE.BUG} className="bg-[#121212]">
                    BUG
                  </option>
                  <option value={TASK_TYPE.SPIKE} className="bg-[#121212]">
                    SPIKE
                  </option>
                  <option value={TASK_TYPE.TECH_DEBT} className="bg-[#121212]">
                    TECH DEBT
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-black text-text-subtle uppercase tracking-[0.3em] ml-1">
                  PRIORITY
                </label>
                <select
                  className="w-full bg-background-elevated border border-border-subtle text-[11px] font-black text-text px-5 py-3.5 rounded-xl focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer tracking-widest"
                  value={aiSuggestion.priority || 'medium'}
                  onChange={(e) =>
                    setAiSuggestion({
                      ...aiSuggestion,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="low" className="bg-[#121212]">
                    LOW (P4)
                  </option>
                  <option value="medium" className="bg-[#121212]">
                    STANDARD (P3)
                  </option>
                  <option value="high" className="bg-[#121212]">
                    HIGH (P2)
                  </option>
                  <option value="urgent" className="bg-[#121212]">
                    URGENT (P1)
                  </option>
                </select>
              </div>
            </div>

            {/* Phase 2: Context (Description) */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-black text-text-subtle uppercase tracking-[0.3em] ml-1">
                TASK DESCRIPTION
              </label>
              <textarea
                className="w-full bg-background-elevated border border-border-subtle text-[13px] font-black text-text px-6 py-4 rounded-xl focus:border-primary/50 focus:bg-white/[0.08] focus:outline-none transition-all h-[140px] resize-none tracking-widest leading-relaxed shadow-inner"
                value={aiSuggestion.description}
                onChange={(e) =>
                  setAiSuggestion({
                    ...aiSuggestion,
                    description: e.target.value,
                  })
                }
              />
            </div>

            {/* Phase 3: Logistics (Assignee, Sprint, Duration, Start Date) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 pt-4 border-t border-border-subtler">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[9px] font-black text-text-subtle uppercase tracking-[0.3em] ml-1">
                  <UserPlus size={12} className="text-text-subtle" /> ASSIGN TO
                </label>
                <select
                  className="w-full bg-background-elevated border border-border-subtle text-[10px] font-black text-text px-4 py-3 rounded-xl focus:border-primary/50 transition-all outline-none"
                  value={aiSuggestion.assignedUser || ''}
                  onChange={(e) =>
                    setAiSuggestion({
                      ...aiSuggestion,
                      assignedUser: e.target.value,
                    })
                  }
                >
                  <option value="" className="bg-[#121212]">
                    UNASSIGNED
                  </option>
                  {project?.members
                    ?.filter((m) => m.role !== 'WORKSPACE_ADMIN')
                    .map((m) => (
                      <option
                        key={m._id}
                        value={m._id}
                        className="bg-[#121212]"
                      >
                        {m.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[9px] font-black text-text-subtle uppercase tracking-[0.3em] ml-1">
                  <Layers size={12} className="text-text-subtle" /> SPRINT
                </label>
                <select
                  className="w-full bg-background-elevated border border-border-subtle text-[10px] font-black text-text px-4 py-3 rounded-xl focus:border-primary/50 transition-all outline-none"
                  value={aiSuggestion.sprint || ''}
                  onChange={(e) =>
                    setAiSuggestion({ ...aiSuggestion, sprint: e.target.value })
                  }
                >
                  <option value="" className="bg-[#121212]">
                    BACKLOG
                  </option>
                  {(sprints || []).map((s) => (
                    <option key={s._id} value={s._id} className="bg-[#121212]">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[9px] font-black text-text-subtle uppercase tracking-[0.3em] ml-1">
                  <Clock size={12} className="text-text-subtle" /> DURATION
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-background-elevated rounded-lg border border-border-subtle h-[42px] overflow-hidden flex-1">
                    <button
                      type="button"
                      onClick={() =>
                        setAiSuggestion({
                          ...aiSuggestion,
                          estimatedDuration: Math.max(
                            0,
                            (aiSuggestion.estimatedDuration || 0) - 5
                          ),
                        })
                      }
                      className="w-10 h-full flex items-center justify-center text-text-subtle hover:text-text transition-all border-r border-border-subtler"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      className="bg-transparent text-[11px] font-black text-text text-center w-full focus:outline-none"
                      value={aiSuggestion.estimatedDuration || 30}
                      onChange={(e) =>
                        setAiSuggestion({
                          ...aiSuggestion,
                          estimatedDuration: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setAiSuggestion({
                          ...aiSuggestion,
                          estimatedDuration:
                            (aiSuggestion.estimatedDuration || 0) + 5,
                        })
                      }
                      className="w-10 h-full flex items-center justify-center text-text-subtle hover:text-text transition-all border-l border-border-subtler"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const u = ['minutes', 'hours', 'days'];
                      setAiSuggestion({
                        ...aiSuggestion,
                        durationUnit:
                          u[
                            (u.indexOf(aiSuggestion.durationUnit || 'minutes') +
                              1) %
                              3
                          ],
                      });
                    }}
                    className="px-4 h-[42px] bg-background-elevated border border-border-subtle rounded-lg text-[9px] font-black text-text-subtle uppercase transition-all hover:bg-background-elevated active:scale-95"
                  >
                    {aiSuggestion.durationUnit === 'minutes'
                      ? 'min'
                      : aiSuggestion.durationUnit || 'min'}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[9px] font-black text-text-subtle uppercase tracking-[0.3em] ml-1">
                  <Calendar size={12} className="text-text-subtle" /> START DATE
                </label>
                <DatePicker
                  selected={
                    aiSuggestion.startDate
                      ? new Date(aiSuggestion.startDate)
                      : new Date()
                  }
                  onChange={(date) =>
                    setAiSuggestion({ ...aiSuggestion, startDate: date })
                  }
                  className="w-full bg-background-elevated border border-border-subtle text-[10px] font-black text-text px-4 py-3 rounded-xl focus:border-primary/50 transition-all outline-none"
                  placeholderText="SELECT START DATE"
                  dateFormat="MMM d, yyyy"
                />
              </div>
            </div>
          </div>

          {/* AI Attachment Extension */}
          <div className="space-y-3 pt-3 border-t border-border-subtler">
            <label className="flex items-center gap-2 text-[9px] font-black text-text/70 uppercase tracking-[0.3em] ml-1">
              <Paperclip size={10} className="text-primary" /> ATTACHMENTS
            </label>

            <div className="flex flex-wrap gap-2">
              {aiSuggestion.attachments?.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-background-elevated border border-border-subtle px-3 py-1.5 rounded-lg group transition-all hover:bg-background-elevated"
                >
                  <FileIcon size={12} className="text-primary-light" />
                  <span className="text-[9px] font-bold text-text-muted truncate max-w-[120px]">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="text-text-subtler hover:text-status-error transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <label
                className={`flex items-center gap-2 px-4 py-2 border border-dashed border-border-subtle rounded-lg cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all ${uploading ? 'opacity-50 cursor-wait' : ''}`}
              >
                {uploading ? (
                  <Loader2 size={12} className="text-primary animate-spin" />
                ) : (
                  <Paperclip size={12} className="text-text-subtle" />
                )}
                <span className="text-[9px] font-black uppercase tracking-widest text-text-subtle">
                  {uploading ? 'UPLOADING...' : 'ATTACH FILES'}
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-5 border-t border-border-subtle">
            <Button
              onClick={() => handleCreateTask(aiSuggestion)}
              variant="primary"
              className="flex-1 h-12 text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-background-dark border-none hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              <Check size={18} strokeWidth={3} className="mr-3" /> COMMIT
              OBJECTIVE
            </Button>
            <Button
              onClick={() => setAiSuggestion(null)}
              variant="danger"
              className="h-12 px-10 text-[10px] font-black uppercase tracking-[0.3em] bg-background-elevated border border-border-subtle text-text hover:bg-status-error hover:text-background-dark hover:border-status-error transition-all"
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

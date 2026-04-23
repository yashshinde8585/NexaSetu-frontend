import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, Minus, Plus, Paperclip, X, FileIcon, Loader2 } from 'lucide-react';
import StorageService from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

// A form component for manually creating new tasks with specific titles, sprints, and descriptions.
const TaskForm = ({ newTask, setNewTask, handleCreateTask, sprints = [] }) => {
  const { user } = useAuth();
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => 
        StorageService.uploadAttachment(file, user.workspaceId, newTask.project || 'global', 'new')
      );
      
      const results = await Promise.all(uploadPromises);
      setNewTask(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...results]
      }));
    } catch (err) {
      alert('Failed to upload one or more files. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const removeAttachment = async (index) => {
    const attachment = newTask.attachments[index];
    try {
      setNewTask(prev => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== index)
      }));
    } catch (err) {
      console.error('Failed to remove attachment:', err);
    }
  };

  return (
    <div className="bg-black p-5 sm:p-6 rounded-none mb-8 border border-white/10 animate-in fade-in zoom-in-95 duration-200 shadow-2xl relative overflow-hidden">
      {/* Tactical Header Overlay */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateTask(newTask);
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Core Identity */}
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2 ml-1">
                Mission Title
              </label>
              <input
                type="text"
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-none focus:border-primary focus:outline-none transition-all font-black text-xs uppercase tracking-tight placeholder:text-white/10"
                placeholder="E.G. CORE_SYSTEM_UPDATE"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2 ml-1">
                Deployment Sprint
              </label>
              <div className="relative">
                <select
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-none focus:border-primary focus:outline-none transition-all cursor-pointer font-black text-[10px] uppercase tracking-widest appearance-none"
                  value={newTask.sprint || ''}
                  onChange={(e) => setNewTask({ ...newTask, sprint: e.target.value })}
                >
                  <option value="" className="bg-black">No sprint selected</option>
                  {(sprints || []).map((sprint) => (
                    <option key={sprint._id} value={sprint._id} className="bg-black">
                      {sprint.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                   <div className="w-1.5 h-1.5 border-r border-b border-current rotate-45" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2 ml-1">
                Operational Brief
              </label>
              <textarea
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-none focus:border-primary focus:outline-none transition-all font-bold text-xs uppercase tracking-tight placeholder:text-white/10 resize-none"
                rows="3"
                placeholder="DESCRIBE MISSION PARAMETERS..."
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Right Column: Parameters */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2 ml-1">
                  Priority Level
                </label>
                <div className="relative">
                  <select
                    className={`w-full bg-white/[0.03] border border-white/10 px-4 py-3 rounded-none focus:outline-none transition-all cursor-pointer font-black text-[10px] uppercase tracking-widest appearance-none ${
                      newTask.priority === 'urgent' ? 'text-status-error' :
                      newTask.priority === 'high' ? 'text-status-warning' :
                      newTask.priority === 'low' ? 'text-status-success' : 'text-primary'
                    }`}
                    value={newTask.priority || 'medium'}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low" className="bg-black text-status-success">Low</option>
                    <option value="medium" className="bg-black text-primary">Medium</option>
                    <option value="high" className="bg-black text-status-warning">High</option>
                    <option value="urgent" className="bg-black text-status-error">Urgent</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <div className="w-1.5 h-1.5 border-r border-b border-current rotate-45" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2 ml-1">
                  Target Deadline
                </label>
                <div className="relative z-[60]">
                  <DatePicker
                    selected={newTask.dueDate ? new Date(newTask.dueDate) : null}
                    onChange={(date) => setNewTask({ ...newTask, dueDate: date })}
                    dateFormat="MMM d, yyyy"
                    className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-none focus:border-primary focus:outline-none transition-all cursor-pointer font-black text-[10px] uppercase tracking-widest"
                    placeholderText="SELECT_DATE"
                    calendarClassName="nexa-datepicker"
                    popperPlacement="bottom-end"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-4 space-y-4">
              <div className="flex items-center gap-2">
                 <Clock size={12} className="text-primary" />
                 <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">
                   Estimated Duration
                 </label>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-black border border-white/20 p-0.5">
                  <button
                    type="button"
                    onClick={() => setNewTask({ ...newTask, estimatedDuration: Math.max(0, (newTask.estimatedDuration || 0) - 5) })}
                    className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Minus size={12} />
                  </button>
                  
                  <input
                    type="number"
                    className="bg-transparent text-[11px] font-black text-white text-center w-12 focus:outline-none uppercase"
                    value={newTask.estimatedDuration || 30}
                    onChange={(e) => setNewTask({ ...newTask, estimatedDuration: parseInt(e.target.value) || 0 })}
                  />

                  <button
                    type="button"
                    onClick={() => setNewTask({ ...newTask, estimatedDuration: (newTask.estimatedDuration || 0) + 5 })}
                    className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="flex gap-px bg-white/10 border border-white/10">
                  {['min', 'hours', 'days'].map(unit => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => setNewTask({ ...newTask, durationUnit: unit })}
                      className={`px-3 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${
                        (newTask.durationUnit || 'min') === unit 
                        ? 'bg-primary text-black' 
                        : 'bg-black text-white/30 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {unit === 'min' ? 'MINS' : unit.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-1 items-center overflow-x-auto no-scrollbar">
                {[15, 60, 480].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      if (v === 15) setNewTask({ ...newTask, estimatedDuration: 15, durationUnit: 'min' });
                      if (v === 60) setNewTask({ ...newTask, estimatedDuration: 1, durationUnit: 'hours' });
                      if (v === 480) setNewTask({ ...newTask, estimatedDuration: 1, durationUnit: 'days' });
                    }}
                    className="text-[8px] font-black text-white/20 hover:text-primary transition-all uppercase tracking-[0.2em] border-b border-transparent hover:border-primary pb-0.5"
                  >
                    {v === 15 ? 'Quick Fix (15M)' : v === 60 ? 'Standard (1H)' : 'Full Day (1D)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Uplink */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2 ml-1">
                Mission Assets
              </label>
              
              <div className="flex flex-wrap gap-2">
                {newTask.attachments?.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 group transition-all hover:bg-white/10">
                    <FileIcon size={12} className="text-primary" />
                    <span className="text-[9px] font-black text-white/80 truncate max-w-[100px] uppercase tracking-tighter">{file.name}</span>
                    <button 
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="text-white/20 hover:text-status-error transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                <label className={`flex items-center gap-2 px-4 py-2 border border-dashed border-white/20 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer ${uploading ? 'opacity-50 cursor-wait' : ''}`}>
                  {uploading ? (
                    <Loader2 size={14} className="text-primary animate-spin" />
                  ) : (
                    <Paperclip size={14} className="text-white/40" />
                  )}
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
                    {uploading ? 'UPLOADING...' : 'ATTACH_ASSETS'}
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
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-black font-black py-4 px-6 rounded-none w-full transition-all duration-300 shadow-2xl shadow-primary/20 text-[11px] uppercase tracking-[0.4em] active:scale-[0.98]"
        >
          Initialize Mission_
        </button>
      </form>
    </div>
  );
};

export default TaskForm;

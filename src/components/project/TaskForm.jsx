import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Clock, Minus, Plus } from 'lucide-react';

// A form component for manually creating new tasks with specific titles, sprints, and descriptions.
const TaskForm = ({ newTask, setNewTask, handleCreateTask, sprints = [] }) => {
  return (
    <div className="bg-background-light p-6 rounded-lg mb-8 shadow-md border border-background-dark/30 animate-in fade-in zoom-in-95 duration-200">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateTask(newTask);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1 tracking-tight">
            Title
          </label>
          <input
            type="text"
            className="w-full bg-background-dark border border-background-dark text-white px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none transition-all"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 tracking-tight">
            Sprint
          </label>
          <select
            className="w-full bg-background-dark border border-background-dark text-white px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none transition-all cursor-pointer"
            value={newTask.sprint || ''}
            onChange={(e) => setNewTask({ ...newTask, sprint: e.target.value })}
          >
            <option value="">No sprint selected</option>
            {(sprints || []).map((sprint) => (
              <option key={sprint._id} value={sprint._id}>
                {sprint.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 tracking-tight">
            Description
          </label>
          <textarea
            className="w-full bg-background-dark border border-background-dark text-white px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none transition-all"
            rows="2"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 tracking-tight">
              Priority
            </label>
            <select
              className="w-full bg-background-dark border border-background-dark text-white px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none transition-all cursor-pointer"
              value={newTask.priority || 'medium'}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
               <Clock size={12} className="text-white/20" />
               <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">
                 ESTIMATED DURATION
               </label>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 lg:gap-8 justify-start sm:justify-end">
              {/* Ultra-Compact Scrubber */}
              <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setNewTask({ ...newTask, estimatedDuration: Math.max(0, (newTask.estimatedDuration || 0) - 5) })}
                  className="w-7 h-7 rounded flex items-center justify-center text-white/30 hover:text-white transition-all px-2"
                >
                  <Minus size={12} />
                </button>
                
                <input
                  type="number"
                  className="bg-transparent text-xs font-black text-white text-center w-10 focus:outline-none"
                  value={newTask.estimatedDuration || 30}
                  onChange={(e) => setNewTask({ ...newTask, estimatedDuration: parseInt(e.target.value) || 0 })}
                />

                <button
                  type="button"
                  onClick={() => setNewTask({ ...newTask, estimatedDuration: (newTask.estimatedDuration || 0) + 5 })}
                  className="w-7 h-7 rounded flex items-center justify-center text-white/30 hover:text-white transition-all px-2"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Toggle-style Unit Switcher */}
              <button
                type="button"
                onClick={() => {
                  const units = ['min', 'hours', 'days'];
                  const next = units[(units.indexOf(newTask.durationUnit || 'min') + 1) % 3];
                  setNewTask({ ...newTask, durationUnit: next });
                }}
                className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-[9px] font-black text-primary uppercase tracking-widest transition-all hover:bg-primary/20 shrink-0"
              >
                {newTask.durationUnit === 'min' ? 'MINS' : newTask.durationUnit === 'hours' ? 'HOURS' : 'DAYS'}
              </button>

              {/* Mini Presets */}
              <div className="flex gap-4 border-l border-white/10 pl-4 sm:pl-6 h-6 items-center overflow-x-auto no-scrollbar shrink-0">
                {[15, 60, 480].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      if (v === 15) setNewTask({ ...newTask, estimatedDuration: 15, durationUnit: 'min' });
                      if (v === 60) setNewTask({ ...newTask, estimatedDuration: 1, durationUnit: 'hours' });
                      if (v === 480) setNewTask({ ...newTask, estimatedDuration: 1, durationUnit: 'days' });
                    }}
                    className="text-[9px] font-black text-white/20 hover:text-white transition-all uppercase tracking-tighter"
                  >
                    {v === 15 ? '15M' : v === 60 ? '1H' : '1D'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium mb-1 tracking-tight uppercase tracking-[0.2em] text-[10px] text-white/50">
             DUE DATE
           </label>
           <div className="relative z-[60]">
             <DatePicker
               selected={newTask.dueDate ? new Date(newTask.dueDate) : null}
               onChange={(date) => setNewTask({ ...newTask, dueDate: date })}
               dateFormat="MMM d, yyyy"
               className="w-full bg-background-dark border border-background-dark text-white px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none transition-all cursor-pointer font-bold text-xs"
               placeholderText="Pick a date"
               calendarClassName="nexa-datepicker"
               popperPlacement="bottom-start"
             />
           </div>
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded w-full transition duration-200 shadow-xl shadow-primary/20"
        >
          Create task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;

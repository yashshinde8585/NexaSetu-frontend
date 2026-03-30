import React from 'react';

const TaskForm = ({ newTask, setNewTask, handleCreateTask }) => {
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
              <label className="block text-sm font-medium mb-1 tracking-tight">Task Title</label>
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
              <label className="block text-sm font-medium mb-1 tracking-tight">Mission Cycle / Sprint (Optional)</label>
              <select
                  className="w-full bg-background-dark border border-background-dark text-white px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none transition-all cursor-pointer"
                  value={newTask.sprint || ''}
                  onChange={(e) => setNewTask({ ...newTask, sprint: e.target.value })}
              >
                  <option value="">No Active Cycle</option>
                  {(sprints || []).map(sprint => (
                      <option key={sprint._id} value={sprint._id}>{sprint.name}</option>
                  ))}
              </select>
          </div>
          <div>
              <label className="block text-sm font-medium mb-1 tracking-tight">Description (Optional)</label>
              <textarea
                  className="w-full bg-background-dark border border-background-dark text-white px-4 py-2 rounded focus:ring-primary focus:ring-1 focus:outline-none transition-all"
                  rows="2"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
          </div>
          <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-6 rounded w-full transition duration-200 shadow-xl shadow-primary/20">
              Create Task
          </button>
      </form>
    </div>
  );
};

export default TaskForm;

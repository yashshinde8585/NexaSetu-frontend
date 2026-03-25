import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Search, Filter, MoreVertical, Settings, Users, Archive, Trash2, Rocket } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

const ProjectList = ({ 
  projects = [], 
  user, 
  handleCreateProject, 
  newProjectName, 
  setNewProjectName, 
  showForm, 
  setShowForm 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      activeFilter === 'All' ? true :
      activeFilter === 'Active' ? project.percentage < 100 :
      activeFilter === 'Completed' ? project.percentage === 100 : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FolderOpen className="text-primary" size={20} /> Workload Dashboard
        </h2>
        
        <div className="flex-1 flex justify-end w-full sm:w-auto">
          {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
            !showForm ? (
              <button
                id="new-project-btn"
                onClick={() => setShowForm(true)}
                className={`bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-all shadow-lg flex items-center gap-2 text-xs transform hover:scale-105 active:scale-95 whitespace-nowrap ${projects.length === 0 ? 'animate-pulse' : ''}`}
              >
                <span className="text-lg">+</span> New Project
              </button>
            ) : (
              <form onSubmit={handleCreateProject} className="flex items-center gap-2 w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300">
                <input
                  type="text"
                  placeholder="Project name..."
                  className="flex-1 bg-background-dark/50 text-white border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs transition-all"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg text-xs transition-all whitespace-nowrap shadow-lg"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-white/5 hover:bg-white/10 text-text-muted hover:text-white px-3 py-2 rounded-lg text-xs transition-all whitespace-nowrap border border-white/5"
                >
                  Cancel
                </button>
              </form>
            )
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background-light/20 p-4 rounded-xl border border-white/5">
        <div className="relative w-full sm:w-72 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Find a project..." 
            className="w-full bg-background-dark/50 border border-white/10 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Active', 'Completed'].map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === filter ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="w-[1px] h-4 bg-white/10 mx-1 hidden sm:block" />
          <button className="p-1.5 rounded-lg bg-white/5 text-text-muted hover:text-white transition-all">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-background-light/20 p-12 rounded-xl text-center border-2 border-dashed border-white/10 flex flex-col items-center justify-center space-y-6 group transition-all hover:bg-white/5">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
            <Rocket className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">Your workspace is clear.</h3>
            <p className="text-text-muted font-medium text-xs italic">Let's build something amazing today.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="group/btn relative px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-black text-xs shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <span className="text-lg">+</span> Start Your First Project
            </span>
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-background-light/10 p-12 rounded-2xl text-center border border-dashed border-white/5">
          <p className="text-text-muted text-sm font-medium italic">No projects found matching current filters.</p>
          <button 
            onClick={() => {setSearchQuery(''); setActiveFilter('All');}}
            className="mt-4 text-xs font-bold text-primary hover:underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="bg-background-light/30 rounded-xl border border-white/5 overflow-visible">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white/5 border-b border-white/5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
            <div className="col-span-5">Project Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Execution Progress</div>
            <div className="col-span-2 text-right">Lead & Actions</div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredProjects.map((project) => (
              <Link
                key={project._id}
                to={`/project/${project._id}`}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white/[0.04] transition-all group ${activeMenuId === project._id ? 'z-40 relative' : 'relative z-0'}`}
              >
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-primary font-bold text-base shadow-lg ring-1 ring-white/5 shrink-0">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white font-bold truncate group-hover:text-primary transition-colors leading-none mb-1 text-sm">{project.name}</span>
                    <span className="text-[10px] text-text-muted font-semibold leading-none">{project.totalTasks || 0} Tasks</span>
                  </div>
                </div>

                <div className="col-span-2 hidden md:flex items-center">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                    project.percentage === 100 
                    ? 'bg-status-success/10 text-status-success border-status-success/20' 
                    : project.percentage > 0 
                      ? 'bg-status-warning/10 text-status-warning border-status-warning/20' 
                      : 'bg-status-info/10 text-status-info border-status-info/20'
                  }`}>
                    {project.percentage === 100 ? 'COMPLETED' : project.percentage > 0 ? 'IN PROGRESS' : 'BACKLOG'}
                  </span>
                </div>

                <div className="col-span-3 hidden md:flex items-center gap-3">
                  <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div className={`h-full transition-all duration-1000 ease-out ${project.percentage === 100 ? 'bg-status-success' : 'bg-primary'}`} style={{ width: `${project.percentage}%` }}></div>
                  </div>
                  <span className={`text-[11px] font-bold w-8 text-right ${project.percentage === 100 ? 'text-status-success' : 'text-text-muted'}`}>{project.percentage}%</span>
                </div>

                <div className="col-span-2 flex items-center justify-end gap-3 transition-all">
                  <div className="relative group/avatar">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-700 to-slate-800 border-2 border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-md ring-1 ring-white/5 cursor-help">
                      {getInitials(project.createdBy?.name)}
                    </div>
                  </div>

                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveMenuId(activeMenuId === project._id ? null : project._id);
                      }}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${activeMenuId === project._id ? 'bg-primary/20 text-primary' : 'text-text-muted hover:bg-white/10 hover:text-white'}`}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenuId === project._id && (
                      <div className="absolute right-0 top-full mt-2 w-44 bg-background-light border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {[
                          { label: 'Edit Details', icon: <Settings size={14} />, role: ['ADMIN', 'MANAGER'] },
                          { label: 'Manage Team', icon: <Users size={14} />, role: ['ADMIN', 'MANAGER'] },
                          { label: 'Archive Project', icon: <Archive size={14} />, color: 'text-status-warning', role: ['ADMIN', 'MANAGER'] },
                          { label: 'Delete Project', icon: <Trash2 size={14} />, color: 'text-status-error', role: ['ADMIN', 'MANAGER'] }
                        ].filter(item => !item.role || item.role.includes(user.role)).map((item, idx) => (
                          <button key={idx} className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold hover:bg-white/5 transition-colors ${item.color || 'text-white/90'}`}>
                            {item.icon}
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;

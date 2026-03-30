import React, { useState } from 'react';
import { Search, Briefcase, Users, Activity, ShieldAlert } from 'lucide-react';

const ProjectOverviewList = ({ 
  projects = [], 
  isLoading 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = (projects || []).filter(project => {
    const matchesSearch = (project.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status/Risk Filter Logic
    const matchesFilter = 
      activeFilter === 'All' ? true :
      activeFilter === 'High Risk' ? project.riskLevel === 'High' :
      activeFilter === 'Medium Risk' ? project.riskLevel === 'Medium' :
      activeFilter === 'Healthy' ? project.riskLevel === 'Low' : true;
 
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-background-light/30 border border-white/5 overflow-visible glass-dark shadow-2xl rounded-3xl">
      {/* Integrated Header Toolbar */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 px-8 py-6 border-b border-white/5">
        <h2 className="text-xl font-bold flex items-center gap-2 shrink-0 text-white tracking-tight">
          <Briefcase className="text-primary" size={20} /> Project Overview
        </h2>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto flex-1 justify-end">
          {/* Search Input */}
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-text-muted/40 focus:outline-none focus:border-primary/30 focus:bg-white/[0.04] transition-all"
            />
          </div>

          {/* Risk Filters */}
          <div className="flex p-1 bg-white/[0.02] border border-white/5 rounded-xl shrink-0">
            {['All', 'Healthy', 'Medium Risk', 'High Risk'].map((filter) => (
               <button
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                   activeFilter === filter 
                   ? 'bg-white/10 text-white shadow-sm' 
                   : 'text-text-muted hover:text-white hover:bg-white/5'
                 }`}
               >
                 {filter}
               </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 sm:p-20 text-center flex flex-col items-center justify-center space-y-8 group">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-2xl shadow-primary/20">
            <Briefcase className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">No matching projects found.</h3>
            <p className="text-text-muted font-bold text-xs sm:text-sm italic opacity-60">Adjust your filters or create a new project.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-visible">
          {/* Enhanced Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-5 items-center bg-white/[0.01] border-b border-white/5 text-[10px] font-black text-text-muted uppercase tracking-[0.25em]">
            <div className="col-span-4">Project Name</div>
            <div className="col-span-2">Health Score</div>
            <div className="col-span-2">Progress</div>
            <div className="col-span-2">Team</div>
            <div className="col-span-2 text-right">Risk Status</div>
          </div>

          <div className="divide-y divide-white/5 font-body">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-6 px-5 md:px-8 py-5 md:py-6 items-start md:items-center hover:bg-white/[0.04] transition-all group"
              >
                {/* Project Name Column */}
                <div className="col-span-4 flex items-center gap-5 w-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20 p-[1px] shadow-xl group-hover:scale-110 transition-transform duration-500 shrink-0 border border-white/10 flex items-center justify-center text-primary font-black text-lg">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-white font-black truncate group-hover:text-primary transition-colors text-sm sm:text-base tracking-tight">{project.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">ID: {project._id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Tactical Health */}
                <div className="col-span-2 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${
                      project.healthScore >= 80 ? 'text-status-success' : 
                      project.healthScore >= 50 ? 'text-status-warning' : 'text-status-error'
                    }`}>
                      {project.healthScore}%
                    </span>
                    <Activity size={10} className="text-text-muted opacity-40" />
                  </div>
                  <span className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">{project.healthLabel}</span>
                </div>

                {/* Operational Velocity (Progress) */}
                <div className="col-span-2 flex flex-col">
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1 max-w-[80px]">
                    <div 
                      className="bg-primary h-full transition-all duration-1000" 
                      style={{ width: `${project.percentage}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-1.5">{project.percentage}% Complete</span>
                </div>

                {/* Workforce Pulse (Members) */}
                <div className="col-span-2 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white/90">{project.members?.length || 0}</span>
                    <Users size={12} className="text-text-muted opacity-40" />
                  </div>
                  <span className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">Members</span>
                </div>

                {/* Strategic Status */}
                <div className="col-span-2 flex items-center justify-end">
                   <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm flex items-center gap-2 ${
                     project.riskLevel === 'Low'
                     ? 'bg-status-success/10 text-status-success border-status-success/20 shadow-status-success/10' 
                     : project.riskLevel === 'Medium'
                       ? 'bg-status-warning/10 text-status-warning border-status-warning/20 shadow-status-warning/10' 
                       : 'bg-status-error/10 text-status-error border-status-error/20 shadow-status-error/10'
                   }`}>
                     {project.riskLevel === 'High' && <ShieldAlert size={10} />}
                     {project.riskLevel.toUpperCase()}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectOverviewList;

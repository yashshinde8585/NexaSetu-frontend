import React from 'react';
import { ChevronDown, Filter, Search } from 'lucide-react';

const SWEHeader = ({
  projects = [],
  pastSprints = [],
  sprintName = '',
  selectedWorkspace,
  setSelectedWorkspace,
  selectedSprintId,
  setSelectedSprintId,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 border-b border-border-subtle pb-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-text uppercase">
          Software Engineer Dashboard
        </h1>
        <p className="text-[10px] text-text-subtle uppercase tracking-widest font-black">
          Build quality software. Ship value. Learn and grow.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {/* Workspace Selector */}
        <div className="relative">
          <span className="absolute left-3 top-1.5 text-[7px] font-black uppercase text-text-subtler tracking-wider">
            Workspace
          </span>
          <select
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            className="bg-background-elevated border border-border hover:border-border text-[9px] font-black uppercase tracking-wider text-text pl-3 pr-8 pt-3.5 pb-1 focus:outline-none focus:border-primary/50 cursor-pointer rounded-sm min-w-[150px] appearance-none"
          >
            <option value="all">All Projects</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-3 top-3.5 text-text-subtle pointer-events-none"
          />
        </div>

        {/* Sprint Selector */}
        <div className="relative">
          <span className="absolute left-3 top-1.5 text-[7px] font-black uppercase text-text-subtler tracking-wider">
            Sprint
          </span>
          <select
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            className="bg-background-elevated border border-border hover:border-border text-[9px] font-black uppercase tracking-wider text-text pl-3 pr-8 pt-3.5 pb-1 focus:outline-none focus:border-primary/50 cursor-pointer rounded-sm min-w-[180px] appearance-none"
          >
            <option value="active">{sprintName || 'Active Sprint'}</option>
            {pastSprints?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-3 top-3.5 text-text-subtle pointer-events-none"
          />
        </div>

        {/* Filters Button */}
        <button className="flex items-center gap-2 h-9 px-4 bg-background-elevated border border-border hover:border-border text-[9px] font-black uppercase tracking-wider text-text transition-all active:scale-[0.98] rounded-sm cursor-pointer">
          <Filter size={12} className="text-text-subtle" />
          Filters
        </button>

        {/* Search Input */}
        <div className="relative">
          <Search
            size={12}
            className="absolute left-3 top-3 text-text-subtle"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 bg-background-elevated border border-border hover:border-border text-[9px] font-black uppercase tracking-wider text-text pl-8 pr-6 py-2 focus:outline-none focus:border-primary/50 focus:w-52 transition-all rounded-sm placeholder:text-text-subtler"
          />
          <span className="absolute right-3 top-2 text-[8px] font-black bg-background-elevated border border-border px-1 text-text-subtler pointer-events-none">
            /
          </span>
        </div>
      </div>
    </div>
  );
};

export default SWEHeader;

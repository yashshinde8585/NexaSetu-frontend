import React, { useState } from 'react';
import { Search, Rocket } from 'lucide-react';

// A component that manages and displays a searchable list of tactical operational cycles.
const SprintList = ({
  sprints = [],
  user,
  isLoading,
  onSprintSelect,
  selectedSprintId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Determines the current status of a sprint based on its start and end dates.
  const deriveStatus = (sprint) => {
    if (sprint.status === 'completed') return 'completed';

    const now = new Date();
    // Normalize to start of day for comparison
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const start = new Date(sprint.startDate);
    const startDate = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    ).getTime();
    const end = new Date(sprint.endDate);
    const endDate = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate()
    ).getTime();

    if (today < startDate) return 'upcoming';
    if (today > endDate) return 'completed';
    return 'active';
  };

  const filteredSprints = (sprints || []).filter((sprint) => {
    const matchesSearch = (sprint.name || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const derivedStatus = deriveStatus(sprint);

    // Status Filter Logic
    const matchesStatus =
      activeFilter === 'All'
        ? true
        : activeFilter === 'Upcoming'
          ? derivedStatus === 'upcoming'
          : activeFilter === 'Active'
            ? derivedStatus === 'active'
            : activeFilter === 'Completed'
              ? derivedStatus === 'completed'
              : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-background-light/30 border border-white/5 overflow-visible glass-dark shadow-2xl rounded-3xl">
      {/* Integrated Header Toolbar */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 px-5 py-4 md:px-8 md:py-6 border-b border-white/5">
        <h2 className="text-xl font-bold flex items-center gap-2 shrink-0 text-white tracking-tight">
          Tactical Operational Cycles
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto flex-1 justify-end">
          {/* Search Input */}
          <div className="relative w-full md:w-64 group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
              size={14}
            />
            <input
              type="text"
              placeholder="Locate mission cycle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-text-muted/40 focus:outline-none focus:border-primary/30 focus:bg-white/[0.04] transition-all"
            />
          </div>

          {/* Status Pills */}
          <div className="flex p-1 bg-white/[0.02] border border-white/5 rounded-xl shrink-0">
            {['All', 'Active', 'Upcoming', 'Completed'].map((filter) => (
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

      {sprints.length === 0 ? (
        <div className="p-12 sm:p-20 text-center flex flex-col items-center justify-center space-y-8 group">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-2xl shadow-primary/20">
            {/* Mission Vector Icon Removed */}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              No active tactical cycles.
            </h3>
            <p className="text-text-muted font-bold text-xs sm:text-sm italic opacity-60">
              Initialize your first sprint matrix in the Project Intel sector.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-visible">
          {/* Enhanced Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-5 items-center bg-white/[0.01] border-b border-white/5 text-[10px] font-black text-text-muted uppercase tracking-[0.25em]">
            <div className="col-span-5 transition-all">Sprint Designation</div>
            <div className="col-span-3">Commencement</div>
            <div className="col-span-2">Cycle Duration</div>
            <div className="col-span-2 text-right">Tactical Status</div>
          </div>

          <div className="divide-y divide-white/5 font-body">
            {filteredSprints.map((sprint) => (
              <div
                key={sprint._id}
                onClick={() =>
                  onSprintSelect?.(
                    selectedSprintId === sprint._id ? null : sprint._id
                  )
                }
                className={`flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-6 px-5 md:px-8 py-5 md:py-6 items-start md:items-center hover:bg-white/[0.04] transition-all group cursor-pointer ${
                  selectedSprintId === sprint._id
                    ? 'bg-primary/5 border-l-4 border-primary'
                    : ''
                }`}
              >
                {/* Sprint Name Column */}
                <div className="col-span-5 flex items-center gap-5 w-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20 p-[1px] shadow-xl group-hover:scale-110 transition-transform duration-500 shrink-0 border border-white/10 flex items-center justify-center text-primary font-black text-lg">
                    {sprint.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-white font-black truncate group-hover:text-primary transition-colors text-sm sm:text-base tracking-tight">
                      {sprint.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                        ID: {sprint._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Commencement Date */}
                <div className="col-span-3 flex flex-col">
                  <span className="text-xs font-bold text-white/90">
                    {new Date(sprint.startDate).toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">
                    Start Vector
                  </span>
                </div>

                {/* Cycle Duration */}
                <div className="col-span-2 flex flex-col">
                  <span className="text-xs font-bold text-white/90">
                    {Math.max(
                      1,
                      Math.ceil(
                        (new Date(sprint.endDate) -
                          new Date(sprint.startDate)) /
                          (1000 * 60 * 60 * 24)
                      )
                    )}{' '}
                    Days
                  </span>
                  <span className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">
                    Timeframe
                  </span>
                </div>

                {/* Status Column */}
                <div className="col-span-2 flex items-center justify-end">
                  {(() => {
                    const status = deriveStatus(sprint);
                    return (
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${
                          status === 'active'
                            ? 'bg-status-success/10 text-status-success border-status-success/20 shadow-status-success/10'
                            : status === 'completed'
                              ? 'bg-primary/10 text-primary border-primary/20 shadow-primary/10'
                              : 'bg-white/5 text-text-muted border-white/10 shadow-white/5'
                        }`}
                      >
                        {status.toUpperCase()}
                      </span>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintList;

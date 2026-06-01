import React from 'react';

const TLTeamTab = ({ teamWorkload = [], serviceMap = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div className="bg-card border border-border-subtle p-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle block mb-4">
          Team Workload Capacities
        </span>
        <div className="flex flex-col gap-4">
          {teamWorkload?.map((user, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-black uppercase">
                <span>{user.member}</span>
                <span
                  className={`${
                    user.status === 'Overallocated'
                      ? 'text-[#EF4444]'
                      : user.status === 'Committed'
                        ? 'text-yellow-500'
                        : 'text-[#10B981]'
                  }`}
                >
                  {user.load}% Load ({user.status})
                </span>
              </div>
              <div className="w-full bg-background-elevated h-2 rounded-none overflow-hidden">
                <div
                  className={`h-full ${
                    user.status === 'Overallocated'
                      ? 'bg-status-error'
                      : user.status === 'Committed'
                        ? 'bg-yellow-500'
                        : 'bg-status-success'
                  }`}
                  style={{ width: `${user.load}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border-subtle p-4 flex flex-col justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle block mb-4">
          Node Authority Hierarchy
        </span>
        <div className="flex flex-col gap-2">
          {serviceMap?.slice(0, 5)?.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-background-elevated border border-border rounded-none hover:bg-background-elevated transition-colors"
            >
              <div className="w-8 h-8 rounded-none border border-border flex items-center justify-center text-[9px] font-black text-text-subtle uppercase">
                {s.owner?.[0] || ''}
              </div>
              <div className="flex flex-col gap-1 truncate pr-2">
                <span className="text-[7px] font-black text-text-subtler uppercase tracking-[0.2em] leading-none">
                  OWNER: {s.name}
                </span>
                <span className="text-[10px] font-black text-text uppercase tracking-widest truncate leading-none">
                  {s.owner}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TLTeamTab;

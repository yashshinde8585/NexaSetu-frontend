import React from 'react';
import { Box, ChevronRight, ShieldCheck } from 'lucide-react';
import EmptyState from '../../atoms/EmptyState';

const SquadGrid = React.memo(({ groups, onNavigate, searchTerm }) => {
  if (groups.length === 0) {
    return (
      <EmptyState 
        title={searchTerm ? 'ZERO_RESULTS' : 'NO_TEAMS_DETECTED'}
        message={searchTerm 
          ? `SEARCH FAILED TO LOCATE "${searchTerm}" WITHIN ASSIGNED SECTORS.` 
          : 'PERSONNEL ASSIGNMENTS WILL MANIFEST UPON SECTOR ALLOCATION.'}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => onNavigate(group.id)}
          className="group relative bg-white/5 border border-white/10 hover:border-primary/40 rounded-xl p-5 transition-all cursor-pointer overflow-hidden"
        >
          <div className="relative z-10 space-y-6 flex flex-col h-full">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded bg-black border border-white/10 flex items-center justify-center text-primary group-hover:border-primary transition-all">
                <Box size={20} />
              </div>
              <div className="p-1.5 rounded text-white/10 group-hover:text-primary transition-all">
                <ChevronRight size={16} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black text-white tracking-tight leading-tight mb-2 group-hover:text-primary transition-colors">
                {group.name}
              </h3>
              <div className="flex items-center gap-2">
                 <ShieldCheck size={10} className="text-primary/50" />
                 <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{group.members.length} OPERATIVES</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
              <div className="flex -space-x-2">
                {group.members.slice(0, 4).map((m, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded bg-black border border-white/10 flex items-center justify-center text-[9px] font-black text-white/40 uppercase shadow-lg ring-2 ring-black overflow-hidden"
                  >
                    {m.profilePicture ? (
                      <img src={m.profilePicture} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      m.name.charAt(0)
                    )}
                  </div>
                ))}
                {group.members.length > 4 && (
                  <div className="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black text-white/20 ring-2 ring-black">
                    +{group.members.length - 4}
                  </div>
                )}
              </div>
              <div className="text-[8px] font-black text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-widest">VIEW SECTOR</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

SquadGrid.displayName = 'SquadGrid';

export default SquadGrid;

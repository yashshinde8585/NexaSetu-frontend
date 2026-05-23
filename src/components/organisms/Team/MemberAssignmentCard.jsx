import React from 'react';
import { Loader2 } from 'lucide-react';
import TacticalCustomSelect from '../../molecules/TacticalCustomSelect';

const MemberAssignmentCard = React.memo(
  ({
    member,
    allProjects,
    selectedProjectId,
    onProjectChange,
    onAssign,
    isLoading,
    canManage,
  }) => {
    return (
      <div className="p-3 bg-black border border-white/10 rounded-lg flex flex-col gap-3 hover:border-primary/40 transition-all group">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-black text-white/20 group-hover:text-primary transition-colors overflow-hidden border border-white/10 shrink-0">
            {member.profilePicture ? (
              <img
                src={member.profilePicture}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              member.name.charAt(0)
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-black text-white truncate tracking-tight">
              {member.name}
            </span>
            <span className="text-[8px] text-primary/50 font-black uppercase truncate tracking-[0.1em]">
              {member.jobTitle || 'OPERATIVE'}
            </span>
          </div>
        </div>

        {canManage && (
          <div className="pt-3 border-t border-white/5 flex items-center gap-2">
            <div className="flex-1">
              <TacticalCustomSelect
                value={selectedProjectId || ''}
                onChange={(val) => onProjectChange(member.id, val)}
                placeholder="SELECT SECTOR..."
                options={allProjects.map((p) => ({
                  label: p.name,
                  value: p.id,
                }))}
              />
            </div>
            <button
              disabled={isLoading || !selectedProjectId}
              onClick={() => onAssign(member.id, selectedProjectId)}
              className="px-3 h-9 bg-primary text-black text-[8px] font-black uppercase rounded hover:bg-white transition-all active:scale-95 shrink-0 flex items-center justify-center min-w-[70px] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={12} />
              ) : (
                'ASSIGN'
              )}
            </button>
          </div>
        )}
      </div>
    );
  }
);

MemberAssignmentCard.displayName = 'MemberAssignmentCard';

export default MemberAssignmentCard;

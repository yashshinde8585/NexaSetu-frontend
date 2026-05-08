import React from 'react';
import MemberAssignmentCard from './MemberAssignmentCard';

const ReservePool = React.memo(({ 
  members, 
  allProjects, 
  memberAssignments, 
  onProjectChange, 
  onAssign, 
  actionLoading,
  canManage 
}) => {
  if (members.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4 px-1">
        <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">RESERVE POOL</h2>
        <div className="h-[1px] w-full bg-white/10" />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {members.map((m) => (
            <MemberAssignmentCard
              key={m.id}
              member={m}
              allProjects={allProjects}
              selectedProjectId={memberAssignments[m.id]}
              onProjectChange={onProjectChange}
              onAssign={onAssign}
              isLoading={actionLoading.assigningMember === m.id}
              canManage={canManage}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

ReservePool.displayName = 'ReservePool';

export default ReservePool;

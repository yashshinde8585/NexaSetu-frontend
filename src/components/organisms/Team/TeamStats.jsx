import React from 'react';
import { Layout, Users, Clock, Mail } from 'lucide-react';

const TeamStats = React.memo(
  ({ activeSectors, totalPersonnel, reservePool, pendingInvites }) => {
    const stats = [
      {
        label: 'ACTIVE SECTORS',
        value: activeSectors,
        icon: <Layout className="text-secondary" size={14} />,
      },
      {
        label: 'TOTAL PERSONNEL',
        value: totalPersonnel,
        icon: <Users size={14} className="text-primary" />,
      },
      {
        label: 'RESERVE POOL',
        value: reservePool,
        icon: <Clock size={14} className="text-status-warning" />,
      },
      {
        label: 'PENDING INVITES',
        value: pendingInvites,
        icon: <Mail size={14} className="text-status-info" />,
      },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3"
          >
            <div className="p-2 rounded bg-black border border-white/10">
              {stat.icon}
            </div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-white/30">
                {stat.label}
              </p>
              <p className="text-sm font-black text-white tracking-tight">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

TeamStats.displayName = 'TeamStats';

export default TeamStats;

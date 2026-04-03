import React from 'react';

// A minimalist dashboard component tracking top-level metrics for project quantity and global velocity.
const StrategicOverview = ({ projectCount, globalVelocity }) => {
  return (
    <div className="flex flex-col md:flex-row justify-end items-start md:items-end gap-6 border-b border-white/5 pb-10">
      {/* Subtitles removed for minimalist high-velocity aesthetic as requested */}

      <div className="flex gap-4 bg-background-light/50 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="px-6 py-4 text-center border-r border-white/5">
          <p className="text-[10px] text-text-muted uppercase font-bold mb-1">
            Portfolio Projects
          </p>
          <p className="text-2xl font-black text-white">{projectCount}</p>
        </div>
        <div className="px-6 py-4 text-center">
          <p className="text-[10px] text-text-muted uppercase font-bold mb-1">
            Global Velocity
          </p>
          <p className="text-2xl font-black text-status-success">
            {globalVelocity}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrategicOverview;

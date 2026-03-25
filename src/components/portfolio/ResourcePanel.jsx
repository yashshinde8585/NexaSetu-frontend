import React from 'react';

const ResourcePanel = ({ resources }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
         <span className="p-2 bg-secondary/20 rounded-lg text-secondary text-xl">👥</span>
         <h2 className="text-sm font-black uppercase tracking-[0.2em] text-secondary">Team Resource Intelligence</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map(user => (
          <div key={user._id} className="bg-background-light/40 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg font-bold border border-white/5">
                {user.name?.[0] || '?'}
              </div>
              <div className={`px-3 py-1 rounded text-[8px] font-black uppercase tracking-tighter border ${
                user.workloadStatus === 'Overloaded' ? 'bg-status-error/10 text-status-error border-status-error/20' :
                user.workloadStatus === 'Warning' ? 'bg-status-warning/10 text-status-warning border-status-warning/20' :
                'bg-status-success/10 text-status-success border-status-success/20'
              }`}>
                {user.workloadStatus}
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{user.name}</h3>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-4 truncate">{user.email}</p>

            <div className="flex items-center justify-between p-3 bg-black/20 rounded-2xl border border-white/5">
              <div className="text-center">
                <p className="text-[8px] text-text-muted uppercase font-bold">Active Tasks</p>
                <p className={`text-xl font-black ${user.activeTasksCount >= 6 ? 'text-status-error' : 'text-white'}`}>
                  {user.activeTasksCount}
                </p>
              </div>
              <div className="h-8 w-[1px] bg-white/5"></div>
              <div className="text-center">
                <p className="text-[8px] text-text-muted uppercase font-bold">Projects</p>
                <p className="text-xl font-black text-white">{user.projectsCount}</p>
              </div>
            </div>

            {user.workloadStatus === 'Overloaded' && (
              <div className="mt-4 flex items-center gap-2 text-status-error animate-pulse">
                <span className="text-xs">⚠️</span>
                <span className="text-[9px] font-black uppercase tracking-tighter">Capacity Exceeded</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcePanel;

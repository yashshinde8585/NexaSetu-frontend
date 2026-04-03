import React from 'react';

// A high-level overview panel that aggregates departmental capacity and health for strategic workforce management.
const ResourcePanel = ({ resources }) => {
  const departments = [
    {
      name: 'Backend Engineering',
      capacity: 115,
      health: 'Overloaded',
      status: 'CRITICAL',
      icon: '⚙️',
      color: 'text-status-error',
      bg: 'bg-status-error/10',
      border: 'border-status-error/20',
    },
    {
      name: 'Frontend & UIUX',
      capacity: 82,
      health: 'Optimal',
      status: 'HEALTHY',
      icon: '🎨',
      color: 'text-status-success',
      bg: 'bg-status-success/10',
      border: 'border-status-success/20',
    },
    {
      name: 'Product & Growth',
      capacity: 45,
      health: 'High Availability',
      status: 'UNDER-UTILIZED',
      icon: '🚀',
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
    },
    {
      name: 'Security & QA',
      capacity: 95,
      health: 'Optimal',
      status: 'HEALTHY',
      icon: '🔐',
      color: 'text-status-info',
      bg: 'bg-status-info/10',
      border: 'border-status-info/20',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-secondary/20 rounded-lg text-secondary text-xl shadow-lg shadow-secondary/10">
            📊
          </span>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-secondary">
            Aggregate Team Capacity
          </h2>
        </div>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
          Q3 Strategic Bandwidth: <span className="text-white">84.2%</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.name}
            className={`bg-[#1E1E2E]/60 backdrop-blur-xl border ${dept.border} rounded-[2rem] p-8 transition-all hover:scale-[1.02] hover:shadow-2xl duration-300 relative overflow-hidden group h-full flex flex-col`}
          >
            {/* Background Icon Watermark */}
            <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110">
              {dept.icon}
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 leading-tight pr-4">
                {dept.name}
              </div>
              <div
                className={`px-2 py-0.5 rounded text-[8px] font-black border whitespace-nowrap ${dept.bg} ${dept.color} ${dept.border}`}
              >
                {dept.status}
              </div>
            </div>

            <div className="flex items-end gap-2 mb-6">
              <span
                className={`text-5xl font-black tracking-tighter ${dept.color}`}
              >
                {dept.capacity}%
              </span>
              <span className="text-[10px] font-bold text-text-muted mb-2 uppercase tracking-widest">
                Cap.
              </span>
            </div>

            <div className="space-y-3 mt-auto">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter mb-1">
                <span className="text-text-muted/60">Utilization Status</span>
                <span className={dept.color}>{dept.health}</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${dept.color.replace('text', 'bg')}`}
                  style={{ width: `${Math.min(dept.capacity, 100)}%` }}
                ></div>
              </div>
            </div>

            {dept.capacity > 100 && (
              <div className="mt-8 p-4 bg-status-error/10 border border-status-error/20 rounded-2xl relative">
                <p className="text-[10px] text-status-error font-bold leading-tight uppercase tracking-tighter">
                  ⚡ Strategic Intervention Required: Capacity exceeds
                  engineering safety boundaries.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcePanel;

import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Zap, TrendingUp } from 'lucide-react';

const VelocityIndicator = ({ data, statsLoading }) => {
  const chartData = data?.map((val, i) => ({ value: val, index: i })) || [];
  
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-all group overflow-hidden relative">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
            Workflow Velocity
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-2xl font-black text-white ${statsLoading ? 'animate-pulse' : ''}`}>
              {data?.[data.length - 1] || 0} <span className="text-xs text-text-muted/60">tasks/day</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-status-success bg-status-success/10 px-1.5 py-0.5 rounded border border-status-success/10">
              <TrendingUp size={10} />
              +12%
            </div>
          </div>
        </div>
        <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 text-primary">
          <Zap size={16} />
        </div>
      </div>

      <div className="h-16 -mx-5 -mb-5 mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D63FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2D63FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2D63FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#velocityGradient)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Structural Decorator */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] -mr-16 -mt-16 pointer-events-none" />
    </div>
  );
};

export default VelocityIndicator;

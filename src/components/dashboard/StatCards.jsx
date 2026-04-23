import React from 'react';
import { Link } from 'react-router-dom';

// A grid of interactive cards for visualizing key performance indicators and workspace statistics.
const StatCards = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.02] h-[110px] animate-pulse">
            <div className="flex justify-between items-center mb-4">
              <div className="h-2 bg-white/10 rounded w-20" />
              <div className="h-5 w-5 bg-white/10 rounded" />
            </div>
            <div className="h-8 bg-white/10 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      id="kpi-cards"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
    >
      {stats.map((stat, i) => {
        const CardContent = (
          <div
            className={`p-5 sm:p-6 rounded-2xl border ${stat.color} shadow-lg transition-all h-full group glass hover:border-white/20 ${stat.to ? 'cursor-pointer hover:scale-[1.05] active:scale-[0.98]' : 'cursor-default'}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-60 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </span>
              <span className="opacity-40 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100">
                {stat.icon}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight">
                {stat.value}
              </div>
              {stat.trend && (
                <span
                  className={`text-[11px] font-black italic tracking-widest ${stat.trend.startsWith('+') ? 'text-status-success' : stat.trend.includes('Overall') ? 'opacity-40' : 'text-status-error'}`}
                >
                  {stat.trend}
                </span>
              )}
            </div>
          </div>
        );

        return stat.to ? (
          <Link key={i} to={stat.to} className="block no-underline">
            {CardContent}
          </Link>
        ) : (
          <div key={i}>{CardContent}</div>
        );
      })}
    </div>
  );
};

export default StatCards;

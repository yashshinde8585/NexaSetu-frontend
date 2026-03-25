import React from 'react';

const StatCards = ({ stats }) => {
  return (
    <div id="kpi-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className={`p-4 rounded-xl border ${stat.color} shadow-sm transition-all hover:scale-[1.02] cursor-default group`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{stat.label}</span>
            <span className="opacity-40">{stat.icon}</span>
          </div>
          <div className="text-2xl font-black">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;

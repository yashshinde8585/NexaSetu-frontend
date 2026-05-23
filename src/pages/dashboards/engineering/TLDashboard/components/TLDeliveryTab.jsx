import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

const TLDeliveryTab = ({ burndownData = [], teamVelocity = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-none">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">
          Sprint Burndown Schedule
        </span>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={burndownData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.03)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.2)"
                tick={{ fontSize: 8 }}
              />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#131622',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '10px',
                }}
              />
              <Line
                type="monotone"
                dataKey="ideal"
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="4 4"
                strokeWidth={1}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="remaining"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 p-4 rounded-none flex flex-col justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">
          Sprint Point Velocity
        </span>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamVelocity}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.03)"
                vertical={false}
              />
              <XAxis
                dataKey="sprint"
                stroke="rgba(255,255,255,0.2)"
                tick={{ fontSize: 8 }}
              />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#131622',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '10px',
                }}
              />
              <Bar dataKey="completed" fill="#10B981" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TLDeliveryTab);

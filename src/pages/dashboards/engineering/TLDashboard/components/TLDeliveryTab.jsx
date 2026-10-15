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
      <div className="bg-card border border-border-subtle p-4 rounded-none">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle block mb-4">
          Sprint Burndown Schedule
        </span>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={burndownData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-subtler)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="var(--color-border-subtle)"
                tick={{ fontSize: 8 }}
              />
              <YAxis
                stroke="var(--color-border-subtle)"
                tick={{ fontSize: 8 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '10px',
                }}
              />
              <Line
                type="monotone"
                dataKey="ideal"
                stroke="var(--color-border-subtle)"
                strokeDasharray="4 4"
                strokeWidth={1}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="remaining"
                stroke="var(--color-secondary)"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="var(--color-status-success)"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border-subtle p-4 rounded-none flex flex-col justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle block mb-4">
          Sprint Point Velocity
        </span>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={teamVelocity}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-subtler)"
                vertical={false}
              />
              <XAxis
                dataKey="sprint"
                stroke="var(--color-border-subtle)"
                tick={{ fontSize: 8 }}
              />
              <YAxis
                stroke="var(--color-border-subtle)"
                tick={{ fontSize: 8 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '10px',
                }}
              />
              <Bar
                dataKey="completed"
                fill="var(--color-status-success)"
                radius={0}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TLDeliveryTab);

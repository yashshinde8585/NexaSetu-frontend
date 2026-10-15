import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Users } from 'lucide-react';

const CapacityChart = React.memo(
  ({ data, title, description, user, iconColor = 'text-secondary' }) => (
    <div className="bg-background-light/10 border border-white/5 p-4 sm:p-6 md:p-8 rounded-2xl">
      <h3 className="text-sm font-black uppercase tracking-widest text-text-muted/60 mb-6 flex items-center gap-2">
        <Users size={14} className={iconColor} /> {title}
      </h3>
      <div className="h-[300px] w-full min-h-[300px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
        >
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
            />
            <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === user?.name ? '#10b981' : '#8b5cf6'}
                  fillOpacity={entry.name === user?.name ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[9px] text-text-muted/50 mt-4 text-center italic">
        {description}
      </p>
    </div>
  )
);

export default CapacityChart;

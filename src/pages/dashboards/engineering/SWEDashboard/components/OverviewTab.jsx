import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const OverviewTab = ({
  filteredInProgress = [],
  filteredInReview = [],
  filteredDone = [],
  burndownData = [],
  recentActivity = [],
  setActiveTab,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Card 1: My Work (Mini Board) */}
      <div className="lg:col-span-5 bg-card border border-border-subtle p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-border-subtle pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
            My Work
          </span>
          <button
            onClick={() => setActiveTab('My Work')}
            className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
          >
            View Board
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 flex-1 min-h-[300px]">
          {/* Column 1: In Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-wider text-text-subtle border-b border-border-subtle pb-1">
              <span>In Progress</span>
              <span className="px-1.5 py-0.5 bg-background-elevated text-[7px] font-black text-text-subtle">
                {filteredInProgress.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[320px] scrollbar-none pr-0.5">
              {filteredInProgress.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/task/${task.id}`)}
                  className="p-2 bg-card border border-border-subtle hover:border-primary/40 transition-all cursor-pointer group flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-primary group-hover:underline">
                      {task.taskKey}
                    </span>
                    <span className="text-[6px] font-black uppercase tracking-wider px-1 bg-background-elevated text-text-subtle">
                      {task.category}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-text leading-tight first-letter:uppercase group-hover:text-primary transition-colors">
                    {task.title}
                  </span>
                </div>
              ))}
              {filteredInProgress.length === 0 && (
                <div className="text-center py-6 text-[8px] text-text-subtler uppercase font-black tracking-widest italic">
                  No tasks in progress
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/my-tasks')}
              className="mt-auto text-[8px] font-black uppercase tracking-widest text-text-subtler hover:text-primary transition-colors flex items-center justify-center gap-1 py-1.5 border border-dashed border-border-subtle hover:border-primary/20 cursor-pointer bg-transparent"
            >
              <Plus size={10} /> Add Work Item
            </button>
          </div>

          {/* Column 2: In Review */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-wider text-status-warning border-b border-border-subtle pb-1">
              <span>In Review</span>
              <span className="px-1.5 py-0.5 bg-status-warning/10 text-[7px] font-black text-status-warning">
                {filteredInReview.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[320px] scrollbar-none pr-0.5">
              {filteredInReview.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/task/${task.id}`)}
                  className="p-2 bg-card border border-border-subtle hover:border-status-warning/30 transition-all cursor-pointer group flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-status-warning group-hover:underline">
                      {task.taskKey}
                    </span>
                    <span className="text-[6px] font-black uppercase tracking-wider px-1 bg-background-elevated text-text-subtle">
                      {task.category}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-text leading-tight first-letter:uppercase group-hover:text-status-warning transition-colors">
                    {task.title}
                  </span>
                </div>
              ))}
              {filteredInReview.length === 0 && (
                <div className="text-center py-6 text-[8px] text-text-subtler uppercase font-black tracking-widest italic">
                  No tasks in review
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Done */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-wider text-status-success border-b border-border-subtle pb-1">
              <span>Done</span>
              <span className="px-1.5 py-0.5 bg-status-success/10 text-[7px] font-black text-status-success">
                {filteredDone.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[320px] scrollbar-none pr-0.5">
              {filteredDone.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/task/${task.id}`)}
                  className="p-2 bg-card border border-border-subtle hover:border-status-success/30 transition-all cursor-pointer group flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold text-status-success group-hover:underline">
                      {task.taskKey}
                    </span>
                    <span className="text-[6px] font-black uppercase tracking-wider px-1 bg-background-elevated text-text-subtle">
                      {task.category}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-text leading-tight first-letter:uppercase line-through text-text-subtle group-hover:text-status-success transition-colors">
                    {task.title}
                  </span>
                </div>
              ))}
              {filteredDone.length === 0 && (
                <div className="text-center py-6 text-[8px] text-text-subtler uppercase font-black tracking-widest italic">
                  No completed tasks
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveTab('My Work')}
              className="mt-auto text-[8px] font-black uppercase tracking-widest text-text-subtler hover:text-status-success transition-colors flex items-center justify-center gap-1 py-1.5 border border-dashed border-border-subtle hover:border-status-success/20 cursor-pointer bg-transparent"
            >
              View Completed
            </button>
          </div>
        </div>
      </div>

      {/* Card 2: Sprint Burndown */}
      <div className="lg:col-span-4 bg-card border border-border-subtle p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-border-subtle pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
            Sprint Burndown
          </span>
          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-gray-400 border-dashed" />
              <span className="text-text-subtle">Ideal</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-secondary" />
              <span className="text-text">Remaining</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-status-success" />
              <span className="text-text">Completed</span>
            </div>
          </div>
        </div>
        <div className="w-full h-64 flex-1">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart
              data={burndownData || []}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
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
                strokeWidth={1.5}
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

      {/* Card 3: Recent Activity */}
      <div className="lg:col-span-3 bg-card border border-border-subtle p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-border-subtle pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
            Recent Activity
          </span>
          <button
            onClick={() => setActiveTab('Code')}
            className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
          >
            View All
          </button>
        </div>
        <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[300px] scrollbar-none pr-0.5">
          {recentActivity?.map((activity, idx) => (
            <div key={idx} className="flex gap-3 text-[10px] items-start group">
              <div className="mt-1 relative flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
              </div>
              <div className="flex flex-col gap-0.5 leading-tight">
                <span className="text-text font-bold group-hover:text-primary transition-colors">
                  {activity.title}
                </span>
                <span className="text-text-subtle text-[9px] truncate max-w-[200px]">
                  {activity.desc}
                </span>
              </div>
              <span className="ml-auto text-[8px] text-text-subtler font-black uppercase whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          ))}
          {(!recentActivity || recentActivity.length === 0) && (
            <div className="text-center py-12 text-[8px] text-text-subtler uppercase font-black tracking-widest italic">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(OverviewTab);

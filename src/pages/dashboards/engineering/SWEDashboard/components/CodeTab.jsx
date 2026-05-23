import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const CodeTab = ({
  myVelocity = { sparkline: [] },
  myCodeImpact = {
    commits: 0,
    linesChanged: 0,
    filesChanged: 0,
    prsMerged: 0,
    topFilesChanged: [],
  },
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#0A0C14] border border-white/5 p-6 flex flex-col gap-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">
          Velocity Trend
        </h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={myVelocity.sparkline || []}
              margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.03)"
                vertical={false}
              />
              <XAxis
                dataKey="sprint"
                stroke="rgba(255,255,255,0.2)"
                tick={{ fontSize: 9 }}
              />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0C14',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="val" fill="#3B82F6" radius={0} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#0A0C14] border border-white/5 p-6 flex flex-col gap-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">
          My Code Impact
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.01] border border-white/5">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/20">
              Commits
            </span>
            <span className="block text-2xl font-black text-white mt-1">
              {myCodeImpact.commits}
            </span>
          </div>
          <div className="p-4 bg-white/[0.01] border border-white/5">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/20">
              Lines Changed
            </span>
            <span className="block text-2xl font-black text-[#10B981] mt-1">
              +{myCodeImpact.linesChanged}
            </span>
          </div>
          <div className="p-4 bg-white/[0.01] border border-white/5">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/20">
              Files Changed
            </span>
            <span className="block text-2xl font-black text-white mt-1">
              {myCodeImpact.filesChanged}
            </span>
          </div>
          <div className="p-4 bg-white/[0.01] border border-white/5">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/20">
              PRs Merged
            </span>
            <span className="block text-2xl font-black text-[#10B981] mt-1">
              {myCodeImpact.prsMerged}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
            Impact Files
          </span>
          {myCodeImpact.topFilesChanged?.map((file, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[9px] font-bold text-white/60">
                <span className="truncate max-w-[80%] font-mono leading-none">
                  {file.name}
                </span>
                <span className="text-[#10B981] leading-none">
                  +{file.count}
                </span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                <div
                  className="bg-[#10B981] h-full"
                  style={{
                    width: `${(file.count / (myCodeImpact.topFilesChanged[0]?.count || file.count)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CodeTab);

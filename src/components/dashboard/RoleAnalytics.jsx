import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Layout, Zap, Bot } from 'lucide-react';
import CapacityChart from './CapacityChart';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// A comprehensive analytics component that visualizes team metrics based on the user's role.
const RoleAnalytics = ({
  user,
  projects = [],
  workload = [],
  aiImpact = null,
  selectedSprintId = null,
  sprints = [],
  isLoading = false,
}) => {
  const isLead =
    (user?.jobTitle || '').toUpperCase().includes('LEAD') ||
    user?.role === 'TECH_LEAD';
  const isAdmin =
    (user?.role === 'WORKSPACE_ADMIN' || user?.role === 'WORKSPACE_MANAGER') &&
    !isLead;

  const isProjectFiltered = projects.length === 1;
  const filteredProjectName = isProjectFiltered ? projects[0].name : '';

  const selectedSprint = sprints.find((s) => s._id === selectedSprintId);
  const isSprintFiltered = !!selectedSprint;
  const filteredSprintName = selectedSprint ? selectedSprint.name : '';

  const isFiltered = isProjectFiltered || isSprintFiltered;
  const contextName = filteredProjectName || filteredSprintName;

  // 1. Data Processing for Graphs
  const projectHealthData = React.useMemo(() => {
    const done = projects.filter((p) => p.percentage === 100).length;
    const atRisk = projects.filter(
      (p) => p.percentage < 50 && p.percentage > 0
    ).length;
    const onTrack = projects.length - done - atRisk;

    return [
      { name: 'Completed', value: done, color: '#10b981' },
      { name: 'At Risk', value: atRisk, color: '#f59e0b' },
      { name: 'On Track', value: Math.max(0, onTrack), color: '#3b82f6' },
    ];
  }, [projects]);

  const aiImpactData = React.useMemo(() => {
    if (!aiImpact) return [];
    return [
      { name: 'Agent (AI)', value: aiImpact.ai, color: '#8b5cf6' },
      { name: 'Manual', value: aiImpact.manual, color: '#475569' },
    ];
  }, [aiImpact]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
        <div className="h-[350px] bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
        <div className="h-[350px] bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // 2. Role-Based Rendering Logic
  if (isAdmin) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-8">
        {/* Workspace Health View */}
        <div className="bg-background-light/10 border border-white/5 p-4 sm:p-6 md:p-8 rounded-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-muted/60 mb-6 flex items-center gap-2">
            <Layout size={14} className="text-primary" />{' '}
            {isFiltered
              ? `${isSprintFiltered ? 'Cycle' : 'Project'} Health: ${contextName}`
              : 'Workspace Health Pulse'}
          </h3>
          <div className="h-[250px] w-full min-h-[250px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <PieChart>
                <Pie
                  data={projectHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {projectHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                  itemStyle={{
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {projectHealthData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted">
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Workload (REAL DATA) */}
        <CapacityChart
          data={workload}
          user={user}
          title={
            isFiltered
              ? isSprintFiltered
                ? 'Cycle Capacity Matrix'
                : 'Project Capacity Matrix'
              : 'Workspace Capacity Index'
          }
          description={
            isFiltered
              ? `Analysis of talent currently allocated to ${contextName}.`
              : 'Identifies who is currently carrying the heaviest mission load across the workspace.'
          }
          iconColor="text-secondary"
        />
      </div>
    );
  }

  if (isLead) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
        {/* AI Agent Impact (REAL DATA) */}
        <div className="bg-background-light/10 border border-white/5 p-6 rounded-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-muted/60 mb-6 flex items-center gap-2">
            <Bot size={14} className="text-secondary" /> AI Agent Adoption Index
          </h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <PieChart>
                <Pie
                  data={aiImpactData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {aiImpactData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 -mt-10">
            {aiImpactData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted">
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Added Capacity Index for Leads */}
        <CapacityChart
          data={workload}
          user={user}
          title="Team Capacity Matrix"
          description="Visualizes your team's current mission load and individual bandwidth."
          iconColor="text-primary"
        />
      </div>
    );
  }

  // DEFAULT/DEVELOPER VIEW (Mixed Data)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 2xl:gap-12">
      {/* Focus Tracker */}
      <div className="bg-background-light/10 border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Zap className="text-primary fill-primary/20" size={32} />
        </div>
        <h3 className="text-xl font-black text-white italic tracking-tighter">
          On Fire
        </h3>
        <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-2">
          Personal Execution Streak
        </p>
        <p className="text-[10px] text-text-muted/50 mt-4 px-10">
          You've cleared{' '}
          {projects.reduce((acc, p) => acc + (p.completedTasks || 0), 0)} tasks
          in this workspace. Keep pushing the velocity!
        </p>
      </div>

      {/* Added Capacity Index for Developers */}
      <CapacityChart
        data={workload}
        user={user}
        title="Peer Load Index"
        description="Shows how your current mission load compares with project peers."
        iconColor="text-status-warning"
      />
    </div>
  );
};

export default React.memo(RoleAnalytics);

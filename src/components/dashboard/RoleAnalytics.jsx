import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area
} from 'recharts';
import { Layout, UserCheck, TrendingUp, AlertTriangle, Zap, Bot, Users } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const RoleAnalytics = ({ user, projects = [], workload = [], aiImpact = null }) => {
  const isLead = (user?.jobTitle || '').toUpperCase().includes('LEAD') || user?.role === 'TECH_LEAD';
  const isAdmin = (user?.role === 'WORKSPACE_ADMIN' || user?.role === 'WORKSPACE_MANAGER') && !isLead;

  // 1. Data Processing for Graphs
  const projectHealthData = React.useMemo(() => {
    const done = projects.filter(p => p.percentage === 100).length;
    const atRisk = projects.filter(p => p.percentage < 50 && p.percentage > 0).length;
    const onTrack = projects.length - done - atRisk;

    return [
      { name: 'Completed', value: done, color: '#10b981' },
      { name: 'At Risk', value: atRisk, color: '#f59e0b' },
      { name: 'On Track', value: Math.max(0, onTrack), color: '#3b82f6' }
    ];
  }, [projects]);

  const aiImpactData = React.useMemo(() => {
    if (!aiImpact) return [];
    return [
      { name: 'Agent (AI)', value: aiImpact.ai, color: '#8b5cf6' },
      { name: 'Manual', value: aiImpact.manual, color: '#475569' }
    ];
  }, [aiImpact]);

  // 2. Role-Based Rendering Logic
  if (isAdmin) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Workspace Health View */}
        <div className="bg-background-light/10 border border-white/5 p-4 sm:p-6 md:p-8 rounded-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-muted/60 mb-6 flex items-center gap-2">
            <Layout size={14} className="text-primary" /> Workspace Health Pulse
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
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
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {projectHealthData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Workload (REAL DATA) */}
        <div className="bg-background-light/10 border border-white/5 p-4 sm:p-6 md:p-8 rounded-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-muted/60 mb-6 flex items-center gap-2">
            <Users size={14} className="text-secondary" /> Resource Capacity Index
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workload}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[9px] text-text-muted/50 mt-4 text-center italic">Identifies who is currently carrying the heaviest mission load.</p>
        </div>
      </div>
    );
  }

  if (isLead) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Agent Impact (REAL DATA) */}
        <div className="bg-background-light/10 border border-white/5 p-6 rounded-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-muted/60 mb-6 flex items-center gap-2">
            <Bot size={14} className="text-secondary" /> AI Agent Adoption Index
          </h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
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
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 -mt-10">
            {aiImpactData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Friction Index (REAL DATA) */}
        <div className="bg-background-light/10 border border-white/5 p-4 sm:p-6 md:p-8 rounded-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-muted/60 mb-6 flex items-center gap-2">
            <AlertTriangle size={14} className="text-status-warning" /> Project Friction Index
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projects.slice(0, 4).map(p => ({
                name: p.name.substring(0, 8) + '...',
                delayed: p.delayedTasks || 0
              }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="delayed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[9px] text-text-muted/50 mt-4 text-center italic">Tracks how many tasks in your missions are significantly delayed.</p>
        </div>
      </div>
    );
  }

  // DEFAULT/DEVELOPER VIEW (Mixed Data)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 2xl:gap-12">
        {/* Personal Agent Usage */}
        <div className="bg-background-light/10 border border-white/5 p-4 sm:p-6 md:p-8 rounded-2xl glass shadow-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-muted/60 mb-6 flex items-center gap-2">
            <Bot size={14} className="text-primary" /> My AI Agent Synergies
          </h3>
          <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[
                   { name: 'AI Assisted', tasks: aiImpact?.ai || 0 },
                   { name: 'Manual Craft', tasks: aiImpact?.manual || 0 }
               ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                  <Bar dataKey="tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

      {/* Focus Tracker */}
      <div className="bg-background-light/10 border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
           <Zap className="text-primary fill-primary/20" size={32} />
        </div>
        <h3 className="text-xl font-black text-white italic tracking-tighter">On Fire</h3>
        <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-2">Personal Execution Streak</p>
        <p className="text-[10px] text-text-muted/50 mt-4 px-10">You've cleared {projects.reduce((acc, p) => acc + (p.completedTasks || 0), 0)} tasks in this workspace. Keep pushing the velocity!</p>
      </div>
    </div>
  );
};

export default RoleAnalytics;

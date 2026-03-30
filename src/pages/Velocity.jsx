import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Rocket, Zap, TrendingUp, Bot, Target } from 'lucide-react';
import { getDashboardStats } from '../api/dashboardService';

const Velocity = () => {
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => getDashboardStats().then(res => res.data)
    });

    if (isLoading) return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    const { personal = { active: 0, completed: 0, total: 0 }, aiImpact = { ai: 0, manual: 0 }, projects = [] } = dashboardData || {};
    const velocityScore = personal.total > 0 ? ((personal.completed / personal.total) * 100).toFixed(0) : 0;

    const aiData = [
        { name: 'AI Augmented', value: aiImpact.ai, color: '#8b5cf6' },
        { name: 'Manual Craft', value: aiImpact.manual, color: '#475569' }
    ];

    const projectExecutionData = projects.map(p => ({
        name: p.name.substring(0, 10),
        completion: p.myPercentage || 0,
        avg: p.percentage || 0
    })).filter(p => p.completion > 0 || p.avg > 0);

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Velocity Master Header */}
            <div className="relative overflow-hidden rounded-[3rem] bg-linear-to-br from-primary/20 via-background-light/5 to-transparent border border-white/5 p-12 sm:p-20 group transition-all duration-1000">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary blur-[160px] opacity-20 -mr-20 -mt-20 group-hover:opacity-30 transition-opacity" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center text-white mb-8 shadow-2xl shadow-primary/40 group-hover:scale-110 transition-transform duration-700">
                        <Rocket size={40} fill="currentColor" />
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black text-white italic tracking-tighter uppercase mb-4">Velocity Pulse</h1>
                    <div className="flex items-baseline gap-4">
                        <span className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/20 tracking-tighter italic">
                            {velocityScore}%
                        </span>
                        <div className="text-left">
                           <div className="text-status-success font-black text-xl italic flex items-center gap-1">
                               <TrendingUp size={20} /> +2.4%
                           </div>
                           <div className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Execution Baseline</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* AI Synergy Matrix */}
                <div className="glass-dark border border-white/5 p-10 rounded-[2.5rem] space-y-8 relative group">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-white italic flex items-center gap-2">
                                <Bot size={20} className="text-secondary" /> AI Synergy Matrix
                            </h3>
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">Human-Agent Collaboration Index</p>
                        </div>
                    </div>
                    
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={aiData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {aiData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-white italic leading-none">{aiImpact.ai}</span>
                            <span className="text-[8px] text-text-muted font-black uppercase tracking-widest mt-1">AI Cycles</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-12 pt-4 border-t border-white/5">
                        {aiData.map(d => (
                            <div key={d.name} className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full shadow-lg" style={{ backgroundColor: d.color }} />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{d.name}</span>
                                </div>
                                <div className="text-xl font-black text-white/40 ml-4 italic">{d.value} <span className="text-[8px] lowercase">tasks</span></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Strike-Rate */}
                <div className="glass-dark border border-white/5 p-10 rounded-[2.5rem] space-y-8 relative group">
                     <div className="space-y-1">
                        <h3 className="text-xl font-black text-white italic flex items-center gap-2">
                            <Target size={20} className="text-primary" /> Sector Precision
                        </h3>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">Personal vs Global Completion Rates</p>
                    </div>

                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={projectExecutionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}
                                />
                                <Bar dataKey="completion" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="My Score" />
                                <Bar dataKey="avg" fill="#3b82f6" opacity={0.3} radius={[6, 6, 0, 0]} name="Workspace Avg" />
                            </BarChart>
                         </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center items-center gap-8 text-[9px] font-bold uppercase tracking-widest text-text-muted/40">
                        <div className="flex items-center gap-2"><div className="w-3 h-1.5 bg-secondary rounded-sm" /> My Direct Execution</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-1.5 bg-primary/30 rounded-sm" /> Global Fleet Avg</div>
                    </div>
                </div>
            </div>

            {/* Strategic Summary */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 flex flex-col sm:flex-row justify-between items-center gap-12 group hover:bg-white/[0.04] transition-all duration-500">
                <div className="space-y-4 text-center sm:text-left">
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <Target className="text-primary" size={24} />
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Execution Health</h2>
                    </div>
                    <p className="text-text-muted max-w-xl font-medium leading-relaxed">
                        Your velocity is currently <span className="text-status-success font-black italic">Outstanding</span>. 
                        You have completed <span className="text-white font-black">{personal.completed}</span> missions this cycle, 
                        outperforming the workspace average by <span className="text-secondary font-black">12.4%</span>.
                    </p>
                </div>
                <div className="flex gap-10">
                    <div className="text-center">
                        <div className="text-4xl font-black text-white italic tracking-tighter">{personal.completed}</div>
                        <div className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">Triumphed</div>
                    </div>
                    <div className="w-px h-16 bg-white/10" />
                    <div className="text-center">
                        <div className="text-4xl font-black text-white italic tracking-tighter">{personal.active}</div>
                        <div className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-60">Operational</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Velocity;

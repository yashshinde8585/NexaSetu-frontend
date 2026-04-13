import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Activity, 
  Cpu, 
  Network, 
  Database, 
  Package, 
  Bug, 
  GitBranch, 
  ShieldCheck,
  AlertTriangle,
  Clock,
  ExternalLink,
  GitPullRequest,
  CheckCircle2,
  XCircle,
  BarChart3,
  User as UserIcon,
  RefreshCcw,
  Zap,
  Box
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';

const nodeTypes = {
  service: ({ data }) => (
    <div className={`p-5 bg-black border-2 border-white/30 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)] min-w-[200px] group transition-all hover:border-primary ${data.status === 'failing' ? 'border-status-error/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : data.status === 'degraded' ? 'border-status-warning/60' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-primary !border-black !w-3 !h-3" />
      <div className="flex items-center gap-4 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-black border border-white/20 flex items-center justify-center ${data.status === 'failing' ? 'text-status-error' : 'text-primary'}`}>
          <Cpu size={18} />
        </div>
        <div className="min-w-0">
          <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none mb-1.5 truncate">{data.name}</h4>
          <span className="text-[9px] text-white/50 uppercase tracking-widest font-black">LATENCY: {data.latency}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
        <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded border ${
          data.status === 'healthy' ? 'border-status-success/30 text-status-success bg-status-success/5' : 
          data.status === 'degraded' ? 'border-status-warning/30 text-status-warning bg-status-warning/5' : 'border-status-error/30 text-status-error bg-status-error/5 animate-pulse'
        }`}>
          {data.status}
        </span>
        <span className="text-[10px] font-black text-white/60 font-mono italic">{data.errorRate} ERR/S</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary !border-black !w-3 !h-3" />
    </div>
  ),
};

const TLDashboard = () => {
  const { data, isLoading } = useRoleDashboard('tl');

  const { 
    systemHealth = { servicesHealthy: '0/0', criticalBlockers: 0, highRiskModules: 0, openBugs: 0, buildStability: '0%' }, 
    serviceMap = [], 
    blockers = [], 
    bugTracker = [], 
    buildHealth = { lastBuild: 'UNKNOWN', successRate: '0%', deployFrequency: '0/D', rollbackCount: 0 }, 
    codeActivity = { commitsToday: 0, prsOpen: 0, prsMerged: 0, stalePRs: 0 }, 
    technicalDebt = [] 
  } = data || {};

  const { nodes, edges } = useMemo(() => {
    if (!serviceMap || serviceMap.length === 0) return { nodes: [], edges: [] };

    const initialNodes = serviceMap.map((s, idx) => ({
      id: s.id || `node-${idx}`,
      type: 'service',
      position: { x: (idx % 3) * 350, y: Math.floor(idx / 3) * 250 },
      data: { ...s },
    }));

    const initialEdges = [];
    serviceMap.forEach(s => {
      if (s.dependencies) {
        s.dependencies.forEach(depId => {
          initialEdges.push({
            id: `e-${s.id}-${depId}`,
            source: s.id,
            target: depId,
            animated: true,
            style: { stroke: '#0ea5e9', strokeWidth: 3, opacity: 0.6 },
          });
        });
      }
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [serviceMap]);

  if (isLoading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
       <CenteredLoading />
       <span className="text-white/20 uppercase tracking-[0.5em] text-[10px] font-black animate-pulse">Initializing System Telemetry...</span>
    </div>
  );

  return (
    <div className="p-6 bg-black min-h-screen text-white flex flex-col gap-8 font-mono selection:bg-primary/30">
      
      {/* System Health Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <MetricStripItem label="System Integrity" value={systemHealth?.servicesHealthy} icon={<Network size={14} />} color="text-status-success" />
        <MetricStripItem label="Critical Blocks" value={systemHealth?.criticalBlockers} icon={<AlertTriangle size={14} />} color={systemHealth?.criticalBlockers > 0 ? 'text-status-error' : 'text-white/60'} />
        <MetricStripItem label="High-Risk Vectors" value={systemHealth?.highRiskModules} icon={<Cpu size={14} />} color="text-status-warning" />
        <MetricStripItem label="Open Bug Depth" value={systemHealth?.openBugs} icon={<Bug size={14} />} color="text-status-error" />
        <MetricStripItem label="Build Flow" value={systemHealth?.buildStability} icon={<Activity size={14} />} color="text-primary" className="col-span-2 md:col-span-1" />
      </div>

      <DashboardSection title="TACTICAL TOPOLOGY: SERVICE MESH" icon={<Database size={16} />}>
        <div className="w-full h-[350px] md:h-[500px] mt-6 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/30 bg-black relative shadow-2xl">
          {serviceMap?.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              className="bg-black"
            >
              <Background color="#111" gap={25} />
              <Controls className="!bg-black !border-white/30 !fill-white shadow-xl" />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.data.status === 'failing') return '#ef4444';
                  if (n.data.status === 'degraded') return '#f59e0b';
                  return '#22c55e';
                }}
                nodeColor="#000"
                maskColor="rgba(0, 0, 0, 0.9)"
                className="!bg-black !border-white/30"
              />
            </ReactFlow>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Network size={64} className="mb-6 text-white/10" />
              <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20 italic">Mesh inactive: No services detected in cluster</p>
            </div>
          )}
        </div>
      </DashboardSection>

      {/* Row 2: Blockers Panel | Bug Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <DashboardSection title="TECHNICAL DEPENDENCIES" icon={<Network size={16} />} className="h-full">
            <div className="space-y-4 mt-6">
              {blockers?.map((blocker, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-5 bg-black border border-white/20 rounded-2xl hover:border-primary transition-all group shadow-lg">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] font-black text-white uppercase tracking-tight truncate shrink-0">{blocker.title}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${
                       blocker.severity === 'urgent' ? 'border-status-error/40 text-status-error bg-status-error/5 animate-pulse' :
                       blocker.severity === 'high' ? 'border-status-warning/40 text-status-warning bg-status-warning/5' : 'border-primary/40 text-primary bg-primary/5'
                    }`}>
                      {blocker.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/50">
                    <span className="flex items-center gap-2 text-white/50"><RefreshCcw size={10} /> IMPACT: {blocker.impact}</span>
                    <span className="flex items-center gap-2 font-mono text-[9px] text-white/20"><Clock size={10} /> {blocker.since}</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-8">
          <DashboardSection title="CRITICAL BUG TELEMETRY" icon={<Bug size={16} />} className="h-full">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto mt-6 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-black border-b border-white/30 text-[10px] text-white/50 uppercase tracking-[0.4em] font-black">
                    <th className="py-6 px-8">Issue // Vector</th>
                    <th className="py-6 px-8">Severity</th>
                    <th className="py-6 px-8">Module</th>
                    <th className="py-6 px-8 text-right">Integrity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] font-black">
                  {bugTracker?.map((bug, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                      <td className="py-5 px-8 text-[11px] text-white group-hover:text-primary transition-colors truncate max-w-xs">{bug.issue}</td>
                      <td className="py-5 px-8">
                        <span className={`text-[9px] font-black px-3 py-1 rounded border uppercase tracking-widest ${
                          bug.severity === 'urgent' || bug.severity === 'high' ? 'border-status-error/40 text-status-error bg-status-error/5' : 'border-primary/40 text-primary bg-primary/5'
                        }`}>
                          {bug.severity}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-[10px] text-white/50 uppercase tracking-widest">{bug.module}</td>
                      <td className="py-5 px-8 text-right">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                          bug.status === 'in_progress' ? 'text-status-warning animate-pulse' : 'text-white/10'
                        }`}>
                          {bug.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 mt-6">
              {bugTracker?.map((bug, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/20 p-5 rounded-2xl group transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[11px] text-white font-black uppercase tracking-tight leading-relaxed group-hover:text-primary transition-colors pr-4">{bug.issue}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest shrink-0 ${
                      bug.severity === 'urgent' || bug.severity === 'high' ? 'border-status-error/40 text-status-error bg-status-error/5' : 'border-primary/40 text-primary bg-primary/5'
                    }`}>
                      {bug.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] uppercase font-black tracking-widest border-t border-white/5 pt-4 mt-2">
                    <span className="text-white/60">{bug.module}</span>
                    <span className={bug.status === 'in_progress' ? 'text-status-warning animate-pulse' : 'text-white/20'}>{bug.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>
      </div>

      {/* Row 3: Build Health | Code Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <DashboardSection title="PIPELINE INTEGRITY" icon={<Package size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6">
             <div className="p-5 md:p-6 bg-black border border-white/20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-between shadow-xl">
                <div>
                   <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] block mb-2">Build Status</span>
                   <span className={`text-base md:text-lg font-black uppercase flex items-center gap-2 md:gap-3 ${buildHealth?.lastBuild?.toLowerCase() === 'failing' ? 'text-status-error' : 'text-status-success'}`}>
                      {buildHealth?.lastBuild?.toLowerCase() === 'failing' ? <XCircle size={18} className="animate-pulse" /> : <CheckCircle2 size={18} />}
                      {buildHealth?.lastBuild}
                   </span>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] block mb-2">Confidence</span>
                   <span className="text-xl md:text-2xl font-black text-white">{buildHealth?.successRate}</span>
                </div>
             </div>
             <div className="p-5 md:p-6 bg-black border border-white/20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-between shadow-xl">
                <div>
                   <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] block mb-2">Frequency</span>
                   <span className="text-base md:text-lg font-black text-primary uppercase">{buildHealth?.deployFrequency}</span>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] block mb-2">Rollbacks</span>
                   <span className="text-xl md:text-2xl font-black text-status-warning">{buildHealth?.rollbackCount}</span>
                </div>
             </div>
          </div>
        </DashboardSection>

        <DashboardSection title="REPOSITORY TELEMETRY" icon={<GitBranch size={16} />}>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-4 md:p-5 bg-black border border-white/20 rounded-2xl flex flex-col gap-3 shadow-lg group hover:border-primary/50 transition-all">
                 <div className="flex items-center gap-2 md:gap-3">
                    <Activity size={12} className="text-white/20 group-hover:text-primary transition-colors" />
                    <span className="text-[8px] md:text-[9px] font-black text-white/50 uppercase tracking-widest truncate">Daily Commits</span>
                 </div>
                 <span className="text-xl md:text-2xl font-black text-white tracking-tighter">{codeActivity?.commitsToday}</span>
              </div>
              <div className="p-4 md:p-5 bg-black border border-white/20 rounded-2xl flex flex-col gap-3 shadow-lg group hover:border-primary/50 transition-all">
                 <div className="flex items-center gap-2 md:gap-3">
                    <GitPullRequest size={12} className="text-white/20 group-hover:text-primary transition-colors" />
                    <span className="text-[8px] md:text-[9px] font-black text-white/50 uppercase tracking-widest truncate">PR Delta</span>
                 </div>
                 <span className="text-xl md:text-2xl font-black text-white tracking-tighter">{codeActivity?.prsOpen}</span>
              </div>
              <div className="p-4 md:p-5 bg-black border border-white/20 rounded-2xl flex flex-col gap-3 shadow-lg group hover:border-primary/50 transition-all">
                 <div className="flex items-center gap-2 md:gap-3">
                    <CheckCircle2 size={12} className="text-white/20 group-hover:text-primary transition-colors" />
                    <span className="text-[8px] md:text-[9px] font-black text-white/50 uppercase tracking-widest truncate">Merged Items</span>
                 </div>
                 <span className="text-xl md:text-2xl font-black text-white tracking-tighter">{codeActivity?.prsMerged}</span>
              </div>
              <div className="p-4 md:p-5 bg-black border border-white/20 rounded-2xl flex flex-col gap-3 shadow-lg group hover:border-status-warning/50 transition-all">
                 <div className="flex items-center gap-2 md:gap-3">
                    <Clock size={12} className={codeActivity?.stalePRs > 5 ? 'text-status-warning animate-pulse' : 'text-white/20'} />
                    <span className="text-[8px] md:text-[9px] font-black text-white/50 uppercase tracking-widest truncate">Stale Depth</span>
                 </div>
                 <span className={`text-xl md:text-2xl font-black tracking-tighter ${codeActivity?.stalePRs > 5 ? 'text-status-warning' : 'text-white'}`}>{codeActivity?.stalePRs}</span>
              </div>
           </div>
        </DashboardSection>
      </div>

      {/* Row 4: Tech Debt | Ownership */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <DashboardSection title="TECHNICAL DEBT ANALYSIS" icon={<ShieldCheck size={16} />}>
             <div className="space-y-4 mt-6">
                {technicalDebt?.map((debt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-black border border-white/20 border-l-4 border-l-white/40 rounded-r-[2rem] shadow-xl hover:border-white/30 transition-all group">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{debt.module}</span>
                      <span className="text-[10px] text-white/50 font-black uppercase tracking-widest italic leading-tight">{debt.reason}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded border shadow-inner ${
                        debt.debtLevel === 'High' ? 'text-status-error border-status-error/30 bg-status-error/5' : 'text-status-warning border-status-warning/30 bg-status-warning/5'
                      }`}>
                         {debt.debtLevel} DEBT
                      </span>
                      <BarChart3 size={18} className="text-white/10 group-hover:text-white/50 transition-colors" />
                    </div>
                  </div>
                ))}
             </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-4">
          <DashboardSection title="CLUSTER OWNERSHIP" icon={<UserIcon size={16} />}>
             <div className="space-y-4 mt-6">
                {serviceMap?.slice(0, 5).map((s, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-black rounded-2xl border border-white/20 hover:border-primary transition-all group shadow-lg">
                     <div className="w-10 h-10 rounded-xl bg-black border border-primary/40 flex items-center justify-center text-[11px] font-black text-primary shadow-[0_4px_12px_rgba(var(--color-primary),0.2)] group-hover:bg-primary group-hover:text-black transition-all">
                        {s.owner[0]?.toUpperCase()}
                     </div>
                     <div className="min-w-0">
                        <span className="block text-[9px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">{s.name}</span>
                        <span className="block text-[12px] font-black text-white uppercase tracking-tight truncate">{s.owner}</span>
                     </div>
                  </div>
                ))}
             </div>
          </DashboardSection>
        </div>
      </div>
    </div>
  );
};



export default TLDashboard;

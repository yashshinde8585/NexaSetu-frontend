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
    <div className={`p-4 bg-[#0A0B14] border border-white/10 rounded-2xl shadow-2xl min-w-[180px] group ${data.status === 'failing' ? 'ring-2 ring-rose-500/50' : data.status === 'degraded' ? 'ring-2 ring-amber-500/50' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${data.status === 'failing' ? 'text-rose-500' : 'text-primary'}`}>
          <Cpu size={14} />
        </div>
        <div>
          <h4 className="text-[11px] font-black text-white/90 uppercase tracking-widest leading-none mb-1">{data.name}</h4>
          <span className="text-[8px] text-text-muted uppercase tracking-wider">{data.latency}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
          data.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-500' : 
          data.status === 'degraded' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
        }`}>
          {data.status}
        </span>
        <span className="text-[9px] font-bold text-white/40">{data.errorRate}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  ),
};

const TLDashboard = () => {
  const { data, isLoading } = useRoleDashboard('tl');

  const { 
    systemHealth, 
    serviceMap, 
    blockers, 
    bugTracker, 
    buildHealth, 
    codeActivity, 
    technicalDebt 
  } = data || {};

  const { nodes, edges } = useMemo(() => {
    if (!serviceMap) return { nodes: [], edges: [] };

    const initialNodes = serviceMap.map((s, idx) => ({
      id: s.id || `node-${idx}`,
      type: 'service',
      position: { x: (idx % 3) * 300, y: Math.floor(idx / 3) * 200 },
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
            style: { stroke: '#6366f1', strokeWidth: 2 },
          });
        });
      }
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [serviceMap]);

  if (isLoading) return <CenteredLoading />;

  return (
    <div className="p-6 bg-[#050505] min-h-screen text-text-main flex flex-col gap-6 font-sans">
      
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricStripItem label="Services Healthy" value={systemHealth?.servicesHealthy} icon={<Network size={18} />} color="text-emerald-500" />
        <MetricStripItem label="Critical Blockers" value={systemHealth?.criticalBlockers} icon={<AlertTriangle size={18} />} color={systemHealth?.criticalBlockers > 0 ? 'text-rose-500' : 'text-white/40'} />
        <MetricStripItem label="High-Risk Modules" value={systemHealth?.highRiskModules} icon={<Cpu size={18} />} color="text-amber-500" />
        <MetricStripItem label="Open Bugs" value={systemHealth?.openBugs} icon={<Bug size={18} />} color="text-rose-400" />
        <MetricStripItem label="Build Stability" value={systemHealth?.buildStability} icon={<Activity size={18} />} color="text-primary" />
      </div>

      <DashboardSection title="Service Map" icon={<Database size={16} />} className="min-h-[500px]">
        <div className="w-full h-[450px] mt-4 rounded-3xl overflow-hidden border border-white/5 bg-black/40 relative">
          {serviceMap?.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              className="bg-dot-pattern"
            >
              <Background color="#333" gap={20} />
              <Controls className="!bg-[#0A0B14] !border-white/10 !fill-white" />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.data.status === 'failing') return '#f43f5e';
                  if (n.data.status === 'degraded') return '#f59e0b';
                  return '#10b981';
                }}
                nodeColor="#1a1a1a"
                maskColor="rgba(0, 0, 0, 0.7)"
                className="!bg-[#0A0B14] !border-white/10"
              />
            </ReactFlow>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted">
              <Network size={40} className="mb-4 opacity-10" />
              <p className="text-xs uppercase tracking-widest font-bold">No services tracked</p>
            </div>
          )}
        </div>
      </DashboardSection>

      {/* Row 2: Blockers Panel | Bug Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <DashboardSection title="Technical Dependencies" icon={<Network size={16} />} className="h-full">
            <div className="space-y-4 mt-4">
              {blockers?.map((blocker, idx) => (
                <div key={idx} className="flex flex-col gap-1 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-tight truncate max-w-[70%]">{blocker.title}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                       blocker.severity === 'urgent' ? 'bg-rose-500/20 text-rose-500' :
                       blocker.severity === 'high' ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/20 text-primary'
                    }`}>
                      {blocker.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-text-muted">
                    <span className="flex items-center gap-1"><RefreshCcw size={10} /> Impact: {blocker.impact}</span>
                    <span className="flex items-center gap-1 font-mono text-[9px]"><Clock size={10} /> {blocker.since}</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-8">
          <DashboardSection title="Bug Tracker" icon={<Bug size={16} />} className="h-full">
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-text-muted uppercase tracking-widest font-black">
                    <th className="pb-3 px-4">Issue</th>
                    <th className="pb-3 px-4">Severity</th>
                    <th className="pb-3 px-4">Module</th>
                    <th className="pb-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {bugTracker?.map((bug, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-3 px-4 text-xs font-semibold text-white/80 group-hover:text-white truncate max-w-xs">{bug.issue}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          bug.severity === 'urgent' || bug.severity === 'high' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-primary/10 text-primary border border-primary/20'
                        }`}>
                          {bug.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[10px] text-text-muted uppercase tracking-tighter">{bug.module}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          bug.status === 'in_progress' ? 'text-amber-500' : 'text-text-muted/60'
                        }`}>
                          {bug.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>
        </div>
      </div>

      {/* Row 3: Build Health | Code Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardSection title="Build Health" icon={<Package size={16} />}>
          <div className="grid grid-cols-2 gap-4 mt-4">
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                   <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Status</span>
                   <span className={`text-sm font-black uppercase flex items-center gap-2 ${buildHealth?.lastBuild === 'failing' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {buildHealth?.lastBuild === 'failing' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                      {buildHealth?.lastBuild}
                   </span>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Success Rate</span>
                   <span className="text-lg font-bold text-white">{buildHealth?.successRate}</span>
                </div>
             </div>
             <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                   <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Deploy Freq</span>
                   <span className="text-sm font-black text-primary uppercase">{buildHealth?.deployFrequency}</span>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Rollbacks</span>
                   <span className="text-lg font-bold text-amber-500">{buildHealth?.rollbackCount}</span>
                </div>
             </div>
          </div>
        </DashboardSection>

        <DashboardSection title="Code Activity" icon={<GitBranch size={16} />}>
           <div className="grid grid-cols-4 gap-3 mt-4">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <Activity size={12} className="text-text-muted/40" />
                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider truncate">Commits Today</span>
                 </div>
                 <span className="text-xl font-black text-white">{codeActivity?.commitsToday}</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <GitPullRequest size={12} className="text-text-muted/40" />
                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider truncate">PRs Open</span>
                 </div>
                 <span className="text-xl font-black text-white">{codeActivity?.prsOpen}</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-text-muted/40" />
                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider truncate">PRs Merged</span>
                 </div>
                 <span className="text-xl font-black text-white">{codeActivity?.prsMerged}</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <Clock size={12} className={codeActivity?.stalePRs > 5 ? 'text-amber-500' : 'text-text-muted/40'} />
                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider truncate">Stale PRs</span>
                 </div>
                 <span className={`text-xl font-black ${codeActivity?.stalePRs > 5 ? 'text-amber-500 animate-pulse' : 'text-white'}`}>{codeActivity?.stalePRs}</span>
              </div>
           </div>
        </DashboardSection>
      </div>

      {/* Row 4: Tech Debt | Ownership */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <DashboardSection title="Technical Debt" icon={<ShieldCheck size={16} />}>
             <div className="space-y-3 mt-4">
                {technicalDebt?.map((debt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-gradient-to-r from-white/[0.03] to-transparent border-l-2 border-white/10 rounded-r-xl">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white truncate">{debt.module}</span>
                      <span className="text-[10px] text-text-muted italic">{debt.reason}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${
                        debt.debtLevel === 'High' ? 'text-rose-500 bg-rose-500/10' : 'text-amber-500 bg-amber-500/10'
                      }`}>
                         {debt.debtLevel} Debt
                      </span>
                      <BarChart3 size={14} className="text-text-muted/30" />
                    </div>
                  </div>
                ))}
             </div>
          </DashboardSection>
        </div>

        <div className="lg:col-span-4">
          <DashboardSection title="Module Ownership" icon={<UserIcon size={16} />}>
             <div className="space-y-3 mt-4">
                {serviceMap?.slice(0, 5).map((s, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 bg-white/[0.02] rounded-xl border border-white/5">
                     <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {s.owner[0]?.toUpperCase()}
                     </div>
                     <div className="min-w-0">
                        <span className="block text-[8px] font-bold text-text-muted uppercase tracking-widest">{s.name}</span>
                        <span className="block text-[10px] font-bold text-white/80">{s.owner}</span>
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

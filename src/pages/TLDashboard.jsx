import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, Controls, MiniMap, Handle, Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Activity, Cpu, Network, Database, Package, Bug, 
  GitBranch, ShieldCheck, AlertTriangle, Clock, 
  ExternalLink, GitPullRequest, CheckCircle2, XCircle, 
  BarChart3, User as UserIcon, RefreshCcw, Zap, Box,
  Target, Layers, ShieldAlert, Terminal
} from 'lucide-react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import StatusBadge from '../components/molecules/dashboard/StatusBadge';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';

/**
 * Tech Lead (TL) Node Styling
 */
const nodeTypes = {
  service: ({ data }) => (
    <div className={`p-5 bg-black border border-white/20 rounded shadow-2xl min-w-[220px] transition-all hover:border-primary group ${
      data.status === 'failing' ? 'border-status-error animate-pulse' : 
      data.status === 'degraded' ? 'border-status-warning' : 'border-white/10'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-primary !border-black !w-2 !h-2" />
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-10 h-10 rounded border flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-black ${
          data.status === 'failing' ? 'border-status-error text-status-error' : 
          data.status === 'degraded' ? 'border-status-warning text-status-warning' : 'border-white/20 text-white/40'
        }`}>
          <Terminal size={18} />
        </div>
        <div className="flex flex-col gap-1 pr-2">
          <h4 className="text-[11px] font-bold text-white uppercase tracking-tight leading-none truncate">{data.name}</h4>
          <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold">LATENCY: {data.latency}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <StatusBadge status={data.status} text={data.status} mini />
        <span className="text-[10px] font-bold text-white/40 tabular-nums">{data.errorRate} ERR/S</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary !border-black !w-2 !h-2" />
    </div>
  ),
};

/**
 * Tech Lead (TL) Dashboard
 * Strategic overview of system architecture, build stability, and technical debt.
 */
const TLDashboard = () => {
  const { data, isLoading } = useRoleDashboard('tl');

  if (isLoading) return <CenteredLoading />;

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
            style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 },
          });
        });
      }
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [serviceMap]);

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12 font-mono selection:bg-primary max-w-[1600px] mx-auto flex flex-col gap-12">
      
      {/* 1. Global Infrastructure Strip */}
      <div id="tl-metrics-strip" className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <MetricStripItem 
            label="Service Integrity" 
            value={systemHealth.servicesHealthy} 
            icon={<Network size={14} />} 
            accent="bg-status-success" 
        />
        <MetricStripItem 
            label="Critical Blockades" 
            value={systemHealth.criticalBlockers} 
            icon={<ShieldAlert size={14} />} 
            color={systemHealth.criticalBlockers > 0 ? "text-status-error" : "text-white/40"} 
            accent={systemHealth.criticalBlockers > 0 ? "bg-status-error" : "bg-white/5"}
        />
        <MetricStripItem 
            label="High Risk Vectors" 
            value={systemHealth.highRiskModules} 
            icon={<Layers size={14} />} 
            color="text-status-warning" 
            accent="bg-status-warning"
        />
        <MetricStripItem 
            label="System Defects" 
            value={systemHealth.openBugs} 
            icon={<Bug size={14} />} 
            color="text-status-error" 
            accent="bg-status-error"
        />
        <MetricStripItem 
            label="Build Stability" 
            value={systemHealth.buildStability} 
            icon={<Activity size={14} />} 
            accent="bg-primary"
        />
      </div>

      {/* 2. System Architecture Visualization */}
      <DashboardSection title="Core Infrastructure Map" icon={<Database size={14} />}>
        <div className="w-full h-[450px] mt-2 rounded border border-white/5 bg-black relative overflow-hidden group">
          {serviceMap?.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              className="bg-black"
            >
              <Background color="#111" gap={32} size={1} />
              <Controls className="react-flow__controls-tl" />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.data.status === 'failing') return '#f43f5e';
                  if (n.data.status === 'degraded') return '#f59e0b';
                  return '#10b981';
                }}
                nodeColor="#000"
                maskColor="rgba(0, 0, 0, 0.9)"
                className="!bg-black !rounded !border-white/10"
              />
            </ReactFlow>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Network size={48} className="text-white/5" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/20 italic">Zero node configuration state.</span>
            </div>
          )}
        </div>
      </DashboardSection>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 3. Operational Risk Panels */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <DashboardSection title="Strategic Blockades" icon={<ShieldAlert size={14} />}>
            <div className="flex flex-col gap-3 py-2">
              {blockers?.map((blocker, idx) => (
                <div key={idx} className="p-5 bg-white/[0.01] border border-white/5 rounded group hover:border-primary/40 transition-all">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-[12px] font-bold text-white uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{blocker.title}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border leading-none ${
                       blocker.severity === 'urgent' ? 'border-status-error/40 text-status-error bg-status-error/5' : 
                       'border-status-warning/40 text-status-warning bg-status-warning/5'
                    }`}>
                      {blocker.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-widest text-white/20">
                    <span className="flex items-center gap-2"><RefreshCcw size={10} /> IMPACT: {blocker.impact}</span>
                    <span className="flex items-center gap-2 font-bold tabular-nums"><Clock size={10} /> {blocker.since}</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>

          <DashboardSection title="Node Authority" icon={<UserIcon size={14} />}>
             <div className="flex flex-col gap-3 py-2">
                {serviceMap?.slice(0, 5).map((s, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white/[0.01] border border-white/5 rounded group hover:border-primary/20 transition-all">
                     <div className="w-10 h-10 rounded border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/20 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all uppercase">
                        {s.owner[0]}
                     </div>
                     <div className="flex flex-col gap-1 truncate pr-2">
                        <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest leading-none">OWNER: {s.name}</span>
                        <span className="text-[11px] font-bold text-white uppercase tracking-tight truncate leading-none">{s.owner}</span>
                     </div>
                  </div>
                ))}
             </div>
          </DashboardSection>
        </div>

        {/* 4. Quality & Execution Board */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <DashboardSection title="Structural Defect Tracker" icon={<Bug size={14} />}>
            <div className="overflow-x-auto py-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-white/30 uppercase font-bold tracking-widest border-b border-white/5">
                    <th className="pb-4 px-2">Defect Vector</th>
                    <th className="pb-4 px-2">Severity</th>
                    <th className="pb-4 px-2">Domain</th>
                    <th className="pb-4 px-2 text-right">Lifecycle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {bugTracker?.map((bug, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.015] transition-all">
                      <td className="py-4 px-2 text-[12px] font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors pr-8">{bug.issue}</td>
                      <td className="py-4 px-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest leading-none ${
                          bug.severity === 'urgent' || bug.severity === 'high' ? 'border-status-error/40 text-status-error bg-status-error/5' : 'border-white/10 text-white/40'
                        }`}>
                          {bug.severity}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">{bug.module}</td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <StatusBadge status={bug.status === 'in_progress' ? 'warning' : 'info'} text={bug.status} mini />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <DashboardSection title="Deployment Pipeline" icon={<Package size={14} />}>
               <div className="flex flex-col gap-px bg-white/5 border border-white/5 rounded overflow-hidden mt-2">
                  <div className="bg-black p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-all border-b border-white/5">
                     <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Last Vector Build</span>
                        <div className={`flex items-center gap-3 text-[12px] font-bold uppercase tracking-tight ${buildHealth.lastBuild?.toLowerCase() === 'failing' ? 'text-status-error' : 'text-status-success'}`}>
                           {buildHealth.lastBuild === 'FAILING' ? <XCircle size={14} className="animate-pulse" /> : <ShieldCheck size={14} />}
                           {buildHealth.lastBuild}
                        </div>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Yield</span>
                        <span className="text-xl font-bold text-white tracking-tighter tabular-nums leading-none">{buildHealth.successRate}</span>
                     </div>
                  </div>
                  <div className="bg-black p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                     <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Deploy Cadence</span>
                        <span className="text-[12px] font-bold text-primary uppercase tracking-tight leading-none">{buildHealth.deployFrequency}</span>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Rollbacks</span>
                        <span className="text-xl font-bold text-status-warning tracking-tighter tabular-nums leading-none">{buildHealth.rollbackCount}</span>
                     </div>
                  </div>
               </div>
            </DashboardSection>

            <DashboardSection title="Core Synergy" icon={<Activity size={14} />}>
               <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 rounded overflow-hidden mt-2">
                  <div className="bg-black p-5 flex flex-col gap-4 group hover:bg-white/[0.01] transition-all border-r border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Activity size={12} className="text-white/20 group-hover:text-primary transition-colors" />
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest truncate">COMMITS</span>
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter tabular-nums leading-none">{codeActivity.commitsToday}</span>
                  </div>
                  <div className="bg-black p-5 flex flex-col gap-4 group hover:bg-white/[0.01] transition-all border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <GitPullRequest size={12} className="text-white/20 group-hover:text-primary transition-colors" />
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest truncate">OPEN PR</span>
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter tabular-nums leading-none">{codeActivity.prsOpen}</span>
                  </div>
                  <div className="bg-black p-5 flex flex-col gap-4 group hover:bg-white/[0.01] transition-all border-r border-white/5">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-white/20 group-hover:text-status-success transition-colors" />
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest truncate">MERGED</span>
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter tabular-nums leading-none">{codeActivity.prsMerged}</span>
                  </div>
                  <div className="bg-black p-5 flex flex-col gap-4 group hover:bg-white/[0.01] transition-all">
                    <div className="flex items-center gap-2">
                        <Clock size={12} className={codeActivity.stalePRs > 5 ? 'text-status-warning animate-pulse' : 'text-white/20'} />
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest truncate">STALE</span>
                    </div>
                    <span className={`text-2xl font-black tracking-tighter tabular-nums leading-none ${codeActivity.stalePRs > 5 ? 'text-status-warning' : 'text-white'}`}>{codeActivity.stalePRs}</span>
                  </div>
               </div>
            </DashboardSection>
          </div>
        </div>
      </div>

      {/* 5. Structural Integrity Assessment */}
      <DashboardSection title="Structural Technical Debt" icon={<ShieldCheck size={14} />}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
            {technicalDebt?.map((debt, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/5 border-l-2 border-l-white/20 rounded-r group hover:border-white/20 transition-all">
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-none">{debt.module} Vector</span>
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest italic leading-none">{debt.reason}</span>
                </div>
                <div className="flex items-center gap-8">
                  <div className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest leading-none ${
                    debt.debtLevel === 'High' ? 'text-status-error border-status-error/30 bg-status-error/5' : 'text-status-warning border-status-warning/30 bg-status-warning/5'
                  }`}>
                     {debt.debtLevel} INTENSITY
                  </div>
                  <BarChart3 size={16} className="text-white/10 group-hover:text-white/40 transition-colors" />
                </div>
              </div>
            ))}
         </div>
      </DashboardSection>
    </div>
  );
};


export default TLDashboard;

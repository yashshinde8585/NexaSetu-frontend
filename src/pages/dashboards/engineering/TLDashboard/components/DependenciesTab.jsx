import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import { Database, Network } from 'lucide-react';
import DashboardSection from '../../../../../components/molecules/dashboard/DashboardSection';
import ServiceNode from './ServiceNode';

const nodeTypes = {
  service: ServiceNode,
};

const DependenciesTab = ({
  nodes = [],
  edges = [],
  serviceMap = [],
  handleNodeClick,
}) => {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <DashboardSection
        title="Core Infrastructure Map"
        icon={<Database size={14} />}
      >
        <div className="w-full h-[500px] mt-2 rounded-none border border-white/5 bg-black relative overflow-hidden group">
          {serviceMap?.length > 0 ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodeClick={handleNodeClick}
              fitView
              className="bg-black"
            >
              <Background color="#111" gap={32} size={1} />
              <Controls className="react-flow__controls-tl" />
              <MiniMap
                nodeStrokeColor={(n) => {
                  if (n.data?.status === 'failing') return '#EF4444';
                  if (n.data?.status === 'degraded') return '#F59E0B';
                  return '#10B981';
                }}
                nodeColor="#000"
                maskColor="rgba(0, 0, 0, 0.9)"
                className="!bg-black !rounded-none !border-white/10"
              />
            </ReactFlow>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Network size={32} className="text-white/5" />
              <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20 italic">
                ZERO_NODE_CONFIG_STATE
              </span>
            </div>
          )}
        </div>
      </DashboardSection>
    </div>
  );
};

export default DependenciesTab;

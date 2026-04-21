import React, { useCallback, useEffect } from 'react';
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Background, 
  Controls, 
  MiniMap 
} from 'reactflow';
import 'reactflow/dist/style.css';
import strategicService from '../../api/strategicService';

const nodeTypes = {}; // We can add custom node types for Intents/Stories later

const StrategicGraph = ({ projectId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const res = await strategicService.getGraph(projectId);
        const { nodes: backendNodes, edges: backendEdges } = res.data;

        // Auto-layout placeholder (simple grid if no position provided)
        const formattedNodes = backendNodes.map((node, index) => ({
          ...node,
          position: { x: (index % 5) * 250, y: Math.floor(index / 5) * 150 },
          className: `${node.data.type === 'intent' ? 'bg-[#6366f1]' : 'bg-[#1e293b]'} text-[#fff] rounded-[8px] p-[10px] w-[200px] border border-[#475569]`
        }));

        setNodes(formattedNodes);
        setEdges(backendEdges);
      } catch (err) {
        console.error('Failed to load graph:', err);
      }
    };

    if (projectId) loadGraph();
  }, [projectId, setNodes, setEdges]);

  return (
    <div className="h-[600px] w-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-slate-800/80 p-2 rounded text-xs text-slate-400 border border-slate-700">
        Strategic Dependency Graph
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#334155" gap={20} />
        <Controls />
        <MiniMap 
            nodeColor={(n) => n.data.type === 'intent' ? '#6366f1' : '#334155'}
            maskColor="rgba(15, 23, 42, 0.6)"
            style={{ backgroundColor: '#1e293b' }}
         />
      </ReactFlow>
    </div>
  );
};

export default StrategicGraph;

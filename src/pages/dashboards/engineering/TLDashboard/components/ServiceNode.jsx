import React from 'react';
import { Handle, Position } from 'reactflow';
import { Terminal } from 'lucide-react';
import StatusBadge from '../../../../../components/molecules/dashboard/StatusBadge';

const ServiceNode = ({ data }) => {
  return (
    <div
      className={`p-4 bg-card border border-border rounded-none shadow-none min-w-[200px] transition-colors hover:border-primary group ${
        data.status === 'failing'
          ? 'border-status-error animate-pulse'
          : data.status === 'degraded'
            ? 'border-status-warning'
            : 'border-border-subtle'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !border-black !w-2 !h-2 !rounded-none"
      />
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-8 h-8 rounded-none border flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-black ${
            data.status === 'failing'
              ? 'border-status-error text-status-error'
              : data.status === 'degraded'
                ? 'border-status-warning text-status-warning'
                : 'border-border text-text-subtle'
          }`}
        >
          <Terminal size={14} />
        </div>
        <div className="flex flex-col gap-1 pr-2 truncate">
          <h4 className="text-[9px] font-black text-text uppercase tracking-widest truncate leading-none">
            {data.name}
          </h4>
          <span className="text-[7px] text-text-subtler uppercase tracking-[0.2em] font-black">
            LATENCY: {data.latency}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
        <StatusBadge status={data.status} />
        <span className="text-[8px] font-black text-text-subtle tracking-widest uppercase">
          {data.errorRate} ERR/S
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !border-black !w-2 !h-2 !rounded-none"
      />
    </div>
  );
};

export default ServiceNode;

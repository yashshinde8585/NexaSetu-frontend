import React from 'react';
import {
  X,
  Activity,
  Clock,
  ShieldCheck,
  Terminal,
  User,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

// Detailed service panel component.
const ServiceDetailPanel = ({ isOpen, onClose, service }) => {
  if (!service) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 z-[100] w-full max-w-md bg-black border-l border-white/10 shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#0A0A0A] flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Terminal size={18} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                  {service.name}
                </h2>
                <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black mt-1">
                  Infrastructure Node
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/20 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                Current_Status
              </span>
              <StatusBadge status={service.status} />
            </div>
            <div className="p-4 bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                Error_Rate
              </span>
              <span className="text-xl font-black text-white tracking-widest">
                {service.errorRate}%
              </span>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                Latency_Vector
              </span>
              <span className="text-xl font-black text-white tracking-widest">
                {service.latency}
              </span>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                Ownership
              </span>
              <div className="flex items-center gap-2 mt-1">
                <User size={12} className="text-primary" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest truncate">
                  {service.owner}
                </span>
              </div>
            </div>
          </div>

          {/* Health History */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-primary" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                Recent_Health_History
              </h3>
            </div>
            <div className="space-y-2">
              {service.healthHistory?.length > 0 ? (
                service.healthHistory.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">
                        {log.event.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[8px] text-white/20 font-black uppercase tracking-[0.2em]">
                        {log.time}
                      </span>
                    </div>
                    <div
                      className={`w-1.5 h-1.5 ${
                        log.status === 'healthy'
                          ? 'bg-status-success shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                          : log.status === 'degraded'
                            ? 'bg-status-warning shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                            : 'bg-status-error shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                      }`}
                    />
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border border-dashed border-white/5">
                  <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em]">
                    NO_LOG_HISTORY_IDENTIFIED
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dependencies */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-primary" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                Topology_Dependencies
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {service.dependencies?.length > 0 ? (
                service.dependencies.map((dep, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-[9px] font-black text-white/60 uppercase tracking-widest"
                  >
                    {dep}
                  </div>
                ))
              ) : (
                <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em]">
                  STANDALONE_VECTOR
                </span>
              )}
            </div>
          </div>

          {/* Security & Compliance */}
          <div className="p-4 bg-status-success/5 border border-status-success/20 space-y-2">
            <div className="flex items-center gap-2 text-status-success">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Security_Certified
              </span>
            </div>
            <p className="text-[9px] text-status-success/60 font-medium leading-relaxed tracking-tight">
              All traffic for {service.name} is end-to-end encrypted and passes
              through the active firewall layer.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#050505] border-t border-white/10 flex flex-col gap-4">
          <button className="w-full py-3 bg-primary text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all">
            Initiate_Restart
          </button>
          <div className="flex items-center justify-center gap-2 text-[8px] text-white/20 font-black uppercase tracking-[0.2em]">
            <Clock size={10} />
            Last_Synchronized: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPanel;

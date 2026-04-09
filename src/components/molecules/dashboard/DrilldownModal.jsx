import React from 'react';
import StatusIndicator from './StatusIndicator';

/**
 * DrilldownModal - Standardized personnel/performance visibility layer.
 */
const DrilldownModal = ({ isOpen, onClose, category, type, data = [] }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-[#0d131f] border border-white/5 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
              {type === 'role' ? `Strategic Analysis: ${category}` : 'Personnel Visibility'}
            </h2>
            <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-[0.3em] font-black opacity-60">
              Org Level → {category} → {type === 'role' ? 'Functional Roles' : 'Individuals'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-0 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 sticky top-0 backdrop-blur-md">
              <tr className="text-[10px] text-slate-600 uppercase tracking-widest font-black border-b border-white/5">
                <th className="py-4 px-8 font-black">{type === 'role' ? 'Role Type' : 'Entity Name'}</th>
                <th className="py-4 px-8 font-black">{type === 'role' ? 'Headcount' : 'Assigned Load'}</th>
                <th className="py-4 px-8 font-black">Utilization</th>
                <th className="py-4 px-8 font-black">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.length > 0 ? data.map((row, i) => (
                <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-default group">
                  <td className="py-4 px-8 font-bold text-slate-200 group-hover:text-sky-400 transition-colors">{row.role || row.name}</td>
                  <td className="py-4 px-8 text-slate-400 font-mono">{row.count || row.tasks}</td>
                  <td className="py-4 px-8 text-slate-400 font-mono">{row.avgLoad || row.load}%</td>
                  <td className="py-4 px-8">
                    <StatusIndicator color={row.status} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-600 text-xs italic font-bold">
                    No refined personnel data available for this segment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 text-[9px] text-slate-600 uppercase tracking-[0.2em] text-center font-black border-t border-white/5">
          Autonomous Execution Engine // Data Simulation Layer Active
        </div>
      </div>
    </div>
  );
};

export default DrilldownModal;

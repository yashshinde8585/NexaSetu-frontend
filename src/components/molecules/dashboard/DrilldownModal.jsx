import React from 'react';
import StatusIndicator from './StatusIndicator';

/**
 * DrilldownModal - Standardized personnel/performance visibility layer.
 */
const DrilldownModal = ({ isOpen, onClose, category, type, data = [] }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-black border border-white/20 rounded-[2rem] w-full max-w-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-white/20 flex justify-between items-center bg-black">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {type === 'role' ? `Strategic Analysis: ${category}` : 'Personnel Visibility'}
            </h2>
            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-[0.3em] font-black opacity-80">
              Org Level → {category} → {type === 'role' ? 'Functional Roles' : 'Individuals'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/40 hover:text-primary transition-colors p-2 hover:bg-white/5 rounded-full"
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
            <thead className="bg-black sticky top-0 border-b border-white/20">
              <tr className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                <th className="py-5 px-8 font-black">{type === 'role' ? 'Role Type' : 'Entity Name'}</th>
                <th className="py-5 px-8 font-black">{type === 'role' ? 'Headcount' : 'Assigned Load'}</th>
                <th className="py-5 px-8 font-black">Utilization</th>
                <th className="py-5 px-8 font-black">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.length > 0 ? data.map((row, i) => (
                <tr key={i} className="border-b border-white/[0.05] hover:bg-white/5 transition-colors cursor-default group">
                  <td className="py-5 px-8 font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{row.role || row.name}</td>
                  <td className="py-5 px-8 text-white font-mono font-bold">{row.count || row.tasks}</td>
                  <td className="py-5 px-8 text-white font-mono font-bold">{row.avgLoad || row.load}%</td>
                  <td className="py-5 px-8">
                    <StatusIndicator color={row.status} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                    No refined personnel data available for this segment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 bg-black text-[10px] text-white/30 uppercase tracking-[0.3em] text-center font-black border-t border-white/20">
          Autonomous Execution Engine // Data Simulation Layer Active
        </div>
      </div>
    </div>
  );
};

export default DrilldownModal;

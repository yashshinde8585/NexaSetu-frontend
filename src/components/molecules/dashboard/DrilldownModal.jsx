import React from 'react';
import StatusIndicator from './StatusIndicator';
import { X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Modal dialog for detailed view drilldowns.
const DrilldownModal = ({ isOpen, onClose, category, type, data = [] }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-8 border-b border-white/5 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              {type === 'role' ? `Analysis: ${category}` : 'Personnel Overview'}
            </h2>
            <nav className="flex items-center gap-2 text-[9px] text-white/30 uppercase tracking-widest font-bold">
              <span>Organization</span>
              <span className="opacity-40">/</span>
              <span>{category}</span>
              <span className="opacity-40">/</span>
              <span className="text-white/60">
                {type === 'role' ? 'Functional Roles' : 'Personnel'}
              </span>
            </nav>
          </div>
          <button
            onClick={onClose}
            className="text-white/20 hover:text-white transition-all p-2 bg-white/5 border border-white/5 rounded-lg hover:border-white/20"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 bg-[#0A0A0A] z-20">
              <tr className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-bold border-b border-white/10">
                <th className="py-4 px-8 border-b border-white/5">
                  {type === 'role' ? 'Role' : 'Name'}
                </th>
                <th className="py-4 px-8 border-b border-white/5">
                  {type === 'role' ? 'Headcount' : 'Load'}
                </th>
                <th className="py-4 px-8 border-b border-white/5 text-center">
                  Utilization
                </th>
                <th className="py-4 px-8 border-b border-white/5">Status</th>
                <th className="py-4 px-8 border-b border-white/5 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {data.length > 0 ? (
                data.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-4 px-8 font-bold text-white/70 uppercase tracking-tight group-hover:text-primary transition-colors border-b border-white/[0.03]">
                      {row.role || row.name}
                    </td>
                    <td className="py-4 px-8 text-white/50 font-bold border-b border-white/[0.03]">
                      {row.count || row.tasks}
                    </td>
                    <td className="py-4 px-8 text-center text-white border-b border-white/[0.03] font-bold">
                      {row.avgLoad || row.load}%
                    </td>
                    <td className="py-4 px-8 border-b border-white/[0.03]">
                      <StatusIndicator color={row.status} />
                    </td>
                    <td className="py-4 px-8 border-b border-white/[0.03] text-right">
                      <button
                        onClick={() => {
                          const target = row.role
                            ? `?role=${row.role}`
                            : `?user=${row.id}`;
                          navigate(`/team${target}`);
                          onClose();
                        }}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-primary/50 transition-all"
                      >
                        Context <ExternalLink size={10} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-24 text-center text-white/10 text-[10px] font-bold uppercase tracking-[0.2em] italic"
                  >
                    No active personnel data identified for this segment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="p-6 bg-[#0E0E0E] text-[9px] text-white/20 uppercase tracking-widest text-center font-bold border-t border-white/5">
          Data synchronized with organization management system
        </footer>
      </div>
    </div>
  );
};

export default DrilldownModal;

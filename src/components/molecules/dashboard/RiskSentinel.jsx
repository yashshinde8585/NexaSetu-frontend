import React, { useEffect, useState } from 'react';
import { ShieldAlert, X, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socketService from '../../../services/socketService';
import { useAuth } from '../../../context/AuthContext';

const RiskSentinel = () => {
  const [alert, setAlert] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Only leadership receives autonomous risk alerts
    const isLeadership = ['CTO', 'VP_ENGINEERING', 'WORKSPACE_ADMIN', 'TECH_LEAD', 'ENGINEERING_MANAGER'].includes(user.role);
    if (!isLeadership) return;

    socketService.onEvent('RISK_ALERT', (data) => {
      console.log('[SENTINEL] Risk Signal Detected:', data);
      setAlert(data);
      
      // Auto-hide after 15 seconds if not critical
      if (data.type !== 'DEADLOCK_DETECTED') {
        setTimeout(() => setAlert(null), 15000);
      }
    });

    return () => {
      socketService.offEvent('RISK_ALERT');
    };
  }, [user]);

  if (!alert) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-96 animate-in slide-in-from-right-10 duration-500">
      <div className={`relative overflow-hidden rounded-2xl border bg-black shadow-2xl ${
        alert.type === 'DEADLOCK_DETECTED' ? 'border-status-error/50 shadow-status-error/20' : 'border-status-warning/50 shadow-status-warning/20'
      }`}>
        {/* Progress Bar (Visual Polish) */}
        <div className={`absolute top-0 left-0 h-1 bg-current opacity-30 animate-progress ${
           alert.type === 'DEADLOCK_DETECTED' ? 'text-status-error' : 'text-status-warning'
        }`} style={{ width: '100%' }} />

        <div className="p-5">
           <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${
                    alert.type === 'DEADLOCK_DETECTED' ? 'bg-status-error/10 text-status-error' : 'bg-status-warning/10 text-status-warning'
                 }`}>
                    <ShieldAlert size={18} />
                 </div>
                 <div>
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Autonomous Sentinel</span>
                    <h4 className="text-sm font-black text-white tracking-tight">{alert.title}</h4>
                 </div>
              </div>
              <button onClick={() => setAlert(null)} className="text-white/20 hover:text-white transition-colors">
                 <X size={16} />
              </button>
           </div>

           <p className="text-xs text-white/60 mb-6 leading-relaxed">
              {alert.message}
           </p>

           <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (alert.projectId) navigate(`/war-room/${alert.projectId}`);
                  setAlert(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  alert.type === 'DEADLOCK_DETECTED' 
                    ? 'bg-status-error text-white hover:bg-status-error/80' 
                    : 'bg-status-warning text-black hover:bg-status-warning/80'
                }`}
              >
                Enter War Room <ChevronRight size={12} />
              </button>
              
              <button 
                onClick={() => setAlert(null)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
              >
                Dismiss
              </button>
           </div>
        </div>

        {/* Decorative Background Element */}
        <div className={`absolute -right-4 -bottom-4 opacity-10 pointer-events-none ${
           alert.type === 'DEADLOCK_DETECTED' ? 'text-status-error' : 'text-status-warning'
        }`}>
           <Zap size={80} />
        </div>
      </div>
    </div>
  );
};

export default RiskSentinel;

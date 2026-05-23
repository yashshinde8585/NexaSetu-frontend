import React, { useMemo } from 'react';
import { useSystemIntegrity } from '../../hooks/useSystemIntegrity';
import { Activity, Database, Cpu, HardDrive } from 'lucide-react';

const SystemIntegrityStatus = () => {
  const { integrity, loading, error } = useSystemIntegrity(30000);

  const systemTime = useMemo(() => {
    const time = integrity?.dependencies?.systemTime || new Date();
    return new Date(time).toLocaleTimeString();
  }, [integrity?.dependencies?.systemTime]);

  if (loading && !integrity) {
    return (
      <div className="bg-black/90 border border-white/10 p-3 rounded-sm w-[240px] animate-pulse">
        <div className="text-[10px] text-zinc-500 tracking-widest mb-2 uppercase">
          Initializing Scan...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 p-4 font-sans text-[9px] text-white rounded-none flex flex-col gap-4">
      <header className="flex justify-between items-center">
        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
          CENTRAL_INTELLIGENCE_LINKS
        </h4>
        <Activity size={12} className="text-primary animate-pulse" />
      </header>

      <div className="flex flex-col gap-3">
        <LinkItem
          icon={<Database size={12} />}
          label="DATABASE"
          status={integrity?.dependencies?.database || 'offline'}
        />
        <LinkItem
          icon={<HardDrive size={12} />}
          label="MEMORY GRID"
          status={integrity?.dependencies?.cache || 'offline'}
        />
        <LinkItem
          icon={<Cpu size={12} />}
          label="AI ENGINE"
          status="active"
          isStatic
        />
      </div>

      {error && (
        <div className="mt-3 text-[9px] text-red-500 border-t border-red-500/20 pt-2 animate-in fade-in slide-in-from-top-1">
          ERR_SYNC_FAILURE: {error}
        </div>
      )}

      <footer className="mt-1 flex justify-between items-center text-[8px] border-t border-white/10 pt-3">
        <span className="text-white/20 uppercase font-black tracking-widest">
          STATUS: NOMINAL
        </span>
        <span className="text-white/40 font-black tracking-widest uppercase">
          SCAN_T: {systemTime}
        </span>
      </footer>
    </div>
  );
};

// Sub-component for individual link items
const LinkItem = ({ icon, label, status, isStatic }) => {
  const getStatusTheme = (currentStatus) => {
    const s = currentStatus?.toLowerCase();
    if (s === 'connected' || s === 'operational' || s === 'active') {
      return { color: 'text-green-400', bg: 'bg-green-400' };
    }
    if (s === 'degraded' || s === 'warning') {
      return { color: 'text-amber-500', bg: 'bg-amber-500' };
    }
    if (s === 'critical' || s === 'offline') {
      return { color: 'text-red-500', bg: 'bg-red-500' };
    }
    return { color: 'text-zinc-500', bg: 'bg-zinc-500' };
  };

  const theme = getStatusTheme(status);

  return (
    <div className="flex justify-between items-center group cursor-default">
      <div className="flex items-center gap-2">
        <span className="text-white/20 group-hover:text-primary transition-colors">
          {icon}
        </span>
        <span className="text-white/40 group-hover:text-white transition-colors font-black uppercase tracking-widest text-[8px]">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-[8px] font-black tracking-[0.2em] ${theme.color}`}
        >
          {status.toUpperCase()}
        </span>
        <div className={`w-1.5 h-1.5 rounded-none ${theme.bg}`} />
      </div>
    </div>
  );
};

export default React.memo(SystemIntegrityStatus);

import React, { useMemo } from 'react';
import { useSystemIntegrity } from '../../hooks/useSystemIntegrity';
import { Activity, Database, Cpu, HardDrive } from 'lucide-react';

/**
 * System Integrity Status Component
 * Displays real-time health metrics of the core infrastructure.
 */
const SystemIntegrityStatus = () => {
    const { integrity, loading, error } = useSystemIntegrity(30000);

    const systemTime = useMemo(() => {
        const time = integrity?.dependencies?.systemTime || new Date();
        return new Date(time).toLocaleTimeString();
    }, [integrity?.dependencies?.systemTime]);

    if (loading && !integrity) {
        return (
            <div className="bg-black/90 border border-white/10 p-3 rounded-sm w-[240px] animate-pulse">
                <div className="text-[10px] text-zinc-500 tracking-widest mb-2 uppercase">Initializing Scan...</div>
            </div>
        );
    }

    return (
        <div className="bg-black/90 border border-white/10 p-4 font-mono text-[11px] text-white rounded-sm w-[260px] shadow-2xl backdrop-blur-sm">
            <header className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] letter-spacing-[0.15em] text-zinc-500 font-bold uppercase">
                    Central Intelligence Links
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
            
            <footer className="mt-4 flex justify-between items-center text-[9px]">
                <span className="text-zinc-600 uppercase tracking-tighter">Status: Nominal</span>
                <span className="text-zinc-500 font-bold">
                    SCAN: {systemTime}
                </span>
            </footer>
        </div>
    );
};

/**
 * Sub-component for individual link items
 */
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
                <span className="text-zinc-500 group-hover:text-primary transition-colors duration-300">
                    {icon}
                </span>
                <span className="text-zinc-400 group-hover:text-white transition-colors duration-300">
                    {label}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black tracking-widest ${theme.color}`}>
                    {status.toUpperCase()}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${theme.bg} shadow-[0_0_8px] ${theme.bg.replace('bg-', 'shadow-')}`}></div>
            </div>
        </div>
    );
};

export default React.memo(SystemIntegrityStatus);

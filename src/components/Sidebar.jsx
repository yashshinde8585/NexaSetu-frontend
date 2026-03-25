import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Settings, Users, Box, Zap, ShieldCheck, UserPlus, CreditCard, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InviteModal from './InviteModal';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);

  if (location.pathname === '/pricing') return null;
  
  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['MANAGER', 'DEV', 'INTERN'] },
    { name: 'Portfolio', path: '/portfolio', icon: <Briefcase size={20} />, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Team', path: '/team', icon: <Users size={20} />, roles: ['ADMIN', 'MANAGER'] },
    { name: 'Workspace Settings', path: '#', icon: <Building size={20} />, roles: ['ADMIN'], disabled: true },
    { name: 'Billing', path: '#', icon: <CreditCard size={20} />, roles: ['ADMIN'], disabled: true },
    { name: 'Settings', path: '#', icon: <Settings size={20} />, disabled: true },
  ].filter(item => !item.roles || item.roles.includes(user?.role));

  const activeStyle = "bg-primary/10 text-primary border-r-2 border-primary";
  const inactiveStyle = "text-text-muted hover:text-white hover:bg-white/5";

  return (
    <aside className="w-64 bg-background-dark border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-50 transition-all">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">NexaSetu</span>
        </Link>
      </div>

      <nav className="flex-1 mt-4 px-0 space-y-1">
        <div className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.2em] px-6 mb-4">Workspace</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-6 py-3 text-sm font-bold transition-all group ${
                item.disabled 
                ? 'opacity-40 cursor-not-allowed' 
                : (isActive 
                    ? 'text-white bg-linear-to-r from-primary/10 via-primary/5 to-transparent' 
                    : 'text-text-muted hover:text-white hover:bg-white/5')
              }`
            }
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Line */}
                {!item.disabled && isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                )}
                
                {/* Icon with glow logic */}
                <span className={`transition-all duration-300 ${
                  !item.disabled && isActive 
                  ? 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] scale-110' 
                  : 'text-text-muted/60 group-hover:text-white'
                }`}>
                  {item.icon}
                </span>
                
                {item.name}
              </>
            )}
          </NavLink>
        ))}

        {/* Invite Member - Orchestrator Level Only */}
        {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-primary/80 hover:text-primary hover:bg-primary/5 transition-all group mt-4 border-t border-white/5 pt-6"
          >
            <span className="p-1 px-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <UserPlus size={16} />
            </span>
            Add Team Member
          </button>
        )}
      </nav>

      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />

      <div className="p-4 mt-auto">
        <div className="bg-linear-to-br from-primary/5 to-secondary/5 border border-white/5 rounded-xl p-4">
          <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
            <ShieldCheck size={10} /> {user?.role || 'USER'}
          </p>
          <p className="text-xs text-text-muted font-medium mb-3">
            {user?.role === 'ADMIN' ? 'Strategic Ecosystem Control' : 
             user?.role === 'MANAGER' ? 'Full Orchestration Access' :
             user?.role === 'DEV' ? 'Executive Mode Enabled' : 'Restricted Learning Mode'}
          </p>
          <button className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5 transition-all">
            Settings
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

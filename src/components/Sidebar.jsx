import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Settings, Users, Box, Zap, ShieldCheck, UserPlus, CreditCard, Building, Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePermissions, PERMISSIONS } from '../hooks/usePermissions';

import { TICKETS_PROJECT_ID } from '../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);

  if (location.pathname === '/pricing') return null;
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, permission: null },
    { name: 'Team Members', path: '/team', icon: <Users size={20} />, permission: PERMISSIONS.INVITE_USERS }, // Re-using permission for now
    { name: 'Settings', path: '/workspace-settings', icon: <Building size={20} />, permission: PERMISSIONS.MANAGE_ROLES },
    { name: 'Billing', path: '#', icon: <CreditCard size={20} />, permission: PERMISSIONS.MANAGE_BILLING, disabled: true },
  ].filter(item => !item.permission || hasPermission(item.permission));

  const canInvite = hasPermission(PERMISSIONS.INVITE_USERS);

  const activeStyle = "bg-primary/10 text-primary border-r-2 border-primary";
  const inactiveStyle = "text-text-muted hover:text-white hover:bg-white/5";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 bg-background-dark border-r border-white/10 flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl md:shadow-none`}>
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">NexaSetu</span>
        </Link>
      </div>

      <nav className="flex-1 mt-4 px-0 space-y-1">
        <div className="text-[10px] font-semibold text-text-muted/40 uppercase tracking-[0.15em] px-6 mb-4">Workspace</div>
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
                {!item.disabled && isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                )}
                
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

        <div className="pt-6">
            <div className="text-[10px] font-semibold text-text-muted/40 uppercase tracking-[0.15em] px-6 mb-4">Management</div>
            {[
                { name: 'Tasks & Tickets', path: `/project/${TICKETS_PROJECT_ID}`, icon: <Box size={18} /> },
                { name: 'Project Details', path: '/project-info', icon: <Settings size={18} /> }
            ].map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                        `relative flex items-center gap-3 px-6 py-3 text-sm font-bold transition-all group ${
                            isActive 
                            ? 'text-white bg-linear-to-r from-secondary/10 via-secondary/5 to-transparent' 
                            : 'text-text-muted hover:text-white hover:bg-white/5'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-secondary shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                            )}
                            <span className={`transition-all duration-300 ${
                                isActive 
                                ? 'text-secondary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] scale-110' 
                                : 'text-text-muted/60 group-hover:text-white'
                            }`}>
                                {item.icon}
                            </span>
                            {item.name}
                        </>
                    )}
                </NavLink>
            ))}
        </div>

        {/* Invite Member - Orchestrator Level Only */}
        {canInvite && (
          <Link 
            to="/team/add"
            className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-primary/80 hover:text-primary hover:bg-primary/5 transition-all group mt-4 border-t border-white/5 pt-6"
          >
            <span className="p-1 px-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <UserPlus size={16} />
            </span>
            Invite Members
          </Link>
        )}
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;

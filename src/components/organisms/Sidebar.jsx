import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Box,
  Zap,
  UserPlus,
  CreditCard,
  Settings,
  Target,
  Rocket,
  PlusSquare,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermissions, PERMISSIONS } from '../../hooks/usePermissions';
import { ROUTES } from '../../constants';

// A collapsible sidebar component that provides main navigation links for the workspace.
const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();
  const title = user?.jobTitle?.toLowerCase() || '';

  if (location.pathname === '/pricing') return null;

  const navItems = [
    {
      name: user?.role === 'WORKSPACE_ADMIN' ? 'Admin Panel' :
            user?.jobTitle === 'CTO' ? 'CTO Command Center' : 
            user?.jobTitle?.toLowerCase() === 'vp engineering' ? 'Execution Commander' : 
            (user?.role === 'ENGINEERING_MANAGER' || user?.jobTitle?.toLowerCase() === 'engineering manager') ? 'Team Command Center' :
            (user?.role === 'TECH_LEAD' || title.includes('tech lead')) ? 'System Health Control' :
            (title.includes('qa lead')) ? 'Quality Command' :
            (user?.role === 'HR_MANAGER' || title.includes('people ops') || title.includes('hr manager')) ? 'Workforce Strategy' :
            (title.includes('senior qa engineer')) ? 'Quality Strategy' :
            (user?.role === 'QA_ENGINEER' || title.includes('qa engineer')) ? 'Quality Control' :
            (user?.role === 'SENIOR_ENGINEER' || title.includes('senior engineer')) ? 'Execution Control' :
            (title.includes('junior engineer')) ? 'Guided Work Assistant' :
            (user?.role === 'INTERN' || title.includes('intern')) ? 'Learning Workspace' :
            'Personal Work Console',
      path: user?.role === 'WORKSPACE_ADMIN' ? ROUTES.ADMIN_PANEL :
            user?.jobTitle === 'CTO' ? '/command-center' :
            title.includes('vp engineering') ? '/execution-commander' : 
            (user?.role === 'ENGINEERING_MANAGER' || title.includes('engineering manager')) ? '/team-command-center' :
            (user?.role === 'TECH_LEAD' || title.includes('tech lead')) ? '/system-health-control' :
            (title.includes('qa lead')) ? '/quality-command' :
            (user?.role === 'HR_MANAGER' || title.includes('people ops') || title.includes('hr manager')) ? '/people-ops' :
            (title.includes('senior qa engineer')) ? '/quality-strategy' :
            (user?.role === 'QA_ENGINEER' || title.includes('qa engineer')) ? '/quality-control' :
            (user?.role === 'SENIOR_ENGINEER' || title.includes('senior engineer')) ? '/execution-control' :
            (title.includes('junior engineer')) ? '/guided-assistant' :
            (user?.role === 'INTERN' || title.includes('intern')) ? '/learning-workspace' :
            '/work-console',
      icon: <Shield size={20} />,
      permission: null, // Allow visibility based on user detection
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      permission: null,
      hidden: user?.role === 'WORKSPACE_ADMIN'
    },
    {
      name: 'Team Members',
      path: user?.assignedProjectId ? `/team/project/${user.assignedProjectId._id || user.assignedProjectId}` : '/teams',
      icon: <Users size={20} />,
      permission: null,
    },
    {
      name: 'Billing',
      path: '#',
      icon: <CreditCard size={20} />,
      permission: PERMISSIONS.MANAGE_BILLING,
      disabled: true,
    },
  ].filter((item) => (!item.permission || hasPermission(item.permission)) && !item.hidden);

  const canInvite = hasPermission(PERMISSIONS.INVITE_USERS);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-64 bg-background-dark border-r border-white/10 flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-2xl md:shadow-none`}
      >
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              NexaSetu
            </span>
          </Link>
        </div>

        <nav className="flex-1 mt-4 px-0 space-y-1">
          <div className="text-[10px] font-semibold text-text-muted/40 uppercase tracking-[0.15em] px-6 mb-4">
            Workspace
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-6 py-3 text-sm font-bold transition-all group ${
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : isActive
                      ? 'text-white bg-linear-to-r from-primary/10 via-primary/5 to-transparent'
                      : 'text-text-muted hover:text-white hover:bg-white/5'
                }`
              }
              onClick={(e) => {
                if (item.disabled) e.preventDefault();
                else onClose();
              }}
            >
              {({ isActive }) => (
                <>
                  {!item.disabled && isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  )}

                  <span
                    className={`transition-all duration-300 ${
                      !item.disabled && isActive
                        ? 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] scale-110'
                        : 'text-text-muted/60 group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </span>

                  {item.name}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-6">
            <div className="text-[10px] font-semibold text-text-muted/40 uppercase tracking-[0.15em] px-6 mb-4">
              Management
            </div>
            {[
              {
                name: 'Tasks & Tickets',
                path: user?.assignedProjectId
                  ? `/project/${user.assignedProjectId._id || user.assignedProjectId}`
                  : '/my-tasks?scope=workspace',
                icon: <Box size={18} />,
              },
              {
                name: 'Sprint Management',
                path: '/project-info',
                icon: <Settings size={18} />,
              },
              {
                name: 'Create Project',
                path: '/project-setup',
                icon: <PlusSquare size={18} />,
                permission: PERMISSIONS.CREATE_PROJECT,
              },
            ].filter(item => {
              const isAdmin = user?.role === 'WORKSPACE_ADMIN';
              if (isAdmin) {
                // Admins only see Create Project in this section, following "System Control" focus
                return item.name === 'Create Project';
              }
              const isIntern = user?.role?.toUpperCase() === 'INTERN';
              const hasRegistryPerm = item.name === 'Sprint Management';
              const hasSetupPerm = item.name === 'Create Project' && hasPermission(PERMISSIONS.CREATE_PROJECT);
              const otherItems = !['Sprint Management', 'Create Project'].includes(item.name);
              
              return hasRegistryPerm || hasSetupPerm || otherItems;
            })
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={item.disabled ? (e) => e.preventDefault() : onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-6 py-3 text-sm font-bold transition-all group ${
                    item.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isActive
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
                    <span
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'text-secondary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)] scale-110'
                          : 'text-text-muted/60 group-hover:text-white'
                      }`}
                    >
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
              onClick={onClose}
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

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;

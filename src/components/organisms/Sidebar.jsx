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
      name: title.includes('cto') ? 'Executive Dashboard' : 
            title.includes('vp engineering') ? 'Ops Dashboard' : 
            (user?.role === 'ENGINEERING_MANAGER' || title.includes('engineering manager')) ? 'Team Overview' :
            (user?.role === 'TECH_LEAD' || title.includes('tech lead')) ? 'Systems Health' :
            (title.includes('qa lead')) ? 'Quality Overview' :
            (user?.role === 'HR_MANAGER' || title.includes('people ops') || title.includes('hr manager')) ? 'Dashboard' :
            (title.includes('senior qa engineer')) ? 'Test Strategy' :
            (user?.role === 'QA_ENGINEER' || title.includes('qa engineer')) ? 'Test Dashboard' :
            (user?.role === 'SENIOR_ENGINEER' || title.includes('senior engineer')) ? 'Development Dashboard' :
            (title.includes('junior engineer')) ? 'My Tasks' :
            (user?.role === 'INTERN' || title.includes('intern')) ? 'Learning Hub' :
            user?.role === 'WORKSPACE_ADMIN' ? 'Workspace Admin' :
            'My Dashboard',
      path: title.includes('cto') ? '/cto-dashboard' :
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
            user?.role === 'WORKSPACE_ADMIN' ? ROUTES.ADMIN_PANEL :
            '/work-console',
      icon: <Shield size={20} />,
      permission: null, // Allow visibility based on user detection
    },
    {
      name: 'People',
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
        className={`w-64 bg-black border-r border-white/10 flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shadow-3xl md:shadow-none`}
      >
        <div className="p-6 shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-6 h-6 bg-primary flex items-center justify-center text-black transition-transform">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="text-[12px] font-black tracking-[0.2em] text-white uppercase">
              NEXA_SETU
            </span>
          </Link>
        </div>

        <nav className="flex-1 mt-2 px-0 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] px-6 mb-4">
            Workspace
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-6 h-9 text-[10px] font-black tracking-[0.2em] uppercase transition-all group ${
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : isActive
                      ? 'text-white bg-white/5'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
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
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  )}

                  <span
                    className={`transition-all ${
                      !item.disabled && isActive
                        ? 'text-primary'
                        : 'text-white/20 group-hover:text-white/50'
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
            <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] px-6 mb-4">
              Management
            </div>
            {[
              {
                name: 'Task Board',
                path: user?.assignedProjectId
                  ? `/project/${user.assignedProjectId._id || user.assignedProjectId}`
                  : '/my-tasks?scope=workspace',
                icon: <Box size={18} />,
              },
              {
                name: 'Sprints',
                path: '/project-info',
                icon: <Settings size={18} />,
              },
              {
                name: 'New Project',
                path: '/project-setup',
                icon: <PlusSquare size={18} />,
                permission: PERMISSIONS.CREATE_PROJECT,
                hidden: user?.role !== 'WORKSPACE_ADMIN' || location.pathname !== '/admin/dashboard'
              },
            ].filter(item => {
              const isAdmin = user?.role === 'WORKSPACE_ADMIN';
              if (isAdmin) {
                // Admins only see Project Setup in this section, following "System Control" focus
                return item.name === 'New Project';
              }
              const isIntern = user?.role?.toUpperCase() === 'INTERN';
              const hasRegistryPerm = item.name === 'Sprint Management';
              const hasSetupPerm = item.name === 'New Project' && hasPermission(PERMISSIONS.CREATE_PROJECT);
              const otherItems = !['Sprint Management', 'New Project'].includes(item.name);
              
              return (hasRegistryPerm || hasSetupPerm || otherItems) && !item.hidden;
            })
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={item.disabled ? (e) => e.preventDefault() : onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-6 h-9 text-[10px] font-black tracking-[0.2em] uppercase transition-all group ${
                    item.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isActive
                        ? 'text-white bg-white/5'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary" />
                    )}
                    <span
                      className={`transition-all ${
                        isActive
                          ? 'text-secondary'
                          : 'text-white/20 group-hover:text-white/50'
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
              className="w-full flex items-center gap-3 px-6 h-9 text-[10px] font-black tracking-[0.2em] uppercase text-primary hover:text-black hover:bg-primary transition-all group mt-4 border-t border-white/5 pt-2 mb-4"
            >
              <span className="transition-colors">
                <UserPlus size={14} />
              </span>
              INVITE_COLLEAGUE
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

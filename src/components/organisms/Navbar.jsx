import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import NotificationTray from './NotificationTray';
import { Menu, Layers, Rocket, Shield, Sparkles } from 'lucide-react';
import MagicBar from './MagicBar';
import { usePermissions, PERMISSIONS } from '../../hooks/usePermissions';
import { ROUTES } from '../../constants/routes';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-14 bg-black border-b border-white/10">
      {user ? (
        <>
          <div className="flex items-center gap-4 shrink-0 px-2 h-9">
            <button
              onClick={onToggleSidebar}
              className="p-2 -ml-2 text-white/60 hover:text-white md:hidden transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
            <div className="text-[10px] font-black text-white flex items-center h-full">
              <span className="text-white uppercase tracking-[0.2em] pointer-events-none">
                {(() => {
                  const path = location.pathname;
                  const breadcrumbMap = {
                    [ROUTES.DASHBOARD]: 'Home',
                    [ROUTES.COMMAND_CENTER]: 'Executive',
                    [ROUTES.EXECUTION_COMMANDER]: 'Operations',
                    [ROUTES.TEAM_COMMAND_CENTER]: 'Team',
                    [ROUTES.SYSTEM_HEALTH_CONTROL]: 'Status',
                    [ROUTES.QUALITY_COMMAND]: 'Quality',
                    [ROUTES.PEOPLE_OPS]: 'People',
                    [ROUTES.QUALITY_STRATEGY]: 'Strategy',
                    [ROUTES.QUALITY_CONTROL]: 'Audit',
                    [ROUTES.EXECUTION_CONTROL]: 'Dashboard',
                    [ROUTES.GUIDED_WORK_ASSISTANT]: 'Tasks',
                    [ROUTES.LEARNING_WORKSPACE]: 'Hub',
                    [ROUTES.ADMIN_PANEL]: 'Admin',
                    [ROUTES.PERSONAL_WORK_CONSOLE]: 'Workbench',
                    [ROUTES.PORTFOLIO || '/portfolio']: 'Portfolio',
                    [ROUTES.TEAMS]: 'People',
                    '/team/add': 'Invite',
                    '/project-info': 'Sprints',
                    '/project-setup': 'New Project',
                    [ROUTES.MY_TASKS]: 'Tasks',
                    '/velocity': 'Velocity',
                    [ROUTES.PROFILE || '/profile']: 'Profile',
                    [ROUTES.SETTINGS]: 'Settings',
                    '/theme': 'Themes',
                  };

                  if (breadcrumbMap[path]) return breadcrumbMap[path];
                  if (path.startsWith('/team/project/')) return 'Team';
                  if (path.match(/^\/project\/[^/]+\/settings$/)) return 'Project Settings';
                  if (path.startsWith('/project/')) return 'Task Board';
                  if (path.startsWith('/task/')) return 'Task Detail';
                  return 'Intelligence';
                })()}
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 justify-center max-w-4xl px-8">
            {location.pathname === '/dashboard' &&
              hasPermission(PERMISSIONS.USE_MAGIC_BAR) && <MagicBar />}
          </div>

          <div className="flex items-center gap-4 shrink-0 h-9">
            <NotificationTray />
            <ProfileDropdown />
          </div>
        </>
      ) : (
        <>
          <Link to="/" className="flex items-center gap-3 group/logo relative">
            <div className="w-6 h-6 bg-primary flex items-center justify-center text-black transition-transform">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="text-[12px] font-black tracking-[0.2em] text-white uppercase">
              NEXA_SETU
            </span>
          </Link>

          <div className="flex gap-4 sm:gap-6 items-center">
            {location.pathname !== ROUTES.LOGIN && (
              <Link
                to={ROUTES.LOGIN}
                className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-colors whitespace-nowrap"
              >
                SIGN_IN
              </Link>
            )}
            {location.pathname !== ROUTES.REGISTER && (
              <Link
                to={ROUTES.REGISTER}
                className="text-[10px] font-black bg-white hover:bg-white/90 text-black h-9 px-4 sm:px-6 flex items-center justify-center rounded uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap"
              >
                GET_STARTED
              </Link>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  onToggleSidebar: PropTypes.func,
};

export default Navbar;

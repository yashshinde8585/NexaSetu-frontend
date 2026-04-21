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
    <nav className="sticky top-0 z-50 flex items-start justify-between px-4 sm:px-8 lg:px-10 py-3 sm:py-4 bg-black border-b border-white/15">
      {user ? (
        <>
          <div className="flex items-center gap-4 shrink-0 px-2 h-9 min-h-[36px]">
            <button
              onClick={onToggleSidebar}
              className="p-2 -ml-2 text-white/60 hover:text-white md:hidden transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
            <div className="text-xs font-semibold text-white flex items-center h-full">
              <span className="text-white uppercase tracking-[0.15em] pointer-events-none">
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

          <div className="flex items-center gap-4 shrink-0 h-9 min-h-[36px]">
            <NotificationTray />
            <ProfileDropdown />
          </div>
        </>
      ) : (
        <>
          <Link to="/" className="flex items-center gap-3 group/logo relative">
            <div className="relative">
              {/* Flat NexaSetu Logo - Unified Brand Mark */}
              <div className="relative w-9 h-9 bg-brand rounded-xl flex items-center justify-center p-2 group-hover/logo:scale-105 transition-transform duration-500 overflow-hidden ring-1 ring-white/20">
                <div className="grid grid-cols-2 gap-1.5 w-5 h-5 relative z-10" aria-hidden="true">
                  <div className="bg-white rounded-[2px] transform group-hover/logo:rotate-3 transition-transform duration-500" />
                  <div className="bg-white/80 rounded-[2px]" />
                  <div className="bg-white/80 rounded-[2px]" />
                  <div className="bg-white rounded-[2px] relative overflow-hidden" />
                </div>
              </div>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              NexaSetu
            </span>
          </Link>

          <div className="flex gap-4 sm:gap-6 items-center">
            {location.pathname !== ROUTES.LOGIN && (
              <Link
                to={ROUTES.LOGIN}
                className="text-xs sm:text-sm font-black text-white/70 hover:text-white uppercase tracking-widest transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
            )}
            {location.pathname !== ROUTES.REGISTER && (
              <Link
                to={ROUTES.REGISTER}
                className="text-xs sm:text-sm font-black bg-white hover:bg-white/90 text-black px-4 sm:px-6 py-2.5 rounded-xl uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap"
              >
                Get Started
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

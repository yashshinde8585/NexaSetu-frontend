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

// A dynamic navigation bar that handles breadcrumbs, global search, and user profile access.
const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 flex items-start justify-between px-4 sm:px-8 py-3 sm:py-4 bg-background-dark/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      {user ? (
        <>
          {/* Left Column: Breadcrumb */}
          <div className="flex items-center gap-4 shrink-0 px-2 h-9 min-h-[36px]">
            <button
              onClick={onToggleSidebar}
              className="p-2 -ml-2 text-text-muted hover:text-white md:hidden transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
            <div className="text-xs font-semibold text-white flex items-center h-full">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent uppercase tracking-[0.15em] pointer-events-none">
                {(() => {
                  const path = location.pathname;
                  const breadcrumbMap = {
                    [ROUTES.DASHBOARD]: 'Dashboard',
                    [ROUTES.PORTFOLIO || '/portfolio']: 'Portfolio',
                    [ROUTES.TEAMS]: 'Personnel',
                    '/team/add': 'Personnel Registry',
                    '/project-info': 'Sprint Management',
                    '/project-setup': 'Create Project',
                    [ROUTES.MY_TASKS]: 'Tasks & Tickets',
                    '/velocity': 'Tactical Velocity',
                    [ROUTES.PROFILE || '/profile']: 'Profile',
                    [ROUTES.SETTINGS]: 'Preferences',
                    '/theme': 'Interface Themes',
                  };

                  if (breadcrumbMap[path]) return breadcrumbMap[path];
                  if (path.startsWith('/team/project/')) return 'Personnel';
                  if (path.match(/^\/project\/[^/]+\/settings$/)) return 'Project Settings';
                  if (path.startsWith('/project/')) return 'Tasks & Tickets';
                  if (path.startsWith('/task/')) return 'Task Detail';
                  return 'Intelligence';
                })()}
              </span>
            </div>
          </div>

          {/* Center Column: MagicBar */}
          <div className="hidden md:flex flex-1 justify-center max-w-4xl px-8">
            {location.pathname === '/dashboard' &&
              hasPermission(PERMISSIONS.USE_MAGIC_BAR) && <MagicBar />}
          </div>

          {/* Right Column: Activities & Profile */}
          <div className="flex items-center gap-4 shrink-0 h-9 min-h-[36px]">
            <NotificationTray />
            <ProfileDropdown />
          </div>
        </>
      ) : (
        <>
          <Link to={ROUTES.LOGIN || "/"} className="flex items-center gap-3 group/logo relative">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/25 blur-lg rounded-xl group-hover/logo:bg-primary/40 transition-all"></div>
              {/* Premium NexaSetu Logo - Unified Brand Mark */}
              <div className="relative w-9 h-9 bg-brand rounded-xl flex items-center justify-center p-2 shadow-2xl group-hover/logo:scale-105 transition-transform duration-500 overflow-hidden ring-1 ring-white/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer-logo pointer-events-none" />
                <div className="grid grid-cols-2 gap-1.5 w-5 h-5 relative z-10" aria-hidden="true">
                  <div className="bg-white rounded-[2px] shadow-sm transform group-hover/logo:rotate-3 transition-transform duration-500" />
                  <div className="bg-white/80 rounded-[2px] shadow-sm" />
                  <div className="bg-white/80 rounded-[2px] shadow-sm" />
                  <div className="bg-white rounded-[2px] shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              NexaSetu
            </span>
          </Link>

          <div className="flex gap-4 sm:gap-6 items-center">
            <Link
              to={ROUTES.LOGIN}
              className="text-xs sm:text-sm font-semibold text-text-muted hover:text-white transition-colors whitespace-nowrap"
            >
              Sign In
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="text-xs sm:text-sm font-bold bg-white hover:bg-white/90 text-background-dark px-4 sm:px-5 py-2 rounded-xl transition-all shadow-lg hover:shadow-white/10 active:scale-95 whitespace-nowrap"
            >
              Get Started
            </Link>
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

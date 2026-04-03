import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { Hexagon, Menu } from 'lucide-react';
import MagicBar from './MagicBar';
import { usePermissions, PERMISSIONS } from '../../hooks/usePermissions';

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
              <Menu size={24} />
            </button>
            <div className="text-xs font-semibold text-white flex items-center h-full">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent uppercase tracking-[0.15em] pointer-events-none">
                {(() => {
                  const path = location.pathname;
                  if (path === '/dashboard') return 'Dashboard';
                  if (path === '/portfolio') return 'Portfolio';
                  if (path === '/teams') return 'Personnel';
                  if (path === '/team/add') return 'Personnel Registry';
                  if (path === '/project-info') return 'Project Details';
                  if (path === '/my-tasks') return 'Personal Tasks';
                  if (path === '/velocity') return 'Tactical Velocity';
                  if (path === '/profile') return 'Profile';
                  if (path === '/settings') return 'Preferences';
                  if (path === '/theme') return 'Interface Themes';
                  if (path.startsWith('/project/')) return 'Tasks & Tickets';
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
            <ProfileDropdown />
          </div>
        </>
      ) : (
        <>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-lg group-hover:bg-primary/30 transition-all"></div>
              <div className="relative w-9 h-9 bg-linear-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <Hexagon size={20} className="fill-white/20" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              NexaSetu
            </span>
          </Link>

          <div className="flex gap-6 items-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-text-muted hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold bg-white hover:bg-white/90 text-background-dark px-5 py-2 rounded-xl transition-all shadow-lg hover:shadow-white/10 active:scale-95"
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

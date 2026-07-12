import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ hideLinks = false }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Capabilities', href: isHome ? '#matrix' : '/#matrix' },
    { name: 'Solutions', href: isHome ? '#verticals' : '/#verticals' },
    { name: 'Pricing', href: isHome ? '#tiers' : '/#tiers' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border-subtle bg-background-light">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xl font-bold tracking-tighter text-text whitespace-nowrap"
          >
            NEXASETU
          </Link>
          {!hideLinks && (
            <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-text-subtle">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-text transition-colors whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 md:gap-8 shrink-0">
          {location.pathname !== '/login' && (
            <Link
              to="/login"
              className="text-xs font-bold text-text-subtle hover:text-text transition-colors whitespace-nowrap"
            >
              Sign In
            </Link>
          )}
          {location.pathname !== '/register' && (
            <Link
              to="/register"
              className="px-4 sm:px-8 py-2 md:py-3 bg-text text-background text-xs font-bold hover:opacity-90 transition-all whitespace-nowrap"
            >
              Connect <span className="hidden sm:inline">GitHub</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

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
          <Link to="/" className="text-xl font-bold tracking-tighter text-text">
            NEXASETU
          </Link>
          {!hideLinks && (
            <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-text-subtle">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-text transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 md:gap-8">
          {location.pathname !== '/login' && (
            <Link
              to="/login"
              className="text-xs font-bold text-text-subtle hover:text-text transition-colors"
            >
              Sign In
            </Link>
          )}
          {location.pathname !== '/register' && (
            <Link
              to="/register"
              className="px-5 md:px-8 py-2.5 md:py-3 bg-text text-background text-xs font-bold hover:opacity-90 transition-all"
            >
              Connect GitHub
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

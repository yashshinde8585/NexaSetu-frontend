import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const GithubIcon = ({ size = 14, className }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const Navbar = ({ hideLinks = false }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password';

  const navLinks = [
    { name: 'Features', href: isHome ? '#matrix' : '/#matrix' },
    { name: 'Solutions', href: isHome ? '#verticals' : '/#verticals' },
    { name: 'Pricing', href: isHome ? '#tiers' : '/#tiers' },
    { name: 'Documentation', href: '/docs' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all border-b border-border-subtle ${
        isHome || isAuthPage
          ? 'bg-[#0B0D10]/95 backdrop-blur-md'
          : 'bg-background-light'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xl font-bold tracking-tighter text-text whitespace-nowrap"
          >
            NEXASETU
          </Link>
          {!hideLinks && (
            <div className={`hidden lg:flex items-center gap-8 text-xs font-medium ${isHome ? 'text-text-muted' : 'text-neutral-300'}`}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`${isHome ? 'hover:text-text' : 'hover:text-white'} transition-colors whitespace-nowrap`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 sm:gap-6 md:gap-8 shrink-0">
          {location.pathname !== '/login' && (
            <Link
              to="/login"
              className={`text-xs font-medium transition-colors whitespace-nowrap ${
                isHome || isAuthPage ? 'text-text-muted hover:text-text' : 'text-neutral-300 hover:text-white'
              }`}
            >
              Sign in
            </Link>
          )}
          {location.pathname !== '/register' && (
            <Link
              to="/register"
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold active:scale-[0.98] transition-all whitespace-nowrap rounded-lg flex items-center gap-2 border shadow-sm ${
                isHome || isAuthPage
                  ? 'bg-primary text-white hover:bg-primary-dark border-primary shadow-primary/20'
                  : 'bg-white text-black hover:bg-neutral-100 border-white/10'
              }`}
            >
              <span>Get Started</span>
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-[3px] ${isHome || isAuthPage ? 'bg-white/20 text-white' : 'bg-[#3b82f6] text-white'}`}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

GithubIcon.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

Navbar.propTypes = {
  hideLinks: PropTypes.bool,
};

export default Navbar;

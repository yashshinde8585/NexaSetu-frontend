import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { Hexagon, Menu, Activity } from 'lucide-react';
import MagicBar from './MagicBar';
import { usePermissions, PERMISSIONS } from '../hooks/usePermissions';

const Navbar = ({ onToggleSidebar }) => {
    const { user } = useAuth();
    const { hasPermission } = usePermissions();
    const navigate = useNavigate();

    const navLinkStyle = ({ isActive }) => 
        `text-sm font-semibold transition-all px-3 py-2 rounded-lg ${
            isActive 
            ? 'text-white bg-white/10' 
            : 'text-text-muted hover:text-white hover:bg-white/5'
        } hidden sm:block`;

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
                                 {window.location.pathname === '/portfolio' ? 'Portfolio' : 
                                  window.location.pathname === '/team' ? 'Personnel' :
                                  window.location.pathname === '/team/add' ? 'Registry' :
                                  'Intelligence'}
                             </span>
                        </div>
                    </div>

                    {/* Center Column: MagicBar (Expanded with Permissions) */}
                    <div className="hidden md:flex flex-1 justify-center max-w-4xl px-8">
                        {hasPermission(PERMISSIONS.USE_MAGIC_BAR) ? (
                            <MagicBar />
                        ) : (
                            <div className="flex items-center gap-2 group cursor-default">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-all duration-500"></div>
                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted/40 group-hover:text-text-muted/60 transition-colors">Strategic Operations Restricted</span>
                            </div>
                        )}
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
                        <span className="text-xl font-bold tracking-tight text-white">NexaSetu</span>
                    </Link>
                    
                    <div className="flex gap-6 items-center">
                        <Link to="/login" className="text-sm font-semibold text-text-muted hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="text-sm font-bold bg-white hover:bg-white/90 text-background-dark px-5 py-2 rounded-xl transition-all shadow-lg hover:shadow-white/10 active:scale-95">
                            Get Started
                        </Link>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;

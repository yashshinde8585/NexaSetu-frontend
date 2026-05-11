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
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background-light">
            <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <Link to="/" className="text-xl font-bold tracking-tighter text-white">NexaSetu</Link>
                    {!hideLinks && (
                        <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold text-white/30">
                            {navLinks.map((link) => (
                                <a 
                                    key={link.name} 
                                    href={link.href} 
                                    className="hover:text-white transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3 md:gap-8">
                    <Link to="/login" className="text-[9px] md:text-[10px] font-bold text-white/40 hover:text-white transition-colors">Sign In</Link>
                    <Link to="/register" className="px-5 md:px-8 py-2.5 md:py-3 bg-white text-black text-[9px] md:text-[10px] font-bold hover:bg-white/90 transition-all">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

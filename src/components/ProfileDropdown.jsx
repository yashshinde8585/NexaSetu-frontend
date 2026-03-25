import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    User, 
    Settings, 
    Contrast, 
    Maximize, 
    Users, 
    LogOut, 
    ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        setIsOpen(false);
        await logout();
        navigate('/login');
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Toggle Button */}
            <button 
                onClick={toggleDropdown}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-all outline-hidden active:scale-95 duration-200 cursor-pointer"
            >
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary/30 to-secondary/30 flex items-center justify-center border border-white/10 shadow-lg ring-2 ring-primary/10 overflow-hidden">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-primary font-bold text-xs uppercase">
                            {user.name.charAt(0)}
                        </span>
                    )}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none gap-1">
                    <span className="text-sm font-bold text-white/90">
                        {user.name}
                    </span>
                    <span className="text-[10px] text-primary uppercase tracking-widest font-black">
                        {user.role}
                    </span>
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                    {/* Header */}
                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary/40 to-secondary/40 border-2 border-white/10 flex items-center justify-center p-0.5 shadow-xl">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold uppercase">{user.name.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <h3 className="text-base font-bold text-white truncate leading-tight">{user.name}</h3>
                            <p className="text-xs text-text-muted truncate mt-0.5">{user.email}</p>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-0.5">
                        <DropdownItem icon={<User size={18} strokeWidth={2.2} />} label="Profile" />
                        <DropdownItem icon={<Settings size={18} strokeWidth={2.2} />} label="Account settings" />
                        <DropdownItem 
                            icon={<Contrast size={18} strokeWidth={2.2} />} 
                            label="Theme" 
                            trailing={<ChevronRight size={16} className="text-text-muted/40 group-hover:text-white/60 transition-colors" />}
                        />
                        <DropdownItem icon={<Maximize size={18} strokeWidth={2.2} />} label="Open Quickstart" />
                    </div>

                    <div className="h-[1px] bg-white/5 mx-2 my-1" />

                    <div className="p-2 space-y-0.5">
                        <DropdownItem icon={<Users size={18} strokeWidth={2.2} />} label="Switch account" />
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-status-error/80 hover:bg-status-error/10 hover:text-status-error transition-all group duration-200 cursor-pointer"
                        >
                            <span className="p-1.5 rounded-lg bg-status-error/5 group-hover:bg-status-error/10 transition-colors">
                                <LogOut size={18} strokeWidth={2.2} />
                            </span>
                            <span className="text-sm font-semibold">Log out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const DropdownItem = ({ icon, label, trailing, onClick }) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-all group duration-200 cursor-pointer"
    >
        <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-white/0 group-hover:bg-white/5 transition-colors">
                {icon}
            </span>
            <span className="text-sm font-semibold">{label}</span>
        </div>
        {trailing}
    </button>
);

export default ProfileDropdown;

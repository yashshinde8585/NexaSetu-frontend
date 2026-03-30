import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    User, 
    Mail, 
    Shield, 
    ShieldCheck, 
    Calendar, 
    Globe, 
    Settings, 
    LogOut,
    Lock,
    Key,
    UserCircle,
    BadgeCheck,
    Cpu,
    ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;

    const getRoleVisuals = (title) => {
        switch (title) {
            case 'CTO':
            case 'VP Engineering':
            case 'Director':
            case 'Engineering Manager':
                return { color: 'text-status-success', shadow: 'rgba(34, 197, 94, 0.3)', border: 'border-status-success/20' };
            case 'Tech Lead':
                return { color: 'text-primary', shadow: 'rgba(59, 130, 246, 0.3)', border: 'border-primary/20' };
            case 'Senior Engineer':
                return { color: 'text-purple-400', shadow: 'rgba(168, 85, 247, 0.3)', border: 'border-purple-400/20' };
            case 'Software Engineer':
                return { color: 'text-cyan-400', shadow: 'rgba(34, 211, 238, 0.3)', border: 'border-cyan-400/20' };
            case 'Intern':
                return { color: 'text-slate-500', shadow: 'rgba(148, 163, 184, 0.3)', border: 'border-slate-500/20' };
            default:
                return { color: 'text-white/40', shadow: 'transparent', border: 'border-white/10' };
        }
    };

    const visuals = getRoleVisuals(user.jobTitle);

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="relative max-w-5xl mx-auto">
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent opacity-50 rounded-[40px] pointer-events-none"></div>
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10 p-10 bg-[#121826]/40 backdrop-blur-3xl border border-white/5 rounded-[40px] shadow-2xl overflow-hidden group">
                    {/* Animated Glow Background */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

                    {/* Avatar Display */}
                    <div className="relative">
                        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-linear-to-tr from-primary/20 to-secondary/20 p-1 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-white/5">
                                    <span className="text-5xl font-extrabold text-white">{user.name.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div className={`absolute bottom-2 right-2 w-8 h-8 border rounded-full bg-[#121826] flex items-center justify-center shadow-xl ${visuals.border}`}>
                            <ShieldCheck className={visuals.color} size={16} />
                        </div>
                    </div>

                    {/* Identity Details */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h1 className="text-4xl font-extrabold text-white uppercase tracking-tight leading-none">
                                    {user.name}
                                </h1>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest ${visuals.color}`}>
                                    <BadgeCheck size={10} /> Member ID: {user._id.slice(-6).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className={`text-base font-bold uppercase tracking-[0.2em] ${visuals.color}`}>
                                    {user.jobTitle || 'Team Member'}
                                </div>
                                <div className="h-1 w-1 bg-white/20 rounded-full hidden md:block"></div>
                                <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
                                    <Mail size={14} className="text-white/20" /> {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatBlock label="User Role" value={user.role.replace('_', ' ')} color={visuals.color} />
                            <StatBlock label="Joined Date" value={new Date(user.createdAt).toLocaleDateString()} />
                            <StatBlock label="Location" value="Global Hub" />
                            <StatBlock label="Status" value="Online" status="online" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatBlock = ({ label, value, color, status }) => (
    <div>
        <div className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em] mb-1.5">{label}</div>
        <div className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${color || 'text-white/80'}`}>
            {status === 'online' && <div className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--color-success),0.5)]"></div>}
            {value}
        </div>
    </div>
);

const SectionHeader = ({ icon, title, danger }) => (
    <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${danger ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-primary'}`}>
            {icon}
        </div>
        <h2 className="text-lg font-bold text-white uppercase tracking-tight">
            {title}
        </h2>
    </div>
);

const ActionCard = ({ icon, title, desc }) => (
    <button className="flex items-center gap-5 p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-2xl transition-all group text-left w-full h-full relative overflow-hidden active:scale-[0.98]">
        <div className="text-white/20 group-hover:text-primary transition-colors">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className="flex-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform">{title}</h4>
            <p className="text-[10px] text-text-muted opacity-40 group-hover:opacity-60 transition-opacity truncate">{desc}</p>
        </div>
        <ExternalLink size={12} className="text-white/5 absolute top-4 right-4 group-hover:text-white/20 transition-all" />
    </button>
);

export default Profile;

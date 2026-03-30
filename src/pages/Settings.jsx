import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    User, 
    Lock, 
    Bell, 
    Shield, 
    Settings as SettingsIcon,
    Camera,
    Mail,
    ChevronRight,
    AtSign,
    Save,
    RotateCcw,
    Monitor,
    Fingerprint,
    Database,
    Clock,
    UserCircle,
    BadgeCheck
} from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('identity');

    const tabs = [
        { id: 'identity', label: 'Identity Node', icon: <User size={18} /> },
        { id: 'security', label: 'Strategic Security', icon: <Shield size={18} /> },
        { id: 'preferences', label: 'System Preferences', icon: <SettingsIcon size={18} /> }
    ];

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Command Center Info */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
                        <SettingsIcon size={20} className="animate-spin-slow" />
                    </div>
                    <div className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full text-[7px] font-black uppercase tracking-[0.2em] text-white/40">
                        Strategic Configuration
                    </div>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-widest italic uppercase leading-none">
                    Account <span className="text-primary not-italic">Orchestrator</span>
                </h1>
                <p className="text-text-muted text-[10px] sm:text-xs font-medium mt-3 max-w-md opacity-50">
                    Fine-tune your tactical presence and govern unit security protocols from a single command deck.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Tactical Navigation Sidebar */}
                <div className="w-full lg:w-72 flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all group relative overflow-hidden ${
                                activeTab === tab.id 
                                ? 'bg-primary/10 border border-primary/20 text-white shadow-lg shadow-primary/5' 
                                : 'bg-[#121826]/30 border border-white/5 text-white/40 hover:bg-white/5 hover:text-white/60'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={activeTab === tab.id ? 'text-primary' : 'text-white/20 group-hover:text-white/40'}>
                                    {tab.icon}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                            </div>
                            <ChevronRight size={14} className={activeTab === tab.id ? 'text-primary' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white/20'} />
                        </button>
                    ))}
                    
                    <div className="mt-6 p-5 sm:p-6 bg-linear-to-br from-primary/5 to-transparent border border-white/5 rounded-2xl sm:rounded-3xl">
                        <div className="flex items-center gap-2 mb-3">
                            <BadgeCheck size={14} className="text-primary" />
                            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Active Clearance</span>
                        </div>
                        <div className="text-[10px] font-bold text-white uppercase italic tracking-tighter line-clamp-1">
                            {user.jobTitle || user.role.replace('_', ' ')}
                        </div>
                    </div>
                </div>

                {/* Main Configuration Deck */}
                <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    {activeTab === 'identity' && <IdentityDeck user={user} />}
                    {activeTab === 'security' && <SecurityDeck user={user} />}
                    {activeTab === 'preferences' && <PreferencesDeck user={user} />}
                    
                    {/* Execution Dock */}
                    <div className="pt-8 flex items-center justify-end gap-4 border-t border-white/5">
                        <button className="px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all flex items-center gap-2 active:scale-95">
                            <RotateCcw size={14} /> Revert Nodes
                        </button>
                        <button className="px-10 py-3 bg-primary hover:bg-primary-light text-white font-black uppercase tracking-widest text-[9px] rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95">
                            <Save size={14} /> Execute Deployment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeckWrapper = ({ title, children }) => (
    <div className="bg-[#121826]/30 backdrop-blur-3xl border border-white/5 rounded-2xl sm:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <h2 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-4">
            <div className="h-4 w-1 bg-primary rounded-full"></div> {title}
        </h2>
        <div className="space-y-8 relative z-10">
            {children}
        </div>
    </div>
);

const IdentityDeck = ({ user }) => (
    <DeckWrapper title="Unit Identity Node">
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 p-5 sm:p-6 bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/5 group hover:bg-white/[0.04] transition-all duration-500">
            <div className="relative">
                <div className="w-28 h-28 rounded-full border-2 border-white/10 p-0.5 shadow-2xl">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-white/5 overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-black text-white italic">{user.name.charAt(0)}</span>
                        )}
                    </div>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary hover:bg-primary-light text-white rounded-xl flex items-center justify-center border border-[#0B0F1A] shadow-xl hover:scale-110 active:scale-95 transition-all duration-300">
                    <Camera size={18} />
                </button>
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Unit Bio-Signature</div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{user.name}</h3>
                <p className="text-xs text-text-muted opacity-60">Synchronize your identity avatar for better squad recognition.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <TacticalInput icon={<UserCircle />} label="Tactical Name" value={user.name} placeholder="John 'Ghost' Doe" />
            <TacticalInput icon={<AtSign />} label="System Email" value={user.email} placeholder="unit@nexus.app" />
            <TacticalInput icon={<BadgeCheck />} label="Strategic Role" value={user.jobTitle || 'Personnel Unit'} disabled />
            <TacticalInput icon={<Clock />} label="System Tenure" value={`Mobilized ${new Date(user.createdAt).toLocaleDateString()}`} disabled />
        </div>
    </DeckWrapper>
);

const SecurityDeck = () => (
    <DeckWrapper title="Strategic Security Protocols">
        <div className="space-y-6">
            <SecurityProtocol 
                icon={<Lock size={20} />} 
                title="Credential Rotation" 
                desc="Last rotation 24 days ago. High risk detected." 
                action="Rotate Keys" 
                danger
            />
            <SecurityProtocol 
                icon={<Fingerprint size={20} />} 
                title="Biometric MFA" 
                desc="Enhance node security with two-factor authentication." 
                action="Configure Node" 
            />
            <SecurityProtocol 
                icon={<Database size={20} />} 
                title="Privacy Grid" 
                desc="Manage unit visibility across the workspace projects." 
                action="Manage Guard" 
            />
        </div>
    </DeckWrapper>
);

const PreferencesDeck = () => (
    <DeckWrapper title="System Preferences Node">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <TacticalSelect 
                icon={<Monitor />} 
                label="Interface Mode" 
                options={['TACTICAL_DARK', 'AMBER_DECK', 'GHOST_LIGHT']} 
                value="TACTICAL_DARK"
            />
            <TacticalSelect 
                icon={<Globe />} 
                label="Deployment Locale" 
                options={['Asia/Kolkata (IST)', 'UTC (GMT)', 'US/New York (EST)']} 
                value="Asia/Kolkata (IST)"
            />
            <TacticalSelect 
                icon={<Bell />} 
                label="Intel Feeds" 
                options={['ALL_NOTIFICATIONS', 'CRITICAL_ALERTS', 'SILENT_OPS']} 
                value="ALL_NOTIFICATIONS"
            />
        </div>
    </DeckWrapper>
);

const TacticalInput = ({ icon, label, value, placeholder, disabled }) => (
    <div className="relative group/field">
        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mb-2 block">{label}</label>
        <div className="relative">
            <input 
                type="text" 
                defaultValue={value}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full h-11 sm:h-12 bg-white/[0.03] border border-white/5 focus:border-primary/40 text-white rounded-xl sm:rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-white/10 text-xs font-bold tracking-tight ${disabled ? 'opacity-50 cursor-not-allowed border-white/0 bg-white/0' : 'group-hover/field:bg-white/[0.05]'}`}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/field:text-primary transition-colors">
                {icon}
            </div>
        </div>
    </div>
);

const TacticalSelect = ({ icon, label, options, value }) => (
    <div className="relative group/field">
        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mb-2 block">{label}</label>
        <div className="relative">
            <select className="w-full bg-white/[0.03] border border-white/5 focus:border-primary/40 text-white rounded-2xl px-5 py-4 outline-none transition-all appearance-none cursor-pointer text-xs font-bold tracking-tight pr-12 group-hover/field:bg-white/[0.05]">
                {options.map(opt => <option key={opt} value={opt} className="bg-[#121826] text-white py-4">{opt}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/field:text-primary transition-colors pointer-events-none">
                {React.cloneElement(icon, { size: 18 })}
            </div>
        </div>
    </div>
);

const SecurityProtocol = ({ icon, title, desc, action, danger }) => (
    <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${danger ? 'bg-red-500/10 text-red-400' : 'bg-primary/5 text-primary'}`}>
                {icon}
            </div>
            <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">{title}</h4>
                <p className={`text-[10px] ${danger ? 'text-red-400 opacity-60' : 'text-text-muted opacity-40'}`}>{desc}</p>
            </div>
        </div>
        <button className={`px-4 py-2 border rounded-lg text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 ${danger ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'border-white/10 text-white/40 hover:bg-white/5 hover:text-white'}`}>
            {action}
        </button>
    </div>
);

export default Settings;

import React, { useState } from 'react';
import { 
    Building, 
    Shield, 
    Users, 
    Zap, 
    Globe, 
    Hash, 
    Lock, 
    Trash2, 
    Save, 
    Plus,
    GitBranch,
    MessageSquare,
    Database,
    Cpu,
    Check,
    AlertCircle,
    Copy,
    ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WorkspaceSettings = () => {
    const { user } = useAuth();
    const [workspaceName, setWorkspaceName] = useState('NexaSetu Default');
    const [slug, setSlug] = useState('nexasetu-default');

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Executive Header */}
            <div className="mb-12">

                <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
                    Workspace <span className="text-primary">Settings</span>
                </h1>
                <p className="text-text-muted text-xs font-medium mt-3 max-w-md opacity-50">
                    Manage your workspace settings, user permissions, and external integrations.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Settings Content */}
                <div className="lg:col-span-2 space-y-10">
                    {/* General Settings */}
                    <div className="bg-[#121826]/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                            <Zap size={22} className="text-primary" /> Workspace Profile
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SettingsField 
                                label="Workspace Name" 
                                value={workspaceName} 
                                onChange={(e) => setWorkspaceName(e.target.value)} 
                                icon={<Building size={18} />} 
                            />
                            <SettingsField 
                                label="Workspace URL Slug" 
                                value={slug} 
                                onChange={(e) => setSlug(e.target.value)} 
                                icon={<Hash size={18} />} 
                                prefix="nexasetu.app/"
                            />
                        </div>

                        <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-primary italic font-black text-2xl shadow-xl">
                                N
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-1">Workspace Logo</h4>
                                <p className="text-[10px] text-text-muted opacity-40 mb-3">This logo will be visible to all members of the workspace.</p>
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] font-bold uppercase tracking-widest text-white transition-all">
                                    Upload Image
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Permissions Settings */}
                    <div className="bg-[#121826]/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                            <Shield size={22} className="text-status-success" /> Permissions & Access
                        </h2>

                        <div className="space-y-6">
                            <ToggleSetting 
                                title="Public Discovery" 
                                desc="Allow users to find and request to join this workspace via the URL." 
                                enabled 
                            />
                            <ToggleSetting 
                                title="Email Domain Restrictions" 
                                desc="Only allow users from specific email domains to join." 
                                enabled={false}
                            />
                            <ToggleSetting 
                                title="Template Automation" 
                                desc="Automatically assign default project templates to new members." 
                                enabled 
                            />
                        </div>
                    </div>

                    {/* Integrations Hub */}
                    <div className="bg-[#121826]/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                            <Cpu size={22} className="text-primary" /> App Integrations
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <IntegrationCard icon={<GitBranch />} name="GitHub" status="CONNECTED" />
                            <IntegrationCard icon={<MessageSquare />} name="Slack" status="OFFLINE" danger />
                            <IntegrationCard icon={<Database />} name="AWS S3" status="STABLE" />
                        </div>
                    </div>
                </div>

                {/* Workspace Stats */}
                <div className="space-y-8">
                    <div className="bg-[#121826]/30 border border-white/5 rounded-[32px] p-8 flex flex-col items-center text-center">
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-6">Resource Usage</div>
                        <div className="relative w-32 h-32 mb-6">
                            <svg className="w-full h-full rotate-[-90deg]">
                                <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                                <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray="377" strokeDashoffset="75" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-white">80%</span>
                                <span className="text-[7px] font-bold text-primary uppercase">Usage</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-text-muted opacity-40">Workspace activity and setup are currently optimal.</p>
                    </div>

                    <div className="bg-[#121826]/30 border border-white/5 rounded-[32px] p-8">
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4">Workspace Identifiers</div>
                        <div className="space-y-6">
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl relative group cursor-pointer active:scale-95 transition-all">
                                <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1.5 flex justify-between items-center px-1">
                                    Workspace ID <Copy size={10} className="group-hover:text-primary transition-colors" />
                                </div>
                                <div className="text-[10px] font-bold text-white uppercase truncate">WS-NEXA-{user._id.slice(-8).toUpperCase()}</div>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl relative group cursor-pointer active:scale-95 transition-all">
                                <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1.5 flex justify-between items-center px-1">
                                    Workspace Key <Lock size={10} className="text-status-warning" />
                                </div>
                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">••••••••••••••••</div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-500/[0.02] border border-red-500/10 rounded-[32px] p-8 group hover:bg-red-500/[0.05] transition-all">
                        <div className="flex items-center gap-3 text-red-500 mb-4">
                            <AlertCircle size={18} />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Danger Zone</h3>
                        </div>
                        <p className="text-[10px] text-text-muted opacity-40 mb-6 leading-relaxed">Permanently delete this workspace and all associated projects. This action cannot be undone.</p>
                        <button className="w-full py-4 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 font-bold uppercase tracking-widest text-[9px] rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-red-500/5">
                            <Trash2 size={16} /> Delete Workspace
                        </button>
                    </div>
                </div>
            </div>

            {/* Persistence Bar */}
            <div className="mt-12 pt-8 flex items-center justify-end gap-4 border-t border-white/5">
                <button className="px-10 py-4 bg-primary hover:bg-primary-light text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
                    <Save size={16} /> Save Changes
                </button>
            </div>
        </div>
    );
};

const SettingsField = ({ label, value, onChange, icon, prefix }) => (
    <div className="relative group/field">
        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 mb-2 block">{label}</label>
        <div className="relative flex items-center">
            {prefix && (
                <div className="absolute left-5 text-[10px] font-black text-white/20 uppercase tracking-widest pointer-events-none">
                    {prefix}
                </div>
            )}
            <input 
                type="text" 
                value={value}
                onChange={onChange}
                className={`w-full bg-white/[0.03] border border-white/5 focus:border-primary/40 text-white rounded-2xl py-4 outline-none transition-all text-xs font-bold tracking-tight pr-12 group-hover/field:bg-white/[0.05] ${prefix ? 'pl-28' : 'pl-5'}`}
            />
            <div className="absolute right-5 text-white/10 group-focus-within/field:text-primary transition-colors">
                {icon}
            </div>
        </div>
    </div>
);

const ToggleSetting = ({ title, desc, enabled }) => (
    <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.04] transition-all">
        <div className="flex-1 pr-6">
            <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-1">{title}</h4>
            <p className="text-[10px] text-text-muted opacity-40 leading-tight">{desc}</p>
        </div>
        <button className={`w-12 h-6 rounded-full relative transition-all shadow-inner border border-white/5 ${enabled ? 'bg-primary/20 border-primary/40' : 'bg-white/5'}`}>
            <div className={`absolute top-1 bottom-1 w-4 rounded-full transition-all shadow-md ${enabled ? 'left-7 bg-primary shadow-[0_0_10px_rgba(var(--color-primary),0.8)]' : 'left-1 bg-white/20 hover:bg-white/40'}`}></div>
        </button>
    </div>
);

const IntegrationCard = ({ icon, name, status, danger }) => (
    <div className="p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-3xl group transition-all flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border transition-all ${danger ? 'bg-red-500/10 border-red-500/20 text-red-400 group-hover:scale-110' : 'bg-white/5 border-white/10 text-white group-hover:scale-110 group-hover:text-primary group-hover:border-primary/40'}`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className="text-[10px] font-bold text-white uppercase tracking-tight mb-2">{name}</div>
        <div className={`text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5 ${danger ? 'text-red-400' : 'text-status-success'}`}>
            <div className={`w-1 h-1 rounded-full ${danger ? 'bg-red-500 animate-pulse' : 'bg-status-success'}`}></div>
            {status}
        </div>
    </div>
);

export default WorkspaceSettings;

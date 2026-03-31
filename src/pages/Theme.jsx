import React, { useState } from 'react';
import { 
    Contrast, 
    Monitor, 
    Smartphone, 
    Sun, 
    Moon, 
    Palette, 
    Check,
    Box,
    Layout,
    Layers,
    Type,
    Sparkles,
    ShieldCheck
} from 'lucide-react';

const Theme = () => {
    const [selectedTheme, setSelectedTheme] = useState('obsidian');
    const [accentColor, setAccentColor] = useState('blue');

    const themes = [
        { 
            id: 'obsidian', 
            name: 'Dark Mode', 
            desc: 'High-contrast dark interface with clean highlights.',
            colors: ['#0B0F1A', '#3b82f6', '#10b981'],
            preview: 'bg-slate-950 shadow-blue-500/20'
        },
        { 
            id: 'amber', 
            name: 'Amber Theme', 
            desc: 'Modern professional display with warm amber tones.',
            colors: ['#1A0F0B', '#f59e0b', '#ef4444'],
            preview: 'bg-stone-950 shadow-amber-500/20'
        },
        { 
            id: 'ghost', 
            name: 'Light Mode', 
            desc: 'Clean, minimalist light interface for better readability.',
            colors: ['#F8FAFC', '#64748b', '#0369a1'],
            preview: 'bg-white shadow-slate-200/50',
            light: true
        }
    ];

    const accents = [
        { id: 'blue', color: 'bg-blue-500' },
        { id: 'emerald', color: 'bg-emerald-500' },
        { id: 'amber', color: 'bg-amber-500' },
        { id: 'purple', color: 'bg-purple-500' },
        { id: 'rose', color: 'bg-rose-500' }
    ];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Theme Executive Header */}
            <div className="mb-12">

                <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
                    Theme <span className="text-primary">Settings</span>
                </h1>
                <p className="text-text-muted text-xs font-medium mt-3 max-w-md opacity-50">
                    Customize your workspace appearance with our professional theme presets and accent colors.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Theme Selection Node */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-[#121826]/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                            <Monitor size={22} className="text-primary" /> Select Theme
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {themes.map(t => (
                                <button 
                                    key={t.id}
                                    onClick={() => setSelectedTheme(t.id)}
                                    className={`relative p-6 rounded-3xl border transition-all duration-500 text-left group overflow-hidden ${
                                        selectedTheme === t.id 
                                        ? 'bg-white/5 border-primary/40 shadow-2xl shadow-primary/5 scale-[1.02]' 
                                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10'
                                    }`}
                                >
                                    {selectedTheme === t.id && (
                                        <div className="absolute top-4 right-4 text-primary animate-in zoom-in duration-300">
                                            <ShieldCheck size={24} />
                                        </div>
                                    )}
                                    
                                    <div className={`w-16 h-12 rounded-xl mb-6 shadow-xl ${t.preview}`}>
                                        <div className="flex gap-2 p-2">
                                            <div className="w-4 h-4 rounded-full bg-white/20"></div>
                                            <div className="flex-1 space-y-1">
                                                <div className="h-1 w-full bg-white/20 rounded-full"></div>
                                                <div className="h-1 w-4/6 bg-white/20 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-base font-bold text-white uppercase tracking-tight mb-2 group-hover:translate-x-1 transition-transform">
                                        {t.name}
                                    </h3>
                                    <p className="text-[10px] text-text-muted opacity-40 group-hover:opacity-60 transition-opacity">
                                        {t.desc}
                                    </p>
                                    
                                    <div className="flex gap-1.5 mt-4">
                                        {t.colors.map((c, i) => (
                                            <div key={i} className="w-3 h-3 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: c }}></div>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#121826]/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                            <Sparkles size={22} className="text-primary" /> Accent Colors
                        </h2>
                        
                        <div className="flex flex-wrap gap-4">
                            {accents.map(acc => (
                                <button 
                                    key={acc.id}
                                    onClick={() => setAccentColor(acc.id)}
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all hover:scale-110 active:scale-95 ${
                                        accentColor === acc.id 
                                        ? `border-white ring-4 ring-${acc.id}-500/20 shadow-2xl shadow-${acc.id}-500/10` 
                                        : 'border-white/5 hover:border-white/20'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl shadow-inner ${acc.color} flex items-center justify-center text-white`}>
                                        {accentColor === acc.id && <Check size={18} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Preview</div>
                            <div className="flex items-center gap-4">
                                <button className={`px-4 py-2 bg-${accentColor}-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-${accentColor}-500/20`}>Button Action</button>
                                <div className={`px-4 py-2 border border-${accentColor}-500/30 text-${accentColor}-500 rounded-lg text-[10px] font-black uppercase tracking-widest`}>Sample Text</div>
                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full bg-${accentColor}-500 w-3/4 shadow-[0_0_10px_rgba(var(--color-primary),0.5)]`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preference Meta Deck */}
                <div className="space-y-8">
                    <div className="bg-[#121826]/30 border border-white/5 rounded-[32px] p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 text-primary rounded-xl flex items-center justify-center font-black">
                                T
                            </div>
                            <h3 className="text-base font-bold text-white uppercase tracking-tight">System Sync</h3>
                        </div>

                        <div className="space-y-4">
                            <SyncOption icon={<Monitor size={16} />} title="System Preferred" value="node_system" Active />
                            <SyncOption icon={<Sun size={16} />} title="Light Operations" value="node_light" />
                            <SyncOption icon={<Moon size={16} />} title="Dark Mobilization" value="node_dark" />
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-8">
                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">System Status</div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                                <span className="text-white/40">Current Theme</span>
                                <span className="text-white">Dark Mode</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                                <span className="text-white/40">Configuration</span>
                                <span className="text-status-success">Optimized</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#0B0F1A] rounded-full overflow-hidden mt-2">
                                <div className="h-full bg-primary w-full shadow-[0_0_15px_rgba(var(--color-primary),0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Action Bar */}
            <div className="mt-12 pt-8 flex items-center justify-end gap-4 border-t border-white/5">
                <button className="px-10 py-4 bg-primary hover:bg-primary-light text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                    Save Theme Settings
                </button>
            </div>
        </div>
    );
};

const SyncOption = ({ icon, title, Active }) => (
    <button className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
        Active 
        ? 'bg-primary/10 border-primary/30 text-white shadow-xl shadow-primary/5' 
        : 'bg-white/[0.01] border-white/5 text-white/40 hover:bg-white/[0.03] hover:text-white/60'
    }`}>
        <div className="flex items-center gap-3">
            <span className={Active ? 'text-primary' : ''}>{icon}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{title}</span>
        </div>
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${Active ? 'border-primary bg-primary' : 'border-white/10'}`}>
            {Active && <Check size={10} className="text-[#0B0F1A]" strokeWidth={4} />}
        </div>
    </button>
);

export default Theme;

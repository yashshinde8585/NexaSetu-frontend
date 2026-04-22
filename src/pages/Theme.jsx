import React, { useState } from 'react';
import {
  Monitor,
  Check,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  ChevronRight,
  Activity
} from 'lucide-react';
import Button from '../components/atoms/Button';
import { ROUTES } from '../constants';

/**
 * High-fidelity, clean UI for Theme customization.
 * Optimized for professional clarity and sunlight legibility.
 */
const Theme = () => {
  const [selectedTheme, setSelectedTheme] = useState('obsidian');
  const [accentColor, setAccentColor] = useState('blue');

  const themes = [
    {
      id: 'obsidian',
      name: 'Strategic Dark',
      desc: 'Optimized dark interface for technical operations.',
      colors: ['#000000', '#3b82f6', '#10b981'],
    },
    {
      id: 'amber',
      name: 'Command Amber',
      desc: 'Focused professional display with warm tactical tones.',
      colors: ['#121212', '#f59e0b', '#ef4444'],
    },
    {
      id: 'ghost',
      name: 'High Contrast Light',
      desc: 'Maximized readability for bright environment productivity.',
      colors: ['#FFFFFF', '#64748b', '#0369a1'],
      light: true,
    },
  ];

  const accents = [
    { id: 'blue', color: 'bg-blue-500', hex: '#3b82f6' },
    { id: 'emerald', color: 'bg-emerald-500', hex: '#10b981' },
    { id: 'amber', color: 'bg-amber-500', hex: '#f59e0b' },
    { id: 'purple', color: 'bg-purple-500', hex: '#a855f7' },
    { id: 'rose', color: 'bg-rose-500', hex: '#f43f5e' },
  ];

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4">
      <div className="max-w-screen-xl mx-auto space-y-6 animate-in fade-in duration-700">
        
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h1 className="text-[14px] font-black tracking-widest uppercase">
              CONSOLE_APPEARANCE
            </h1>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] max-w-xl">
              DEFINE VISUAL PARAMETERS FOR OPTIMAL TECHNICAL CLARITY.
            </p>
          </div>
          <Button
            variant="primary"
            className="h-9 px-4 text-[9px] font-black uppercase tracking-widest rounded w-full md:w-auto"
          >
            SAVE_THEME_PROTOCOL
          </Button>
        </div>

        {/* Configuration Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Theme & Accent Selection */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Theme Grid */}
            <section className="space-y-4">
              <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">THEME_INFRASTRUCTURE</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded overflow-hidden">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={`p-4 text-left transition-all relative group ${
                      selectedTheme === t.id ? 'bg-white/5' : 'bg-black hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded">
                        {t.colors.map((c, i) => (
                          <div key={i} className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      {selectedTheme === t.id && (
                         <div className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-[7px] font-black text-primary uppercase tracking-widest">ACTIVE</div>
                      )}
                    </div>
                    <h3 className="text-[12px] font-black uppercase text-white mb-1">{t.name}</h3>
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] max-w-[240px] truncate">{t.desc}</p>
                    
                    {selectedTheme === t.id && (
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Accent Selection */}
            <section className="space-y-4">
              <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">TACTICAL_ACCENTS</h2>
              <div className="p-4 bg-white/5 border border-white/10 rounded flex flex-wrap gap-4 items-center">
                 {accents.map((acc) => (
                   <button
                     key={acc.id}
                     onClick={() => setAccentColor(acc.id)}
                     className={`w-10 h-10 rounded flex items-center justify-center border transition-all ${
                       accentColor === acc.id 
                       ? 'bg-white/10 border-white/40 ring-2 ring-white/5' 
                       : 'bg-black border-white/10 hover:border-white/20'
                     }`}
                   >
                     <div className={`w-6 h-6 rounded-sm ${acc.color} flex items-center justify-center text-white`}>
                        {accentColor === acc.id && <Check size={12} strokeWidth={3} />}
                     </div>
                   </button>
                 ))}
                 
                 <div className="h-8 w-[1px] bg-white/10 hidden sm:block mx-2" />
                 
                 <div className="flex-1 min-w-[150px] flex items-center gap-3">
                    <div className={`h-8 px-3 rounded bg-${accentColor}-500/10 border border-${accentColor}-500/20 text-${accentColor}-500 text-[8px] font-black uppercase tracking-[0.2em] flex items-center`}>
                       PREVIEW
                    </div>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className={`h-full bg-${accentColor}-500 w-3/4 shadow-[0_0_15px_rgba(var(--color-primary),0.5)]`} />
                    </div>
                 </div>
              </div>
            </section>
          </div>

          {/* Sync & Readiness Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* System Link */}
            <section className="space-y-4">
              <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">SYSTEM_SYNCHRONIZATION</h2>
              <div className="bg-white/5 border border-white/10 rounded overflow-hidden divide-y divide-white/5">
                 <SyncItem icon={<Monitor size={12} />} title="FOLLOW_SYSTEM_OS" active />
                 <SyncItem icon={<Sun size={12} />} title="FORCE_DAY_MODE" />
                 <SyncItem icon={<Moon size={12} />} title="FORCE_OPERATIONS_DARK" />
              </div>
            </section>

            {/* Readniess Check */}
            <section className="p-4 bg-primary/5 border border-primary/10 rounded space-y-4">
               <div className="flex items-center gap-2">
                  <Activity size={14} className="text-primary-light" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">CONSOLE_READINESS</h3>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                     <span className="text-white/40">INTERFACE_STATUS</span>
                     <span className="text-status-success">OPTIMIZED</span>
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                     <span className="text-white/40">ACCENT_BINDING</span>
                     <span className="text-white">ACTIVE</span>
                  </div>
                  <div className="h-1 bg-black rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-full animate-pulse shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" />
                  </div>
               </div>
            </section>

          </div>
        </div>

        {/* Global Action Footer */}
        <footer className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
           <div className="flex items-center gap-4">
              <span>NEXA_SETU_INTERFACE_v3.4</span>
              <span>ENCRYPTION_ACTIVE</span>
           </div>
           <div className="flex gap-2">
              <button className="h-9 px-4 border border-white/10 rounded text-white/40 hover:text-white transition-all">DISCARD</button>
              <button className="h-9 px-4 bg-white/5 border border-white/10 rounded text-white/80 hover:bg-white/10 transition-all">RESTORE_DEFAULTS</button>
           </div>
        </footer>

      </div>
    </div>
  );
};

const SyncItem = ({ icon, title, active }) => (
  <button className={`w-full h-9 px-4 flex items-center justify-between group transition-all ${active ? 'bg-primary/10' : 'hover:bg-white/5'}`}>
     <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors ${active ? 'text-primary' : 'text-white/20 group-hover:text-white/40'}`}>
           {icon}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${active ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
           {title}
        </span>
     </div>
     {active ? (
        <ShieldCheck size={14} className="text-primary" />
     ) : (
        <ChevronRight size={14} className="text-white/5 group-hover:text-white/20 transition-transform transform group-hover:translate-x-1" />
     )}
  </button>
);

export default Theme;

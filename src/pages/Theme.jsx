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
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
              Console <span className="text-primary-light">Appearance</span>
            </h1>
            <p className="text-white/70 text-xs sm:text-sm font-bold max-w-xl leading-relaxed">
              Define your visual parameters. Choose between strategic dark modes or high-contrast light environments for optimal technical clarity.
            </p>
          </div>
          <Button
            variant="primary"
            className="h-12 px-10 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/10"
          >
            Save Theme Protocol
          </Button>
        </div>

        {/* Configuration Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 sm:gap-16">
          
          {/* Theme & Accent Selection */}
          <div className="xl:col-span-8 space-y-12">
            
            {/* Theme Grid */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/70 border-l-2 border-primary pl-4">Theme Infrastructure</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={`p-8 text-left transition-all relative group ${
                      selectedTheme === t.id ? 'bg-white/5' : 'bg-black hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-lg">
                        {t.colors.map((c, i) => (
                          <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      {selectedTheme === t.id && (
                         <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[8px] font-black text-primary uppercase tracking-widest">Active</div>
                      )}
                    </div>
                    <h3 className="text-lg font-black uppercase text-white mb-2">{t.name}</h3>
                    <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase tracking-widest max-w-[240px]">{t.desc}</p>
                    
                    {selectedTheme === t.id && (
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Accent Selection */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/70 border-l-2 border-primary pl-4">Tactical Accents</h2>
              <div className="p-8 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-wrap gap-6 items-center">
                 {accents.map((acc) => (
                   <button
                     key={acc.id}
                     onClick={() => setAccentColor(acc.id)}
                     className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all ${
                       accentColor === acc.id 
                       ? 'bg-white/10 border-white/40 ring-4 ring-white/5' 
                       : 'bg-black border-white/10 hover:border-white/20'
                     }`}
                   >
                     <div className={`w-8 h-8 rounded-lg ${acc.color} shadow-lg shadow-black/50 flex items-center justify-center text-white`}>
                        {accentColor === acc.id && <Check size={16} strokeWidth={3} />}
                     </div>
                   </button>
                 ))}
                 
                 <div className="h-10 w-[1px] bg-white/10 hidden sm:block mx-4" />
                 
                 <div className="flex-1 min-w-[200px] flex items-center gap-4">
                    <div className={`h-10 px-4 rounded-lg bg-${accentColor}-500/10 border border-${accentColor}-500/20 text-${accentColor}-500 text-[10px] font-black uppercase tracking-widest flex items-center`}>
                       Preview Element
                    </div>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className={`h-full bg-${accentColor}-500 w-3/4 shadow-[0_0_15px_rgba(var(--color-primary),0.5)]`} />
                    </div>
                 </div>
              </div>
            </section>
          </div>

          {/* Sync & Readiness Sidebar */}
          <div className="xl:col-span-4 space-y-12">
            
            {/* System Link */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/70 border-l-2 border-primary pl-4">System Synchronization</h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
                 <SyncItem icon={<Monitor size={16} />} title="Follow System OS" active />
                 <SyncItem icon={<Sun size={16} />} title="Force Day Mode" />
                 <SyncItem icon={<Moon size={16} />} title="Force Operations Dark" />
              </div>
            </section>

            {/* Readniess Check */}
            <section className="p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem] space-y-6">
               <div className="flex items-center gap-3">
                  <Activity size={18} className="text-primary-light" />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Console Readiness</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-white/40">Interface Status</span>
                     <span className="text-status-success">Optimized</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-white/40">Accent Binding</span>
                     <span className="text-white">Active</span>
                  </div>
                  <div className="h-1 bg-black rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-full animate-pulse shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" />
                  </div>
               </div>
            </section>

          </div>
        </div>

        {/* Global Action Footer */}
        <footer className="pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-white/50">
           <div className="flex items-center gap-6">
              <span>NexaSetu Interface v3.4</span>
              <span>Encryption Active</span>
           </div>
           <div className="flex gap-4">
              <button className="px-6 py-2 border border-white/5 rounded-lg text-white/20 hover:text-white/60 transition-all">Discard</button>
              <button className="px-8 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:bg-white/10 transition-all">Restore Defaults</button>
           </div>
        </footer>

      </div>
    </div>
  );
};

const SyncItem = ({ icon, title, active }) => (
  <button className={`w-full p-5 flex items-center justify-between group transition-all ${active ? 'bg-primary/5' : 'hover:bg-white/[0.02]'}`}>
     <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active ? 'text-primary' : 'text-white/20 group-hover:text-white/40'}`}>
           {icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${active ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
           {title}
        </span>
     </div>
     {active ? (
        <ShieldCheck size={18} className="text-primary" />
     ) : (
        <ChevronRight size={16} className="text-white/5 group-hover:text-white/20 transition-all" />
     )}
  </button>
);

export default Theme;

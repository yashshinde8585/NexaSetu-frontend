import React from 'react';
import { Activity } from 'lucide-react';

/**
 * Common dashboard section component.
 * @param {string} title - Section title
 * @param {ReactNode} icon - Section icon
 * @param {ReactNode} children - Content
 * @param {string} className - Optional className
 */
const DashboardSection = ({ title, icon = <Activity size={12} />, children, className = "" }) => {
  const sectionId = React.useId();
  return (
    <section 
      aria-labelledby={`heading-${sectionId}`}
      className={`bg-[#0d131f]/60 border border-white/[0.04] p-8 rounded-3xl shadow-2xl backdrop-blur-md relative group overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 w-1.5 h-0 group-hover:h-full bg-sky-500/40 transition-all duration-1000 ease-in-out"></div>
      <header className="flex items-center gap-4 mb-10">
        <div className="p-2 bg-slate-900/80 border border-white/5 rounded-xl shadow-inner group-hover:border-sky-500/30 transition-colors">
           {icon}
        </div>
        <h3 id={`heading-${sectionId}`} className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] translate-y-px group-hover:text-slate-200 transition-colors">
          {title}
        </h3>
      </header>
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

export default DashboardSection;

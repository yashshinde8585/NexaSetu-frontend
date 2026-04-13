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
      className={`bg-black border border-white/20 p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-none relative group overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 w-1.5 h-0 group-hover:h-full bg-primary/40 transition-all duration-1000 ease-in-out"></div>
      <header className="flex items-center gap-4 mb-10">
        <div className="p-2 bg-black border border-white/20 rounded-xl group-hover:border-primary/50 transition-colors shadow-none text-white">
           {icon}
        </div>
        <h3 id={`heading-${sectionId}`} className="text-[11px] font-black text-white/50 uppercase tracking-[0.4em] translate-y-px group-hover:text-white transition-colors">
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

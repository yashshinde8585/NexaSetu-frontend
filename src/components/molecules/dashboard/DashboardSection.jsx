import React from 'react';
import { Activity } from 'lucide-react';

/**
 * Common dashboard section component.
 * Provides a structured container with consistent header styling.
 */
const DashboardSection = ({ title, icon = <Activity size={12} />, children, className = "" }) => {
  const sectionId = React.useId();
  return (
    <section 
      aria-labelledby={`heading-${sectionId}`}
      className={`bg-[#0A0A0A] border border-white/10 p-6 md:p-8 rounded-xl relative group flex flex-col ${className}`}
    >
      <header className="flex items-center gap-4 mb-8">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300 text-white/40 group-hover:text-primary">
           {icon}
        </div>
        <h3 id={`heading-${sectionId}`} className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] transition-colors group-hover:text-white">
          {title}
        </h3>
        <div className="flex-grow h-[1px] bg-white/5 ml-2"></div>
      </header>

      <div className="relative z-10 flex-grow">
        {children}
      </div>
    </section>
  );
};

export default DashboardSection;


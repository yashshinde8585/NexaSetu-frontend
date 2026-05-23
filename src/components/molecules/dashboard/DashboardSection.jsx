import React from 'react';
import { Activity } from 'lucide-react';

// Dashboard panel layout section.
const DashboardSection = ({
  title,
  icon = <Activity size={12} />,
  children,
  className = '',
}) => {
  const sectionId = React.useId();
  return (
    <section
      aria-labelledby={`heading-${sectionId}`}
      className={`bg-white/5 border border-white/10 p-4 rounded-none relative group flex flex-col ${className}`}
    >
      <header className="flex items-center gap-2 mb-3">
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-black border border-white/10 rounded-none group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors text-white/40 group-hover:text-primary">
          {icon}
        </div>
        <h3
          id={`heading-${sectionId}`}
          className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] transition-colors group-hover:text-white truncate"
        >
          {title}
        </h3>
        <div className="flex-grow h-px bg-white/5 ml-2" />
      </header>

      <div className="relative z-10 flex-grow">{children}</div>
    </section>
  );
};

export default DashboardSection;

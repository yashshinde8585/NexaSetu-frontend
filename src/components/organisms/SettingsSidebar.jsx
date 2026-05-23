import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight, BadgeCheck } from 'lucide-react';

// Sidebar navigation panel for settings.
const SettingsSidebar = ({
  tabs,
  activeTab,
  onTabChange,
  userRole,
  jobTitle,
}) => {
  return (
    <div className="w-full lg:w-64 flex flex-col gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center justify-between h-9 px-4 rounded transition-all group relative overflow-hidden border ${
            activeTab === tab.id
              ? 'bg-white/5 border-primary/40 text-white'
              : 'bg-black border-white/5 text-white/40 hover:bg-white/5 hover:border-white/10 hover:text-white/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-white/20 group-hover:text-white/40 border-r border-white/5 pr-3'
              }
            >
              {React.cloneElement(tab.icon, { size: 14 })}
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
              {tab.label}
            </span>
          </div>
          <ChevronRight
            size={14}
            className={
              activeTab === tab.id
                ? 'text-primary transition-all'
                : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white/20'
            }
          />
          {activeTab === tab.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary group-hover:w-1 transition-all" />
          )}
        </button>
      ))}

      <div className="mt-4 p-4 bg-white/5 rounded border border-white/10 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
          <BadgeCheck size={12} className="text-primary" />
          <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">
            PERMISSION_LEVEL
          </span>
        </div>
        <div className="text-[9px] font-black text-white uppercase tracking-widest border-t border-white/5 pt-2">
          {jobTitle || userRole.replace('_', ' ')}
        </div>
      </div>
    </div>
  );
};

SettingsSidebar.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
  jobTitle: PropTypes.string,
};

export default SettingsSidebar;

import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight, BadgeCheck } from 'lucide-react';

// A sidebar component for the settings page that allows users to navigate between different configuration tabs.
const SettingsSidebar = ({
  tabs,
  activeTab,
  onTabChange,
  userRole,
  jobTitle,
}) => {
  return (
    <div className="w-full lg:w-72 flex flex-col gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center justify-between p-4 rounded-2xl transition-all group relative overflow-hidden ${
            activeTab === tab.id
              ? 'bg-primary/10 border border-primary/20 text-white shadow-lg shadow-primary/5'
              : 'glass border border-white/5 text-white/40 hover:bg-white/5 hover:text-white/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-white/20 group-hover:text-white/40'
              }
            >
              {tab.icon}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {tab.label}
            </span>
          </div>
          <ChevronRight
            size={14}
            className={
              activeTab === tab.id
                ? 'text-primary'
                : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white/20'
            }
          />
        </button>
      ))}

      <div className="mt-6 p-5 sm:p-6 glass-card rounded-2xl sm:rounded-3xl border border-white/10 ring-1 ring-white/5">
        <div className="flex items-center gap-2 mb-3">
          <BadgeCheck size={14} className="text-primary" />
          <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">
            Active Verification
          </span>
        </div>
        <div className="text-[10px] font-bold text-white uppercase tracking-tight line-clamp-1 opacity-90">
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

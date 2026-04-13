import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight, BadgeCheck } from 'lucide-react';

/**
 * Clean UI Sidebar for the Settings page.
 * Provides a structured navigation experience with high-contrast active states.
 */
const SettingsSidebar = ({
  tabs,
  activeTab,
  onTabChange,
  userRole,
  jobTitle,
}) => {
  return (
    <div className="w-full lg:w-80 flex flex-col gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center justify-between p-5 rounded-xl transition-all group relative overflow-hidden border ${
            activeTab === tab.id
              ? 'bg-white/5 border-primary/40 text-white shadow-xl shadow-primary/5'
              : 'bg-white/[0.01] border-white/5 text-white/40 hover:bg-white/5 hover:border-white/10 hover:text-white/80'
          }`}
        >
          <div className="flex items-center gap-4">
            <span
              className={
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-white/20 group-hover:text-white/40 border-r border-white/5 pr-4'
              }
            >
              {tab.icon}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {tab.label}
            </span>
          </div>
          <ChevronRight
            size={16}
            className={
              activeTab === tab.id
                ? 'text-primary transition-all'
                : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white/20'
            }
          />
          {activeTab === tab.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary group-hover:w-1.5 transition-all shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" />
          )}
        </button>
      ))}

      <div className="mt-8 p-6 bg-white/[0.02] rounded-2xl border border-white/5 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
          <BadgeCheck size={14} className="text-primary" />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
            Permission Level
          </span>
        </div>
        <div className="text-[10px] font-black text-white/80 uppercase tracking-widest border-t border-white/5 pt-3">
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

import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';

/**
 * Settings sidebar — renders as a horizontal tab bar on mobile/tablet,
 * and as a vertical sidebar on xl+ screens.
 */
const SettingsSidebar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="xl:w-52 flex flex-col gap-1.5">
      {/* Tab buttons */}
      {/* Mobile: horizontal scrollable pill tabs */}
      <div className="flex xl:flex-col gap-1.5 overflow-x-auto pb-0.5 xl:pb-0 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap h-8 px-3 rounded transition-all group relative overflow-hidden border shrink-0 xl:justify-between xl:w-full ${
              activeTab === tab.id
                ? 'bg-white/5 border-primary/40 text-white'
                : 'bg-black border-white/5 text-white/40 hover:bg-white/5 hover:border-white/10 hover:text-white/80'
            }`}
          >
            {/* Active indicator stripe */}
            {activeTab === tab.id && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
            )}

            <div className="flex items-center gap-2">
              <span
                className={
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-white/30 group-hover:text-white/50'
                }
              >
                {React.cloneElement(tab.icon, { size: 12 })}
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                {tab.label}
              </span>
            </div>

            {/* Chevron — desktop only */}
            <ChevronRight
              size={11}
              className={`hidden xl:block ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white/20'
              }`}
            />
          </button>
        ))}
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
};

export default SettingsSidebar;

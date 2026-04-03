import React from 'react';
import PropTypes from 'prop-types';

// A row component that displays a security action with an icon and description.
const SecurityActionRow = ({ icon, title, desc, action, onClick, danger }) => (
  <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all">
    <div className="flex items-center gap-4">
      <div
        className={`p-3 rounded-xl transition-all ${
          danger
            ? 'bg-status-error/10 text-status-error group-hover:bg-status-error/20'
            : 'bg-primary/5 text-primary group-hover:bg-primary/10'
        }`}
      >
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold text-white uppercase tracking-tight">
          {title}
        </h4>
        <p
          className={`text-[10px] sm:text-[11px] font-medium leading-none mt-1 opacity-40 ${
            danger ? 'text-status-error' : 'text-text-muted'
          }`}
        >
          {desc}
        </p>
      </div>
    </div>
    <button
      onClick={onClick}
      className={`px-4 py-2 border rounded-lg text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 ${
        danger
          ? 'bg-status-error/10 border-status-error/20 text-status-error hover:bg-status-error hover:text-white'
          : 'border-white/10 text-white/40 hover:bg-white/5 hover:text-white'
      }`}
    >
      {action}
    </button>
  </div>
);

SecurityActionRow.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  danger: PropTypes.bool,
};

export default SecurityActionRow;

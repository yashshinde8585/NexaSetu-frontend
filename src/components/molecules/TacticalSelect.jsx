import React from 'react';
import PropTypes from 'prop-types';

// A specialized dropdown component with a label and an optional icon.
const TacticalSelect = ({ icon, label, options, value, onChange }) => (
  <div className="relative group/field">
    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mb-2 block">
      {label}
    </label>
    <div className="relative">
      <select
        className="w-full bg-white/[0.03] border border-white/5 focus:border-primary/40 text-white rounded-2xl px-5 py-4 outline-none transition-all appearance-none cursor-pointer text-xs font-bold tracking-tight pr-12 group-hover/field:bg-white/[0.05]"
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            className="bg-[#121826] text-white py-4"
          >
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/field:text-primary transition-colors pointer-events-none">
        {icon}
      </div>
    </div>
  </div>
);

TacticalSelect.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default TacticalSelect;

import React from 'react';
import PropTypes from 'prop-types';

// A specialized input field with a label and an optional icon for tactical data entry.
const TacticalInput = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  type = 'text',
  name,
}) => (
  <div className="relative group/field">
    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mb-2 block">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        defaultValue={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full h-11 sm:h-12 bg-white/[0.03] border border-white/5 focus:border-primary/40 text-white rounded-xl sm:rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-white/10 text-xs font-bold tracking-tight ${disabled ? 'opacity-50 cursor-not-allowed border-white/0 bg-white/0' : 'group-hover/field:bg-white/[0.05]'}`}
      />
      {icon && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/field:text-primary transition-colors">
          {icon}
        </div>
      )}
    </div>
  </div>
);

TacticalInput.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  name: PropTypes.string,
};

export default TacticalInput;

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

// Custom dropdown select component.
const TacticalCustomSelect = ({
  label,
  value,
  onChange,
  options = [],
  icon,
  placeholder = 'Select option...',
  displayValue, // Optional: how to display the selected value if different from value
  renderOption, // Optional: custom renderer for options
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Find the label for the current value
  const currentOption = options.find(
    (o) => (typeof o === 'object' ? o.value : o) === value
  );
  const currentOptionLabel =
    displayValue ||
    (typeof currentOption === 'object' ? currentOption.label : currentOption) ||
    placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="text-[9px] font-black text-text-subtle uppercase tracking-[0.2em] ml-1 mb-2 block">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full min-h-[40px] bg-background-elevated border transition-all px-4 py-2 flex items-center justify-between group outline-none rounded-none ${
            isOpen
              ? 'border-primary/50'
              : 'border-border-subtle hover:border-border'
          }`}
        >
          <div className="text-[10px] font-black text-text uppercase tracking-widest truncate flex-1 text-left">
            {currentOptionLabel}
          </div>
          <div className="flex items-center gap-3 ml-2">
            {icon && (
              <div
                className={`text-text-subtler transition-colors ${isOpen ? 'text-primary' : 'group-hover:text-text-subtle'}`}
              >
                {icon}
              </div>
            )}
            <ChevronDown
              size={14}
              className={`text-text-subtle transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-background-elevated border border-border-subtle z-[999] max-h-[300px] overflow-y-auto scrollbar-none shadow-2xl block">
            <div className="p-1 space-y-0.5">
              {options && options.length > 0 ? (
                options.map((opt, idx) => {
                  if (opt.isGroup) {
                    return (
                      <div
                        key={idx}
                        className="px-3 py-2 text-[8px] font-black text-primary/40 uppercase tracking-[0.3em] bg-background-elevated border-b border-border-subtle mb-1 mt-1 first:mt-0"
                      >
                        {opt.label}
                      </div>
                    );
                  }

                  const optLabel = typeof opt === 'object' ? opt.label : opt;
                  const optValue = typeof opt === 'object' ? opt.value : opt;
                  const isSelected = value === optValue;

                  // Allow custom styles from option object
                  const customColor = opt.color || '';

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelect(optValue)}
                      className={`w-full text-left px-3 py-2.5 transition-colors group/opt flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary/10'
                          : 'hover:bg-background-elevated'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${
                          isSelected
                            ? 'text-primary'
                            : customColor ||
                              'text-text-subtle group-hover/opt:text-text'
                        }`}
                      >
                        {optLabel}
                      </span>
                      {isSelected && (
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${customColor ? customColor.replace('text-', 'bg-') : 'bg-primary'}`}
                        />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-[10px] font-black text-text-subtle uppercase tracking-widest text-center">
                  No options available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

TacticalCustomSelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  icon: PropTypes.node,
  placeholder: PropTypes.string,
  displayValue: PropTypes.string,
  renderOption: PropTypes.func,
};

export default TacticalCustomSelect;

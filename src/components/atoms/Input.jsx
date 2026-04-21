import React from 'react';
import PropTypes from 'prop-types';

// An accessible, high-density input field with focus and error states.
const Input = ({
  type = 'text',
  placeholder = '',
  className = '',
  isError = false,
  errorMsg = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`w-full px-4 py-3.5 bg-black rounded-xl border focus:outline-none transition-all text-[12px] font-black tracking-normal text-white placeholder:text-white/30 ${
          isError
            ? 'border-status-error focus:border-status-error'
            : 'border-white/20 focus:border-primary focus:bg-white/5'
        } ${className}`}
        {...props}
      />
      {isError && errorMsg && (
        <span className="text-xs text-status-error/90 mt-1 block px-1 animate-[fadeIn_200ms_ease_forwards,slideInFromTop_200ms_ease_forwards]">
          {errorMsg}
        </span>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  isError: PropTypes.bool,
  errorMsg: PropTypes.string,
  id: PropTypes.string,
};

export default Input;

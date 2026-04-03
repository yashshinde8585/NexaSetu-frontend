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
        className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all transition-duration-200 glass text-text placeholder:text-text-muted/50 ${
          isError
            ? 'border-status-error focus:ring-status-error/30'
            : 'border-white/10 focus:ring-primary/40 focus:border-primary/50'
        } ${className}`}
        {...props}
      />
      {isError && errorMsg && (
        <span className="text-xs text-status-error/90 mt-1 block px-1 animate-in slide-in-from-top-1">
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

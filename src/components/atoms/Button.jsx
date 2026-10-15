import React from 'react';
import PropTypes from 'prop-types';

// A premium, responsive button with various styles and glassmorphism.
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  isDisabled = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden group rounded-lg';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20',
    secondary:
      'bg-secondary text-white hover:bg-secondary-light shadow-lg shadow-secondary/20',
    outline:
      'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'bg-transparent text-text hover:bg-white/5',
    glass:
      'bg-[#0a0a0a]/40 backdrop-blur-[12px] text-text hover:bg-white/10 border border-white/10',
    error:
      'bg-status-error text-white hover:opacity-90 shadow-lg shadow-status-error/20',
    success:
      'bg-status-success text-white hover:opacity-90 shadow-lg shadow-status-success/20',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
    icon: 'p-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {/* Premium Shimmer Effect on Hover */}
      <span className="absolute inset-0 block h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline',
    'ghost',
    'glass',
    'error',
    'success',
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'icon']),
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;

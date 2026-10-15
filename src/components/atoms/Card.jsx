import React from 'react';
import PropTypes from 'prop-types';

// A premium container component inspired by glassmorphism design.
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  hover = true,
  as: Component = 'div',
  ...props
}) => {
  const baseStyles =
    'relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/5 transition-all duration-300';

  const variants = {
    default: 'bg-[#1E1E2E]/60 backdrop-blur-xl',
    glass: 'glass-dark',
    primary: 'bg-primary/5 border-primary/20 backdrop-blur-xl',
    secondary: 'bg-secondary/5 border-secondary/20 backdrop-blur-xl',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-6 sm:p-8',
  };

  const hoverStyles = hover
    ? 'hover:border-white/20 hover:shadow-2xl hover:shadow-black/50'
    : '';

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'glass', 'primary', 'secondary']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  className: PropTypes.string,
  hover: PropTypes.bool,
};

export default Card;

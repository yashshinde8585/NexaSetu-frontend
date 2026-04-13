import React from 'react';
import PropTypes from 'prop-types';

/**
 * A versatile skeleton loader component that provides a shimmering placeholder effect.
 */
const Skeleton = ({ className }) => {
  return (
    <div 
      className={`animate-pulse bg-white/5 rounded-lg relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
    </div>
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
};

export default Skeleton;

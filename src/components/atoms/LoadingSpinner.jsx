import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent border-indigo-500 ${sizes[size] || sizes.medium} ${className}`}
    ></div>
  );
};

export default LoadingSpinner;

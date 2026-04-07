import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * A standard, vertically centered loading state for large page views.
 * Extracted to core atoms to eliminate the 5-6 line repeated loading div pattern.
 */
const CenteredLoading = ({ size = 'large', className = '' }) => (
  <div className={`flex justify-center items-center h-[calc(100vh-64px)] ${className}`}>
    <LoadingSpinner size={size} />
  </div>
);

export default CenteredLoading;

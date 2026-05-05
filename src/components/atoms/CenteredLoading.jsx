import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const CenteredLoading = ({ size = 'large', className = '' }) => (
  <div className={`flex justify-center items-center h-[calc(100vh-64px)] ${className}`}>
    <LoadingSpinner size={size} />
  </div>
);

export default CenteredLoading;

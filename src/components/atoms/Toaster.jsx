import React from 'react';
import { Toaster as HotToaster } from 'react-hot-toast';

/**
 * Global Notification Portal
 * Configures the visual aesthetic and positioning of system-wide feedback.
 */
const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#000',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '10px',
          fontWeight: '900',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          borderRadius: '2px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#fff',
            secondary: '#000',
          },
        },
        error: {
          style: {
            border: '1px solid rgba(239, 68, 68, 0.5)',
            background: '#000',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default Toaster;

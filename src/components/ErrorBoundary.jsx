import React from 'react';

/**
 * 🛡️ Global Error Boundary
 * Prevents a single component crash from triggering the "White Screen of Death".
 * Provides a graceful fallback UI and logs the error for production monitoring.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry
    console.error('[CRITICAL] UI Component Crash Detected:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Premium, monochromatic fallback UI matching NexaSetu aesthetic
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            System Integrity Compromised
          </h1>
          <p style={{ color: '#888888', marginBottom: '2rem', maxWidth: '400px' }}>
            A critical UI component has failed. The system has been locked to prevent further state corruption.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Force Reboot
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

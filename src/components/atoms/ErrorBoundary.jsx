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
        <div
          style={{
            height: '100%',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            color: '#ffffff',
            fontFamily: 'Inter, system-ui, sans-serif',
            textAlign: 'center',
            padding: '2rem',
            border: '1px border-white/10',
          }}
        >
          <div
            style={{
              height: '40px',
              border: '2px solid #3b82f6',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              fontWeight: '900',
              fontSize: '20px',
            }}
          >
            !
          </div>
          <h1
            style={{
              fontSize: '12px',
              fontWeight: '900',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.4em',
            }}
          >
            Component Rendering Failure
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '32px',
              maxWidth: '300px',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              lineHeight: '2',
            }}
          >
            The UI encountered an unexpected state. Partial system functionality
            may be affected.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '0',
              fontSize: '10px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              cursor: 'pointer',
            }}
          >
            Attempt Recovery
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-background-light p-10 rounded-3xl border border-status-error/20 shadow-2xl">
            <div className="w-20 h-20 bg-status-error/10 text-status-error rounded-full flex items-center justify-center mx-auto mb-6">
               <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-4 tracking-tighter">System Failure</h1>
            <p className="text-text-muted mb-8 text-sm italic font-medium leading-relaxed">
              The interface encountered an unexpected exception. Our failsafe systems have isolated the error.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary-dark text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-95 uppercase text-xs tracking-widest"
            >
              Reboot Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React from 'react';
import { AccessDenied, NotFound, AuthRequired, ServerError } from './SystemStates';
import CenteredLoading from '../atoms/CenteredLoading';

const ResilientPage = ({ 
  isLoading, 
  error, 
  children, 
  loadingMessage,
  onRetry 
}) => {
  if (isLoading) {
    return <CenteredLoading message={loadingMessage} />;
  }

  if (error) {
    const uiState = error.uiState;

    switch (uiState) {
      case 'auth-required':
        return <AuthRequired />;
      case 'access-denied':
        return <AccessDenied />;
      case 'not-found':
        return <NotFound />;
      case 'server-error':
        return <ServerError onRetry={onRetry} />;
      default:
        // Generic error fallback that is NOT the "System Integrity Compromised" screen
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
             <div className="w-1.5 h-12 bg-status-error mb-6 rounded-full" />
             <h2 className="text-lg font-black text-white uppercase tracking-tight mb-2">Sync Failure</h2>
             <p className="text-white/40 text-xs max-w-xs mb-8">{error.message || 'The data uplink is currently unstable.'}</p>
             <button 
               onClick={onRetry || (() => window.location.reload())}
               className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-primary-light transition-colors"
             >
               Force Re-Sync
             </button>
          </div>
        );
    }
  }

  // Ensure children only render if data is likely present
  // This prevents crashes from "cannot read property of undefined"
  return <>{children}</>;
};

export default ResilientPage;

import React from 'react';
import { ShieldAlert, FileSearch, Lock, AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';

const StateLayout = ({ icon: Icon, title, message, actionText, onAction, errorCode }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full"></div>
        <Icon className="text-white relative z-10 opacity-80" size={64} strokeWidth={1} />
      </div>
      
      {errorCode && (
        <span className="text-[10px] font-mono text-white/40 mb-2 tracking-[0.2em] uppercase">
          Error Code: {errorCode}
        </span>
      )}
      
      <h1 className="text-2xl font-black text-white mb-3 tracking-tight uppercase">
        {title}
      </h1>
      
      <p className="text-white/60 text-sm max-w-md mb-8 leading-relaxed font-medium">
        {message}
      </p>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/')}
          className="border-white/10 text-white/60 hover:text-white"
        >
          <Home size={14} className="mr-2" />
          Home
        </Button>
        
        {actionText && (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onAction}
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export const AccessDenied = () => (
  <StateLayout 
    icon={ShieldAlert}
    title="Access Restricted"
    message="Your current credentials do not have the clearance required to access this sector of the workspace."
    errorCode="403_FORBIDDEN"
    actionText="Request Access"
    onAction={() => window.location.href = 'mailto:admin@nexasetu.ai'}
  />
);

export const NotFound = () => (
  <StateLayout 
    icon={FileSearch}
    title="Resource Not Found"
    message="The mission data you are looking for has been moved, deleted, or never existed in this timeline."
    errorCode="404_NOT_FOUND"
  />
);

export const AuthRequired = () => {
  const navigate = useNavigate();
  return (
    <StateLayout 
      icon={Lock}
      title="Authentication Required"
      message="This secure zone requires an active session. Please authenticate to proceed with the mission."
      errorCode="401_UNAUTHORIZED"
      actionText="Sign In"
      onAction={() => navigate('/login')}
    />
  );
};

export const ServerError = () => (
  <StateLayout 
    icon={AlertTriangle}
    title="System Instability"
    message="The uplink to the tactical server has encountered a critical synchronization failure. We are attempting to restore connection."
    errorCode="500_SERVER_ERROR"
    actionText="Retry Connection"
    onAction={() => window.location.reload()}
  />
);

export default StateLayout;

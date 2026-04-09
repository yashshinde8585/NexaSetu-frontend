import React, { useState } from 'react';
import { X, GitBranch, Shield, Zap, Info, AlertCircle } from 'lucide-react';

const ConnectGithubModal = ({ isOpen, onClose, onConnect, isLoading, error }) => {
  const [token, setToken] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setToken('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity animate-in fade-in" 
        onClick={handleClose} 
      />
      
      <div className="relative w-full max-w-md bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-xl">
              <GitBranch className="text-secondary" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Connect GitHub</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Connect to GitHub</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/5 rounded-full text-white/30 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-status-error/10 border border-status-error/30 rounded-xl p-4 flex gap-3 text-status-error animate-in slide-in-from-top-2">
              <AlertCircle className="shrink-0" size={18} />
              <p className="text-xs font-medium leading-tight">{error}</p>
            </div>
          )}

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex gap-4">
            <Info className="text-primary shrink-0" size={20} />
            <p className="text-[11px] text-white/70 leading-relaxed">
              Link your workspace to GitHub to enable task tracking and activity metrics.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">
                Personal Access Token
              </label>
              <input 
                type="password" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-sm text-white focus:border-primary/50 transition-all outline-none"
                placeholder="ghp_xxxxxxxxxxxx"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 ml-1">
                <Shield size={12} /> Required Scopes
              </h4>
              <ul className="grid grid-cols-2 gap-2">
                {['repo', 'admin:repo_hook', 'user', 'read:org'].map(scope => (
                  <li key={scope} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg text-[9px] text-white/60 font-bold uppercase tracking-wider">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {scope}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-sm font-bold text-white/40 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!token || isLoading}
            onClick={() => onConnect(token)}
            className="flex-1 bg-primary text-black px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Zap className="animate-spin" size={16} />
            ) : (
              <Zap size={16} />
            )}
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConnectGithubModal;

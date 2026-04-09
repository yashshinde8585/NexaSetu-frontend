import React, { useState } from 'react';
import { X, Send, User, Shield, Briefcase, Loader2 } from 'lucide-react';

const InviteUserModal = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('SOFTWARE_ENGINEER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const roles = [
    { value: 'WORKSPACE_MANAGER', label: 'Workspace Manager' },
    { value: 'VP_ENGINEERING', label: 'VP Engineering' },
    { value: 'ENGINEERING_MANAGER', label: 'Engineering Manager' },
    { value: 'TECH_LEAD', label: 'Tech Lead' },
    { value: 'SENIOR_ENGINEER', label: 'Senior Engineer' },
    { value: 'SOFTWARE_ENGINEER', label: 'Software Engineer' },
    { value: 'JUNIOR_ENGINEER', label: 'Junior Engineer' },
    { value: 'QA_LEAD', label: 'QA Lead' },
    { value: 'PEOPLE_OPS', label: 'People Ops / HR' },
    { value: 'INTERN', label: 'Intern' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onInvite({ email, role });
      setEmail('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-lg bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <User className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Invite Collaborator</h2>
              <p className="text-xs text-white/40">Expanding the organizational collective.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-white/30 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {error && (
            <div className="p-3 bg-status-error/10 border border-status-error/30 rounded-xl text-status-error text-xs font-medium animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Email Address</label>
            <div className="relative group">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="roshan@nexasetu.ai"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all"
              />
              <Send className="absolute right-3 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors" size={18} />
            </div>
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Assigned Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value} className="bg-slate-900">{r.label}</option>
                ))}
              </select>
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            </div>
            <p className="text-[10px] text-white/20 mt-2 px-1 italic">Permissions are inherited automatically based on the selected role profile.</p>
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-sm font-bold text-white transition-all shadow-lg active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] px-6 py-3 bg-primary text-black rounded-xl text-sm font-bold transition-all hover:brightness-110 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Send Invitation
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default InviteUserModal;

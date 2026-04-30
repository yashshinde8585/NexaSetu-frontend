import React, { useState } from 'react';
import { X, User, Shield, MapPin, Mail, Save, UserMinus, UserPlus, AlertCircle } from 'lucide-react';

const UserEditModal = ({ isOpen, onClose, user, onSave, onDeactivate }) => {
  const [role, setRole] = useState(user?.role);
  const [showConfirm, setShowConfirm] = useState(false);

  // Sync state when user changes or modal opens
  React.useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const roles = [
    'WORKSPACE_ADMIN', 'WORKSPACE_MANAGER', 'VP_ENGINEERING', 
    'ENGINEERING_MANAGER', 'TECH_LEAD', 'SENIOR_ENGINEER', 
    'SOFTWARE_ENGINEER', 'JUNIOR_ENGINEER', 'QA_LEAD', 
    'PEOPLE_OPS', 'INTERN'
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-lg bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Confirmation Overlay */}
        {showConfirm && (
          <div className="absolute inset-0 z-[110] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-status-error/20 flex items-center justify-center text-status-error mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Update Account Status</h3>
            <p className="text-white/40 text-sm mb-8">
              Are you sure you want to {user.status === 'Active' ? 'deactivate' : 'reactivate'} <span className="text-white font-bold">{user.name}</span>? 
              {user.status === 'Active' && " This will revoke all workspace access immediately."}
            </p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onDeactivate({ userId: user.id, status: user.status === 'Active' ? 'Deactivated' : 'Active' });
                  setShowConfirm(false);
                  onClose();
                }}
                className={`flex-1 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  user.status === 'Active' ? 'bg-status-error text-white shadow-lg shadow-status-error/20' : 'bg-status-success text-black'
                }`}
              >
                Confirm Change
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-8 py-8 border-b border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-white/40">
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    <Shield size={10} /> {user.role}
                  </div>
                  <span className="text-xs">{user.email}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-white/30 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 text-white">
          
          {/* Role Change */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1 flex items-center gap-2">
              <Shield size={12} className="text-primary" />
              Member Role
            </label>
            <div className="relative group">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:border-primary/50 transition-all outline-none appearance-none hover:bg-white/[0.08] cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 py-2">
                    {r.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-primary transition-colors">
                <Shield size={16} />
              </div>
            </div>
            <p className="text-[10px] text-white/20 px-1 italic">Permissions update as soon as you save.</p>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-white/5">
             <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1 mb-3 block">Danger Zone</label>
             <button
               onClick={() => setShowConfirm(true)}
               className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                 user.status === 'Active'
                   ? 'bg-status-error/5 border-status-error/20 text-status-error hover:bg-status-error/10'
                   : 'bg-status-success/5 border-status-success/20 text-status-success hover:bg-status-success/10'
               }`}
             >
               <div className="flex items-center gap-3">
                 {user.status === 'Active' ? <UserMinus size={18} /> : <UserPlus size={18} />}
                 <div className="text-left">
                    <p className="text-sm font-bold">{user.status === 'Active' ? 'Deactivate Member' : 'Activate Member'}</p>
                    <p className="text-[10px] opacity-60">Control workspace access</p>
                 </div>
               </div>
               <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                 <X size={14} />
               </div>
             </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 bg-white/[0.01] border-t border-white/5 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-sm font-bold text-white/40 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({ userId: user.id, role });
              onClose();
            }}
            className="flex-[2] bg-primary text-black px-6 py-3 rounded-2xl text-sm font-bold hover:brightness-110 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserEditModal;

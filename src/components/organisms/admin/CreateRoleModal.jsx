import React, { useState } from 'react';
import { X, Shield, CheckCircle } from 'lucide-react';

const CreateRoleModal = ({
  isOpen,
  onClose,
  availablePermissions,
  onCreate,
}) => {
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  if (!isOpen) return null;

  const togglePermission = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleCreate = async () => {
    if (!roleName.trim()) return alert('Role name is required');
    await onCreate({ roleName, permissions: selectedPermissions });
    setRoleName('');
    setSelectedPermissions([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create New Role</h2>
              <p className="text-xs text-white/40 mt-0.5">
                Design a custom organizational role with specific access
                controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
              Role Nomenclature
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Lead Research Engineer"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
              Assign Capability Permissions
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availablePermissions.map((perm) => {
                const isActive = selectedPermissions.includes(perm);
                return (
                  <div
                    key={perm}
                    onClick={() => togglePermission(perm)}
                    className={`
                      p-4 rounded-2xl border transition-all cursor-pointer group
                      ${
                        isActive
                          ? 'bg-primary/5 border-primary/40'
                          : 'bg-white/2 border-white/5 hover:border-white/20'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-white/50'}`}
                      >
                        {perm.replace(/_/g, ' ')}
                      </p>
                      <div
                        className={`
                        w-4 h-4 rounded-full border flex items-center justify-center
                        ${isActive ? 'bg-primary border-primary text-black' : 'border-white/10 text-transparent'}
                      `}
                      >
                        <CheckCircle size={10} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-white/2 border-t border-white/5 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-all"
          >
            Discard
          </button>
          <button
            onClick={handleCreate}
            className="px-8 py-3 bg-primary text-black rounded-xl text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
          >
            Provision Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;

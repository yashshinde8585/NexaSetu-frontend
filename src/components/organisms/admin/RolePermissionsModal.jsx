import React, { useState, useEffect } from 'react';
import { X, Shield, CheckCircle } from 'lucide-react';

const RolePermissionsModal = ({
  isOpen,
  onClose,
  role,
  availablePermissions,
  onSave,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (role) {
      setSelectedPermissions(role.permissions || []);
    }
  }, [role]);

  if (!isOpen || !role) return null;

  const togglePermission = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSave = async () => {
    await onSave(role.role, selectedPermissions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Manage Access: {role.role}
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                Define granular permissions for this organizational role
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

        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePermissions.map((perm) => {
              const isActive = selectedPermissions.includes(perm);
              const isSuper = role.role === 'WORKSPACE_ADMIN' && perm === '*';

              return (
                <div
                  key={perm}
                  onClick={() => !isSuper && togglePermission(perm)}
                  className={`
                    p-4 rounded-2xl border transition-all cursor-pointer group
                    ${
                      isActive
                        ? 'bg-primary/5 border-primary/40'
                        : 'bg-white/2 border-white/5 hover:border-white/20'
                    }
                    ${isSuper ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-semibold mb-1 ${isActive ? 'text-primary' : 'text-white/70'}`}
                      >
                        {perm.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
                        {perm}
                      </p>
                    </div>
                    <div
                      className={`
                      w-5 h-5 rounded-full border flex items-center justify-center transition-all
                      ${
                        isActive
                          ? 'bg-primary border-primary text-black'
                          : 'border-white/10 text-transparent'
                      }
                    `}
                    >
                      <CheckCircle size={12} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-8 py-6 bg-white/2 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-white/30">
            <span className="text-primary font-bold">
              {selectedPermissions.length}
            </span>{' '}
            permissions assigned
          </p>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white/50 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2.5 bg-primary text-black rounded-xl text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
            >
              Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsModal;

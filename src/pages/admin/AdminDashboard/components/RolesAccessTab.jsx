import React from 'react';
import { Shield, Settings as SettingsIcon } from 'lucide-react';
import DashboardSection from '../../../../components/molecules/dashboard/DashboardSection';

const RolesAccessTab = ({
  roles,
  setEditingRole,
  setIsCreateRoleModalOpen,
}) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <DashboardSection title="ROLES & PERMISSIONS" icon={<Shield size={14} />}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
              STATUS: ACTIVE
            </span>
            <button
              onClick={() => setIsCreateRoleModalOpen(true)}
              className="text-[9px] font-black uppercase text-primary tracking-widest hover:brightness-125 cursor-pointer"
            >
              ADD ROLE
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r, idx) => {
              const roleName = r.role || '';
              const permissions = Array.isArray(r.permissions)
                ? r.permissions
                : [];
              const stableKey = roleName || r.id || r._id || `role-${idx}`;
              return (
                <div
                  key={stableKey}
                  onClick={() => setEditingRole(r)}
                  className="group p-4 bg-white/5 border border-white/10 rounded-none flex flex-col gap-3 cursor-pointer hover:bg-white/10 transition-colors justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      {roleName.replace(/_/g, ' ')}
                    </span>
                    <SettingsIcon
                      size={12}
                      className="text-white/10 group-hover:text-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {permissions.slice(0, 3).map((perm) => (
                      <span
                        key={perm}
                        className="text-[7px] font-black bg-white/5 text-white/40 px-1 py-0.5"
                      >
                        {perm}
                      </span>
                    ))}
                    {permissions.length > 3 && (
                      <span className="text-[7px] font-black bg-primary/10 text-primary px-1 py-0.5">
                        +{permissions.length - 3} MORE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                    <span className="text-[7px] font-black text-white/20">
                      {r.isCustom ? 'CUSTOM ROLE' : 'SYSTEM DEFAULT'}
                    </span>
                    <span className="text-[7px] text-white/30 uppercase">
                      Config permissions
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DashboardSection>
    </div>
  );
};

export default RolesAccessTab;

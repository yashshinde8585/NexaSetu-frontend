import React from 'react';

const AdminHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-white/5 pb-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white uppercase">
          Workspace Administrator
        </h1>
        <p className="text-[10px] text-text-muted mt-0.5 font-semibold">
          Manage workspaces, users, roles, permissions, and system settings.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 lg:gap-2 text-[9px] font-black uppercase tracking-widest">
        {/* Filters/Actions could be placed here if needed in the future */}
      </div>
    </div>
  );
};

export default AdminHeader;

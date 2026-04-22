import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Shield, Settings as SettingsIcon, Activity, Bell, Lock, Globe,
  Link as LinkIcon, CheckCircle, AlertCircle, MoreVertical, Plus, RefreshCw,
  Clock, GitBranch, MessageSquare, UserPlus, UserMinus, Zap, Layout,
  ChevronLeft, Search, Trash2, X, RefreshCcw
} from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useAuth } from '../context/AuthContext';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';
import InviteUserModal from '../components/organisms/admin/InviteUserModal';
import WorkspaceSettingsModal from '../components/organisms/admin/WorkspaceSettingsModal';
import UserEditModal from '../components/organisms/admin/UserEditModal';
import CreateTeamModal from '../components/organisms/admin/CreateTeamModal';
import RolePermissionsModal from '../components/organisms/admin/RolePermissionsModal';
import CreateRoleModal from '../components/organisms/admin/CreateRoleModal';
import ConnectGithubModal from '../components/organisms/admin/ConnectGithubModal';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import GithubService from '../api/githubService';

/**
 * Admin Dashboard
 * Core command center for workspace administration and user management.
 */
const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    error,
    inviteUser,
    updateUserRole,
    deactivateUser,
    updateSettings,
    filters,
    createTeam,
    deleteTeam,
    updateRolePermissions,
    createRole
  } = useAdminDashboard();
  
  // Modal States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeSetting, setActiveSetting] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [connectingIntegration, setConnectingIntegration] = useState(null);

  // Search & Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 7;

  const connectMutation = useMutation({
    mutationFn: (token) => GithubService.connectGithub(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setConnectingIntegration(null);
    }
  });

  const handleConnect = (tool) => {
    if (tool.name === 'GitHub') {
      setConnectingIntegration(tool);
    } else {
      alert(`${tool.name} integration is currently in pilot phase.`);
    }
  };

  const { filteredUsers, paginatedUsers, totalPages, startIndex, endIndex } = useMemo(() => {
    const rawUsers = data?.users || [];
    const filtered = rawUsers.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filtered.slice(start, end);
    const pages = Math.ceil(filtered.length / itemsPerPage);

    return {
      filteredUsers: filtered,
      paginatedUsers: paginated,
      totalPages: pages,
      startIndex: filtered.length > 0 ? start + 1 : 0,
      endIndex: Math.min(end, filtered.length)
    };
  }, [data?.users, searchQuery, currentPage]);

  if (isLoading) return <CenteredLoading />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-center font-mono border border-status-error/20">
        <AlertCircle size={48} className="text-status-error mb-6" />
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Connection Error</h2>
        <p className="text-white/40 max-w-md text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-8">
            We couldn't load the admin dashboard. This might be due to a connection issue or an expired session.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-3 px-8 py-3 bg-white text-black text-[10px] uppercase font-bold tracking-[0.2em] rounded-lg hover:bg-white/80 transition-all active:scale-95"
        >
          <RefreshCcw size={14} /> Retry Connection
        </button>
      </div>
    );
  }

  const {
    overview,
    roles = [],
    availablePermissions = [],
    teams = [],
    integrations = [],
    settings = {}
  } = data || {};

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      
      {/* 1. System Metrics Strip */}
      <div id="admin-metrics-strip" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricStripItem 
            icon={<Users size={14} />} 
            label="Total Users" 
            value={overview?.totalUsers || 0} 
            color="text-primary" 
            accent="bg-primary"
        />
        <MetricStripItem 
            icon={<Shield size={14} />} 
            label="Active Roles" 
            value={overview?.activeRoles || 0} 
            color="text-status-success" 
            accent="bg-status-success"
        />
        <MetricStripItem 
            icon={<LinkIcon size={14} />} 
            label="Integrations" 
            value={overview?.integrations || 0} 
            color="text-status-warning" 
            accent="bg-status-warning"
        />
        <MetricStripItem 
            icon={<Activity size={14} />} 
            label="System Status" 
            value={overview?.status || 'ONLINE'} 
            color="text-status-info" 
            accent="bg-status-info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Column: User Operations */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            <DashboardSection title="User Management" icon={<Users size={14} />}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6 px-1">
              <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
                <input
                  type="text"
                  placeholder="SEARCH_OPERATIVES..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 bg-black border border-white/10 rounded-none px-4 pl-10 text-[10px] text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/10 font-black uppercase tracking-widest"
                />
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="h-9 px-6 bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-none transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <UserPlus size={14} /> INVITE_OPERATIVE
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-white/20 text-[9px] uppercase font-black tracking-[0.2em] border-b border-white/10">
                    <th className="pb-3 px-2">USER DETAILS</th>
                    <th className="pb-3 px-2">ROLE</th>
                    <th className="pb-3 px-2 text-center">STATUS</th>
                    <th className="pb-3 px-2 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="text-[10px] font-black uppercase tracking-widest">
                  {paginatedUsers.length > 0 ? paginatedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group cursor-default">
                      <td className="py-3 px-2 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-white/20 uppercase">
                             {u.name.substring(0, 2)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white group-hover:text-primary transition-colors">{u.name}</span>
                            <span className="text-[8px] text-white/20 tracking-tighter uppercase font-black">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 border-b border-white/5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                           {u.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-2 border-b border-white/5">
                        <div className="flex items-center justify-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-none ${u.status === 'Active' ? 'bg-status-success' : 'bg-status-error'}`} />
                           <span className={`text-[8px] font-black uppercase tracking-widest ${u.status === 'Active' ? 'text-status-success' : 'text-status-error'}`}>{u.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right border-b border-white/5">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded-none bg-white/5 border border-white/10 text-white/20 hover:text-primary hover:border-primary/40 transition-colors"
                        >
                          <SettingsIcon size={12} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-16 text-center border-b border-white/5">
                        <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">NO_USER_RECORDS_MATCHING_CRITERIA</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredUsers.length > itemsPerPage && (
              <div className="py-4 flex items-center justify-between border-t border-white/5 mt-2">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                   OPS_LOG: {startIndex} - {endIndex} / {filteredUsers.length} ENTRIES
                </span>
                 <div className="flex items-center gap-2">
                   <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-1.5 rounded-none bg-white/5 border border-white/10 text-white/20 hover:text-white disabled:opacity-10 transition-colors"
                   >
                    <ChevronLeft size={14} />
                   </button>
                   <div className="flex gap-1 px-2">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-6 h-6 rounded-none text-[9px] font-black transition-all ${currentPage === i + 1 ? 'bg-primary text-black' : 'text-white/20 hover:text-white'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                   </div>
                   <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-1.5 rounded-none bg-white/5 border border-white/10 text-white/20 hover:text-white disabled:opacity-10 transition-colors"
                   >
                    <ChevronLeft size={14} className="rotate-180" />
                   </button>
                </div>
              </div>
            )}
          </DashboardSection>

          <DashboardSection title="INTEGRATIONS" icon={<LinkIcon size={14} />}>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {integrations.map((tool, i) => (
                <button 
                  key={i} 
                  onClick={() => handleConnect(tool)}
                  className="group bg-white/5 border border-white/10 p-4 rounded-none flex flex-col items-center gap-3 transition-all hover:bg-white/10"
                >
                  <div className="w-10 h-10 rounded-none bg-black border border-white/10 flex items-center justify-center text-white/10 group-hover:text-primary transition-colors">
                     {tool.icon === 'github' ? <GitBranch size={18} /> : tool.icon === 'slack' ? <MessageSquare size={18} /> : <LinkIcon size={18} />}
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{tool.name}</span>
                    <div className="flex items-center gap-1">
                       <div className={`w-1.5 h-1.5 rounded-none ${tool.status === 'connected' ? 'bg-status-success' : 'bg-white/10'}`} />
                       <span className="text-[7px] font-black uppercase tracking-widest text-white/20">{tool.status === 'connected' ? 'CONNECTED' : 'OFFLINE'}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-4 text-[8px] text-white/10 uppercase font-black tracking-[0.2em] text-center border-t border-white/5 pt-4">UPGRADE TO CORE_OPERATOR FOR EXPANDED ACCESS.</p>
          </DashboardSection>
        </div>

        {/* Sidebar Column: Strategic Config */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <DashboardSection title="SQUAD_DIRECTIVE" icon={<Zap size={14} />}>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-1">
                 <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">TOTAL_UNITS: {teams.length}</span>
                 <button 
                    onClick={() => navigate('/admin/teams/create')}
                    className="p-1 px-3 bg-white/5 border border-white/10 rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-colors flex items-center gap-2"
                  >
                    <Plus size={12} /> ADD_UNIT
                  </button>
              </div>
              {teams.map((t, i) => (
                <div key={i} className="group p-4 bg-white/5 border border-white/10 rounded-none flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{t.name}</span>
                    <span className="text-[8px] text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
                       <Users size={12} className="text-primary/40" /> {t.members}_OPERATIVES
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => navigate(`/admin/teams/edit/${t.id}`)} className="p-1.5 text-white/20 hover:text-primary transition-colors"><SettingsIcon size={12} /></button>
                    <button onClick={() => deleteTeam(t.id)} className="p-1.5 text-white/20 hover:text-status-error transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>

          <DashboardSection title="ROLES & PERMISSIONS" icon={<Shield size={14} />}>
             <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                   <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">SECURITY: ENFORCED</span>
                   <button 
                      onClick={() => setIsCreateRoleModalOpen(true)}
                      className="text-[9px] font-black uppercase text-primary tracking-widest hover:brightness-125"
                    >
                      ADD_ROLE
                    </button>
                </div>
                 <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  {roles.map((r, i) => (
                    <div 
                      key={i} 
                      onClick={() => setEditingRole(r)}
                      className="group p-3 bg-white/5 border border-white/10 rounded-none flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest">{r.role.replace(/_/g, ' ')}</span>
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-8 bg-white/5 rounded-none overflow-hidden border border-white/5">
                          <div className="h-full bg-primary w-full opacity-40" />
                        </div>
                        <SettingsIcon size={12} className="text-white/10 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </DashboardSection>

          <DashboardSection title="WORKSPACE_SETTINGS" icon={<SettingsIcon size={14} />}>
            <div className="flex flex-col gap-2 py-1">
              {[
                { label: 'TIMEZONE', key: 'timezone', value: settings?.timezone, icon: <Globe size={14} /> },
                { label: 'WORK_HOURS', key: 'workingHours', value: settings?.workingHours, icon: <Clock size={14} /> },
                { label: 'POLICIES', key: 'notificationRules', value: settings?.notificationRules, icon: <Shield size={14} /> },
                { label: 'DEFAULTS', key: 'projectDefaults', value: settings?.projectDefaults, icon: <Zap size={14} /> }
              ].map((setting, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSetting(setting)}
                  className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-none hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-white/10 group-hover:text-primary transition-colors">{setting.icon}</div>
                    <span className="text-[9px] font-black text-white/30 group-hover:text-white transition-colors uppercase tracking-[0.2em]">{setting.label}</span>
                  </div>
                  <span className="text-[9px] font-black text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-widest truncate max-w-[100px]">{setting.value || 'DEFAULT'}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[8px] text-white/5 text-center uppercase tracking-widest font-black">SYSTEM_WIDE_DIRECTIVES_ENFORCED.</p>
          </DashboardSection>
        </div>
      </div>

      {/* Modals */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={inviteUser}
      />

      <WorkspaceSettingsModal
        isOpen={!!activeSetting}
        onClose={() => setActiveSetting(null)}
        setting={activeSetting}
        currentValue={activeSetting ? settings[activeSetting.key] : ''}
        onSave={(newVal) => updateSettings({ ...settings, [activeSetting.key]: newVal })}
      />

      <UserEditModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={(userId, role) => updateUserRole({ userId, role })}
        onDeactivate={(userId, status) => deactivateUser({ userId, status })}
      />

      <CreateTeamModal 
        isOpen={isCreateTeamModalOpen} 
        onClose={() => setIsCreateTeamModalOpen(false)} 
        onCreate={createTeam}
      />

      <RolePermissionsModal
        isOpen={!!editingRole}
        onClose={() => setEditingRole(null)}
        role={editingRole}
        availablePermissions={availablePermissions}
        onSave={updateRolePermissions}
      />

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        availablePermissions={availablePermissions}
        onCreate={createRole}
      />

      <ConnectGithubModal
        isOpen={!!connectingIntegration}
        onClose={() => setConnectingIntegration(null)}
        onConnect={(token) => connectMutation.mutate(token)}
        isLoading={connectMutation.isLoading}
        error={connectMutation.error?.message || connectMutation.error?.response?.data?.message}
      />
    </div>
  );
};

export default AdminDashboard;

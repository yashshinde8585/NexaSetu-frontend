import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Shield,
  Settings as SettingsIcon,
  Activity,
  Bell,
  Lock,
  Globe,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Plus,
  RefreshCw,
  Clock,
  GitBranch,
  MessageSquare,
  UserPlus,
  UserMinus,
  Zap,
  Layout,
  ChevronLeft,
  Search,
  Trash2,
  X,
  RefreshCcw
} from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useAuth } from '../context/AuthContext';
import CenteredLoading from '../components/atoms/CenteredLoading';
import Badge from '../components/atoms/Badge';
import InviteUserModal from '../components/organisms/admin/InviteUserModal';
import WorkspaceSettingsModal from '../components/organisms/admin/WorkspaceSettingsModal';
import UserEditModal from '../components/organisms/admin/UserEditModal';
import CreateTeamModal from '../components/organisms/admin/CreateTeamModal';
import RolePermissionsModal from '../components/organisms/admin/RolePermissionsModal';
import CreateRoleModal from '../components/organisms/admin/CreateRoleModal';
import ConnectGithubModal from '../components/organisms/admin/ConnectGithubModal';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import GithubService from '../api/githubService';

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
    setFilters,
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
  const itemsPerPage = 5;

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

  // Performance Optimization: Memoized Filtering & Pagination
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

  // Error Presentation Layer
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-status-error/10 border border-status-error/20 rounded-[2rem] flex items-center justify-center mb-6 animate-pulse">
          <AlertCircle size={40} className="text-status-error" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Telemetry Interrupted</h2>
        <p className="text-white/40 max-w-md text-sm leading-relaxed mb-8">
          The link to Workspace Administration has encountered a protocol error. {error?.message || 'Access denied by security gateway.'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-3 px-8 py-3 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <RefreshCcw size={18} /> Re-establish Link
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
    settings = {},
    alerts = []
  } = data || {};

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-10 bg-black min-h-screen text-white/90">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-1 animate-in slide-in-from-left duration-700">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
              <Layout className="text-primary" size={24} />
            </div>
            Administration
          </h1>
          <p className="text-xs md:text-sm text-white/40 font-medium">Manage workspace infrastructure and human capital.</p>
        </div>
        <div className="flex items-center gap-3 animate-in slide-in-from-right duration-700">
          <button 
            onClick={() => queryClient.invalidateQueries(['admin-dashboard'])}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden xs:inline text-[10px] uppercase tracking-widest">Resync</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-black font-black rounded-xl text-xs transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95">
            <Zap size={14} />
            <span className="text-[10px] uppercase tracking-widest">Upgrade</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 animate-in fade-in zoom-in-95 duration-700 delay-100">
        {[
          { label: 'Workspace', value: overview?.name || 'Central', icon: <Globe size={18} />, color: 'primary' },
          { label: 'Total Users', value: overview?.totalUsers || 0, icon: <Users size={18} />, color: 'secondary' },
          { label: 'Active Roles', value: overview?.activeRoles || 0, icon: <Shield size={18} />, color: 'status-success' },
          { label: 'Integrations', value: overview?.integrations || 0, icon: <LinkIcon size={18} />, color: 'status-warning' },
          { label: 'System status', value: overview?.status || 'Online', icon: <Activity size={18} />, color: 'status-success' }
        ].map((stat, i) => (
          <div 
            key={i} 
            className={`bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-${stat.color}/30 transition-all group relative overflow-hidden ${i === 4 ? 'col-span-2 lg:col-span-1' : ''}`}
          >
            <div className={`absolute top-0 right-0 w-12 h-12 bg-${stat.color}/5 rounded-full blur-xl translate-x-1/2 -translate-y-1/2 group-hover:bg-${stat.color}/10 transition-colors`} />
            <div className={`p-2.5 rounded-xl bg-${stat.color}/10 text-${stat.color} border border-${stat.color}/20 group-hover:scale-110 transition-transform relative z-10`}>
              {stat.icon}
            </div>
            <div className="relative z-10">
              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-white/30 mb-0.5">{stat.label}</p>
              <p className="text-lg md:text-xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        
        {/* Main User Feed */}
        <div className="xl:col-span-8 space-y-4">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="px-6 py-6 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Users className="text-primary" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Operator Registry</h2>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Personnel & Access Management</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative group w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
                  <input
                    type="text"
                    placeholder="Search personnel..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/10 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] uppercase tracking-[0.2em] text-white/20 bg-black/40">
                    <th className="px-6 py-4 font-black">Operator</th>
                    <th className="px-6 py-4 font-black hidden sm:table-cell">Clearance Role</th>
                    <th className="px-6 py-4 font-black">Status</th>
                    <th className="px-6 py-4 font-black hidden lg:table-cell">Last Beacon</th>
                    <th className="px-6 py-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedUsers.length > 0 ? paginatedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-white/40">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-white group-hover:text-primary transition-colors">{u.name}</span>
                            <span className="text-[10px] text-white/20 font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Shield size={12} className="text-primary-light/40" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                            {u.role.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-status-success' : 'bg-status-error'} shadow-[0_0_8px_currentColor]`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{u.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-mono">
                          <Clock size={10} />
                          {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : 'OFFLINE'}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/20 hover:text-primary hover:border-primary/20 transition-all hover:scale-110"
                        >
                          <SettingsIcon size={14} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-white/10">
                          <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/5 flex items-center justify-center">
                            <Search size={32} />
                          </div>
                          <p className="text-xs font-black uppercase tracking-widest">No matching operators found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            {filteredUsers.length > itemsPerPage && (
              <div className="px-6 py-4 border-t border-white/5 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">
                  Registry Index: <span className="text-white/60">{startIndex} - {endIndex}</span> of <span className="text-white/60">{filteredUsers.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-primary text-black' : 'hover:bg-white/5 text-white/40'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} className="rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom Grid for Tablet/Desktop */}
          <div className="grid grid-cols-1 gap-6">
             {/* Integrations Module */}
             <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <LinkIcon className="text-secondary" size={18} />
                  </div>
                  <h3 className="font-black text-sm uppercase tracking-widest">Connectors</h3>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {integrations.map((tool, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleConnect(tool)}
                    className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 group transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
                  >
                    <div className="text-white/40 group-hover:text-primary transition-colors">
                      {tool.icon === 'github' ? <GitBranch size={20} /> : tool.icon === 'slack' ? <MessageSquare size={20} /> : <LinkIcon size={20} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tight">{tool.name}</span>
                    <div className={`w-1 h-1 rounded-full ${tool.status === 'connected' ? 'bg-status-success animate-pulse' : 'bg-white/10'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Modules (Roles, Teams, Settings) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Teams Module */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-status-warning/10 rounded-lg">
                  <Zap className="text-status-warning" size={18} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest">Tactical Squads</h3>
              </div>
              <button 
                onClick={() => navigate('/admin/teams/create')}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary-light hover:bg-primary hover:text-black transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {teams.map((t, i) => (
                <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white">{t.name}</span>
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-tight flex items-center gap-1.5 mt-0.5">
                      <Users size={10} /> {t.members} Operators
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => navigate(`/admin/teams/edit/${t.id}`)} className="p-2 hover:text-primary transition-colors"><SettingsIcon size={14} /></button>
                    <button onClick={() => deleteTeam(t.id)} className="p-2 hover:text-status-error transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roles Module */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-status-success/10 rounded-lg">
                  <Shield className="text-status-success" size={18} />
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest">Clearance Matrix</h3>
              </div>
              <button 
                onClick={() => setIsCreateRoleModalOpen(true)}
                className="text-[10px] font-black uppercase text-primary tracking-widest hover:brightness-125"
              >
                Add Role
              </button>
            </div>
            
            <div className="max-h-[160px] overflow-y-auto pr-2  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="grid grid-cols-1 gap-2">
                {roles.map((r, i) => (
                  <div 
                    key={i} 
                    onClick={() => setEditingRole(r)}
                    className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
                  >
                    <span className="text-xs font-bold text-white/80">{r.role}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-8 bg-status-success/20 rounded-full overflow-hidden">
                        <div className="h-full bg-status-success w-full" />
                      </div>
                      <ChevronLeft size={12} className="rotate-180 text-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Infrastructure Config */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden p-6">
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/20 mb-6 px-1">Infrastructure Config</h3>
            <div className="space-y-1">
              {[
                { label: 'Timezone', key: 'timezone', value: settings?.timezone, icon: <Globe size={14} /> },
                { label: 'Core Hours', key: 'workingHours', value: settings?.workingHours, icon: <Clock size={14} /> },
                { label: 'Telemetry Rules', key: 'notificationRules', value: settings?.notificationRules, icon: <Bell size={14} /> },
                { label: 'Project Blueprints', key: 'projectDefaults', value: settings?.projectDefaults, icon: <SettingsIcon size={14} /> }
              ].map((setting, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSetting(setting)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-white/20 group-hover:text-primary transition-colors">{setting.icon}</div>
                    <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{setting.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/30 truncate max-w-[100px]">{setting.value || 'UNSET'}</span>
                </button>
              ))}
            </div>
          </div>
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

import React from 'react';
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
  X
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
  const { user } = useAuth();
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
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [activeSetting, setActiveSetting] = React.useState(null);
  const [editingUser, setEditingUser] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState(null);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = React.useState(false);
  const [connectingIntegration, setConnectingIntegration] = React.useState(null);

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
  const itemsPerPage = 5;

  if (isLoading) return <CenteredLoading />;

  const {
    overview,
    users = [],
    roles = [],
    availablePermissions = [],
    teams = [],
    integrations = [],
    settings = {},
    alerts = []
  } = data || {};

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 pt-8 pb-12 space-y-8 bg-black min-h-screen text-white/90">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Layout className="text-primary" size={32} />
            Workspace Administration
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all hover:scale-105 active:scale-95">
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-lg text-sm transition-all hover:brightness-110 hover:scale-105 active:scale-95">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Workspace Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Workspace', value: overview?.name, icon: <Globe size={18} />, color: 'text-primary' },
          { label: 'Total Users', value: overview?.totalUsers, icon: <Users size={18} />, color: 'text-secondary' },
          { label: 'Active Roles', value: overview?.activeRoles, icon: <Shield size={18} />, color: 'text-status-success' },
          { label: 'Integrations', value: overview?.integrations, icon: <LinkIcon size={18} />, color: 'text-status-warning' },
          { label: 'Status', value: overview?.status, icon: <Activity size={18} />, color: 'text-status-success' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-white/20 transition-all group">
            <div className={`${stat.color} bg-white/5 p-2 rounded-lg group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Management */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Users className="text-primary" size={24} />
            <h2 className="text-xl font-bold tracking-tight">User Management</h2>
          </div>
          <div className="relative group w-full md:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search operators..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/10"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase tracking-widest text-white/30 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Last Active</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredUsers.length > 0 ? filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((u, i) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white group-hover:text-primary transition-colors">{u.name}</span>
                      <span className="text-xs text-white/30">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield size={12} className="text-white/30" />
                      <span className="text-[10px] uppercase tracking-wider text-white/60">{u.role.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-status-success' : 'bg-status-error'} shadow-[0_0_8px_rgba(74,222,128,0.5)]`} />
                      <span className="text-xs">{u.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/40 text-xs">
                    {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-primary hover:border-primary/50 transition-all hover:scale-110 active:scale-95"
                        title="User Settings"
                      >
                        <SettingsIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-white/20">
                      <Search size={32} strokeWidth={1} />
                      <span className="text-xs italic">No operators matching "{searchQuery}"</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider">
              SHOWING <span className="text-white">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> OF <span className="text-white">{filteredUsers.length}</span> OPERATORS
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-6 h-6 rounded-md text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-primary text-black' : 'hover:bg-white/5 text-white/40'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={14} className="rotate-180" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Roles & Permissions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-status-success" size={22} />
              <h2 className="text-lg font-bold">Roles & Permissions</h2>
            </div>
            <button 
              onClick={() => setIsCreateRoleModalOpen(true)}
              className="text-xs text-primary font-bold hover:brightness-110 active:scale-95 transition-all"
            >
              Add Role
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              {roles.map((r, i) => (
                <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-4 hover:border-white/20 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-status-success">{r.role}</h3>
                    <button 
                      onClick={() => setEditingRole(r)}
                      className="text-[10px] text-white/30 hover:text-white uppercase tracking-tighter transition-colors"
                    >
                      Edit Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Management */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="text-status-warning" size={22} />
              <h2 className="text-lg font-bold">Team Management</h2>
            </div>
            <button
              onClick={() => navigate('/admin/teams/create')}
              className="text-xs text-primary font-bold hover:brightness-110 active:scale-95 transition-all"
            >
              Create Team
            </button>
          </div>
          <div className="p-6">
            <div className="max-h-[220px] overflow-y-auto overflow-x-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full pr-2">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase tracking-widest text-white/30 bg-white/[0.01]">
                  <tr>
                    <th className="px-6 py-4">Team</th>
                    <th className="px-6 py-4">Members</th>
                    <th className="px-6 py-4">Lead</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {teams.map((t, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-6 py-4 font-semibold">{t.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white/50 text-xs">
                          {t.members} <Users size={12} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/40">{t.lead}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/teams/edit/${t.id}`)}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/20 hover:text-primary hover:border-primary/40 transition-all hover:scale-110"
                            title="Manage Squad"
                          >
                            <SettingsIcon size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to decommission squad: ${t.name}?`)) {
                                deleteTeam(t.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/20 hover:text-status-error hover:border-status-error/40 transition-all hover:scale-110"
                            title="Delete Team"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Integrations */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
            <LinkIcon className="text-secondary" size={22} />
            <h2 className="text-lg font-bold">Connected Tools</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {integrations.map((tool, i) => (
              <div 
                key={i} 
                onClick={() => handleConnect(tool)}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:scale-105 transition-all group cursor-pointer"
              >
                <div className="mb-3 flex justify-center">
                  {tool.icon === 'github' ? <GitBranch size={24} /> : tool.icon === 'slack' ? <MessageSquare size={24} /> : <LinkIcon size={24} />}
                </div>
                <h4 className="font-bold text-sm tracking-tight">{tool.name}</h4>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${tool.status === 'connected' ? 'bg-status-success' : 'bg-status-error'}`} />
                  <span className="text-[10px] uppercase text-white/40">{tool.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace Settings */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3">
            <SettingsIcon className="text-white/40" size={22} />
            <h2 className="text-lg font-bold">Workspace Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Timezone', key: 'timezone', value: settings?.timezone, icon: <Globe size={14} /> },
              { label: 'Working Hours', key: 'workingHours', value: settings?.workingHours, icon: <Clock size={14} /> },
              { label: 'Notifications', key: 'notificationRules', value: settings?.notificationRules, icon: <Bell size={14} /> },
              { label: 'Project Defaults', key: 'projectDefaults', value: settings?.projectDefaults, icon: <SettingsIcon size={14} /> }
            ].map((setting, i) => (
              <div
                key={i}
                onClick={() => setActiveSetting(setting)}
                className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all"
              >
                <div className="flex items-center gap-3 text-white/40 group-hover:text-white transition-colors">
                  {setting.icon}
                  <span className="text-sm">{setting.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{setting.value || 'Not Set'}</span>
                  <div className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      </div>

      {/* Alerts */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/20 px-1">Critical Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${alert.type === 'warning' ? 'bg-status-warning/10 border-status-warning/30 text-status-warning' : 'bg-status-info/10 border-status-info/30 text-status-info'}`}>
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>

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

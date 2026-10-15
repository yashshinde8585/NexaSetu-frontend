import React, { useState } from 'react';
import {
  Layout,
  Users,
  Zap,
  Shield,
  Settings as SettingsIcon,
  AlertCircle,
  RefreshCcw,
} from 'lucide-react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import CenteredLoading from '../../components/atoms/CenteredLoading';
import ErrorBoundary from '../../components/atoms/ErrorBoundary';
import WorkspaceSettingsModal from '../../components/organisms/admin/WorkspaceSettingsModal';
import UserEditModal from '../../components/organisms/admin/UserEditModal';
import RolePermissionsModal from '../../components/organisms/admin/RolePermissionsModal';
import CreateRoleModal from '../../components/organisms/admin/CreateRoleModal';
import ConnectGithubModal from '../../components/organisms/admin/ConnectGithubModal';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import GithubService from '../../api/githubApi';
import toast from 'react-hot-toast';
import { useDebounce } from '../../hooks/useDebounce';

// Modular Components
import AdminHeader from './AdminDashboard/components/AdminHeader';
import CommandCenterTab from './AdminDashboard/components/CommandCenterTab';
import UserDirectoryTab from './AdminDashboard/components/UserDirectoryTab';
import SquadDirectiveTab from './AdminDashboard/components/SquadDirectiveTab';
import RolesAccessTab from './AdminDashboard/components/RolesAccessTab';
import WorkspaceSettingsTab from './AdminDashboard/components/WorkspaceSettingsTab';

/**
 * Workspace Administration Dashboard Controller
 * Reduced from monolithic layout to a clean tab panel switcher wrapped in Error Boundaries.
 */
const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    error,
    updateRoleMutation,
    deactivateMutation,
    updateSettingsMutation,
    deleteTeamMutation,
    updateRolePermissionsMutation,
    createRoleMutation,
  } = useAdminDashboard();

  const [activeTab, setActiveTab] = useState('overview');
  const [activeSetting, setActiveSetting] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [connectingIntegration, setConnectingIntegration] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const connectMutation = useMutation({
    mutationFn: (token) => GithubService.connectGithub(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setConnectingIntegration(null);
      toast.success('GitHub connected successfully');
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to connect GitHub');
    },
  });

  const handleConnect = (tool) => {
    if (tool.name === 'GitHub') {
      setConnectingIntegration(tool);
    } else {
      toast.error(`${tool.name} integration is currently in pilot phase.`);
    }
  };

  if (isLoading) return <CenteredLoading />;

  if (error) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-8 text-center font-mono border border-status-error/20">
        <AlertCircle size={48} className="text-status-error mb-6" />
        <h2 className="text-2xl font-black text-text mb-4 uppercase tracking-tighter">
          Connection Error
        </h2>
        <p className="text-text/40 max-w-md text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-8">
          We couldn't load the admin dashboard. This might be due to a
          connection issue or an expired session.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-3 px-8 py-3 bg-white text-black text-[10px] uppercase font-bold tracking-[0.2em] rounded-lg hover:bg-white/80 transition-all active:scale-95 animate-pulse"
        >
          <RefreshCcw size={14} /> Retry Connection
        </button>
      </div>
    );
  }

  const {
    roles: rawRoles = [],
    availablePermissions: rawAvailablePermissions = [],
    teams: rawTeams = [],
    integrations: rawIntegrations = [],
    settings: rawSettings = {},
  } = data || {};

  const roles = Array.isArray(rawRoles) ? rawRoles.filter(Boolean) : [];
  const availablePermissions = Array.isArray(rawAvailablePermissions)
    ? rawAvailablePermissions.filter(Boolean)
    : [];
  const teams = Array.isArray(rawTeams) ? rawTeams.filter(Boolean) : [];
  const integrations = Array.isArray(rawIntegrations)
    ? rawIntegrations.filter(Boolean)
    : [];
  const settings =
    rawSettings && typeof rawSettings === 'object' ? rawSettings : {};

  return (
    <div className="min-h-screen bg-background text-text p-3 lg:p-4 font-sans select-none max-w-screen-2xl mx-auto flex flex-col gap-4">
      <AdminHeader />

      <div className="flex border-b border-white/5 overflow-x-auto scrollbar-none gap-1.5">
        {[
          {
            id: 'overview',
            label: 'System Overview',
            icon: <Layout size={12} />,
          },
          { id: 'users', label: 'User Directory', icon: <Users size={12} /> },
          { id: 'teams', label: 'Teams', icon: <Zap size={12} /> },
          { id: 'roles', label: 'Roles & Access', icon: <Shield size={12} /> },
          {
            id: 'settings',
            label: 'Workspace Settings',
            icon: <SettingsIcon size={12} />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-white bg-white/5'
                : 'border-transparent text-white/40 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1">
        {activeTab === 'overview' && (
          <ErrorBoundary>
            <CommandCenterTab
              data={data}
              setActiveTab={setActiveTab}
              setCurrentPage={setCurrentPage}
              setActiveSetting={setActiveSetting}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'users' && (
          <ErrorBoundary>
            <UserDirectoryTab
              data={data}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              searchQuery={searchQuery}
              debouncedSearchQuery={debouncedSearchQuery}
              setSearchQuery={setSearchQuery}
              setEditingUser={setEditingUser}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'teams' && (
          <ErrorBoundary>
            <SquadDirectiveTab
              teams={teams}
              deleteTeamMutation={deleteTeamMutation}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'roles' && (
          <ErrorBoundary>
            <RolesAccessTab
              roles={roles}
              setEditingRole={setEditingRole}
              setIsCreateRoleModalOpen={setIsCreateRoleModalOpen}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'settings' && (
          <ErrorBoundary>
            <WorkspaceSettingsTab
              settings={settings}
              integrations={integrations}
              setActiveSetting={setActiveSetting}
              handleConnect={handleConnect}
            />
          </ErrorBoundary>
        )}
      </div>

      {/* Modals and Overlay Actions */}
      <WorkspaceSettingsModal
        isOpen={!!activeSetting}
        onClose={() => setActiveSetting(null)}
        setting={activeSetting}
        currentValue={activeSetting ? settings[activeSetting.key] : ''}
        onSave={(newVal) => {
          updateSettingsMutation.mutate(
            { ...settings, [activeSetting.key]: newVal },
            {
              onSuccess: () => {
                toast.success('Workspace setting updated');
                setActiveSetting(null);
              },
              onError: (err) => {
                toast.error(
                  err?.message || 'Failed to update workspace setting'
                );
              },
            }
          );
        }}
      />

      <UserEditModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={({ userId, role }) => {
          updateRoleMutation.mutate(
            { userId, role },
            {
              onSuccess: () => {
                toast.success('User role updated');
                setEditingUser(null);
              },
              onError: (err) => {
                toast.error(err?.message || 'Failed to update user role');
              },
            }
          );
        }}
        onDeactivate={({ userId, status }) => {
          deactivateMutation.mutate(
            { userId, status },
            {
              onSuccess: () => {
                toast.success(
                  `User successfully ${status === 'Active' ? 'activated' : 'deactivated'}`
                );
                setEditingUser(null);
              },
              onError: (err) => {
                toast.error(err?.message || 'Failed to update user status');
              },
            }
          );
        }}
      />

      <RolePermissionsModal
        isOpen={!!editingRole}
        onClose={() => setEditingRole(null)}
        role={editingRole}
        availablePermissions={availablePermissions}
        onSave={(roleName, permissions) => {
          updateRolePermissionsMutation.mutate(
            { role: roleName, permissions },
            {
              onSuccess: () => {
                toast.success('Role permissions successfully updated');
                setEditingRole(null);
              },
              onError: (err) => {
                toast.error(
                  err?.message || 'Failed to update role permissions'
                );
              },
            }
          );
        }}
      />

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        availablePermissions={availablePermissions}
        onCreate={(payload) => {
          createRoleMutation.mutate(payload, {
            onSuccess: () => {
              toast.success('Custom access role created');
              setIsCreateRoleModalOpen(false);
            },
            onError: (err) => {
              toast.error(
                err?.message || 'Failed to create custom access role'
              );
            },
          });
        }}
      />

      <ConnectGithubModal
        isOpen={!!connectingIntegration}
        onClose={() => setConnectingIntegration(null)}
        onConnect={(token) => connectMutation.mutate(token)}
        isLoading={connectMutation.isPending}
        error={
          connectMutation.error?.message ||
          connectMutation.error?.response?.data?.message
        }
      />
    </div>
  );
};

export default AdminDashboard;

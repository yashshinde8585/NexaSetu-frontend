import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Shield, Settings as SettingsIcon, Lock, Globe,
  Link as LinkIcon, AlertCircle, Plus,
  Clock, GitBranch, MessageSquare, UserPlus, Zap, Layout,
  ChevronLeft, Search, Trash2, X, RefreshCcw, BarChart3, TrendingUp,
  LayoutGrid, UserCheck, Key, Fingerprint, ChevronDown, SlidersHorizontal,
  Server, HardDrive, Check, AlertOctagon
} from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { useAuth } from '../context/AuthContext';
import CenteredLoading from '../components/atoms/CenteredLoading';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import WorkspaceSettingsModal from '../components/organisms/admin/WorkspaceSettingsModal';
import UserEditModal from '../components/organisms/admin/UserEditModal';
import RolePermissionsModal from '../components/organisms/admin/RolePermissionsModal';
import CreateRoleModal from '../components/organisms/admin/CreateRoleModal';
import ConnectGithubModal from '../components/organisms/admin/ConnectGithubModal';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import GithubService from '../api/githubService';
import toast from 'react-hot-toast';

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Core workspace administration dashboard component managing system settings, users, teams, and security permissions.
const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    error,
    updateUserRole,
    deactivateUser,
    updateSettings,
    filters,
    createTeam,
    deleteTeam,
    updateRolePermissions,
    createRole,
    updateRoleMutation,
    deactivateMutation,
    updateSettingsMutation,
    createTeamMutation,
    deleteTeamMutation,
    updateRolePermissionsMutation,
    createRoleMutation
  } = useAdminDashboard();

  const [activeTab, setActiveTab] = useState('overview');

  const [activeSetting, setActiveSetting] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [connectingIntegration, setConnectingIntegration] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 7;

  const [workspaceFilter, setWorkspaceFilter] = useState('NexaCore Platform');
  const [envFilter, setEnvFilter] = useState('Production');
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);

  const connectMutation = useMutation({
    mutationFn: (token) => GithubService.connectGithub(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setConnectingIntegration(null);
      toast.success('GitHub connected successfully');
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to connect GitHub');
    }
  });

  const handleConnect = (tool) => {
    if (tool.name === 'GitHub') {
      setConnectingIntegration(tool);
    } else {
      toast.error(`${tool.name} integration is currently in pilot phase.`);
    }
  };

  const { filteredUsers, paginatedUsers, totalPages, startIndex, endIndex } = useMemo(() => {
    const rawUsers = Array.isArray(data?.users) ? data.users.filter(Boolean) : [];
    const filtered = rawUsers.filter(u =>
      (u?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u?.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filtered.slice(start, end);
    const pages = Math.ceil(filtered.length / itemsPerPage);

    return {
      filteredUsers: filtered,
      paginatedUsers: paginated,
      totalPages: pages || 1,
      startIndex: filtered.length > 0 ? start + 1 : 0,
      endIndex: Math.min(end, filtered.length)
    };
  }, [data?.users, searchQuery, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  const activeUsersCount = useMemo(() => {
    const rawUsers = Array.isArray(data?.users) ? data.users.filter(Boolean) : [];
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return rawUsers.filter(u => {
      const dateToCheck = u?.lastActive || u?.updatedAt;
      if (!dateToCheck) return false;
      const d = new Date(dateToCheck);
      return !isNaN(d.getTime()) && d.getTime() >= thirtyDaysAgo;
    }).length;
  }, [data?.users]);

  const paginationRange = useMemo(() => {
    const range = [];
    const delta = 1;

    range.push(1);

    if (currentPage > delta + 2) {
      range.push('...');
    }

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (currentPage < totalPages - delta - 1) {
      range.push('...');
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages]);

  const userDistributionData = useMemo(() => {
    const rawUsers = Array.isArray(data?.users) ? data.users.filter(Boolean) : [];
    const counts = {
      'ADMINISTRATOR': 0,
      'WORKSPACE_ADMIN': 0,
      'PROJECT_ADMIN': 0,
      'DEVELOPER': 0,
      'QA_ENGINEER': 0,
      'VIEWER': 0
    };

    rawUsers.forEach(u => {
      const r = (u?.role || '').toUpperCase();
      if (counts[r] !== undefined) {
        counts[r] += 1;
      } else if (r.includes('ADMIN')) {
        counts['WORKSPACE_ADMIN'] += 1;
      } else if (r.includes('DEV') || r.includes('ENGINEER') || r.includes('SOFTWARE_ENGINEER')) {
        counts['DEVELOPER'] += 1;
      } else if (r.includes('QA')) {
        counts['QA_ENGINEER'] += 1;
      } else {
        counts['VIEWER'] += 1;
      }
    });

    const finalData = Object.keys(counts).map(key => {
      return {
        name: key.replace(/_/g, ' '),
        value: counts[key]
      };
    });

    const total = finalData.reduce((sum, item) => sum + item.value, 0);

    return finalData.map(item => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0'
    }));
  }, [data?.users]);

  const sparklineData = useMemo(() => {
    return {
      projects: Array.isArray(data?.analyticsTrends?.projects) ? data.analyticsTrends.projects : [],
      totalUsers: Array.isArray(data?.analyticsTrends?.users) ? data.analyticsTrends.users : [],
      activeUsers: Array.isArray(data?.analyticsTrends?.activeUsers) ? data.analyticsTrends.activeUsers : [],
      adminUsers: Array.isArray(data?.analyticsTrends?.admins) ? data.analyticsTrends.admins : []
    };
  }, [data?.analyticsTrends]);

  const usersGrowthTrend = useMemo(() => {
    return Array.isArray(data?.usersGrowthTrend) ? data.usersGrowthTrend : [];
  }, [data?.usersGrowthTrend]);

  const recentActivities = useMemo(() => {
    return (Array.isArray(data?.securityLogs) ? data.securityLogs.filter(Boolean) : []).slice(0, 5).map(log => {
      let timeFormatted = 'Recent';
      if (log?.time) {
        const d = new Date(log.time);
        if (!isNaN(d.getTime())) {
          timeFormatted = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      }
      return {
        id: log?.id || log?._id || `activity-${log?.performer || 'SO'}-${log?.action || ''}-${log?.time || ''}`,
        name: log?.performer || 'System Operator',
        email: 'operator@nexasetu.io',
        action: (log?.action || '').replace(/_/g, ' ').toLowerCase(),
        time: timeFormatted,
        avatarInitials: String(log?.performer || 'SO').substring(0, 2).toUpperCase()
      };
    });
  }, [data?.securityLogs]);

  const projectsOverview = useMemo(() => {
    return Array.isArray(data?.projectsOverview) ? data.projectsOverview.filter(Boolean) : [];
  }, [data?.projectsOverview]);

  const auditLogsRows = useMemo(() => {
    return (Array.isArray(data?.securityLogs) ? data.securityLogs.filter(Boolean) : []).map((log, idx) => {
      let resource = 'System Config';
      const act = log?.action || '';
      if (act.includes('USER')) resource = 'User Account';
      if (act.includes('TEAM')) resource = 'Team Unit';
      if (act.includes('ROLE')) resource = 'Access Role';

      let timeFormatted = 'Recent';
      if (log?.time) {
        const d = new Date(log.time);
        if (!isNaN(d.getTime())) {
          timeFormatted = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
      }
      return {
        id: log?.id || log?._id || `log-${log?.performer || 'system'}-${log?.action || ''}-${log?.time || idx}`,
        time: timeFormatted,
        user: log?.performer || 'System',
        action: act.replace(/_/g, ' '),
        resource,
        ip: log?.ip || 'Internal'
      };
    });
  }, [data?.securityLogs]);

  if (isLoading) return <CenteredLoading />;

  if (error) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-8 text-center font-mono border border-status-error/20">
        <AlertCircle size={48} className="text-status-error mb-6" />
        <h2 className="text-2xl font-black text-text mb-4 uppercase tracking-tighter">Connection Error</h2>
        <p className="text-text/40 max-w-md text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-8">
          We couldn't load the admin dashboard. This might be due to a connection issue or an expired session.
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
    overview = {},
    roles: rawRoles = [],
    availablePermissions: rawAvailablePermissions = [],
    teams: rawTeams = [],
    integrations: rawIntegrations = [],
    settings: rawSettings = {}
  } = data || {};

  const roles = Array.isArray(rawRoles) ? rawRoles.filter(Boolean) : [];
  const availablePermissions = Array.isArray(rawAvailablePermissions) ? rawAvailablePermissions.filter(Boolean) : [];
  const teams = Array.isArray(rawTeams) ? rawTeams.filter(Boolean) : [];
  const integrations = Array.isArray(rawIntegrations) ? rawIntegrations.filter(Boolean) : [];
  const settings = (rawSettings && typeof rawSettings === 'object') ? rawSettings : {};

  const ROLE_COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#3B82F6', '#10B981', '#6B7280'];

  // Render the main dashboard layout, tabs, command center metrics, and administration panels.
  return (
    <div className="min-h-screen bg-background text-text p-3 lg:p-4 font-sans select-none max-w-screen-2xl mx-auto flex flex-col gap-4">

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
          {/* Workspace Filter */}
          {/* <div className="relative">
            <div
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="bg-white/5 border border-white/10 px-2 py-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-white/10 transition-all select-none"
            >
              <span className="text-white/40">Workspace:</span>
              <span className="text-white font-bold">{workspaceFilter}</span>
              <ChevronDown size={10} className="text-white/40" />
            </div>

            {isWorkspaceDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsWorkspaceDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-black border border-white/10 shadow-2xl z-50 py-1 min-w-[180px]">
                  {['NexaCore Platform', 'NexaCore Mobile', 'Data Platform'].map((ws) => (
                    <button
                      key={ws}
                      onClick={() => {
                        setWorkspaceFilter(ws);
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${
                        workspaceFilter === ws
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {ws}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div> */}

          {/* Environment Filter */}
          {/* <div className="relative">
            <div
              onClick={() => setIsEnvDropdownOpen(!isEnvDropdownOpen)}
              className="bg-white/5 border border-white/10 px-2 py-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-white/10 transition-all select-none"
            >
              <span className="text-white/40">Environment:</span>
              <span className="text-white font-bold">{envFilter}</span>
              <ChevronDown size={10} className="text-white/40" />
            </div>

            {isEnvDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsEnvDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-black border border-white/10 shadow-2xl z-50 py-1 min-w-[150px]">
                  {['Production', 'Staging', 'Development'].map((env) => (
                    <button
                      key={env}
                      onClick={() => {
                        setEnvFilter(env);
                        setIsEnvDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${envFilter === env
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div> */}

          {/* Filters Toggle Button */}
          {/* <button
            onClick={() => toast.success('Filters cleared.')}
            className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 px-3 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <SlidersHorizontal size={10} />
            <span>Filters</span>
          </button> */}
        </div>
      </div>

      <div className="flex border-b border-white/5 overflow-x-auto scrollbar-none gap-1.5">
        {[
          { id: 'overview', label: 'Command Center', icon: <Layout size={12} /> },
          { id: 'users', label: 'User Directory', icon: <Users size={12} /> },
          { id: 'teams', label: 'Squad Directive', icon: <Zap size={12} /> },
          { id: 'roles', label: 'Roles & Access', icon: <Shield size={12} /> },
          { id: 'settings', label: 'Workspace Settings', icon: <SettingsIcon size={12} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-b-2 whitespace-nowrap ${activeTab === tab.id
              ? 'border-primary text-white bg-white/5'
              : 'border-transparent text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="flex flex-col gap-4 animate-fade-in">

          {/* 1. Metrics Strip (Row 1) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

            {/* Card 1: Projects */}
            <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Projects</span>
                <span className="text-secondary"><LayoutGrid size={12} /></span>
              </div>
              <div className="flex items-end justify-between mt-1.5">
                <div>
                  <span className="text-2xl font-black tracking-tighter">{data?.projectsOverview?.length || 0}</span>
                  <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                    <span>Active</span>
                    <span className="text-white/20 font-bold uppercase">Projects</span>
                  </div>
                </div>
                <div className="w-14 h-7 opacity-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData.projects}>
                      <Area type="monotone" dataKey="val" stroke="#8B5CF6" fill="rgba(139, 92, 246, 0.1)" strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Card 2: Total Users */}
            <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Users</span>
                <span className="text-primary"><Users size={12} /></span>
              </div>
              <div className="flex items-end justify-between mt-1.5">
                <div>
                  <span className="text-2xl font-black tracking-tighter">
                    {(overview?.totalUsers || 0).toLocaleString()}
                  </span>
                  <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                    <span>↑ 5.3%</span>
                    <span className="text-white/20 font-bold uppercase">vs last mo</span>
                  </div>
                </div>
                <div className="w-14 h-7 opacity-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData.totalUsers}>
                      <Area type="monotone" dataKey="val" stroke="#3B82F6" fill="rgba(59, 130, 246, 0.1)" strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Card 3: Active Users (30d) */}
            <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Active Users</span>
                <span className="text-status-success"><UserCheck size={12} /></span>
              </div>
              <div className="flex items-end justify-between mt-1.5">
                <div>
                  <span className="text-2xl font-black tracking-tighter">
                    {activeUsersCount}
                  </span>
                  <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                    <span>Operational</span>
                    <span className="text-white/20 font-bold uppercase">30d</span>
                  </div>
                </div>
                <div className="w-14 h-7 opacity-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData.activeUsers}>
                      <Area type="monotone" dataKey="val" stroke="#22C55E" fill="rgba(34, 197, 94, 0.1)" strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Card 4: Admin Users */}
            <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Admins</span>
                <span className="text-status-warning"><Key size={12} /></span>
              </div>
              <div className="flex items-end justify-between mt-1.5">
                <div>
                  <span className="text-2xl font-black tracking-tighter">
                    {data?.users?.filter(u => (u.role || '').toUpperCase().includes('ADMIN')).length || 0}
                  </span>
                  <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                    <span>Assigned</span>
                    <span className="text-white/20 font-bold uppercase">roles</span>
                  </div>
                </div>
                <div className="w-14 h-7 opacity-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData.adminUsers}>
                      <Area type="monotone" dataKey="val" stroke="#F59E0B" fill="rgba(245, 158, 11, 0.1)" strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Card 5: SSO Coverage */}
            <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">SSO Coverage</span>
                <span className="text-secondary"><Fingerprint size={12} /></span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-black tracking-tighter">
                  {data?.securityOverview?.totalWorkspaces > 0
                    ? Math.round(((data?.securityOverview?.ssoEnforcedWorkspaces || 0) / data.securityOverview.totalWorkspaces) * 100)
                    : 0}%
                </span>
                <div className="text-[7.5px] text-white/30 font-black uppercase mt-0.5">Workspace via SSO</div>
                <div className="w-full bg-white/5 h-1 mt-1 rounded-none overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: `${data?.securityOverview?.totalWorkspaces > 0 ? ((data?.securityOverview?.ssoEnforcedWorkspaces || 0) / data.securityOverview.totalWorkspaces) * 100 : 0}%` }} />
                </div>
              </div>
            </div>

            {/* Card 6: MFA Coverage */}
            <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">MFA Coverage</span>
                <span className="text-primary"><Lock size={12} /></span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-black tracking-tighter">
                  {data?.securityOverview?.totalUsers > 0
                    ? Math.round(((data?.securityOverview?.mfaEnabledUsers || 0) / data.securityOverview.totalUsers) * 100)
                    : 0}%
                </span>
                <div className="text-[7.5px] text-white/30 font-black uppercase mt-0.5">Users with MFA</div>
                <div className="w-full bg-white/5 h-1 mt-1 rounded-none overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${data?.securityOverview?.totalUsers > 0 ? ((data?.securityOverview?.mfaEnabledUsers || 0) / data.securityOverview.totalUsers) * 100 : 0}%` }} />
                </div>
              </div>
            </div>

          </div>

          {/* 2. Charts & Recent Activity (Row 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* User Distribution Donut */}
            <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[360px]">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">User Distribution by Role</span>
                <button
                  onClick={() => setActiveTab('roles')}
                  className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer"
                >
                  View all roles
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center relative h-48 py-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {userDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0A0A0A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0px',
                      }}
                      itemStyle={{
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center text inside Donut */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black tracking-tighter">
                    {(overview?.totalUsers || 0).toLocaleString()}
                  </span>
                  <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">Total Users</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[9px] font-black uppercase border-t border-white/5 pt-4">
                {userDistributionData.map((d, index) => (
                  <div key={d.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <div className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: ROLE_COLORS[index % ROLE_COLORS.length] }} />
                      <span className="text-white/60 truncate">{d.name}</span>
                    </div>
                    <span className="text-white shrink-0">{d.value} ({d.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Users Growth Trend Line */}
            <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[360px]">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Users Growth Trend</span>
                <div className="relative bg-white/5 px-2 py-0.5 border border-white/10 text-[8px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-1 hover:bg-white/10">
                  <span>Last 30 days</span>
                  <ChevronDown size={10} />
                </div>
              </div>

              <div className="flex-1 w-full h-56 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usersGrowthTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={8} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0A0A0A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0px',
                      }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] text-center border-t border-white/5 pt-4 flex items-center justify-center gap-1.5">
                <TrendingUp size={10} className="text-secondary" />
                <span>Steady trajectory of member resource onboardings</span>
              </div>
            </div>

            {/* Recent User Activity */}
            <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[360px]">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Recent User Activity</span>
                <button
                  onClick={() => toast.success('Telemetry logs are fully synchronized.')}
                  className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-start mt-3 gap-3 overflow-y-auto max-h-[260px] pr-1 custom-scrollbar">
                {recentActivities.length > 0 ? recentActivities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between py-2 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] px-1 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-white/40 uppercase">
                        {act.avatarInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white">{act.name}</span>
                        <span className="text-[8px] text-white/30 uppercase font-semibold">{act.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-right">
                      <span className="text-[9px] font-black text-secondary uppercase bg-secondary/10 px-2 py-0.5">{act.action}</span>
                      <span className="text-[8px] text-white/20 mt-1 font-semibold">{act.time}</span>
                    </div>
                  </div>
                )) : (
                  <div className="py-16 text-center border border-dashed border-white/10 my-auto">
                    <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">NO_RECENT_SECURITY_TELEMETRY</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 3. System Overviews (Row 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Project Overview */}
            <div className="bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Project Overview</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer" onClick={() => toast.success("Live project channels functional.")}>View All</span>
              </div>
              <div className="flex-1 mt-3 overflow-x-auto scrollbar-none">
                <table className="w-full text-left text-[9px] font-black uppercase">
                  <thead>
                    <tr className="text-white/20 border-b border-white/5">
                      <th className="pb-2">Project</th>
                      <th className="pb-2 text-center">Type</th>
                      <th className="pb-2 text-center">Users</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsOverview.filter(Boolean).map((item, idx) => {
                      const projName = item.name || 'Unnamed';
                      const projType = item.type || 'N/A';
                      const projUsers = item.users || 0;
                      const projStatus = item.status || 'inactive';
                      const stableKey = item.id || item._id || projName || `project-${idx}`;
                      return (
                        <tr key={stableKey} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0">
                          <td className="py-2.5 text-white truncate max-w-[80px]">{projName}</td>
                          <td className="py-2.5 text-center text-white/60">{projType}</td>
                          <td className="py-2.5 text-center text-white/60">{projUsers}</td>
                          <td className="py-2.5 text-right">
                            <span className={`text-[8px] px-1.5 py-0.5 uppercase font-bold ${projStatus === 'active' ? 'bg-status-success/10 text-status-success' : 'bg-white/10 text-white/40'
                              }`}>{projStatus}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Overview */}
            <div className="bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Security Overview</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer" onClick={() => toast.success("Security logs synced.")}>View Details</span>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3 mt-3">

                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2">
                  <div className="p-1.5 bg-status-success/10 text-status-success"><Check size={14} /></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/40 uppercase font-black">SSO Enforced Workspaces</span>
                    <span className="text-[11px] font-black text-white">
                      {data?.securityOverview?.ssoEnforcedWorkspaces || 0} / {data?.securityOverview?.totalWorkspaces || 0}
                    </span>
                  </div>
                </div>                 <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2">
                  <div className="p-1.5 bg-secondary/10 text-secondary"><Lock size={14} /></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/40 uppercase font-black">MFA Enabled Users</span>
                    <span className="text-[11px] font-black text-white">
                      {(data?.securityOverview?.mfaEnabledUsers || 0).toLocaleString()} / {(data?.securityOverview?.totalUsers || 0).toLocaleString()} ({data?.securityOverview?.totalUsers > 0 ? Math.round(((data?.securityOverview?.mfaEnabledUsers || 0) / data.securityOverview.totalUsers) * 100) : 0}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2">
                  <div className="p-1.5 bg-status-warning/10 text-status-warning"><Clock size={14} /></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/40 uppercase font-black">Inactive Users (&gt; 90 days)</span>
                    <span className="text-[11px] font-black text-white">
                      {data?.securityOverview?.inactiveUsers || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2">
                  <div className="p-1.5 bg-status-error/10 text-status-error"><AlertOctagon size={14} /></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-white/40 uppercase font-black">Suspicious Logins (30d)</span>
                    <span className="text-[11px] font-black text-white">
                      {data?.securityOverview?.suspiciousLogins || 0}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* System Usage */}
            <div className="bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">System Usage</span>
                <button
                  onClick={() => navigate('/admin/billing')}
                  className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
                >
                  View Billing
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-4 mt-3 text-[9px] font-black uppercase">
                {(() => {
                  const formatBytes = (bytes) => {
                    if (!bytes || bytes === 0) return '0 Bytes';
                    const k = 1024;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                    const idx = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, idx)).toFixed(2)) + ' ' + sizes[idx];
                  };
                  const storageUsed = data?.usage?.storageUsed || 0;
                  const storageQuota = data?.usage?.storageQuota || 104857600;
                  const usedStorageStr = formatBytes(storageUsed);
                  const quotaStorageStr = formatBytes(storageQuota);
                  const storagePct = storageQuota > 0 ? Math.min(100, Math.round((storageUsed / storageQuota) * 100)) : 0;

                  const apiCount = data?.usage?.apiCalls || 0;
                  const apiPct = Math.min(100, Math.round((apiCount / 50000000) * 100));

                  const aiCount = data?.usage?.aiUsage || 0;
                  const aiPct = Math.min(100, Math.round((aiCount / 500000) * 100));

                  return (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white/40 flex items-center gap-1"><HardDrive size={10} /> Storage Used</span>
                          <span className="text-white">{usedStorageStr} / {quotaStorageStr} <span className="text-white/30">({storagePct}%)</span></span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${storagePct}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white/40 flex items-center gap-1"><LinkIcon size={10} /> API Requests (30d)</span>
                          <span className="text-white">{(apiCount).toLocaleString()} / 50M <span className="text-white/30">({apiPct}%)</span></span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                          <div className="bg-secondary h-full" style={{ width: `${apiPct}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white/40 flex items-center gap-1"><Zap size={10} /> AI Agent Compute</span>
                          <span className="text-white">{(aiCount).toLocaleString()} / 500K <span className="text-white/30">({aiPct}%)</span></span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                          <div className="bg-status-warning h-full" style={{ width: `${aiPct}%` }} />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">System Health</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer" onClick={() => toast.success("All microservices fully synced.")}>View All</span>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2 mt-3 text-[9px] font-black uppercase">
                {[
                  { name: 'Authentication Service', status: 'Healthy' },
                  { name: 'Authorization Service', status: 'Healthy' },
                  { name: 'Database', status: 'Healthy' },
                  { name: 'File Storage', status: 'Healthy' },
                  { name: 'Audit Logging', status: 'Healthy' }
                ].map((serv) => (
                  <div key={serv.name} className="flex justify-between items-center py-1.5 border-b border-white/[0.02] last:border-0">
                    <span className="text-white/60 flex items-center gap-1.5">
                      <Server size={10} className="text-white/20" />
                      {serv.name}
                    </span>
                    <span className="text-[8px] text-status-success font-bold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-status-success" />
                      Healthy
                    </span>
                  </div>
                ))}

                <div className="bg-status-success/10 border border-status-success/20 text-status-success p-2.5 text-center mt-3 text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-status-success rounded-full animate-ping" />
                  All Systems Operational
                </div>
              </div>
            </div>

          </div>

          {/* 4. Audit Logs, Pending, Actions (Row 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Audit Logs Table */}
            <div className="lg:col-span-6 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Audit Logs</span>
                <button
                  onClick={() => setActiveTab('users')}
                  className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="flex-1 mt-3 overflow-x-auto scrollbar-none">
                <table className="w-full text-left text-[9px] font-black uppercase">
                  <thead>
                    <tr className="text-white/20 border-b border-white/5">
                      <th className="pb-2">Time</th>
                      <th className="pb-2">User</th>
                      <th className="pb-2">Action</th>
                      <th className="pb-2">Resource</th>
                      <th className="pb-2 text-right">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogsRows.length > 0 ? auditLogsRows.slice(0, 5).map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0">
                        <td className="py-2.5 text-white/40">{log.time}</td>
                        <td className="py-2.5 text-white">{log.user}</td>
                        <td className="py-2.5 text-secondary">{log.action}</td>
                        <td className="py-2.5 text-white/60 truncate max-w-[80px]">{log.resource}</td>
                        <td className="py-2.5 text-right text-white/30">{log.ip}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-white/10 text-[8px] font-bold uppercase tracking-widest">
                          NO_AUDIT_LOG_TELEMETRY
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Pending Approvals</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer" onClick={() => toast.success("Approval telemetry up to date.")}>View All</span>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2 mt-3">
                {[
                  { name: 'Pending Access Requests', count: data?.pendingApprovals?.pendingActionRequests || 0 },
                  { name: 'Deactivated Operatives', count: data?.pendingApprovals?.deactivatedUsersCount || 0 },
                  { name: 'Pending Invitations', count: data?.pendingApprovals?.pendingInvitations || 0 },
                  { name: 'AI Compute Operations', count: data?.pendingApprovals?.aiLogsCount || 0 }
                ].map((item) => (
                  <div key={item.name} className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all">
                    <span className="text-[9px] font-black text-white/60 uppercase">{item.name}</span>
                    <span className="w-5 h-5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-[9px] font-black flex items-center justify-center">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Quick Actions</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2 mt-3 text-[9px] font-black uppercase">

                <button
                  onClick={() => navigate('/project-setup')}
                  className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
                >
                  <Plus size={14} className="text-primary mb-1.5 group-hover:scale-110 transition-transform" />
                  <span>Create Workspace</span>
                </button>

                <button
                  onClick={() => navigate('/team/add')}
                  className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
                >
                  <UserPlus size={14} className="text-secondary mb-1.5 group-hover:scale-110 transition-transform" />
                  <span>Invite Users</span>
                </button>

                <button
                  onClick={() => setActiveTab('roles')}
                  className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
                >
                  <Shield size={14} className="text-status-success mb-1.5 group-hover:scale-110 transition-transform" />
                  <span>Manage Roles</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    toast.success('Scroll to integrations to configure Single Sign-On.');
                  }}
                  className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
                >
                  <Fingerprint size={14} className="text-status-warning mb-1.5 group-hover:scale-110 transition-transform" />
                  <span>Configure SSO</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setActiveSetting({ label: 'TIMEZONE', key: 'timezone', value: settings?.timezone });
                  }}
                  className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
                >
                  <SettingsIcon size={14} className="text-white/60 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span>System Settings</span>
                </button>

                <button
                  onClick={() => toast.success('Generating workspace summary report PDF...')}
                  className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
                >
                  <BarChart3 size={14} className="text-status-info mb-1.5 group-hover:scale-110 transition-transform" />
                  <span>View Reports</span>
                </button>

              </div>
            </div>

          </div>

          {/* Sparkline status indicators */}
          <div className="text-[8px] text-white/5 tracking-[0.2em] font-black uppercase flex items-center justify-between border-t border-white/5 pt-4">
            <span>Last updated: just now</span>
            <span>Auto-refresh: On (120s cycle)</span>
            <span>Data as of: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>

        </div>
      )}

      {activeTab === 'users' && (
        <div className="flex flex-col gap-6 animate-fade-in">
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
                  {paginatedUsers.length > 0 ? paginatedUsers.filter(Boolean).map((u, idx) => {
                    const userId = u.id || u._id || u.email || `user-${idx}`;
                    const userName = u.name || 'Unknown';
                    const userEmail = u.email || '';
                    const userRole = u.role || '';
                    const userStatus = u.status || 'Inactive';
                    return (
                      <tr key={userId} className="hover:bg-white/5 transition-colors group cursor-default">
                        <td className="py-3 px-2 border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-white/20 uppercase">
                              {userName.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white group-hover:text-primary transition-colors">{userName}</span>
                              <span className="text-[8px] text-white/20 tracking-tighter uppercase font-black">{userEmail}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 border-b border-white/5">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                            {userRole.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-2 border-b border-white/5">
                          <div className="flex items-center justify-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-none ${userStatus === 'Active' ? 'bg-status-success' : 'bg-status-error'}`} />
                            <span className={`text-[8px] font-black uppercase tracking-widest ${userStatus === 'Active' ? 'text-status-success' : 'text-status-error'}`}>{userStatus}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-right border-b border-white/5">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-none bg-white/5 border border-white/10 text-white/20 hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                          >
                            <SettingsIcon size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
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
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-1.5 rounded-none bg-white/5 border border-white/10 text-white/20 hover:text-white disabled:opacity-10 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex gap-1 px-2">
                    {paginationRange.map((pageNumber, pageIdx) => {
                      if (pageNumber === '...') {
                        return (
                          <span
                            key={`dots-${pageIdx}`}
                            className="w-6 h-6 flex items-center justify-center text-[9px] font-black text-white/20"
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={`page-${pageNumber}`}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-6 h-6 rounded-none text-[9px] font-black transition-all cursor-pointer ${currentPage === pageNumber ? 'bg-primary text-black' : 'text-white/20 hover:text-white'}`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-none bg-white/5 border border-white/10 text-white/20 hover:text-white disabled:opacity-10 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} className="rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </DashboardSection>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <DashboardSection title="SQUAD_DIRECTIVE" icon={<Zap size={14} />}>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">TOTAL_UNITS: {teams.length}</span>
                <button
                  onClick={() => navigate('/admin/teams/create')}
                  className="p-2 px-4 bg-white/5 border border-white/10 rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={12} /> ADD_UNIT
                </button>
              </div>

              {teams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.filter(Boolean).map((t, idx) => {
                    const teamId = t.id || t._id || t.name || `team-${idx}`;
                    const teamName = t.name || 'Unnamed Squad';
                    const membersCount = t.members || 0;
                    return (
                      <div key={teamId} className="group p-4 bg-white/5 border border-white/10 rounded-none flex items-center justify-between hover:bg-white/10 transition-colors">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{teamName}</span>
                          <span className="text-[8px] text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
                            <Users size={12} className="text-primary/40" /> {membersCount}_OPERATIVES
                          </span>
                          {t.lead && (
                            <span className="text-[8px] text-white/25 uppercase font-bold">Lead: {t.lead}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => navigate(`/admin/teams/edit/${teamId}`)} className="p-1.5 text-white/20 hover:text-primary transition-colors cursor-pointer"><SettingsIcon size={12} /></button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete squad unit ${teamName}?`)) {
                                deleteTeamMutation.mutate(teamId, {
                                  onSuccess: () => {
                                    toast.success('Squad unit successfully deleted');
                                  },
                                  onError: (err) => {
                                    toast.error(err?.message || 'Failed to delete squad unit');
                                  }
                                });
                              }
                            }}
                            className="p-1.5 text-white/20 hover:text-status-error transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-white/10">
                  <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">NO_SQUAD_UNITS_REGISTERED</span>
                </div>
              )}
            </div>
          </DashboardSection>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <DashboardSection title="ROLES & PERMISSIONS" icon={<Shield size={14} />}>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">SECURITY: ENFORCED</span>
                <button
                  onClick={() => setIsCreateRoleModalOpen(true)}
                  className="text-[9px] font-black uppercase text-primary tracking-widest hover:brightness-125 cursor-pointer"
                >
                  ADD_ROLE
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.filter(Boolean).map((r, idx) => {
                  const roleName = r.role || '';
                  const permissions = Array.isArray(r.permissions) ? r.permissions : [];
                  const stableKey = roleName || r.id || r._id || `role-${idx}`;
                  return (
                    <div
                      key={stableKey}
                      onClick={() => setEditingRole(r)}
                      className="group p-4 bg-white/5 border border-white/10 rounded-none flex flex-col gap-3 cursor-pointer hover:bg-white/10 transition-colors justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{roleName.replace(/_/g, ' ')}</span>
                        <SettingsIcon size={12} className="text-white/10 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {permissions.slice(0, 3).map((perm) => (
                          <span key={perm} className="text-[7px] font-black bg-white/5 text-white/40 px-1 py-0.5">{perm}</span>
                        ))}
                        {permissions.length > 3 && (
                          <span className="text-[7px] font-black bg-primary/10 text-primary px-1 py-0.5">+{permissions.length - 3} MORE</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                        <span className="text-[7px] font-black text-white/20">{r.isCustom ? 'CUSTOM ROLE' : 'SYSTEM NATIVE'}</span>
                        <span className="text-[7px] text-white/30 uppercase">Config permissions</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </DashboardSection>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">

          {/* Settings Section */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <DashboardSection title="WORKSPACE_SETTINGS" icon={<SettingsIcon size={14} />}>
              <div className="flex flex-col gap-3 py-1">
                {[
                  { label: 'TIMEZONE', key: 'timezone', value: settings?.timezone, icon: <Globe size={14} /> },
                  { label: 'WORK_HOURS', key: 'workingHours', value: settings?.workingHours, icon: <Clock size={14} /> },
                  { label: 'POLICIES', key: 'notificationRules', value: settings?.notificationRules, icon: <Shield size={14} /> },
                  { label: 'DEFAULTS', key: 'projectDefaults', value: settings?.projectDefaults, icon: <Zap size={14} /> }
                ].map((setting) => (
                  <button
                    key={setting.key}
                    onClick={() => setActiveSetting(setting)}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-none hover:bg-white/10 transition-colors group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-white/10 group-hover:text-primary transition-colors">{setting.icon}</div>
                      <span className="text-[9px] font-black text-white/30 group-hover:text-white transition-colors uppercase tracking-[0.2em]">{setting.label}</span>
                    </div>
                    <span className="text-[9px] font-black text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-widest truncate max-w-[150px]">{setting.value || 'DEFAULT'}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[8px] text-white/5 text-center uppercase tracking-widest font-black">SYSTEM_WIDE_DIRECTIVES_ENFORCED.</p>
            </DashboardSection>
          </div>

          {/* Integrations Section */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <DashboardSection title="INTEGRATIONS" icon={<LinkIcon size={14} />}>
              <div className="grid grid-cols-2 gap-4">
                {integrations.filter(Boolean).map((tool, idx) => {
                  const toolName = tool.name || 'Unknown';
                  const toolIcon = tool.icon || '';
                  const toolStatus = tool.status || 'offline';
                  return (
                    <button
                      key={tool.id || tool._id || toolName || `tool-${idx}`}
                      onClick={() => handleConnect(tool)}
                      className="group bg-white/5 border border-white/10 p-4 rounded-none flex flex-col items-center gap-3 transition-all hover:bg-white/10 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-none bg-black border border-white/10 flex items-center justify-center text-white/10 group-hover:text-primary transition-colors">
                        {toolIcon === 'github' ? <GitBranch size={18} /> : toolIcon === 'slack' ? <MessageSquare size={18} /> : <LinkIcon size={18} />}
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{toolName}</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-none ${toolStatus === 'connected' ? 'bg-status-success animate-pulse' : 'bg-white/10'}`} />
                          <span className="text-[7px] font-black uppercase tracking-widest text-white/20">{toolStatus === 'connected' ? 'CONNECTED' : 'OFFLINE'}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-[8px] text-white/10 uppercase font-black tracking-[0.2em] text-center border-t border-white/5 pt-4">UPGRADE TO CORE_OPERATOR FOR EXPANDED ACCESS.</p>
            </DashboardSection>
          </div>

        </div>
      )}

      <WorkspaceSettingsModal
        isOpen={!!activeSetting}
        onClose={() => setActiveSetting(null)}
        setting={activeSetting}
        currentValue={activeSetting ? settings[activeSetting.key] : ''}
        onSave={(newVal) => {
          updateSettingsMutation.mutate({ ...settings, [activeSetting.key]: newVal }, {
            onSuccess: () => {
              toast.success('Workspace setting updated');
              setActiveSetting(null);
            },
            onError: (err) => {
              toast.error(err?.message || 'Failed to update workspace setting');
            }
          });
        }}
      />

      <UserEditModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={({ userId, role }) => {
          updateRoleMutation.mutate({ userId, role }, {
            onSuccess: () => {
              toast.success('User role updated');
              setEditingUser(null);
            },
            onError: (err) => {
              toast.error(err?.message || 'Failed to update user role');
            }
          });
        }}
        onDeactivate={({ userId, status }) => {
          deactivateMutation.mutate({ userId, status }, {
            onSuccess: () => {
              toast.success(`User successfully ${status === 'Active' ? 'activated' : 'deactivated'}`);
              setEditingUser(null);
            },
            onError: (err) => {
              toast.error(err?.message || 'Failed to update user status');
            }
          });
        }}
      />



      <RolePermissionsModal
        isOpen={!!editingRole}
        onClose={() => setEditingRole(null)}
        role={editingRole}
        availablePermissions={availablePermissions}
        onSave={(roleName, permissions) => {
          updateRolePermissionsMutation.mutate({ role: roleName, permissions }, {
            onSuccess: () => {
              toast.success('Role permissions successfully updated');
              setEditingRole(null);
            },
            onError: (err) => {
              toast.error(err?.message || 'Failed to update role permissions');
            }
          });
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
              toast.error(err?.message || 'Failed to create custom access role');
            }
          });
        }}
      />

      <ConnectGithubModal
        isOpen={!!connectingIntegration}
        onClose={() => setConnectingIntegration(null)}
        onConnect={(token) => connectMutation.mutate(token)}
        isLoading={connectMutation.isPending}
        error={connectMutation.error?.message || connectMutation.error?.response?.data?.message}
      />

    </div>
  );
};

export default AdminDashboard;

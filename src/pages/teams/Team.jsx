import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Mail,
  UserPlus,
  Trash2,
  Clock,
  Search,
  Box,
  Rocket,
  AlertCircle,
  Loader2,
  MoreVertical,
  ShieldCheck,
  Plus,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle,
  AlertTriangle,
  UserMinus,
  Check,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';

// Context & Services
import { useAuth } from '../../context/AuthContext';
import TeamService from '../../api/teamApi';
import ProjectService from '../../api/projectApi';
import AdminService from '../../api/adminApi';
import { USER_ROLES } from '../../constants';
import { usePermissions, PERMISSIONS } from '../../hooks/usePermissions';
import { useDebounce } from '../../hooks/useDebounce';

// Atomic Components
import Skeleton from '../../components/atoms/Skeleton';
import TacticalModal from '../../components/molecules/TacticalModal';

const TeamSkeleton = () => (
  <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-6 space-y-6 bg-background min-h-screen">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
    <div className="space-y-4">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  </div>
);

const Team = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  // Data & Pagination State
  const [data, setData] = useState({ items: [], total: 0, stats: null });
  const [allProjects, setAllProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // UI & Loading States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [activeProjectMenuId, setActiveProjectMenuId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [actionLoading, setActionLoading] = useState({
    updating: null,
  });

  // Modal Configs
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    type: 'danger',
    onConfirm: () => {},
  });

  // Derived State
  const userProjectId =
    user?.assignedProjectId?.id ||
    user?.assignedProjectId?._id ||
    user?.assignedProjectId;

  // Reset page to 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  /**
   * Primary data fetcher
   */
  const fetchData = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError('');

        const [teamRes, projectRes] = await Promise.all([
          TeamService.getMembers({
            page: currentPage,
            limit: pageSize,
            search: debouncedSearch,
          }),
          ProjectService.getProjects(),
        ]);

        if (signal?.aborted) return;

        setData(teamRes || { items: [], total: 0, stats: null });

        const projectArray = Array.isArray(projectRes?.data?.projects)
          ? projectRes.data.projects.map((p) => ({ ...p, id: p._id || p.id }))
          : (projectRes?.projects || projectRes || []).map((p) => ({
              ...p,
              id: p._id || p.id,
            }));

        setAllProjects(projectArray);
        setLastUpdated(new Date());
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError('Failed to load workspace directory. Please refresh.');
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [currentPage, pageSize, debouncedSearch]
  );

  useEffect(() => {
    const abortController = new AbortController();

    const IC_ROLES = [
      USER_ROLES.SENIOR_ENGINEER,
      USER_ROLES.SOFTWARE_ENGINEER,
      USER_ROLES.PROJECT_MEMBER,
      USER_ROLES.INTERN,
    ];
    const isIC = IC_ROLES.includes(user?.role);

    if (isIC && userProjectId) {
      navigate(`/team/project/${userProjectId}`, { replace: true });
    } else {
      fetchData(abortController.signal);
    }

    return () => abortController.abort();
  }, [user, navigate, fetchData, userProjectId]);

  // Click outside listener to close action menus
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdownId(null);
      setActiveProjectMenuId(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  /**
   * Action Handlers
   */
  const handleAssignProject = async (memberId, projectId) => {
    try {
      setActionLoading((prev) => ({ ...prev, updating: memberId }));
      await TeamService.updateMemberProject(memberId, projectId);
      toast.success('Project sector reallocated successfully.');
      fetchData();
    } catch (err) {
      toast.error('Failed to update project assignment.');
    } finally {
      setActionLoading((prev) => ({ ...prev, updating: null }));
      setActiveProjectMenuId(null);
      setActiveDropdownId(null);
    }
  };

  const handleRevokeInvitation = async (invitationId) => {
    try {
      setActionLoading((prev) => ({ ...prev, updating: invitationId }));
      await TeamService.removeInvitation(invitationId);
      toast.success('Invitation revoked successfully.');
      fetchData();
    } catch (err) {
      toast.error('Failed to revoke invitation.');
    } finally {
      setActionLoading((prev) => ({ ...prev, updating: null }));
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleToggleDeactivate = async (memberId, currentStatus) => {
    const targetStatus =
      currentStatus === 'Deactivated' ? 'Active' : 'Deactivated';
    try {
      setActionLoading((prev) => ({ ...prev, updating: memberId }));
      await AdminService.deactivateUser(memberId, targetStatus);
      toast.success(
        `User membership ${targetStatus === 'Active' ? 'reactivated' : 'deactivated'} successfully.`
      );
      fetchData();
    } catch (err) {
      toast.error('Failed to toggle user active status.');
    } finally {
      setActionLoading((prev) => ({ ...prev, updating: null }));
      setModalConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  /**
   * CSV Directory Exporter
   */
  const handleExportCSV = async () => {
    try {
      const toastId = toast.loading('Preparing CSV export...');
      const res = await TeamService.getMembers({
        limit: 10000,
        search: debouncedSearch,
      });
      const exportItems = res?.items || [];

      if (!exportItems.length) {
        toast.error('No data to export', { id: toastId });
        return;
      }

      const headers = [
        'Name',
        'Email',
        'Role',
        'Project/Sector',
        'Status',
        'MFA Status',
        'Joined On',
      ];
      const rows = exportItems.map((item) => [
        item.name,
        item.email,
        item.jobTitle || item.role,
        item.assignedProjectId?.name || 'Unassigned',
        item.status,
        item.mfaEnabled ? 'Enabled' : 'Disabled',
        item.joinedOn ? new Date(item.joinedOn).toLocaleDateString() : 'N/A',
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        [
          headers.join(','),
          ...rows.map((r) =>
            r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')
          ),
        ].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `nexasetu_directory_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Directory CSV exported.', { id: toastId });
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  /**
   * Formatting Helpers
   */
  const getRoleBadgeClass = (role, jobTitle) => {
    const r = (role || jobTitle || '').toUpperCase();
    if (r === 'WORKSPACE_ADMIN' || r === 'ADMIN')
      return 'bg-purple-500/10 border border-purple-500/20 text-purple-400';
    if (r.includes('TECH_LEAD') || r.includes('LEAD'))
      return 'bg-blue-500/10 border border-blue-500/20 text-blue-400';
    if (r.includes('SENIOR'))
      return 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400';
    if (
      r.includes('SOFTWARE_ENGINEER') ||
      r.includes('PROJECT_MEMBER') ||
      r.includes('DEVELOPER') ||
      r.includes('SWE') ||
      r.includes('ENGINEER')
    )
      return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
    if (r.includes('QA'))
      return 'bg-teal-500/10 border border-teal-500/20 text-teal-400';
    if (r.includes('HR') || r.includes('MANAGER'))
      return 'bg-orange-500/10 border border-orange-500/20 text-orange-400';
    if (r.includes('INTERN'))
      return 'bg-gray-500/10 border border-gray-500/20 text-gray-400';
    return 'bg-white/5 border border-white/10 text-white/60';
  };

  const getRoleDisplayName = (role, jobTitle) => {
    const r = role?.toUpperCase();
    if (r === 'WORKSPACE_ADMIN' || r === 'ADMIN') return 'Administrator';
    if (r === 'TECH_LEAD') return 'Tech Lead';
    if (r === 'HR_MANAGER') return 'HR Manager';
    return jobTitle || 'Developer';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      case 'Inactive':
        return 'bg-blue-500/10 border border-blue-500/20 text-blue-400';
      case 'Deactivated':
        return 'bg-rose-500/10 border border-rose-500/20 text-rose-400';
      case 'Invited':
        return 'bg-amber-500/10 border border-amber-500/20 text-amber-400';
      default:
        return 'bg-white/5 border border-white/10 text-white/40';
    }
  };

  const formatLastActive = (date) => {
    if (!date) return 'Never';
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const formatJoinedOn = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const getTrendColor = (label, val) => {
    if (label === 'inactiveUsers' || label === 'deactivatedUsers') {
      return val <= 0 ? 'text-emerald-400' : 'text-rose-400';
    }
    return val >= 0 ? 'text-emerald-400' : 'text-rose-400';
  };

  const stats = data.stats || {
    totalUsers: { count: 0, growth: 0, trend: [] },
    activeUsers: { count: 0, growth: 0, trend: [] },
    newUsers: { count: 0, growth: 0, trend: [] },
    inactiveUsers: { count: 0, growth: 0, trend: [] },
    deactivatedUsers: { count: 0, growth: 0, trend: [] },
    mfaEnabled: { count: 0, percentage: 0 },
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    let sortableItems = [...(data.items || [])];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'role') {
          aValue = getRoleDisplayName(a.role, a.jobTitle);
          bValue = getRoleDisplayName(b.role, b.jobTitle);
        } else if (sortConfig.key === 'assignedProjectId') {
          aValue = a.assignedProjectId?.name || 'Unassigned';
          bValue = b.assignedProjectId?.name || 'Unassigned';
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data.items, sortConfig]);

  // Sparkline styling configurations
  const cardConfigs = [
    {
      label: 'Total Users',
      key: 'totalUsers',
      color: '#818CF8',
      icon: <Users size={14} className="text-indigo-400" />,
    },
    {
      label: 'Active Users (30d)',
      key: 'activeUsers',
      color: '#34D399',
      icon: <CheckCircle size={14} className="text-emerald-400" />,
    },
    {
      label: 'New Users (30d)',
      key: 'newUsers',
      color: '#60A5FA',
      icon: <UserPlus size={14} className="text-blue-400" />,
    },
    {
      label: 'Inactive Users (> 90d)',
      key: 'inactiveUsers',
      color: '#F59E0B',
      icon: <Clock size={14} className="text-amber-400" />,
    },
    {
      label: 'Deactivated Users',
      key: 'deactivatedUsers',
      color: '#EF4444',
      icon: <UserMinus size={14} className="text-rose-400" />,
    },
  ];

  if (loading && !data.items.length) return <TeamSkeleton />;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 py-6 space-y-6 bg-background text-text min-h-screen flex flex-col font-sans">
      {/* 1. Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtler pb-4">
        <div className="space-y-1">
          <h1 className="text-lg font-black tracking-widest uppercase text-text">
            Total Users
          </h1>
          <p className="text-text-subtle text-[9px] font-black uppercase tracking-[0.2em]">
            View, search, and manage all users across your organization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtler group-focus-within:text-primary transition-colors"
              size={12}
            />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full h-8 bg-background-elevated border border-border-subtle text-text rounded px-4 pl-9 focus:outline-none focus:border-primary/50 transition-all text-[9px] font-black uppercase tracking-widest placeholder:text-text-subtler"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleExportCSV}
            disabled={!data.items?.length}
            className="h-8 px-4 bg-background-elevated border border-border-subtle hover:border-border-subtle/50 disabled:opacity-40 text-text font-black uppercase tracking-[0.15em] text-[9px] rounded-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Download size={11} className="text-text-subtle" /> Export
          </button>

          {hasPermission(PERMISSIONS.INVITE_USERS) && (
            <button
              onClick={() => navigate('/team/add')}
              className="h-8 px-4 bg-primary text-black font-black uppercase tracking-[0.15em] text-[9px] rounded-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer hover:bg-primary/95"
            >
              <UserPlus size={11} /> Add User
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-status-error/5 border border-status-error/30 p-4 rounded-md flex items-start gap-4 animate-in fade-in duration-300">
          <AlertCircle
            className="text-status-error shrink-0 mt-0.5"
            size={16}
          />
          <div className="flex-1">
            <h4 className="text-[10px] font-black text-text uppercase tracking-widest mb-1">
              Error fetching directory
            </h4>
            <p className="text-[9px] text-text-subtle font-black uppercase tracking-widest">
              {error}
            </p>
          </div>
          <button
            onClick={() => fetchData()}
            className="p-2 bg-background-elevated border border-border-subtle rounded hover:bg-background-light/20 transition-colors text-text"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      )}

      {/* 2. Top Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cardConfigs.map((card) => {
          const item = stats[card.key];
          return (
            <div
              key={card.key}
              className="bg-background-elevated border border-border-subtler p-3 flex flex-col justify-between hover:border-border-subtle transition-all rounded-sm group relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-black uppercase tracking-[0.15em] text-text-subtle truncate max-w-[80%]">
                  {card.label}
                </span>
                <div className="p-1 rounded bg-background-dark/40 border border-border-subtler">
                  {card.icon}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mt-1 leading-none">
                <span className="text-xl font-black text-text">
                  {item.count.toLocaleString()}
                </span>
                <span
                  className={`text-[8px] font-black tracking-wide leading-none flex items-center ${getTrendColor(card.key, item.growth)}`}
                >
                  {item.growth >= 0 ? '↑' : '↓'} {Math.abs(item.growth)}%
                </span>
              </div>

              <div className="h-10 mt-3 -mx-3 -mb-3 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={item.trend || []}
                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={`grad_${card.key}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={card.color}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={card.color}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke={card.color}
                      strokeWidth={1}
                      fillOpacity={1}
                      fill={`url(#grad_${card.key})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}

        {/* MFA Card (Special layout with progress bar) */}
        <div className="bg-background-elevated border border-border-subtler p-3 flex flex-col justify-between hover:border-border-subtle transition-all rounded-sm group">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-text-subtle">
              MFA Enabled
            </span>
            <div className="p-1 rounded bg-background-dark/40 border border-border-subtler">
              <ShieldCheck size={14} className="text-blue-400" />
            </div>
          </div>

          <div className="flex items-baseline gap-1 mt-1 leading-none">
            <span className="text-xl font-black text-text">
              {stats.mfaEnabled.count.toLocaleString()}
            </span>
            <span className="text-[8px] font-bold text-text-subtle uppercase tracking-widest leading-none">
              ({stats.mfaEnabled.percentage}%)
            </span>
          </div>

          <div className="mt-4 pb-1">
            <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden border border-white/5">
              <div
                className="bg-blue-500 h-full transition-all duration-700"
                style={{ width: `${stats.mfaEnabled.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Directory Table */}
      <div className="bg-background-light border border-border-subtler flex-1 flex flex-col min-h-[400px]">
        {/* Table Title and Actions */}
        <div className="p-4 border-b border-border-subtler flex justify-between items-center bg-background-elevated/40">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
            User List ({data.total})
          </h2>
          <span className="text-[8px] font-black text-text-subtler uppercase tracking-widest">
            Last Updated: {formatLastActive(lastUpdated)}
          </span>
        </div>

        {/* Combined User Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="text-[7px] text-text-subtle uppercase font-black tracking-[0.2em] border-b border-border-subtler bg-background-elevated/20 select-none">
                <th className="py-2.5 px-4 w-10">
                  <input
                    type="checkbox"
                    className="accent-primary h-3 w-3 bg-background border border-border-subtle rounded-sm cursor-pointer focus:outline-none"
                    disabled
                  />
                </th>
                <th
                  className="py-2.5 px-4 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('name')}
                >
                  User{' '}
                  {sortConfig.key === 'name' &&
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="py-2.5 px-4 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('email')}
                >
                  Email{' '}
                  {sortConfig.key === 'email' &&
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="py-2.5 px-4 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('role')}
                >
                  Role{' '}
                  {sortConfig.key === 'role' &&
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="py-2.5 px-4 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('assignedProjectId')}
                >
                  Workspace Project{' '}
                  {sortConfig.key === 'assignedProjectId' &&
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="py-2.5 px-4 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('status')}
                >
                  Status{' '}
                  {sortConfig.key === 'status' &&
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="py-2.5 px-4 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('mfaEnabled')}
                >
                  MFA{' '}
                  {sortConfig.key === 'mfaEnabled' &&
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="py-2.5 px-4 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('lastActive')}
                >
                  Last Active{' '}
                  {sortConfig.key === 'lastActive' &&
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="py-2.5 px-4 cursor-pointer hover:text-text transition-colors"
                  onClick={() => handleSort('joinedOn')}
                >
                  Joined On{' '}
                  {sortConfig.key === 'joinedOn' &&
                    (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtler text-[9.5px] font-bold text-text">
              {sortedItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-background-elevated/20 transition-colors leading-tight align-middle"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      className="accent-primary h-3 w-3 bg-background border border-border-subtle rounded-sm cursor-pointer focus:outline-none"
                      disabled
                    />
                  </td>

                  {/* User Avatar + Name */}
                  <td className="py-3 px-4 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-sm bg-background-elevated border border-border-subtle text-text flex items-center justify-center font-black uppercase text-[10px] shrink-0 overflow-hidden select-none">
                      {item.profilePicture ? (
                        <img
                          src={item.profilePicture}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        item.name?.slice(0, 2)
                      )}
                    </div>
                    <span className="font-black text-text hover:text-primary transition-colors cursor-default">
                      {item.name}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-text/70 select-all font-medium">
                    {item.email}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-wider rounded-[1px] leading-none whitespace-nowrap ${getRoleBadgeClass(
                        item.role,
                        item.jobTitle
                      )}`}
                    >
                      {getRoleDisplayName(item.role, item.jobTitle)}
                    </span>
                  </td>

                  {/* Workspace Project */}
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1.5 uppercase tracking-widest text-[8px] font-black text-text-subtle">
                      <Box size={10} className="text-text-subtler shrink-0" />
                      <span className="truncate max-w-[150px]">
                        {item.assignedProjectId?.name || 'Unassigned'}
                      </span>
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-wider rounded-[1px] leading-none whitespace-nowrap ${getStatusBadgeClass(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* MFA */}
                  <td className="py-3 px-4">
                    {item.mfaEnabled ? (
                      <ShieldCheck
                        size={13}
                        className="text-blue-400 fill-blue-500/10 shrink-0"
                      />
                    ) : (
                      <span className="text-text-subtler font-black">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-text-subtle uppercase tracking-wide text-[8px] whitespace-nowrap">
                    {formatLastActive(item.lastActive)}
                  </td>

                  <td className="py-3 px-4 text-text-subtler uppercase tracking-wide text-[8px] whitespace-nowrap">
                    {formatJoinedOn(item.joinedOn)}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3 px-4 text-right relative">
                    <button
                      aria-label="Actions menu"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(
                          activeDropdownId === item.id ? null : item.id
                        );
                        setActiveProjectMenuId(null);
                      }}
                      className="p-1 text-text-subtle hover:text-text rounded hover:bg-background-elevated transition-colors cursor-pointer"
                    >
                      <MoreVertical size={13} />
                    </button>

                    {activeDropdownId === item.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-4 mt-1 w-44 bg-background-elevated border border-border-subtle rounded-sm shadow-2xl z-50 text-left py-1 animate-in fade-in zoom-in-95 duration-100"
                      >
                        {item.type === 'member' && (
                          <>
                            {/* Project Allocation Sub-menu Trigger */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setActiveProjectMenuId(
                                    activeProjectMenuId === item.id
                                      ? null
                                      : item.id
                                  )
                                }
                                className="w-full px-3 py-2 text-[8px] font-black uppercase tracking-widest text-text-muted hover:text-text hover:bg-background-light/20 flex items-center justify-between cursor-pointer"
                              >
                                Reassign Project
                                <ChevronRight size={10} />
                              </button>

                              {activeProjectMenuId === item.id && (
                                <div className="absolute right-full top-0 mr-1 w-48 bg-background-elevated border border-border-subtle rounded-sm shadow-2xl py-1 z-50 overflow-y-auto max-h-48">
                                  <button
                                    onClick={() =>
                                      handleAssignProject(item.id, null)
                                    }
                                    className="w-full px-3 py-2 text-[8px] font-black uppercase tracking-widest text-text-muted hover:text-text hover:bg-background-light/20 text-left flex justify-between items-center cursor-pointer"
                                  >
                                    Unassign Project
                                    {!item.assignedProjectId && (
                                      <Check
                                        size={10}
                                        className="text-primary"
                                      />
                                    )}
                                  </button>
                                  {allProjects.map((p) => (
                                    <button
                                      key={p.id}
                                      onClick={() =>
                                        handleAssignProject(item.id, p.id)
                                      }
                                      className="w-full px-3 py-2 text-[8px] font-black uppercase tracking-widest text-text-muted hover:text-text hover:bg-background-light/20 text-left flex justify-between items-center cursor-pointer"
                                    >
                                      <span className="truncate max-w-[120px]">
                                        {p.name}
                                      </span>
                                      {item.assignedProjectId?.id === p.id && (
                                        <Check
                                          size={10}
                                          className="text-primary"
                                        />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Deactivate / Reactivate User */}
                            {user?.id !== item.id && (
                              <button
                                onClick={() => {
                                  setActiveDropdownId(null);
                                  setModalConfig({
                                    isOpen: true,
                                    title:
                                      item.status === 'Deactivated'
                                        ? 'Reactivate User'
                                        : 'Deactivate User',
                                    message: `Are you sure you want to ${
                                      item.status === 'Deactivated'
                                        ? 'reactivate'
                                        : 'deactivate'
                                    } ${item.name}? This will update their login access.`,
                                    confirmText:
                                      item.status === 'Deactivated'
                                        ? 'Reactivate'
                                        : 'Deactivate',
                                    type:
                                      item.status === 'Deactivated'
                                        ? 'info'
                                        : 'danger',
                                    onConfirm: () =>
                                      handleToggleDeactivate(
                                        item.id,
                                        item.status
                                      ),
                                  });
                                }}
                                className="w-full px-3 py-2 text-[8px] font-black uppercase tracking-widest text-text-muted hover:text-text hover:bg-background-light/20 text-left cursor-pointer"
                              >
                                {item.status === 'Deactivated'
                                  ? 'Reactivate Member'
                                  : 'Deactivate Member'}
                              </button>
                            )}
                          </>
                        )}

                        {item.type === 'invitation' && (
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              setModalConfig({
                                isOpen: true,
                                title: 'Revoke Invitation',
                                message: `Are you sure you want to cancel the pending invitation sent to ${item.email}?`,
                                confirmText: 'Revoke',
                                type: 'danger',
                                onConfirm: () =>
                                  handleRevokeInvitation(item.id),
                              });
                            }}
                            className="w-full px-3 py-2 text-[8px] font-black uppercase tracking-widest text-status-error/80 hover:text-status-error hover:bg-background-light/20 text-left cursor-pointer"
                          >
                            Revoke Invitation
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {data.items.length === 0 && (
                <tr>
                  <td colSpan="10" className="py-20 text-center">
                    <AlertTriangle
                      size={32}
                      className="mx-auto text-text-subtler mb-4 animate-bounce"
                    />
                    <h3 className="text-xs font-black uppercase tracking-widest text-text">
                      No personnel records found
                    </h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-text-subtle mt-1">
                      No members or invitations matched the search keywords.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Control Footer */}
        <div className="p-4 border-t border-border-subtler flex flex-col sm:flex-row items-center justify-between gap-4 bg-background-elevated/20 text-[9px] font-black uppercase tracking-wider text-text-subtle select-none">
          <div>
            {data.total > 0 ? (
              <span>
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, data.total)} of {data.total}{' '}
                users
              </span>
            ) : (
              <span>Showing 0 to 0 of 0 users</span>
            )}
          </div>

          {/* Page numbers list */}
          {data.pages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                className="w-7 h-7 flex items-center justify-center border border-border-subtle hover:border-border-subtle/55 disabled:opacity-30 rounded-[1px] transition-colors cursor-pointer text-text disabled:cursor-not-allowed"
              >
                <ChevronLeft size={10} />
              </button>

              {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => {
                // simple ellipsis styling for long pagination lists
                if (
                  data.pages > 7 &&
                  Math.abs(p - currentPage) > 2 &&
                  p !== 1 &&
                  p !== data.pages
                ) {
                  if (p === 2 || p === data.pages - 1) {
                    return (
                      <span key={p} className="px-1 text-text-subtler">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 flex items-center justify-center border rounded-[1px] font-black transition-all cursor-pointer ${
                      currentPage === p
                        ? 'bg-primary border-primary text-black'
                        : 'border-border-subtle hover:border-border-subtle/55 text-text'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                disabled={currentPage === data.pages}
                onClick={() =>
                  setCurrentPage((c) => Math.min(data.pages, c + 1))
                }
                className="w-7 h-7 flex items-center justify-center border border-border-subtle hover:border-border-subtle/55 disabled:opacity-30 rounded-[1px] transition-colors cursor-pointer text-text disabled:cursor-not-allowed"
              >
                <ChevronRight size={10} />
              </button>
            </div>
          )}

          {/* Page size dropdown */}
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-background-elevated border border-border-subtle hover:border-border-subtle/50 text-[9px] font-black uppercase tracking-wider text-text pl-3.5 pr-8 py-1.5 focus:outline-none focus:border-primary/50 cursor-pointer rounded-[1px] appearance-none"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
            <ChevronLeft
              size={10}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 -rotate-90 text-text-subtle pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Bottom Info Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-[8px] font-black uppercase tracking-wider text-text-subtler border-t border-border-subtler pt-4 mt-auto">
        <div className="flex items-center gap-4">
          <span>Auto-refresh: On</span>
          <button
            onClick={() => fetchData()}
            className="flex items-center gap-1 text-text-subtle hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
          >
            <RefreshCw size={9} /> Sync
          </button>
        </div>
        <div>
          Data as of: {lastUpdated.toLocaleDateString()}{' '}
          {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      <TacticalModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        type={modalConfig.type}
      />
    </div>
  );
};

export default Team;

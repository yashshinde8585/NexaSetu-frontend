import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  UserCheck,
  Key,
  Fingerprint,
  Lock,
  ChevronDown,
  TrendingUp,
  Check,
  Clock,
  AlertOctagon,
  HardDrive,
  Link as LinkIcon,
  Zap,
  Server,
  Plus,
  UserPlus,
  Shield,
  BarChart3,
  Settings as SettingsIcon,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';

const ROLE_COLORS = [
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#3B82F6',
  '#10B981',
  '#6B7280',
];

const CommandCenterTab = ({
  data,
  setActiveTab,
  setCurrentPage,
  setActiveSetting,
}) => {
  const navigate = useNavigate();

  const { overview = {}, settings: rawSettings = {} } = data || {};

  const settings =
    rawSettings && typeof rawSettings === 'object' ? rawSettings : {};

  const activeUsersCount = useMemo(() => {
    const rawUsers = Array.isArray(data?.users)
      ? data.users.filter(Boolean)
      : [];
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return rawUsers.filter((u) => {
      const dateToCheck = u?.lastActive || u?.updatedAt;
      if (!dateToCheck) return false;
      const d = new Date(dateToCheck);
      return !isNaN(d.getTime()) && d.getTime() >= thirtyDaysAgo;
    }).length;
  }, [data?.users]);

  const sparklineData = useMemo(() => {
    return {
      projects: Array.isArray(data?.analyticsTrends?.projects)
        ? data.analyticsTrends.projects
        : [],
      totalUsers: Array.isArray(data?.analyticsTrends?.users)
        ? data.analyticsTrends.users
        : [],
      activeUsers: Array.isArray(data?.analyticsTrends?.activeUsers)
        ? data.analyticsTrends.activeUsers
        : [],
      adminUsers: Array.isArray(data?.analyticsTrends?.admins)
        ? data.analyticsTrends.admins
        : [],
    };
  }, [data?.analyticsTrends]);

  const userDistributionData = useMemo(() => {
    const rawUsers = Array.isArray(data?.users)
      ? data.users.filter(Boolean)
      : [];
    const counts = {
      ADMINISTRATOR: 0,
      WORKSPACE_ADMIN: 0,
      PROJECT_ADMIN: 0,
      DEVELOPER: 0,
      QA_ENGINEER: 0,
      VIEWER: 0,
    };

    rawUsers.forEach((u) => {
      const r = (u?.role || '').toUpperCase();
      if (counts[r] !== undefined) {
        counts[r] += 1;
      } else if (r.includes('ADMIN')) {
        counts['WORKSPACE_ADMIN'] += 1;
      } else if (
        r.includes('DEV') ||
        r.includes('ENGINEER') ||
        r.includes('SOFTWARE_ENGINEER')
      ) {
        counts['DEVELOPER'] += 1;
      } else if (r.includes('QA')) {
        counts['QA_ENGINEER'] += 1;
      } else {
        counts['VIEWER'] += 1;
      }
    });

    const finalData = Object.keys(counts).map((key) => {
      return {
        name: key.replace(/_/g, ' '),
        value: counts[key],
      };
    });

    const total = finalData.reduce((sum, item) => sum + item.value, 0);

    return finalData.map((item) => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0',
    }));
  }, [data?.users]);

  const usersGrowthTrend = useMemo(() => {
    return Array.isArray(data?.usersGrowthTrend) ? data.usersGrowthTrend : [];
  }, [data?.usersGrowthTrend]);

  const recentActivities = useMemo(() => {
    return (
      Array.isArray(data?.securityLogs) ? data.securityLogs.filter(Boolean) : []
    )
      .slice(0, 5)
      .map((log) => {
        let timeFormatted = 'Recent';
        if (log?.time) {
          const d = new Date(log.time);
          if (!isNaN(d.getTime())) {
            timeFormatted = d.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
          }
        }
        return {
          id:
            log?.id ||
            log?._id ||
            `activity-${log?.performer || 'SO'}-${log?.action || ''}-${log?.time || ''}`,
          name: log?.performer || 'System Operator',
          email: 'operator@nexasetu.io',
          action: (log?.action || '').replace(/_/g, ' ').toLowerCase(),
          time: timeFormatted,
          avatarInitials: String(log?.performer || 'SO')
            .substring(0, 2)
            .toUpperCase(),
        };
      });
  }, [data?.securityLogs]);

  const projectsOverview = useMemo(() => {
    return Array.isArray(data?.projectsOverview)
      ? data.projectsOverview.filter(Boolean)
      : [];
  }, [data?.projectsOverview]);

  const auditLogsRows = useMemo(() => {
    return (
      Array.isArray(data?.securityLogs) ? data.securityLogs.filter(Boolean) : []
    ).map((log, idx) => {
      let resource = 'System Config';
      const act = log?.action || '';
      if (act.includes('USER')) resource = 'User Account';
      if (act.includes('TEAM')) resource = 'Team Unit';
      if (act.includes('ROLE')) resource = 'Access Role';

      let timeFormatted = 'Recent';
      if (log?.time) {
        const d = new Date(log.time);
        if (!isNaN(d.getTime())) {
          timeFormatted = d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        }
      }
      return {
        id:
          log?.id ||
          log?._id ||
          `log-${log?.performer || 'system'}-${log?.action || ''}-${log?.time || idx}`,
        time: timeFormatted,
        user: log?.performer || 'System',
        action: act.replace(/_/g, ' '),
        resource,
        ip: log?.ip || 'Internal',
      };
    });
  }, [data?.securityLogs]);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* 1. Metrics Strip (Row 1) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Projects */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              Projects
            </span>
            <span className="text-secondary">
              <LayoutGrid size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-1.5">
            <div>
              <span className="text-2xl font-black tracking-tighter">
                {projectsOverview.length}
              </span>
              <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                <span>Active</span>
                <span className="text-white/20 font-bold uppercase">
                  Projects
                </span>
              </div>
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={sparklineData.projects}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#8B5CF6"
                  fill="rgba(139, 92, 246, 0.1)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </div>
          </div>
        </div>

        {/* Card 2: Total Users */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              Total Users
            </span>
            <span className="text-primary">
              <Users size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-1.5">
            <div>
              <span className="text-2xl font-black tracking-tighter">
                {(overview?.totalUsers || 0).toLocaleString()}
              </span>
              <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                <span>↑ 5.3%</span>
                <span className="text-white/20 font-bold uppercase">
                  vs last mo
                </span>
              </div>
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={sparklineData.totalUsers}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#3B82F6"
                  fill="rgba(59, 130, 246, 0.1)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </div>
          </div>
        </div>

        {/* Card 3: Active Users (30d) */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              Active Users
            </span>
            <span className="text-status-success">
              <UserCheck size={12} />
            </span>
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
              <AreaChart width={56} height={28} data={sparklineData.activeUsers}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#22C55E"
                  fill="rgba(34, 197, 94, 0.1)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </div>
          </div>
        </div>

        {/* Card 4: Admin Users */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              Admins
            </span>
            <span className="text-status-warning">
              <Key size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-1.5">
            <div>
              <span className="text-2xl font-black tracking-tighter">
                {data?.users?.filter((u) =>
                  (u.role || '').toUpperCase().includes('ADMIN')
                ).length || 0}
              </span>
              <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                <span>Assigned</span>
                <span className="text-white/20 font-bold uppercase">roles</span>
              </div>
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={sparklineData.adminUsers}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#F59E0B"
                  fill="rgba(245, 158, 11, 0.1)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </div>
          </div>
        </div>

        {/* Card 5: SSO Coverage */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              SSO Coverage
            </span>
            <span className="text-secondary">
              <Fingerprint size={12} />
            </span>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-black tracking-tighter">
              {data?.securityOverview?.totalWorkspaces > 0
                ? Math.round(
                    ((data?.securityOverview?.ssoEnforcedWorkspaces || 0) /
                      data.securityOverview.totalWorkspaces) *
                      100
                  )
                : 0}
              %
            </span>
            <div className="text-[7.5px] text-white/30 font-black uppercase mt-0.5">
              Workspace via SSO
            </div>
            <div className="w-full bg-white/5 h-1 mt-1 rounded-none overflow-hidden">
              <div
                className="bg-secondary h-full"
                style={{
                  width: `${data?.securityOverview?.totalWorkspaces > 0 ? ((data?.securityOverview?.ssoEnforcedWorkspaces || 0) / data.securityOverview.totalWorkspaces) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 6: MFA Coverage */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              MFA Coverage
            </span>
            <span className="text-primary">
              <Lock size={12} />
            </span>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-black tracking-tighter">
              {data?.securityOverview?.totalUsers > 0
                ? Math.round(
                    ((data?.securityOverview?.mfaEnabledUsers || 0) /
                      data.securityOverview.totalUsers) *
                      100
                  )
                : 0}
              %
            </span>
            <div className="text-[7.5px] text-white/30 font-black uppercase mt-0.5">
              Users with MFA
            </div>
            <div className="w-full bg-white/5 h-1 mt-1 rounded-none overflow-hidden">
              <div
                className="bg-primary h-full"
                style={{
                  width: `${data?.securityOverview?.totalUsers > 0 ? ((data?.securityOverview?.mfaEnabledUsers || 0) / data.securityOverview.totalUsers) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Charts & Recent Activity (Row 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Distribution Donut */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[360px]">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              User Distribution by Role
            </span>
            <button
              onClick={() => setActiveTab('roles')}
              className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer"
            >
              View all roles
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative h-48 py-2">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
                    <Cell
                      key={`cell-${index}`}
                      fill={ROLE_COLORS[index % ROLE_COLORS.length]}
                    />
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
                    textTransform: 'uppercase',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center text inside Donut */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black tracking-tighter">
                {(overview?.totalUsers || 0).toLocaleString()}
              </span>
              <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">
                Total Users
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[9px] font-black uppercase border-t border-white/5 pt-4">
            {userDistributionData.map((d, index) => (
              <div
                key={d.name}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <div
                    className="w-1.5 h-1.5 shrink-0"
                    style={{
                      backgroundColor: ROLE_COLORS[index % ROLE_COLORS.length],
                    }}
                  />
                  <span className="text-white/60 truncate">{d.name}</span>
                </div>
                <span className="text-white shrink-0">
                  {d.value} ({d.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Users Growth Trend Line */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[360px]">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Users Growth Trend
            </span>
            <div className="relative bg-white/5 px-2 py-0.5 border border-white/10 text-[8px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-1 hover:bg-white/10">
              <span>Last 30 days</span>
              <ChevronDown size={10} />
            </div>
          </div>

          <div className="flex-1 w-full h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart
                data={usersGrowthTrend}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.03)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.2)"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.2)"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
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
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Recent User Activity
            </span>
            <button
              onClick={() =>
                toast.success('Telemetry logs are fully synchronized.')
              }
              className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-start mt-3 gap-3 overflow-y-auto max-h-[260px] pr-1 custom-scrollbar">
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between py-2 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] px-1 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-white/40 uppercase">
                      {act.avatarInitials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white">
                        {act.name}
                      </span>
                      <span className="text-[8px] text-white/30 uppercase font-semibold">
                        {act.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-[9px] font-black text-secondary uppercase bg-secondary/10 px-2 py-0.5">
                      {act.action}
                    </span>
                    <span className="text-[8px] text-white/20 mt-1 font-semibold">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center border border-dashed border-white/10 my-auto">
                <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">
                  NO_RECENT_SECURITY_TELEMETRY
                </span>
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
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Project Overview
            </span>
            <span
              className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
              onClick={() => toast.success('Live project channels functional.')}
            >
              View All
            </span>
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
                {projectsOverview.map((item, idx) => {
                  const projName = item.name || 'Unnamed';
                  const projType = item.type || 'N/A';
                  const projUsers = item.users || 0;
                  const projStatus = item.status || 'inactive';
                  const stableKey =
                    item.id || item._id || projName || `project-${idx}`;
                  return (
                    <tr
                      key={stableKey}
                      className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0"
                    >
                      <td className="py-2.5 text-white truncate max-w-[80px]">
                        {projName}
                      </td>
                      <td className="py-2.5 text-center text-white/60">
                        {projType}
                      </td>
                      <td className="py-2.5 text-center text-white/60">
                        {projUsers}
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`text-[8px] px-1.5 py-0.5 uppercase font-bold ${
                            projStatus === 'active'
                              ? 'bg-status-success/10 text-status-success'
                              : 'bg-white/10 text-white/40'
                          }`}
                        >
                          {projStatus}
                        </span>
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
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Security Overview
            </span>
            <span
              className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
              onClick={() => toast.success('Security logs synced.')}
            >
              View Details
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-3 mt-3">
            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2">
              <div className="p-1.5 bg-status-success/10 text-status-success">
                <Check size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-white/40 uppercase font-black">
                  SSO Enforced Workspaces
                </span>
                <span className="text-[11px] font-black text-white">
                  {data?.securityOverview?.ssoEnforcedWorkspaces || 0} /{' '}
                  {data?.securityOverview?.totalWorkspaces || 0}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2">
              <div className="p-1.5 bg-secondary/10 text-secondary">
                <Lock size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-white/40 uppercase font-black">
                  MFA Enabled Users
                </span>
                <span className="text-[11px] font-black text-white">
                  {(
                    data?.securityOverview?.mfaEnabledUsers || 0
                  ).toLocaleString()}{' '}
                  / {(data?.securityOverview?.totalUsers || 0).toLocaleString()}{' '}
                  (
                  {data?.securityOverview?.totalUsers > 0
                    ? Math.round(
                        ((data?.securityOverview?.mfaEnabledUsers || 0) /
                          data.securityOverview.totalUsers) *
                          100
                      )
                    : 0}
                  %)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2">
              <div className="p-1.5 bg-status-warning/10 text-status-warning">
                <Clock size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-white/40 uppercase font-black">
                  Inactive Users (&gt; 90 days)
                </span>
                <span className="text-[11px] font-black text-white">
                  {data?.securityOverview?.inactiveUsers || 0}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2">
              <div className="p-1.5 bg-status-error/10 text-status-error">
                <AlertOctagon size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-white/40 uppercase font-black">
                  Suspicious Logins (30d)
                </span>
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
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              System Usage
            </span>
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
                return (
                  parseFloat((bytes / Math.pow(k, idx)).toFixed(2)) +
                  ' ' +
                  sizes[idx]
                );
              };
              const storageUsed = data?.usage?.storageUsed || 0;
              const storageQuota = data?.usage?.storageQuota || 104857600;
              const usedStorageStr = formatBytes(storageUsed);
              const quotaStorageStr = formatBytes(storageQuota);
              const storagePct =
                storageQuota > 0
                  ? Math.min(
                      100,
                      Math.round((storageUsed / storageQuota) * 100)
                    )
                  : 0;

              const apiCount = data?.usage?.apiCalls || 0;
              const apiPct = Math.min(
                100,
                Math.round((apiCount / 50000000) * 100)
              );

              const aiCount = data?.usage?.aiUsage || 0;
              const aiPct = Math.min(100, Math.round((aiCount / 500000) * 100));

              return (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/40 flex items-center gap-1">
                        <HardDrive size={10} /> Storage Used
                      </span>
                      <span className="text-white">
                        {usedStorageStr} / {quotaStorageStr}{' '}
                        <span className="text-white/30">({storagePct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${storagePct}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/40 flex items-center gap-1">
                        <LinkIcon size={10} /> API Requests (30d)
                      </span>
                      <span className="text-white">
                        {apiCount.toLocaleString()} / 50M{' '}
                        <span className="text-white/30">({apiPct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                      <div
                        className="bg-secondary h-full"
                        style={{ width: `${apiPct}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/40 flex items-center gap-1">
                        <Zap size={10} /> AI Agent Compute
                      </span>
                      <span className="text-white">
                        {aiCount.toLocaleString()} / 500K{' '}
                        <span className="text-white/30">({aiPct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden">
                      <div
                        className="bg-status-warning h-full"
                        style={{ width: `${aiPct}%` }}
                      />
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
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              System Health
            </span>
            <span
              className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
              onClick={() => toast.success('All microservices fully synced.')}
            >
              View All
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2 mt-3 text-[9px] font-black uppercase">
            {[
              { name: 'Authentication Service', status: 'Healthy' },
              { name: 'Authorization Service', status: 'Healthy' },
              { name: 'Database', status: 'Healthy' },
              { name: 'File Storage', status: 'Healthy' },
              { name: 'Audit Logging', status: 'Healthy' },
            ].map((serv) => (
              <div
                key={serv.name}
                className="flex justify-between items-center py-1.5 border-b border-white/[0.02] last:border-0"
              >
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
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Audit Logs
            </span>
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
                {auditLogsRows.length > 0 ? (
                  auditLogsRows.slice(0, 5).map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0"
                    >
                      <td className="py-2.5 text-white/40">{log.time}</td>
                      <td className="py-2.5 text-white">{log.user}</td>
                      <td className="py-2.5 text-secondary">{log.action}</td>
                      <td className="py-2.5 text-white/60 truncate max-w-[80px]">
                        {log.resource}
                      </td>
                      <td className="py-2.5 text-right text-white/30">
                        {log.ip}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-8 text-center text-white/10 text-[8px] font-bold uppercase tracking-widest"
                    >
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
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Pending Approvals
            </span>
            <span
              className="text-[8px] font-black uppercase tracking-widest text-secondary hover:underline cursor-pointer"
              onClick={() => toast.success('Approval telemetry up to date.')}
            >
              View All
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2 mt-3">
            {[
              {
                name: 'Pending Access Requests',
                count: data?.pendingApprovals?.pendingActionRequests || 0,
              },
              {
                name: 'Deactivated Operatives',
                count: data?.pendingApprovals?.deactivatedUsersCount || 0,
              },
              {
                name: 'Pending Invitations',
                count: data?.pendingApprovals?.pendingInvitations || 0,
              },
              {
                name: 'AI Compute Operations',
                count: data?.pendingApprovals?.aiLogsCount || 0,
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all"
              >
                <span className="text-[9px] font-black text-white/60 uppercase">
                  {item.name}
                </span>
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
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Quick Actions
            </span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2 mt-3 text-[9px] font-black uppercase">
            <button
              onClick={() => navigate('/project-setup')}
              className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
            >
              <Plus
                size={14}
                className="text-primary mb-1.5 group-hover:scale-110 transition-transform"
              />
              <span>Create Workspace</span>
            </button>

            <button
              onClick={() => navigate('/team/add')}
              className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
            >
              <UserPlus
                size={14}
                className="text-secondary mb-1.5 group-hover:scale-110 transition-transform"
              />
              <span>Invite Users</span>
            </button>

            <button
              onClick={() => setActiveTab('roles')}
              className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
            >
              <Shield
                size={14}
                className="text-status-success mb-1.5 group-hover:scale-110 transition-transform"
              />
              <span>Manage Roles</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                toast.success(
                  'Scroll to integrations to configure Single Sign-On.'
                );
              }}
              className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
            >
              <Fingerprint
                size={14}
                className="text-status-warning mb-1.5 group-hover:scale-110 transition-transform"
              />
              <span>Configure SSO</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setActiveSetting({
                  label: 'TIMEZONE',
                  key: 'timezone',
                  value: settings?.timezone,
                });
              }}
              className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
            >
              <SettingsIcon
                size={14}
                className="text-white/60 mb-1.5 group-hover:scale-110 transition-transform"
              />
              <span>System Settings</span>
            </button>

            <button
              onClick={() =>
                toast.success('Generating workspace summary report PDF...')
              }
              className="flex flex-col items-center justify-center border border-white/5 hover:border-white/20 bg-white/[0.01] hover:bg-white/5 p-3 text-center transition-all cursor-pointer group"
            >
              <BarChart3
                size={14}
                className="text-status-info mb-1.5 group-hover:scale-110 transition-transform"
              />
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sparkline status indicators */}
      <div className="text-[8px] text-white/5 tracking-[0.2em] font-black uppercase flex items-center justify-between border-t border-white/5 pt-4">
        <span>Last updated: just now</span>
        <span>Auto-refresh: On (120s cycle)</span>
        <span>
          Data as of:{' '}
          {new Date().toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};

export default CommandCenterTab;

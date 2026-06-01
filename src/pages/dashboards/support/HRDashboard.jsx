import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  UserMinus,
  Activity,
  Heart,
  Clock,
  Calendar,
  Gift,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  FileText,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Target,
  Bell,
  Sparkles,
  HelpCircle,
  Layout,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import CenteredLoading from '../../../components/atoms/CenteredLoading';
import DrilldownModal from '../../../components/molecules/dashboard/DrilldownModal';

const DEPT_COLORS = {
  Engineering: '#8B5CF6', // Purple
  Product: '#F59E0B', // Amber
  'QA & Testing': '#EC4899', // Pink
  Design: '#3B82F6', // Blue
  Sales: '#10B981', // Emerald
  Marketing: '#6B7280', // Gray
  HR: '#a855f7', // Violet/Brand
  Finance: '#14b8a6', // Teal
  Default: '#475569', // Slate
};

const defaultSparklines = {
  totalEmployees: [
    { val: 1210 },
    { val: 1215 },
    { val: 1222 },
    { val: 1230 },
    { val: 1238 },
    { val: 1248 },
  ],
  newHires: [
    { val: 15 },
    { val: 18 },
    { val: 12 },
    { val: 24 },
    { val: 20 },
    { val: 28 },
  ],
  attrition: [
    { val: 10.5 },
    { val: 10.2 },
    { val: 9.9 },
    { val: 9.8 },
    { val: 9.7 },
    { val: 9.6 },
  ],
  engagement: [
    { val: 74 },
    { val: 75 },
    { val: 76 },
    { val: 75 },
    { val: 77 },
    { val: 78 },
  ],
  timeToFill: [
    { val: 38 },
    { val: 36 },
    { val: 35 },
    { val: 34 },
    { val: 33 },
    { val: 32 },
  ],
};

const HRDashboard = () => {
  const { data, isLoading, handleDrilldown, drilldown, closeDrilldown } =
    useRoleDashboard('hr');

  const [activeTab, setActiveTab] = useState('Overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  // Update last updated timer
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated('2m ago');
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <CenteredLoading />;

  // Destructure with default values
  const workforceHealth = data?.workforceHealth || {
    totalEmployees: 1248,
    totalEmployeesDiff: 3.2,
    newHires: 28,
    newHiresDiff: 12.0,
    attritionRate: 9.6,
    attritionDiff: -1.2,
    engagementScore: 78,
    engagementDiff: 4,
    avgTimeToFill: 32,
    timeToFillDiff: -6,
    avgUtilization: 82,
    overloadedTeams: 0,
  };

  const sparklineData = data?.sparklines || defaultSparklines;

  const departmentDistribution = Array.isArray(data?.departmentDistribution)
    ? data.departmentDistribution
    : [
        { name: 'Engineering', value: 512, percentage: 41.0 },
        { name: 'Product', value: 198, percentage: 15.9 },
        { name: 'QA & Testing', value: 156, percentage: 12.5 },
        { name: 'Design', value: 96, percentage: 7.7 },
        { name: 'Sales', value: 128, percentage: 10.3 },
        { name: 'Marketing', value: 84, percentage: 6.7 },
        { name: 'HR', value: 40, percentage: 3.2 },
        { name: 'Finance', value: 34, percentage: 2.7 },
      ];

  const headcountTrend = Array.isArray(data?.headcountTrend)
    ? data.headcountTrend
    : [
        { month: "Dec '24", headcount: 950 },
        { month: "Jan '25", headcount: 1010 },
        { month: "Feb '25", headcount: 1080 },
        { month: "Mar '25", headcount: 1140 },
        { month: "Apr '25", headcount: 1200 },
        { month: "May '25", headcount: 1248 },
      ];

  const upcomingBirthdays = Array.isArray(data?.upcomingBirthdays)
    ? data.upcomingBirthdays
    : [
        {
          name: 'Arjun Rao',
          date: 'May 20',
          role: 'Senior Engineer',
          daysLeft: 2,
        },
        { name: 'Priya Iyer', date: 'May 23', role: 'QA Lead', daysLeft: 5 },
        {
          name: 'Rohan Mehta',
          date: 'May 25',
          role: 'Product Manager',
          daysLeft: 7,
        },
        {
          name: 'Sneha Kapoor',
          date: 'May 27',
          role: 'UI/UX Designer',
          daysLeft: 9,
        },
      ];

  const leaveOverview = data?.leaveOverview || {
    total: 184,
    approved: 142,
    pending: 26,
    rejected: 16,
    approvedPercent: 77.2,
    pendingPercent: 14.1,
    rejectedPercent: 8.7,
    types: [
      { name: 'Annual Leave', count: 96, percent: 52.2 },
      { name: 'Sick Leave', count: 48, percent: 26.1 },
      { name: 'Personal Leave', count: 24, percent: 13.0 },
      { name: 'Other Leave', count: 16, percent: 8.7 },
    ],
  };

  const engagementMetrics = data?.engagementMetrics || {
    overallScore: 78,
    categories: [
      { name: 'Culture & Values', score: 82 },
      { name: 'Work Environment', score: 76 },
      { name: 'Manager Support', score: 79 },
      { name: 'Growth & Learning', score: 75 },
      { name: 'Recognition', score: 78 },
    ],
  };

  const openPositions = Array.isArray(data?.openPositions)
    ? data.openPositions
    : [
        {
          role: 'Senior Software Engineer',
          department: 'Engineering',
          count: 8,
        },
        { role: 'QA Engineer', department: 'QA & Testing', count: 5 },
        { role: 'Product Manager', department: 'Product', count: 3 },
        { role: 'UX Designer', department: 'Design', count: 2 },
        { role: 'HR Generalist', department: 'Human Resources', count: 1 },
      ];

  const announcements = Array.isArray(data?.announcements)
    ? data.announcements
    : [
        {
          title: 'Annual Wellness Program',
          desc: 'Join our wellness sessions starting May 26, 2025.',
          date: 'May 26, 2025',
          type: 'wellness',
        },
        {
          title: 'Policy Update',
          desc: 'Leave policy updated. Please review the latest changes.',
          date: 'May 20, 2025',
          type: 'policy',
        },
        {
          title: 'Townhall Meeting',
          desc: 'All-hands townhall on May 30, 2025 at 4:00 PM IST.',
          date: 'May 30, 2025',
          type: 'meeting',
        },
      ];

  const recentJoiners = Array.isArray(data?.recentJoiners)
    ? data.recentJoiners
    : [
        {
          name: 'Karan Singh',
          role: 'Software Engineer',
          department: 'Engineering',
          location: 'Bangalore',
          joiningDate: 'May 19, 2025',
        },
        {
          name: 'Ananya Verma',
          role: 'QA Engineer',
          department: 'QA & Testing',
          location: 'Pune',
          joiningDate: 'May 16, 2025',
        },
        {
          name: 'Vikram Patel',
          role: 'Product Analyst',
          department: 'Product',
          location: 'Hyderabad',
          joiningDate: 'May 12, 2025',
        },
        {
          name: 'Meera Iyer',
          role: 'UX Designer',
          department: 'Design',
          location: 'Bangalore',
          joiningDate: 'May 12, 2025',
        },
      ];

  const workAnniversaries = Array.isArray(data?.workAnniversaries)
    ? data.workAnniversaries
    : [
        {
          name: 'Neha Sharma',
          department: 'Human Resources',
          years: 5,
          date: 'May 15',
        },
        {
          name: 'Arjun Rao',
          department: 'Engineering',
          years: 4,
          date: 'May 18',
        },
        {
          name: 'Priya Iyer',
          department: 'QA & Testing',
          years: 3,
          date: 'May 20',
        },
        {
          name: 'Rohan Mehta',
          department: 'Product',
          years: 2,
          date: 'May 21',
        },
      ];

  // Helper to map Recharts sparkline compatible values
  const mapSparklineValues = (arr) => {
    if (!arr) return [];
    return arr.map((item) => {
      const val =
        typeof item === 'object' && item !== null && 'val' in item
          ? item.val
          : item;
      return { val };
    });
  };

  // Sparkline data mappings
  const employeesSparkline = mapSparklineValues(sparklineData.totalEmployees);
  const newHiresSparkline = mapSparklineValues(sparklineData.newHires);
  const attritionSparkline = mapSparklineValues(sparklineData.attrition);
  const engagementSparkline = mapSparklineValues(sparklineData.engagement);
  const timeToFillSparkline = mapSparklineValues(sparklineData.timeToFill);

  // Helper to resolve Announcement styles
  const getAnnouncementStyles = (ann) => {
    const title = (ann.title || '').toLowerCase();
    if (title.includes('wellness') || title.includes('program')) {
      return {
        icon: <Sparkles size={14} className="text-[#8B5CF6]" />,
        iconBg: 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/20',
      };
    }
    if (title.includes('policy') || title.includes('update')) {
      return {
        icon: <FileText size={14} className="text-[#10B981]" />,
        iconBg: 'bg-[#10B981]/10 border border-[#10B981]/20',
      };
    }
    return {
      icon: <Bell size={14} className="text-[#3B82F6]" />,
      iconBg: 'bg-[#3B82F6]/10 border border-[#3B82F6]/20',
    };
  };

  return (
    <div className="min-h-screen bg-background text-text p-3 lg:p-4 font-sans select-none max-w-screen-2xl mx-auto flex flex-col gap-4 animate-fade-in">
      {/* 2. Tabs (Obsidian Theme style) */}
      <div className="flex border-b border-white/5 overflow-x-auto scrollbar-none gap-1.5">
        {[
          {
            id: 'Overview',
            label: 'System Overview',
            icon: <Layout size={12} />,
          },
          {
            id: 'People',
            label: 'People Directory',
            icon: <Users size={12} />,
          },
          {
            id: 'Talent',
            label: 'Talent Acquisition',
            icon: <UserPlus size={12} />,
          },
          {
            id: 'Performance',
            label: 'Performance Control',
            icon: <Activity size={12} />,
          },
          {
            id: 'Culture',
            label: 'Culture & Values',
            icon: <Heart size={12} />,
          },
          {
            id: 'Compensation',
            label: 'Compensation Grid',
            icon: <FileText size={12} />,
          },
          {
            id: 'Recruitment',
            label: 'Open Requisitions',
            icon: <UserPlus size={12} />,
          },
          {
            id: 'Reports',
            label: 'Strategic Reports',
            icon: <FileText size={12} />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* 3. Metrics Strip (Row 1) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Employees */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              Total Headcount
            </span>
            <span className="text-secondary">
              <Users size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-1.5">
            <div>
              <span className="text-2xl font-black tracking-tighter">
                {workforceHealth.totalEmployees.toLocaleString()}
              </span>
              <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                <span>↑ {workforceHealth.totalEmployeesDiff}%</span>
                <span className="text-white/20 font-bold uppercase">
                  vs last mo
                </span>
              </div>
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={employeesSparkline}>
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

        {/* New Hires */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              New Hires
            </span>
            <span className="text-primary">
              <UserPlus size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-1.5">
            <div>
              <span className="text-2xl font-black tracking-tighter">
                {workforceHealth.newHires}
              </span>
              <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                <span>↑ {workforceHealth.newHiresDiff}%</span>
                <span className="text-white/20 font-bold uppercase">
                  onboarded
                </span>
              </div>
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={newHiresSparkline}>
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

        {/* Attrition Rate */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              Attrition Rate
            </span>
            <span className="text-status-warning">
              <UserMinus size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-1.5">
            <div>
              <span className="text-2xl font-black tracking-tighter">
                {workforceHealth.attritionRate}%
              </span>
              <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                <span>↓ {Math.abs(workforceHealth.attritionDiff)}%</span>
                <span className="text-white/20 font-bold uppercase">
                  stable
                </span>
              </div>
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={attritionSparkline}>
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

        {/* Employee Engagement */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              Engagement
            </span>
            <span className="text-status-success">
              <Heart size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-1.5">
            <div>
              <span className="text-2xl font-black tracking-tighter">
                {workforceHealth.engagementScore}%
              </span>
              <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                <span>↑ {workforceHealth.engagementDiff}%</span>
                <span className="text-white/20 font-bold uppercase">
                  survey
                </span>
              </div>
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={engagementSparkline}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#10B981"
                  fill="rgba(16, 185, 129, 0.1)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </div>
          </div>
        </div>

        {/* Avg. Time to Fill */}
        <div className="bg-white/[0.02] border border-white/5 p-3 flex flex-col justify-between relative group hover:border-white/10 transition-all rounded-none h-24">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
              Time To Fill
            </span>
            <span className="text-secondary">
              <Clock size={12} />
            </span>
          </div>
          <div className="flex items-end justify-between mt-1.5">
            <div>
              <span className="text-2xl font-black tracking-tighter">
                {workforceHealth.avgTimeToFill}d
              </span>
              <div className="text-[8px] text-status-success font-black mt-0.5 flex items-center gap-0.5">
                <span>↓ {Math.abs(workforceHealth.timeToFillDiff)}d</span>
                <span className="text-white/20 font-bold uppercase">
                  cycle var
                </span>
              </div>
            </div>
            <div className="w-14 h-7 opacity-60">
              <AreaChart width={56} height={28} data={timeToFillSparkline}>
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
      </div>

      {/* 4. Charts (Row 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Headcount by Department */}
        <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[360px]">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Headcount by Department
            </span>
            <button
              onClick={() => handleDrilldown('Engineering', 'role')}
              className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer"
            >
              View Full Report
            </button>
          </div>

          <div className="flex-1 flex flex-row items-center justify-between gap-4 mt-3">
            {/* Doughnut Chart container */}
            <div className="relative w-1/2 h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={58}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DEPT_COLORS[entry.name] || DEPT_COLORS.Default}
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
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black tracking-tighter leading-none">
                  {workforceHealth.totalEmployees.toLocaleString()}
                </span>
                <span className="text-[7.5px] text-white/30 uppercase tracking-widest font-black mt-1">
                  Total
                </span>
              </div>
            </div>

            {/* Department List Legend */}
            <div className="w-1/2 flex flex-col gap-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {departmentDistribution.map((dept) => {
                const color = DEPT_COLORS[dept.name] || DEPT_COLORS.Default;
                return (
                  <div
                    key={dept.name}
                    onClick={() => handleDrilldown(dept.name, 'individual')}
                    className="flex items-center justify-between text-[9px] font-black uppercase hover:bg-white/5 p-1 rounded-none cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <div
                        className="w-1.5 h-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-white/60 group-hover:text-white truncate">
                        {dept.name}
                      </span>
                    </div>
                    <span className="text-white/80 shrink-0 font-bold ml-1">
                      {dept.value}{' '}
                      <span className="text-[7.5px] text-white/30 font-medium">
                        ({dept.percentage}%)
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Headcount Trend */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[360px]">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Headcount Trend
            </span>
            <button
              onClick={() => handleDrilldown('Engineering', 'role')}
              className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer"
            >
              View Full Report
            </button>
          </div>

          <div className="flex-1 w-full h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart
                data={headcountTrend}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorHeadcount"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
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
                  dataKey="month"
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
                  domain={['dataMin - 150', 'dataMax + 100']}
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
                  dataKey="headcount"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHeadcount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] text-center border-t border-white/5 pt-4 flex items-center justify-center gap-1.5">
            <TrendingUp size={10} className="text-secondary" />
            <span>Steady growth in workforce footprint</span>
          </div>
        </div>

        {/* Upcoming Birthdays */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[360px]">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Upcoming Birthdays
            </span>
            <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-start mt-3 gap-3 overflow-y-auto max-h-[260px] pr-1 custom-scrollbar">
            {upcomingBirthdays.map((bday, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] px-1 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-white/40 uppercase shrink-0">
                    {bday.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider truncate">
                      {bday.name}
                    </span>
                    <span className="text-[8px] text-white/30 uppercase font-semibold truncate">
                      {bday.role}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right shrink-0">
                  <span className="text-[9px] font-black text-secondary uppercase bg-secondary/10 px-2 py-0.5">
                    {bday.date}
                  </span>
                  <span className="text-[8px] text-white/20 mt-1 font-semibold">
                    in {bday.daysLeft} days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Row 3: Leave, Engagement, Open Positions, Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Leave Overview */}
        <div className="bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Leave Overview
            </span>
            <button className="text-[8px] font-black uppercase text-secondary hover:underline cursor-pointer">
              View Report
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center mt-3">
            <div className="bg-white/[0.01] border border-white/5 p-2 flex flex-col justify-center rounded-none">
              <span className="text-[8px] text-white/40 uppercase font-black">
                Total
              </span>
              <span className="text-sm font-black text-white mt-1">
                {leaveOverview.total}
              </span>
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-2 flex flex-col justify-center rounded-none">
              <span className="text-[8px] text-status-success/40 uppercase font-black">
                Appr.
              </span>
              <span className="text-sm font-black text-status-success mt-1">
                {leaveOverview.approved}
              </span>
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-2 flex flex-col justify-center rounded-none">
              <span className="text-[8px] text-status-warning/40 uppercase font-black">
                Pend.
              </span>
              <span className="text-sm font-black text-status-warning mt-1">
                {leaveOverview.pending}
              </span>
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-2 flex flex-col justify-center rounded-none">
              <span className="text-[8px] text-status-error/40 uppercase font-black">
                Rej.
              </span>
              <span className="text-sm font-black text-status-error mt-1">
                {leaveOverview.rejected}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {leaveOverview.types.map((type, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-[9px] font-bold text-white/70 uppercase">
                  <span className="tracking-wider">{type.name}</span>
                  <span>
                    {type.count}{' '}
                    <span className="text-white/30 text-[7.5px] font-medium">
                      ({type.percent}%)
                    </span>
                  </span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-none overflow-hidden">
                  <div
                    className="h-full bg-secondary"
                    style={{ width: `${type.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Engagement Score */}
        <div className="bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Engagement Score
            </span>
            <button className="text-[8px] font-black uppercase text-secondary hover:underline cursor-pointer">
              View Report
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 mt-3">
            {/* Circle Radial Progress */}
            <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="4.5"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#10b981"
                  strokeWidth="4.5"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={
                    2 * Math.PI * 30 -
                    (workforceHealth.engagementScore / 100) * (2 * Math.PI * 30)
                  }
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-base font-black text-white leading-none">
                  {workforceHealth.engagementScore}%
                </span>
                <span className="text-[6px] text-white/40 uppercase tracking-widest font-black mt-1">
                  Score
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-[9px] uppercase font-bold text-white/50">
              <span className="text-status-success flex items-center gap-0.5">
                <TrendingUp size={9} /> ↑ {workforceHealth.engagementDiff}%
              </span>
              <span className="text-[7.5px] font-semibold text-white/30 tracking-widest">
                vs last survey
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 max-h-[110px] overflow-y-auto custom-scrollbar">
            {engagementMetrics.categories.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[9px] font-bold p-1 bg-white/[0.01] border border-white/5 rounded-none hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Target size={10} className="text-primary shrink-0" />
                  <span className="truncate text-white/70 uppercase tracking-wider">
                    {cat.name}
                  </span>
                </div>
                <span className="text-white shrink-0">{cat.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Open Positions
            </span>
            <button className="text-[8px] font-black uppercase text-secondary hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div className="flex-1 mt-3 overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-[9px] font-black uppercase">
              <thead>
                <tr className="text-white/20 border-b border-white/5">
                  <th className="pb-2">Role</th>
                  <th className="pb-2 text-center">Department</th>
                  <th className="pb-2 text-right">Openings</th>
                </tr>
              </thead>
              <tbody>
                {openPositions.map((pos, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0"
                  >
                    <td className="py-2.5 text-white truncate max-w-[120px]">
                      {pos.role}
                    </td>
                    <td className="py-2.5 text-center text-white/60">
                      {pos.department}
                    </td>
                    <td className="py-2.5 text-right text-secondary font-black">
                      {pos.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none min-h-[320px]">
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Announcements
            </span>
            <button className="text-[8px] font-black uppercase text-secondary hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-start mt-3 gap-3 overflow-y-auto max-h-[195px] pr-1 custom-scrollbar">
            {announcements.map((ann, idx) => {
              const styles = getAnnouncementStyles(ann);
              return (
                <div
                  key={idx}
                  className="flex gap-2.5 p-2 rounded-none bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-all duration-200"
                >
                  <div
                    className={`p-1.5 rounded-none shrink-0 flex items-center justify-center self-start ${styles.iconBg}`}
                  >
                    {styles.icon}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[9.5px] font-black text-white uppercase tracking-wider truncate leading-tight">
                      {ann.title}
                    </span>
                    <span className="text-[8px] text-white/40 mt-1 uppercase tracking-wide leading-relaxed font-bold">
                      {ann.desc}
                    </span>
                    <span className="text-[7px] text-white/20 uppercase tracking-widest mt-1.5 font-semibold">
                      {ann.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Row 4: Recent Joiners, Work Anniversaries, Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Joiners */}
        <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none">
          <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Recent Joiners
            </span>
            <button className="text-[8px] font-black uppercase text-secondary hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-[9px] font-black uppercase">
              <thead>
                <tr className="text-white/20 border-b border-white/5">
                  <th className="pb-2 px-1">Name</th>
                  <th className="pb-2 px-1">Role</th>
                  <th className="pb-2 px-1">Department</th>
                  <th className="pb-2 px-1">Location</th>
                  <th className="pb-2 px-1 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentJoiners.map((joiner, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0"
                  >
                    <td className="py-2.5 px-1 flex items-center gap-2 overflow-hidden max-w-[120px]">
                      <div className="w-6 h-6 shrink-0 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black text-white/40 uppercase">
                        {joiner.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="truncate text-white font-black">
                        {joiner.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-1 text-white/60 max-w-[100px] truncate">
                      {joiner.role}
                    </td>
                    <td className="py-2.5 px-1 text-white/60 max-w-[100px] truncate">
                      {joiner.department}
                    </td>
                    <td className="py-2.5 px-1 text-white/40">
                      {joiner.location}
                    </td>
                    <td className="py-2.5 px-1 text-right text-white/30 text-[8px] font-semibold">
                      {joiner.joiningDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Work Anniversaries */}
        <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none">
          <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Work Anniversaries
            </span>
            <button className="text-[8px] font-black uppercase text-secondary hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-[9px] font-black uppercase">
              <thead>
                <tr className="text-white/20 border-b border-white/5">
                  <th className="pb-2 px-1">Name</th>
                  <th className="pb-2 px-1">Department</th>
                  <th className="pb-2 px-1 text-center">Years</th>
                  <th className="pb-2 px-1 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {workAnniversaries.map((anniv, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0"
                  >
                    <td className="py-2.5 px-1 flex items-center gap-2 overflow-hidden max-w-[120px]">
                      <div className="w-6 h-6 shrink-0 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black text-white/40 uppercase">
                        {anniv.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="truncate text-white font-black">
                        {anniv.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-1 text-white/60 max-w-[100px] truncate">
                      {anniv.department}
                    </td>
                    <td className="py-2.5 px-1 text-center text-status-success font-black">
                      {anniv.years}
                    </td>
                    <td className="py-2.5 px-1 text-right text-white/30 text-[8px] font-semibold">
                      {anniv.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 p-5 flex flex-col justify-between rounded-none">
          <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Quick Links
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              {
                title: 'Employee Directory',
                desc: 'Search and view details',
                icon: <Users size={12} />,
              },
              {
                title: 'Apply for Leave',
                desc: 'Submit and track requests',
                icon: <Calendar size={12} />,
              },
              {
                title: 'Performance',
                desc: 'View metrics and goals',
                icon: <Activity size={12} />,
              },
              {
                title: 'HR Policies',
                desc: 'Company guidelines',
                icon: <FileText size={12} />,
              },
              {
                title: 'Help & Support',
                desc: 'Get HR assistance',
                icon: <HelpCircle size={12} />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-none bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-1.5 bg-white/5 border border-white/10 rounded-none text-white/40 group-hover:text-primary transition-colors shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[9.5px] font-black text-white uppercase tracking-wider leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[7.5px] text-white/30 uppercase tracking-widest mt-0.5 truncate">
                      {item.desc}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={12}
                  className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Footer (Obsidian Theme style) */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-4 text-[9px] uppercase font-black tracking-wider text-white/30 gap-3">
        <div className="flex items-center gap-3">
          <span>Last updated: {lastUpdated}</span>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-1.5">
            <span>Auto-refresh:</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-1.5 py-0.5 rounded-none text-[8px] font-black transition-colors cursor-pointer ${
                autoRefresh
                  ? 'bg-status-success/10 text-status-success border border-status-success/20'
                  : 'bg-white/5 text-white/40 border border-white/10'
              }`}
            >
              {autoRefresh ? 'On' : 'Off'}
            </button>
            <RefreshCw
              size={8}
              className={`text-white/40 ${autoRefresh ? 'animate-spin' : ''}`}
              style={{ animationDuration: '6s' }}
            />
          </div>
        </div>
        <div>
          <span>Data as of: May 18, 2025 10:24 AM IST</span>
        </div>
      </div>

      {/* Drilldown Modal (retains full project functionality) */}
      <DrilldownModal
        isOpen={drilldown.isOpen}
        onClose={closeDrilldown}
        title={`Detailed Capacity: ${drilldown.category}`}
        data={drilldown.data}
      />
    </div>
  );
};

export default HRDashboard;

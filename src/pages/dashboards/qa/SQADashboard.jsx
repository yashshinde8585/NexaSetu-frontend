import React, { useState, useEffect } from 'react';
import {
  Search,
  BarChart3,
  ShieldAlert,
  Bug,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Users,
  Zap,
  Microscope,
  Info,
  ChevronRight,
  Fingerprint,
  PieChart as PieIcon,
  Network,
  AlertCircle,
  ShieldCheck,
  Check,
  Play,
  RefreshCw,
  Calendar,
  Clock,
  FileText,
  Settings,
  MessageSquare,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Layout,
  UserCheck,
  Key,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import DashboardSkeleton from '../../../components/atoms/DashboardSkeleton';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const SQADashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useRoleDashboard('sqa');
  const [activeTab, setActiveTab] = useState('Overview');
  const [lastUpdated, setLastUpdated] = useState('2 minutes ago');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refetch();
      setLastUpdated('Just now');
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    console.error('[SQA-DASHBOARD] API connection failed:', error);
    return (
      <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-8 text-center font-mono border border-status-error/20 max-w-screen-2xl mx-auto">
        <AlertCircle size={48} className="text-status-error mb-6" />
        <h2 className="text-2xl font-black text-text mb-4 uppercase tracking-tighter">
          API Connection Failure
        </h2>
        <p className="text-text-subtle max-w-md text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-8">
          We encountered an issue connecting to the backend services. Details:{' '}
          {error.message || 'Unknown network error'}.
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-3 px-8 py-3 bg-card border border-border text-text text-[10px] uppercase font-bold tracking-[0.2em] rounded-none hover:bg-background-elevated transition-all active:scale-95 cursor-pointer"
        >
          <RefreshCw size={14} className="animate-spin" /> Retry API Connection
        </button>
      </div>
    );
  }

  // Extract variables directly from the database response payload
  const testExecutionProgress = data?.qualitySignals || {
    completed: 0,
    totalTests: 0,
    executed: 0,
    change: 0,
  };
  const testPassRate = data?.testPassRate || {
    rate: 0,
    passed: 0,
    total: 0,
    change: 0,
    sparkline: [],
  };
  const defectDensity = data?.defectDensity || {
    density: 0,
    change: 0,
    sparkline: [],
  };
  const openDefects = data?.openDefects || {
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  const automationCoverage = data?.automationCoverage || { rate: 0, change: 0 };
  const requirementsCoverage = data?.requirementsCoverage || {
    rate: 0,
    change: 0,
  };

  const testExecutionSummary = data?.testExecutionSummary || [];
  const testExecutionTrend = data?.testExecutionTrend || [];
  const defectsTrend = data?.defectsTrend || [];
  const defectsByStatus = data?.defectsByStatus || [];
  const topDefects = data?.topDefects || [];
  const flakyTestSummary = data?.flakyTestSummary || {
    total: 0,
    rate: 0,
    change: 0,
    tests: [],
  };
  const testCoverage = data?.testCoverage || [];
  const myWork = data?.myWork || [];
  const automationDashboard = data?.automationDashboard || [];
  const recentActivity = data?.recentActivity || [];
  const upcomingDeadlines = data?.upcomingDeadlines || [];

  const tabs = [
    { id: 'Overview', label: 'Overview', icon: <Layout size={12} /> },
    { id: 'Test Execution', label: 'Test Execution', icon: <Play size={12} /> },
    { id: 'Defects', label: 'Defects', icon: <Bug size={12} /> },
    { id: 'Requirements', label: 'Requirements', icon: <Target size={12} /> },
    { id: 'Automation', label: 'Automation', icon: <Settings size={12} /> },
    { id: 'Reports', label: 'Reports', icon: <FileText size={12} /> },
    { id: 'Insights', label: 'Insights', icon: <Activity size={12} /> },
  ];

  return (
    <div className="min-h-screen bg-background text-text p-3 lg:p-3.5 font-sans max-w-screen-2xl mx-auto flex flex-col gap-3.5 select-none">
      {/* Top Navigation Tab Bar aligned with Workspace Administration */}
      <div className="flex border-b border-border-subtle/80 overflow-x-auto scrollbar-none gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-text bg-background-elevated'
                : 'border-transparent text-text-subtle hover:text-text hover:bg-card/40'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'Overview' ? (
        <>
          {/* Row 1: Metrics Strip aligned with admin overview grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Card 1: Test Execution Progress */}
            <div className="bg-card border border-border/40 p-2.5 flex flex-col justify-between relative group hover:border-border transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-subtle">
                  Test Execution Progress
                </span>
                <span className="text-status-success flex items-center gap-0.5 text-[8px] font-black uppercase">
                  <TrendingUp size={10} />+{testExecutionProgress.change}%
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-black tracking-tighter">
                    {testExecutionProgress.completed}%
                  </span>
                  <div className="text-[8px] text-text-subtler font-black mt-0.5">
                    {(testExecutionProgress.executed ?? 0).toLocaleString()} /{' '}
                    {(testExecutionProgress.totalTests ?? 0).toLocaleString()}
                  </div>
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center mb-0.5 shrink-0 opacity-80">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="13"
                      className="stroke-border-subtler"
                      strokeWidth="3"
                      fill="transparent"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="13"
                      className="stroke-status-success"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 13}
                      strokeDashoffset={
                        2 *
                        Math.PI *
                        13 *
                        (1 - (testExecutionProgress.completed ?? 0) / 100)
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[7.5px] font-black text-text-subtle">
                    {testExecutionProgress.completed}%
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Test Pass Rate */}
            <div className="bg-card border border-border/40 p-2.5 flex flex-col justify-between relative group hover:border-border transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-subtle">
                  Test Pass Rate
                </span>
                <span className="text-status-success flex items-center gap-0.5 text-[8px] font-black uppercase">
                  <TrendingUp size={10} />+{testPassRate.change}%
                </span>
              </div>
              <div className="flex items-end justify-between mt-1">
                <div>
                  <span className="text-2xl font-black tracking-tighter">
                    {testPassRate.rate}%
                  </span>
                  <div className="text-[8px] text-status-success font-black mt-0.5">
                    {(testPassRate.passed ?? 0).toLocaleString()} /{' '}
                    {(testPassRate.total ?? 0).toLocaleString()}
                  </div>
                </div>
                <div className="w-14 h-7 opacity-60">
                  {testPassRate.sparkline?.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={testPassRate.sparkline}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="var(--color-primary)"
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Card 3: Defect Density */}
            <div className="bg-card border border-border/40 p-2.5 flex flex-col justify-between relative group hover:border-border transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-subtle">
                  Defect Density
                </span>
                <span className="text-status-success flex items-center gap-0.5 text-[8px] font-black uppercase">
                  <TrendingDown size={10} />
                  {defectDensity.change}
                </span>
              </div>
              <div className="flex items-end justify-between mt-1">
                <div>
                  <span className="text-2xl font-black tracking-tighter">
                    {defectDensity.density}
                  </span>
                  <div className="text-[8px] text-text-subtler font-black mt-0.5">
                    defects / KLOC
                  </div>
                </div>
                <div className="w-14 h-7 opacity-60">
                  {defectDensity.sparkline?.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={defectDensity.sparkline}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="var(--color-secondary)"
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Card 4: Open Defects */}
            <div className="bg-card border border-border/40 p-2.5 flex flex-col justify-between relative group hover:border-border transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-subtle">
                  Open Defects
                </span>
                <span className="text-status-error">
                  <Bug size={12} />
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-black tracking-tighter text-status-error">
                    {openDefects.total}
                  </span>
                  <div className="text-[8px] text-text-subtler font-black mt-0.5">
                    Active Defect Log
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8px] font-black text-right shrink-0">
                  <div>
                    <span className="text-status-error">
                      {openDefects.critical}
                    </span>{' '}
                    <span className="text-text-subtler">CRIT</span>
                  </div>
                  <div>
                    <span className="text-status-warning">
                      {openDefects.high}
                    </span>{' '}
                    <span className="text-text-subtler">HIGH</span>
                  </div>
                  <div>
                    <span className="text-text">{openDefects.medium}</span>{' '}
                    <span className="text-text-subtler">MED</span>
                  </div>
                  <div>
                    <span className="text-status-success">
                      {openDefects.low}
                    </span>{' '}
                    <span className="text-text-subtler">LOW</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Automation Coverage */}
            <div className="bg-card border border-border/40 p-2.5 flex flex-col justify-between relative group hover:border-border transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-subtle">
                  Automation Coverage
                </span>
                <span className="text-status-success flex items-center gap-0.5 text-[8px] font-black uppercase">
                  <TrendingUp size={10} />+{automationCoverage.change}%
                </span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-black tracking-tighter">
                  {automationCoverage.rate}%
                </span>
                <div className="text-[7.5px] text-text-subtler font-black uppercase mt-0.5">
                  Coverage of Test Suite
                </div>
                <div className="w-full bg-border-subtler h-1 mt-1 rounded-none overflow-hidden">
                  <div
                    className="bg-secondary h-full"
                    style={{ width: `${automationCoverage.rate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card 6: Requirements Coverage */}
            <div className="bg-card border border-border/40 p-2.5 flex flex-col justify-between relative group hover:border-border transition-all rounded-none h-24">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-subtle">
                  Requirements Coverage
                </span>
                <span className="text-status-success flex items-center gap-0.5 text-[8px] font-black uppercase">
                  <TrendingUp size={10} />+{requirementsCoverage.change}%
                </span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-black tracking-tighter">
                  {requirementsCoverage.rate}%
                </span>
                <div className="text-[7.5px] text-text-subtler font-black uppercase mt-0.5">
                  Traceability matrix
                </div>
                <div className="w-full bg-border-subtler h-1 mt-1 rounded-none overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${requirementsCoverage.rate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Main Graphs (Height Optimized) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart 1: Test Execution Summary (Doughnut) */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[250px] lg:h-[260px]">
              <div className="flex justify-between items-center pb-2.5 border-b border-border-subtle/40 mb-2 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                  <PieIcon size={12} className="text-secondary" />
                  Test Execution Summary
                </span>
                <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
                  View Details
                </button>
              </div>
              <div className="flex items-center justify-between h-full min-h-0">
                <div className="relative w-[110px] h-[110px] lg:w-[120px] lg:h-[120px] flex items-center justify-center shrink-0">
                  {testExecutionSummary?.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={testExecutionSummary}
                          innerRadius={36}
                          outerRadius={48}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {testExecutionSummary.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-black tracking-tight leading-none text-text">
                      {(testExecutionProgress.totalTests ?? 0).toLocaleString()}
                    </span>
                    <span className="text-[7px] text-text-subtler font-bold uppercase tracking-wider mt-0.5">
                      Total Tests
                    </span>
                  </div>
                </div>
                {/* Legend list */}
                <div className="flex flex-col gap-1.5 flex-1 pl-4">
                  {testExecutionSummary.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-[10.5px]"
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-none"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-text-subtle font-semibold">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-text">
                        {item.value.toLocaleString()}{' '}
                        <span className="text-text-subtler text-[9px] font-normal">
                          ({item.percentage}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: Test Execution Trend (Line Chart) */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[250px] lg:h-[260px]">
              <div className="flex justify-between items-center pb-2.5 border-b border-border-subtle/40 mb-2 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-secondary" />
                  Test Execution Trend
                </span>
                <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
                  View Trend
                </button>
              </div>
              {/* Legend at Top */}
              <div className="flex justify-start gap-3 text-[8px] font-black uppercase tracking-wider text-text-subtle -mt-1.5 mb-1.5 shrink-0">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-[#10b981]" />
                  <span>Passed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-[#ef4444]" />
                  <span>Failed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-[#f59e0b]" />
                  <span>Blocked</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-[#3b82f6]" />
                  <span>Pass Rate %</span>
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full">
                {testExecutionTrend?.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={testExecutionTrend}
                      margin={{ top: 5, right: 5, left: -32, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border-subtler)"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: 'var(--color-text-subtle)', fontSize: 8 }}
                        axisLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{ fill: 'var(--color-text-subtle)', fontSize: 8 }}
                        axisLine={false}
                        domain={[0, 1500]}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: 'var(--color-text-subtle)', fontSize: 8 }}
                        axisLine={false}
                        domain={[80, 100]}
                        tickFormatter={(val) => `${val}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-background-elevated)',
                          borderColor: 'var(--color-border-subtle)',
                          color: 'var(--color-text)',
                          fontSize: 10,
                        }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Passed"
                        stroke="#10b981"
                        strokeWidth={1.5}
                        dot={{ r: 2 }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Failed"
                        stroke="#ef4444"
                        strokeWidth={1.5}
                        dot={{ r: 2 }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Blocked"
                        stroke="#f59e0b"
                        strokeWidth={1.5}
                        dot={{ r: 2 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="Pass Rate %"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 3: Defects Trend (Line Chart) */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[250px] lg:h-[260px]">
              <div className="flex justify-between items-center pb-2.5 border-b border-border-subtle/40 mb-2 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                  <Bug size={12} className="text-secondary" />
                  Defects Trend
                </span>
                <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
                  View Trend
                </button>
              </div>
              {/* Legend */}
              <div className="flex justify-start gap-3 text-[8px] font-black uppercase tracking-wider text-text-subtle -mt-1.5 mb-1.5 shrink-0">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-[#ef4444]" />
                  <span>Critical</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-[#f59e0b]" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-[#fbbf24]" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-[#10b981]" />
                  <span>Low</span>
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full">
                {defectsTrend?.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={defectsTrend}
                      margin={{ top: 5, right: 5, left: -34, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border-subtler)"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: 'var(--color-text-subtle)', fontSize: 8 }}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fill: 'var(--color-text-subtle)', fontSize: 8 }}
                        axisLine={false}
                        domain={[0, 40]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-background-elevated)',
                          borderColor: 'var(--color-border-subtle)',
                          color: 'var(--color-text)',
                          fontSize: 10,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Critical"
                        stroke="#ef4444"
                        strokeWidth={1.5}
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="High"
                        stroke="#f59e0b"
                        strokeWidth={1.5}
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Medium"
                        stroke="#fbbf24"
                        strokeWidth={1.5}
                        dot={{ r: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Low"
                        stroke="#10b981"
                        strokeWidth={1.5}
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Analysis Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Panel 1: Defects by Status (Doughnut) */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[250px] lg:h-[260px]">
              <div className="flex justify-between items-center pb-2.5 border-b border-border-subtle/40 mb-2 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                  <ShieldAlert size={12} className="text-secondary" />
                  Defects by Status
                </span>
                <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
                  View All
                </button>
              </div>
              <div className="flex items-center justify-between h-full min-h-0">
                <div className="relative w-[95px] h-[95px] flex items-center justify-center shrink-0">
                  {defectsByStatus?.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={defectsByStatus}
                          innerRadius={30}
                          outerRadius={42}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {defectsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-black tracking-tight leading-none text-text">
                      {openDefects.total}
                    </span>
                    <span className="text-[6.5px] text-text-subtler font-bold uppercase tracking-wider mt-0.5">
                      Total Open
                    </span>
                  </div>
                </div>
                {/* Legend list */}
                <div className="flex flex-col gap-1 flex-1 pl-3">
                  {defectsByStatus.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-[10.5px]"
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-none"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-text-subtle font-semibold">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-text">
                        {item.value}{' '}
                        <span className="text-text-subtler text-[9px] font-normal">
                          ({item.percentage}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 2: Top Defects */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[250px] lg:h-[260px]">
              <div className="flex flex-col gap-2 min-h-0 overflow-hidden">
                <div className="flex justify-between items-center pb-2.5 border-b border-border-subtle/40 mb-1.5 shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                    <Bug size={12} className="text-secondary" />
                    Top Defects
                  </span>
                  <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto scrollbar-none min-h-0 flex-1">
                  <table className="w-full text-left text-[10.5px] border-collapse">
                    <thead>
                      <tr className="text-[8px] font-black text-text-subtler uppercase tracking-widest border-b border-border-subtle/40 pb-1">
                        <th className="pb-1">ID</th>
                        <th className="pb-1">Title</th>
                        <th className="pb-1">Module</th>
                        <th className="pb-1">Severity</th>
                        <th className="pb-1 text-right">Age</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtler">
                      {topDefects.map((defect, index) => (
                        <tr
                          key={defect.id || index}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-1.5 text-text font-bold">
                            {defect.id}
                          </td>
                          <td
                            className="py-1.5 text-text-subtle max-w-[85px] truncate pr-1"
                            title={defect.title}
                          >
                            {defect.title}
                          </td>
                          <td className="py-1.5 text-text-subtler">
                            {defect.module}
                          </td>
                          <td className="py-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded-none text-[7.5px] font-extrabold uppercase ${
                                defect.severity === 'Critical'
                                  ? 'bg-status-error/15 text-status-error border border-status-error/20'
                                  : defect.severity === 'High'
                                    ? 'bg-status-warning/15 text-status-warning border border-status-warning/20'
                                    : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                              }`}
                            >
                              {defect.severity}
                            </span>
                          </td>
                          <td className="py-1.5 text-right text-text-subtler font-semibold">
                            {defect.age}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {topDefects.length === 0 && (
                    <div className="py-8 text-center text-[9px] text-text-subtler uppercase font-black tracking-widest italic">
                      Zero Open Defects
                    </div>
                  )}
                </div>
              </div>
              <button className="text-[9px] font-black uppercase text-secondary hover:underline text-left mt-2.5 shrink-0 cursor-pointer">
                View All Defects
              </button>
            </div>

            {/* Panel 3: Flaky Test Summary */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[250px] lg:h-[260px]">
              <div className="flex flex-col gap-2.5 min-h-0 flex-1 justify-between">
                <div className="flex justify-between items-center pb-2.5 border-b border-border-subtle/40 mb-1 shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                    <Zap size={12} className="text-secondary" />
                    Flaky Test Summary
                  </span>
                </div>
                <div className="flex gap-3.5 items-center border-b border-border-subtle pb-2.5 shrink-0">
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight leading-none">
                      {flakyTestSummary.total}
                    </span>
                    <span className="text-[7px] text-text-subtler font-bold uppercase tracking-wider mt-0.5">
                      Flaky Tests
                    </span>
                  </div>
                  <div className="w-px h-6 bg-border-subtle" />
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight leading-none">
                      {flakyTestSummary.rate}%
                    </span>
                    <span className="text-[7px] text-text-subtler font-bold uppercase tracking-wider mt-0.5">
                      Flaky Rate
                    </span>
                  </div>
                  <div className="ml-auto text-status-success flex items-center gap-0.5 text-[8px] font-bold">
                    <TrendingDown size={10} />
                    {flakyTestSummary.change}%
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-h-0 justify-center">
                  {flakyTestSummary.tests?.map((test, index) => (
                    <div
                      key={test.id || index}
                      className="flex flex-col gap-0.5 text-[10.5px]"
                    >
                      <div className="flex justify-between items-center leading-none">
                        <span className="text-text-subtle font-semibold flex items-center gap-1 truncate max-w-[120px]">
                          <FileText size={10} className="text-text-subtler" />
                          {test.id}
                        </span>
                        <span className="font-bold text-text text-[10px]">
                          {test.rate}%
                        </span>
                      </div>
                      <div className="h-[3px] bg-border-subtler rounded-none overflow-hidden mt-0.5">
                        <div
                          className="h-full bg-status-warning/70"
                          style={{ width: `${(test.rate ?? 0) * 25}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {(!flakyTestSummary.tests ||
                    flakyTestSummary.tests.length === 0) && (
                    <div className="text-center py-4 text-[9px] text-text-subtler uppercase font-black tracking-widest italic">
                      Zero Flaky Tests
                    </div>
                  )}
                </div>
              </div>
              <button className="text-[9px] font-black uppercase text-secondary hover:underline text-left mt-2.5 shrink-0 cursor-pointer">
                View All Flaky Tests
              </button>
            </div>

            {/* Panel 4: Test Coverage */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[250px] lg:h-[260px]">
              <div className="flex flex-col gap-2 min-h-0 flex-1 justify-center">
                <div className="flex justify-between items-center pb-2.5 border-b border-border-subtle/40 mb-2 shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                    <Target size={12} className="text-secondary" />
                    Test Coverage
                  </span>
                  <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
                    View Details
                  </button>
                </div>
                <div className="flex flex-col gap-2.5 flex-1 justify-center">
                  {testCoverage.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-0.5 text-[10.5px]"
                    >
                      <div className="flex justify-between items-center leading-none">
                        <span className="text-text-subtle font-semibold">
                          {item.label}
                        </span>
                        <span className="font-bold text-text text-[10px]">
                          {item.rate}%
                        </span>
                      </div>
                      <div className="h-[3px] bg-border-subtler rounded-none overflow-hidden mt-0.5">
                        <div
                          className="h-full bg-status-success"
                          style={{ width: `${item.rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Operational Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Panel 1: My Work */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[210px] lg:h-[220px]">
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle/40 mb-1.5 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                  <Check size={12} className="text-secondary" />
                  My Work
                </span>
                <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
                  View All
                </button>
              </div>
              <div className="flex flex-col gap-1.5 justify-center flex-1 min-h-0">
                {myWork.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-1.5 bg-white/[0.02] border border-border-subtler hover:bg-white/[0.04] transition-colors rounded-none"
                  >
                    <div className="flex items-center gap-2 text-[11px] text-text-subtle leading-none">
                      <div
                        className={`p-1 rounded-none bg-white/5 ${
                          item.type === 'assigned'
                            ? 'text-blue-400'
                            : item.type === 'progress'
                              ? 'text-yellow-400'
                              : item.type === 'review'
                                ? 'text-green-400'
                                : 'text-red-400'
                        }`}
                      >
                        {item.type === 'assigned' && <FileText size={10} />}
                        {item.type === 'progress' && <Clock size={10} />}
                        {item.type === 'review' && <Check size={10} />}
                        {item.type === 'blocked' && <ShieldAlert size={10} />}
                      </div>
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    <span className="font-bold text-text text-[11px]">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: Automation Dashboard */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[210px] lg:h-[220px]">
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle/40 mb-1.5 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                  <Settings size={12} className="text-secondary" />
                  Automation Dashboard
                </span>
                <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
                  View Details
                </button>
              </div>
              <div className="flex flex-col justify-center flex-1 divide-y divide-border-subtler min-h-0">
                {automationDashboard.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 text-[11px]"
                  >
                    <span className="text-text-subtle font-semibold">
                      {item.label}
                    </span>
                    <span className="font-bold text-text">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 3: Recent Activity */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[210px] lg:h-[220px]">
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle/40 mb-1.5 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                  <Activity size={12} className="text-secondary" />
                  Recent Activity
                </span>
                <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
                  View All
                </button>
              </div>
              <div className="flex flex-col gap-2 justify-center flex-1 min-h-0">
                {recentActivity.map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="flex items-start gap-2 text-[10.5px]"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-none mt-1 shrink-0 ${
                        activity.status === 'success'
                          ? 'bg-status-success'
                          : activity.status === 'warning'
                            ? 'bg-status-warning'
                            : activity.status === 'error'
                              ? 'bg-status-error'
                              : 'bg-primary'
                      }`}
                    />
                    <div className="flex flex-col gap-0.5 leading-tight">
                      <span className="text-text font-medium">
                        {activity.text}
                      </span>
                      {activity.meta && (
                        <span className="text-[8.5px] text-text-subtler uppercase tracking-wider">
                          {activity.meta}
                        </span>
                      )}
                    </div>
                    <span className="text-[8.5px] text-text-subtler ml-auto font-black shrink-0 uppercase">
                      {activity.time}
                    </span>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-center py-4 text-[9px] text-text-subtler uppercase font-black tracking-widest italic">
                    Zero Recent Activity
                  </div>
                )}
              </div>
            </div>

            {/* Panel 4: Upcoming Deadlines */}
            <div className="bg-card border border-border p-3 flex flex-col justify-between rounded-none h-[210px] lg:h-[220px]">
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle/40 mb-1.5 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                  <Calendar size={12} className="text-secondary" />
                  Upcoming Deadlines
                </span>
                <button className="text-[9px] font-black uppercase text-secondary hover:underline cursor-pointer">
                  View Calendar
                </button>
              </div>
              <div className="flex flex-col gap-2.5 justify-center flex-1 min-h-0">
                {upcomingDeadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-0.5 leading-tight"
                  >
                    <div className="flex justify-between items-start text-[10.5px]">
                      <span className="text-text font-bold max-w-[150px]">
                        {deadline.title}
                      </span>
                      <span
                        className={`text-[8.5px] font-black uppercase shrink-0 ${
                          deadline.status === 'error'
                            ? 'text-status-error'
                            : deadline.status === 'warning'
                              ? 'text-status-warning'
                              : 'text-status-success'
                        }`}
                      >
                        {deadline.remaining}
                      </span>
                    </div>
                    <span className="text-[8.5px] text-text-subtler font-semibold">
                      {deadline.date}
                    </span>
                  </div>
                ))}
                {upcomingDeadlines.length === 0 && (
                  <div className="text-center py-4 text-[9px] text-text-subtler uppercase font-black tracking-widest italic">
                    Zero Upcoming Deadlines
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer telemetry metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-[9px] text-text-subtler font-black uppercase tracking-widest border-t border-border-subtle/80 pt-3 mt-1.5 shrink-0">
            <div className="flex items-center gap-4">
              <span>Last updated: {lastUpdated}</span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="flex items-center gap-1 hover:text-text cursor-pointer"
              >
                <span>Auto-refresh: {autoRefresh ? 'On' : 'Off'}</span>
                <RefreshCw
                  size={10}
                  className={`${autoRefresh ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
            <span>Data as of: May 18, 2025 10:24 AM IST</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 bg-card border border-border border-dashed text-center rounded-none">
          <Microscope
            className="text-text-subtler mb-4 animate-pulse"
            size={32}
          />
          <span className="text-xs font-black text-text uppercase tracking-widest mb-1">
            {activeTab} Workspace Details
          </span>
          <span className="text-[10px] text-text-subtle font-medium max-w-md uppercase tracking-wider leading-normal pr-1">
            Showing specific quality tracking logs and metrics associated with
            the current active validation cycle matching the {activeTab}{' '}
            parameters.
          </span>
        </div>
      )}
    </div>
  );
};

export default SQADashboard;

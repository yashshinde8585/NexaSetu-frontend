import React from 'react';
import CenteredLoading from '../../../components/atoms/CenteredLoading';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import {
  AlertTriangle,
  Clock,
  Shield,
  Target,
  Users,
  TrendingDown,
  TrendingUp,
  Minus,
  Activity,
  ChevronRight,
  Zap,
  Target as TargetIcon,
  ShieldAlert,
  BarChart3,
  Terminal,
} from 'lucide-react';
import DashboardSection from '../../../components/molecules/dashboard/DashboardSection';
import MetricStripItem from '../../../components/molecules/dashboard/MetricStripItem';
import StatusBadge from '../../../components/molecules/dashboard/StatusBadge';
import ActivityItem from '../../../components/molecules/dashboard/ActivityItem';
import DrilldownModal from '../../../components/molecules/dashboard/DrilldownModal';
import SystemIntegrityStatus from '../../../components/dashboard/SystemIntegrityStatus';

/**
 * VP Engineering (VPE) Dashboard
 * High-level engineering execution and performance visibility.
 */
const VPEDashboard = () => {
  const { data, isLoading, error, drilldown, handleDrilldown, closeDrilldown } =
    useRoleDashboard('vpe');

  if (isLoading || !data) return <CenteredLoading />;

  if (error)
    return (
      <div className="p-12 text-status-error bg-background text-text min-h-screen font-mono font-bold uppercase text-center flex items-center justify-center border border-status-error/20">
        {error?.message || 'Error: System data unavailable'}
      </div>
    );

  const executionStats = data?.executionStats || {
    projectsDelayed: 0,
    avgSprintDelay: '0d',
    activeBlockers: 0,
    teamsOverloaded: 0,
    velocityTrend: { direction: 'stable', value: '0%' },
  };
  const teamGrid = Array.isArray(data?.teamGrid) ? data.teamGrid : [];
  const sprintExecution = data?.sprintExecution || {
    progress: 0,
    risk: 'UNKNOWN',
    completed: 0,
    inProgress: 0,
    blocked: 0,
  };
  const blockers =
    data?.blockers && typeof data.blockers === 'object' ? data.blockers : {};
  const timeline = Array.isArray(data?.timeline) ? data.timeline : [];
  const activity = Array.isArray(data?.activity) ? data.activity : [];

  return (
    <div className="min-h-screen bg-background text-text p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      {/* 1. Global Performance metrics */}
      <div
        id="vpe-execution-strip"
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <MetricStripItem
          icon={<AlertTriangle size={14} />}
          label="Delayed Projects"
          value={executionStats.projectsDelayed}
          color="text-status-error"
          accent="bg-status-error"
        />
        <MetricStripItem
          icon={<Clock size={14} />}
          label="Average Delay"
          value={executionStats.avgSprintDelay}
          color="text-status-warning"
          accent="bg-status-warning"
        />
        <MetricStripItem
          icon={<Shield size={14} />}
          label="Active Blockers"
          value={executionStats.activeBlockers}
          color="text-primary"
          accent="bg-primary"
        />
        <MetricStripItem
          icon={<Users size={14} />}
          label="Teams Overloaded"
          value={executionStats.teamsOverloaded}
          color="text-status-warning"
          accent="bg-status-warning"
        />
        <MetricStripItem
          icon={
            executionStats.velocityTrend.direction === 'down' ? (
              <TrendingDown size={14} />
            ) : (
              <TrendingUp size={14} />
            )
          }
          label="Velocity Trend"
          value={executionStats.velocityTrend.value}
          color={
            executionStats.velocityTrend.direction === 'down'
              ? 'text-status-error'
              : 'text-status-success'
          }
          accent="bg-primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. Main Column: Execution Metrics */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <DashboardSection
            title="Team Performance Matrix"
            icon={<Terminal size={14} />}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[8px] text-white/40 uppercase font-black tracking-[0.2em] border-b border-white/5">
                    <th className="py-3 px-3">TEAM</th>
                    <th className="py-3 px-3 text-center">PROGRESS</th>
                    <th className="py-3 px-3 text-center">VELOCITY</th>
                    <th className="py-3 px-3 text-center">WORKLOAD</th>
                    <th className="py-3 px-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02] text-[10px] font-black uppercase tracking-widest">
                  {teamGrid.map((row, i) => (
                    <tr
                      key={i}
                      onClick={() => handleDrilldown(row.team)}
                      className="group hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <span className="text-white group-hover:text-primary transition-colors">
                            {row.team}
                          </span>
                          {row.blockers > 0 && (
                            <span className="text-[7px] text-status-error tracking-[0.2em] font-black">
                              {row.blockers} BLOCKED
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-[8px] text-white/40">
                            {row.progress}
                          </span>
                          <div className="w-20 h-0.5 bg-white/5 rounded-none overflow-hidden border border-white/5">
                            <div
                              className={`h-full ${parseInt(row.progress) > 70 ? 'bg-status-success' : parseInt(row.progress) > 40 ? 'bg-status-warning' : 'bg-status-error'} transition-all duration-700`}
                              style={{ width: row.progress }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex justify-center">
                          <VelocityIndicator direction={row.velocity} />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-none border text-[8px] font-black tracking-[0.2em] ${parseInt(row.load) > 100 ? 'text-status-error border-status-error/30 bg-status-error/5' : 'text-white/40 border-white/10 bg-white/5'}`}
                        >
                          {row.load}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <StatusIndicator color={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardSection
              title="Sprint Progress"
              icon={<BarChart3 size={14} />}
            >
              <div className="flex flex-col gap-6 pt-2">
                <div className="flex justify-between items-end leading-none">
                  <div className="flex flex-col gap-2">
                    <span className="text-[8px] text-white/40 uppercase font-black tracking-[0.2em]">
                      AGGREGATE PROGRESS
                    </span>
                    <div className="text-2xl font-black text-white tracking-widest">
                      {sprintExecution?.progress || 0}%
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 border rounded-none text-[8px] font-black uppercase tracking-[0.2em] ${sprintExecution?.risk === 'HIGH' ? 'bg-status-error/5 text-status-error border-status-error/30' : 'bg-status-success/5 text-status-success border-status-success/30'}`}
                    >
                      RISK: {sprintExecution?.risk || 'NONE'}
                    </span>
                  </div>
                </div>

                <div className="w-full h-1 bg-white/5 rounded-none overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: `${sprintExecution?.progress || 0}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-none overflow-hidden">
                  <SprintCounter
                    label="COMPLETED"
                    value={sprintExecution?.completed || 0}
                    color="text-status-success"
                  />
                  <SprintCounter
                    label="ACTIVE"
                    value={sprintExecution?.inProgress || 0}
                    color="text-primary"
                  />
                  <SprintCounter
                    label="BLOCKED"
                    value={sprintExecution?.blocked || 0}
                    color="text-status-error"
                  />
                </div>
              </div>
            </DashboardSection>

            <DashboardSection
              title="Recommendations"
              icon={<TargetIcon size={14} />}
            >
              <div className="flex flex-col gap-6 pt-2">
                <div className="bg-white/5 border border-white/10 p-4 rounded-none group hover:bg-white/10 transition-colors border-l-2 border-l-primary/40">
                  <h4 className="text-[8px] font-black text-primary uppercase flex items-center gap-2 mb-3 tracking-[0.2em]">
                    <Zap size={10} fill="currentColor" /> RECOMMENDED
                    OPTIMIZATION
                  </h4>
                  <p className="text-[9px] text-white/60 uppercase font-black tracking-[0.2em] leading-relaxed">
                    RE-ALLOCATE RESOURCES TO{' '}
                    {teamGrid.sort(
                      (a, b) => parseInt(a.load) - parseInt(b.load)
                    )[0]?.team || 'AVAILABLE'}{' '}
                    TEAM TO REDUCE OVERLOAD.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {teamGrid.slice(0, 3).map((team, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end text-[8px] font-black uppercase tracking-[0.2em]">
                        <span className="text-white/40">{team.team}</span>
                        <span
                          className={
                            parseInt(team.load) > 100
                              ? 'text-status-error'
                              : 'text-white/60'
                          }
                        >
                          {team.load}
                        </span>
                      </div>
                      <div className="w-full h-0.5 bg-white/5 rounded-none overflow-hidden border border-white/5">
                        <div
                          className={`h-full transition-all duration-1000 ${parseInt(team.load) > 100 ? 'bg-status-error' : parseInt(team.load) > 85 ? 'bg-status-warning' : 'bg-primary/40'}`}
                          style={{
                            width: `${Math.min(parseInt(team.load), 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardSection>
          </div>
        </div>

        {/* 3. Sidebar Column: Intelligence Registries */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <SystemIntegrityStatus />

          <DashboardSection
            title="Top Blockers"
            icon={<ShieldAlert size={14} />}
          >
            <div className="flex flex-col gap-px bg-white/10 border border-white/10 rounded-none overflow-hidden">
              {Object.keys(blockers).map((teamName, idx) => (
                <div
                  key={idx}
                  className="bg-black p-4 border-b border-white/[0.05] last:border-0 flex flex-col gap-3"
                >
                  <h4 className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-status-error" />
                    {teamName}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {Array.isArray(blockers[teamName]) &&
                      blockers[teamName].map((item, i) => (
                        <div
                          key={i}
                          className="text-[9px] text-white/60 font-black uppercase tracking-widest flex items-start gap-2 p-3 bg-white/5 border border-white/10 rounded-none group hover:bg-white/10 transition-colors leading-snug"
                        >
                          <span className="text-status-error shrink-0 font-black">
                            ::
                          </span>
                          {item}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
              {Object.keys(blockers).length === 0 && (
                <div className="py-12 text-center opacity-20 border border-white/10 border-dashed rounded-none">
                  <span className="text-[8px] uppercase font-black tracking-[0.2em]">
                    NO ACTIVE BLOCKERS
                  </span>
                </div>
              )}
            </div>
          </DashboardSection>

          <DashboardSection title="Timeline Risks" icon={<Clock size={14} />}>
            <div className="flex flex-col gap-2">
              {timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-none group hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black text-white group-hover:text-primary transition-colors uppercase tracking-widest">
                      {item.project}
                    </span>
                    <span className="text-[8px] text-white/20 uppercase font-black tracking-[0.2em]">
                      SCHEDULE DELAY
                    </span>
                  </div>
                  <div
                    className={`text-[8px] font-black uppercase px-2 py-1 rounded-none border tracking-[0.2em] ${item.status === 'green' ? 'bg-status-success/5 text-status-success border-status-success/30' : item.status === 'yellow' ? 'bg-status-warning/5 text-status-warning border-status-warning/30' : 'bg-status-error/5 text-status-error border-status-error/30'}`}
                  >
                    {item.drift}
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>

          <DashboardSection
            title="Recent Activity"
            icon={<Activity size={14} />}
          >
            <div className="space-y-px max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {activity?.map((item, i) => (
                <ActivityItem key={i} text={item.text} time={item.time} mini />
              ))}
            </div>
          </DashboardSection>
        </div>
      </div>

      {/* Drilldown Modal */}
      {drilldown.isOpen && (
        <DrilldownModal
          isOpen={drilldown.isOpen}
          onClose={closeDrilldown}
          title={`${drilldown.category} Overview`}
          subtitle="Detailed team workload and operational status."
          data={drilldown.data}
        />
      )}
    </div>
  );
};

const SprintCounter = ({ label, value, color }) => (
  <div className="bg-black p-3 flex flex-col gap-1.5 text-center group hover:bg-white/5 transition-colors">
    <span className="text-[7px] text-white/20 uppercase font-black tracking-[0.2em]">
      {label}
    </span>
    <span
      className={`text-[12px] font-black uppercase tracking-widest ${color}`}
    >
      {value}
    </span>
  </div>
);

const VelocityIndicator = ({ direction }) => {
  if (direction === 'up')
    return (
      <div className="flex items-center gap-1.5 text-status-success bg-status-success/5 px-2 py-1 rounded-none border border-status-success/30">
        <TrendingUp size={10} />
        <span className="text-[7px] font-black uppercase tracking-[0.2em]">
          IMPROVING
        </span>
      </div>
    );
  if (direction === 'down')
    return (
      <div className="flex items-center gap-1.5 text-status-error bg-status-error/5 px-2 py-1 rounded-none border border-status-error/30">
        <TrendingDown size={10} />
        <span className="text-[7px] font-black uppercase tracking-[0.2em]">
          DECLINING
        </span>
      </div>
    );
  return (
    <div className="flex items-center gap-1.5 text-white/40 bg-white/5 px-2 py-1 rounded-none border border-white/10">
      <Minus size={10} />
      <span className="text-[7px] font-black uppercase tracking-[0.2em]">
        STABLE
      </span>
    </div>
  );
};

const StatusIndicator = ({ color }) => {
  const labels = {
    red: 'CRITICAL',
    yellow: 'AT_RISK',
    green: 'HEALTHY',
  };
  const colors = {
    red: 'text-status-error',
    yellow: 'text-status-warning',
    green: 'text-status-success',
  };
  const dots = {
    red: 'bg-status-error',
    yellow: 'bg-status-warning',
    green: 'bg-status-success',
  };
  return (
    <div className="flex items-center justify-end gap-2">
      <span
        className={`text-[7px] font-black uppercase tracking-[0.2em] ${colors[color] || 'text-white/40'}`}
      >
        {labels[color] || 'HEALTHY'}
      </span>
      <div
        className={`w-1.5 h-1.5 rounded-none ${dots[color] || 'bg-white/20'}`}
      />
    </div>
  );
};

export default VPEDashboard;

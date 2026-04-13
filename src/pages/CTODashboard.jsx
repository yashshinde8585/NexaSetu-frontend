import React from 'react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import StatusIndicator from '../components/molecules/dashboard/StatusIndicator';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import FunctionalCard from '../components/molecules/dashboard/FunctionalCard';
import PipelineStep from '../components/molecules/dashboard/PipelineStep';
import BlockerCategory from '../components/molecules/dashboard/BlockerCategory';
import ActivityItem from '../components/molecules/dashboard/ActivityItem';
import DrilldownModal from '../components/molecules/dashboard/DrilldownModal';
import CenteredLoading from '../components/atoms/CenteredLoading';
import { Activity, Zap, AlertTriangle } from 'lucide-react';

/**
 * CTO Dashboard
 * High-level overview of engineering organization health.
 */
const CTODashboard = () => {
  const {
    data,
    isLoading,
    error,
    drilldown,
    handleDrilldown,
    closeDrilldown
  } = useRoleDashboard('cto');

  if (isLoading || !data) return <CenteredLoading />;
  if (error) return <div className="p-8 text-status-error bg-black h-screen font-mono font-black uppercase">{error?.message || 'Connection failed'}</div>;

  const { global, functionalBreakdown, functionalTable, blockers, pipeline } = data;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono selection:bg-primary selection:text-white">
      {/* Key Metrics */}
      <div id="cto-global" className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <MetricStripItem label="At-Risk Projects" value={global.projectsAtRisk} color="text-status-error" accent="bg-status-error" />
        <MetricStripItem label="Active Blockers" value={global.totalBlockers} color="text-status-warning" accent="bg-status-warning" />
        <MetricStripItem label="Avg Delivery Delay" value={`+${global.orgDeliveryDrift}d`} color="text-primary" accent="bg-primary" />
        <MetricStripItem label="Resource Utilization" value={`${global.avgUtilization}%`} color="text-status-success" accent="bg-status-success" />
        <MetricStripItem label="Overloaded Teams" value={global.teamsOverloaded} color="text-status-warning" accent="bg-status-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Org Breakdown & Table */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FunctionalCard 
              id="eng-leadership"
              title="Engineering Management" 
              onClick={() => handleDrilldown('leadership')}
              metrics={[
                { label: 'Active Projects', value: functionalBreakdown.engineeringLeadership.activeProjects },
                { label: 'Delayed', value: functionalBreakdown.engineeringLeadership.delayed, color: 'text-status-error' },
                { label: 'Avg Delay', value: `+${functionalBreakdown.engineeringLeadership.avgDrift}d`, color: 'text-white' },
                { label: 'Pending Decisions', value: functionalBreakdown.engineeringLeadership.decisionsPending, color: 'text-status-warning' }
              ]} 
              focus="Strategy & Ownership"
            />
            <FunctionalCard 
              id="eng-ic"
              title="Individual Contributors" 
              onClick={() => handleDrilldown('engineering')}
              metrics={[
                { label: 'Total Headcount', value: functionalBreakdown.engineeringIC.totalEngineers },
                { label: 'Avg Workload', value: `${functionalBreakdown.engineeringIC.avgLoad}%`, color: 'text-white' },
                { label: 'Overloaded', value: functionalBreakdown.engineeringIC.overloaded, color: 'text-status-error' },
                { label: 'Completion Rate', value: `${functionalBreakdown.engineeringIC.completionRate}%` }
              ]} 
              focus="Execution Capacity"
            />
            {/* QA and People cards follow same pattern... */}
          </div>

          <DashboardSection title="Cross-Functional Health Summary" icon={<Activity size={12} />}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/20 text-white/50 text-[10px] uppercase font-black tracking-[0.2em]">
                  <th className="py-4 px-4 font-black">Function</th>
                  <th className="py-4 px-4 font-black text-center">Load %</th>
                  <th className="py-4 px-4 font-black text-center">Blockers</th>
                  <th className="py-4 px-4 font-black">Delay</th>
                  <th className="py-4 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {functionalTable.map((row, i) => (
                  <tr key={i} 
                    onClick={() => handleDrilldown(row.function.split(' ')[0])}
                    className="border-b border-white/[0.05] hover:bg-white/5 transition-all cursor-pointer group">
                    <td className="py-4 px-4 font-black group-hover:text-primary transition-colors uppercase">{row.function}</td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-white">{row.load}%</td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-white">{row.blockers}</td>
                    <td className="py-4 px-4 font-mono font-bold text-white/60">{row.delay}</td>
                    <td className="py-4 px-4">
                      <StatusIndicator color={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DashboardSection>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardSection title="Delivery Pipelines" icon={<Zap size={12} />}>
             <div className="space-y-5 py-2">
                {(() => {
                  const total = (pipeline.backlog || 0) + (pipeline.dev || 0) + (pipeline.qa || 0) + (pipeline.release || 0);
                  const getProgress = (val) => total > 0 ? (val / total) * 100 : 0;
                  
                  return (
                    <>
                      <PipelineStep label="Backlog" value={pipeline.backlog} progress={getProgress(pipeline.backlog)} color="bg-white/20" />
                      <PipelineStep label="In Development" value={pipeline.dev} progress={getProgress(pipeline.dev)} color="bg-primary" />
                      <PipelineStep label="In QA Review" value={pipeline.qa} progress={getProgress(pipeline.qa)} color="bg-status-warning" isWarning />
                      <PipelineStep label="Ready for Release" value={pipeline.release} progress={getProgress(pipeline.release)} color="bg-status-success" />
                    </>
                  );
                })()}
             </div>
          </DashboardSection>

          <DashboardSection title="Active Blockers" icon={<AlertTriangle size={12} />}>
            <div className="space-y-6">
              <BlockerCategory label="Engineering ICs" items={blockers.engineering} />
              <BlockerCategory label="Quality Assurance" items={blockers.qa} />
              <BlockerCategory label="Operations" items={blockers.peopleOps} />
            </div>
          </DashboardSection>

          <DashboardSection title="Organizational Activity" icon={<Activity size={12} />}>
            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {data.activity?.length > 0 ? (
                data.activity.map((item, i) => (
                  <ActivityItem key={i} text={item.text} time={item.time} />
                ))
              ) : (
                <p className="text-white/40 text-[10px] uppercase font-black italic p-8 text-center">NO RECENT ACTIVITY LOGS AVAILABLE.</p>
              )}
            </div>
          </DashboardSection>
        </div>
      </div>

      <DrilldownModal 
        isOpen={drilldown.isOpen}
        onClose={closeDrilldown}
        category={drilldown.category}
        type={drilldown.type}
        data={drilldown.data}
      />
    </div>
  );
};

export default CTODashboard;

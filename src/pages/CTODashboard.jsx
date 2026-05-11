import React from 'react';
import { useRoleDashboard } from '../hooks/useRoleDashboard';
import DashboardSection from '../components/molecules/dashboard/DashboardSection';
import StatusIndicator from '../components/molecules/dashboard/StatusIndicator';
import MetricStripItem from '../components/molecules/dashboard/MetricStripItem';
import FunctionalCard from '../components/molecules/dashboard/FunctionalCard';
import PipelineStep from '../components/molecules/dashboard/PipelineStep';
import BlockerCategory from '../components/molecules/dashboard/BlockerCategory';

import DrilldownModal from '../components/molecules/dashboard/DrilldownModal';
import StrategicInsights from '../components/molecules/dashboard/StrategicInsights';
import CenteredLoading from '../components/atoms/CenteredLoading';

import { LayoutGrid, Zap, AlertTriangle } from 'lucide-react';




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
  if (error) return (
    <div className="p-8 text-status-error bg-[#0A0A0A] h-screen font-mono font-bold uppercase text-center flex items-center justify-center border border-status-error/20">
      {error?.message || 'Unable to load dashboard. Please try again.'}
    </div>
  );

  const { global, functionalBreakdown, functionalTable, blockers, pipeline } = data;

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-6 font-sans selection:bg-primary selection:text-white max-w-screen-2xl mx-auto">
      {/* 1. Global Performance metrics */}
      <div id="cto-performance-strip" className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <MetricStripItem label="Projects At risk" value={global.projectsAtRisk} color="text-status-error" accent="bg-status-error" />
        <MetricStripItem label="Active Blockers" value={global.totalBlockers} color="text-status-warning" accent="bg-status-warning" />
        <MetricStripItem label="Avg Drift" value={`+${global.orgDeliveryDrift}d`} color="text-primary" accent="bg-primary" />
        <MetricStripItem label="Energy/Cap Usage" value={`${global.avgUtilization}%`} color="text-status-primary" accent="bg-primary" />
        <MetricStripItem label="Teams At capacity" value={global.teamsOverloaded} color="text-status-warning" accent="bg-status-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Strategy & Operations */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FunctionalCard 
              id="strategic-leadership"
              title="Leadership" 
              onClick={() => handleDrilldown('leadership')}
              metrics={[
                { label: 'Active Projects', value: functionalBreakdown.engineeringLeadership.activeProjects },
                { label: 'Delayed', value: functionalBreakdown.engineeringLeadership.delayed, color: 'text-status-error' },
                { label: 'Avg Delay', value: `+${functionalBreakdown.engineeringLeadership.avgDrift}d`, color: 'text-white' },
                { label: 'Pending Approvals', value: functionalBreakdown.engineeringLeadership.decisionsPending, color: 'text-status-warning' }
              ]} 
              focus="Strategy & Policy"
            />
            <FunctionalCard 
              id="engineering-operations"
              title="Engineering Teams" 
              onClick={() => handleDrilldown('engineering')}
              metrics={[
                { label: 'Engineers', value: functionalBreakdown.engineeringIC.totalEngineers },
                { label: 'Workload', value: `${functionalBreakdown.engineeringIC.avgLoad}%`, color: 'text-white' },
                { label: 'Overloaded', value: functionalBreakdown.engineeringIC.overloaded, color: 'text-status-error' },
                { label: 'Velocity', value: `${functionalBreakdown.engineeringIC.completionRate}%` }
              ]} 
              focus="Delivery Capacity"
            />
          </div>

          <DashboardSection title="Organizational Overview" icon={<LayoutGrid size={14} />}>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="text-white/40 text-[9px] uppercase font-black tracking-[0.2em] border-b border-white/10">
                    <th className="py-3 px-4 border-b border-white/5">DEPARTMENT</th>
                    <th className="py-3 px-4 border-b border-white/5 text-center">WORKLOAD %</th>
                    <th className="py-3 px-4 border-b border-white/5 text-center">BLOCKERS</th>
                    <th className="py-3 px-4 border-b border-white/5">DELAY</th>
                    <th className="py-3 px-4 border-b border-white/5">STATUS</th>
                  </tr>
                </thead>
                <tbody className="text-[10px] font-black uppercase tracking-widest">
                  {functionalTable.map((row, i) => (
                    <tr key={i} 
                      onClick={() => handleDrilldown(row.function.split(' ')[0])}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer group group/row">
                      <td className="py-3 px-4 border-b border-white/[0.03] group-hover/row:text-primary transition-colors">{row.function}</td>
                      <td className="py-3 px-4 text-center text-white border-b border-white/[0.03]">{row.load}%</td>
                      <td className="py-3 px-4 text-center text-white border-b border-white/[0.03]">{row.blockers}</td>
                      <td className="py-3 px-4 text-white/60 border-b border-white/[0.03]">{row.delay}</td>
                      <td className="py-3 px-4 border-b border-white/[0.03]">
                        <StatusIndicator color={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>
        </div>

        {/* Right Column: Tactical Monitoring */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <StrategicInsights />
          
          <DashboardSection title="Delivery Pipeline" icon={<Zap size={14} />}>

             <div className="space-y-4 pt-2">
                {(() => {
                  const total = (pipeline.backlog || 0) + (pipeline.dev || 0) + (pipeline.qa || 0) + (pipeline.release || 0);
                  const getProgress = (val) => total > 0 ? (val / total) * 100 : 0;
                  
                  return (
                    <div className="flex flex-col gap-6">
                      <PipelineStep label="Backlog" value={pipeline.backlog} progress={getProgress(pipeline.backlog)} color="bg-white/10" />
                      <PipelineStep label="In Development" value={pipeline.dev} progress={getProgress(pipeline.dev)} color="bg-primary" />
                      <PipelineStep label="In QA Review" value={pipeline.qa} progress={getProgress(pipeline.qa)} color="bg-status-warning" isWarning />
                      <PipelineStep label="Ready for Release" value={pipeline.release} progress={getProgress(pipeline.release)} color="bg-status-success" />
                    </div>
                  );
                })()}
             </div>
          </DashboardSection>

          <DashboardSection title="Critical Blockers" icon={<AlertTriangle size={14} />}>
            <div className="space-y-4">
              <BlockerCategory label="Engineering" items={blockers.engineering} />
              <BlockerCategory label="Quality Assurance" items={blockers.qa} />
              <BlockerCategory label="Operational" items={blockers.hr} />
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


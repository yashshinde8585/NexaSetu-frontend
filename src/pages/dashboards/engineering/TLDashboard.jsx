import React, { useState, useMemo, useCallback } from 'react';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import CenteredLoading from '../../../components/atoms/CenteredLoading';
import DashboardSkeleton from '../../../components/atoms/DashboardSkeleton';
import ErrorBoundary from '../../../components/atoms/ErrorBoundary';
import ServiceDetailPanel from '../../../components/molecules/dashboard/ServiceDetailPanel';
import {
  Layout,
  BarChart2,
  ShieldCheck,
  Users,
  Code as CodeIcon,
  Network,
  Sparkles,
} from 'lucide-react';

// Modular Components
import TLOverviewTab from './TLDashboard/components/TLOverviewTab';
import TLDeliveryTab from './TLDashboard/components/TLDeliveryTab';
import TLQualityTab from './TLDashboard/components/TLQualityTab';
import TLTeamTab from './TLDashboard/components/TLTeamTab';
import TLCodeTab from './TLDashboard/components/TLCodeTab';
import DependenciesTab from './TLDashboard/components/DependenciesTab';
import TLInsightsTab from './TLDashboard/components/TLInsightsTab';

/**
 * Tech Lead (TL) Dashboard Controller
 * Reduced from monolithic layout to a modular tab panel switcher wrapped in Error Boundaries.
 */
const TLDashboard = () => {
  const { data, isLoading } = useRoleDashboard('tl');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedService, setSelectedService] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const {
    serviceMap = [],
    sprintProgress = 0,
    storiesCompleted = { completed: 0, total: 0 },
    cycleTime = { value: 0, unit: 'days' },
    deploymentFrequency = { value: 0, unit: 'week' },
    changeFailureRate = { value: 0 },
    codeHealthScore = 0,
    workItemsStatus = {
      done: 0,
      inProgress: 0,
      inReview: 0,
      blocked: 0,
      total: 0,
    },
    burndownData = [],
    topPriorities = [],
    teamVelocity = [],
    codeHealthOverview = { coverage: 0, eslint: 0, security: 0, debtDays: 0 },
    pullRequestMetrics = {
      prCycleTime: '0h',
      prsMerged: 0,
      prsOpen: 0,
      reviewTime: '0h',
      prCycleTimeHistory: [],
      prsMergedHistory: [],
      prReviewTimeHistory: [],
    },
    recentActivity = [],
    crossTeamDependencies = [],
    teamWorkload = [],
    aiInsights = [],
    upcomingDeadlines = [],
    comparisons = null,
    prComparisons = null,
    sparklineDone = [],
    sparklineCycle = [],
    technicalDebt = [],
  } = data || {};

  // ReactFlow Nodes and Edges mapping for dependencies tab
  const { nodes, edges } = useMemo(() => {
    if (!serviceMap || serviceMap.length === 0) return { nodes: [], edges: [] };

    const initialNodes = serviceMap.map((s, idx) => ({
      id: s.id || `node-${idx}`,
      type: 'service',
      position: { x: (idx % 3) * 350, y: Math.floor(idx / 3) * 250 },
      data: { ...s },
    }));

    const initialEdges = [];
    serviceMap.forEach((s) => {
      if (s.dependencies) {
        s.dependencies.forEach((depId) => {
          initialEdges.push({
            id: `e-${s.id}-${depId}`,
            source: s.id,
            target: depId,
            animated: true,
            style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 },
          });
        });
      }
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [serviceMap]);

  const handleNodeClick = useCallback((event, node) => {
    setSelectedService(node.data);
    setIsPanelOpen(true);
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-background text-text p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      <div className="flex border-b border-white/5 overflow-x-auto scrollbar-none gap-1.5">
        {[
          { id: 'overview', label: 'Overview', icon: <Layout size={12} /> },
          { id: 'delivery', label: 'Delivery', icon: <BarChart2 size={12} /> },
          { id: 'quality', label: 'Quality', icon: <ShieldCheck size={12} /> },
          { id: 'code', label: 'Code', icon: <CodeIcon size={12} /> },
          {
            id: 'dependencies',
            label: 'Dependencies',
            icon: <Network size={12} />,
          },
          { id: 'team', label: 'Team Capacity', icon: <Users size={12} /> },
          {
            id: 'insights',
            label: 'AI Insights',
            icon: <Sparkles size={12} />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#8B5CF6] text-white bg-white/5'
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
            <TLOverviewTab
              sprintProgress={sprintProgress}
              storiesCompleted={storiesCompleted}
              cycleTime={cycleTime}
              deploymentFrequency={deploymentFrequency}
              changeFailureRate={changeFailureRate}
              codeHealthScore={codeHealthScore}
              workItemsStatus={workItemsStatus}
              burndownData={burndownData}
              topPriorities={topPriorities}
              teamVelocity={teamVelocity}
              codeHealthOverview={codeHealthOverview}
              pullRequestMetrics={pullRequestMetrics}
              recentActivity={recentActivity}
              crossTeamDependencies={crossTeamDependencies}
              teamWorkload={teamWorkload}
              aiInsights={aiInsights}
              upcomingDeadlines={upcomingDeadlines}
              comparisons={comparisons}
              prComparisons={prComparisons}
              sparklineDone={sparklineDone}
              sparklineCycle={sparklineCycle}
              setActiveTab={setActiveTab}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'delivery' && (
          <ErrorBoundary>
            <TLDeliveryTab
              burndownData={burndownData}
              teamVelocity={teamVelocity}
              storiesCompleted={storiesCompleted}
              cycleTime={cycleTime}
              deploymentFrequency={deploymentFrequency}
              changeFailureRate={changeFailureRate}
              sparklineDone={sparklineDone}
              sparklineCycle={sparklineCycle}
              comparisons={comparisons}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'quality' && (
          <ErrorBoundary>
            <TLQualityTab
              codeHealthOverview={codeHealthOverview}
              technicalDebt={technicalDebt}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'code' && (
          <ErrorBoundary>
            <TLCodeTab
              pullRequestMetrics={pullRequestMetrics}
              recentActivity={recentActivity}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'dependencies' && (
          <ErrorBoundary>
            <DependenciesTab
              nodes={nodes}
              edges={edges}
              serviceMap={serviceMap}
              handleNodeClick={handleNodeClick}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'team' && (
          <ErrorBoundary>
            <TLTeamTab teamWorkload={teamWorkload} serviceMap={serviceMap} />
          </ErrorBoundary>
        )}

        {activeTab === 'insights' && (
          <ErrorBoundary>
            <TLInsightsTab aiInsights={aiInsights} />
          </ErrorBoundary>
        )}
      </div>

      <ServiceDetailPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        service={selectedService}
      />
    </div>
  );
};

export default TLDashboard;

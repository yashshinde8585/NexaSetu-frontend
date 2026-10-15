import React, { useState, useMemo, useCallback } from 'react';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import CenteredLoading from '../../../components/atoms/CenteredLoading';
import DashboardSkeleton from '../../../components/atoms/DashboardSkeleton';
import ErrorBoundary from '../../../components/atoms/ErrorBoundary';

// Hooks & Service
import { useSWEFilters } from './SWEDashboard/hooks/useSWEFilters';
import taskApi from '../../../api/taskApi';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useDebounce } from '../../../hooks/useDebounce';

// Modular Components
import SWEHeader from './SWEDashboard/components/SWEHeader';
import SWEMetricsGrid from './SWEDashboard/components/SWEMetricsGrid';
import SWETabs from './SWEDashboard/components/SWETabs';

// Tab Panels
import OverviewTab from './SWEDashboard/components/OverviewTab';
import MyWorkTab from './SWEDashboard/components/MyWorkTab';
import CodeTab from './SWEDashboard/components/CodeTab';
import PRsTab from './SWEDashboard/components/PRsTab';
import QualityTab from './SWEDashboard/components/QualityTab';
import DeploymentsTab from './SWEDashboard/components/DeploymentsTab';
import LearnTab from './SWEDashboard/components/LearnTab';
import InsightsTab from './SWEDashboard/components/InsightsTab';

/**
 * Software Engineer (SWE) Dashboard Controller
 * Reduced from monolithic layout to a modular tab panel switcher wrapped in Error Boundaries.
 */
const SWEDashboard = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useRoleDashboard('swe');

  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedWorkspace, setSelectedWorkspace] = useState('all');
  const [selectedSprintId, setSelectedSprintId] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // ─── Optimistic: Update task status ────────────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }) =>
      taskApi.updateTaskStatus(taskId, status),

    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['dashboard', 'swe'] });
      const previous = queryClient.getQueryData(['dashboard', 'swe']);

      queryClient.setQueryData(['dashboard', 'swe'], (old) => {
        if (!old?.myTasks) return old;
        return {
          ...old,
          myTasks: old.myTasks.map((t) =>
            t._id === taskId ? { ...t, status } : t
          ),
        };
      });

      return { previous };
    },

    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['dashboard', 'swe'], context.previous);
      }
      console.error('Update status failed — rolled back:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'swe'] });
    },
  });

  // ─── Optimistic: Toggle task blocked flag ───────────────────────────────────
  const blockMutation = useMutation({
    mutationFn: ({ taskId, blocked }) =>
      taskApi.toggleTaskBlockage(taskId, blocked),

    onMutate: async ({ taskId, blocked }) => {
      await queryClient.cancelQueries({ queryKey: ['dashboard', 'swe'] });
      const previous = queryClient.getQueryData(['dashboard', 'swe']);

      queryClient.setQueryData(['dashboard', 'swe'], (old) => {
        if (!old?.myTasks) return old;
        return {
          ...old,
          myTasks: old.myTasks.map((t) =>
            t._id === taskId ? { ...t, blocked } : t
          ),
        };
      });

      return { previous };
    },

    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['dashboard', 'swe'], context.previous);
      }
      console.error('Toggle block failed — rolled back:', err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'swe'] });
    },
  });

  // Stable handler references passed down to child components
  const handleUpdateStatus = useCallback(
    (taskId, status) => statusMutation.mutate({ taskId, status }),
    [statusMutation]
  );

  const handleToggleBlock = useCallback(
    (taskId, blocked) => blockMutation.mutate({ taskId, blocked }),
    [blockMutation]
  );

  const {
    myTasks,
    progress,
    prStats,
    sprintName,
    projects,
    pastSprints,
    sprintId,
    codeHealthScore,
    myVelocity,
    codeQuality,
    pullRequestsList,
    deployments,
    learnAndGrow,
    aiInsights,
    burndownData,
    recentActivity,
    myCodeImpact,
  } = data || {};

  const inProgressTasks = useMemo(
    () => (myTasks ? myTasks.filter((t) => t.status === 'in_progress') : []),
    [myTasks]
  );
  const inReviewTasks = useMemo(
    () => (myTasks ? myTasks.filter((t) => t.status === 'in_review') : []),
    [myTasks]
  );
  const doneTasks = useMemo(
    () => (myTasks ? myTasks.filter((t) => t.status === 'done') : []),
    [myTasks]
  );

  const {
    filteredMyTasks,
    filteredInProgress,
    filteredInReview,
    filteredDone,
  } = useSWEFilters(
    myTasks || [],
    inProgressTasks,
    inReviewTasks,
    doneTasks,
    selectedWorkspace,
    selectedSprintId,
    sprintId,
    debouncedSearchQuery
  );

  const workItemsStatus = useMemo(
    () => ({
      todo: myTasks ? myTasks.filter((t) => t.status === 'todo').length : 0,
      inProgress: inProgressTasks.length,
      inReview: inReviewTasks.length,
      done: doneTasks.length,
      blocked: myTasks ? myTasks.filter((t) => t.blocked).length : 0,
      total: myTasks ? myTasks.length : 0,
    }),
    [myTasks, inProgressTasks, inReviewTasks, doneTasks]
  );

  if (isLoading || !data) return <DashboardSkeleton />;
  return (
    <div className="min-h-screen bg-background text-text p-4 lg:p-6 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-6">
      <SWEHeader
        projects={projects}
        pastSprints={pastSprints}
        sprintName={sprintName}
        selectedWorkspace={selectedWorkspace}
        setSelectedWorkspace={setSelectedWorkspace}
        selectedSprintId={selectedSprintId}
        setSelectedSprintId={setSelectedSprintId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <SWEMetricsGrid
        sprintProgress={progress.percentage}
        sprintDaysLeft={progress.daysLeft}
        workItemsStatus={workItemsStatus}
        pullRequestMetrics={prStats}
        codeHealthScore={codeHealthScore}
        myVelocity={myVelocity}
        setActiveTab={setActiveTab}
      />

      <SWETabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        {activeTab === 'Overview' && (
          <ErrorBoundary>
            <OverviewTab
              filteredInProgress={filteredInProgress}
              filteredInReview={filteredInReview}
              filteredDone={filteredDone}
              burndownData={burndownData}
              recentActivity={recentActivity}
              setActiveTab={setActiveTab}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'My Work' && (
          <ErrorBoundary>
            <MyWorkTab
              filteredMyTasks={filteredMyTasks}
              handleUpdateStatus={handleUpdateStatus}
              handleToggleBlock={handleToggleBlock}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'Code' && (
          <ErrorBoundary>
            <CodeTab myVelocity={myVelocity} myCodeImpact={myCodeImpact} />
          </ErrorBoundary>
        )}

        {activeTab === 'Pull Requests' && (
          <ErrorBoundary>
            <PRsTab
              pullRequestMetrics={prStats}
              pullRequestsList={pullRequestsList}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'Quality' && (
          <ErrorBoundary>
            <QualityTab codeQuality={codeQuality} />
          </ErrorBoundary>
        )}

        {activeTab === 'Deployments' && (
          <ErrorBoundary>
            <DeploymentsTab deployments={deployments} />
          </ErrorBoundary>
        )}

        {activeTab === 'Learn' && (
          <ErrorBoundary>
            <LearnTab learnAndGrow={learnAndGrow} />
          </ErrorBoundary>
        )}

        {activeTab === 'Insights' && (
          <ErrorBoundary>
            <InsightsTab aiInsights={aiInsights} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default SWEDashboard;

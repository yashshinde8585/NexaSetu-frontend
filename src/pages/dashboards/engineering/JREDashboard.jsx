import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRoleDashboard } from '../../../hooks/useRoleDashboard';
import taskApi from '../../../api/taskApi';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import DashboardSkeleton from '../../../components/atoms/DashboardSkeleton';
import ErrorBoundary from '../../../components/atoms/ErrorBoundary';

import JRETabs from './JREDashboard/components/JRETabs';
import JREMetricsGrid from './JREDashboard/components/JREMetricsGrid';
import OverviewTab from './JREDashboard/components/OverviewTab';
import MyWorkTab from './JREDashboard/components/MyWorkTab';
import LearnTab from './JREDashboard/components/LearnTab';
import CodeTab from './JREDashboard/components/CodeTab';
import FeedbackTab from './JREDashboard/components/FeedbackTab';
import InsightsTab from './JREDashboard/components/InsightsTab';

/**
 * Premium Guided Work Assistant Dashboard (Junior Engineer)
 * Refactored into a modular layout using global theme variables and optimistic UI updates.
 */
const JREDashboard = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useRoleDashboard('jre');

  const [activeTab, setActiveTab] = useState('overview');

  // Optimistic UI for task status update
  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }) => {
      const nextMap = {
        todo: 'in_progress',
        in_progress: 'in_review',
        in_review: 'done',
        done: 'todo',
      };
      const nextStatus = nextMap[status] || 'in_progress';
      return taskApi.updateTaskStatus(taskId, nextStatus, 0);
    },
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['dashboard', 'jre'] });
      const previous = queryClient.getQueryData(['dashboard', 'jre']);

      queryClient.setQueryData(['dashboard', 'jre'], (old) => {
        if (!old?.inProgressTasks) return old;
        const nextMap = {
          todo: 'in_progress',
          in_progress: 'in_review',
          in_review: 'done',
          done: 'todo',
        };
        const nextStatus = nextMap[status] || 'in_progress';
        return {
          ...old,
          inProgressTasks: old.inProgressTasks.map((t) =>
            t.id === taskId ? { ...t, status: nextStatus } : t
          ),
        };
      });

      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['dashboard', 'jre'], context.previous);
      }
      console.error('Status update failed:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'jre'] });
    },
  });

  const handleStatusUpdate = useCallback(
    (taskId, currentStatus) => {
      statusMutation.mutate({ taskId, status: currentStatus });
    },
    [statusMutation]
  );

  if (isLoading) return <DashboardSkeleton />;

  // Destructure JRE dashboard data from backend with safe empty fallbacks
  const {
    sprintName = 'No Active Sprint',
    sprintDaysLeft = 0,
    sprintProgress = 0,
    workItemsStatus = {
      todo: 0,
      inProgress: 0,
      inReview: 0,
      blocked: 0,
      done: 0,
      total: 0,
    },
    inProgressTasks = [],
    pullRequestMetrics = { open: 0, review: 0, merged: 0 },
    pullRequestsList = [],
    codeHealthScore = 0,
    burndownData = [],
    recentActivity = [],
    codeQuality = {
      coverage: 0,
      coverageDiff: 0,
      eslint: 0,
      eslintDiff: 0,
      security: 0,
      securityDiff: 0,
      techDebt: 0,
      techDebtDiff: 0,
    },
    deployments = [],
    aiInsights = [],
    upcomingDeadlines = [],
    learnAndGrow = [],
    xp: rawXp,
    level: rawLevel,
    xpToNextLevel: rawXpToNextLevel,
  } = data || {};

  // XP Progress Calculation based on actual data or safe defaults
  const xp = rawXp || 0;
  const level = rawLevel || 1;
  const xpToNextLevel = rawXpToNextLevel || 1000 - (xp % 1000);

  // Connect learning path directly to backend data
  const learningLessons = learnAndGrow || [];

  return (
    <div className="min-h-screen bg-background text-text p-3 lg:p-4 font-sans selection:bg-primary max-w-screen-2xl mx-auto flex flex-col gap-4">
      <JRETabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        {activeTab === 'overview' && (
          <ErrorBoundary>
            <div className="flex flex-col gap-4 animate-fade-in">
              <JREMetricsGrid
                sprintProgress={sprintProgress}
                sprintDaysLeft={sprintDaysLeft}
                workItemsStatus={workItemsStatus}
                pullRequestMetrics={pullRequestMetrics}
                codeHealthScore={codeHealthScore}
                xp={xp}
                level={level}
                xpToNextLevel={xpToNextLevel}
                setActiveTab={setActiveTab}
              />
              <OverviewTab
                burndownData={burndownData}
                recentActivity={recentActivity}
                upcomingDeadlines={upcomingDeadlines}
                deployments={deployments}
                inProgressTasks={inProgressTasks}
                learningLessons={learningLessons}
                codeQuality={codeQuality}
                pullRequestsList={pullRequestsList}
                aiInsights={aiInsights}
                setActiveTab={setActiveTab}
              />
            </div>
          </ErrorBoundary>
        )}

        {activeTab === 'my_work' && (
          <ErrorBoundary>
            <MyWorkTab
              inProgressTasks={inProgressTasks}
              handleStatusUpdate={handleStatusUpdate}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'learn' && (
          <ErrorBoundary>
            <LearnTab learningLessons={learningLessons} />
          </ErrorBoundary>
        )}

        {activeTab === 'code' && (
          <ErrorBoundary>
            <CodeTab
              codeQuality={codeQuality}
              pullRequestsList={pullRequestsList}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'feedback' && (
          <ErrorBoundary>
            <FeedbackTab />
          </ErrorBoundary>
        )}

        {activeTab === 'insights' && (
          <ErrorBoundary>
            <InsightsTab aiInsights={aiInsights} />
          </ErrorBoundary>
        )}
      </div>

      {/* Global Footer Strip */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-subtle text-[9px] font-black uppercase tracking-widest text-text-subtle">
        <div className="flex items-center gap-6">
          <span>Last updated: 2 minutes ago</span>
          <div className="flex items-center gap-1.5 text-status-success">
            <span>Auto-refresh: On</span>
            <div className="w-1.5 h-1.5 rounded-none bg-status-success animate-pulse" />
          </div>
        </div>
        <span>Data as of: May 18, 2025 10:24 AM IST</span>
      </div>
    </div>
  );
};

export default JREDashboard;

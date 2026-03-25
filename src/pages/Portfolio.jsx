import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDashboardStats } from '../api/dashboardService';
import { getResourceWorkload } from '../api/resourceService';
import { getPortfolioRecommendations, getActivityLogs } from '../api/aiService';
import { getPendingActions, approveAction, rejectAction } from '../api/actionService';

import ProjectCard from '../components/ProjectCard';
import MagicBar from '../components/MagicBar';
import StrategicOverview from '../components/portfolio/StrategicOverview';
import ApprovalPanel from '../components/portfolio/ApprovalPanel';
import SuggestionPanel from '../components/portfolio/SuggestionPanel';
import ResourcePanel from '../components/portfolio/ResourcePanel';
import ActivityFeed from '../components/portfolio/ActivityFeed';

const Portfolio = () => {
  const queryClient = useQueryClient();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['portfolio-stats'],
    queryFn: () => getDashboardStats().then(res => res.data.data)
  });

  const { data: resources, isLoading: resLoading } = useQuery({
    queryKey: ['resource-workload'],
    queryFn: () => getResourceWorkload().then(res => res.data.resources)
  });

  const { data: recommendations, isLoading: recLoading, refetch: refetchRecs } = useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: () => getPortfolioRecommendations().then(res => res.data.recommendations)
  });

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: () => getActivityLogs().then(res => res.data.logs)
  });

  const { data: actions, isLoading: actionsLoading } = useQuery({
    queryKey: ['pending-actions'],
    queryFn: () => getPendingActions().then(res => res.data.actions)
  });

  const approveMutation = useMutation({
    mutationFn: (id) => approveAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-actions', 'portfolio-stats', 'activity-logs']);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-actions']);
    }
  });

  const isLoading = statsLoading || resLoading || recLoading || logsLoading || actionsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const projects = statsData?.projects || [];
  const globalVelocity = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + p.percentage, 0) / projects.length) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-700">
      {/* StrategicOverview removed as per user's stealth-aesthetic preference */}
      
      <MagicBar />

      <ApprovalPanel 
        actions={actions || []} 
        handleApprove={approveMutation.mutate} 
        handleReject={rejectMutation.mutate} 
      />

      <SuggestionPanel recommendations={recommendations || []} setRecommendations={refetchRecs} />

      <div>
        {projects.length === 0 ? (
          <div className="bg-background-light/40 border-2 border-dashed border-white/10 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center">
            <p className="text-4xl mb-4">🌑</p>
            <h3 className="text-2xl font-bold text-white">No Strategic Projects Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      <ResourcePanel resources={resources || []} />
      
      <ActivityFeed logs={logs || []} />

      {/* Legacy Risk Panels (kept for visual excellence) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="bg-gradient-to-br from-[#2D1B69]/30 to-[#1B1B3A]/30 p-10 rounded-[3rem] border border-[#6D28D9]/20 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 group-hover:scale-110 transition-transform duration-500">🛡️</div>
           <h3 className="text-2xl font-black text-white mb-4">Risk Management</h3>
           <p className="text-white/60 leading-relaxed mb-6">
             Your portfolio view highlights projects with less than 30% progress as <span className="text-status-error font-bold italic">High Risk</span>.
           </p>
        </div>
        <div className="bg-gradient-to-br from-[#1B3A2D]/30 to-[#1B1B3A]/30 p-10 rounded-[3rem] border border-[#10B981]/20 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 group-hover:scale-110 transition-transform duration-500">🛰️</div>
           <h3 className="text-2xl font-black text-white mb-4">Health Prediction Ready</h3>
           <p className="text-white/60 leading-relaxed mb-6">
             Our AI engine is currently analyzing historical patterns to predict delays.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

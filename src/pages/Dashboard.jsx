import React from 'react';
import { FolderOpen, Rocket, CheckCircle, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { useMagic } from '../context/MagicContext';


// Sub-components
import StatCards from '../components/dashboard/StatCards';
import SprintList from '../components/dashboard/SprintList';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import RoleAnalytics from '../components/dashboard/RoleAnalytics';
import ProjectCard from '../components/ProjectCard';
import ApprovalPanel from '../components/portfolio/ApprovalPanel';

// import MagicBar from '../components/MagicBar';

const Dashboard = () => {
  const { user } = useAuth();
  const { setProjects, setDashboardContext } = useMagic();
  const {
    projects,
    workload,
    aiImpact,
    personal,
    sprints,
    selectedSprintId,
    setSelectedSprintId,
    sprintStats,
    recentActivity,
    isLoading,
    error,
    createMutation,
    pendingActions,
    approveAction,
    rejectAction
  } = useDashboard(user);

  // Synchronize dashboard project data with global magic bar context
  React.useEffect(() => {
    if (projects) {
      setProjects(projects);
    }
  }, [projects, setProjects]);

  // Role-Adaptive Escalations Filtering
  const escalations = React.useMemo(() => {
    const isGlobalViewer = user?.role === 'WORKSPACE_ADMIN' || user?.role === 'WORKSPACE_MANAGER';
    
    // Global viewers see all workspace risks
    if (isGlobalViewer) {
      return projects.filter(p => p.riskLevel === 'High' || (p.healthScore && p.healthScore < 50));
    }

    // Lead/Developer see risks only in their assigned missions
    return projects.filter(p => {
      const isMember = p.members?.some(m => m.toString() === user?._id?.toString());
      const isLead = (user?.jobTitle || '').toUpperCase().includes('LEAD') || user?.role === 'TECH_LEAD';
      return isMember && (p.riskLevel === 'High' || (p.healthScore && p.healthScore < 50));
    });
  }, [projects, user]);

  const stats = React.useMemo(() => {
    const isLead = (user?.jobTitle || '').toUpperCase().includes('LEAD') || user?.role === 'TECH_LEAD';
    const isAdmin = (user?.role === 'WORKSPACE_ADMIN' || user?.role === 'WORKSPACE_MANAGER') && !isLead;

    let computedStats = [];
    if (isAdmin) {
      const activeCount = projects.filter(p => p.percentage < 100).length;
      const completedCount = projects.filter(p => p.percentage === 100).length;
      const atRiskCount = projects.filter(p => p.percentage < 50 && p.percentage > 0).length;
      const avgVelocity = projects.length > 0
        ? (projects.reduce((sum, p) => sum + p.percentage, 0) / projects.length)
        : 0;

      computedStats = [
        { label: 'Active Projects', value: activeCount, color: 'bg-primary/10 border-primary/20 text-primary', icon: <FolderOpen size={20} />, trend: '+2 this mo' },
        { label: 'Overall Velocity', value: `${avgVelocity.toFixed(0)}%`, color: 'bg-white/5 border-white/10 text-white', icon: <Rocket size={20} />, trend: '+5.2%' },
        { label: 'Projects At Risk', value: atRiskCount, color: 'bg-status-warning/10 border-status-warning/20 text-status-warning', icon: <Zap size={20} />, trend: '+12% risk' },
        { label: 'Completed', value: completedCount, color: 'bg-status-success/10 border-status-success/20 text-status-success', icon: <CheckCircle size={20} />, trend: '+4 this wk' },
      ];
    } else if (isLead) {
      const teamImpact = projects.length > 0 ? (projects.reduce((s, p) => s + (p.percentage || 0), 0) / projects.length).toFixed(0) : 0;
      const criticalBlockers = projects.reduce((s, p) => s + (p.delayedTasks || 0), 0);
      const teamSize = workload.length;

      computedStats = [
        { label: 'Assigned Missions', value: projects.length, color: 'bg-secondary/10 border-secondary/20 text-secondary', icon: <FolderOpen size={20} />, trend: '+1 new' },
        { label: 'Mission Momentum', value: `${teamImpact}%`, color: 'bg-white/5 border-white/10 text-white', icon: <Rocket size={20} />, trend: '+8.1%' },
        { label: 'Critical Blockers', value: criticalBlockers, color: 'bg-status-error/10 border-status-error/20 text-status-error', icon: <Zap size={20} />, trend: '-1 resolved' },
        { label: 'Personnel Pulse', value: teamSize, color: 'bg-primary/10 border-primary/20 text-primary', icon: <CheckCircle size={20} />, trend: 'Stable' },
      ];
    } else {
      const myImpact = personal.total > 0 ? ((personal.completed / personal.total) * 100).toFixed(0) : 0;
      computedStats = [
        { label: 'Tasks Remaining', value: personal.active, color: 'bg-secondary/10 border-secondary/20 text-secondary', icon: <FolderOpen size={20} />, trend: '+3 new', to: '/my-tasks?filter=active' },
        { label: 'Velocity Score', value: `${myImpact}%`, color: 'bg-white/5 border-white/10 text-white', icon: <Rocket size={20} />, trend: '+2.4%', to: '/velocity' },
        { label: 'My Tasks Due', value: projects.reduce((acc, p) => acc + (p.myTasksDelayed || 0), 0), color: 'bg-status-warning/10 border-status-warning/20 text-status-warning', icon: <Zap size={20} />, trend: 'Action Required', to: '/my-tasks?filter=due' },
        { label: 'Tasks Completed', value: personal.completed, color: 'bg-status-success/10 border-status-success/20 text-status-success', icon: <CheckCircle size={20} />, trend: '+8 finalized', to: '/my-tasks?filter=completed' },
      ];
    }
    return computedStats;
  }, [projects, workload, personal, user]);

  // Synchronize dashboard summary stats with magic global context to help Nexa's understanding of the UI
  React.useEffect(() => {
    if (stats && stats.length > 0) {
      setDashboardContext({ stats });
    }
  }, [stats, setDashboardContext]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const errorMessage = error?.response?.data?.message || createMutation.error?.response?.data?.message || '';

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-10 pt-8 pb-12 space-y-12">
      {errorMessage && <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-3 rounded-xl text-xs">{errorMessage}</div>}

      {/* MagicBar moved to Navbar */}

      <div className="space-y-12">
        <StatCards stats={stats} />

        <div className="relative z-30">
          <SprintList
            sprints={sprints}
            user={user}
            isLoading={isLoading}
          />
        </div>

        <div className="relative z-20">
          <RoleAnalytics user={user} projects={projects} workload={workload} aiImpact={aiImpact} />
        </div>

        {/* Critical High-Risk Escalations Section */}
        <div className="space-y-10 pt-12 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4">
            <div className="h-1 text-status-error w-8 bg-status-error rounded-full opacity-50 shrink-0 hidden sm:block"></div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-status-error drop-shadow-sm">Critical High-Risk Escalations</h2>
            <div className="h-1 text-status-error flex-1 bg-status-error rounded-full opacity-5 my-auto hidden sm:block"></div>
          </div>

          {escalations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-10 pb-10">
              {escalations.map((project) => (
                <ProjectCard key={project._id} project={{ ...project, variant: 'strategic' }} />
              ))}
            </div>
          ) : (
            <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center">
              <ShieldCheck className="text-status-success mb-4 opacity-40" size={32} />
              <h3 className="text-base font-bold text-status-success italic opacity-80">All Projects are within Optimal Execution Boundaries</h3>
              <p className="text-[10px] text-text-muted mt-1 uppercase font-black tracking-widest">NexaSetu AI Monitor: Active (No Delays Detected)</p>
            </div>
          )}
        </div>

        {/* AI Orchestration Approval Area */}
        <div className="pt-10 transition-all duration-1000">
           <ApprovalPanel 
              actions={pendingActions} 
              handleApprove={approveAction} 
              handleReject={rejectAction} 
           />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

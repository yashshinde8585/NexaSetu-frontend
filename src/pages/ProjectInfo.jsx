import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Zap, ChevronDown } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants/auth';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import SprintCreationModal from '../components/organisms/SprintCreationModal';
import SprintDetailsCard from '../components/organisms/SprintDetailsCard';
import ProjectStatusList from '../components/organisms/ProjectStatusList';
import SprintSummaryModal from '../components/organisms/SprintSummaryModal';

// Orchestrates and monitors development cycles (sprints) across the workspace.
const ProjectInfo = () => {
  const { user } = useAuth();
  // Tactical State Persistence
  const [selectedSprintId, setSelectedSprintId] = useState(() => localStorage.getItem('nexa_selected_sprint_id'));
  const [filterProjectId, setFilterProjectId] = useState(() => localStorage.getItem('nexa_selected_project_id'));
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [quickTicketProject, setQuickTicketProject] = useState(null);
  const [quickTicketTitle, setQuickTicketTitle] = useState('');

  const {
    projects,
    isLoading,
    sprints,
    sprintStats,
    sprintStatsLoading,
    createSprint,
    createSprintLoading,
    createTicket,
    createTicketLoading,
    linkProjectToSprint: handleLinkProject,
    getFinalSummary,
    downloadSprintReport,
  } = useDashboard(user, selectedSprintId);

  const [finalSummary, setFinalSummary] = useState(null);
  const [finalizing, setFinalizing] = useState(false);
  const [showWorkload, setShowWorkload] = useState(true);
  const [sprintData, setSprintData] = useState({
    name: '',
    project: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Sync state with localStorage for persistence
  useEffect(() => {
    if (selectedSprintId) localStorage.setItem('nexa_selected_sprint_id', selectedSprintId);
  }, [selectedSprintId]);

  useEffect(() => {
    if (filterProjectId) localStorage.setItem('nexa_selected_project_id', filterProjectId);
    else localStorage.removeItem('nexa_selected_project_id');
  }, [filterProjectId]);

  // Filtering sprints based on user project access
  const sprintsForUser = useMemo(() => {
    if (!sprints) return [];
    if (user?.role === USER_ROLES.WORKSPACE_ADMIN || user?.role === USER_ROLES.WORKSPACE_MANAGER || user?.role === USER_ROLES.TECH_LEAD) return sprints;
    
    const userProjectIds = projects.map(p => p._id);
    return sprints.filter(s => {
      const pid = s.project?._id || s.project;
      return !pid || userProjectIds.includes(pid);
    });
  }, [sprints, user, projects]);

  // Initial selection logic
  useEffect(() => {
    if (!selectedSprintId && sprintsForUser?.length > 0) {
      const active = sprintsForUser.find(s => s.status === 'active') || sprintsForUser[0];
      if (active) setSelectedSprintId(active._id);
    }
  }, [sprintsForUser, selectedSprintId]);

  // Logic to calculate specific sprint metrics
  const selectedSprintData = useMemo(() => 
    sprints?.find(s => s._id === selectedSprintId),
  [sprints, selectedSprintId]);

  const sprintMetrics = useMemo(() => {
    if (!sprintStats?.metrics) {
      if (!selectedSprintData) return null;
      return {
        health: selectedSprintData.health || 0,
        pressure: selectedSprintData.pressureIndex || 0,
        velocity: selectedSprintData.velocity || 0,
        open: 0,
        active: 0,
        review: 0,
        completed: 0,
        velocitySpark: [],
        flowEfficiency: '0'
      };
    }

    const { raw, ...otherMetrics } = sprintStats.metrics;
    return {
      ...otherMetrics,
      open: raw?.totalOpen || 0,
      active: raw?.inProgress || 0,
      review: raw?.inReview || 0,
      completed: raw?.completed || 0,
      health: selectedSprintData?.healthScore || 0,
      pressure: selectedSprintData?.pressureIndex || 0,
      velocity: raw?.completed || 0,
    };
  }, [sprintStats, selectedSprintData]);



  const canCreate = user?.role === USER_ROLES.WORKSPACE_ADMIN || user?.role === USER_ROLES.WORKSPACE_MANAGER || user?.role === USER_ROLES.TECH_LEAD;

  const submitSprint = (e) => {
    e.preventDefault();
    createSprint(sprintData, {
      onSuccess: (res) => {
        if (res.data?.sprint) setSelectedSprintId(res.data.sprint._id);
        setShowSprintForm(false);
      },
    });
  };

  const finalizeSelection = async () => {
    setFinalizing(true);
    try {
      const summary = await getFinalSummary(selectedSprintId);
      setFinalSummary(summary);
    } finally {
      setFinalizing(false);
    }
  };

  const handleDownload = () => {
    downloadSprintReport(selectedSprintId);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 pt-10 pb-8 space-y-6 font-sans relative">
      <SprintCreationModal show={showSprintForm} onClose={() => setShowSprintForm(false)} sprintData={sprintData} setSprintData={setSprintData} onSubmit={submitSprint} isLoading={createSprintLoading} projects={projects} />
      <SprintSummaryModal finalSummary={finalSummary} setFinalSummary={setFinalSummary} />

      {/* Sprint Management Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-20">
        <div className="space-y-3 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[28px] font-black text-white tracking-tighter uppercase leading-tight">
              Sprint <span className="text-secondary">Management</span>
            </h2>
          </div>
          <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
            Control Center for Development Cycles
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-30">
          {canCreate && (
            <button 
              onClick={() => setShowSprintForm(true)}
              className="h-12 px-8 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all active:scale-95 group"
            >
              <Plus size={14} className="text-primary group-hover:rotate-90 transition-transform" />
              CREATE NEW SPRINT
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 relative z-10">
        {selectedSprintId ? (
          <SprintDetailsCard
            sprint={selectedSprintData}
            metrics={sprintMetrics}
            stats={sprintStats}
            statsLoading={sprintStatsLoading}
            showWorkload={showWorkload}
            setShowWorkload={setShowWorkload}
            onDownload={handleDownload}
            sprints={sprintsForUser}
            onSprintChange={(id) => setSelectedSprintId(id)}
            onAddSprint={() => setShowSprintForm(true)}
            onFinalize={finalizeSelection}
            finalizing={finalizing}
            canCreate={canCreate}
          />
        ) : (
          <div className="p-20 text-center flex flex-col items-center justify-center space-y-10 border border-white/5 bg-white/[0.02] shadow-2xl group">
             <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-2xl shadow-primary/20">
               <Zap size={32} />
             </div>
             <div className="space-y-4 max-w-sm">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">No Active Sprint Detected</h3>
                <p className="text-text-muted text-[11px] font-bold uppercase tracking-[0.3em] opacity-40 leading-relaxed">Initialize a new cycle to begin cycle management</p>
             </div>
             {canCreate && (
               <Button onClick={() => setShowSprintForm(true)} variant="primary" size="lg" className="px-10 rounded-none uppercase tracking-[0.3em] text-[10px] font-black">
                 + Add Sprint
               </Button>
             )}
          </div>
        )}

        <ProjectStatusList 
          projects={projects} 
          currentSprintId={selectedSprintId}
          onLinkProject={handleLinkProject}
          canLink={canCreate}
        />
      </div>
    </div>
  );
};

export default ProjectInfo;

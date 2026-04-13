import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Zap, Cpu, Activity, Clock, Box } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants/auth';
import Button from '../components/atoms/Button';
import SprintCreationModal from '../components/organisms/SprintCreationModal';
import SprintDetailsCard from '../components/organisms/SprintDetailsCard';
import ProjectStatusList from '../components/organisms/ProjectStatusList';
import SprintSummaryModal from '../components/organisms/SprintSummaryModal';

/**
 * Tactical Sprint Intelligence Hub.
 * Orchestrates development cycles, tracks high-level project status, and monitors organizational velocity.
 * Optimized for industrial sunlight legibility and high-density technical orchestration.
 */
const ProjectInfo = () => {
  const { user } = useAuth();
  
  // Tactical State Persistence
  const [selectedSprintId, setSelectedSprintId] = useState(() => localStorage.getItem('nexa_selected_sprint_id'));
  const [filterProjectId, setFilterProjectId] = useState(() => localStorage.getItem('nexa_selected_project_id'));
  const [showSprintForm, setShowSprintForm] = useState(false);

  const {
    projects,
    isLoading,
    sprints,
    sprintStats,
    sprintStatsLoading,
    createSprint,
    createSprintLoading,
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

  const handleDownload = async () => {
    try {
      const reportData = await downloadSprintReport(selectedSprintId);
      
      // Convert reportData.tasks into CSV format
      const tasks = reportData.tasks || [];
      const headers = ['Sprint', 'Task Title', 'Project', 'Assigned To', 'Status', 'Priority', 'Due Date'];
      const sprintName = reportData.sprint?.name || 'Unknown Sprint';
      
      const csvContent = [
        headers.join(','),
        ...tasks.map(t => {
          // Wrap text in quotes to handle commas within values
          const escape = (val) => `"${(val || '').toString().replace(/"/g, '""')}"`;
          return [
            escape(sprintName),
            escape(t.title),
            escape(t.project),
            escape(t.assignedTo),
            escape(t.status),
            escape(t.priority),
            escape(t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '')
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sprint-report-${selectedSprintId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download sprint report:', err);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-12 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-700">
        
        <SprintCreationModal 
          show={showSprintForm} 
          onClose={() => setShowSprintForm(false)} 
          sprintData={sprintData} 
          setSprintData={setSprintData} 
          onSubmit={submitSprint} 
          isLoading={createSprintLoading} 
          projects={projects} 
        />
        
        <SprintSummaryModal 
          finalSummary={finalSummary} 
          setFinalSummary={setFinalSummary} 
        />

        {/* Tactical Orchestration Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/40 pb-12">
          <div className="space-y-6 flex-1 w-full">
            <div className="flex items-center gap-4">

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight uppercase leading-none">
                   Sprint <span className="text-primary">Intelligence</span> Core
                </h1>
                <p className="text-[10px] sm:text-[11px] font-bold text-white/40 uppercase tracking-widest">
                  Mission Control for Organizational Development Cycles
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4">
               <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Active Cycles</span>
                  <div className="flex items-center gap-2.5">
                     <Clock size={14} className="text-primary-light" />
                     <span className="text-sm font-black text-white uppercase tracking-tight">{sprintsForUser?.length || 0} SECTORS</span>
                  </div>
               </div>




            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {canCreate && (
              <button 
                onClick={() => setShowSprintForm(true)}
                className="flex-1 sm:flex-none h-14 px-10 bg-primary text-black hover:bg-primary-dark rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/40 transition-all active:scale-95 group"
              >
                <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                INITIATE NEW SPRINT
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 relative z-10">
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
            <div className="py-24 text-center bg-black border border-dashed border-white/30 rounded-[40px] animate-in zoom-in-95 duration-500 shadow-3xl group">
               <div className="w-24 h-24 bg-black rounded-3xl border border-primary flex items-center justify-center text-primary mx-auto mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                 <Zap size={48} />
               </div>
               <div className="space-y-4 max-w-sm mx-auto mb-12">
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Status: Standby</h3>
                  <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed">No active development cycle detected. Initialize a new sprint to begin telemetry tracking.</p>
               </div>
               {canCreate && (
                 <button 
                   onClick={() => setShowSprintForm(true)}
                   className="h-14 px-12 bg-white text-black hover:bg-white/90 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95"
                 >
                   + INITIALIZE CYCLE
                 </button>
               )}
            </div>
          )}

          <div className="pt-8">
            <ProjectStatusList 
              projects={projects} 
              currentSprintId={selectedSprintId}
              onLinkProject={handleLinkProject}
              canLink={canCreate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import SprintCreationModal from '../components/organisms/SprintCreationModal';
import SprintDetailsCard from '../components/organisms/SprintDetailsCard';
import ProjectStatusList from '../components/organisms/ProjectStatusList';
import SprintSummaryModal from '../components/organisms/SprintSummaryModal';

// Orchestrates project-level data, sprint cycle management, and tactical reporting summaries.
const ProjectInfo = () => {
  const { user } = useAuth();
  const {
    projects,
    workload,
    isLoading,
    newProjectName,
    setNewProjectName,
    showForm,
    setShowForm,
    handleCreateProject,
    sprints,
    selectedSprintId,
    setSelectedSprintId,
    sprintStats,
    sprintStatsLoading,
    createSprint,
    createSprintLoading,
    createTicket,
    createTicketLoading,
    linkProjectToSprint: handleLinkProject,
    getFinalSummary,
    downloadSprintReport,
  } = useDashboard(user);

  const [finalSummary, setFinalSummary] = useState(null);
  const [finalizing, setFinalizing] = useState(false);
  const [showWorkload, setShowWorkload] = useState(true);
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [quickTicketProject, setQuickTicketProject] = useState(null);
  const [quickTicketTitle, setQuickTicketTitle] = useState('');
  const [sprintData, setSprintData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  });

  useEffect(() => {
    if (!selectedSprintId && sprints?.length > 0) {
      setSelectedSprintId(sprints[0]._id);
    }
  }, [sprints, selectedSprintId, setSelectedSprintId]);

  const isGlobalViewer =
    user?.role === 'WORKSPACE_ADMIN' ||
    user?.role === 'ADMIN' ||
    user?.role === 'WORKSPACE_MANAGER' ||
    user?.role === 'MANAGER';

  const sprintMetrics = useMemo(() => {
    const sprintProjects = projects.filter((p) => {
      const pSprintId = (p.sprint?._id || p.sprint)?.toString();
      return pSprintId === selectedSprintId?.toString();
    });

    if (sprintStats) {
      return {
        completionRate: sprintStats.metrics?.completionRate || '0%',
        open:
          sprintStats.metrics?.raw?.totalOpen ||
          sprintStats.metrics?.raw?.pending ||
          0,
        active: sprintStats.metrics?.raw?.inProgress || 0,
        review: sprintStats.metrics?.raw?.inReview || 0,
        completed: sprintStats.metrics?.raw?.completed || 0,
      };
    }

    // Calculate aggregate statistics manually if pre-calculated metrics are unavailable
    const metrics = sprintProjects.reduce(
      (acc, p) => {
        acc.total += p.totalTasks || 0;
        acc.completed += p.completedTasks || 0;
        acc.open += p.pendingTasks || 0;
        acc.active += p.inProgressTasks || 0;
        acc.review += p.inReviewTasks || 0;
        return acc;
      },
      { total: 0, completed: 0, open: 0, active: 0, review: 0 }
    );

    return {
      completionRate:
        metrics.total > 0
          ? ((metrics.completed / metrics.total) * 100).toFixed(0) + '%'
          : '0%',
      open: metrics.open,
      active: metrics.active,
      review: metrics.review,
      completed: metrics.completed,
    };
  }, [projects, selectedSprintId, sprintStats]);

  const canCreate = [
    'WORKSPACE_ADMIN',
    'ADMIN',
    'WORKSPACE_MANAGER',
    'MANAGER',
  ].includes(user?.role);

  // Generates and triggers download of a comprehensive CSV sprint report
  const handleDownload = async () => {
    if (!selectedSprintId) return;
    try {
      const data = await downloadSprintReport(selectedSprintId);
      let csv = `SPRINT REPORT: ${data.sprint.name}\n`;
      csv += `Period: ${new Date(data.sprint.startDate).toLocaleDateString()} - ${new Date(data.sprint.endDate).toLocaleDateString()}\n`;
      csv += `Status: ${data.sprint.status.toUpperCase()}\n\n`;
      csv += `PROJECTS\nName,Status,Completion,Total Tickets,Completed\n`;
      data.projects.forEach((p) => {
        csv += `"${p.name}",${p.status},${p.percentage}%,${p.totalTasks},${p.completedTasks}\n`;
      });
      csv += `\nTASKS\nTitle,Project,Assigned To,Status,Due Date,Priority\n`;
      data.tasks.forEach((t) => {
        csv += `"${t.title.replace(/"/g, '""')}","${t.project}",${t.assignedTo},${t.status},${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'None'},${t.priority}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute(
        'download',
        `Sprint_Report_${data.sprint.name.replace(/\s+/g, '_')}.csv`
      );
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download report:', err);
    }
  };

  // Determines the derived status of a sprint based on its start, end, and current dates
  const selectedSprintData = useMemo(() => {
    const sprint = (sprints || []).find((s) => s._id === selectedSprintId);
    if (!sprint) return null;
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const start = new Date(sprint.startDate);
    const startDate = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    ).getTime();
    const end = new Date(sprint.endDate);
    const endDate = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate()
    ).getTime();
    let derivedStatus = sprint.status || 'active';
    if (derivedStatus !== 'completed') {
      if (today < startDate) derivedStatus = 'upcoming';
      else if (today > endDate) derivedStatus = 'completed';
      else derivedStatus = 'active';
    }
    return { ...sprint, derivedStatus };
  }, [sprints, selectedSprintId]);

  const handleFinalize = async () => {
    setFinalizing(true);
    try {
      const summary = await getFinalSummary(selectedSprintId);
      setFinalSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setFinalizing(false);
    }
  };

  const submitSprint = (e) => {
    e.preventDefault();
    createSprint(sprintData, {
      onSuccess: () => setShowSprintForm(false),
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative font-sans">
      <SprintCreationModal
        show={showSprintForm}
        onClose={() => setShowSprintForm(false)}
        sprintData={sprintData}
        setSprintData={setSprintData}
        onSubmit={submitSprint}
        isLoading={createSprintLoading}
      />

      <SprintSummaryModal
        finalSummary={finalSummary}
        setFinalSummary={setFinalSummary}
      />

      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex-1">
          {canCreate && (
            <div className="flex items-center gap-4">
              {!showForm ? (
                <Button
                  onClick={() => setShowForm(true)}
                  variant="primary"
                  size="lg"
                  className="px-8 rounded-2xl uppercase tracking-widest text-xs"
                >
                  + Create Project
                </Button>
              ) : (
                <form
                  onSubmit={handleCreateProject}
                  className="flex items-center gap-3 w-full max-w-md animate-in fade-in slide-in-from-left-4"
                >
                  <Input
                    placeholder="Project Name..."
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    required
                    autoFocus
                    className="rounded-2xl"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="px-8 flex-shrink-0"
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="space-y-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full" />
              Tactical Management
            </h2>
            <p className="text-text-muted text-sm font-medium mt-1 opacity-70">
              Synchronize project cycles and monitor team velocity.
            </p>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 xl:pb-0">
            <div className="flex p-1.5 glass border border-white/10 rounded-2xl shrink-0">
              {(sprints || []).map((sprint) => (
                <button
                  key={sprint._id}
                  onClick={() => setSelectedSprintId(sprint._id)}
                  className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${
                    selectedSprintId === sprint._id
                      ? 'bg-primary/20 border border-primary/20 text-primary shadow-lg shadow-primary/10'
                      : 'text-text-muted/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {sprint.name}
                </button>
              ))}
              {canCreate && (
                <div className="flex items-center gap-2 border-l border-white/5 ml-2 pl-2">
                  <button
                    onClick={() => setShowSprintForm(true)}
                    className="w-10 h-10 text-text-muted/40 hover:text-primary transition-all flex items-center justify-center rounded-xl hover:bg-white/5"
                    title="Create New Sprint"
                  >
                    <span className="text-xl font-light">+</span>
                  </button>
                  {selectedSprintId && (
                    <Button
                      onClick={handleFinalize}
                      isLoading={finalizing}
                      variant="secondary"
                      size="sm"
                      className="px-5 rounded-xl uppercase tracking-widest text-[10px]"
                    >
                      Finalize
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <SprintDetailsCard
          sprint={selectedSprintData}
          metrics={sprintMetrics}
          stats={sprintStats}
          statsLoading={sprintStatsLoading}
          showWorkload={showWorkload}
          setShowWorkload={setShowWorkload}
          onDownload={handleDownload}
        />

        <ProjectStatusList
          projects={projects}
          selectedSprintId={selectedSprintId}
          quickTicketProject={quickTicketProject}
          setQuickTicketProject={setQuickTicketProject}
          quickTicketTitle={quickTicketTitle}
          setQuickTicketTitle={setQuickTicketTitle}
          createTicket={createTicket}
          createTicketLoading={createTicketLoading}
          handleLinkProject={handleLinkProject}
        />
      </div>
    </div>
  );
};

export default ProjectInfo;

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Users,
  Clock,
  AlertCircle,
  Plus,
  Activity,
  Zap,
} from 'lucide-react';
import VelocityIndicator from '../molecules/VelocityIndicator';
import ItemBreakdownHeader from '../molecules/ItemBreakdownHeader';
import TacticalCustomSelect from '../molecules/TacticalCustomSelect';

// Detailed sprint analytics card.
const SprintDetailsCard = ({
  sprint,
  metrics,
  stats,
  statsLoading,
  showWorkload,
  setShowWorkload,
  onDownload,
  sprints = [],
  onSprintChange,
  selectedSprintId,
  onAddSprint,
  onFinalize,
  finalizing,
  canCreate,
}) => {
  if (!sprint) return null;

  return (
    <div className="bg-card border border-border-subtle rounded-xl p-4 sm:p-5 relative overflow-hidden group">
      {/* Dynamic Background Telemetry */}

      {/* Header Overview - Tactical Orchestration */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 pb-6 border-b border-border-subtle relative z-20">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Dynamic Cycle Selector */}
            <div className="relative z-50 w-full lg:w-auto">
              <TacticalCustomSelect
                value={sprint._id}
                onChange={onSprintChange}
                options={sprints.map((s) => ({
                  label: s.name,
                  value: s._id,
                }))}
                displayValue={
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-text uppercase tracking-[0.2em] flex items-center gap-2">
                      <Clock size={12} className="text-primary" />
                      {sprint.name.toUpperCase()}
                    </span>
                    <span className="text-[8px] text-text-subtle font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Activity size={10} className="text-status-success/60" />
                      SPRINT STATUS: {sprint.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                }
              />
            </div>

            {/* Tactical Control Suite */}
            {canCreate && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onAddSprint}
                  className="w-9 h-9 flex items-center justify-center bg-background-elevated border border-border-subtle rounded hover:border-primary/50 text-text-subtle hover:text-primary transition-all active:scale-95"
                  title="Create New Sprint"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
                {sprint.status !== 'completed' && (
                  <button
                    onClick={onFinalize}
                    disabled={finalizing}
                    className="h-9 px-6 bg-background-elevated border border-status-success/30 text-status-success hover:bg-status-success hover:text-background-dark rounded text-[9px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
                  >
                    {finalizing ? 'PROCESSING...' : 'COMPLETE SPRINT'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Temporal Metrics Row */}
        <div className="flex flex-wrap items-center gap-6 lg:border-l lg:border-border-subtle lg:pl-6">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-text-subtle font-black uppercase tracking-[0.2em]">
              START DATE
            </span>
            <span className="text-[11px] font-black text-text uppercase tracking-tight">
              {new Date(sprint.startDate).toLocaleDateString(undefined, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border-subtle" />
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-text-subtle font-black uppercase tracking-[0.2em]">
              END DATE
            </span>
            <span className="text-[11px] font-black text-text uppercase tracking-tight">
              {new Date(sprint.endDate).toLocaleDateString(undefined, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border-subtle" />
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-text-subtle font-black uppercase tracking-[0.2em]">
              DURATION
            </span>
            <span className="text-[11px] font-black text-primary uppercase tracking-tight">
              {Math.max(
                1,
                Math.ceil(
                  (new Date(sprint.endDate) - new Date(sprint.startDate)) /
                    (1000 * 60 * 60 * 24)
                )
              )}{' '}
              DAYS
            </span>
          </div>
          {canCreate && (
            <button
              onClick={onDownload}
              className="ml-auto w-9 h-9 bg-background-elevated border border-border-subtle rounded hover:border-primary/50 text-primary transition-all flex items-center justify-center active:scale-95"
              title="Export Sprint Report"
            >
              <FileText className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Intelligence Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
        <div className="lg:col-span-4 bg-card border border-border-subtle rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
          <VelocityIndicator
            data={metrics.velocitySpark}
            statsLoading={statsLoading}
          />
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <ItemBreakdownHeader metrics={metrics} statsLoading={statsLoading} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <div className="bg-card border border-border-subtle rounded-lg p-4 group hover:border-primary/50 transition-all">
              <div className="text-[9px] font-black text-text-subtle uppercase tracking-[0.2em] mb-2 flex items-center justify-between">
                FLOW EFFICIENCY
                <Zap size={10} className="text-secondary" />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl font-black text-text">
                  {metrics.flowEfficiency || '0'}
                  <span className="text-[10px] text-text-subtle ml-1">%</span>
                </div>
                <div className="flex-1 h-1 bg-border-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary"
                    style={{ width: `${metrics.flowEfficiency || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border-subtle rounded-lg p-4 group hover:border-status-warning/50 transition-all">
              <div className="text-[9px] font-black text-text-subtle uppercase tracking-[0.2em] mb-2 flex items-center justify-between">
                BACKLOG TASKS
                <Clock size={10} className="text-status-warning" />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl font-black text-status-warning">
                  {metrics.strategicDebt || 0}
                </div>
                <div className="text-[9px] font-black text-text-subtle uppercase tracking-[0.2em]">
                  TASKS
                </div>
              </div>
            </div>

            <div className="bg-card border border-border-subtle rounded-lg p-4 group hover:border-status-info/50 transition-all">
              <div className="text-[9px] font-black text-text-subtle uppercase tracking-[0.2em] mb-2 flex items-center justify-between">
                BLOCKED TASKS
                <AlertCircle size={10} className="text-status-info" />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl font-black text-status-info">
                  {metrics.blockerDensity || 0}
                </div>
                <div className="text-[9px] font-black text-text-subtle uppercase tracking-[0.2em]">
                  BLOCKED
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workforce Saturation (Pulse) */}
      {canCreate && (
        <div className="mt-6 pt-6 border-t border-border-subtle relative z-10">
          <button
            onClick={() => setShowWorkload(!showWorkload)}
            className="flex justify-between items-center w-full px-4 py-2.5 bg-background-elevated border border-border-subtle rounded-lg hover:bg-background-elevated/80 transition-all select-none"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <Users size={14} className="text-text-subtle" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-subtle">
                TEAM WORKLOAD
              </span>
            </div>
            {showWorkload ? (
              <ChevronDown size={16} className="text-primary" />
            ) : (
              <ChevronRight size={16} className="text-text-subtler" />
            )}
          </button>

          {showWorkload && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {metrics.workload?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {metrics.workload.map((wp, idx) => (
                    <div
                      key={idx}
                      className="bg-card border border-border-subtle rounded-lg px-4 py-3 flex items-center gap-4 hover:border-primary/40 transition-all"
                    >
                      <div className="w-9 h-9 rounded bg-background-dark border border-border-subtle flex items-center justify-center text-[10px] font-black text-text transition-all uppercase">
                        {wp.name.charAt(0)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black text-text uppercase tracking-tight truncate">
                          {wp.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-text-subtle uppercase tracking-[0.1em]">
                            {wp.count} ACTIVE
                          </span>
                          <div
                            className={`w-1 h-1 rounded-full ${wp.count > 5 ? 'bg-status-error' : 'bg-status-success'}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-background-elevated border border-dashed border-border-subtle rounded-2xl flex flex-col items-center gap-4">
                  <Users size={40} className="text-text-subtler" />
                  <span className="text-[10px] font-black text-text-subtle uppercase tracking-[0.4em]">
                    No members assigned to this sprint
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SprintDetailsCard.propTypes = {
  sprint: PropTypes.object,
  metrics: PropTypes.object.isRequired,
  stats: PropTypes.object,
  statsLoading: PropTypes.bool,
  showWorkload: PropTypes.bool,
  setShowWorkload: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default SprintDetailsCard;

import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronRight, FileText, Download } from 'lucide-react';

// A card component that displays comprehensive metrics and stats for a specific sprint.
const SprintDetailsCard = ({
  sprint,
  metrics,
  stats,
  statsLoading,
  showWorkload,
  setShowWorkload,
  onDownload,
}) => {
  if (!sprint) return null;

  const metricCards = [
    {
      label: 'Completion Rate',
      value: metrics.completionRate,
      trend: stats?.trends?.completion || '+0%',
      color: 'text-status-success',
    },
    {
      label: 'Avg Task Flux',
      value: stats?.metrics?.avgTaskFlux || '0d',
      trend: stats?.trends?.flux || '0d',
      color: 'text-primary',
    },
    {
      label: 'Blocker Density',
      value: stats?.metrics?.blockerDensity || 'None',
      trend: stats?.trends?.blockers || 'Stable',
      color: 'text-status-info',
    },
    {
      label: 'Strategic Debt',
      value: stats?.metrics?.strategicDebt || '0%',
      trend: stats?.trends?.debt || '0%',
      color: 'text-status-warning',
    },
  ];

  const statusSteps = [
    { label: 'Open Tasks', count: metrics.open, color: 'text-status-error' },
    {
      label: 'In Progress',
      count: metrics.active,
      color: 'text-status-warning',
    },
    { label: 'In Review', count: metrics.review, color: 'text-secondary' },
    {
      label: 'Completed',
      count: metrics.completed,
      color: 'text-status-success',
    },
  ];

  return (
    <div className="bg-[#1E1E2E]/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6 items-center mb-6 pb-6 border-b border-white/5">
        <div className="col-span-12 md:col-span-5 flex items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 p-[1px] shadow-xl border border-white/10 flex items-center justify-center text-primary font-black text-xl">
            {sprint.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-white font-black truncate text-lg tracking-tight">
              {sprint.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                ID: {sprint._id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-6 md:col-span-3 flex flex-col justify-center">
          <span className="text-sm font-bold text-white/90">
            {new Date(sprint.startDate).toLocaleDateString(undefined, {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-0.5 opacity-60">
            Start Date
          </span>
        </div>

        <div className="col-span-6 md:col-span-2 flex flex-col justify-center">
          <span className="text-sm font-bold text-white/90">
            {Math.max(
              1,
              Math.ceil(
                (new Date(sprint.endDate) - new Date(sprint.startDate)) /
                  (1000 * 60 * 60 * 24)
              )
            )}{' '}
            Days
          </span>
          <span className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-0.5 opacity-60">
            Duration
          </span>
        </div>

        <div className="col-span-12 md:col-span-2 flex items-center justify-end">
          <span
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
              sprint.derivedStatus === 'active'
                ? 'bg-status-success/10 text-status-success border-status-success/20 shadow-status-success/10'
                : sprint.derivedStatus === 'completed'
                  ? 'bg-primary/10 text-primary border-primary/20 shadow-primary/10'
                  : 'bg-white/5 text-text-muted border-white/10 shadow-white/5'
            }`}
          >
            {sprint.derivedStatus?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-white/20 hover:bg-white/[0.05] transition-all group"
          >
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.1em] mb-3 opacity-70 group-hover:opacity-100 transition-opacity">
              {metric.label}
            </div>
            <div className="flex items-end justify-between">
              <div
                className={`text-3xl font-black tracking-tight ${metric.color} ${statsLoading ? 'animate-pulse opacity-50' : ''}`}
              >
                {metric.value}
              </div>
              <div className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded text-white/40 group-hover:text-white/60 transition-colors border border-white/5">
                {metric.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-60 group-hover:opacity-100 transition-opacity">
                    {step.label}
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className={`text-xl font-black ${step.color}`}>
                      {step.count}
                    </span>
                    <span className="text-[9px] font-bold text-text-muted/40 uppercase tracking-tighter">
                      Units
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-10 w-1 bg-current rounded-full opacity-5"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
        <h4
          onClick={() => setShowWorkload(!showWorkload)}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/60 flex items-center gap-2 cursor-pointer hover:text-white transition-colors select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Tactical Capabilities & Pulse
          {showWorkload ? (
            <ChevronDown className="w-3 h-3 ml-1" />
          ) : (
            <ChevronRight className="w-3 h-3 ml-1" />
          )}
        </h4>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all group"
        >
          <FileText className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Download Report
          </span>
          <Download className="w-3 h-3 text-text-muted" />
        </button>
      </div>

      {showWorkload && stats?.metrics?.workload?.length > 0 && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.metrics.workload.map((wp, idx) => (
              <div
                key={idx}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white/[0.06] transition-all hover:-translate-y-0.5 shadow-sm group"
              >
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[11px] font-black text-primary border border-primary/20 uppercase tracking-tighter">
                  {wp.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-white/80 group-hover:text-white transition-colors">
                    {wp.name}
                  </span>
                  <span className="text-[9px] font-bold text-text-muted/40 group-hover:text-text-muted/60 transition-colors uppercase tracking-widest leading-none mt-0.5">
                    {wp.count} Tasks
                  </span>
                </div>
              </div>
            ))}
          </div>
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

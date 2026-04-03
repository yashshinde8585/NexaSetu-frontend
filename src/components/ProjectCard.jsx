import React from 'react';
import { Link } from 'react-router-dom';
import Card from './atoms/Card';

// A card component that displays project metrics, health, and execution progress.
const ProjectCard = ({ project }) => {
  const {
    _id,
    name,
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    aiGeneratedTasks,
    percentage,
    healthScore,
    healthLabel,
    riskLevel,
  } = project;

  // Health Score Style Logic
  let healthUI = {
    color: 'text-status-success',
    bg: 'bg-status-success/10',
    border: 'border-status-success/20',
    glow: 'bg-status-success',
  };

  if (healthScore < 50) {
    healthUI = {
      color: 'text-status-error',
      bg: 'bg-status-error/10',
      border: 'border-status-error/20',
      glow: 'bg-status-error',
    };
  } else if (healthScore < 80) {
    healthUI = {
      color: 'text-status-warning',
      bg: 'bg-status-warning/10',
      border: 'border-status-warning/20',
      glow: 'bg-status-warning',
    };
  }

  // Risk UI Logic
  const riskUI =
    {
      High: 'bg-status-error/20 text-status-error border-status-error/30',
      Medium:
        'bg-status-warning/20 text-status-warning border-status-warning/30',
      Low: 'bg-status-success/20 text-status-success border-status-success/30',
    }[riskLevel] || 'bg-white/10 text-text-muted border-white/10';

  // Progress Bar Color Logic (separate from health score if needed, but keeping consistent)
  const progressColorClass =
    healthScore >= 80
      ? 'bg-status-success'
      : healthScore >= 50
        ? 'bg-status-warning'
        : 'bg-status-error';

  return (
    <Card
      as={Link}
      to={`/project/${_id}`}
      variant="default"
      padding="md"
      className="group"
    >
      {/* Background Glow based on health */}
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${healthUI.glow}`}
      ></div>

      <div
        className={`flex justify-between items-start ${project.variant === 'strategic' ? 'mb-8' : 'mb-6'}`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${healthUI.glow}`}
            ></div>
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${healthUI.color}`}
            >
              {healthLabel}
            </p>
            <span
              className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter border ${riskUI}`}
            >
              {riskLevel} Risk
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 truncate max-w-[180px]">
            {name.replace(/👋 Welcome to/g, '').trim() || name}
          </h3>
        </div>

        {/* Health Score Badge */}
        <div
          className={`flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border ${healthUI.border} ${healthUI.bg} backdrop-blur-md`}
        >
          <span className={`text-lg sm:text-xl font-black ${healthUI.color}`}>
            {healthScore}
          </span>
          <span className="text-[7px] font-bold uppercase opacity-60">
            Health
          </span>
        </div>
      </div>

      {project.variant !== 'strategic' && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/5">
            <p className="text-[9px] sm:text-[10px] text-text-muted uppercase font-bold mb-1">
              Total Tasks
            </p>
            <p className="text-lg sm:text-xl font-black text-white">
              {totalTasks}
            </p>
          </div>
          <div className="bg-white/5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/5">
            <p className="text-[9px] sm:text-[10px] text-text-muted uppercase font-bold mb-1">
              Completed
            </p>
            <p className="text-lg sm:text-xl font-black text-status-success">
              {completedTasks}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Progress Bar Container */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase">
              Execution Progress
            </span>
            <span className={`text-[10px] font-bold ${healthUI.color}`}>
              {percentage}%
            </span>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 p-[2px]">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out relative ${progressColorClass}`}
              style={{ width: `${percentage}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Status Pills */}
        {project.variant !== 'strategic' && (
          <div className="flex flex-wrap gap-2 pt-2">
            {inProgressTasks > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-status-warning/10 text-status-warning text-[9px] font-bold uppercase border border-status-warning/20">
                {inProgressTasks} In Progress
              </span>
            )}
            {pendingTasks > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-status-info/10 text-status-info text-[9px] font-bold uppercase border border-status-info/20">
                {pendingTasks} To Do
              </span>
            )}
            {aiGeneratedTasks > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-[9px] font-bold uppercase border border-secondary/20">
                {aiGeneratedTasks} AI Assisted
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Arrow */}
      <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </Card>
  );
};

export default ProjectCard;

import React from 'react';

/**
 * Visual representation of a pipeline stage with progress tracking.
 */
const PipelineStep = ({ label, value, progress, color, isWarning }) => (
  <div className="flex flex-col gap-2 group/step">
    <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-[0.2em]">
      <span className={isWarning ? 'text-status-warning flex items-center gap-2' : 'text-white/40 group-hover/step:text-white/60 transition-colors'}>
        {label} 
        {isWarning && (
          <span className="w-1.5 h-1.5 bg-status-warning animate-pulse" />
        )}
      </span>
      <span className="text-white">{value}</span>
    </div>
    <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden border border-white/5">
      <div 
        className={`h-full ${color} transition-all duration-500 ease-out rounded-none`} 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default PipelineStep;


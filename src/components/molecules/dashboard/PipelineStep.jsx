import React from 'react';

const PipelineStep = ({ label, value, progress, color, isWarning }) => (
  <div className="relative group/step">
    <div className="flex justify-between text-[11px] uppercase mb-1.5 font-bold tracking-tight">
      <span className={isWarning ? 'text-amber-500 flex items-center gap-1' : 'text-slate-400'}>
        {label} {isWarning && <span title="Potential bottleneck detected">⚠</span>}
      </span>
      <span className="text-slate-200">{value}</span>
    </div>
    <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden border border-white/[0.02]">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out`} 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default PipelineStep;

import React from 'react';

const PipelineStep = ({ label, value, progress, color, isWarning }) => (
  <div className="relative group/step">
    <div className="flex justify-between text-[11px] uppercase mb-1.5 font-black tracking-widest">
      <span className={isWarning ? 'text-status-warning flex items-center gap-1' : 'text-white/60'}>
        {label} {isWarning && <span title="Potential bottleneck detected">⚠</span>}
      </span>
      <span className="text-white">{value}</span>
    </div>
    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-white/20">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out`} 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default PipelineStep;

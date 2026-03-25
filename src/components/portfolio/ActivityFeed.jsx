import React from 'react';

const ActivityFeed = ({ logs }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
         <span className="p-2 bg-status-info/20 rounded-lg text-status-info text-xl">🛰️</span>
         <h2 className="text-sm font-black uppercase tracking-[0.2em] text-status-info">AI Activity & History</h2>
      </div>
      
      <div className="bg-background-dark/30 border border-white/5 rounded-[3rem] p-8 overflow-hidden">
         <div className="flex flex-col gap-4">
           {logs.length === 0 ? (
             <div className="py-20 text-center opacity-30 italic font-medium">No system actions recorded yet.</div>
           ) : (
             logs.map((log, idx) => (
               <div key={idx} className="flex flex-col md:flex-row gap-6 items-start p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-3xl border border-white/[0.03]">
                 <div className={`p-3 rounded-2xl text-lg shrink-0 border border-white/5 ${
                   log.eventType === 'TASK_DELAYED' ? 'bg-status-error/10 text-status-error' :
                   log.eventType === 'USER_OVERLOADED' ? 'bg-status-warning/10 text-status-warning' :
                   log.eventType === 'TASK_CREATED' ? 'bg-status-success/10 text-status-success' :
                   'bg-primary/10 text-primary'
                 }`}>
                   {log.eventType === 'TASK_DELAYED' ? '⏱️' :
                    log.eventType === 'USER_OVERLOADED' ? '⚠️' :
                    log.eventType === 'TASK_CREATED' ? '📝' : '⚡'}
                 </div>
                 <div className="flex-1 space-y-1">
                   <div className="flex justify-between items-center scale-95 origin-left">
                     <span className="text-[10px] uppercase font-black tracking-widest text-text-muted">{log.agent} Agent · {log.project?.name || 'Global'}</span>
                     <span className="text-[10px] text-text-disabled font-bold">{new Date(log.timestamp).toLocaleTimeString()}</span>
                   </div>
                   <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                     Decision: {log.decision}
                   </h4>
                   <div className="flex items-center gap-4 py-1">
                     <div className="bg-gradient-to-r from-black/40 to-black/20 px-3 py-1.5 rounded-xl border border-white/5 text-[11px] font-medium text-white/80">
                       <span className="text-[9px] uppercase font-black tracking-tighter text-primary mr-3 bg-primary/10 px-1.5 py-0.5 rounded leading-none">Action</span>
                       {log.actionTaken}
                     </div>
                   </div>
                   <p className="text-xs text-text-muted italic leading-relaxed pt-1">Reasoning: “{log.reason}”</p>
                 </div>
               </div>
             ))
           )}
         </div>
      </div>
    </div>
  );
};

export default ActivityFeed;

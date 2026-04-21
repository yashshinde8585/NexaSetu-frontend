import React, { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, Sparkles, AlertCircle, ChevronDown, ListChecks, ArrowRight } from 'lucide-react';
import LazyMarkdown from '../atoms/LazyMarkdown';
import epiService from '../../api/epiService';

const TaskEPIExplanation = ({ taskId, isExpanded, onLoadingChange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpData, setHelpData] = useState(null);
  const [error, setError] = useState(null);

  const fetchExplanation = async () => {
    setLoading(true);
    if (onLoadingChange) onLoadingChange(true);
    setError(null);
    try {
      const epiData = await epiService.getTaskEPI(taskId);
      setData(epiData);
    } catch (err) {
      console.error('Failed to fetch task EPI:', err);
      setError('Intelligence offline');
    } finally {
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  };

  const fetchImplementationHelp = async () => {
    setHelpLoading(true);
    try {
        const response = await epiService.getTaskHelp(taskId);
        setHelpData(response.implementationPlan);
    } catch (err) {
        console.error('Failed to fetch implementation help:', err);
    } finally {
        setHelpLoading(false);
    }
  };

  useEffect(() => {
    if (taskId && isExpanded && !data) {
      fetchExplanation();
    }
  }, [taskId, isExpanded]);

  return (
    <div className="mt-6">
      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0 animate-[fadeIn_500ms_cubic-bezier(0.4,0,0.2,1)_forwards,slideInFromBottom_500ms_cubic-bezier(0.4,0,0.2,1)_forwards]">
           <div className="h-px w-full bg-white/20 mb-6" />
           
           {loading ? (
             <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-[30px]" />
                   <Loader2 size={32} className="text-primary animate-spin relative" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">ANALYZING SIGNALS...</p>
             </div>
           ) : error ? (
             <div className="flex flex-col items-center justify-center py-12 gap-3 text-status-error/80 italic">
                <AlertCircle size={24} />
                <p className="text-xs font-black uppercase tracking-widest">{error}</p>
             </div>
           ) : data && (
             <div className="bg-black border border-white/20 rounded-[2rem] overflow-hidden">
                {/* Intelligence Insights */}
                <div className="p-10 relative">
                   <div className="flex-1 min-w-0">
                      {/* Analysis */}
                      <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-6 flex items-center gap-2">
                        <Sparkles size={12} className="text-primary animate-pulse" />
                        INTELLIGENCE INSIGHT
                      </h5>
                          <div className="nexa-prose">
                             <LazyMarkdown>{data.explanation}</LazyMarkdown>
                          </div>
 
                      {/* Tactical Strategy */}
                      {!helpData && !helpLoading && (
                         <button 
                           onClick={fetchImplementationHelp}
                           className="group/help flex items-center gap-3 px-8 py-4 rounded-2xl bg-black border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all outline-none"
                         >
                            <ListChecks size={16} className="text-white/60 group-hover/help:text-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 group-hover/help:text-white transition-colors">REQUEST IMPLEMENTATION STRATEGY</span>
                            <ArrowRight size={14} className="text-white/30 group-hover/help:translate-x-1 group-hover/help:text-primary transition-all" />
                         </button>
                      )}
 
                      {helpLoading && (
                         <div className="flex items-center gap-3 py-6 animate-pulse">
                            <Loader2 size={20} className="text-primary animate-spin" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60">ARCHITECTING SOLUTIONS...</span>
                         </div>
                      )}
 
                      {helpData && (
                         <div className="animate-[fadeIn_1000ms_ease_forwards,slideInFromTop_1000ms_ease_forwards]">
                             {/* Divider */}
                             <div className="h-px w-full bg-linear-to-r from-white/20 via-white/10 to-transparent mb-10" />
                             
                             <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-6 flex items-center gap-2">
                               <ListChecks size={14} className="text-secondary" />
                               TACTICAL IMPLEMENTATION STRATEGY
                             </h5>
                             <div className="nexa-prose">
                                <LazyMarkdown>{helpData}</LazyMarkdown>
                             </div>
                         </div>
                      )}
                   </div>
                </div>
             </div>
           )}
         </div>
      )}
    </div>
  );
};

export default TaskEPIExplanation;

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, Sparkles, AlertCircle, ChevronDown, ListChecks, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import epiService from '../../api/epiService';

const TaskEPIExplanation = ({ taskId, isExpanded }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpData, setHelpData] = useState(null);
  const [error, setError] = useState(null);

  const fetchExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const epiData = await epiService.getTaskEPI(taskId);
      setData(epiData);
    } catch (err) {
      console.error('Failed to fetch task EPI:', err);
      setError('Intelligence offline');
    } finally {
      setLoading(false);
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
        <div className="p-4 pt-0 animate-in slide-in-from-bottom-4 duration-500">
           <div className="h-px w-full bg-white/5 mb-6" />
           
           {loading ? (
             <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full animate-pulse" />
                   <Loader2 size={32} className="text-primary animate-spin relative" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Analyzing Signals...</p>
             </div>
           ) : error ? (
             <div className="flex flex-col items-center justify-center py-12 gap-3 text-status-error/40 italic">
                <AlertCircle size={24} />
                <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
             </div>
           ) : data && (
             <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-2xl">
                {/* Intelligence Insights */}
                <div className="p-10 relative">
                   <div className="flex-1 min-w-0">
                      {/* Analysis */}
                      <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center gap-2">
                        <Sparkles size={12} className="text-primary animate-pulse" />
                        Intelligence Insight
                      </h5>
                      <div className="prose-epi text-lg font-medium text-white/75 leading-relaxed mb-10 max-w-none">
                         <ReactMarkdown>{data.explanation}</ReactMarkdown>
                      </div>

                      {/* Tactical Strategy */}
                      {!helpData && !helpLoading && (
                         <button 
                           onClick={fetchImplementationHelp}
                           className="group/help flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all outline-none"
                         >
                            <ListChecks size={16} className="text-white/30 group-hover/help:text-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover/help:text-white transition-colors">Request Implementation Strategy</span>
                            <ArrowRight size={14} className="text-white/10 group-hover/help:translate-x-1 group-hover/help:text-primary transition-all" />
                         </button>
                      )}

                      {helpLoading && (
                         <div className="flex items-center gap-3 py-6 animate-pulse">
                            <Loader2 size={20} className="text-primary animate-spin" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20">Architecting Solutions...</span>
                         </div>
                      )}

                      {helpData && (
                         <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
                            {/* Divider */}
                            <div className="h-px w-full bg-linear-to-r from-white/10 via-white/5 to-transparent mb-10" />
                            
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60 mb-6 flex items-center gap-2">
                              <ListChecks size={14} className="text-secondary" />
                              Tactical Implementation Strategy
                            </h5>
                            <div className="prose-epi text-base font-medium text-white/70 leading-relaxed max-w-none">
                               <ReactMarkdown>{helpData}</ReactMarkdown>
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

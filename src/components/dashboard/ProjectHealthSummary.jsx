import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, AlertCircle, CheckCircle2, ChevronRight, BrainCircuit, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import epiService from '../../api/epiService';
import StakeholderReportModal from './StakeholderReportModal';

/**
 * Project Health Summary
 */
const ProjectHealthSummary = ({ sprintId, manualTrigger = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(!manualTrigger);

  useEffect(() => {
    if (!sprintId || !hasInitialized) return;

    const fetchEPI = async () => {
      setLoading(true);
      setError(null);
      try {
        const epiData = await epiService.getSprintEPI(sprintId);
        setData(epiData);
      } catch (err) {
        console.error('Failed to fetch EPI data:', err);
        setError('Intelligence engine unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchEPI();
  }, [sprintId, hasInitialized]);

  const refreshEPI = async () => {
    setLoading(true);
    try {
      const epiData = await epiService.getSprintEPI(sprintId);
      setData(epiData);
    } catch (err) {
      console.error('Failed to refresh EPI data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!sprintId) return null;

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-status-success border-status-success/20 bg-status-success/5';
    if (score >= 50) return 'text-status-warning border-status-warning/20 bg-status-warning/5';
    return 'text-status-error border-status-error/20 bg-status-error/5';
  };

  return (
    <div className="relative group overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl transition-all hover:border-primary/20">
      <div className="relative p-6 sm:p-7 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
        
        {/* Health Indicator */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${data ? getHealthColor(data.metrics.healthScore) : 'border-white/10 text-white/20'}`}>
                {loading ? (
                    <div className="animate-spin text-primary">
                        <BrainCircuit size={40} />
                    </div>
                ) : data ? (
                    <div className="text-center">
                        <span className="text-2xl font-black">{Math.round(data.metrics.healthScore)}</span>
                        <span className="text-[10px] block font-black uppercase tracking-tighter">Health</span>
                    </div>
                ) : (
                    <Sparkles size={32} className="opacity-20" />
                )}
                
                {/* At-risk Pulse */}
                {data && data.metrics.healthScore < 50 && (
                    <div className="absolute inset-0 rounded-full border-4 border-status-error animate-ping opacity-20" />
                )}
            </div>
            
            {data && (
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getHealthColor(data.metrics.healthScore)}`}>
                    {data.metrics.behindSchedule ? 'Behind Schedule' : 'On Track'}
                </div>
            )}
        </div>

        {/* Intelligence Narrative */}
        <div className="flex-grow space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <BrainCircuit size={18} className="animate-pulse" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Explainable Intelligence</h3>
          </div>

          <div className="relative min-h-[60px]">
            {loading ? (
                <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
                </div>
            ) : error ? (
                <p className="text-sm text-status-error/60 italic flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                </p>
            ) : data ? (
                <div className="prose-epi text-base sm:text-lg font-medium text-white/80 leading-relaxed">
                    <ReactMarkdown>{data.narrative}</ReactMarkdown>
                </div>
            ) : manualTrigger && !hasInitialized ? (
                <div className="flex flex-col items-start gap-4">
                    <p className="text-sm text-white/40 italic">Ready to analyze project signals and generate intelligence narratives.</p>
                    <button 
                        onClick={() => setHasInitialized(true)}
                        className="px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95 flex items-center gap-2 group"
                    >
                         <BrainCircuit size={14} className="group-hover:animate-pulse" /> Initialize Intelligence Engine
                    </button>
                </div>
            ) : (
                <p className="text-sm text-white/20 italic">Select a sprint to initialize EPI analysis...</p>
            )}
          </div>

          {/* Metrics Bar */}
          {data && (
            <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2">
                    <Activity size={14} className="text-white/40" />
                    <span className="text-[11px] font-medium text-white/40">Completion: <span className="text-white font-bold">{Math.round(data.metrics.completionPercentage)}%</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <AlertCircle size={14} className={`${data.criticalBlockers.length > 0 ? 'text-status-error' : 'text-white/40'}`} />
                    <span className="text-[11px] font-medium text-white/40">Blockers: <span className={`${data.criticalBlockers.length > 0 ? 'text-status-error font-bold' : 'text-white'}`}>{data.criticalBlockers.length}</span></span>
                </div>
            </div>
          )}

        </div>

        {/* Actions Selection */}
        {data && data.suggestedActions?.length > 0 && (
            <div className="flex-shrink-0 w-full lg:w-96 space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Suggested Tactical Actions</h4>
                    <button 
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 group/report"
                    >
                        <FileText size={12} className="group-hover/report:animate-bounce" /> Generate Briefing
                    </button>
                </div>
                {data.suggestedActions.map((action, idx) => (
                    <ActionItem key={idx} action={action} sprintId={sprintId} onExecuted={refreshEPI} />
                ))}
            </div>
        )}

        <StakeholderReportModal 
            isOpen={isReportModalOpen} 
            onClose={() => setIsReportModalOpen(false)} 
            sprintId={sprintId} 
        />
      </div>
    </div>
  );
};

const ActionItem = ({ action, sprintId, onExecuted }) => {
    const [executing, setExecuting] = useState(false);
    const [done, setDone] = useState(false);

    const handleExecute = async () => {
        setExecuting(true);
        try {
            await epiService.executeEPIAction(action.type, action.metadata);
            setDone(true);
            if (onExecuted) onExecuted();
        } catch (err) {
            console.error('Action failed:', err);
        } finally {
            setExecuting(false);
        }
    };

    if (done) return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-status-success/10 border border-status-success/20 text-status-success animate-in fade-in slide-in-from-right-2">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Tactical Action Deployed</span>
        </div>
    );

    return (
        <div className="group/action p-4 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-primary/40 transition-all flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                   <div className={`w-1 h-1 rounded-full ${action.impact === 'high' ? 'bg-status-error animate-pulse' : 'bg-primary'}`} />
                   <span className="text-[11px] font-bold text-white truncate group-hover/action:text-primary transition-colors">{action.title}</span>
                </div>
                <p className="text-[9px] text-white/40 leading-relaxed line-clamp-1">{action.description}</p>
            </div>
            <button 
                onClick={handleExecute}
                disabled={executing}
                className={`flex-shrink-0 p-2 rounded-xl border transition-all ${executing ? 'bg-primary/50 cursor-wait' : 'bg-primary/20 border-primary/40 hover:bg-primary text-white hover:border-primary active:scale-95'}`}
            >
                {executing ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
            </button>
        </div>
    );
};

const Loader2 = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default ProjectHealthSummary;

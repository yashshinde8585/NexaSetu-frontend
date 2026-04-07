import React, { useState, useEffect } from 'react';
import { X, FileText, Send, Copy, Check, Users, Code, Building, Loader2, Sparkles } from 'lucide-react';
import epiService from '../../api/epiService';

const StakeholderReportModal = ({ isOpen, onClose, sprintId }) => {
  const [reportType, setReportType] = useState('EXECUTIVE');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const reportTypes = [
    { id: 'EXECUTIVE', label: 'Executive Summary', icon: <Building size={16} />, desc: 'Business value & delivery risks' },
    { id: 'TECHNICAL', label: 'Technical Health', icon: <Code size={16} />, desc: 'Velocity & engineering blockers' },
    { id: 'CLIENT', label: 'Client Briefing', icon: <Users size={16} />, desc: 'Accomplishments & roadmap alignment' },
  ];

  const fetchReport = async (type) => {
    setLoading(true);
    setReportData(null);
    try {
      const data = await epiService.getNarrativeReport(sprintId, type);
      setReportData(data);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && sprintId) {
      fetchReport(reportType);
    }
  }, [isOpen, reportType, sprintId]);

  const handleCopy = () => {
    if (reportData?.content) {
      navigator.clipboard.writeText(reportData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0D0E15] border border-white/10 w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight leading-none mb-1">AI Stakeholder Briefing</h2>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Explainable Intelligence Generation</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Report Selection */}
          <div className="w-full lg:w-72 border-r border-white/5 p-6 space-y-3 bg-black/20">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-4 px-2">Report Profile</h4>
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex flex-col gap-1 ${
                  reportType === type.id 
                    ? 'bg-primary/10 border-primary/40 text-primary' 
                    : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {type.icon}
                  <span className="text-xs font-black uppercase tracking-wider">{type.label}</span>
                </div>
                <p className="text-[9px] opacity-60 leading-relaxed font-medium">{type.desc}</p>
              </button>
            ))}
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-white/[0.01] relative flex flex-col min-h-0">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
                  <Loader2 size={48} className="text-primary animate-spin relative" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white tracking-widest uppercase mb-2">Architecting Narrative</p>
                  <p className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em]">Aggregating signals for {reportType} profile...</p>
                </div>
              </div>
            ) : reportData ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                
                {/* Stats Bar */}
                <div className="flex flex-wrap gap-4 items-center justify-between border-b border-white/5 pb-6">
                   <div className="flex items-center gap-3">
                      <Sparkles size={14} className="text-primary" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/60 italic">AI Generated Briefing</span>
                   </div>
                   <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">
                      <span>Sprint: {reportData.sprint}</span>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <span>{new Date(reportData.generatedAt).toLocaleDateString()}</span>
                   </div>
                </div>

                {/* Content View */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-inner overflow-hidden relative">
                   <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                   <div className="prose prose-invert prose-sm max-w-none text-white/80 leading-relaxed font-medium whitespace-pre-wrap selection:bg-primary/30">
                      {reportData.content}
                   </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                   <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Tasks Analyzed</span>
                         <span className="text-sm font-black text-white">{reportData.summary.total}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-status-success/40 uppercase tracking-widest">Completed</span>
                         <span className="text-sm font-black text-status-success">{reportData.summary.done}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-bold text-status-error/40 uppercase tracking-widest">At Risk</span>
                         <span className="text-sm font-black text-status-error">{reportData.summary.delayed}</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-[11px] font-black uppercase tracking-wider hover:bg-white/10 hover:border-primary/40 transition-all active:scale-95"
                      >
                        {copied ? <Check size={14} className="text-status-success" /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy Text'}
                      </button>
                      <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-wider hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 active:scale-95">
                        <Send size={14} /> Send Briefing
                      </button>
                   </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                <FileText size={64} />
                <p className="mt-4 text-sm font-bold uppercase tracking-widest">Report Engine Offline</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderReportModal;

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertCircle, 
  Calendar, 
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import MetricsService from '../api/metricsService';

const SetupSkeleton = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
  </div>
);

const ProjectSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleCreateProject, isLoading } = useDashboard(user);
  
  const [mission, setMission] = useState({
    name: '',
    type: 'Product Development',
    objective: '',
    teams: ['Backend', 'Frontend'],
    priority: 'Medium',
    timeline: {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const onInitialize = async (e, isDraft = false) => {
    if (e) e.preventDefault();
    if (!mission.name.trim()) {
      setSubmitError('Enter a project name to continue.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const result = await handleCreateProject({
        ...mission,
        status: isDraft ? 'draft' : 'active'
      });
      
      MetricsService.trackProjectCreated(result?._id, mission.name);
      
      navigate('/project-info');
    } catch (error) {
      console.error('Failed to create project:', error);
      const message = error?.message || 'Unable to create project. Please check your connection and try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTeam = (team) => {
    setMission(prev => ({
      ...prev,
      teams: prev.teams.includes(team) 
        ? prev.teams.filter(t => t !== team)
        : [...prev.teams, team]
    }));
  };

  if (isLoading) return <SetupSkeleton />;

  return (
    <div className="min-h-screen bg-black text-white px-3 sm:px-4 lg:px-6 py-4">
      <div className="w-full space-y-6 max-w-7xl mx-auto">
        
        {/* Simplified Header */}
        <header className="border-b border-white/10 pb-6">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase leading-none">
                CREATE NEW PROJECT
            </h1>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
              CONFIGURE YOUR WORKSPACE AND START COLLABORATING.
            </p>
          </div>
        </header>

        {/* Main Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
          
          {/* Header/Summary for Mobile - Always Visible */}
          <div className="lg:hidden">
            <MobileSummary mission={mission} />
          </div>

          {/* Left: Setup Panel */}
          <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1 space-y-6">
            <div className="bg-white/5 border border-white/10 p-5 sm:p-6 rounded-xl relative overflow-hidden group hover:border-white/20 transition-colors">
              
              {submitError && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-status-error/5 border border-status-error/30 rounded-xl flex items-start gap-3 sm:gap-4 animate-in slide-in-from-top-4">
                  <AlertCircle className="text-status-error mt-0.5" size={18} />
                  <p className="text-[10px] text-white/70 font-black uppercase tracking-widest leading-relaxed">{submitError}</p>
                </div>
              )}
              
              <form className="space-y-10 sm:space-y-12">
                {/* Section 1: Identity */}
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <FileText size={14} className="text-primary" />
                    <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">PROJECT DETAILS</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">PROJECT NAME</label>
                      <input 
                        placeholder="E.G., CLIENT PORTAL" 
                        value={mission.name}
                        onChange={(e) => setMission({...mission, name: e.target.value})}
                        className="w-full h-9 bg-black/40 border border-white/10 px-4 rounded text-white font-black text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">PROJECT TYPE</label>
                      <select 
                        value={mission.type}
                        onChange={(e) => setMission({...mission, type: e.target.value})}
                        className="w-full h-9 bg-black/40 border border-white/10 px-3 rounded text-white font-black text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="Product Development">Product Development</option>
                        <option value="Internal Tool">Internal Tool</option>
                        <option value="Client Project">Client Project</option>
                        <option value="Research / POC">Research / POC</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">DESCRIPTION</label>
                    <textarea 
                      placeholder="DESCRIBE THE KEY GOALS AND DELIVERABLES..." 
                      rows={2}
                      value={mission.objective}
                      onChange={(e) => setMission({...mission, objective: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 p-4 rounded text-white font-black text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary transition-all resize-none placeholder:text-white/10"
                    />
                  </div>
                </div>

                {/* Section 2: Composition */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Users size={14} className="text-secondary" />
                    <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">TEAM ASSIGNMENT</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {['Backend', 'Frontend', 'QA', 'DevOps', 'UI/UX', 'Hardware'].map(team => (
                      <button
                        key={team}
                        type="button"
                        onClick={() => toggleTeam(team)}
                        className={`px-4 py-2 rounded border text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                          mission.teams.includes(team)
                            ? 'bg-white text-black border-white'
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Logistics */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Calendar size={14} className="text-status-success" />
                    <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">TIMELINE & SCHEDULE</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">START DATE</label>
                      <input 
                        type="date"
                        value={mission.timeline.start}
                        onChange={(e) => setMission({...mission, timeline: {...mission.timeline, start: e.target.value}})}
                        className="w-full h-9 bg-black/40 border border-white/10 px-3 rounded text-white font-black text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary transition-all [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">END DATE</label>
                      <input 
                        type="date"
                        value={mission.timeline.end}
                        onChange={(e) => setMission({...mission, timeline: {...mission.timeline, end: e.target.value}})}
                        className="w-full h-9 bg-black/40 border border-white/10 px-3 rounded text-white font-black text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button 
                      type="button" 
                      onClick={(e) => onInitialize(e)}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto h-9 px-8 bg-primary text-black hover:bg-primary/90 rounded text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      CREATE PROJECT
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => onInitialize(e, true)}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto h-9 px-6 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] transition-all rounded"
                    >
                      SAVE AS DRAFT
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="text-[9px] font-black text-white/20 hover:text-white uppercase tracking-[0.2em] transition-colors py-2"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Live Preview (Hidden on Mobile, replaced by Summary) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-2">PROJECT PREVIEW</h2>
              
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
                <div className="p-6 space-y-6 relative z-10">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start">
                    <div className="px-2.5 py-1 bg-white/5 rounded border border-white/10">
                       <p className="text-[8px] font-black tracking-[0.2em] uppercase text-white/30">STATUS: PENDING</p>
                    </div>
                  </div>

                  {/* Project Name & Objective */}
                  <div className="space-y-2">
                    <h2 className={`font-black uppercase tracking-tight break-words transition-all duration-500 ${mission.name ? 'text-xl text-white' : 'text-lg text-white/10'}`}>
                        {mission.name || 'PROJECT_NAME'}
                    </h2>
                    <div className="w-8 h-1 bg-primary/40" />
                    <p className={`text-[9px] leading-relaxed uppercase tracking-[0.1em] transition-all duration-300 ${mission.objective ? 'text-white/40' : 'text-white/5'}`}>
                      {mission.objective || 'Your project description will appear here...'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.1em]">TYPE</p>
                       <p className="text-[9px] font-black text-white uppercase tracking-wider">{mission.type}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.1em]">TIMELINE</p>
                       <div className="flex items-center gap-2 text-white">
                         <Calendar size={10} className="text-secondary" />
                         <p className="text-[9px] font-black uppercase tracking-wider">
                           {mission.timeline.start || 'TBD'} — {mission.timeline.end || 'TBD'}
                         </p>
                       </div>
                    </div>
                  </div>

                  {/* Team Reveal */}
                  <div className="space-y-3">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.1em]">ASSIGNED TEAMS</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mission.teams.length > 0 ? mission.teams.map(team => (
                        <span key={team} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-black text-white/50 uppercase tracking-[0.1em]">
                          {team}
                        </span>
                      )) : (
                        <div className="w-full py-3 border border-dashed border-white/5 rounded flex items-center justify-center">
                           <span className="text-[8px] text-white/10 font-black uppercase tracking-widest">AWAITING TEAM SELECTION</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ID / Metadata */}
                  <div className="pt-4 border-t border-white/10 flex justify-end items-center opacity-20">
                     <span className="text-[9px] font-black text-white tracking-[0.1em]">ID: NEXA-{mission.name ? mission.name.substring(0, 4) : '####'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  );
};

/* Mobile-Specific Summary Component */
const MobileSummary = ({ mission }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4 animate-in slide-in-from-top-2 relative overflow-hidden">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h2 className={`font-black uppercase tracking-tight leading-none ${mission.name ? 'text-lg text-white' : 'text-md text-white/10'}`}>
          {mission.name || 'NEW_PROJECT'}
        </h2>
        <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">PROJECT SUMMARY</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
      <div className="space-y-1">
        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">TIMELINE</p>
        <p className="text-[9px] font-black text-white uppercase tracking-widest">
          {mission.timeline.start || 'TBD'} — {mission.timeline.end || 'TBD'}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">TEAMS</p>
        <span className="text-[9px] font-black text-primary uppercase tracking-widest">{mission.teams.length} ASSIGNED</span>
      </div>
    </div>
  </div>
);

export default ProjectSetup;

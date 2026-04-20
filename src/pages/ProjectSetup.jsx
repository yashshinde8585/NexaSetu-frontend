import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertCircle, 
  Calendar, 
  Clock, 
  FileText, 
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';

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
      await handleCreateProject({
        ...mission,
        status: isDraft ? 'draft' : 'active'
      });
      navigate('/project-info');
    } catch (error) {
      console.error('Failed to create project:', error);
      setSubmitError(error?.message || 'Unable to create project. Please check your connection and try again.');
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
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 lg:p-12 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto space-y-8 sm:space-y-12 animate-in fade-in duration-700">
        
        {/* Simplified Header */}
        <header className="border-b border-white/20 pb-6 sm:pb-10">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase leading-none">
                Create New Project
            </h1>
            <p className="text-[10px] sm:text-[11px] font-bold text-white/40 uppercase tracking-widest pl-4 sm:pl-10 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 animate-pulse" />
              Configure your workspace and start collaborating.
            </p>
          </div>
        </header>

        {/* Main Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start relative z-10">
          
          {/* Header/Summary for Mobile - Always Visible */}
          <div className="lg:hidden">
            <MobileSummary mission={mission} />
          </div>

          {/* Left: Setup Panel */}
          <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1 space-y-6 sm:space-y-8">
            <div className="bg-black border border-white/20 p-6 sm:p-10 rounded-2xl shadow-3xl relative overflow-hidden group hover:border-white/30 transition-colors">
              
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
                    <FileText size={16} className="text-primary" />
                    <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-widest">PROJECT DETAILS</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Project Name</label>
                      <input 
                        placeholder="e.g., Client Portal" 
                        value={mission.name}
                        onChange={(e) => setMission({...mission, name: e.target.value.toUpperCase()})}
                        className="w-full h-14 bg-white/5 border border-white/20 px-5 rounded-lg text-white font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-white/10"
                      />
                      <p className="text-[8px] text-white/30 font-bold italic tracking-wider">Use a descriptive name for easy identification.</p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Project Type</label>
                      <select 
                        value={mission.type}
                        onChange={(e) => setMission({...mission, type: e.target.value})}
                        className="w-full h-14 bg-white/5 border border-white/20 px-4 rounded-lg text-white font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="Product Development">Product Development</option>
                        <option value="Internal Tool">Internal Tool</option>
                        <option value="Client Project">Client Project</option>
                        <option value="Research / POC">Research / POC</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-white/50 uppercase tracking-widest">Description</label>
                    <textarea 
                      placeholder="Describe the key goals and deliverables..." 
                      rows={3}
                      value={mission.objective}
                      onChange={(e) => setMission({...mission, objective: e.target.value})}
                      className="w-full bg-white/5 border border-white/20 p-5 rounded-xl text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none placeholder:text-white/10"
                    />
                  </div>
                </div>

                {/* Section 2: Composition */}
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Users size={16} className="text-secondary" />
                    <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">TEAM ASSIGNMENT</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {['Backend', 'Frontend', 'QA', 'DevOps', 'UI/UX', 'Hardware'].map(team => (
                      <button
                        key={team}
                        type="button"
                        onClick={() => toggleTeam(team)}
                        className={`px-4 sm:px-6 py-3 rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                          mission.teams.includes(team)
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                        }`}
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Logistics */}
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Calendar size={16} className="text-status-success" />
                    <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">TIMELINE & SCHEDULE</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-white/50 uppercase tracking-widest">Start Date</label>
                      <input 
                        type="date"
                        value={mission.timeline.start}
                        onChange={(e) => setMission({...mission, timeline: {...mission.timeline, start: e.target.value}})}
                        className="w-full h-14 bg-white/5 border border-white/20 px-4 rounded-lg text-white font-black text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary transition-all [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-white/50 uppercase tracking-widest">End Date</label>
                      <input 
                        type="date"
                        value={mission.timeline.end}
                        onChange={(e) => setMission({...mission, timeline: {...mission.timeline, end: e.target.value}})}
                        className="w-full h-14 bg-white/5 border border-white/20 px-4 rounded-lg text-white font-black text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-8 sm:pt-10 border-t border-white/20">
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <button 
                      type="button" 
                      onClick={(e) => onInitialize(e)}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto h-14 px-10 bg-gradient-to-r from-primary to-blue-600 text-black hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                    >
                      CREATE PROJECT
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => onInitialize(e, true)}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto h-14 px-8 border border-white/20 hover:border-white/40 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl"
                    >
                      SAVE AS DRAFT
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="text-[10px] font-black text-white/30 hover:text-white uppercase tracking-[0.2em] transition-colors py-2"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Live Preview (Hidden on Mobile, replaced by Summary) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-32 order-1 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] px-4">PROJECT PREVIEW</h2>
              
              <div className="bg-black border border-white/30 rounded-2xl overflow-hidden shadow-3xl group relative">
                
                <div className="p-8 space-y-8 relative z-10">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start">
                    <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10">
                       <p className="text-[8px] font-black tracking-widest uppercase text-white/50">STATUS: PENDING</p>
                    </div>
                  </div>

                  {/* Project Name & Objective */}
                  <div className="space-y-3">
                    <h2 className={`font-black uppercase tracking-tight break-words transition-all duration-500 ${mission.name ? 'text-2xl text-white' : 'text-xl text-white/10 italic'}`}>
                        {mission.name || 'PROJECT_NAME'}
                    </h2>
                    <div className="w-12 h-1 bg-primary/40 group-hover:w-20 transition-all duration-700" />
                    <p className={`text-[10px] leading-relaxed uppercase tracking-widest transition-all duration-300 ${mission.objective ? 'text-white/60' : 'text-white/5'}`}>
                      {mission.objective || 'Your project description will appear here...'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div className="space-y-2">
                       <p className="text-[8px] font-black text-white/30 tracking-widest uppercase">TYPE</p>
                       <p className="text-[10px] font-black text-white uppercase tracking-wider">{mission.type}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[8px] font-black text-white/30 tracking-widest uppercase">TIMELINE</p>
                       <div className="flex items-center gap-2 text-white">
                         <Calendar size={12} className="text-secondary" />
                         <p className="text-[10px] font-black uppercase tracking-wider">
                           {mission.timeline.start || 'TBD'} — {mission.timeline.end || 'TBD'}
                         </p>
                       </div>
                    </div>
                  </div>

                  {/* Team Reveal */}
                  <div className="space-y-4">
                    <p className="text-[8px] font-black text-white/30 tracking-widest uppercase">ASSIGNED TEAMS</p>
                    <div className="flex flex-wrap gap-2">
                      {mission.teams.length > 0 ? mission.teams.map(team => (
                        <span key={team} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-black text-white/80 uppercase tracking-widest">
                          {team}
                        </span>
                      )) : (
                        <div className="w-full py-4 border border-dashed border-white/10 rounded-xl flex items-center justify-center">
                           <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">Awaiting Team Selection</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ID / Metadata */}
                  <div className="pt-6 border-t border-white/10 flex justify-end items-center opacity-40">
                     <span className="text-[10px] font-black text-white">ID: NEXA-{mission.name ? mission.name.substring(0, 4) : '####'}</span>
                  </div>
                </div>

                {/* Background Shimmer */}
                <div className="absolute inset-0 bg-linear-to-tr from-primary/0 via-primary/5 to-transparent pointer-events-none" />
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
  <div className="bg-black border border-primary/30 rounded-2xl p-6 sm:p-8 space-y-5 animate-in slide-in-from-top-4 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10">
      <Rocket size={48} className="text-primary" />
    </div>
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <h2 className={`font-black uppercase tracking-tight leading-none ${mission.name ? 'text-xl text-white' : 'text-lg text-white/20 italic'}`}>
          {mission.name || 'NEW_PROJECT'}
        </h2>
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">PROJECT SUMMARY</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-white">NEXA-{mission.name ? mission.name.substring(0, 4) : '####'}</p>
      </div>
    </div>
    
    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
      <div className="flex-1">
        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">TEAM_ASSIGNMENTS</p>
        <div className="flex flex-wrap gap-1.5">
          {mission.teams.slice(0, 3).map(team => (
            <span key={team} className="w-2 h-2 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
          ))}
          {mission.teams.length > 3 && <span className="text-[8px] font-bold text-white/40">+{mission.teams.length - 3}</span>}
          {mission.teams.length === 0 && <span className="text-[8px] font-bold text-white/20">PENDING</span>}
        </div>
      </div>
    </div>

    <div className="flex justify-between items-center pt-4 border-t border-white/10">
      <div className="space-y-1">
        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">TIMELINE</p>
        <p className="text-[9px] font-black text-white uppercase tracking-widest">
          {mission.timeline.start || 'TBD'} — {mission.timeline.end || 'TBD'}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">STATUS</p>
        <span className="text-[9px] font-black text-status-success uppercase tracking-widest animate-pulse">Created</span>
      </div>
    </div>
  </div>
);

export default ProjectSetup;

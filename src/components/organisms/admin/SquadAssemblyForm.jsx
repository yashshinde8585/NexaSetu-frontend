import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Save, 
  Layout, 
  ChevronLeft,
  Users,
  CheckCircle
} from 'lucide-react';

/**
 * TeamBuilderForm - Centralized component for team creation and modification.
 * Implements a premium, high-contrast interface for team management.
 */
const TeamBuilderForm = ({ 
  title, 
  description, 
  submitLabel, 
  onSubmit, 
  users = [], 
  initialData = {},
  themeColor = 'primary' // 'primary' for create, 'secondary' for edit
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState(initialData.name || '');
  const [mission, setMission] = useState(initialData.description || '');
  const [lead, setLead] = useState(initialData.lead || '');
  const [selectedMembers, setSelectedMembers] = useState(initialData.members || []);

  // Sync state if initialData changes (useful for async loads in Edit mode)
  useEffect(() => {
    if (initialData.name) setName(initialData.name);
    if (initialData.description) setMission(initialData.description);
    if (initialData.lead) setLead(initialData.lead);
    if (initialData.members) setSelectedMembers(initialData.members);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      description: mission,
      lead,
      members: selectedMembers
    });
  };

  const toggleMember = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const isPrimary = themeColor === 'primary';
  const colorClass = isPrimary ? 'text-primary' : 'text-secondary';
  const bgColorClass = isPrimary ? 'bg-primary/5' : 'bg-secondary/5';
  const borderColorClass = isPrimary ? 'border-primary/20' : 'border-secondary/20';
  const glowClass = isPrimary ? 'shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]' : 'shadow-[0_0_40px_rgba(var(--secondary-rgb),0.1)]';

  return (
    <div className="h-[calc(100vh-100px)] max-w-screen-xl mx-auto px-6 py-4 flex flex-col space-y-6 overflow-hidden animate-[fadeIn_500ms_ease_forwards]">
      
      {/* 🧭 Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-black text-white/10">
          <span>Administration</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/5" />
          <span className={`${isPrimary ? 'text-primary/60' : 'text-secondary/60'}`}>
            {isPrimary ? 'Team Builder' : 'Team Settings'}
          </span>
        </div>
      </div>

      {/* 🚀 Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6 shrink-0">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className={`w-10 h-10 rounded-xl ${bgColorClass} border ${borderColorClass} flex items-center justify-center ${colorClass} ${glowClass}`}>
                <Users size={20} />
             </div>
             <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">{title}</h1>
          </div>
          <p className="text-white/40 max-w-xl text-[11px] font-medium leading-relaxed">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch overflow-hidden min-h-0">
        
        {/* Column 1: Team Foundation */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-6 space-y-6 shadow-2xl backdrop-blur-xl h-full flex flex-col group/card transition-all hover:border-white/20">
            <div className="flex items-center gap-3 shrink-0">
              <div className={`p-1.5 rounded-lg ${bgColorClass} ${colorClass}`}>
                <Layout size={16} />
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-tight">Configuration</h2>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-black px-1">Team Identity</label>
                <input 
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CORE PLATFORM"
                  className={`w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-5 text-lg font-black text-white focus:border-${themeColor}/50 placeholder:text-white/5 outline-none transition-all shadow-inner uppercase tracking-tight`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-black px-1">Mission Objective</label>
                <textarea 
                  rows={4}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="Define the primary focus and goals of this team..."
                  className={`w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-5 text-xs text-white/70 focus:border-${themeColor}/50 placeholder:text-white/5 outline-none transition-all resize-none shadow-inner leading-relaxed`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-black px-1 flex items-center justify-between">
                  Technical Lead 
                  <Shield size={12} className="text-secondary/60" />
                </label>
                <div className="relative group/select">
                  <select 
                    required
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-5 text-xs text-white focus:border-secondary/50 outline-none transition-all cursor-pointer appearance-none group-hover/select:bg-white/[0.02]"
                  >
                    <option value="" disabled className="bg-slate-900">Select leadership...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id} className="bg-slate-900">{u.name} — {u.role.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover/select:text-secondary transition-colors">
                    <Shield size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 mt-auto border-t border-white/5 shrink-0">
              <button 
                type="submit"
                className={`w-full ${isPrimary ? 'bg-primary' : 'bg-secondary'} hover:brightness-110 text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2`}
              >
                <Save size={14} /> {submitLabel}
              </button>
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="w-full text-white/20 hover:text-white font-black text-[9px] uppercase tracking-widest transition-colors py-2"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Pool A (Available) */}
        <div className="flex flex-col h-full overflow-hidden">
           <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl h-full flex flex-col transition-all hover:border-white/20">
             <div className="px-6 py-4 border-b border-white/5 bg-status-success/[0.03] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-status-success shadow-[0_0_8px_rgba(var(--status-success-rgb),0.4)]" />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Available</span>
                </div>
                <div className={`bg-status-success/10 text-status-success text-[8px] font-black px-2 py-0.5 rounded-full border border-status-success/20`}>
                   {users.filter(u => !u.teams || u.teams.length === 0).length}
                </div>
             </div>
             
             <div className="p-3 flex-1 overflow-y-auto custom-scrollbar bg-white/[0.01]">
                <div className="space-y-2">
                   {users.filter(u => !u.teams || u.teams.length === 0).map(u => (
                     <MemberItem 
                        key={u.id} 
                        user={u} 
                        isActive={selectedMembers.includes(u.id)}
                        onToggle={() => toggleMember(u.id)}
                        themeColor={themeColor}
                     />
                   ))}
                </div>
             </div>
           </div>
        </div>

        {/* Column 3: Pool B (Current/Active) */}
        <div className="flex flex-col h-full overflow-hidden">
           <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl h-full flex flex-col transition-all hover:border-white/20">
             <div className={`px-6 py-4 border-b border-white/5 ${isPrimary ? 'bg-secondary/[0.03]' : 'bg-primary/[0.03]'} flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isPrimary ? 'bg-secondary' : 'bg-primary'} shadow-[0_0_8px_rgba(var(--secondary-rgb),0.4)]`} />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                    {isPrimary ? 'Selected' : 'Active'}
                  </span>
                </div>
                <div className={`${bgColorClass} ${colorClass} text-[8px] font-black px-2 py-0.5 rounded-full border ${borderColorClass}`}>
                   {selectedMembers.filter(id => users.find(u => u.id === id)?.teams?.length > 0).length}
                </div>
             </div>
             
             <div className="p-3 flex-1 overflow-y-auto custom-scrollbar bg-white/[0.01]">
                <div className="space-y-2">
                   {users.filter(u => u.teams && u.teams.length > 0).map(u => (
                     <MemberItem 
                        key={u.id} 
                        user={u} 
                        isActive={selectedMembers.includes(u.id)}
                        onToggle={() => toggleMember(u.id)}
                        themeColor={themeColor}
                        showTeam
                     />
                   ))}
                </div>
             </div>
           </div>
        </div>

      </form>
    </div>
  );
};

/* Internal Helper for List Items */
const MemberItem = ({ user, isActive, onToggle, showTeam, themeColor }) => (
  <div 
    onClick={onToggle}
    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group/item ${
      isActive
        ? `bg-${themeColor}/10 border-${themeColor}/40 text-white ring-1 ring-${themeColor}/20`
        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20 text-white/40'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
        isActive ? `bg-${themeColor}/20 text-${themeColor}` : 'bg-white/5 text-white/20 group-hover/item:bg-white/10 group-hover/item:scale-105'
      }`}>
        <User size={16} />
      </div>
      <div className="flex flex-col">
        <span className={`text-xs font-black uppercase tracking-tight transition-colors ${isActive ? 'text-white' : 'group-hover/item:text-white'}`}>{user.name}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">{user.role.replace(/_/g, ' ')}</span>
          {showTeam && user.teams?.[0] && (
            <span className="text-[8px] px-2 py-0.5 rounded-md bg-white/10 text-white/40 font-black border border-white/10 uppercase tracking-tighter">
              {user.teams[0]}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
      isActive 
        ? `border-${themeColor} bg-${themeColor} scale-110` 
        : 'border-white/10 bg-transparent scale-90'
    }`}>
      {isActive && <CheckCircle size={12} className="text-black" />}
    </div>
  </div>
);

export default TeamBuilderForm;

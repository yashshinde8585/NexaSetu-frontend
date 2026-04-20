import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Save, 
  Layout, 
  ChevronLeft,
  Users,
  Zap
} from 'lucide-react';

/**
 * SquadAssemblyForm - Centralized component for team creation and modification.
 * Implements the 3-column workforce curation UI.
 */
const SquadAssemblyForm = ({ 
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
  const bgColorClass = isPrimary ? 'bg-primary/10' : 'bg-secondary/10';
  const borderColorClass = isPrimary ? 'border-primary/20' : 'border-secondary/20';

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-500">
      
      {/* 🧭 Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-black text-white/10">
          <span>Settings</span>
          <span className="w-1 h-1 rounded-full bg-white/5" />
          <span className={`${isPrimary ? 'text-primary/40' : 'text-secondary/40'}`}>
            {isPrimary ? 'New Team' : 'Edit Team'}
          </span>
        </div>
      </div>

      {/* 🚀 Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-4 mb-4">
             <div className={`w-12 h-12 rounded-2xl ${bgColorClass} border ${borderColorClass} flex items-center justify-center ${colorClass}`}>
                <Users size={28} />
             </div>
             <h1 className="text-4xl font-black tracking-tighter text-white">{title}</h1>
          </div>
          <p className="text-white/30 max-w-lg">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        
        {/* Column 1: Team Foundation */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl h-full min-h-[400px] flex flex-col">
            <div className="flex items-center gap-3">
              <Layout className={colorClass} size={20} />
              <h2 className="text-lg font-bold">Team Details</h2>
            </div>

            <div className="space-y-6 flex-1">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1">Team Name</label>
                <input 
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Core Protocols"
                  className={`w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-lg font-bold text-white focus:border-${themeColor} placeholder:text-white/10 outline-none transition-all shadow-inner`}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1">Purpose</label>
                <textarea 
                  rows={4}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="Describe what this team does..."
                  className={`w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/70 focus:border-${themeColor} placeholder:text-white/10 outline-none transition-all resize-none shadow-inner`}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1 flex items-center justify-between">
                  Team Lead 
                  <Shield size={12} className="text-secondary" />
                </label>
                <div className="relative group">
                  <select 
                    required
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:border-secondary outline-none transition-all cursor-pointer appearance-none group-hover:bg-white/[0.02]"
                  >
                    <option value="" disabled className="bg-slate-900">Select a lead...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id} className="bg-slate-900">{u.name} — {u.role.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/10 group-hover:text-secondary transition-colors">
                    <Shield size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-6 mt-auto">
              <button 
                type="submit"
                className={`w-full ${isPrimary ? 'bg-primary' : 'bg-secondary'} hover:brightness-110 text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3`}
              >
                <Save size={18} /> {submitLabel}
              </button>
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="w-full text-white/20 hover:text-white font-bold text-xs transition-colors py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Pool A (Available) */}
        <div className="space-y-4 h-full">
           <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col">
             <div className="px-6 py-4 border-b border-white/5 bg-status-success/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Available Members</span>
                </div>
                <div className={`${bgColorClass} ${colorClass} text-[9px] font-black px-2 py-0.5 rounded-md border ${borderColorClass}`}>
                   {users.filter(u => !u.teams || u.teams.length === 0).length} TOTAL
                </div>
             </div>
             
             <div className="p-2 flex-1 overflow-y-auto custom-scrollbar min-h-[300px] max-h-[450px]">
                <div className="space-y-1">
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
        <div className="space-y-4 h-full">
           <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col">
             <div className={`px-6 py-4 border-b border-white/5 ${isPrimary ? 'bg-secondary/5' : 'bg-primary/5'} flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isPrimary ? 'bg-secondary' : 'bg-primary'}`} />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                    {isPrimary ? 'New Team Members' : 'Members from other teams'}
                  </span>
                </div>
                <div className={`${bgColorClass} ${colorClass} text-[9px] font-black px-2 py-0.5 rounded-full border ${borderColorClass}`}>
                   {selectedMembers.filter(id => users.find(u => u.id === id)?.teams?.length > 0).length} SELECTED
                </div>
             </div>
             
             <div className="p-2 flex-1 overflow-y-auto custom-scrollbar min-h-[300px] max-h-[450px]">
                <div className="space-y-1">
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
    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
      isActive
        ? `bg-${themeColor}/10 border-${themeColor}/30 text-white`
        : 'bg-transparent border-transparent hover:bg-white/5 text-white/40'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        isActive ? `bg-${themeColor}/20 text-${themeColor}` : 'bg-white/5 text-white/20 group-hover:bg-white/10'
      }`}>
        <User size={18} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold leading-none mb-1 group-hover:text-white transition-colors">{user.name}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] uppercase tracking-tighter opacity-40">{user.role.replace(/_/g, ' ')}</span>
          {showTeam && user.teams?.[0] && (
            <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/5 text-white/20 font-bold border border-white/5">
              {user.teams[0]}
            </span>
          )}
        </div>
      </div>
    </div>
    {isActive && (
      <div className={`w-2 h-2 rounded-full bg-${themeColor} animate-pulse shadow-[0_0_10px_rgba(var(--${themeColor}-rgb),0.5)]`} />
    )}
  </div>
);

export default SquadAssemblyForm;

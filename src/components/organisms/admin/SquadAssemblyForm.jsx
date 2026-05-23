import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Save,
  Layout,
  ChevronLeft,
  Users,
  CheckCircle,
} from 'lucide-react';
import { BackButton } from '../../atoms';

const TeamBuilderForm = ({
  title,
  description,
  submitLabel,
  onSubmit,
  users = [],
  initialData = {},
  themeColor = 'primary', // 'primary' for create, 'secondary' for edit
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState(initialData.name || '');
  const [mission, setMission] = useState(initialData.description || '');
  const [lead, setLead] = useState(initialData.lead || '');
  const [selectedMembers, setSelectedMembers] = useState(
    initialData.members || []
  );

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
      members: selectedMembers,
    });
  };

  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const isPrimary = themeColor === 'primary';
  const colorClass = isPrimary ? 'text-primary' : 'text-secondary';
  const bgColorClass = isPrimary ? 'bg-primary/5' : 'bg-secondary/5';
  const borderColorClass = isPrimary
    ? 'border-primary/20'
    : 'border-secondary/20';
  const glowClass = isPrimary
    ? 'shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]'
    : 'shadow-[0_0_40px_rgba(var(--secondary-rgb),0.1)]';

  return (
    <div className="h-[calc(100vh-64px)] max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6 py-4 flex flex-col gap-4 overflow-hidden selection:bg-primary">
      {/* Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between shrink-0">
        <BackButton />
        <div className="hidden sm:flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] font-black text-white/10">
          <span>ADMINISTRATION</span>
          <span className="w-1 h-1 rounded-full bg-white/5" />
          <span
            className={`${isPrimary ? 'text-primary/40' : 'text-secondary/40'}`}
          >
            {isPrimary ? 'SQUAD_ASSEMBLY' : 'UNIT_RECONFIGURATION'}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded bg-white/5 border ${borderColorClass} flex items-center justify-center ${colorClass}`}
            >
              <Users size={16} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase leading-none">
              {title}
            </h1>
          </div>
          <p className="text-white/20 max-w-xl text-[9px] font-black uppercase tracking-widest leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch overflow-hidden min-h-0"
      >
        {/* Column 1: Team Foundation */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 gap-5 shadow-2xl flex flex-col h-full">
            <div className="flex items-center gap-3 shrink-0">
              <div className={`p-1 rounded bg-black ${colorClass}`}>
                <Layout size={14} />
              </div>
              <h2 className="text-[10px] font-black text-white uppercase tracking-widest">
                CONFIGURATION
              </h2>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-black px-1 block">
                  TEAM IDENTITY
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.G. CORE PLATFORM"
                  className="w-full h-9 bg-black border border-white/10 rounded px-4 text-[11px] font-black text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/5 uppercase tracking-tight"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-black px-1 block">
                  MISSION OBJECTIVE
                </label>
                <textarea
                  rows={3}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="DEFINE PRIMARY SQUAD GOALS..."
                  className="w-full bg-black border border-white/10 rounded p-3 text-[10px] font-black text-white/60 focus:border-primary/50 outline-none transition-all resize-none placeholder:text-white/5 leading-relaxed uppercase"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-black px-1 flex items-center justify-between">
                  TECHNICAL LEAD
                  <Shield size={10} className="text-secondary/40" />
                </label>
                <div className="relative group/select">
                  <select
                    required
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    className="w-full h-9 bg-black border border-white/10 rounded px-4 text-[10px] font-black text-white focus:border-secondary/50 outline-none transition-all cursor-pointer appearance-none pr-10 uppercase"
                  >
                    <option value="" disabled>
                      SELECT LEADERSHIP...
                    </option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.role.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/10 group-hover/select:text-secondary transition-colors">
                    <Shield size={14} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-5 mt-auto border-t border-white/5 shrink-0">
              <button
                type="submit"
                className={`w-full h-10 ${isPrimary ? 'bg-primary' : 'bg-secondary'} text-black rounded font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2`}
              >
                <Save size={14} /> {submitLabel}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full text-white/10 hover:text-white font-black text-[9px] uppercase tracking-widest transition-colors py-1"
              >
                DISCARD_CHANGES
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Pool A (Available) */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
            <div className="px-4 py-3 border-b border-white/5 bg-status-success/[0.03] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-status-success" />
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                  AVAILABLE_PERSONNEL
                </span>
              </div>
              <div className="bg-status-success/10 text-status-success text-[8px] font-black px-2 py-0.5 rounded border border-status-success/20">
                {users.filter((u) => !u.teams || u.teams.length === 0).length}
              </div>
            </div>

            <div className="p-3 flex-1 overflow-y-auto custom-scrollbar bg-white/[0.01]">
              <div className="space-y-2">
                {users
                  .filter((u) => !u.teams || u.teams.length === 0)
                  .map((u) => (
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
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full">
            <div
              className={`px-4 py-3 border-b border-white/5 ${isPrimary ? 'bg-secondary/[0.03]' : 'bg-primary/[0.03]'} flex items-center justify-between shrink-0`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-1 h-1 rounded-full ${isPrimary ? 'bg-secondary' : 'bg-primary'}`}
                />
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                  {isPrimary ? 'SELECTED_UNITS' : 'ACTIVE_DEPLOYMENTS'}
                </span>
              </div>
              <div
                className={`${bgColorClass} ${colorClass} text-[8px] font-black px-2 py-0.5 rounded border ${borderColorClass}`}
              >
                {
                  selectedMembers.filter(
                    (id) => users.find((u) => u.id === id)?.teams?.length > 0
                  ).length
                }
              </div>
            </div>

            <div className="p-3 flex-1 overflow-y-auto custom-scrollbar bg-white/[0.01]">
              <div className="space-y-2">
                {users
                  .filter((u) => u.teams && u.teams.length > 0)
                  .map((u) => (
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
    className={`flex items-center justify-between p-3 rounded border transition-all cursor-pointer group/item ${
      isActive
        ? `bg-primary/10 border-primary/40 text-white`
        : 'bg-black border-white/5 hover:bg-white/5 hover:border-white/10 text-white/20'
    }`}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`w-8 h-8 rounded flex items-center justify-center transition-all shrink-0 ${
          isActive
            ? `bg-primary/20 text-primary`
            : 'bg-white/5 text-white/10 group-hover/item:text-white/30'
        }`}
      >
        <User size={14} />
      </div>
      <div className="flex flex-col min-w-0">
        <span
          className={`text-[11px] font-black uppercase tracking-tight truncate ${isActive ? 'text-white' : 'group-hover/item:text-white'}`}
        >
          {user.name}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-20">
            {user.role.replace(/_/g, ' ')}
          </span>
          {showTeam && user.teams?.[0] && (
            <span className="text-[7px] px-1.5 py-0.5 rounded-sm bg-white/5 text-white/20 font-black border border-white/10 uppercase tracking-tighter">
              {user.teams[0]}
            </span>
          )}
        </div>
      </div>
    </div>
    <div
      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
        isActive
          ? `border-primary bg-primary`
          : 'border-white/10 bg-transparent'
      }`}
    >
      {isActive && <CheckCircle size={10} className="text-black" />}
    </div>
  </div>
);

export default TeamBuilderForm;

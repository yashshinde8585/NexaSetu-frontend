import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  Mail,
  Shield,
  ShieldCheck,
  UserPlus,
  Trash2,
  Clock,
  CheckCircle,
  Search,
  Filter,
  ChevronDown,
  Box,
  Rocket,
  Zap,
  Globe,
  Layout,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TeamService from '../api/teamService';
import { USER_ROLES, ROUTES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { usePermissions, PERMISSIONS } from '../hooks/usePermissions';
import Skeleton from '../components/atoms/Skeleton';

const TeamSkeleton = () => (
  <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-10 bg-black min-h-screen">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-64 md:w-96" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-14 w-64 hidden sm:block" />
        <Skeleton className="h-14 w-40" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
    </div>
    <div className="space-y-6">
      <Skeleton className="h-4 w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />)}
      </div>
    </div>
  </div>
);

const Team = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const [team, setTeam] = useState({ members: [], invitations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await TeamService.getMembers();
      setTeam(res.data || { members: [], invitations: [] });
    } catch (err) {
      setError(err.message || 'We couldn\'t load the team directory. Please check your internet or try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isTechLead = user?.role === USER_ROLES.TECH_LEAD;
    const primaryProjectId =
      user?.assignedProjectId?._id || user?.assignedProjectId;

    if (isTechLead && primaryProjectId) {
      navigate(`/team/project/${primaryProjectId}`, { replace: true });
      return;
    }

    fetchTeam();
  }, [user, navigate, fetchTeam]);

  // Performance Optimization: Memoized groupings
  const { groupedTeams, unassignedMembers } = useMemo(() => {
    const members = team.members || [];
    const groups = members.reduce((acc, member) => {
      const projectId = member.assignedProjectId?._id || 'unassigned';
      const projectName = member.assignedProjectId?.name || 'Reserve Operations';

      if (!acc[projectId]) {
        acc[projectId] = { name: projectName, members: [], id: projectId };
      }
      acc[projectId].members.push(member);
      return acc;
    }, {});

    const unassigned = groups['unassigned']?.members || [];
    delete groups['unassigned'];

    return {
      groupedTeams: Object.values(groups),
      unassignedMembers: unassigned
    };
  }, [team.members]);

  // Combined Search Filter
  const filteredData = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return { groups: groupedTeams, unassigned: unassignedMembers };

    const searchFilter = (m) => 
      m.name.toLowerCase().includes(q) || 
      m.email.toLowerCase().includes(q) || 
      m.jobTitle?.toLowerCase().includes(q);

    const filteredUnassigned = unassignedMembers.filter(searchFilter);
    const filteredGroups = groupedTeams.map(group => ({
      ...group,
      members: group.members.filter(searchFilter)
    })).filter(group => group.members.length > 0 || group.name.toLowerCase().includes(q));

    return { groups: filteredGroups, unassigned: filteredUnassigned };
  }, [groupedTeams, unassignedMembers, searchTerm]);

  if (loading) return <TeamSkeleton />;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-10 bg-black min-h-screen">
      
      {/* Dynamic Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 animate-in slide-in-from-top duration-700">
        <div className="space-y-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none uppercase">
            Team Directory
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative group min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-primary transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              aria-label="Search by name, email, or role"
              className="w-full bg-white/[0.06] border border-white/20 text-white rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all text-sm font-medium placeholder:text-white/40 shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate('/team/add')}
            className="px-8 py-4 bg-primary text-black font-bold uppercase tracking-[0.05em] text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-95 hover:brightness-110"
          >
            <UserPlus size={18} /> <span className="hidden sm:inline">Invite Member</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-status-error/10 border border-status-error/20 p-6 rounded-[2rem] flex items-start gap-4 animate-in zoom-in-95 duration-500">
          <AlertCircle className="text-status-error shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Connection Lost</h4>
            <p className="text-xs text-status-error/80 font-bold">{error}</p>
          </div>
          <button onClick={fetchTeam} className="ml-auto p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <Rocket size={16} />
          </button>
        </div>
      )}

      {/* Strategic Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-1000 delay-200">
        {[
          { label: 'Active Teams', value: groupedTeams.length, icon: <Layout className="text-secondary" size={16} /> },
          { label: 'Total Members', value: team.members.length, icon: <Users size={16} className="text-primary" /> },
          { label: 'Available Pool', value: unassignedMembers.length, icon: <Clock size={16} className="text-status-warning" /> },
          { label: 'Pending Invites', value: team.invitations.length, icon: <Mail size={16} className="text-status-info" /> }
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">{stat.label}</p>
              <p className="text-lg font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-12">
        {/* Managed Squads Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-1">
            <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.4em] whitespace-nowrap">Assigned Teams</h2>
            <div className="h-[1px] w-full bg-white/10" />
          </div>

          {filteredData.groups.length === 0 && (
            <div className="py-24 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center animate-in fade-in duration-700">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                <Box size={32} className="text-white/10" />
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                 {searchTerm ? 'No results found' : 'No teams found'}
               </h3>
               <p className="text-white/20 text-xs font-bold max-w-xs leading-relaxed uppercase tracking-widest">
                 {searchTerm 
                   ? `We couldn't find any teams or members matching "${searchTerm}".` 
                   : 'Teams will appear here once projects or members are assigned.'}
               </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.groups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/team/project/${group.id}`)}
                className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-primary/20 rounded-[2.5rem] p-8 transition-all duration-500 hover:translate-y-[-8px] cursor-pointer overflow-hidden backdrop-blur-xl"
              >
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

                <div className="relative z-10 space-y-8 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-primary shadow-2xl group-hover:scale-110 transition-transform">
                      <Box size={24} strokeWidth={2.5} />
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 text-white/10 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>

                   <div>
                    <h3 className="text-lg font-bold text-white tracking-tight leading-tight mb-2 group-hover:text-primary transition-colors">
                      {group.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={12} className="text-primary/50" />
                       <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{group.members.length} Members Assigned</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-auto flex items-center justify-between">
                    <div className="flex -space-x-2.5">
                      {group.members.slice(0, 5).map((m, i) => (
                        <div
                          key={i}
                          className="w-9 h-9 rounded-xl bg-linear-to-br from-white/10 to-transparent border-2 border-black flex items-center justify-center text-[10px] font-black text-white uppercase shadow-xl ring-1 ring-white/5"
                        >
                          {m.name.charAt(0)}
                        </div>
                      ))}
                      {group.members.length > 5 && (
                        <div className="w-9 h-9 rounded-xl bg-white/5 border-2 border-black flex items-center justify-center text-[9px] font-black text-white/40 backdrop-blur-md ring-1 ring-white/5">
                          +{group.members.length - 5}
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] font-black text-white/40 group-hover:text-white/60 transition-colors">VIEW TEAM</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reserve Pool Section (Unassigned) */}
        {filteredData.unassigned.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-4 px-1">
              <h2 className="text-xs font-black text-white/50 uppercase tracking-[0.4em] whitespace-nowrap">Unassigned Members</h2>
              <div className="h-[1px] w-full bg-white/10" />
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-6 lg:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredData.unassigned.map((m) => (
                  <div key={m._id || m.id} className="p-4 bg-black border border-white/5 rounded-2xl flex items-center gap-4 hover:border-white/20 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black text-white/20 group-hover:text-primary transition-colors">
                      {m.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-white truncate">{m.name}</span>
                      <span className="text-[10px] text-white/50 font-mono truncate">{m.jobTitle || 'NO POSITION ASSIGNED'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pending Invitations Section */}
        {team.invitations.length > 0 && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex items-center gap-4 px-1">
              <h2 className="text-xs font-black text-status-warning/40 uppercase tracking-[0.4em] whitespace-nowrap">Pending Invitations</h2>
              <div className="h-[1px] w-full bg-status-warning/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.invitations.map((invite) => (
                <div
                  key={invite.email || invite._id}
                  className="p-6 bg-status-warning/[0.02] border border-status-warning/10 rounded-[2rem] flex flex-col gap-5 group hover:bg-status-warning/[0.04] transition-all duration-500 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-status-warning/5 blur-2xl rounded-full" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="w-12 h-12 bg-status-warning/10 text-status-warning rounded-xl flex items-center justify-center border border-status-warning/20">
                      <Mail size={18} />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="px-3 py-1 bg-status-warning/10 border border-status-warning/20 text-[8px] font-black text-status-warning uppercase tracking-widest rounded-lg">
                        Invited
                      </span>
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{invite.role}</span>
                    </div>
                  </div>

                  <div className="min-w-0 relative z-10">
                    <h4 className="text-sm font-black text-white truncate mb-1">
                      {invite.email}
                    </h4>
                    <div className="text-[10px] font-bold text-white/50 truncate flex items-center gap-2">
                       <Box size={10} /> Assigned Project: <span className="text-white/60 uppercase">{invite.projectId?.name || 'GLOBAL CORE'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-white/5 relative z-10">
                    <div className="flex items-center gap-2">
                       <Clock size={12} className="text-status-warning/30" />
                       <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.1em]">Awaiting response</span>
                    </div>
                    <button 
                      aria-label="Remove pending invitation"
                      className="p-2.5 text-white/10 hover:text-status-error hover:bg-status-error/10 hover:border-status-error/20 border border-transparent rounded-xl transition-all opacity-40 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>


    </div>
  );
};

export default Team;

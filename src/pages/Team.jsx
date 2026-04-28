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
import EmptyState from '../components/atoms/EmptyState';

const TeamSkeleton = () => (
  <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-6 bg-black min-h-screen">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64 hidden sm:block" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
    </div>
    <div className="space-y-4">
      <Skeleton className="h-4 w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
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

  const handleRemoveInvitation = async (id) => {
    const confirmDelete = window.confirm('REMAINING_DISPATCH_WILL_BE_TERMINATED. PROCEED?');
    if (!confirmDelete) return;

    try {
      await TeamService.removeInvitation(id);
      // Optimistic Update
      setTeam(prev => ({
        ...prev,
        invitations: prev.invitations.filter(i => i._id !== id)
      }));
    } catch (err) {
    }
  };

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
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-6 bg-black min-h-screen">
      
      {/* Dynamic Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase leading-none">
            TEAM DIRECTORY
          </h1>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-1 bg-primary rounded-full" />
            MANAGE GLOBAL PERSONNEL AND SECTOR ASSIGNMENTS.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative group min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
            <input
              type="text"
              placeholder="SEARCH PERSONNEL..."
              className="w-full h-9 bg-black border border-white/10 text-white rounded px-4 pl-10 focus:outline-none focus:border-primary/50 transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {hasPermission(PERMISSIONS.INVITE_USERS) && (
            <button
              onClick={() => navigate('/team/add')}
              className="h-9 px-6 bg-primary text-black font-black uppercase tracking-[0.2em] text-[9px] rounded transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <UserPlus size={14} /> INVITE MEMBER
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-status-error/5 border border-status-error/30 p-4 rounded-xl flex items-start gap-4">
          <AlertCircle className="text-status-error shrink-0 mt-0.5" size={16} />
          <div className="flex-1">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">DATA_LINK_FAILURE</h4>
            <p className="text-[9px] text-white/50 font-black uppercase tracking-widest">{error}</p>
          </div>
          <button onClick={fetchTeam} className="p-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors">
            <Rocket size={14} />
          </button>
        </div>
      )}

      {/* Strategic Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'ACTIVE SECTORS', value: groupedTeams.length, icon: <Layout className="text-secondary" size={14} /> },
          { label: 'TOTAL PERSONNEL', value: team.members.length, icon: <Users size={14} className="text-primary" /> },
          { label: 'RESERVE POOL', value: unassignedMembers.length, icon: <Clock size={14} className="text-status-warning" /> },
          { label: 'PENDING INVITES', value: team.invitations.length, icon: <Mail size={14} className="text-status-info" /> }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded bg-black border border-white/10">{stat.icon}</div>
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
              <p className="text-sm font-black text-white tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {/* Managed Squads Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-4 px-1">
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">ASSIGNED TEAMS</h2>
            <div className="h-[1px] w-full bg-white/10" />
          </div>

          {filteredData.groups.length === 0 && (
            <EmptyState 
              title={searchTerm ? 'ZERO_RESULTS' : 'NO_TEAMS_DETECTED'}
              message={searchTerm 
                ? `SEARCH FAILED TO LOCATE "${searchTerm}" WITHIN ASSIGNED SECTORS.` 
                : 'PERSONNEL ASSIGNMENTS WILL MANIFEST UPON SECTOR ALLOCATION.'}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredData.groups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/team/project/${group.id}`)}
                className="group relative bg-white/5 border border-white/10 hover:border-primary/40 rounded-xl p-5 transition-all cursor-pointer overflow-hidden"
              >
                <div className="relative z-10 space-y-6 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded bg-black border border-white/10 flex items-center justify-center text-primary group-hover:border-primary transition-all">
                      <Box size={20} />
                    </div>
                    <div className="p-1.5 rounded text-white/10 group-hover:text-primary transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </div>

                   <div>
                    <h3 className="text-sm font-black text-white tracking-tight leading-tight mb-2 group-hover:text-primary transition-colors uppercase">
                      {group.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={10} className="text-primary/50" />
                       <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{group.members.length} OPERATIVES</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map((m, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded bg-black border border-white/10 flex items-center justify-center text-[9px] font-black text-white/40 uppercase shadow-lg ring-2 ring-black"
                        >
                          {m.name.charAt(0)}
                        </div>
                      ))}
                      {group.members.length > 4 && (
                        <div className="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black text-white/20 ring-2 ring-black">
                          +{group.members.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="text-[8px] font-black text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-widest">VIEW SECTOR</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reserve Pool Section (Unassigned) */}
        {filteredData.unassigned.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-4 px-1">
              <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">RESERVE POOL</h2>
              <div className="h-[1px] w-full bg-white/10" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredData.unassigned.map((m) => (
                  <div key={m._id || m.id} className="p-3 bg-black border border-white/10 rounded-lg flex items-center gap-3 hover:border-primary/40 transition-all group">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-black text-white/20 group-hover:text-primary transition-colors">
                      {m.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-black text-white truncate uppercase tracking-tight">{m.name}</span>
                      <span className="text-[9px] text-white/50 truncate tracking-wide lowercase">{m.email}</span>
                      <span className="text-[8px] text-white/30 font-black uppercase truncate tracking-widest mt-0.5">{m.jobTitle || 'UNASSIGNED'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pending Invitations Section */}
        {team.invitations.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-4 px-1">
              <h2 className="text-[10px] font-black text-status-warning/40 uppercase tracking-[0.2em] whitespace-nowrap">PENDING_DISPATCH</h2>
              <div className="h-[1px] w-full bg-status-warning/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.invitations.map((invite) => (
                <div
                  key={invite.email || invite._id}
                  className="p-4 bg-status-warning/[0.02] border border-status-warning/10 rounded-xl flex flex-col gap-4 group hover:bg-status-warning/[0.04] transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-status-warning/10 text-status-warning rounded border border-status-warning/20 flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 bg-status-warning/10 border border-status-warning/20 text-[8px] font-black text-status-warning uppercase tracking-widest rounded">
                        INVITED
                      </span>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{invite.role}</span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-[11px] font-black text-white truncate mb-1 uppercase tracking-tight">
                      {invite.email}
                    </h4>
                    <div className="text-[8px] font-black text-white/30 truncate flex items-center gap-2 uppercase tracking-widest">
                       <Box size={10} /> <span className="text-white/40">{invite.projectId?.name || 'GLOBAL CORE'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <Clock size={10} className="text-status-warning/30" />
                       <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.1em]">AWAITING_UPLINK</span>
                    </div>
                    <button 
                      aria-label="Remove pending invitation"
                      onClick={() => handleRemoveInvitation(invite._id)}
                      className="p-2 text-white/10 hover:text-status-error transition-all"
                    >
                      <Trash2 size={14} />
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

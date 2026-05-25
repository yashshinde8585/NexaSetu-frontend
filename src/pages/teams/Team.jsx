import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Mail,
  UserPlus,
  Trash2,
  Clock,
  Search,
  Box,
  Rocket,
  AlertCircle,
  Loader2,
} from 'lucide-react';

// Context & Services
import { useAuth } from '../../context/AuthContext';
import TeamService from '../../api/teamApi';
import ProjectService from '../../api/projectApi';
import { USER_ROLES } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { usePermissions, PERMISSIONS } from '../../hooks/usePermissions';
import { useDebounce } from '../../hooks/useDebounce';

// Atomic Components
import Skeleton from '../../components/atoms/Skeleton';

// Modular Components
import TeamStats from '../../components/organisms/Team/TeamStats';
import SquadGrid from '../../components/organisms/Team/SquadGrid';
import ReservePool from '../../components/organisms/Team/ReservePool';
import TacticalModal from '../../components/molecules/TacticalModal';

const TeamSkeleton = () => (
  <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-6 bg-background min-h-screen">
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
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
    <div className="space-y-4">
      <Skeleton className="h-4 w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const Team = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  // Data State
  const [data, setData] = useState({ members: [], invitations: [], total: 0 });
  const [allProjects, setAllProjects] = useState([]);

  // Derived State
  const userProjectId =
    user?.assignedProjectId?.id ||
    user?.assignedProjectId?._id ||
    user?.assignedProjectId;

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [memberAssignments, setMemberAssignments] = useState({});
  const [actionLoading, setActionLoading] = useState({
    removingInvitation: null,
    assigningMember: null,
  });

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    targetId: null,
  });

  // Debounced search for API calls
  const debouncedSearch = useDebounce(searchTerm, 300);

  /**
   * Primary data fetcher with AbortController for memory safety
   */
  const fetchData = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError('');

        const [teamRes, projectRes] = await Promise.all([
          TeamService.getMembers({
            page: 1,
            limit: 100,
            search: debouncedSearch,
          }),
          ProjectService.getProjects(),
        ]);

        if (signal.aborted) return;

        setData(teamRes || { members: [], invitations: [], total: 0 });

        const projectArray = Array.isArray(projectRes?.data?.projects)
          ? projectRes.data.projects.map((p) => ({ ...p, id: p._id || p.id }))
          : (projectRes?.projects || projectRes || []).map((p) => ({
              ...p,
              id: p._id || p.id,
            }));

        setAllProjects(projectArray);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError('Failed to load team data. Please try again.');
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    const abortController = new AbortController();

    // Roles identified for direct tactical sector routing
    const IC_ROLES = [
      USER_ROLES.SENIOR_ENGINEER,
      USER_ROLES.SOFTWARE_ENGINEER,
      USER_ROLES.PROJECT_MEMBER,
      USER_ROLES.INTERN,
    ];
    const isIC = IC_ROLES.includes(user?.role);

    if (isIC && userProjectId) {
      navigate(`/team/project/${userProjectId}`, { replace: true });
    } else {
      fetchData(abortController.signal);
    }

    return () => abortController.abort();
  }, [user, navigate, fetchData]);

  /**
   * Action Handlers
   */
  const handleRemoveInvitation = async () => {
    const id = modalConfig.targetId;
    const previousData = { ...data };

    try {
      setActionLoading((prev) => ({ ...prev, removingInvitation: id }));
      setData((prev) => ({
        ...prev,
        invitations: prev.invitations.filter((i) => i.id !== id),
      }));

      await TeamService.removeInvitation(id);
    } catch (err) {
      setData(previousData);
      setError('Failed to remove invitation. Please try again.');
    } finally {
      setActionLoading((prev) => ({ ...prev, removingInvitation: null }));
    }
  };

  const handleAssignProject = async (memberId, projectId) => {
    try {
      setActionLoading((prev) => ({ ...prev, assigningMember: memberId }));
      await TeamService.updateMemberProject(memberId, projectId);

      setMemberAssignments((prev) => {
        const next = { ...prev };
        delete next[memberId];
        return next;
      });

      // Refresh to update groupings
      fetchData(new AbortController().signal);
    } catch (err) {
      setError('Failed to assign project. Please try again.');
    } finally {
      setActionLoading((prev) => ({ ...prev, assigningMember: null }));
    }
  };

  /**
   * Memoized View Logic
   */
  const { groupedTeams, unassignedMembers } = useMemo(() => {
    const members = data.members || [];

    const groups = members.reduce((acc, member) => {
      const projectId = member.assignedProjectId?.id || 'unassigned';
      const projectName = member.assignedProjectId?.name || 'Unassigned';

      if (!acc[projectId]) {
        acc[projectId] = { name: projectName, members: [], id: projectId };
      }
      acc[projectId].members.push(member);
      return acc;
    }, {});

    const unassigned = groups['unassigned']?.members || [];
    delete groups['unassigned'];

    const sortedGroups = Object.values(groups).sort((a, b) => {
      if (a.id === userProjectId) return -1;
      if (b.id === userProjectId) return 1;
      return a.name.localeCompare(b.name);
    });

    return { groupedTeams: sortedGroups, unassignedMembers: unassigned };
  }, [data.members, user?.assignedProjectId]);

  if (loading) return <TeamSkeleton />;

  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-6 bg-background text-text min-h-screen">
      {/* Dynamic Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-[14px] font-black tracking-widest uppercase text-white">
            Team
          </h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] max-w-xl">
            Manage workspace members and project assignments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative group min-w-[240px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors"
              size={14}
            />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full h-9 bg-black border border-white/10 text-white rounded px-4 pl-10 focus:outline-none focus:border-primary/50 transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-white/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {hasPermission(PERMISSIONS.INVITE_USERS) && (
            <button
              onClick={() => navigate('/team/add')}
              className="h-9 px-6 bg-primary text-black font-black uppercase tracking-[0.2em] text-[9px] rounded transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <UserPlus size={14} /> Invite Member
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-status-error/5 border border-status-error/30 p-4 rounded-xl flex items-start gap-4">
          <AlertCircle
            className="text-status-error shrink-0 mt-0.5"
            size={16}
          />
          <div className="flex-1">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">
              Something went wrong
            </h4>
            <p className="text-[9px] text-white/50 font-black uppercase tracking-widest">
              {error}
            </p>
          </div>
          <button
            onClick={() => fetchData(new AbortController().signal)}
            className="p-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors text-white"
          >
            <Rocket size={14} />
          </button>
        </div>
      )}

      <TeamStats
        activeSectors={groupedTeams.length}
        totalPersonnel={data.total || data.members.length}
        reservePool={unassignedMembers.length}
        pendingInvites={data.invitations.length}
      />

      <div className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-4 px-1">
            <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">
              Project Teams
            </h2>
            <div className="h-[1px] w-full bg-white/10" />
          </div>
          <SquadGrid
            groups={groupedTeams}
            onNavigate={(id) => navigate(`/team/project/${id}`)}
            searchTerm={debouncedSearch}
          />
        </section>

        <ReservePool
          members={unassignedMembers}
          allProjects={allProjects}
          memberAssignments={memberAssignments}
          onProjectChange={(id, val) =>
            setMemberAssignments((prev) => ({ ...prev, [id]: val }))
          }
          onAssign={handleAssignProject}
          actionLoading={actionLoading}
          canManage={hasPermission(PERMISSIONS.INVITE_USERS)}
        />

        {data.invitations.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-4 px-1">
              <h2 className="text-[10px] font-black text-status-warning/40 uppercase tracking-[0.2em] whitespace-nowrap">
                Pending Invitations
              </h2>
              <div className="h-[1px] w-full bg-status-warning/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="p-4 bg-status-warning/[0.02] border border-status-warning/10 rounded-xl flex flex-col gap-4 group hover:bg-status-warning/[0.04] transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-status-warning/10 text-status-warning rounded border border-status-warning/20 flex items-center justify-center">
                      <Mail size={16} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 bg-status-warning/10 border border-status-warning/20 text-[8px] font-black text-status-warning uppercase tracking-widest rounded">
                        Invited
                      </span>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                        {invite.role}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-black text-white truncate mb-1 tracking-tight">
                      {invite.email}
                    </h4>
                    <div className="text-[8px] font-black text-white/30 truncate flex items-center gap-2 uppercase tracking-widest">
                      <Box size={10} />{' '}
                      <span className="text-white/40">
                        {invite.projectId?.name || 'No project assigned'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Clock size={10} className="text-status-warning/30" />
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.1em]">
                        Awaiting response
                      </span>
                    </div>
                    <button
                      aria-label="Remove pending invitation"
                      disabled={actionLoading.removingInvitation === invite.id}
                      onClick={() =>
                        setModalConfig({ isOpen: true, targetId: invite.id })
                      }
                      className="p-2 text-white/10 hover:text-status-error transition-all disabled:opacity-50"
                    >
                      {actionLoading.removingInvitation === invite.id ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <TacticalModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, targetId: null })}
        onConfirm={handleRemoveInvitation}
        title="Revoke Invitation"
        message="Are you sure you want to cancel this pending invitation? This action cannot be undone."
        confirmText="Revoke"
        type="danger"
      />
    </div>
  );
};

export default Team;

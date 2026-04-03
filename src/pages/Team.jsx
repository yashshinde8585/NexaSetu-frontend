import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TeamService from '../api/teamService';
import { USER_ROLES } from '../constants';

import { useNavigate } from 'react-router-dom';

import { usePermissions, PERMISSIONS } from '../hooks/usePermissions';

// Manages the global workspace roster, groupings by project, and outstanding invitations.
const Team = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const [team, setTeam] = useState({ members: [], invitations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Enforce Direct Mission Access for Tech Leads
    // If a Tech Lead has a primary project assignment, redirect them directly
    // to that team's page instead of showing the hub list.
    const isTechLead =
      user?.role === USER_ROLES.TECH_LEAD ||
      user?.jobTitle?.toUpperCase().includes('LEAD');
    const primaryProjectId =
      user?.assignedProjectId?._id || user?.assignedProjectId;

    if (isTechLead && primaryProjectId) {
      navigate(`/team/project/${primaryProjectId}`, { replace: true });
      return;
    }

    fetchTeam();
  }, [user, navigate]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await TeamService.getMembers();
      setTeam(res.data || { members: [], invitations: [] });
    } catch (err) {
      setError(err.message || 'Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case USER_ROLES.WORKSPACE_ADMIN:
        return 'bg-primary/10 text-primary border-primary/20';
      case USER_ROLES.WORKSPACE_MANAGER:
        return 'bg-status-success/10 text-status-success border-status-success/20';
      case USER_ROLES.RESTRICTED:
        return 'bg-status-warning/10 text-status-warning border-status-warning/20';
      default:
        return 'bg-white/5 text-white/60 border-white/5';
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  // Organize the flat member array into groupings associated with their assigned projects
  const groupedMembers = team.members.reduce((acc, member) => {
    const projectId = member.assignedProjectId?._id || 'unassigned';
    const projectName =
      member.assignedProjectId?.name || 'Unassigned Operations';

    if (!acc[projectId]) {
      acc[projectId] = { name: projectName, members: [] };
    }
    acc[projectId].members.push(member);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Header - Scaled Down */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 px-1">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none">
            Internal <span className="text-primary">Teams</span>
          </h1>
          <p className="text-text-muted text-[10px] sm:text-xs font-medium mt-3 max-w-md opacity-60">
            Manage project assignments, workspace roles, and workforce
            distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasPermission(PERMISSIONS.INVITE_USERS) && (
            <button
              onClick={() => navigate('/team/add')}
              className="group px-6 py-3 bg-primary hover:bg-primary-light text-white font-black uppercase tracking-widest text-[9px] rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <UserPlus size={14} /> Add Member
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-status-error/5 border border-status-error/20 text-status-error px-5 py-3 rounded-xl mb-8 flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest backdrop-blur-xl">
          <span className="text-lg">⚠️</span> {error}
        </div>
      )}

      {/* Tactical Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 px-1">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Search personnel..."
            className="w-full bg-white/[0.02] border border-white/5 text-white rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/40 focus:bg-white/[0.04] transition-all text-xs font-medium placeholder:text-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Personnel Grid */}
      <div className="space-y-4 mb-16">
        <div className="flex items-center justify-between px-1 mb-6">
          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">
            Managed Teams
          </div>
          <div className="h-[1px] flex-1 mx-6 bg-white/5" />
          <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.1em]">
            Members: {team.members.length}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedMembers).length === 0 && !loading && (
            <div className="col-span-full py-20 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[40px]">
              <Users size={60} className="mx-auto text-white/5 mb-6" />
              <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tighter italic">
                Workspace Zero
              </h3>
              <p className="text-text-muted text-xs max-w-xs mx-auto opacity-30">
                No strategic personnel detected.
              </p>
            </div>
          )}

          {Object.entries(groupedMembers).map(([projectId, group]) => {
            if (projectId === 'unassigned') return null;

            const filteredGroupMembers = group.members.filter(
              (m) =>
                m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.email.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (searchTerm && filteredGroupMembers.length === 0) return null;

            return (
              <div
                key={projectId}
                onClick={() => navigate(`/team/project/${projectId}`)}
                className="group relative bg-white/[0.02] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-3xl p-6 transition-all duration-300 hover:translate-y-[-4px] cursor-pointer overflow-hidden backdrop-blur-sm"
              >
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex justify-between items-start">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 ${projectId === 'unassigned' ? 'bg-white/5 text-white/20' : 'bg-primary/5 text-primary'}`}
                    >
                      {projectId === 'unassigned' ? (
                        <Users size={20} />
                      ) : (
                        <Box size={20} strokeWidth={2} />
                      )}
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 text-white/10 group-hover:text-primary transition-all">
                      <ChevronDown size={16} className="-rotate-90" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight uppercase truncate mb-1">
                      {group.name}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 text-[9px] font-black text-white/30 uppercase tracking-widest">
                      <Shield size={10} /> {group.members.length} Personnel
                    </div>
                  </div>

                  <div className="mt-auto border-t border-white/5 pt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map((m, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-linear-to-br from-white/10 to-transparent border-2 border-[#0B0F1A] flex items-center justify-center text-[9px] font-black text-white uppercase shadow-sm"
                        >
                          {m.name.charAt(0)}
                        </div>
                      ))}
                      {group.members.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-white/5 border-2 border-[#0B0F1A] flex items-center justify-center text-[8px] font-black text-white/40 backdrop-blur-md">
                          +{group.members.length - 4}
                        </div>
                      )}
                    </div>
                    <span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Pipeline Deployments - Scaled Down */}
      {team.invitations.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 px-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-[8px] font-black text-status-warning/60 uppercase tracking-[0.4em]">
              Pending Invitations
            </div>
            <div className="h-[1px] flex-1 bg-status-warning/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.invitations.map((invite) => (
              <div
                key={invite.email}
                className="p-5 bg-status-warning/[0.02] border border-status-warning/10 rounded-2xl flex flex-col gap-4 group hover:bg-status-warning/[0.04] transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-status-warning/10 text-status-warning rounded-xl flex items-center justify-center border border-status-warning/20">
                    <Mail size={16} />
                  </div>
                  <div className="px-2 py-0.5 bg-status-warning/10 border border-status-warning/20 text-[7px] font-black text-status-warning uppercase tracking-widest rounded-md">
                    Initiating
                  </div>
                </div>

                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate mb-0.5">
                    {invite.email}
                  </h4>
                  <div className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5">
                    Target:{' '}
                    <span className="text-white/60">
                      {invite.projectId?.name || 'GLOBAL'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] font-black text-white/40 uppercase tracking-widest border border-white/5">
                    {invite.role}
                  </div>
                  <button className="p-2 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-40 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Box, Search, Mail, Clock, ShieldCheck } from 'lucide-react';
import TeamService from '../api/teamService';
import { USER_ROLES } from '../constants';
import { Card } from '@/components';

// Displays the roster of team members assigned to a specific project and provides search filtering.
const ProjectTeam = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ projectName: '', members: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjectSquad = async () => {
      try {
        setLoading(true);
        const res = await TeamService.getMembers();
        const allMembers = res?.data?.members || [];

        let projectName = 'Unassigned Operations';
        let filtered = [];

        if (projectId === 'unassigned') {
          projectName = 'Unassigned Members';
          filtered = allMembers.filter((m) => !m.assignedProjectId);
        } else {
          filtered = allMembers.filter(
            (m) => m.assignedProjectId?._id === projectId
          );
          if (filtered.length > 0) {
            projectName = filtered[0].assignedProjectId.name;
          }
        }

        setData({ projectName, members: filtered });
      } catch (err) {
        console.error('Failed to fetch squad:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectSquad();
  }, [projectId]);

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

  const ROLE_PRIORITY = {
    CTO: 1,
    'VP Engineering': 2,
    'Engineering Manager': 3,
    'HR Manager / People Ops': 4,
    'Tech Lead': 5,
    'QA Lead': 5,
    'Senior Engineer': 6,
    'Senior QA Engineer': 6,
    'Software Engineer': 7,
    'Junior Engineer': 8,
    'QA Engineer / Software Tester': 8,
    Intern: 9,
  };


  const getRoleVisuals = (title) => {
    switch (title) {
      case 'CTO':
      case 'VP Engineering':
      case 'Engineering Manager':
      case 'HR Manager / People Ops':
        return {
          color: 'text-status-success',
          shadow: 'rgba(34, 197, 94, 0.3)',
        };
      case 'Tech Lead':
      case 'QA Lead':
        return { color: 'text-primary', shadow: 'rgba(59, 130, 246, 0.3)' };
      case 'Senior Engineer':
      case 'Senior QA Engineer':
        return { color: 'text-purple-400', shadow: 'rgba(168, 85, 247, 0.3)' };
      case 'Software Engineer':
      case 'Junior Engineer':
      case 'QA Engineer / Software Tester':
        return { color: 'text-cyan-400', shadow: 'rgba(34, 211, 238, 0.3)' };
      case 'Intern':
        return { color: 'text-slate-500', shadow: 'rgba(148, 163, 184, 0.3)' };
      default:
        return {
          color: 'text-white/5 group-hover:text-status-success/40',
          shadow: 'transparent',
        };
    }
  };


  const filteredMembers = data.members
    .filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priorityA = ROLE_PRIORITY[a.jobTitle] || 99;
      const priorityB = ROLE_PRIORITY[b.jobTitle] || 99;
      return priorityA - priorityB;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10 space-y-12 animate-in fade-in duration-700">
      <div className="mb-12">
        <button
          onClick={() => navigate('/team')}
          className="flex items-center gap-2 text-text-muted hover:text-white mb-6 uppercase tracking-[0.2em] font-black text-[10px] transition-colors"
        ></button>

        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 ${projectId === 'unassigned' ? 'bg-white/5 text-white/20' : 'bg-primary/10 text-primary shadow-lg shadow-primary/20'}`}
            >
              {projectId === 'unassigned' ? (
                <Users size={24} />
              ) : (
                <Box size={24} />
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight uppercase">
                {data.projectName}
              </h1>
              <p className="text-text-muted text-[10px] sm:text-xs font-medium mt-1">
                Review team members and roles assigned to this project.
              </p>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <div className="text-2xl font-black text-white">
              {data.members.length} Members
            </div>
          </div>
        </div>
      </div>

      <div className="relative mb-10 group max-w-2xl">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Search team members..."
          className="w-full h-12 sm:h-14 bg-white/5 border border-white/5 text-white rounded-xl sm:rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/40 transition-all text-xs sm:text-sm font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[180px] bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse"
              />
            ))
          : filteredMembers.map((member) => (
              <Card
                key={member.email}
                padding="md"
                variant="glass"
                className="bg-white/[0.02] hover:bg-white/[0.05] sm:rounded-[32px] flex flex-col h-full"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-linear-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center text-lg font-black text-white border border-white/5 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                    {member.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-base sm:text-lg text-white tracking-tight truncate leading-tight mb-0.5">
                      {member.name}
                    </h3>
                    <div className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-80">
                      {member.jobTitle || 'Team Member'}
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-medium truncate">
                      <Mail size={12} className="text-white/10" />{' '}
                      {member.email}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-text-muted text-[9px] font-black uppercase tracking-widest">
                    <Clock size={12} /> Joined{' '}
                    {new Date(member.createdAt).toLocaleDateString()}
                  </div>
                  <ShieldCheck
                    size={18}
                    style={{
                      filter: `drop-shadow(0 0 10px ${getRoleVisuals(member.jobTitle).shadow})`,
                    }}
                    className={`transition-all duration-500 ${getRoleVisuals(member.jobTitle).color}`}
                  />
                </div>
              </Card>
            ))}
      </div>

      {!loading && filteredMembers.length === 0 && (
        <div className="py-20 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[40px]">
          <Users size={64} className="mx-auto text-white/5 mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">
            No Members Found
          </h3>
          <p className="text-text-muted text-sm max-w-xs mx-auto">
            No team members matching your criteria were found in this project.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectTeam;

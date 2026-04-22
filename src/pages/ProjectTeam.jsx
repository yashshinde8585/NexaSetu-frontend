import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Box, Search, Mail, Clock, ShieldCheck, ChevronLeft } from 'lucide-react';
import TeamService from '../api/teamService';
import { USER_ROLES } from '../constants';


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

        let projectName = 'Global Operations';
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
        console.error('Squad linkage failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectSquad();
  }, [projectId]);

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
        return { color: 'text-status-success', shadow: 'rgba(34, 197, 94, 0.4)' };
      case 'Tech Lead':
      case 'QA Lead':
        return { color: 'text-primary', shadow: 'rgba(59, 130, 246, 0.4)' };
      case 'Senior Engineer':
      case 'Senior QA Engineer':
        return { color: 'text-purple-400', shadow: 'rgba(168, 85, 247, 0.4)' };
      default:
        return { color: 'text-white/60', shadow: 'transparent' };
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
    <div className="min-h-screen bg-black text-white px-3 sm:px-4 lg:px-6 py-4">
      <div className="w-full space-y-6 max-w-7xl mx-auto">
        
        {/* Navigation & Context Header */}
        <div className="space-y-6">
          <button
            onClick={() => navigate('/team')}
            className="group flex items-center gap-2 text-white/30 hover:text-white transition-all text-[9px] font-black uppercase tracking-[0.2em]"
          >
            <div className="w-7 h-7 rounded bg-black border border-white/10 flex items-center justify-center group-hover:border-primary">
              <ChevronLeft size={14} />
            </div>
            BACK TO DIRECTORY
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded border flex items-center justify-center ${projectId === 'unassigned' ? 'bg-white/5 border-white/10 text-white/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                {projectId === 'unassigned' ? <Users size={20} /> : <Box size={20} />}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase leading-none truncate max-w-[240px] sm:max-w-md">
                  {data.projectName}
                </h1>
                <div className="flex items-center gap-3 text-[9px] font-black text-white/30 uppercase tracking-[0.1em]">
                   <span className="flex items-center gap-2">
                      <Users size={10} className="text-primary" />
                      MEMBER LIST
                   </span>
                   <div className="w-1 h-1 bg-white/10 rounded-full" />
                   <span className="text-white/50">{data.members.length} TOTAL MEMBERS</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-xs relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors"
                size={14}
              />
              <input
                type="text"
                placeholder="SEARCH PERSONNEL..."
                className="w-full h-9 bg-black border border-white/10 text-white rounded px-4 pl-10 focus:outline-none focus:border-primary/50 transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tactical Personnel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[160px] bg-white/5 border border-white/10 rounded-xl animate-pulse"
              />
            ))
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.email}
                className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary/40 transition-all group flex flex-col h-full relative overflow-hidden"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-black rounded flex items-center justify-center text-lg font-black text-white border border-white/10 group-hover:border-primary/40 transition-all shrink-0">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-[13px] text-white tracking-tight truncate leading-tight mb-1 group-hover:text-primary transition-colors uppercase">
                      {member.name}
                    </h3>
                    <div className="text-[9px] font-black text-primary uppercase tracking-[0.1em] mb-2">
                      {member.jobTitle || 'POSITION NOT SET'}
                    </div>
                    <div className="flex items-center gap-2 text-white/30 text-[9px] font-black uppercase tracking-widest truncate">
                      <Mail size={10} className="text-white/10" />
                      {member.email}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-[0.1em]">
                    <Clock size={10} />
                    <span>JOINED {new Date(member.createdAt).toLocaleDateString()}</span>
                  </div>
                  <ShieldCheck
                    size={16}
                    className={`transition-all duration-500 ${getRoleVisuals(member.jobTitle).color}`}
                  />
                </div>

                {/* Hover Detail */}
                <div className="absolute top-4 right-4 text-[8px] font-black text-white/20 uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity">
                  MEMBER ID: {member._id?.slice(-8).toUpperCase()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State Manifest */}
        {!loading && filteredMembers.length === 0 && (
          <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-xl">
            <Users size={40} className="mx-auto text-white/10 mb-6" />
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
              ZERO PERSONNEL DETECTED
            </h3>
            <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] max-w-sm mx-auto">
              NO MEMBERS MATCH THE CURRENT SEARCH PARAMETERS FOR THIS SECTOR.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectTeam;

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

        let projectName = 'UNASSIGNED OPERATIONS';
        let filtered = [];

        if (projectId === 'unassigned') {
          projectName = 'UNASSIGNED MEMBERS';
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
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* Navigation & Context Header */}
        <div className="space-y-8">
          <button
            onClick={() => navigate('/team')}
            className="group flex items-center gap-3 text-white/50 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <div className="w-8 h-8 rounded-lg bg-black border border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-white/5">
              <ChevronLeft size={16} />
            </div>
            Back
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/20 pb-12">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl ${projectId === 'unassigned' ? 'bg-black text-white/60' : 'bg-primary/20 text-primary border-primary shadow-primary/10'}`}>
                {projectId === 'unassigned' ? <Users size={32} /> : <Box size={32} />}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-none truncate max-w-[280px] sm:max-w-md">
                    {data.projectName}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">
                   <span className="flex items-center gap-2">
                      <Users size={12} className="text-primary" />
                      Personnel Roster
                   </span>
                   <div className="w-1 h-1 bg-white/20 rounded-full" />
                   <span className="text-white/80">{data.members.length} Total Assignments</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-md relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="SEARCH PERSONNEL OR EMAIL..."
                className="w-full h-14 bg-black border border-white/20 text-white rounded-xl pl-12 pr-6 focus:outline-none focus:border-primary/60 focus:bg-white/5 transition-all text-[11px] font-black uppercase tracking-widest placeholder:text-white/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tactical Personnel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[210px] bg-black border border-white/20 rounded-2xl animate-pulse shadow-xl"
              />
            ))
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.email}
                className="bg-black p-8 rounded-2xl border border-white/20 hover:border-primary/60 transition-all duration-300 group flex flex-col h-full relative overflow-hidden shadow-xl"
              >
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-xl font-black text-white border border-white/20 group-hover:border-primary group-hover:bg-primary/10 transition-all shrink-0 shadow-lg">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-lg text-white tracking-tight truncate leading-tight mb-1 group-hover:text-primary-light transition-colors uppercase">
                      {member.name}
                    </h3>
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">
                      {member.jobTitle || 'UNCLASSIFIED'}
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-[11px] font-bold truncate">
                      <Mail size={12} className="text-white/20" />
                      {member.email}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/20">
                  <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-widest">
                    <Clock size={12} />
                    <span>ENLISTED</span>
                    <span className="text-white/80">{new Date(member.createdAt).toLocaleDateString()}</span>
                  </div>
                  <ShieldCheck
                    size={20}
                    className={`transition-all duration-500 ${getRoleVisuals(member.jobTitle).color}`}
                    style={{
                      filter: `drop-shadow(0 0 10px ${getRoleVisuals(member.jobTitle).shadow})`,
                    }}
                  />
                </div>

                {/* Hover Detail */}
                <div className="absolute top-4 right-4 text-[8px] font-black text-white/20 uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity">
                  ID: {member._id?.slice(-8).toUpperCase()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State Manifest */}
        {!loading && filteredMembers.length === 0 && (
          <div className="py-24 text-center bg-black border border-dashed border-white/20 rounded-[32px] animate-in zoom-in-95 duration-500 shadow-2xl">
            <Users size={64} className="mx-auto text-white/20 mb-8" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
              No Personnel Detected
            </h3>
            <p className="text-white/40 text-[11px] font-black uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
              Tactical query returned zero matches for this project environment.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectTeam;

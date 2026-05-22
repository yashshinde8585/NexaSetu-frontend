import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Box, Search, Mail, Clock, ShieldCheck, Rocket, AlertCircle, Loader2, ChevronLeft } from 'lucide-react';
import TeamService from '../api/teamService';
import { USER_ROLES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';

const ProjectTeam = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Data State
  const [data, setData] = useState({ projectName: '', members: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  /**
   * Fetch squad members with memory safety
   */
  const fetchProjectSquad = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError('');
      
      // We fetch all members for now, but filter based on project context
      // At true scale, we'd use a dedicated /team/project/:id API endpoint with pagination
      const res = await TeamService.getMembers({ limit: 1000 });
      
      if (signal.aborted) return;

      const allMembers = res?.members || [];

      let projectName = 'Global Operations';
      let filtered = [];

      if (projectId === 'unassigned') {
        projectName = 'Unassigned Members';
        filtered = allMembers.filter((m) => !m.assignedProjectId);
      } else {
        filtered = allMembers.filter(
          (m) => (m.assignedProjectId?.id || m.assignedProjectId?._id) === projectId
        );
        if (filtered.length > 0) {
          projectName = filtered[0].assignedProjectId.name;
        } else {
          // If no members found, we might still want to fetch project name from ProjectService
          projectName = 'Project Sector';
        }
      }

      setData({ projectName, members: filtered });
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('SQUAD_LINKAGE_FAILURE: DATA_STREAM_DISRUPTED.');
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchProjectSquad(abortController.signal);
    return () => abortController.abort();
  }, [fetchProjectSquad]);

  const ROLE_PRIORITY = {
    CTO: 1,
    'VP Engineering': 2,
    'Engineering Manager': 3,
    'HR': 4,
    'Tech Lead': 5,
    'QA Lead': 5,
    'Senior Engineer': 6,
    'Senior QA Engineer': 6,
    'Software Engineer': 7,
    'Junior Engineer': 8,
    'QA Engineer': 8,
    Intern: 9,
  };

  const getRoleVisuals = (title) => {
    const t = title?.toLowerCase() || '';
    if (t.includes('cto') || t.includes('vp') || t.includes('manager')) return { color: 'text-status-success' };
    if (t.includes('lead')) return { color: 'text-primary' };
    if (t.includes('senior')) return { color: 'text-purple-400' };
    return { color: 'text-white/40' };
  };

  const filteredMembers = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return data.members
      .filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
      .sort((a, b) => {
        const priorityA = ROLE_PRIORITY[a.jobTitle] || 99;
        const priorityB = ROLE_PRIORITY[b.jobTitle] || 99;
        return priorityA - priorityB;
      });
  }, [data.members, debouncedSearch]);

  return (
    <div className="min-h-screen bg-background text-text px-3 sm:px-4 lg:px-6 py-4">
      <div className="w-full space-y-6 max-w-7xl mx-auto">
        
        {/* Navigation & Context Header */}
        <div className="space-y-6">
          <button 
            onClick={() => navigate('/teams')}
            className="flex items-center gap-2 text-[9px] font-black text-white/20 hover:text-primary transition-all uppercase tracking-[0.2em]"
          >
            <ChevronLeft size={12} /> BACK TO DIRECTORY
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-xl font-black tracking-tighter text-white uppercase">{data.projectName}</h1>
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

        {error && (
          <div className="bg-status-error/5 border border-status-error/30 p-4 rounded-xl flex items-start gap-4">
            <AlertCircle className="text-status-error shrink-0 mt-0.5" size={16} />
            <div className="flex-1">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">LINK_FAILURE</h4>
              <p className="text-[9px] text-white/50 font-black uppercase tracking-widest">{error}</p>
            </div>
            <button onClick={() => fetchProjectSquad(new AbortController().signal)} className="p-2 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors">
              <Rocket size={14} />
            </button>
          </div>
        )}

        {/* Tactical Personnel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-[160px] bg-white/5 border border-white/10 rounded-xl animate-pulse" />
            ))
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary/40 transition-all group flex flex-col h-full relative overflow-hidden"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-black rounded flex items-center justify-center text-lg font-black text-white border border-white/10 group-hover:border-primary/40 transition-all shrink-0 overflow-hidden">
                    {member.profilePicture ? (
                      <img src={member.profilePicture} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-[13px] text-white tracking-tight truncate leading-tight mb-1 group-hover:text-primary transition-colors uppercase">
                      {member.name}
                    </h3>
                    <div className="flex flex-col gap-0.5 mb-2">
                      <div className="text-[9px] font-black text-primary uppercase tracking-[0.1em]">
                        {member.jobTitle || 'POSITION NOT SET'}
                      </div>
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
                    <span>JOINED {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <ShieldCheck
                    size={16}
                    className={`transition-all duration-500 ${getRoleVisuals(member.jobTitle).color}`}
                  />
                </div>

                <div className="absolute top-4 right-4 text-[8px] font-black text-white/20 uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity">
                  MEMBER ID: {member.id?.slice(-8).toUpperCase()}
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filteredMembers.length === 0 && (
          <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-xl">
            <Users size={40} className="mx-auto text-white/10 mb-6" />
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">ZERO PERSONNEL DETECTED</h3>
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

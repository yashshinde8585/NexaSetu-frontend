import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, ShieldCheck, UserPlus, Trash2, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import InviteModal from '../components/InviteModal';

const Team = () => {
    const { user } = useAuth();
    const [team, setTeam] = useState({ members: [], invitations: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/team/members');
            setTeam(res?.data?.data || { members: [], invitations: [] });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch team members');
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-primary/10 text-primary border-primary/20';
            case 'MANAGER': return 'bg-status-success/10 text-status-success border-status-success/20';
            case 'DEV': return 'bg-white/5 text-white/60 border-white/5';
            case 'INTERN': return 'bg-status-warning/10 text-status-warning border-status-warning/20';
            default: return 'bg-white/5 text-white/40';
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
    });

    const filteredMembers = team.members.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 pb-32 max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Personnel <span className="text-primary italic">Hub</span></h1>
                    </div>
                    <p className="text-text-muted text-sm font-medium">Govern your strategic human assets and pending recruitment pipelines.</p>
                </div>

                {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                    <button 
                        onClick={() => setIsInviteOpen(true)}
                        className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <UserPlus size={16} /> Deploy Invitations
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-3 rounded-xl mb-8 flex items-center gap-2">
                    <span className="text-lg">⚠️</span> {error}
                </div>
            )}

            {/* Controls */}
            <div className="flex gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email pipeline..."
                        className="w-full bg-white/5 border border-white/5 text-white rounded-2xl pl-12 pr-6 py-3 focus:outline-none focus:border-primary/40 transition-all text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl border border-white/5 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Active Members Grid */}
            <div className="space-y-4 mb-16">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Active Strategic Units</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                        <div key={member.email} className="group relative p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-3xl transition-all h-full">
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] rounded-lg border shadow-lg ${getRoleBadge(member.role)}`}>
                                    {member.role}
                                </span>
                            </div>
                            
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-linear-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center text-xl font-black text-white border border-white/5 group-hover:scale-110 transition-transform">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white tracking-tight">{member.name}</h3>
                                    <div className="flex items-center gap-1.5 text-text-muted text-[10px] font-medium mt-0.5">
                                        <Mail size={12} className="text-white/20" /> {member.email}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                <div className="flex items-center gap-1.5 text-text-muted text-[9px] font-black uppercase tracking-widest">
                                    <Clock size={12} /> Joined {formatDate(member.createdAt)}
                                </div>
                                <button className="p-2 text-white/5 hover:text-white/40 hover:bg-white/5 rounded-lg transition-all">
                                    <ShieldCheck size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pending Invitations */}
            {team.invitations.length > 0 && (
                <div className="space-y-4">
                    <div className="text-[10px] font-black text-status-warning/40 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                        <Rocket size={12} className="animate-pulse" /> Pending Pipeline Deployments
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {team.invitations.map((invite) => (
                            <div key={invite.email} className="p-5 bg-status-warning/[0.03] border border-status-warning/10 rounded-2xl flex justify-between items-center group hover:bg-status-warning/[0.05] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-status-warning/10 text-status-warning rounded-xl flex items-center justify-center border border-status-warning/20">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white">{invite.email}</span>
                                            <span className="px-2 py-0.5 bg-status-warning/10 text-status-warning border border-status-warning/20 text-[8px] font-black uppercase tracking-widest rounded-md">Pending</span>
                                        </div>
                                        <div className="text-[10px] font-medium text-text-muted mt-0.5 flex items-center gap-1.5 uppercase tracking-wide">
                                            Role: <span className="text-white/60">{invite.role}</span> · Expires: {formatDate(invite.expiresAt)}
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2.5 bg-white/5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && team.members.length === 0 && (
                <div className="py-20 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[40px]">
                   <Users size={64} className="mx-auto text-white/5 mb-6" />
                   <h3 className="text-xl font-bold text-white mb-2">Workspace Zero</h3>
                   <p className="text-text-muted text-sm max-w-xs mx-auto">No strategic personnel detected. Deploy invitations to populate your instance.</p>
                </div>
            )}

            <InviteModal isOpen={isInviteOpen} onClose={() => { setIsInviteOpen(false); fetchTeam(); }} />
        </div>
    );
};

export default Team;

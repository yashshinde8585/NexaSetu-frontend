import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Mail, 
    Shield, 
    Rocket, 
    Send, 
    Loader2, 
    CheckCircle, 
    AlertCircle, 
    UserPlus, 
    ChevronDown, 
    ChevronUp, 
    Plus, 
    Trash2, 
    User as UserIcon,
    ArrowLeft,
    Sparkles,
    Target,
    Zap,
    Copy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api/projectService';
import { inviteBulkMembers } from '../api/teamService';
import { useAuth } from '../context/AuthContext';

const ROLE_OPTIONS = [
    { value: 'WORKSPACE_ADMIN', jobTitle: 'CTO', label: 'CTO', description: 'Executive technical oversight' },
    { value: 'WORKSPACE_ADMIN', jobTitle: 'VP Engineering', label: 'VP Engineering', description: 'Strategic engineering leadership' },
    { value: 'WORKSPACE_MANAGER', jobTitle: 'Engineering Manager', label: 'Engineering Manager', description: 'Team execution & planning' },
    { value: 'WORKSPACE_MANAGER', jobTitle: 'Tech Lead', label: 'Tech Lead', description: 'Technical architecture & guidance' },
    { value: 'PROJECT_MEMBER', jobTitle: 'Senior Engineer', label: 'Senior Engineer', description: 'Core feature ownership' },
    { value: 'PROJECT_MEMBER', jobTitle: 'Software Engineer', label: 'Software Engineer', description: 'Feature development' },
    { value: 'RESTRICTED', jobTitle: 'Intern', label: 'Intern', description: 'Restricted learning access' }
];

const AddTeamMember = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [invites, setInvites] = useState([{ name: '', email: '', role: 'PROJECT_MEMBER', jobTitle: 'Software Engineer', projectId: '' }]);
    const [projects, setProjects] = useState([]);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    const isTechLead = user?.role === 'TECH_LEAD' || user?.jobTitle?.toUpperCase().includes('TECH LEAD');
    const filteredRoles = isTechLead 
        ? ROLE_OPTIONS.filter(r => ['Senior Engineer', 'Software Engineer', 'Intern'].includes(r.jobTitle))
        : ROLE_OPTIONS;

    useEffect(() => {
        const fetchProjectsData = async () => {
            try {
                const response = await getProjects();
                // Extremely safe structure check to handle nested or direct arrays
                const res = response?.data || response;
                const projectArray = Array.isArray(res?.projects) ? res.projects : 
                                     Array.isArray(res) ? res : [];
                setProjects(projectArray);
                
                // Set default project for rows that don't have one
                if (projectArray.length > 0) {
                    setInvites(prev => prev.map(inv => 
                        !inv.projectId ? { ...inv, projectId: projectArray[0]._id } : inv
                    ));
                }
            } catch (err) {
                console.error('Failed to load project list', err);
            }
        };
        fetchProjectsData();
    }, []);

    const addRow = () => {
        const defaultProjectId = projects.length > 0 ? projects[0]._id : '';
        setInvites([...invites, { 
            name: '', 
            email: '', 
            role: 'PROJECT_MEMBER', 
            jobTitle: 'Software Engineer', 
            projectId: defaultProjectId 
        }]);
    };

    const removeRow = (index) => {
        if (invites.length > 1) {
            setInvites(invites.filter((_, i) => i !== index));
        }
    };

    const updateRow = (index, field, value) => {
        const newInvites = [...invites];
        newInvites[index][field] = value;
        setInvites(newInvites);
    };

    const handleJobTitleChange = (idx, jobTitle) => {
        const option = ROLE_OPTIONS.find(o => o.jobTitle === jobTitle);
        const newInvites = [...invites];
        newInvites[idx].jobTitle = jobTitle;
        newInvites[idx].role = option.value;
        setInvites(newInvites);
    };

    const handleSendAll = async (e) => {
        e.preventDefault();
        const validInvites = invites.filter(i => i.email.trim() !== '');
        if (validInvites.length === 0) return;

        const missingIdentity = validInvites.find(i => !i.name.trim() || !i.email.trim());
        if (missingIdentity) {
            setError(`Identity data (Name & Email) is mandatory for every account.`);
            return;
        }

        setStatus('loading');
        setError('');

        try {
            const res = await inviteBulkMembers(validInvites);
            setResults(res?.data || res);
            setStatus('success');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to dispatch invitations.');
            setStatus('error');
        }
    };

    const provisionedUnits = results?.provisionedUsers || results?.data?.provisionedUsers || [];

    if (status === 'success') {
        const copyToClipboard = (text, fieldId) => {
            navigator.clipboard.writeText(text);
            setCopiedField(fieldId);
            setTimeout(() => setCopiedField(null), 2000);
        };

        return (
            <div className="min-h-[calc(100vh-64px)] bg-background-dark p-8 flex items-center justify-center animate-in fade-in zoom-in duration-500">
                <div className="max-w-2xl w-full bg-[#121826]/30 border border-white/5 rounded-[40px] p-10 md:p-14 text-center backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <div className="w-20 h-20 bg-status-success/10 text-status-success rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-status-success/20 shadow-xl shadow-status-success/5">
                        <CheckCircle size={40} strokeWidth={1.5} />
                    </div>
                    
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight uppercase">
                        Members <span className="text-primary">Invited</span>
                    </h2>
                    <p className="text-text-muted text-sm font-medium mb-12 opacity-50">New accounts have been provisioned successfully.</p>

                    <div className="space-y-4 mb-14 text-left max-h-[320px] overflow-y-auto pr-4 custom-scrollbar">
                        {provisionedUnits.map((res, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-white/[0.08] transition-all group/res overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 opacity-0 group-hover/res:opacity-100 transition-opacity"></div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    <div className="space-y-2">
                                        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Email Address</div>
                                        <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 group-hover/res:bg-white/5 transition-all">
                                            <span className="text-xs font-bold text-white truncate mr-3">{res.email}</span>
                                            <button 
                                                onClick={() => copyToClipboard(res.email, `email-${i}`)}
                                                className={`transition-colors active:scale-95 ${copiedField === `email-${i}` ? 'text-status-success' : 'text-white/20 hover:text-primary'}`}
                                                title="Copy Email"
                                            >
                                                {copiedField === `email-${i}` ? <CheckCircle size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Temporary Password</div>
                                        <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 group-hover/res:bg-white/5 transition-all">
                                            <span className="text-xs font-mono font-bold text-primary truncate mr-3">{res.email}</span>
                                            <button 
                                                onClick={() => copyToClipboard(res.email, `pwd-${i}`)}
                                                className={`transition-colors active:scale-95 ${copiedField === `pwd-${i}` ? 'text-status-success' : 'text-white/20 hover:text-primary'}`}
                                                title="Copy Password"
                                            >
                                                {copiedField === `pwd-${i}` ? <CheckCircle size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></div>
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Account Ready</span>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const emailText = `Hi ${res.name || 'there'},\n\nYou've been invited to join the NexaSetu workspace.\n\nLogin: ${res.email}\nTemp Password: ${res.email}\nDashboard: ${window.location.origin}/login\n\nPlease change your password after logging in.`;
                                            copyToClipboard(emailText, `invite-${i}`);
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 border ${copiedField === `invite-${i}` ? 'bg-status-success/10 border-status-success/20 text-status-success' : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white'}`}
                                    >
                                        {copiedField === `invite-${i}` ? <CheckCircle size={12} /> : <Send size={12} />}
                                        {copiedField === `invite-${i}` ? 'Invitation Copied!' : 'Copy Invitation Email'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => navigate('/team')}
                            className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={16} /> Return to Team
                        </button>
                        <button 
                            onClick={() => { 
                                setStatus('idle'); 
                                setInvites([{ name: '', email: '', role: 'PROJECT_MEMBER', jobTitle: 'Software Engineer', projectId: '' }]); 
                                setResults(null);
                            }}
                            className="flex-1 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> Invite More
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <form onSubmit={handleSendAll} className="space-y-10">

                <div className="space-y-6">
                    {invites.map((invite, idx) => (
                        <div key={idx} className="group relative bg-[#121826]/30 backdrop-blur-3xl border border-white/5 hover:border-white/10 rounded-[32px] p-8 transition-all duration-300 animate-in slide-in-from-bottom-2 shadow-2xl">
                            <div className="absolute top-8 left-[-10px] w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-[10px] font-black text-[#0B0F1A] shadow-lg shadow-primary/20">
                                {idx + 1}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="space-y-6">
                                    <div className="relative">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mb-2 block">Full Name</label>
                                        <div className="relative group/input">
                                            <input 
                                                type="text" 
                                                className="w-full bg-white/[0.03] border border-white/5 focus:border-primary/40 text-white rounded-xl px-5 py-4 outline-none transition-all placeholder:text-white/10 text-xs font-medium"
                                                placeholder="John Doe"
                                                required
                                                value={invite.name}
                                                onChange={(e) => updateRow(idx, 'name', e.target.value)}
                                            />
                                            <UserIcon size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-primary transition-colors" />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2 mb-2 block">Email Address</label>
                                        <div className="relative group/input">
                                            <input 
                                                type="email" 
                                                className="w-full bg-white/[0.03] border border-white/5 focus:border-primary/40 text-white rounded-xl px-5 py-4 outline-none transition-all placeholder:text-white/10 text-xs font-medium"
                                                placeholder="john@nexus.app"
                                                required
                                                value={invite.email}
                                                onChange={(e) => updateRow(idx, 'email', e.target.value)}
                                            />
                                            <Mail size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-primary transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.1em] ml-2 mb-2 block">Role</label>
                                        <div className="relative group/input">
                                            <select 
                                                className="w-full bg-white/[0.03] border border-white/5 focus:border-primary/40 text-white rounded-xl px-5 py-4 outline-none transition-all appearance-none cursor-pointer text-xs font-bold tracking-tight pr-12"
                                                value={invite.jobTitle}
                                                onChange={(e) => handleJobTitleChange(idx, e.target.value)}
                                            >
                                                {filteredRoles.map(r => <option key={r.jobTitle} value={r.jobTitle} className="bg-[#121826] text-white py-4">{r.label}</option>)}
                                            </select>
                                            <Shield size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-primary transition-colors pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.1em] ml-2 mb-2 block">Project Assignment</label>
                                        <div className="relative group/input">
                                            <select 
                                                className="w-full bg-white/[0.03] border border-white/5 focus:border-primary/40 text-white rounded-xl px-5 py-4 outline-none transition-all appearance-none cursor-pointer text-xs font-bold tracking-tight pr-12"
                                                value={invite.projectId}
                                                onChange={(e) => updateRow(idx, 'projectId', e.target.value)}
                                            >
                                                {projects.map(p => <option key={p._id} value={p._id} className="bg-[#121826] text-white">{p.name}</option>)}
                                            </select>
                                            <Rocket size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/5 group-focus-within/input:text-primary transition-colors pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Identity Profile Preview */}
                            <div className="mt-10 flex items-center gap-5 px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl group-hover:bg-white/[0.04] transition-all duration-500">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary shadow-[0_0_20px_rgba(var(--color-primary),0.1)]">
                                    <UserPlus size={24} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="text-[11px] font-black text-white uppercase tracking-widest leading-none">{invite.name || 'New Member'}</div>
                                    <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] leading-none">{invite.jobTitle}</div>
                                </div>
                            </div>

                            {invites.length > 1 && (
                                <button 
                                    type="button"
                                    onClick={() => removeRow(idx)}
                                    className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-400 text-white p-2 rounded-xl transition-all shadow-xl shadow-red-500/20 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Unified Action Bar */}
                <div className="pt-10 flex flex-col items-center gap-6">

                            <button 
                                type="submit"
                                disabled={status === 'loading'}
                                className="max-w-xl w-full py-5 bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-[0_0_50px_rgba(var(--color-primary),0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="animate-spin text-white" size={18} /> SENDING...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" /> SEND INVITATION
                                    </>
                                )}
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </button>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 animate-in shake">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddTeamMember;

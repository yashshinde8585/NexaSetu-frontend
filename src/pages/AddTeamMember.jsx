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
  Copy,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectService from '../api/projectService';
import TeamService from '../api/teamService';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES, JOB_TITLES } from '../constants';


// Handles the bulk invitation of new team members, providing role assignment and project scoping capabilities.
const AddTeamMember = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invites, setInvites] = useState([
    {
      name: '',
      email: '',
      role: USER_ROLES.PROJECT_MEMBER,
      jobTitle: 'Software Engineer',
      projectId: '',
    },
  ]);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [customRoles, setCustomRoles] = useState([]);

  const isTechLead =
    user?.role === USER_ROLES.TECH_LEAD ||
    user?.jobTitle?.toUpperCase().includes('TECH LEAD');

  const dynJobTitles = [
    ...JOB_TITLES,
    ...(customRoles.some(r => r.isCustom) ? [{
      category: 'Organizational Roles',
      roles: customRoles.filter(r => r.isCustom).map(r => ({ title: r.role.replace(/_/g, ' '), role: r.role }))
    }] : [])
  ];

  const filteredJobTitles = isTechLead
    ? dynJobTitles.map((group) => ({
        ...group,
        roles: group.roles.filter((r) =>
          ['Senior Engineer', 'Software Engineer', 'Junior Engineer', 'Intern', 'QA Engineer / Software Tester'].includes(r.title)
        ),
      })).filter((group) => group.roles.length > 0)
    : dynJobTitles;

  const allRoleOptions = dynJobTitles.flatMap(g => g.roles);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const [projRes, roleRes] = await Promise.all([
          ProjectService.getProjects(),
          TeamService.getRoles()
        ]);

        const projectArray = Array.isArray(projRes?.data?.projects)
          ? projRes.data.projects
          : projRes?.projects || projRes || [];
        setProjects(projectArray);

        if (roleRes?.data?.roles) {
          setCustomRoles(roleRes.data.roles);
        }

        if (projectArray.length > 0) {
          setInvites((prev) =>
            prev.map((inv) =>
              !inv.projectId ? { ...inv, projectId: projectArray[0]._id } : inv
            )
          );
        }
      } catch (err) {
        console.error('Failed to load team data', err);
      }
    };
    fetchTeamData();
  }, []);

  const addRow = () => {
    const defaultProjectId = projects.length > 0 ? projects[0]._id : '';
    setInvites([
      ...invites,
      {
        name: '',
        email: '',
        role: USER_ROLES.PROJECT_MEMBER,
        jobTitle: 'Software Engineer',
        projectId: defaultProjectId,
      },
    ]);
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
    const option = allRoleOptions.find((o) => o.title === jobTitle);
    if (!option) return;
    const newInvites = [...invites];
    newInvites[idx].jobTitle = jobTitle;
    newInvites[idx].role = option.role;
    setInvites(newInvites);
  };


  const handleSendAll = async (e) => {
    e.preventDefault();
    const validInvites = invites.filter((i) => i.email.trim() !== '');
    if (validInvites.length === 0) return;

    const missingIdentity = validInvites.find(
      (i) => !i.name.trim() || !i.email.trim()
    );
    if (missingIdentity) {
      setError(`Identity data (Name & Email) is mandatory for every account.`);
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const res = await TeamService.inviteBulk({ invites: validInvites });
      setResults(res);
      setStatus('success');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to dispatch invitations.'
      );
      setStatus('error');
    }
  };

  const provisionedUnits =
    results?.provisionedUsers || results?.data?.provisionedUsers || [];

  if (status === 'success') {
    const copyToClipboard = (text, fieldId) => {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    };

    return (
      <div className="min-h-[calc(100vh-64px)] bg-black p-8 flex items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="max-w-2xl w-full bg-black border border-white/20 rounded-[40px] p-10 md:p-14 text-center shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="w-20 h-20 bg-status-success/10 text-status-success rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-status-success/20 shadow-xl shadow-status-success/5">
            <CheckCircle size={40} strokeWidth={1.5} />
          </div>

          <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">
            PERSONNEL <span className="text-primary">INVITED</span>
          </h2>
          <p className="text-white/50 text-sm font-black uppercase tracking-wider mb-12">
            New accounts have been provisioned successfully.
          </p>

          <div className="space-y-4 mb-14 text-left max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {provisionedUnits.length > 0 ? (
              provisionedUnits.map((res, i) => (
                <div
                  key={i}
                  className="bg-black border border-white/15 rounded-3xl p-8 hover:bg-white/5 hover:border-primary/30 transition-all group/res overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover/res:opacity-100 transition-opacity"></div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">
                        {res.name || 'New Member'}
                      </div>
                      <div className="text-xs font-black text-white truncate max-w-[200px] tracking-widest">
                        {res.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const emailText = `Hi ${res.name || 'there'},\n\nYou've been invited to join the NexaSetu workspace.\n\nLogin: ${res.email}\nTemp Password: ${res.email}\nDashboard: ${window.location.origin}/login\n\nPlease change your password after logging in.`;
                        copyToClipboard(emailText, `invite-${i}`);
                      }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border ${copiedField === `invite-${i}` ? 'bg-status-success/10 border-status-success/20 text-status-success' : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white'}`}
                    >
                      {copiedField === `invite-${i}` ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Send size={14} />
                      )}
                      {copiedField === `invite-${i}` ? 'Copied!' : 'Copy Invitation'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-white/20 text-xs font-bold uppercase tracking-widest border border-dashed border-white/5 rounded-3xl">
                No new members were provisioned
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/team')}
              className="flex-1 py-5 bg-black hover:bg-white/5 text-white/60 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl border border-white/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <ArrowLeft size={16} /> RETURN TO REGISTRY
            </button>
            <button
              onClick={() => {
                setStatus('idle');
                setInvites([
                  {
                    name: '',
                    email: '',
                    role: USER_ROLES.PROJECT_MEMBER,
                    jobTitle: 'Software Engineer',
                    projectId: '',
                  },
                ]);
                setResults(null);
              }}
              className="flex-1 py-5 bg-primary text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl shadow-xl hover:bg-primary-dark shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Plus size={18} strokeWidth={3} /> INVITE MORE
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
            <div
              key={idx}
              className="group relative bg-black border border-white/20 hover:border-white/30 rounded-[32px] p-8 sm:p-10 transition-all duration-300 animate-in slide-in-from-bottom-2 shadow-3xl"
            >
              <div className="absolute top-8 left-[-10px] w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-[10px] font-black text-[#0B0F1A] shadow-lg shadow-primary/20">
                {idx + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                  <div className="relative">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-2 mb-3 block">
                      Full Name
                    </label>
                    <div className="relative group/input">
                      <input
                        type="text"
                        className="w-full bg-black border border-white/20 focus:border-primary focus:bg-white/5 text-white rounded-xl px-5 py-4 outline-none transition-all placeholder:text-white/20 text-xs font-black tracking-widest uppercase shadow-inner"
                        placeholder="E.G. JOHN DOE"
                        required
                        value={invite.name}
                        onChange={(e) => updateRow(idx, 'name', e.target.value)}
                      />
                      <UserIcon
                        size={16}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-2 mb-3 block">
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <input
                        type="email"
                        className="w-full bg-black border border-white/20 focus:border-primary focus:bg-white/5 text-white rounded-xl px-5 py-4 outline-none transition-all placeholder:text-white/20 text-xs font-black tracking-widest uppercase shadow-inner"
                        placeholder="JOHN@NEXUS.APP"
                        required
                        value={invite.email}
                        onChange={(e) =>
                          updateRow(idx, 'email', e.target.value)
                        }
                      />
                      <Mail
                        size={16}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-2 mb-3 block">
                      Role Assignment
                    </label>
                    <div className="relative group/input">
                        <select
                          className="w-full bg-black border border-white/20 focus:border-primary focus:bg-white/5 text-white rounded-xl px-5 py-4 outline-none transition-all appearance-none cursor-pointer text-xs font-black tracking-widest uppercase shadow-inner pr-12"
                          value={invite.jobTitle}
                          onChange={(e) =>
                            handleJobTitleChange(idx, e.target.value)
                          }
                        >
                          {filteredJobTitles.map((group) => (
                            <optgroup
                              key={group.category}
                              label={group.category}
                              className="bg-black text-primary/70 text-[10px] uppercase font-black tracking-widest py-3"
                            >
                              {group.roles.map((r) => (
                                <option
                                  key={r.title}
                                  value={r.title}
                                  className="bg-black text-white py-4 font-black uppercase tracking-widest text-[11px]"
                                >
                                  {r.title}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>

                      <Shield
                        size={16}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors pointer-events-none"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-2 mb-3 block">
                      Deployment Sector
                    </label>
                    <div className="relative group/input">
                      <select
                        className="w-full bg-black border border-white/20 focus:border-primary focus:bg-white/5 text-white rounded-xl px-5 py-4 outline-none transition-all appearance-none cursor-pointer text-xs font-black tracking-widest uppercase shadow-inner pr-12"
                        value={invite.projectId}
                        onChange={(e) =>
                          updateRow(idx, 'projectId', e.target.value)
                        }
                      >
                        {projects.map((p) => (
                          <option
                            key={p._id}
                            value={p._id}
                            className="bg-black text-white font-black uppercase tracking-widest"
                          >
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <Rocket
                        size={16}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-primary transition-colors pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Identity Profile Preview */}
              <div className="mt-10 flex items-center gap-5 px-6 py-5 bg-black border border-white/20 rounded-2xl group-hover:border-primary/40 group-hover:bg-white/5 transition-all duration-500 shadow-inner overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-white/20 group-hover:bg-primary transition-colors"></div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-white/50 group-hover:text-primary group-hover:border-primary/30 transition-colors shadow-xl ml-3">
                  <UserPlus size={24} />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="text-[12px] font-black text-white uppercase tracking-widest leading-none truncate">
                    {invite.name || 'NEW PERSONNEL'}
                  </div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none truncate">
                    {invite.jobTitle}
                  </div>
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
            className="max-w-xl w-full h-16 bg-primary hover:bg-primary-dark disabled:opacity-50 text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl shadow-2xl shadow-primary/40 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="animate-spin text-black" size={20} />{' '}
                DISPATCHING...
              </>
            ) : (
              <>
                <Send
                  size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={2.5}
                />{' '}
                DISPATCH INVITATION PROTOCOL
              </>
            )}
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

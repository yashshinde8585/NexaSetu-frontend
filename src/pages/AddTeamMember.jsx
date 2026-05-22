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
import { BackButton } from '../components/atoms';
import TacticalCustomSelect from '../components/molecules/TacticalCustomSelect';
import MetricsService from '../api/metricsService';


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
          ['Senior Engineer', 'Software Engineer', 'Junior Engineer', 'Intern', 'QA Engineer'].includes(r.title)
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
      setError(`Name and email are required for each invitation.`);
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const res = await TeamService.inviteBulk({ invites: validInvites });
      setResults(res);
      setStatus('success');
      MetricsService.trackEvent('invites_sent', { count: validInvites.length });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to send invitations. Please try again.'
      );
      setStatus('error');
    } finally {
      setStatus(prev => prev === 'success' ? 'success' : 'idle');
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
      <div className="min-h-[calc(100vh-64px)] bg-background text-text px-3 sm:px-4 lg:px-6 py-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-xl p-6 sm:p-10 text-center relative overflow-hidden">

          <div className="w-16 h-16 bg-status-success/10 text-status-success rounded-xl flex items-center justify-center mx-auto mb-6 border border-status-success/20">
            <CheckCircle size={32} strokeWidth={2} />
          </div>

          <h2 className="text-xl font-black text-white mb-2">
            Invitations sent
          </h2>
          <p className="text-white/20 text-[9px] font-black mb-8">
            Personnel dispatched to workspace uplink.
          </p>

          <div className="space-y-3 mb-10 text-left max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {provisionedUnits.length > 0 ? (
              provisionedUnits.map((res, i) => (
                <div
                  key={i}
                  className="bg-black border border-white/10 rounded-lg p-5 hover:border-primary/30 transition-all group/res overflow-hidden relative"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover/res:opacity-100 transition-opacity"></div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[9px] font-black text-white/30 mb-0.5 truncate">
                        {res.name || 'New operative'}
                      </div>
                      <div className="text-[10px] font-black text-white truncate">
                        {res.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const emailText = `Hi ${res.name || 'there'},\n\nYou’ve been invited to join the NexaSetu workspace.\n\n**Login Details:**\n\n* Email: ${res.email}\n* Temporary Password: ${res.email}\n\n**Access your dashboard:**\n${window.location.origin}/login\n\nFor security reasons, please log in and change your password immediately.\n\nBest regards,\nNexaSetu Team`;
                        copyToClipboard(emailText, `invite-${i}`);
                      }}
                      className={`h-9 px-4 rounded text-[9px] font-black transition-all active:scale-95 border shrink-0 ${copiedField === `invite-${i}` ? 'bg-status-success/10 border-status-success/20 text-status-success' : 'bg-primary text-black border-primary'}`}
                    >
                      {copiedField === `invite-${i}` ? 'Copied' : 'Copy invite'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-white/10 text-[9px] font-black border border-dashed border-white/10 rounded-xl">
                No invitations sent
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <BackButton onClick={() => navigate('/team')} className="flex-1" />
            <button
              onClick={() => {
                setStatus('idle');
                setInvites([{ name: '', email: '', role: USER_ROLES.PROJECT_MEMBER, jobTitle: 'Software Engineer', projectId: '' }]);
                setResults(null);
              }}
              className="flex-1 h-10 bg-primary text-black font-black text-[9px] rounded transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Dispatch more
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4 max-w-5xl mx-auto">
      {/* Strategic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <h1 className="text-[14px] font-black tracking-widest uppercase text-white">
            INVITE TEAM MEMBERS
          </h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] max-w-xl">
            Expand your workspace by inviting new personnel and assigning tactical roles.
          </p>
        </div>
      </div>

      <form onSubmit={handleSendAll} className="space-y-4">
        <div className="space-y-4">
          {invites.map((invite, idx) => (
            <div
              key={idx}
              className="group relative bg-white/5 border border-white/10 hover:border-primary/40 rounded-xl p-6 sm:p-8 transition-all"
            >
              <div className="absolute top-6 left-[-8px] w-5 h-5 bg-primary rounded flex items-center justify-center text-[9px] font-black text-black">
                {idx + 1}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-5">
                  <div className="relative">
                    <label className="text-[9px] font-black text-white/20 ml-1 mb-2 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full h-9 bg-black border border-white/10 focus:border-primary focus:bg-white/5 text-white rounded px-4 outline-none transition-all placeholder:text-white/10 text-[10px] font-black"
                        placeholder="e.g. Alex Johnson" 
                        required
                        value={invite.name}
                        onChange={(e) => updateRow(idx, 'name', e.target.value)}
                      />
                      <UserIcon
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-[9px] font-black text-white/20 ml-1 mb-2 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        className="w-full h-9 bg-black border border-white/10 focus:border-primary focus:bg-white/5 text-white rounded px-4 outline-none transition-all placeholder:text-white/10 text-[10px] font-black"
                        placeholder="alex@company.com" 
                        required
                        value={invite.email}
                        onChange={(e) =>
                          updateRow(idx, 'email', e.target.value)
                        }
                      />
                      <Mail
                        size={14}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="relative">
                    <TacticalCustomSelect
                      label="Assign Role"
                      value={invite.jobTitle}
                      onChange={(val) => handleJobTitleChange(idx, val)}
                      icon={<Shield size={14} />}
                      options={filteredJobTitles.flatMap(group => [
                        { label: group.category, isGroup: true },
                        ...group.roles.map(r => ({ label: r.title, value: r.title }))
                      ])}
                    />
                  </div>
                  <div className="relative">
                    <TacticalCustomSelect
                      label="Assign to Project"
                      value={invite.projectId}
                      onChange={(val) => updateRow(idx, 'projectId', val)}
                      icon={<Rocket size={14} />}
                      displayValue={projects.find(p => p._id === invite.projectId)?.name}
                      options={projects.map(p => ({ label: p.name, value: p._id }))}
                    />
                  </div>
                </div>
              </div>

              {/* Identity Profile Preview */}
              <div className="mt-8 flex items-center gap-4 px-4 py-3 bg-black border border-white/10 rounded flex-wrap group-hover:border-primary/20 transition-all">
                <div className="w-10 h-10 bg-white/5 rounded border border-white/10 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                  <UserPlus size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-[11px] font-black text-white leading-none mb-1 truncate">
                    {invite.name || 'New operative'}
                  </div>
                  <div className="text-[9px] font-black text-primary leading-none truncate">
                    {invite.jobTitle}
                  </div>
                </div>
              </div>

              {invites.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  className="absolute -top-2 -right-2 bg-status-error text-white p-1.5 rounded transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Unified Action Bar */}
        <div className="pt-6 flex flex-col items-center gap-4">
          <div className="flex w-full max-w-xl gap-3">
             <button
               type="button"
               onClick={addRow}
               className="flex-1 h-10 bg-white/5 hover:bg-white/10 text-white/40 font-black text-[9px] rounded border border-white/10 transition-all flex items-center justify-center gap-2"
             >
               <Plus size={14} /> Add unit
             </button>
             <button
               type="submit"
               disabled={status === 'loading'}
               className="flex-[2] h-10 bg-primary text-black font-black text-[10px] rounded transition-all flex items-center justify-center gap-2"
             >
               {status === 'loading' ? (
                 <>
                   <Loader2 className="animate-spin text-black" size={16} /> Dispatching...
                 </>
               ) : (
                 <>
                   <Send size={16} /> Send invitations
                 </>
               )}
             </button>
          </div>

          {error && (
            <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-2 rounded text-[8px] font-black flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddTeamMember;

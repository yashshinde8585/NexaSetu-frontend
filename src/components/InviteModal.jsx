import React, { useState, useEffect } from 'react';
import {
  X,
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
} from 'lucide-react';
import ProjectService from '../api/projectService';
import TeamService from '../api/teamService';
import { USER_ROLES, JOB_TITLES } from '../constants';

const ALL_ROLE_OPTIONS = JOB_TITLES.flatMap((group) => group.roles);




// A modal dialog that allows administrators to invite new team members in bulk.
const InviteModal = ({ isOpen, onClose }) => {
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  // Fetches all available projects to allow team member assignments.
  useEffect(() => {
    if (isOpen) {
      const fetchProjectsData = async () => {
        try {
          setError('');
          const res = await ProjectService.getProjects();
          setProjects(res.projects || res || []);
        } catch (err) {
          setError(
            'Failed to load project list. Assignments will be unavailable.'
          );
        }
      };
      fetchProjectsData();
      setInvites([
        {
          name: '',
          email: '',
          role: USER_ROLES.PROJECT_MEMBER,

          jobTitle: 'Software Engineer',
          projectId: '',
        },
      ]);
      setStatus('idle');
      setResults(null);
    }
  }, [isOpen]);

  // Adds a new row to the invitation form for another team member.
  const addRow = () => {
    setInvites([
      ...invites,
      {
        name: '',
        email: '',
        role: USER_ROLES.PROJECT_MEMBER,

        jobTitle: 'Software Engineer',
        projectId: '',
      },
    ]);
  };

  // Removes a specific row from the invitation form.
  const removeRow = (index) => {
    if (invites.length > 1) {
      setInvites(invites.filter((_, i) => i !== index));
    }
  };

  // Updates a specific field for a team member's invitation data.
  const updateRow = (index, field, value) => {
    const newInvites = [...invites];
    newInvites[index][field] = value;
    setInvites(newInvites);
  };

  // Finds and assigns the correct role based on user selection.
  const handleRoleChange = (index, roleValue) => {
    const option = ALL_ROLE_OPTIONS.find((o) => o.role === roleValue);
  };


  // Updates the job title and corresponding role for an invitation entry.
  const handleJobTitleChange = (idx, jobTitle) => {
    const option = ALL_ROLE_OPTIONS.find((o) => o.title === jobTitle);
    const newInvites = [...invites];
    newInvites[idx].jobTitle = jobTitle;
    newInvites[idx].role = option.role;
    setInvites(newInvites);
  };


  // Dispatches all valid invitations to the server for processing.
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
      const res = await TeamService.inviteBulk(validInvites);
      const resultsData = res?.data || res;
      setResults(resultsData);
      setStatus('success');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to dispatch invitations.'
      );
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  // Robust extraction for UI mapping
  const provisionedUnits = results?.sent || results?.data?.sent || [];
  const failedUnits = results?.failed || results?.data?.failed || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`max-w-2xl w-full bg-background-dark border border-white/5 rounded-[32px] shadow-2xl relative overflow-hidden transition-all duration-500 transform ${status === 'success' ? 'scale-100' : 'scale-100'}`}
      >
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter mb-1 select-none">
              Invite to Workspace
            </h2>
            <p className="text-text-muted text-[11px] font-medium tracking-tight">
              Send email invitations to bring your team into NexaSetu.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-text-muted"
            >
              <X size={20} />
            </button>
            <span className="px-3 py-1 bg-status-success/10 text-status-success text-[9px] font-black uppercase tracking-widest rounded-full border border-status-success/20">
              3 / 5 Seats Available
            </span>
          </div>
        </div>

        {status === 'success' ? (
          <div className="p-8 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-status-success/20 text-status-success rounded-full flex items-center justify-center mx-auto mb-6 border border-status-success/30 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
              Squad Provisioned Successfully
            </h3>
            <p className="text-text-muted text-sm mb-6 px-12">
              Accounts have been birthed. Your team can now login immediately
              using their{' '}
              <span className="text-primary font-bold italic">Email</span> as
              their temporary{' '}
              <span className="text-primary font-bold italic">Password</span>.
            </p>

            <div className="mx-8 bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-10 overflow-hidden">
              <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 text-left ml-2">
                Active Strategic Credentials
              </div>
              <div className="space-y-2.5 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                {provisionedUnits.length === 0 && (
                  <div className="text-[10px] text-text-muted font-bold py-4 italic">
                    Processing credential records...
                  </div>
                )}
                {provisionedUnits.map((res, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 group hover:bg-white/10 transition-all"
                  >
                    <div className="flex flex-col items-start gap-1 text-left">
                      <span className="text-xs font-bold text-white tracking-tight">
                        {res.email}
                      </span>
                      <span className="text-[10px] text-primary/60 font-medium italic">
                        Password: {res.email}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-status-success/10 text-status-success text-[8px] font-black uppercase tracking-widest rounded-md border border-status-success/20">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-8 flex gap-3 mb-8">
              <button
                type="button"
                onClick={() => {
                  const hubUrl = window.location.origin;
                  const credList = provisionedUnits
                    .map((res) => `- ${res.email} (Password: ${res.email})`)
                    .join('\n');
                  const text = `Welcome to the squad! Your NexaSetu accounts have been provisioned. \n\nAccess the Hub: ${hubUrl}/login \nTemporary Password: Use your Email address. \n\nProvisioned Units:\n${credList || 'Manual confirmation required via dashboard'}\n\nSee you in the workspace! 🛰️`;
                  navigator.clipboard.writeText(text);
                  alert('Full Onboarding Brief copied to clipboard!');
                }}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Rocket size={14} className="text-primary" /> Copy Invite
                Message
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendAll} className="flex flex-col">
            <div className="p-8 pt-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {invites.map((invite, idx) => (
                  <div
                    key={idx}
                    className="group animate-in fade-in slide-in-from-left-4 duration-300 bg-white/[0.02] p-4 rounded-3xl border border-white/5"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <div className="relative group">
                          <input
                            type="text"
                            className="w-full bg-white/5 border border-white/5 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/40 transition-all font-medium placeholder:text-white/10 text-xs"
                            placeholder="Full Name (e.g. John Doe)"
                            required
                            value={invite.name}
                            onChange={(e) =>
                              updateRow(idx, 'name', e.target.value)
                            }
                          />
                          <UserIcon
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/5 group-focus-within:text-primary/40 transition-colors"
                            size={14}
                          />
                        </div>
                        <div className="relative group">
                          <input
                            type="email"
                            className="w-full bg-white/5 border border-white/5 text-white rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/40 transition-all font-medium placeholder:text-white/10 text-xs"
                            placeholder="email@company.com"
                            required
                            value={invite.email}
                            onChange={(e) =>
                              updateRow(idx, 'email', e.target.value)
                            }
                          />
                          <Mail
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/5 group-focus-within:text-primary/40 transition-colors"
                            size={14}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className={`mt-1.5 p-3.5 rounded-2xl bg-white/5 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all ${invites.length === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {showAdvanced && (
                      <div className="grid grid-cols-2 gap-3 mt-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="relative">
                          <select
                            className="w-full bg-white/5 border border-white/5 text-white/60 rounded-2xl px-5 py-3 focus:outline-none focus:border-primary/40 transition-all font-bold text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                            value={invite.jobTitle}
                            onChange={(e) =>
                              handleJobTitleChange(idx, e.target.value)
                            }
                          >
                            {JOB_TITLES.map((group) => (
                              <optgroup
                                key={group.category}
                                label={group.category}
                                className="bg-[#1E1E2E] text-primary/50 text-[10px] uppercase font-black tracking-widest py-2"
                              >
                                {group.roles.map((r) => (
                                  <option
                                    key={r.title}
                                    value={r.title}
                                    className="bg-[#1E1E2E] text-white"
                                  >
                                    {r.title}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>

                          <Shield
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10"
                            size={12}
                          />
                        </div>
                        <div className="relative text-white">
                          <select
                            className="w-full bg-white/5 border border-white/5 text-white/60 rounded-2xl px-5 py-3 focus:outline-none focus:border-primary/40 transition-all font-bold text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                            value={invite.projectId}
                            onChange={(e) =>
                              updateRow(idx, 'projectId', e.target.value)
                            }
                          >
                            <option
                              value=""
                              className="bg-[#1E1E2E] text-white"
                            >
                              No Project Assignment
                            </option>
                            {projects.map((p) => (
                              <option
                                key={p._id}
                                value={p._id}
                                className="bg-[#1E1E2E] text-white"
                              >
                                {p.name}
                              </option>
                            ))}
                          </select>
                          <Rocket
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10"
                            size={12}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={addRow}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 border border-white/5"
                >
                  <Plus size={14} /> Add another member
                </button>

                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-[9px] font-black text-white/20 hover:text-white uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                >
                  {showAdvanced ? (
                    <ChevronUp size={12} />
                  ) : (
                    <ChevronDown size={12} />
                  )}
                  {showAdvanced
                    ? 'Hide Advanced Options'
                    : 'Show Advanced Options'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
              <button
                type="button"
                onClick={onClose}
                className="text-[10px] font-black text-text-muted hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-10 py-4 bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 relative overflow-hidden group"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />{' '}
                    Dispatching...
                  </>
                ) : (
                  <>
                    <Send
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                    Send {invites.filter((i) => i.email.trim() !== '').length}{' '}
                    Invite
                    {invites.filter((i) => i.email.trim() !== '').length !== 1
                      ? 's'
                      : ''}
                  </>
                )}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="mx-8 mb-8 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in-95">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteModal;

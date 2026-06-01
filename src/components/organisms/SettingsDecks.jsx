import React from 'react';
import PropTypes from 'prop-types';
import {
  Camera,
  UserCircle,
  AtSign,
  BadgeCheck,
  Clock,
  Lock,
  ChevronRight,
  Loader2,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../api/authApi';

// ─── Section wrapper ──────────────────────────────────────────────────────────
const DeckWrapper = ({ title, children }) => (
  <div className="bg-white/5 border border-white/10 rounded p-3 sm:p-4 space-y-4">
    <div className="flex items-center gap-2">
      <div className="h-3.5 w-0.5 bg-primary rounded-full" />
      <h2 className="text-[10px] font-black text-white uppercase tracking-widest">
        {title}
      </h2>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

// ─── Compact field label ──────────────────────────────────────────────────────
const FieldLabel = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] block mb-1"
  >
    {children}
  </label>
);

// ─── Read-only display field ──────────────────────────────────────────────────
const ReadField = ({ icon: Icon, value }) => (
  <div className="flex items-center gap-2.5 h-9 px-3 bg-black border border-white/5 rounded text-white/40">
    <Icon size={12} className="shrink-0" />
    <span className="text-[10px] font-bold truncate">{value}</span>
  </div>
);

// ─── Password input with show/hide ───────────────────────────────────────────
const PasswordField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={id}
        className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1"
      >
        {label}
      </label>
      <div className="relative group">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="w-full px-4 py-3 pr-10 bg-black rounded-xl border border-white/20 focus:border-primary focus:bg-white/5 focus:outline-none transition-all text-[12px] font-black text-white placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors disabled:opacity-40"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
    </div>
  );
};

// ─── Change Password Modal ────────────────────────────────────────────────────
const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (form.newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setStatus('loading');
    try {
      await changePassword(
        form.currentPassword,
        form.newPassword,
        form.confirmPassword
      );
      setStatus('success');
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';
  const strength = Math.min(4, Math.floor(form.newPassword.length / 3));
  const strengthColor =
    strength <= 1
      ? 'bg-red-500'
      : strength <= 2
        ? 'bg-yellow-400'
        : 'bg-green-400';

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-w-sm w-full bg-background-dark border border-white/5 rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex justify-between items-start px-6 pt-6 pb-3">
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter">
              Change Password
            </h2>
            <p className="text-text-muted text-[10px] font-medium mt-0.5">
              Keep your account secure with a strong password.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-text-muted"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        {status === 'success' ? (
          <div className="px-6 pb-6 text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-status-success/20 text-status-success rounded-full flex items-center justify-center mx-auto mb-4 border border-status-success/30 drop-shadow-[0_0_12px_rgba(34,197,94,0.3)]">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
              Password Updated
            </h3>
            <p className="text-text-muted text-xs mb-5">
              Your credentials have been changed successfully.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="px-6 pb-4 space-y-3">
              <PasswordField
                id="cp-current"
                label="Current Password"
                value={form.currentPassword}
                onChange={set('currentPassword')}
                placeholder="Enter your current password"
                disabled={isLoading}
              />
              <PasswordField
                id="cp-new"
                label="New Password"
                value={form.newPassword}
                onChange={set('newPassword')}
                placeholder="At least 8 characters"
                disabled={isLoading}
              />

              {/* Strength bar */}
              {form.newPassword.length > 0 && (
                <div className="flex gap-1 px-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i < strength ? strengthColor : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              )}

              <PasswordField
                id="cp-confirm"
                label="Confirm New Password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Repeat your new password"
                disabled={isLoading}
              />

              {/* Error */}
              {(status === 'error' || errorMsg) && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in-95">
                  <AlertCircle size={12} className="shrink-0" />
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-[10px] font-black text-text-muted hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-7 py-3 bg-primary hover:opacity-90 disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 relative overflow-hidden group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} /> Updating…
                  </>
                ) : (
                  <>
                    <ShieldCheck
                      size={14}
                      className="group-hover:scale-110 transition-transform"
                    />{' '}
                    Update Password
                  </>
                )}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};

// ─── Profile identity section ─────────────────────────────────────────────────
export const IdentitySection = ({ user }) => {
  const { updateAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds the 2 MB limit.');
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      setIsUploading(true);
      await updateAvatar(formData);
    } catch (err) {
      console.error('Avatar upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const displayName =
    user.name || user.fullName || user.firstName || user.username || 'User';
  const displayEmail =
    user.email ||
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    '';
  const displayAvatar = user.profilePicture || user.imageUrl;
  const displayTitle =
    user.jobTitle ||
    (user.role && user.role.replace('_', ' ')) ||
    (user.publicMetadata?.role &&
      String(user.publicMetadata.role).replace('_', ' ')) ||
    'Team Member';

  return (
    <DeckWrapper title="User Profile">
      {/* Avatar + info row */}
      <div className="flex items-center gap-4 p-3 bg-black border border-white/10 rounded">
        {/* Avatar */}
        <div className="relative shrink-0">
          <button
            onClick={handleAvatarClick}
            className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group focus:outline-none"
          >
            {displayAvatar ? (
              <img
                src={displayAvatar}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                alt={displayName}
              />
            ) : (
              <span className="text-lg font-black text-white/50">
                {displayName.charAt(0)}
              </span>
            )}
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={12} className="text-white" />
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-primary" size={14} />
              </div>
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">
            Active User
          </div>
          <div className="text-[12px] font-black text-white uppercase tracking-wider truncate">
            {displayName}
          </div>
          <div className="text-[9px] text-white/50 truncate">
            {displayEmail}
          </div>
        </div>

        {/* Upload hint */}
        <button
          onClick={handleAvatarClick}
          className="shrink-0 text-[8px] font-black uppercase tracking-widest text-primary/70 hover:text-primary transition-colors hidden sm:block"
        >
          Change
        </button>
      </div>

      {/* Fields grid — 2 columns on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <ReadField icon={UserCircle} value={displayName} />
        </div>
        <div>
          <FieldLabel>Email Address</FieldLabel>
          <ReadField icon={AtSign} value={displayEmail} />
        </div>
        <div>
          <FieldLabel>Current Role</FieldLabel>
          <ReadField icon={BadgeCheck} value={displayTitle} />
        </div>
        <div>
          <FieldLabel>Member Since</FieldLabel>
          <ReadField
            icon={Clock}
            value={
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'
            }
          />
        </div>
      </div>
    </DeckWrapper>
  );
};

// ─── Account security section ─────────────────────────────────────────────────
export const SecuritySection = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <DeckWrapper title="Account Security">
        <div className="grid grid-cols-1 gap-2">
          <SecurityRow
            icon={<Lock size={13} />}
            title="Change Password"
            desc="Regularly update your credentials."
            onClick={() => setShowModal(true)}
          />
        </div>
      </DeckWrapper>
      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </>
  );
};

// ─── Security row ─────────────────────────────────────────────────────────────
const SecurityRow = ({ icon, title, desc, badge, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-2.5 bg-black border border-white/10 hover:border-white/20 rounded flex items-center justify-between group transition-all text-left"
  >
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-white">
            {title}
          </h4>
          {badge && (
            <span className="text-[7px] font-black bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[8px] text-white/40 uppercase tracking-[0.15em]">
          {desc}
        </p>
      </div>
    </div>
    <ChevronRight
      size={12}
      className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0"
    />
  </button>
);

IdentitySection.propTypes = { user: PropTypes.object.isRequired };

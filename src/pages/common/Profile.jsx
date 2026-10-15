import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Shield,
  ShieldCheck,
  Calendar,
  Settings,
  LogOut,
  Lock,
  Key,
  BadgeCheck,
  Clock,
  ChevronRight,
  Camera,
  Loader2,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { ChangePasswordModal } from '../../components/organisms/SettingsDecks';

/**
 * Clean and professional Profile page for NexaSetu.
 * Focuses on clarity, high contrast, and structured information layouts.
 */
const Profile = () => {
  const { user, logout, updateAvatar } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setIsUploading(true);
      await updateAvatar(formData);
    } catch (err) {
      console.error('[AVATAR_UPLOAD_FAILURE]:', err);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

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
    <div className="px-3 sm:px-4 lg:px-6 py-4 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Simple Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded bg-white/5 border border-white/10 flex items-center justify-center relative cursor-pointer group overflow-hidden"
              onClick={handleAvatarClick}
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-xl font-black text-white/50">
                  {displayName.charAt(0)}
                </span>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <Loader2 className="animate-spin text-primary" size={20} />
                </div>
              )}

              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-10 backdrop-blur-[2px]">
                <Camera size={16} className="text-white" />
              </div>

              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-black border border-white/10 rounded flex items-center justify-center text-primary z-30">
                <ShieldCheck size={10} />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div>
              <h1 className="text-[14px] font-black tracking-widest uppercase mb-1">
                {displayName}
              </h1>
              <div className="flex items-center gap-2 text-white/80">
                <span className="uppercase tracking-[0.2em] text-primary text-[9px] font-black">
                  {displayTitle}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span className="uppercase tracking-[0.2em] text-[9px] font-black">
                  {(user._id || user.id || 'N/A').slice(-8)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            <button
              onClick={handleLogout}
              className="h-9 px-4 rounded transition-all cursor-pointer text-[9px] font-black uppercase tracking-widest"
              style={{
                backgroundColor: 'var(--color-status-danger, #ef4444)',
                border: '1px solid var(--color-status-danger, #ef4444)',
                color: '#ffffff',
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Informational Layout */}
        <div className="space-y-6">
          {/* Account Details Section */}
          <section className="space-y-4">
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
              Account Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded overflow-hidden">
              <InfoRow
                label="Full Name"
                value={displayName}
                icon={<User size={12} />}
              />
              <InfoRow
                label="Email Address"
                value={displayEmail || 'N/A'}
                icon={<Mail size={12} />}
              />
              <InfoRow
                label="Account Role"
                value={displayTitle}
                icon={<Shield size={12} />}
              />
              <InfoRow
                label="Joined Workspace"
                value={
                  user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'
                }
                icon={<Calendar size={12} />}
              />
              <InfoRow
                label="Current Status"
                value="Active"
                icon={<Clock size={12} />}
                status="active"
              />
              <InfoRow
                label="Workspace ID"
                value={(user._id || user.id || 'N/A').slice(0, 12)}
                icon={<Key size={12} />}
              />
            </div>
          </section>

          {/* Account Security Section */}
          <section className="space-y-4">
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
              Account Security
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="w-full p-3 bg-black border border-white/10 hover:border-white/20 rounded flex items-center justify-between group transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors shrink-0">
                  <Lock size={13} />
                </div>
                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-white">
                    Change Password
                  </h4>
                  <p className="text-[8px] text-white/40 uppercase tracking-[0.15em] mt-0.5">
                    Regularly update your credentials.
                  </p>
                </div>
              </div>
              <ChevronRight
                size={12}
                className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0"
              />
            </button>
          </section>
        </div>

        {showModal && (
          <ChangePasswordModal onClose={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

// Sub-components for a structured, clean UI
const InfoRow = ({ label, value, icon, status }) => (
  <div className="bg-black p-3 sm:p-4 flex flex-col gap-1">
    <span className="text-[8px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
      {icon} {label}
    </span>
    <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 mt-1">
      {status === 'active' && (
        <div className="w-1.5 h-1.5 bg-status-success rounded-full" />
      )}
      {value}
    </span>
  </div>
);

const ActionTile = ({ icon, title, desc, badge }) => (
  <div className="p-3 sm:p-4 bg-white/5 border border-white/10 rounded flex items-center justify-between hover:border-white/20 transition-all cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-black border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-white truncate">
            {title}
          </h4>
          {badge && (
            <span className="text-[7px] font-black bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 truncate">
          {desc}
        </p>
      </div>
    </div>
    <ChevronRight
      size={14}
      className="text-white/20 group-hover:text-white transition-transform transform group-hover:translate-x-1 shrink-0"
    />
  </div>
);

const PreferenceToggle = ({ label, active }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white transition-colors">
      {label}
    </span>
    <div
      className={`w-8 h-4 rounded-full relative transition-all ${active ? 'bg-primary' : 'bg-white/10'}`}
    >
      <div
        className={`absolute top-[2px] w-3 h-3 rounded-full transition-all ${active ? 'right-[2px] bg-black' : 'left-[2px] bg-white/40'}`}
      />
    </div>
  </div>
);

export default Profile;

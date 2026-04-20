import React from 'react';
import { useAuth } from '../context/AuthContext';
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
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button';
import { ROUTES } from '../constants';

/**
 * Clean and professional Profile page for NexaSetu.
 * Focuses on clarity, high contrast, and structured information layouts.
 */
const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Simple Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative shadow-xl">
               {user.avatar ? (
                 <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
               ) : (
                 <span className="text-4xl font-black text-white/50">{user.name.charAt(0)}</span>
               )}
               <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-white/10 rounded-lg flex items-center justify-center text-primary">
                  <ShieldCheck size={16} />
               </div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-1">{user.name}</h1>
              <div className="flex items-center gap-3 text-sm font-medium text-white/80">
                <span className="uppercase tracking-widest text-primary text-[10px] font-black">{user.jobTitle || 'Team Member'}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span>{user._id.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border-white/10"
              onClick={() => navigate(ROUTES.SETTINGS)}
            >
              Settings
            </Button>
            <Button 
              variant="danger" 
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Informational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Account Details Section */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/70 border-l-2 border-primary pl-4">Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <InfoRow label="Full Name" value={user.name} icon={<User size={14} />} />
                <InfoRow label="Email Address" value={user.email} icon={<Mail size={14} />} />
                <InfoRow label="Account Role" value={user.role.replace('_', ' ')} icon={<Shield size={14} />} />
                <InfoRow label="Access Level" value="L4 Engineering" icon={<BadgeCheck size={14} />} />
                <InfoRow label="Joined Workspace" value={new Date(user.createdAt).toLocaleDateString()} icon={<Calendar size={14} />} />
                <InfoRow label="Current Status" value="Active" icon={<Clock size={14} />} status="active" />
              </div>
            </section>

            {/* Security Section */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 border-l-2 border-primary pl-4">Security & Access</h2>
              <div className="grid grid-cols-1 gap-4">
                 <ActionTile 
                   icon={<Key size={18} />} 
                   title="Update Password" 
                   desc="Set a strong, unique password to keep your account secure." 
                 />
                 <ActionTile 
                   icon={<Lock size={18} />} 
                   title="Two-Factor Authentication" 
                   desc="Add an extra layer of protection to your account profile." 
                   badge="Recommended"
                 />
              </div>
            </section>
          </div>

          {/* Sidebar / Preferences */}
          <div className="space-y-12">
            
            {/* Preferences Section */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 border-l-2 border-primary pl-4">Preferences</h2>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
                 <PreferenceToggle label="Email Notifications" active />
                 <PreferenceToggle label="Real-time Status" active />
                 <PreferenceToggle label="Compact View" />
                 <PreferenceToggle label="Developer Mode" />
              </div>
            </section>

          </div>
        </div>

        {/* Professional Footer */}
        <footer className="pt-20 pb-10 border-t border-white/10 flex justify-end items-center text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
           <span>Workspace ID: {user._id.slice(0, 12)}</span>
        </footer>

      </div>
    </div>
  );
};

// Sub-components for a structured, clean UI
const InfoRow = ({ label, value, icon, status }) => (
  <div className="bg-black p-5 flex flex-col gap-1.5">
     <span className="text-[9px] font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
        {icon} {label}
     </span>
     <span className="text-sm font-bold text-white flex items-center gap-2">
        {status === 'active' && <div className="w-1.5 h-1.5 bg-status-success rounded-full" />}
        {value}
     </span>
  </div>
);

const ActionTile = ({ icon, title, desc, badge }) => (
  <div className="p-5 bg-white/[0.05] border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/[0.08] transition-all cursor-pointer group">
     <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-lg bg-black border border-white/15 flex items-center justify-center text-white/60 group-hover:text-primary transition-colors">
           {icon}
        </div>
        <div>
           <div className="flex items-center gap-3 mb-0.5">
              <h4 className="text-sm font-black uppercase tracking-tight text-white/90">{title}</h4>
              {badge && <span className="text-[7px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">{badge}</span>}
           </div>
           <p className="text-[10px] font-medium text-white/60 leading-relaxed max-w-sm">{desc}</p>
        </div>
     </div>
     <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
  </div>
);

const PreferenceToggle = ({ label, active }) => (
  <div className="flex items-center justify-between group cursor-pointer">
     <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">{label}</span>
     <div className={`w-9 h-5 rounded-full relative transition-all ${active ? 'bg-primary' : 'bg-white/20'}`}>
        <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${active ? 'right-1 bg-black' : 'left-1 bg-white/60'}`} />
     </div>
  </div>
);

export default Profile;

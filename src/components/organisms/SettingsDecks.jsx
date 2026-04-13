import React from 'react';
import PropTypes from 'prop-types';
import {
  Camera,
  UserCircle,
  AtSign,
  BadgeCheck,
  Clock,
  Lock,
  Fingerprint,
  Database,
  Monitor,
  Globe,
  Bell,
  ChevronRight
} from 'lucide-react';
import TacticalInput from '../molecules/TacticalInput';
import TacticalSelect from '../molecules/TacticalSelect';
import SecurityActionRow from '../molecules/SecurityActionRow';
import Button from '../atoms/Button';

/**
 * Clean UI Wrapper for Settings sections.
 * Optimized for professional clarity and high-density information.
 */
const DeckWrapper = ({ title, children }) => (
  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
    <div className="flex items-center gap-4 mb-2">
       <div className="h-5 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"></div>
       <h2 className="text-xl font-black text-white uppercase tracking-tight">{title}</h2>
    </div>
    <div className="space-y-8 relative z-10">{children}</div>
  </div>
);

/**
 * Clean Identity section for profile management.
 */
export const IdentitySection = ({ user }) => (
  <DeckWrapper title="Profile Identity">
    <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-black border border-white/10 rounded-2xl">
      <div className="relative">
        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 p-1 shadow-2xl">
          <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
            ) : (
              <span className="text-3xl font-black text-white/50">{user.name.charAt(0)}</span>
            )}
          </div>
        </div>
        <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center text-primary-light hover:text-white transition-colors cursor-pointer shadow-xl">
           <Camera size={14} />
        </button>
      </div>
      <div className="flex-1 space-y-2 text-center sm:text-left">
        <div className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Primary Operator</div>
        <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">{user.name}</h3>
        <p className="text-[10px] text-white/80 font-medium uppercase tracking-widest">{user.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-1.5">
         <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">Full Name</label>
         <TacticalInput icon={<UserCircle size={16} />} value={user.name} className="bg-black/40" />
      </div>
      <div className="space-y-1.5">
         <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
         <TacticalInput icon={<AtSign size={16} />} value={user.email} className="bg-black/40" />
      </div>
      <div className="space-y-1.5">
         <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Organizational Title</label>
         <TacticalInput icon={<BadgeCheck size={16} />} value={user.jobTitle || 'Team Member'} disabled className="bg-black/20" />
      </div>
      <div className="space-y-1.5">
         <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Deployment Date</label>
         <TacticalInput icon={<Clock size={16} />} value={new Date(user.createdAt).toLocaleDateString()} disabled className="bg-black/20" />
      </div>
    </div>
  </DeckWrapper>
);

/**
 * Professional Security section.
 */
export const SecuritySection = () => (
  <DeckWrapper title="Security Protocols">
    <div className="grid grid-cols-1 gap-4">
      <SecurityRow icon={<Lock size={18} />} title="Change Master Key" desc="Protocol recommended every 30 days." />
      <SecurityRow icon={<Fingerprint size={18} />} title="Two-Factor Security" desc="Add an authentication layer via hardware/app." badge="Recommended" />
      <SecurityRow icon={<Database size={18} />} title="Privacy Credentials" desc="Manage session persistence and visibility." />
    </div>
  </DeckWrapper>
);

const SecurityRow = ({ icon, title, desc, badge }) => (
  <div className="p-5 bg-black border border-white/10 hover:border-white/15 rounded-xl flex items-center justify-between group cursor-pointer transition-all">
     <div className="flex items-center gap-5">
        <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/70 group-hover:text-primary transition-colors">
           {icon}
        </div>
        <div>
           <div className="flex items-center gap-3 mb-0.5">
              <h4 className="text-sm font-black uppercase text-white/90">{title}</h4>
              {badge && <span className="text-[7px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase">{badge}</span>}
           </div>
           <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{desc}</p>
        </div>
     </div>
     <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
  </div>
);

/**
 * System Preferences section.
 */
export const PreferencesSection = () => (
  <DeckWrapper title="Console Preferences">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-1.5">
         <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">Theme Infrastructure</label>
         <TacticalSelect icon={<Monitor size={16} />} options={['Strategic Dark', 'Amber Command', 'Clean High Contrast']} value="Strategic Dark" />
      </div>
      <div className="space-y-1.5">
         <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Operational Zone</label>
         <TacticalSelect icon={<Globe size={16} />} options={['Asia/Kolkata (IST)', 'UTC (GMT)', 'US/New York (EST)']} value="Asia/Kolkata (IST)" />
      </div>
      <div className="space-y-1.5">
         <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Alert Protocols</label>
         <TacticalSelect icon={<Bell size={16} />} options={['All Transmissions', 'Critical Alerts', 'Silent Mode']} value="All Transmissions" />
      </div>
    </div>
  </DeckWrapper>
);

IdentitySection.propTypes = { user: PropTypes.object.isRequired };

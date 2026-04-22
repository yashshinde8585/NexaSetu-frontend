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
  <div className="bg-white/5 border border-white/10 rounded p-4 sm:p-6 space-y-6 relative overflow-hidden">
    <div className="flex items-center gap-3 mb-2">
       <div className="h-4 w-1 bg-primary rounded-full"></div>
       <h2 className="text-[12px] font-black text-white uppercase tracking-widest">{title}</h2>
    </div>
    <div className="space-y-6 relative z-10">{children}</div>
  </div>
);

/**
 * Clean Identity section for profile management.
 */
export const IdentitySection = ({ user }) => (
  <DeckWrapper title="USER_PROFILE">
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-black border border-white/10 rounded">
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded bg-white/5 border border-white/10 p-1">
          <div className="w-full h-full bg-black rounded flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
            ) : (
              <span className="text-xl font-black text-white/50">{user.name.charAt(0)}</span>
            )}
          </div>
        </div>
        <button className="absolute -bottom-2 -right-2 w-6 h-6 rounded bg-black border border-white/10 flex items-center justify-center text-primary hover:text-white transition-colors cursor-pointer">
           <Camera size={12} />
        </button>
      </div>
      <div className="flex-1 space-y-1 text-center sm:text-left min-w-0">
        <div className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">ACTIVE_USER</div>
        <h3 className="text-[14px] font-black text-white uppercase tracking-widest truncate">{user.name}</h3>
        <p className="text-[9px] text-white/60 font-black uppercase tracking-widest truncate">{user.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
         <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">FULL_NAME</label>
         <TacticalInput icon={<UserCircle size={14} />} value={user.name} className="h-9" />
      </div>
      <div className="space-y-1">
         <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">EMAIL_ADDRESS</label>
         <TacticalInput icon={<AtSign size={14} />} value={user.email} className="h-9" />
      </div>
      <div className="space-y-1">
          <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">CURRENT_ROLE</label>
         <TacticalInput icon={<BadgeCheck size={14} />} value={user.jobTitle || 'TEAM MEMBER'} disabled className="h-9 opacity-50" />
      </div>
      <div className="space-y-1">
          <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">MEMBER_SINCE</label>
         <TacticalInput icon={<Clock size={14} />} value={new Date(user.createdAt).toLocaleDateString()} disabled className="h-9 opacity-50" />
      </div>
    </div>
  </DeckWrapper>
);

/**
 * Professional Security section.
 */
export const SecuritySection = () => (
  <DeckWrapper title="ACCOUNT_SECURITY">
    <div className="grid grid-cols-1 gap-2">
      <SecurityRow icon={<Lock size={14} />} title="CHANGE_PASSWORD" desc="UPDATE EVERY 90 DAYS." />
      <SecurityRow icon={<Fingerprint size={14} />} title="TWO_FACTOR_AUTHENTICATION" desc="ADD EXTRA SECURITY LAYER." badge="RECOMMENDED" />
      <SecurityRow icon={<Database size={14} />} title="PRIVACY_SETTINGS" desc="MANAGE SESSION VISIBILITY." />
    </div>
  </DeckWrapper>
);

const SecurityRow = ({ icon, title, desc, badge }) => (
  <div className="p-3 bg-black border border-white/10 hover:border-white/20 rounded flex items-center justify-between group cursor-pointer transition-all">
     <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors shrink-0">
           {icon}
        </div>
        <div className="min-w-0">
           <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-white truncate">{title}</h4>
              {badge && <span className="text-[7px] font-black bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0">{badge}</span>}
           </div>
           <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] truncate">{desc}</p>
        </div>
     </div>
     <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-transform transform group-hover:translate-x-1 shrink-0" />
  </div>
);

/**
 * System Preferences section.
 */
export const PreferencesSection = () => (
  <DeckWrapper title="PLATFORM_PREFERENCES">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
          <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">PLATFORM_THEME</label>
          <TacticalSelect icon={<Monitor size={14} />} options={['MODERN DARK', 'CLASSIC AMBER', 'HIGH CONTRAST']} value="MODERN DARK" className="h-9 text-[10px]" />
      </div>
      <div className="space-y-1">
          <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">TIMEZONE</label>
          <TacticalSelect icon={<Globe size={14} />} options={['ASIA/KOLKATA (IST)', 'UTC (GMT)', 'US/NEW YORK (EST)']} value="ASIA/KOLKATA (IST)" className="h-9 text-[10px]" />
       </div>
       <div className="space-y-1">
          <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">NOTIFICATION_SETTINGS</label>
          <TacticalSelect icon={<Bell size={14} />} options={['ALL NOTIFICATIONS', 'CRITICAL ONLY', 'MUTED']} value="ALL NOTIFICATIONS" className="h-9 text-[10px]" />
      </div>
    </div>
  </DeckWrapper>
);

IdentitySection.propTypes = { user: PropTypes.object.isRequired };

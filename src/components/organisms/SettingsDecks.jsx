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
} from 'lucide-react';
import TacticalInput from '../molecules/TacticalInput';
import TacticalSelect from '../molecules/TacticalSelect';
import SecurityActionRow from '../molecules/SecurityActionRow';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

// A unified layout wrapper for settings sections that ensures consistent styling.
const DeckWrapper = ({ title, children }) => (
  <Card
    variant="glass"
    padding="lg"
    className="shadow-2xl relative overflow-hidden sm:rounded-[32px]"
    hover={false}
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
    <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight mb-8 flex items-center gap-4">
      <div className="h-4 w-1 bg-primary rounded-full"></div> {title}
    </h2>
    <div className="space-y-8 relative z-10">{children}</div>
  </Card>
);

// A section for managing user identity and profile information.
export const IdentitySection = ({ user }) => (
  <DeckWrapper title="Profile Identity">
    <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 p-5 sm:p-6 bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/5 group hover:bg-white/[0.04] transition-all duration-500">
      <div className="relative">
        <div className="w-28 h-28 rounded-full border-2 border-white/10 p-0.5 shadow-2xl">
          <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-white/5 overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                className="w-full h-full object-cover"
                alt={user.name}
              />
            ) : (
              <span className="text-4xl font-extrabold text-white">
                {user.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="primary"
          size="icon"
          className="absolute bottom-0 right-0 w-10 h-10 rounded-xl border border-[#0B0F1A] shadow-xl"
        >
          <Camera size={18} />
        </Button>
      </div>
      <div className="flex-1 space-y-2 text-center md:text-left">
        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
          Full Name
        </div>
        <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight">
          {user.name}
        </h3>
        <p className="text-xs text-text-muted opacity-60">
          Upload a profile picture to help your team members identify you.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
      <TacticalInput
        icon={<UserCircle />}
        label="Full Name"
        value={user.name}
        placeholder="John Doe"
      />
      <TacticalInput
        icon={<AtSign />}
        label="Email Address"
        value={user.email}
        placeholder="john@nexus.app"
      />
      <TacticalInput
        icon={<BadgeCheck />}
        label="Account Role"
        value={user.jobTitle || 'Team Member'}
        disabled
      />
      <TacticalInput
        icon={<Clock />}
        label="Member Since"
        value={`Joined ${new Date(user.createdAt).toLocaleDateString()}`}
        disabled
      />
    </div>
  </DeckWrapper>
);

// A section for configuring account security and authentication settings.
export const SecuritySection = () => (
  <DeckWrapper title="Account Security">
    <div className="space-y-6">
      <SecurityActionRow
        icon={<Lock size={20} />}
        title="Password Change"
        desc="Last updated 24 days ago. Regular updates recommended."
        action="Change Password"
      />
      <SecurityActionRow
        icon={<Fingerprint size={20} />}
        title="Two-Factor Authentication"
        desc="Enhance account security with two-factor authentication."
        action="Enable 2FA"
      />
      <SecurityActionRow
        icon={<Database size={20} />}
        title="Profile Privacy"
        desc="Manage your visibility across workspace projects."
        action="Edit Settings"
      />
    </div>
  </DeckWrapper>
);

// A section for customizing general system preferences like themes and timezones.
export const PreferencesSection = () => (
  <DeckWrapper title="System Preferences">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
      <TacticalSelect
        icon={<Monitor />}
        label="Theme"
        options={['Dark Mode', 'Amber Theme', 'Light Mode']}
        value="Dark Mode"
      />
      <TacticalSelect
        icon={<Globe />}
        label="Timezone"
        options={['Asia/Kolkata (IST)', 'UTC (GMT)', 'US/New York (EST)']}
        value="Asia/Kolkata (IST)"
      />
      <TacticalSelect
        icon={<Bell />}
        label="Notifications"
        options={['All Notifications', 'Critical Alerts', 'Silent Mode']}
        value="All Notifications"
      />
    </div>
  </DeckWrapper>
);

IdentitySection.propTypes = { user: PropTypes.object.isRequired };

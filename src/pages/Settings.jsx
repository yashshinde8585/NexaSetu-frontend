import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Shield,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
} from 'lucide-react';
import {
  Button,
  SettingsSidebar,
  IdentitySection,
  SecuritySection,
  PreferencesSection,
} from '@/components';

// A settings management page that allows users to update their profile, security, and application preferences.
const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('identity');

  const tabs = [
    { id: 'identity', label: 'Tactical Identity', icon: <User size={18} /> },
    { id: 'security', label: 'Security Protocols', icon: <Shield size={18} /> },
    {
      id: 'preferences',
      label: 'Console Preferences',
      icon: <SettingsIcon size={18} />,
    },
  ];

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
          Account <span className="text-primary">Settings</span>
        </h1>
        <p className="text-text-muted text-[10px] sm:text-xs font-medium mt-3 max-w-md opacity-50">
          Customize your profile, account security, and notification
          preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <SettingsSidebar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={user.role}
          jobTitle={user.jobTitle}
        />

        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          {activeTab === 'identity' && <IdentitySection user={user} />}
          {activeTab === 'security' && <SecuritySection />}
          {activeTab === 'preferences' && <PreferencesSection />}

          <div className="pt-8 flex items-center justify-end gap-4 border-t border-white/5">
            <Button
              variant="ghost"
              size="sm"
              className="px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 flex items-center gap-2"
            >
              <RotateCcw size={14} /> Discard Changes
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="px-10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              <Save size={14} /> Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

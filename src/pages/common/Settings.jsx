import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield } from 'lucide-react';
import SettingsSidebar from '../../components/organisms/SettingsSidebar';
import {
  IdentitySection,
  SecuritySection,
} from '../../components/organisms/SettingsDecks';

/**
 * Account Settings page — compact, responsive layout.
 */
const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('identity');

  const tabs = [
    { id: 'identity', label: 'Profile', icon: <User size={14} /> },
    { id: 'security', label: 'Security', icon: <Shield size={14} /> },
  ];

  if (!user) return null;

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4">
      <div className="max-w-screen-xl mx-auto space-y-4 animate-in fade-in duration-700">
        {/* Page Header */}
        <div className="border-b border-white/10 pb-3">
          <h1 className="text-[13px] font-black tracking-widest uppercase text-white">
            Account Settings
          </h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">
            Manage your profile, security, and preferences.
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col xl:flex-row gap-4">
          {/* Sidebar */}
          <div className="shrink-0 relative z-20">
            <SettingsSidebar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              userRole={user.role}
              jobTitle={user.jobTitle}
            />
          </div>

          {/* Content */}
          <div className="flex-1 relative z-10 animate-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'identity' && <IdentitySection user={user} />}
            {activeTab === 'security' && <SecuritySection />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

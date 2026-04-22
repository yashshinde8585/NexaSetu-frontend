import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Shield,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
} from 'lucide-react';
import Button from '../components/atoms/Button';
import SettingsSidebar from '../components/organisms/SettingsSidebar';
import {
  IdentitySection,
  SecuritySection,
  PreferencesSection,
} from '../components/organisms/SettingsDecks';
import { ROUTES } from '../constants';

/**
 * Clean and professional Settings management console.
 * Implements a structured, high-contrast interface for system configurations.
 */
const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('identity');

  const tabs = [
    { id: 'identity', label: 'User Identity', icon: <User size={18} /> },
    { id: 'security', label: 'Account Security', icon: <Shield size={18} /> },
    {
      id: 'preferences',
      label: 'Platform Preferences',
      icon: <SettingsIcon size={18} />,
    },
  ];

  if (!user) return null;

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-4">
      <div className="max-w-screen-xl mx-auto space-y-6 animate-in fade-in duration-700">
        
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h1 className="text-[14px] font-black tracking-widest uppercase">
              PLATFORM_SETTINGS
            </h1>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] max-w-xl">
              MANAGE ACCOUNT PROFILE, SECURITY OPTIONS, AND PLATFORM PREFERENCES.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <Button
               variant="ghost"
               className="flex-1 md:flex-none h-9 px-4 text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-white/80 hover:bg-white/5 rounded"
             >
               <RotateCcw size={12} className="mr-2" /> DISCARD
             </Button>
             <Button
               variant="primary"
               className="flex-1 md:flex-none h-9 px-4 text-[9px] font-black uppercase tracking-widest rounded"
             >
                <Save size={12} className="mr-2" /> SAVE_CHANGES
             </Button>
          </div>
        </div>

        {/* Main Configuration Interface */}
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Navigation Sidebar */}
          <div className="shrink-0 relative z-20">
            <SettingsSidebar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              userRole={user.role}
              jobTitle={user.jobTitle}
            />
          </div>

          {/* Configuration Decks */}
          <div className="flex-1 space-y-4 relative z-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="min-h-[400px]">
              {activeTab === 'identity' && <IdentitySection user={user} />}
              {activeTab === 'security' && <SecuritySection />}
              {activeTab === 'preferences' && <PreferencesSection />}
            </div>

            {/* Bottom Global Actions (Mobile/Tablet Friendly Duplicate) */}
            <div className="xl:hidden pt-4 flex items-center justify-end gap-2 border-t border-white/10">
               <button className="text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-white/80 px-4 h-9">DISCARD</button>
               <Button variant="primary" className="h-9 px-4 text-[9px] font-black uppercase tracking-widest rounded">SAVE_SETTINGS</Button>
            </div>
          </div>

        </div>

        {/* System Meta */}
        <footer className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-end items-center text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
            <span>WORKSPACE_ID: {user._id.toUpperCase()}</span>
        </footer>

      </div>
    </div>
  );
};

export default Settings;

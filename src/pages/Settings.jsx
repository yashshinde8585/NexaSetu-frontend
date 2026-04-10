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
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
              Console <span className="text-primary-light">Settings</span>
            </h1>
            <p className="text-white/70 text-xs sm:text-sm font-bold max-w-xl leading-relaxed">
              Configure your operational parameters, security encryption, and identity credentials across the NexaSetu grid.
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <Button
               variant="ghost"
               className="flex-1 md:flex-none h-12 px-8 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white/80 hover:bg-white/5"
             >
               <RotateCcw size={14} className="mr-2" /> Discard
             </Button>
             <Button
               variant="primary"
               className="flex-1 md:flex-none h-12 px-10 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/10"
             >
               <Save size={14} className="mr-2" /> Commit Changes
             </Button>
          </div>
        </div>

        {/* Main Configuration Interface */}
        <div className="flex flex-col xl:flex-row gap-12 sm:gap-16">
          
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
          <div className="flex-1 space-y-8 relative z-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="min-h-[600px]">
              {activeTab === 'identity' && <IdentitySection user={user} />}
              {activeTab === 'security' && <SecuritySection />}
              {activeTab === 'preferences' && <PreferencesSection />}
            </div>

            {/* Bottom Global Actions (Mobile/Tablet Friendly Duplicate) */}
            <div className="xl:hidden pt-8 flex items-center justify-end gap-4 border-t border-white/10">
               <button className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white/80 px-4 py-2">Discard</button>
               <Button variant="primary" className="h-10 px-8 text-[10px] font-black uppercase tracking-widest">Save Settings</Button>
            </div>
          </div>

        </div>

        {/* System Meta */}
        <footer className="pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-end items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
            <span>ID: {user._id.toUpperCase()}</span>
        </footer>

      </div>
    </div>
  );
};

export default Settings;

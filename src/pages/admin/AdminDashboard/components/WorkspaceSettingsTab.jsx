import React from 'react';
import {
  Settings as SettingsIcon,
  Link as LinkIcon,
  Globe,
  Clock,
  Shield,
  Zap,
  GitBranch,
  MessageSquare,
} from 'lucide-react';
import DashboardSection from '../../../../components/molecules/dashboard/DashboardSection';

const WorkspaceSettingsTab = ({
  settings,
  integrations,
  setActiveSetting,
  handleConnect,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* Settings Section */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <DashboardSection
          title="WORKSPACE SETTINGS"
          icon={<SettingsIcon size={14} />}
        >
          <div className="flex flex-col gap-3 py-1">
            {[
              {
                label: 'TIMEZONE',
                key: 'timezone',
                value: settings?.timezone,
                icon: <Globe size={14} />,
              },
              {
                label: 'WORKING HOURS',
                key: 'workingHours',
                value: settings?.workingHours,
                icon: <Clock size={14} />,
              },
              {
                label: 'POLICIES',
                key: 'notificationRules',
                value: settings?.notificationRules,
                icon: <Shield size={14} />,
              },
              {
                label: 'DEFAULTS',
                key: 'projectDefaults',
                value: settings?.projectDefaults,
                icon: <Zap size={14} />,
              },
            ].map((setting) => (
              <button
                key={setting.key}
                onClick={() => setActiveSetting(setting)}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-none hover:bg-white/10 transition-colors group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="text-white/10 group-hover:text-primary transition-colors">
                    {setting.icon}
                  </div>
                  <span className="text-[9px] font-black text-white/30 group-hover:text-white transition-colors uppercase tracking-[0.2em]">
                    {setting.label}
                  </span>
                </div>
                <span className="text-[9px] font-black text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-widest truncate max-w-[150px]">
                  {setting.value || 'DEFAULT'}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[8px] text-white/5 text-center uppercase tracking-widest font-black">
            Workspace settings apply to all users.
          </p>
        </DashboardSection>
      </div>

      {/* Integrations Section */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <DashboardSection title="INTEGRATIONS" icon={<LinkIcon size={14} />}>
          <div className="grid grid-cols-2 gap-4">
            {integrations.map((tool, idx) => {
              const toolName = tool.name || 'Unknown';
              const toolIcon = tool.icon || '';
              const toolStatus = tool.status || 'offline';
              return (
                <button
                  key={tool.id || tool._id || toolName || `tool-${idx}`}
                  onClick={() => handleConnect(tool)}
                  className="group bg-white/5 border border-white/10 p-4 rounded-none flex flex-col items-center gap-3 transition-all hover:bg-white/10 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-none bg-black border border-white/10 flex items-center justify-center text-white/10 group-hover:text-primary transition-colors">
                    {toolIcon === 'github' ? (
                      <GitBranch size={18} />
                    ) : toolIcon === 'slack' ? (
                      <MessageSquare size={18} />
                    ) : (
                      <LinkIcon size={18} />
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                      {toolName}
                    </span>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-1.5 h-1.5 rounded-none ${toolStatus === 'connected' ? 'bg-status-success' : 'bg-white/10'}`}
                      />
                      <span className="text-[7px] font-black uppercase tracking-widest text-white/20">
                        {toolStatus === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-[8px] text-white/10 uppercase font-black tracking-[0.2em] text-center border-t border-white/5 pt-4">
            Upgrade plan to unlock more integrations.
          </p>
        </DashboardSection>
      </div>
    </div>
  );
};

export default WorkspaceSettingsTab;

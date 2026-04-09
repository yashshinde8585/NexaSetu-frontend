import React, { useState } from 'react';
import { X, Save, Globe, Clock, Bell, Settings as SettingsIcon, Check } from 'lucide-react';

const WorkspaceSettingsModal = ({ isOpen, onClose, onSave, setting, currentValue }) => {
  const [value, setValue] = useState(currentValue);

  if (!isOpen) return null;

  const optionsMap = {
    timezone: [
      'UTC +5:30 (IST)',
      'UTC +0:00 (GMT)',
      'UTC -5:00 (EST)',
      'UTC +1:00 (CET)',
      'UTC +8:00 (SGT)'
    ],
    workingHours: [
      '09:00 - 18:00',
      '10:00 - 19:00',
      '08:00 - 17:00',
      'Flexible / No fixed hours',
      '24/7 Operational'
    ],
    notificationRules: [
      'Email Only',
      'Slack Only',
      'Email & Slack (All)',
      'Critical Alerts Only (Slack)',
      'Muted / No Notifications'
    ],
    projectDefaults: [
      'Sprint: 7 days',
      'Sprint: 14 days (Bi-weekly)',
      'Sprint: 30 days (Monthly)',
      'Kanban (Continuous)',
      'Custom Lifecycle'
    ]
  };

  const getIcon = () => {
    switch(setting?.key) {
      case 'timezone': return <Globe className="text-primary" size={24} />;
      case 'workingHours': return <Clock className="text-secondary" size={24} />;
      case 'notificationRules': return <Bell className="text-status-warning" size={24} />;
      default: return <SettingsIcon className="text-white/40" size={24} />;
    }
  };

  const options = optionsMap[setting?.key] || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity animate-in fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-md bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-xl">
              {getIcon()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Update {setting?.label}</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Workspace Configuration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-white/30 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Options List */}
        <div className="p-6 space-y-2">
          {options.map((opt) => (
            <div 
              key={opt}
              onClick={() => setValue(opt)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                value === opt 
                  ? 'bg-primary/10 border-primary/50 text-white' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <span className="text-sm font-medium">{opt}</span>
              {value === opt && <Check size={16} className="text-primary" />}
            </div>
          ))}

          {options.length === 0 && (
             <input 
               type="text" 
               value={value}
               onChange={(e) => setValue(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-primary/50 transition-all outline-none"
               placeholder="Custom value..."
             />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-bold text-white/40 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(value);
              onClose();
            }}
            className="flex-1 bg-primary text-black px-4 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default WorkspaceSettingsModal;

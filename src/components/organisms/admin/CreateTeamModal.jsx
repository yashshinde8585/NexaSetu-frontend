import React, { useState } from 'react';
import { X, Users, User, Shield, Save, MessageSquare } from 'lucide-react';

const CreateTeamModal = ({ isOpen, onClose, onCreate, users = [] }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [lead, setLead] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      name,
      description,
      lead,
      members: selectedMembers
    });
    onClose();
    // Reset form
    setName('');
    setDescription('');
    setLead('');
    setSelectedMembers([]);
  };

  const toggleMember = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-[fadeIn_200ms_ease_forwards]" 
        onClick={onClose} 
      />
      
      <form 
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-[zoomIn95_200ms_ease_forwards]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Assemble New Team</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Squad Governance</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-white/30 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar-thumb]:bg-white/5 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/15">
          
          {/* Left: Metadata */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1">Team Identity</label>
              <input 
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Core Execution Squad"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1">Mission / Description</label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly define the team's primary focus..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-primary/50 outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1 flex items-center justify-between">
                Team Lead 
                <Shield size={10} className="text-secondary" />
              </label>
              <select 
                required
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-secondary/50 outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="" disabled className="bg-slate-900">Assign a lead...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id} className="bg-slate-900">{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Member Selection */}
          <div className="space-y-4">
             <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1 block mb-2">Select Members ({selectedMembers.length})</label>
             <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar-thumb]:bg-white/5 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/15">
                {users.map(u => (
                  <div 
                    key={u.id}
                    onClick={() => toggleMember(u.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedMembers.includes(u.id) 
                        ? 'bg-primary/10 border-primary/30 text-white' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <User size={14} className={selectedMembers.includes(u.id) ? 'text-primary' : ''} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{u.name}</span>
                        <span className="text-[9px] uppercase opacity-50">{u.role}</span>
                      </div>
                    </div>
                    {selectedMembers.includes(u.id) && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                ))}
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 bg-white/[0.01] border-t border-white/5 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 text-sm font-bold text-white/40 hover:text-white transition-colors"
          >
            Discard
          </button>
          <button
            type="submit"
            className="flex-[2] bg-primary text-black px-6 py-3 rounded-2xl text-sm font-bold hover:brightness-110 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Save size={18} /> Initialize Squad
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateTeamModal;

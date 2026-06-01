import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Plus,
  Users,
  Settings as SettingsIcon,
  Trash2,
} from 'lucide-react';
import DashboardSection from '../../../../components/molecules/dashboard/DashboardSection';
import toast from 'react-hot-toast';

const SquadDirectiveTab = ({ teams, deleteTeamMutation }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <DashboardSection title="TEAMS" icon={<Zap size={14} />}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
              TOTAL TEAMS: {teams.length}
            </span>
            <button
              onClick={() => navigate('/admin/teams/create')}
              className="p-2 px-4 bg-white/5 border border-white/10 rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus size={12} /> ADD TEAM
            </button>
          </div>

          {teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((t, idx) => {
                const teamId = t.id || t._id || t.name || `team-${idx}`;
                const teamName = t.name || 'Unnamed Team';
                const membersCount = t.members || 0;
                return (
                  <div
                    key={teamId}
                    className="group p-4 bg-white/5 border border-white/10 rounded-none flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        {teamName}
                      </span>
                      <span className="text-[8px] text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
                        <Users size={12} className="text-primary/40" />{' '}
                        {membersCount} MEMBERS
                      </span>
                      {t.lead && (
                        <span className="text-[8px] text-white/25 uppercase font-bold">
                          Lead: {t.lead}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/admin/teams/edit/${teamId}`)}
                        className="p-1.5 text-white/20 hover:text-primary transition-colors cursor-pointer"
                      >
                        <SettingsIcon size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete team ${teamName}?`
                            )
                          ) {
                            deleteTeamMutation.mutate(teamId, {
                              onSuccess: () => {
                                toast.success('Team successfully deleted');
                              },
                              onError: (err) => {
                                toast.error(
                                  err?.message || 'Failed to delete team'
                                );
                              },
                            });
                          }
                        }}
                        className="p-1.5 text-white/20 hover:text-status-error transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-white/10">
              <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">
                NO TEAMS REGISTERED
              </span>
            </div>
          )}
        </div>
      </DashboardSection>
    </div>
  );
};

export default SquadDirectiveTab;

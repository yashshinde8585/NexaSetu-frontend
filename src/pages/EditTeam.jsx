import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { ROUTES } from '../constants';
import CenteredLoading from '../components/atoms/CenteredLoading';
import SquadAssemblyForm from '../components/organisms/admin/SquadAssemblyForm';

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, updateTeam } = useAdminDashboard();
  
  if (isLoading) return <CenteredLoading />;

  const { users = [], teams = [] } = data || {};
  const currentTeam = teams.find(t => t.id === id);

  const handleUpdate = async (teamData) => {
    try {
      await updateTeam(id, teamData);
      navigate(ROUTES.ADMIN_PANEL);
    } catch (err) {
      console.error('Failed to update squad:', err);
    }
  };

  return (
    <SquadAssemblyForm 
      title="Edit Team"
      description="Update team details, change leadership, or reassign members."
      submitLabel="Save Changes"
      onSubmit={handleUpdate}
      users={users}
      initialData={{
        name: currentTeam?.name,
        description: currentTeam?.description,
        lead: currentTeam?.leadId,
        members: [] // Fallback or fetch specific members if summary is insufficient
      }}
      themeColor="secondary"
    />
  );
};

export default EditTeam;

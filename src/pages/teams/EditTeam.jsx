import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { ROUTES } from '../../constants';
import CenteredLoading from '../../components/atoms/CenteredLoading';
import TeamBuilderForm from '../../components/organisms/admin/SquadAssemblyForm';

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, updateTeam } = useAdminDashboard();

  const { users = [], teams = [] } = data || {};
  const currentTeam = teams.find((t) => (t.id || t._id) === id);

  const initialMembers = React.useMemo(() => {
    if (!currentTeam || !Array.isArray(currentTeam.members)) return [];
    return currentTeam.members
      .map((m) => (typeof m === 'object' && m !== null ? m.id || m._id : m))
      .filter(Boolean);
  }, [currentTeam]);

  if (isLoading) return <CenteredLoading />;

  const handleUpdate = async (teamData) => {
    try {
      await updateTeam(id, teamData);
      navigate(ROUTES.ADMIN_PANEL);
    } catch (err) {
      console.error('Failed to update squad:', err);
    }
  };

  return (
    <TeamBuilderForm
      title="Team Configuration"
      description="Update team details, change leadership, or reassign resources."
      submitLabel="Save Changes"
      onSubmit={handleUpdate}
      users={users}
      initialData={{
        name: currentTeam?.name,
        description: currentTeam?.description,
        lead:
          currentTeam?.leadId ||
          (typeof currentTeam?.lead === 'object'
            ? currentTeam.lead?.id || currentTeam.lead?._id
            : currentTeam?.lead) ||
          '',
        members: initialMembers,
      }}
      themeColor="theme-secondary"
    />
  );
};

export default EditTeam;

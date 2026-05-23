import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { ROUTES } from '../../constants';
import CenteredLoading from '../../components/atoms/CenteredLoading';
import TeamBuilderForm from '../../components/organisms/admin/SquadAssemblyForm';

const CreateTeam = () => {
  const navigate = useNavigate();
  const { data, isLoading, createTeam } = useAdminDashboard();

  if (isLoading) return <CenteredLoading />;

  const { users = [] } = data || {};

  const handleCreate = async (teamData) => {
    try {
      await createTeam(teamData);
      navigate(ROUTES.ADMIN_PANEL);
    } catch (err) {
      console.error('Failed to initialize squad:', err);
    }
  };

  return (
    <TeamBuilderForm
      title="Create New Team"
      description="Define a new organizational unit and allocate resources."
      submitLabel="Deploy Team"
      onSubmit={handleCreate}
      users={users}
    />
  );
};

export default CreateTeam;

import React from 'react';
import PropTypes from 'prop-types';
import TacticalCustomSelect from '../molecules/TacticalCustomSelect';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import ErrorBoundary from '../atoms/ErrorBoundary';

// A modal component for creating new sprints with custom names and date ranges.
const SprintCreationModal = ({
  show,
  onClose,
  sprintData,
  setSprintData,
  onSubmit,
  isLoading,
  projects = [],
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 animate-in fade-in duration-300 backdrop-blur-sm">
      <div className="w-full max-w-md bg-background border border-border-subtle rounded-none p-8 sm:p-10 animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-8 bg-primary" />
          <h3 className="text-2xl font-black text-text tracking-tighter uppercase">
            Create New Sprint
          </h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            id="sprintName"
            label="Sprint Name"
            placeholder="e.g. Sprint 1"
            required
            value={sprintData.name}
            onChange={(e) =>
              setSprintData({ ...sprintData, name: e.target.value })
            }
          />

          <div className="space-y-1.5">
            <TacticalCustomSelect
              label="Select Project"
              value={sprintData.project}
              onChange={(val) => setSprintData({ ...sprintData, project: val })}
              placeholder="Select project..."
              options={projects?.map((p) => ({
                label: p.name,
                value: p._id,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="startDate"
              label="Start Date"
              type="date"
              required
              value={sprintData.startDate}
              onChange={(e) =>
                setSprintData({ ...sprintData, startDate: e.target.value })
              }
            />
            <FormField
              id="endDate"
              label="End Date"
              type="date"
              required
              value={sprintData.endDate}
              onChange={(e) =>
                setSprintData({ ...sprintData, endDate: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              variant="primary"
              className="flex-1 rounded-none py-4 text-[11px] font-black tracking-widest uppercase"
              isLoading={isLoading}
            >
              CREATE SPRINT
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="px-8 bg-background-elevated rounded-none border border-border-subtle text-[11px] font-black text-text-subtle uppercase hover:text-text hover:border-primary transition-all shadow-none"
            >
              CANCEL
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SafeSprintCreationModal = (props) => (
  <ErrorBoundary>
    <SprintCreationModal {...props} />
  </ErrorBoundary>
);

SafeSprintCreationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sprintData: PropTypes.object.isRequired,
  setSprintData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  projects: PropTypes.array,
};

export default SafeSprintCreationModal;

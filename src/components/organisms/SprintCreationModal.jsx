import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

// A modal component for creating new sprints with custom names and date ranges.
const SprintCreationModal = ({
  show,
  onClose,
  sprintData,
  setSprintData,
  onSubmit,
  isLoading,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#1E1E2E] border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-primary/20 animate-in zoom-in-95 duration-300 relative overflow-hidden">
        {/* Glow Element */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-6 bg-primary rounded-full" />
          <h3 className="text-xl font-bold text-white tracking-tight uppercase">
            Create New Sprint
          </h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            id="sprintName"
            label="Sprint Name"
            placeholder="e.g. Gamma Sprint"
            required
            value={sprintData.name}
            onChange={(e) =>
              setSprintData({ ...sprintData, name: e.target.value })
            }
          />

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

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1 rounded-2xl py-3"
              isLoading={isLoading}
            >
              Create Sprint
            </Button>
            <Button
              type="button"
              variant="glass"
              onClick={onClose}
              className="px-6 rounded-2xl"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

SprintCreationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sprintData: PropTypes.object.isRequired,
  setSprintData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default SprintCreationModal;

import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import ErrorBoundary from '../ErrorBoundary';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-black border border-white/20 rounded-[2rem] p-8 sm:p-10 shadow-3xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1.5 h-8 bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase">
            Initialize Strategic Cycle
          </h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            id="sprintName"
            label="Cycle Identifier"
            placeholder="e.g. GAMMA_ZERO_1"
            required
            value={sprintData.name}
            onChange={(e) =>
              setSprintData({ ...sprintData, name: e.target.value })
            }
          />

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">
              Connect Objective *
            </label>
            <select
              required
              value={sprintData.project}
              onChange={(e) => setSprintData({ ...sprintData, project: e.target.value })}
              className="w-full bg-black border border-white/20 rounded-xl px-4 py-4 text-white text-[11px] font-black tracking-widest uppercase focus:outline-none focus:border-primary focus:bg-white/5 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled className="bg-black">SELECT TARGET PROJECT</option>
              {projects?.map(p => (
                <option key={p._id} value={p._id} className="bg-black">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="startDate"
              label="Engagement Start"
              type="date"
              required
              value={sprintData.startDate}
              onChange={(e) =>
                setSprintData({ ...sprintData, startDate: e.target.value })
              }
            />
            <FormField
              id="endDate"
              label="Mission End"
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
              className="flex-1 rounded-xl py-4 text-[11px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              isLoading={isLoading}
            >
              INITIATE
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="px-8 bg-black rounded-xl border border-white/20 text-[11px] font-black text-white/80 uppercase hover:text-white hover:border-primary transition-all shadow-none"
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

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
  projects = [],
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#11111E] border border-white/5 rounded-none p-8 sm:p-10 shadow-2xl shadow-primary/20 animate-in zoom-in-95 duration-300 relative overflow-hidden">
        {/* Glow Element */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-6 bg-primary" />
          <h3 className="text-xl font-bold text-white tracking-widest uppercase">
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
              Connect Objective
            </label>
            <select
              required
              value={sprintData.project}
              onChange={(e) => setSprintData({ ...sprintData, project: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-none px-4 py-4 text-white text-[11px] font-bold outline-hidden focus:border-primary/40 focus:bg-white/[0.06] transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled className="bg-[#11111E]">Select Target Project</option>
              {projects?.map(p => (
                <option key={p._id} value={p._id} className="bg-[#11111E]">
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
              className="flex-1 rounded-none py-4 text-[11px] font-black tracking-widest uppercase"
              isLoading={isLoading}
            >
              INITIATE
            </Button>
            <Button
              type="button"
              variant="glass"
              onClick={onClose}
              className="px-8 rounded-none border border-white/5 text-[11px] font-black uppercase opacity-40 hover:opacity-100"
            >
              ABORT
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
  projects: PropTypes.array,
};

export default SprintCreationModal;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjectManagement } from '../hooks/useProjectManagement';
import {
  Settings,
  Save,
  ArrowLeft,
  Trash2,
  Archive,
  Shield,
  Rocket,
  Clock,
} from 'lucide-react';
import ProjectService from '../api/projectService';
import CenteredLoading from '../components/atoms/CenteredLoading';

// Allows configuration of project metadata and provides options for managing or deleting projects.
const ProjectSettings = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const { project, isLoading, error, queryClient } = useProjectManagement(
    id,
    user
  );

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'Active',
      });
    }
  }, [project]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await ProjectService.updateProject(id, formData);
      queryClient.invalidateQueries(['project', id]);
      // Show success (optional)
    } catch (err) {
      console.error('Failed to update project', err);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <CenteredLoading />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10 animate-in fade-in duration-700">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Back to Mission
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">
              Project ID: {id.slice(-6)}
            </span>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="border-b border-white/5 pb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter flex items-center gap-4">
          <Settings className="text-primary" size={28} />
          Project configuration
        </h1>
        <p className="text-text-muted mt-2 font-medium">
          Fine-tune mission parameters and structural metadata.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Sidebar Navigation (Visual Only for now) */}
        <div className="space-y-1">
          {[
            { label: 'General Info', icon: <Rocket size={14} />, active: true },
            {
              label: 'Access Control',
              icon: <Shield size={14} />,
              to: `/team/project/${id}`,
            },
            { label: 'Mission History', icon: <Clock size={14} /> },
            { label: 'Danger Zone', icon: <Trash2 size={14} />, danger: true },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => item.to && navigate(item.to)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                item.active
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : item.danger
                    ? 'text-status-error hover:bg-status-error/10'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-8">
          <form
            onSubmit={handleSave}
            className="bg-white/[0.02] border border-white/5 p-5 sm:p-8 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                Mission Long-Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-background-dark/50 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">
                Mission Briefing / Description
              </label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-background-dark/50 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all font-medium text-sm"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary-dark text-white font-black py-3 px-8 rounded-xl transition-all shadow-lg flex items-center gap-3 text-[10px] uppercase tracking-widest disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Syncing...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Danger Zone Section */}
          <div className="pt-10 border-t border-white/5">
            <h3 className="text-status-error text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <Shield size={16} /> Danger Zone
            </h3>
            <div className="bg-status-error/5 border border-status-error/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h4 className="text-white font-bold text-sm">
                  Delete this mission
                </h4>
                <p className="text-text-muted text-[10px] mt-1">
                  Once deleted, all logs and sub-tasks are cleared from nexus.
                </p>
              </div>
              <button className="bg-status-error/10 hover:bg-status-error text-status-error hover:text-white border border-status-error/20 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                TERMINATE PROJECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;

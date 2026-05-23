import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProjectManagement } from '../../hooks/useProjectManagement';
import {
  Settings,
  Save,
  ChevronLeft,
  Trash2,
  Shield,
  Rocket,
  Clock,
  Activity,
  Box,
} from 'lucide-react';
import ProjectService from '../../api/projectApi';
import CenteredLoading from '../../components/atoms/CenteredLoading';
import { BackButton } from '../../components/atoms';

/**
 * Tactical Project Settings Interface.
 * Orchestrates mission parameter modification and administrative overrides.
 * Optimized for industrial sunlight legibility and decision-first engineering.
 */
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
    status: 'OPERATIONAL',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'OPERATIONAL',
      });
    }
  }, [project]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await ProjectService.updateProject(id, formData);
      queryClient.invalidateQueries(['project', id]);
    } catch (err) {
      console.error('Linkage update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <CenteredLoading />;

  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
        {/* Navigation & Status Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <BackButton />

          <div className="flex items-center gap-4">
            <span className="px-3 py-1.5 bg-primary/20 border border-primary/40 rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-lg">
              PROJECT ID: {id.slice(-8).toUpperCase()}
            </span>
            <div className="h-1 w-6 bg-white/20 rounded-full" />
            <span className="text-[9px] font-black text-white/80 uppercase tracking-widest animate-pulse">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div className="border-b border-white/15 pb-10">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 bg-black border border-white/20 rounded-2xl flex items-center justify-center text-primary shadow-2xl">
              <Settings size={32} />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                Project Configuration
              </h1>
              <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.3em]">
                Manage your project settings and configuration details.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {[
              {
                label: 'General Info',
                icon: <Rocket size={16} />,
                active: true,
              },
              {
                label: 'Access Control',
                icon: <Shield size={16} />,
                to: `/team/project/${id}`,
              },
              { label: 'Activity Log', icon: <Clock size={16} /> },
              { label: 'Health Metrics', icon: <Activity size={16} /> },
              {
                label: 'Danger Zone',
                icon: <Trash2 size={16} />,
                danger: true,
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => item.to && navigate(item.to)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  item.active
                    ? 'bg-primary/20 text-primary border-primary/40 shadow-xl'
                    : item.danger
                      ? 'text-status-error/60 border-transparent hover:border-status-error hover:bg-status-error/10 hover:text-status-error'
                      : 'text-white/40 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Main Control Console */}
          <div className="lg:col-span-3 space-y-10">
            <form
              onSubmit={handleSave}
              className="bg-white/5 border border-white/20 p-8 sm:p-10 rounded-2xl shadow-3xl space-y-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                    <Box size={14} className="text-primary" /> PROJECT NAME
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-14 bg-black border border-white/20 px-6 rounded-xl text-white font-black text-sm uppercase tracking-widest focus:outline-none focus:border-primary focus:bg-white/5 transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                    <Activity size={14} className="text-primary" /> PROJECT
                    STATUS
                  </label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full h-14 bg-black border border-white/20 px-6 rounded-xl text-white font-black text-[11px] uppercase tracking-widest focus:outline-none focus:border-primary appearance-none transition-all shadow-inner"
                    >
                      <option value="Active" className="bg-[#121212]">
                        ACTIVE
                      </option>
                      <option value="On Hold" className="bg-[#121212]">
                        ON HOLD
                      </option>
                      <option value="Completed" className="bg-[#121212]">
                        COMPLETED
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.25em] ml-1">
                  PROJECT DESCRIPTION
                </label>
                <textarea
                  rows="6"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-black border border-white/20 px-6 py-5 rounded-xl text-white font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-primary focus:bg-white/5 transition-all leading-relaxed shadow-inner"
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary-dark text-black font-black py-4 px-12 rounded-xl transition-all shadow-2xl shadow-primary/40 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} strokeWidth={3} />
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="pt-12 border-t border-white/15">
              <div className="flex items-center gap-4 mb-8">
                <Shield size={20} className="text-status-error" />
                <h3 className="text-status-error text-[11px] font-black uppercase tracking-[0.4em]">
                  Project Deletion
                </h3>
              </div>

              <div className="bg-status-error/5 border border-status-error/25 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 transition-all hover:bg-status-error/10">
                <div className="text-center sm:text-left space-y-2">
                  <h4 className="text-white font-black text-lg uppercase tracking-tight">
                    Delete Project
                  </h4>
                  <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    This action results in the permanent erasure of all project
                    data, <br className="hidden sm:block" /> tasks, and
                    associated records.
                  </p>
                </div>
                <button className="bg-status-error text-white font-black px-10 py-4 rounded-xl text-[10px] uppercase tracking-[0.25em] transition-all hover:bg-red-600 shadow-xl shadow-status-error/20 active:scale-95">
                  DELETE PROJECT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;

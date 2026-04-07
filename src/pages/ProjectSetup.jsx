import React, { useState } from 'react';
import { Target, Users, Shield, ArrowRight, Layout, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';

// A dedicated workspace area for creating new projects, with standard dashboard UI and approved clear text.
const ProjectSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleCreateProject, newProjectName, setNewProjectName } = useDashboard(user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onInitialize = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleCreateProject(e);
      navigate('/project-info');
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 pt-10 pb-8 space-y-10 font-sans relative">
      
      {/* Dashboard Header with Approved Clear Text */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-20">
        <div className="space-y-3 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[28px] font-black text-white tracking-tighter uppercase leading-tight">
              CREATE A NEW <span className="text-secondary">PROJECT</span>
            </h2>
          </div>
          <p className="text-text-muted text-sm font-medium opacity-60 max-w-xl">
            Set up a new project to start managing tasks, team collaboration, and development cycles in your workspace.
          </p>
        </div>
      </header>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left: Project Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-background-light/30 border border-white/5 p-8 md:p-12 glass shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            
            <form onSubmit={onInitialize} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Target size={12} className="text-primary" /> PROJECT NAME
                  </label>
                  <Input 
                    placeholder="e.g. Mobile App Dev" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="bg-white/[0.03] border-white/10 rounded-none h-12 text-sm font-bold tracking-widest placeholder:text-text-muted/20 focus:border-primary/50"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Users size={12} className="text-secondary" /> WORKSPACE
                  </label>
                  <div className="h-12 flex items-center px-4 bg-white/[0.02] border border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    GLOBAL_WORKSPACE_BRANCH
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <Button 
                  type="submit" 
                  size="xl" 
                  variant="primary"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto px-10 h-14 rounded-none text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl"
                >
                  CREATE PROJECT <ArrowRight size={14} className="ml-2" />
                </Button>
                <button 
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="text-[10px] font-black text-text-muted hover:text-white uppercase tracking-[0.2em] transition-colors"
                >
                  Cancel Setup
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Key Features */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 p-8 space-y-8">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-4">
              PROJECT FEATURES
            </h3>
            
            {[
              { icon: <Target size={18} className="text-primary" />, title: "TASK TRACKING", desc: "Organize and track items with full isolation." },
              { icon: <Zap size={18} className="text-secondary" />, title: "SPRINT READY", desc: "Instantly link to your development cycles." },
              { icon: <Shield size={18} className="text-primary" />, title: "ACCESS CONTROL", desc: "Manage member permissions securely." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 p-2 bg-white/5 h-fit">{feature.icon}</div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{feature.title}</h4>
                  <p className="text-[10px] text-text-muted font-bold leading-relaxed opacity-60">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border border-primary/20 bg-primary/5">
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] leading-relaxed">
              Once created, your project will appear in the Intelligence Hub for full orchestration and reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSetup;

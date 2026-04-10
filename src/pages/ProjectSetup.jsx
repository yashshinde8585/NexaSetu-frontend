import React, { useState } from 'react';
import { Target, Users, Shield, ArrowRight, Layout, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Skeleton from '../components/atoms/Skeleton';

const SetupSkeleton = () => (
  <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-12 pt-10 pb-8 space-y-10">
    <div className="space-y-4">
      <Skeleton className="h-10 w-96 rounded-none" />
      <Skeleton className="h-4 w-full max-w-xl rounded-none" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 xl:col-span-8">
        <Skeleton className="h-[500px] w-full rounded-none" />
      </div>
      <div className="lg:col-span-5 xl:col-span-4 space-y-6">
        <Skeleton className="h-64 w-full rounded-none" />
        <Skeleton className="h-24 w-full rounded-none" />
      </div>
    </div>
  </div>
);

// A dedicated workspace area for creating new projects, with standard dashboard UI and approved clear text.
const ProjectSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleCreateProject, newProjectName, setNewProjectName, isLoading } = useDashboard(user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const onInitialize = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await handleCreateProject(e);
      navigate('/project-info');
    } catch (error) {
      console.error('Failed to create project:', error);
      setSubmitError(error?.message || 'The Secure Gateway rejected the project initialization protocol. Please check your connection and unique project name.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <SetupSkeleton />;

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
          <p className="text-text-muted text-sm font-medium opacity-80 max-w-xl">
            Set up a new project to start managing tasks, team collaboration, and development cycles in your workspace.
          </p>
        </div>
      </header>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left: Project Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-background-light/30 border border-white/5 p-8 md:p-12 glass shadow-2xl relative overflow-hidden group">
            {submitError && (
              <div className="mb-8 p-6 bg-status-error/10 border border-status-error/20 flex gap-4 animate-in slide-in-from-top-4 duration-500">
                <AlertCircle className="text-status-error shrink-0" size={20} />
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Initialization Protocol Failed</h4>
                  <p className="text-[10px] text-status-error/80 font-bold leading-relaxed">{submitError}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={onInitialize} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted/80 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Target size={12} className="text-primary" /> PROJECT NAME
                  </label>
                  <Input 
                    placeholder="e.g. Mobile App Dev" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="bg-white/[0.06] border-white/15 rounded-none h-12 text-sm font-bold tracking-widest placeholder:text-text-muted/40 focus:border-primary/50"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted/80 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Users size={12} className="text-secondary" /> WORKSPACE
                  </label>
                  <div className="h-12 flex items-center px-4 bg-white/[0.04] border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest">
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
                  disabled={isSubmitting}
                  className={`text-[10px] font-black text-text-muted uppercase tracking-[0.2em] transition-colors ${isSubmitting ? 'opacity-20 cursor-not-allowed' : 'hover:text-white'}`}
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
                  <p className="text-[10px] text-text-muted font-bold leading-relaxed opacity-80">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
};

export default ProjectSetup;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createProject } from '../api/projectService';
import { getDashboardStats } from '../api/dashboardService';

const Dashboard = () => {
  const [data, setData] = useState({
    summary: { total: 0, todo: 0, in_progress: 0, done: 0 },
    projects: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      setData(res.data.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await createProject({ name: newProjectName });
      setNewProjectName('');
      setShowForm(false);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to create project');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { summary, projects, recentActivity } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-text-muted mt-1 text-lg">Your project health and activity at a glance</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition duration-200 shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95"
        >
          {showForm ? 'Cancel' : (
            <><span className="text-xl">+</span> New Project</>
          )}
        </button>
      </div>

      {error && <div className="bg-status-error/10 border border-status-error/20 text-status-error px-4 py-3 rounded-xl">{error}</div>}

      {/* New Project Form */}
      {showForm && (
        <form onSubmit={handleCreateProject} className="bg-background-light p-8 rounded-2xl shadow-2xl border border-white/5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Give your project a name..."
              className="flex-1 bg-background-dark text-text border border-white/10 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg transition-all"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
              autoFocus
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-xl transition duration-200 shadow-lg"
            >
              Start Project
            </button>
          </div>
        </form>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tasks', value: summary.total, color: 'bg-white/5 border-white/10', icon: '📝' },
          { label: 'Pending', value: summary.todo, color: 'bg-status-info/10 border-status-info/20 text-status-info', icon: '⏳' },
          { label: 'In Progress', value: summary.in_progress, color: 'bg-status-warning/10 border-status-warning/20 text-status-warning', icon: '🚀' },
          { label: 'Completed', value: summary.done, color: 'bg-status-success/10 border-status-success/20 text-status-success', icon: '✅' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${stat.color} shadow-sm transition-all hover:scale-[1.02] cursor-default group`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold uppercase tracking-wider opacity-80">{stat.label}</span>
              <span className="text-2xl group-hover:animate-bounce">{stat.icon}</span>
            </div>
            <div className="text-4xl font-black">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Project List with Progress */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">📂 Your Projects</h2>
          {projects.length === 0 ? (
            <div className="bg-background-light/50 p-12 rounded-3xl text-center border border-dashed border-white/10">
              <p className="text-text-muted text-lg">No projects active. Create one to start tracking!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/project/${project._id}`}
                  className="bg-background-light p-6 rounded-2xl shadow-lg border border-white/5 hover:border-primary/40 hover:shadow-primary/5 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.name}</h3>
                    <span className="text-xs font-bold text-text-muted bg-black/30 px-2 py-1 rounded uppercase tracking-tighter">
                      {project.totalTasks} Tasks
                    </span>
                  </div>
                  
                  <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-text-muted">Progress</span>
                      <span className={project.percentage === 100 ? 'text-status-success' : 'text-primary-light'}>{project.percentage}%</span>
                    </div>
                    <div className="w-full bg-background-dark rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${project.percentage === 100 ? 'bg-status-success' : 'bg-primary'}`} 
                        style={{ width: `${project.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">⏱️ Recent Activity</h2>
          <div className="bg-background-light/40 rounded-3xl p-6 border border-white/10 space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-text-muted text-sm italic text-center py-10">No recent activity detected.</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity._id} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      activity.status === 'done' ? 'bg-status-success' : 
                      activity.status === 'in_progress' ? 'bg-status-warning' : 'bg-status-info'
                    }`}></div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight mb-1">{activity.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold uppercase">
                          {activity.project.name}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {new Date(activity.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI Feature Highlighting */}
          <div className="bg-gradient-to-br from-secondary/40 to-primary/40 p-6 rounded-3xl border border-white/10 shadow-xl overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-lg font-black italic tracking-tighter mb-2">✨ NexaAI Pro Tips</h3>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Connect Github to unlock passive task detection. We'll extract tasks directly from your code commits!
                </p>
                <Link to="/dashboard" className="text-xs font-bold underline hover:text-white transition-colors">
                  Go to Project Board
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 group-hover:scale-125 transition-transform duration-500">🤖</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Activity, Sparkles, Bot, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActivityFeed = ({ recentActivity = [] }) => {
  return (
    <div className="lg:col-span-4 space-y-8">
      <div className="bg-background-light/10 rounded-xl p-5 border border-white/5 sticky top-24">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text-muted/60 mb-6 flex items-center gap-2">
          <Activity size={14} className="text-primary" /> Live Feed
        </h2>
        
        {recentActivity.length === 0 ? (
          <p className="text-text-muted text-[10px] italic text-center py-10 border border-dashed border-white/5 rounded-lg">No activity recorded.</p>
        ) : (
          <div className="relative space-y-6 ml-2">
            <div className="absolute left-[3px] top-2 bottom-2 w-[1px] bg-linear-to-b from-primary/30 via-white/5 to-transparent shadow-[0_0_8px_rgba(59,130,246,0.2)]" />
            
            {recentActivity.map((activity) => (
              <div key={activity._id} className="relative pl-6 group/item">
                <div className={`absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full ring-2 ring-background z-10 transition-all ${
                  activity.status === 'done' ? 'bg-status-success' :
                  activity.status === 'in_progress' ? 'bg-status-warning' : 'bg-status-info'
                }`}></div>
                
                <div className="flex flex-col">
                  <h4 className="font-bold text-xs leading-tight text-white/90 group-hover/item:text-primary transition-colors cursor-default">
                    {activity.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-text-muted/80 font-bold">
                      {activity.project?.name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[9px] text-text-muted/50 font-bold">
                      {new Date(activity.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 bg-linear-to-br from-secondary/10 via-primary/10 to-transparent p-5 rounded-xl border border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-sm font-black italic tracking-tighter mb-2 flex items-center gap-2 text-white/90">
              <Sparkles size={16} className="text-secondary animate-pulse" /> AI Insights
              <div className="relative group/tooltip inline-block">
                <div className="w-3 h-3 rounded-full border border-text-muted/30 flex items-center justify-center text-[7px] font-black text-text-muted/60 cursor-help hover:border-secondary hover:text-secondary transition-colors italic">i</div>
                <div className="absolute bottom-full left-0 mb-2 w-40 p-2 bg-background-dark/95 border border-white/10 rounded-lg text-[8px] font-bold normal-case text-white shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all z-50">
                  AI Task Extraction converts commits into tasks.
                </div>
              </div>
            </h3>
            <p className="text-[11px] text-text-muted leading-relaxed mb-4">
              Connect Github repositories to unlock passive task detection.
            </p>
            <Link to="/portfolio" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all group/btn border border-white/5">
              Portfolio Hub
              <Zap size={10} className="group-hover/btn:fill-primary transition-all" />
            </Link>
          </div>
          <Bot className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-700 text-white" />
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;

import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';


const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Kept for state safety but effectively decommissioned

    // Inline SVG Icons (Geometric & Monochromatic, matching typography stroke)
    const Icons = {
        ArrowRight: () => (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        ),
        Layers: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
        ),
        Shield: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        Cpu: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
            </svg>
        ),
        Activity: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
        Terminal: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
        ),
        Refresh: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
        ),
        Zap: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        PieChart: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
        ),
        Menu: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
        ),
        X: () => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        )
    };

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-white selection:text-black antialiased overflow-x-hidden">
      <Navbar />

      <header className="relative min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        <div className="max-w-[1440px] w-full flex flex-col items-center justify-center">
          <h1 className="text-[14vw] sm:text-[12vw] md:text-[8vw] lg:text-[9vw] font-bold leading-[0.9] md:leading-[0.8] tracking-[-0.05em] uppercase mb-8">
            Execution<br />Autonomous
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 font-light tracking-tight leading-relaxed">
            The Institutional-Grade Autonomous Execution Engine. Decouple engineering from friction with predictive orchestration and automated resource flow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto px-10 md:px-12 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] hover:invert transition-all flex items-center justify-center gap-4">
              Launch Engine <Icons.ArrowRight />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-10 md:px-12 py-5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
              View Documentation
            </Link>
          </div>
        </div>
      </header>

      <div className="w-full border-y border-white/10 py-12 bg-black overflow-hidden relative">
        <div className="flex whitespace-nowrap gap-24 items-center animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-24 text-[11px] font-black uppercase tracking-[0.6em] text-white/20">
              <span>Institutional Governance</span>
              <span className="w-1.5 h-1.5 bg-white/20 rotate-45" />
              <span>Zero Data Loss</span>
              <span className="w-1.5 h-1.5 bg-white/20 rotate-45" />
              <span>Predictive Risk Detection</span>
              <span className="w-1.5 h-1.5 bg-white/20 rotate-45" />
              <span>Live Codebase Sync</span>
              <span className="w-1.5 h-1.5 bg-white/20 rotate-45" />
            </div>
          ))}
        </div>
      </div>

      <section id="matrix" className="max-w-[1440px] mx-auto px-6 py-24 md:py-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">System Features</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mt-6">Engine Capabilities</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 bg-white/10 gap-[1px] border border-white/10 overflow-hidden">
          <div className="md:col-span-4 bg-background-light p-8 sm:p-12 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[320px]">
            <div className="flex items-start justify-between">
              <div className="p-4 border border-white/10 group-hover:border-white/30 transition-colors text-white/40 group-hover:text-white">
                <Icons.Shield />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Governance</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Access Control</h3>
              <p className="text-white/40 text-xs font-light leading-relaxed">
                Govern organizational security with precise, role-based visibility control.
              </p>
            </div>
          </div>

          <div className="md:col-span-8 bg-background-light p-8 sm:p-12 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[320px] border-t md:border-t-0 md:border-l border-white/10">
            <div className="flex items-start justify-between">
              <div className="p-4 border border-white/10 group-hover:border-white/30 transition-colors text-white/40 group-hover:text-white">
                <Icons.Refresh />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Integrations</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Codebase Sync</h3>
              <p className="text-white/40 text-xs font-light leading-relaxed max-w-sm">
                Sync GitHub repositories to track PRs, commits, and production status in real-time.
              </p>
            </div>
          </div>

          <div className="md:col-span-8 bg-background-light p-8 sm:p-12 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[320px] border-t border-white/10">
            <div className="flex items-start justify-between">
              <div className="p-4 border border-white/10 group-hover:border-white/30 transition-colors text-white/40 group-hover:text-white">
                <Icons.Activity />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Analytics</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Health Metrics</h3>
              <p className="text-white/40 text-xs font-light leading-relaxed max-w-sm">
                Monitor portfolio velocity and eliminate systemic friction points with predictive scoring.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-background-light p-8 sm:p-12 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[320px] border-t md:border-t-0 md:border-l border-white/10 md:border-t border-white/10">
            <div className="flex items-start justify-between">
              <div className="p-4 border border-white/10 group-hover:border-white/30 transition-colors text-white/40 group-hover:text-white">
                <Icons.Terminal />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Orchestration</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Command Bar</h3>
              <p className="text-white/40 text-xs font-light leading-relaxed">
                Orchestrate workspace operations through a natural language interface.
              </p>
            </div>
          </div>

          <div className="md:col-span-6 bg-background-light p-8 sm:p-12 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[320px] border-t border-white/10">
            <div className="flex items-start justify-between">
              <div className="p-4 border border-white/10 group-hover:border-white/30 transition-colors text-white/40 group-hover:text-white">
                <Icons.Layers />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Infrastructure</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Environments</h3>
              <p className="text-white/40 text-xs font-light leading-relaxed">
                Provision scalable team infrastructure and project workspaces in seconds.
              </p>
            </div>
          </div>

          <div className="md:col-span-6 bg-background-light p-8 sm:p-12 flex flex-col justify-between group hover:bg-background-elevated transition-colors min-h-[320px] border-t md:border-t-1 md:border-l border-white/10">
            <div className="flex items-start justify-between">
              <div className="p-4 border border-white/10 group-hover:border-white/30 transition-colors text-white/40 group-hover:text-white">
                <Icons.PieChart />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Resources</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Optimization</h3>
              <p className="text-white/40 text-xs font-light leading-relaxed">
                Visualize cross-team dependencies and optimize technical load distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="verticals" className="max-w-[1440px] mx-auto px-6 py-24 md:py-40 border-t border-white/10">
        <div className="mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">User Solutions</span>
          <h2 className="text-5xl font-bold tracking-tighter uppercase mt-6">Engineered for every role</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white/10 gap-[1px] border border-white/10">
          {[
            { role: 'Executive', target: 'CTOs & VPs', outcome: 'Portfolio Clarity' },
            { role: 'Delivery', target: 'EMs & Leads', outcome: 'Velocity Stability' },
            { role: 'Technical', target: 'Architects', outcome: 'Enforced Standards' },
            { role: 'Quality', target: 'QA Managers', outcome: 'Early Risk Signals' },
            { role: 'Junior', target: 'New Grads', outcome: 'Guided Action' },
            { role: 'Talent', target: 'HR', outcome: 'Burnout Detection' }
          ].map((v, i) => (
            <div key={i} className="bg-background-light p-8 sm:p-12 hover:bg-background-elevated transition-colors flex flex-col min-h-[240px] md:min-h-[280px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 mb-4">{v.role}</span>
              <h4 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2">{v.outcome}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/10 mt-auto">{v.target}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tiers" className="max-w-[1440px] mx-auto px-6 py-24 md:py-40 border-t border-white/10">
        <div className="mb-24 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Pricing Plans</span>
          <h2 className="text-5xl font-bold tracking-tighter uppercase mt-6">Simple, transparent plans</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white/10 gap-[1px] border border-white/10">
          {[
            { plan: 'Starter', price: 'Free', feat: '3 Active Projects', cta: 'Start for Free' },
            { plan: 'Professional', price: '$49/mo', feat: 'Unlimited Execution', cta: 'Start Professional', recommended: true },
            { plan: 'Enterprise', price: 'Custom Pricing', feat: 'Global Sync', cta: 'Contact Sales' }
          ].map((p, i) => (
            <div key={i} className={`bg-background-light p-10 sm:p-16 flex flex-col text-center ${p.recommended ? 'relative' : ''}`}>
              {p.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest">
                  Recommended
                </div>
              )}
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8">{p.plan}</span>
              <div className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">{p.price}</div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/10 mb-12">{p.feat}</span>
              <Link to="/register" className={`w-full py-5 text-[10px] font-bold uppercase tracking-widest transition-all ${p.recommended ? 'bg-white text-black' : 'border border-white/10 text-white hover:bg-white hover:text-black'
                }`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

            {/* --- FOOTER --- */}
            <footer className="border-t border-white/10 py-20 md:py-32 px-6">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-24">
                    <div className="max-w-md">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-8 md:mb-12">NexaSetu</h2>
                        <p className="text-white/20 text-[10px] md:text-xs font-light leading-relaxed tracking-wider uppercase">
                            Standardizing engineering execution through autonomous orchestration. Engineered for institutional reliability.
                        </p>
                    </div>
                    <div className="flex flex-col gap-8 text-left md:text-right w-full md:w-auto">
                        <div className="flex flex-wrap gap-8 md:gap-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
                            <a href="#" className="hover:text-white transition-colors">GitHub</a>
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">Legal</a>
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/5">
                            © 2026 NEXASETU AEE. ALL RIGHTS RESERVED.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default memo(Home);

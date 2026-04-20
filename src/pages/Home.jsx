import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, GitBranch, Globe, Terminal, Rocket, Layers, CheckCircle, ArrowRight } from 'lucide-react';

// Hooks & Data
import { ROLE_CARDS } from '../data/home-data.jsx';

// Components
import ChapterLabel from '../components/home/ChapterLabel';
import FeatureCard from '../components/home/FeatureCard';
import RoleCard from '../components/home/RoleCard';
import LandingFooter from '../components/home/LandingFooter';
import { ScrollProgressBar, BackgroundGlow } from '../components/home/HomeVisuals';
import { ROUTES } from '../constants';

/**
 * Home Component
 * The professional landing page for NexaSetu.
 */
const Home = () => {
    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 relative overflow-x-hidden">
            <ScrollProgressBar progress={0} />
            <BackgroundGlow />

            {/* --- Hero Section --- */}
            <header className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white pointer-events-none opacity-[0.03]" />
                
                <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center w-full text-center">
                    <div className="flex flex-col items-center gap-6 md:gap-10">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] max-w-4xl">
                            Stop tracking.
                            <span className="block text-primary">Start orchestrating.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-normal">
                            Eliminate delivery friction with an execution engine that uses predictive intelligence to solve bottlenecks before they happen.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                            <Link to={ROUTES.REGISTER} className="px-8 py-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 active:scale-95 transition-all">
                                Get started free
                            </Link>
                            <Link to={ROUTES.LOGIN} className="px-8 py-4 bg-white/10 text-white text-sm font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2 group">
                                Watch live demo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- Capabilities --- */}
            <section id="features" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
                <div className="max-w-3xl mb-16">
                    <ChapterLabel number={1} label="System" />
                    <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
                        Scalable Execution
                    </h2>
                    <p className="text-lg text-white/60 leading-relaxed">
                        Powerful tools designed to replace fragmented trackers with a unified command and control system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <FeatureCard
                        icon={<Shield className="text-secondary" size={24} />}
                        title="Granular Access Control"
                        description="Manage organizational security with precise, role-based visibility across all levels of leadership."
                    />
                    <FeatureCard
                        icon={<GitBranch className="text-primary-light" size={24} />}
                        title="Live Codebase Sync"
                        description="Connect your GitHub repositories to track PRs, commits, and deployment status in real-time."
                    />
                    <FeatureCard
                        icon={<Globe className="text-status-info" size={24} />}
                        title="Portfolio Health Metrics"
                        description="Analyze cross-project velocity to identify and resolve systemic friction points instantly."
                    />
                    <FeatureCard
                        icon={<Terminal className="text-primary" size={24} />}
                        title="AI-Powered Command Bar"
                        description="Scale orchestration with natural language controls and automated workspace operations."
                    />
                    <FeatureCard
                        icon={<Rocket className="text-primary" size={24} />}
                        title="Instant Environments"
                        description="Provision team workspaces and project infrastructure in seconds, not hours."
                    />
                    <FeatureCard
                        icon={<Layers className="text-status-warning" size={24} />}
                        title="Resource Optimization"
                        description="Balance technical load and visualize cross-team dependencies with surgical precision."
                    />
                </div>
            </section>

            {/* --- Role Command Centers --- */}
            <section className="py-24 md:py-32 px-6 border-y border-white/10 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mb-16">
                        <ChapterLabel number={2} label="Views" />
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
                            Tailored Experience
                        </h2>
                        <p className="text-lg text-white/60 leading-relaxed">
                            Built for every level of engineering. NexaSetu provides purpose-built dashboards that prioritize the data you need to act.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {ROLE_CARDS.map((card, idx) => (
                            <RoleCard key={idx} {...card} />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Pricing / Scalability --- */}
            <section id="pricing" className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
                <div className="max-w-3xl mb-16">
                    <ChapterLabel number={3} label="Pricing" />
                    <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">Built to Scale</h2>
                    <p className="text-lg text-white/60 leading-relaxed">
                        Choose the orchestration level that matches your organization's technical complexity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-10 bg-white/[0.03] rounded-[2rem] border border-white/10 flex flex-col h-full">
                        <h3 className="text-xs text-primary uppercase font-bold tracking-widest mb-4 text-white/80">Core</h3>
                        <div className="text-4xl font-black mb-8">$0</div>
                        <ul className="space-y-4 mb-12 flex-grow">
                            {['1 Active Workspace', '3 Portfolio Projects', 'Basic AI Insights'].map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                                    <CheckCircle size={14} className="text-primary-light" /> {f}
                                </li>
                            ))}
                        </ul>
                        <Link to={ROUTES.REGISTER} className="block w-full py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl text-center uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all">Get started</Link>
                    </div>

                    <div className="p-10 bg-primary/10 border border-primary/30 rounded-[2rem] flex flex-col h-full relative overflow-hidden shadow-2x shadow-primary/5">
                        <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-black text-[9px] font-black uppercase tracking-widest">Recommended</div>
                        <h3 className="text-xs text-primary uppercase font-bold tracking-widest mb-4">Tactical</h3>
                        <div className="text-4xl font-black mb-8">$49/mo</div>
                        <ul className="space-y-4 mb-12 flex-grow">
                            {['Unlimited Projects', 'Full Command Center', 'Predictive AI Risk'].map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm font-bold text-white">
                                    <CheckCircle size={14} className="text-primary" /> {f}
                                </li>
                            ))}
                        </ul>
                        <Link to={ROUTES.REGISTER} className="block w-full py-4 bg-primary text-black font-black rounded-xl text-center uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 hover:opacity-90 transition-all">Start 14-day trial</Link>
                    </div>

                    <div className="p-10 bg-white/[0.03] rounded-[2rem] border border-white/10 flex flex-col h-full">
                        <h3 className="text-xs text-secondary uppercase font-bold tracking-widest mb-4 text-white/80">Division</h3>
                        <div className="text-4xl font-black mb-8">Custom</div>
                        <ul className="space-y-4 mb-12 flex-grow">
                            {['Multi-Division Sync', 'Strategic Oversight', 'Dedicated AI Training'].map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                                    <CheckCircle size={14} className="text-secondary" /> {f}
                                </li>
                            ))}
                        </ul>
                        <Link to={ROUTES.REGISTER} className="block w-full py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl text-center uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all">Talk to sales</Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default React.memo(Home);

import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Users, Rocket, ArrowRight, GitBranch, Cpu, Layout, CheckCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-background-dark text-white selection:bg-primary/30 overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Hero Section */}
            <header className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-black uppercase tracking-widest mb-8 animate-in slide-in-from-top-4 duration-500">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Now in Private Alpha
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] animate-in slide-in-from-bottom-8 duration-700">
                    Bridge the gap<br/>
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-light to-secondary">between Vision</span><br/>
                    and execution
                </h1>

                <p className="max-w-2xl mx-auto text-text-muted text-lg md:text-xl font-medium mb-12 animate-in fade-in duration-1000 delay-300">
                    NexaSetu is the next-generation AI orchestrator for multi-project ecosystems. 
                    Built for high-velocity teams who need strategic clarity and operational speed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in duration-1000 delay-500">
                    <Link 
                        to="/login" 
                        className="group relative px-10 py-4 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        Access Hub <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                        to="/register" 
                        className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] rounded-2xl border border-white/10 hover:border-white/20 transition-all active:scale-95"
                    >
                        Request Trial
                    </Link>
                </div>

                <div className="mt-20 relative animate-in zoom-in-95 fade-in duration-1000 delay-700">
                    <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 via-transparent to-secondary/20 rounded-3xl blur opacity-30"></div>
                    <div className="relative bg-background border border-white/5 rounded-3xl shadow-2xl overflow-hidden p-2">
                        <img 
                            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
                            alt="Dashboard Preview" 
                            className="w-full h-auto rounded-2xl grayscale hover:grayscale-0 transition-all duration-1000 opacity-60 hover:opacity-100"
                        />
                        {/* Fake Dashboard Elements */}
                        <div className="absolute top-10 left-10 p-6 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <Zap size={18} />
                                </div>
                                <span className="font-black text-sm uppercase tracking-widest">Global Velocity</span>
                            </div>
                            <div className="text-3xl font-black text-white">92.4%</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<Cpu className="text-primary" size={32} />}
                        title="Magic Bar AI"
                        description="Control your entire portfolio with natural language. Create projects, assign tasks, and query health with one command."
                    />
                    <FeatureCard 
                        icon={<Shield className="text-secondary" size={32} />}
                        title="Enterprise RBAC"
                        description="Tailored views for C-Suite, Managers, and Devs. Securely manage invitations and project-level permissions."
                    />
                    <FeatureCard 
                        icon={<GitBranch className="text-primary-light" size={32} />}
                        title="GitHub Sync"
                        description="Real-time repository integration. Link commits directly to tasks and monitor PR status without leaving the hub."
                    />
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase italic">Select your <span className="text-primary group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">Command Tier</span></h2>
                    <p className="text-text-muted max-w-2xl mx-auto font-medium">Choose the appropriate strategic scale for your multi-project ecosystem.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Basic Tier */}
                    <div className="p-10 bg-white/5 border border-white/5 rounded-[40px] hover:border-white/20 transition-all flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Solo Architect</h3>
                            <div className="text-5xl font-black mb-4 tracking-tighter">Free</div>
                            <p className="text-text-muted text-sm leading-relaxed">Perfect for independent developers managing up to 3 strategic projects.</p>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 text-sm font-bold text-white/60"><CheckCircle size={16} className="text-primary" /> 1 Workspace</li>
                            <li className="flex items-center gap-3 text-sm font-bold text-white/60"><CheckCircle size={16} className="text-primary" /> 3 Portfolio Projects</li>
                            <li className="flex items-center gap-3 text-sm font-bold text-white/60"><CheckCircle size={16} className="text-primary" /> Basic AI Orchestration</li>
                        </ul>
                        <Link 
                            to="/register?plan=free" 
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl border border-white/10 hover:border-white/20 text-center transition-all"
                        >
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className="p-10 bg-linear-to-br from-primary/10 to-transparent border border-primary/40 rounded-[40px] shadow-2xl shadow-primary/10 relative overflow-hidden flex flex-col scale-105 z-10">
                        <div className="absolute top-6 right-10 bg-primary text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Recommended</div>
                        <div className="mb-8 font-bold">
                            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Hub Executive</h3>
                            <div className="text-5xl font-black mb-2 tracking-tighter">$29<span className="text-lg text-text-muted">/mo</span></div>
                            <p className="text-text-muted text-sm leading-relaxed">Advanced AI insights and high-density team collaboration tools.</p>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 text-sm font-bold text-white"><CheckCircle size={16} className="text-primary" /> Unlimited Projects</li>
                            <li className="flex items-center gap-3 text-sm font-bold text-white"><CheckCircle size={16} className="text-primary" /> Multi-Token Magic Bar</li>
                            <li className="flex items-center gap-3 text-sm font-bold text-white"><CheckCircle size={16} className="text-primary" /> GitHub Cluster Sync</li>
                            <li className="flex items-center gap-3 text-sm font-bold text-white"><CheckCircle size={16} className="text-primary" /> Advanced RBAC Control</li>
                        </ul>
                        <Link 
                            to="/register?plan=pro" 
                            className="w-full py-4 bg-primary hover:bg-primary-light text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary/20 text-center transition-all"
                        >
                            Deploy Pro Hub
                        </Link>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="p-10 bg-white/5 border border-white/5 rounded-[40px] hover:border-white/20 transition-all flex flex-col">
                        <div className="mb-8 font-bold">
                            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Master Orchestrator</h3>
                            <div className="text-5xl font-black mb-4 tracking-tighter">Custom</div>
                            <p className="text-text-muted text-sm leading-relaxed">Dedicated infrastructure and custom AI models for global enterprises.</p>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 text-sm font-bold text-white/60"><CheckCircle size={16} className="text-primary" /> 24/7 Strategic Support</li>
                            <li className="flex items-center gap-3 text-sm font-bold text-white/60"><CheckCircle size={16} className="text-primary" /> Custom AI Model Training</li>
                            <li className="flex items-center gap-3 text-sm font-bold text-white/60"><CheckCircle size={16} className="text-primary" /> Unlimited Workspaces</li>
                        </ul>
                        <Link 
                            to="/register?plan=enterprise" 
                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl border border-white/10 hover:border-white/20 text-center transition-all"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>

            {/* Status Section */}
            <section className="pb-32 px-6">
                <div className="max-w-4xl mx-auto bg-linear-to-br from-white/5 to-transparent border border-white/5 rounded-[40px] p-12 text-center relative overflow-hidden group">
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                    
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 relative z-10">
                        Ready to orchestrate your future?
                    </h2>
                    <p className="text-text-muted mb-10 max-w-xl mx-auto relative z-10 text-lg">
                        Join 200+ stealth engineering teams using NexaSetu to maintain high-density strategic clarity.
                    </p>
                    <Link 
                        to="/register"
                        className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest hover:gap-4 transition-all relative z-10"
                    >
                        Create your instance <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 text-center text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">
                &copy; 2026 NexaSetu Systems · All Rights Reserved
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 bg-white/5 border border-white/5 rounded-[32px] hover:border-primary/20 transition-all group">
        <div className="mb-6 p-4 bg-background-dark border border-white/5 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-3 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-text-muted text-sm leading-relaxed">{description}</p>
    </div>
);

export default Home;

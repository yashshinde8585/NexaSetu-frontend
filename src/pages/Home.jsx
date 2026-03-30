import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Rocket, ArrowRight, GitBranch, 
  Layout, CheckCircle, Terminal, Globe, 
  Layers, Sparkles, Command
} from 'lucide-react';

const Home = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-background-dark text-white selection:bg-primary/30 overflow-x-hidden font-sans">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
            </div>

            {/* Hero Section */}
            <header className="relative z-10 pt-40 pb-32 px-6 max-w-7xl mx-auto text-center">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-in slide-in-from-bottom-8 duration-700">
                    Orchestrate Your <br />
                    <span className="text-gradient">Portfolio Intelligence</span>
                </h1>

                <p className="max-w-3xl mx-auto text-text-muted text-lg md:text-xl font-medium mb-12 animate-in fade-in duration-1000 delay-300 leading-relaxed">
                    NexaSetu bridges the gap between strategic vision and technical execution. 
                    Manage multi-project ecosystems with AI-driven clarity and enterprise-grade security.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-in fade-in duration-1000 delay-500">
                    <Link 
                        to="/login" 
                        className="group relative px-8 py-4 bg-primary hover:bg-primary-light text-white font-bold rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center gap-2 overflow-hidden"
                    >
                        Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                        to="/register" 
                        className="px-8 py-4 glass hover:bg-white/5 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center gap-2"
                    >
                        Request Demo
                    </Link>
                </div>

            </header>

            {/* Features Grid */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Modern <span className="text-gradient">Team Synergy</span></h2>
                    <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">Everything you need to orchestrate complex project landscapes without the overhead.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<Terminal className="text-primary" size={28} />}
                        title="Magic Bar AI"
                        description="Our natural language interface allows you to create projects, assign tasks, and query system health with simple commands."
                    />
                    <FeatureCard 
                        icon={<Shield className="text-secondary" size={28} />}
                        title="Granular RBAC"
                        description="Enterprise-grade security with tailored views for Executives, Tech Leads, and Developers. Secure project isolation."
                    />
                    <FeatureCard 
                        icon={<GitBranch className="text-primary-light" size={28} />}
                        title="GitHub Integration"
                        description="Seamlessly link your codebase. Track PRs, commits, and deployment status directly within the NexaSetu orchestration hub."
                    />
                    <FeatureCard 
                        icon={<Globe className="text-status-info" size={28} />}
                        title="Global Insights"
                        description="Real-time analytics across your entire project portfolio. Identify bottlenecks before they impact your delivery timeline."
                    />
                    <FeatureCard 
                        icon={<Layers className="text-status-warning" size={28} />}
                        title="Resource Mapping"
                        description="Visualize team load and resource allocation. Balanced orchestration for high-density engineering environments."
                    />
                    <FeatureCard 
                        icon={<Rocket className="text-primary" size={28} />}
                        title="Instant Provisioning"
                        description="Spin up new project environments and team workspaces in seconds. Reduce time-to-delivery significantly."
                    />
                </div>
            </section>

            {/* Interactive Demo Preview */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                            <Command size={24} />
                        </div>
                        <h3 className="text-3xl font-bold">The Magic Bar</h3>
                        <p className="text-text-muted text-lg leading-relaxed">
                            Stop clicking through endless menus. Control your entire infrastructure through a unified command interface. 
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle size={18} className="text-status-success" />
                                <span>"Create project Phoenix for team Alpha"</span>
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle size={18} className="text-status-success" />
                                <span>"Show health report for Q1 milestones"</span>
                            </li>
                            <li className="flex items-center gap-3 font-medium">
                                <CheckCircle size={18} className="text-status-success" />
                                <span>"Add @sarah as Tech Lead to Apollo"</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex-1 w-full bg-background-dark/80 rounded-2xl border border-white/10 p-6 shadow-2xl shadow-indigo-500/10">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            <span className="text-[10px] text-text-muted font-mono ml-2 uppercase tracking-widest">NexaSetu-cli</span>
                        </div>
                        <div className="font-mono text-sm space-y-2">
                            <div className="flex gap-2 text-primary-light">
                                <span>$</span>
                                <span className="text-white">nexasetu auth --status</span>
                            </div>
                            <div className="text-text-muted pl-4">Connected to Nexus-Prime [prod-us-east]</div>
                            <div className="flex gap-2 text-primary-light mt-4">
                                <span>$</span>
                                <span className="text-white animate-pulse">|</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Transparent <span className="text-gradient">Strategic Tiers</span></h2>
                    <p className="text-text-muted max-w-2xl mx-auto font-medium">Select the scale of orchestration required for your mission.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                    {/* Basic Tier */}
                    <div className="p-10 glass rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all flex flex-col group h-full">
                        <div className="mb-8">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 mb-6 group-hover:scale-110 transition-transform">
                                <Layout size={24} />
                            </div>
                            <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">Solo Pro</h3>
                            <div className="text-5xl font-bold mb-2">$0</div>
                            <p className="text-text-muted text-sm italic">For independent engineers</p>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={16} className="text-primary" /> 1 Active Workspace</li>
                            <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={16} className="text-primary" /> 3 Portfolio Projects</li>
                            <li className="flex items-center gap-3 text-sm font-medium text-text-muted/50"><CheckCircle size={16} className="text-white/10" /> AI Insights [Limited]</li>
                        </ul>
                        <Link 
                            to="/register" 
                            className="w-full py-4 glass hover:bg-white/10 text-white font-bold rounded-xl text-center transition-all"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className="p-10 bg-linear-to-b from-primary/10 to-transparent glass border border-primary/30 rounded-[2.5rem] shadow-2xl shadow-primary/10 relative overflow-hidden flex flex-col scale-105 z-10 h-[105%] group">
                        <div className="absolute top-6 right-8 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</div>
                        <div className="mb-8 font-bold">
                            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <Sparkles size={28} />
                            </div>
                            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-4">Architecture Pro</h3>
                            <div className="text-5xl font-bold mb-2">$49<span className="text-lg text-text-muted font-medium">/mo</span></div>
                            <p className="text-text-muted text-sm italic">For growing engineering teams</p>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle size={16} className="text-primary" /> Unlimited Projects</li>
                            <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle size={16} className="text-primary" /> Full Magic Bar AI</li>
                            <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle size={16} className="text-primary" /> GitHub Cluster Sync</li>
                            <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle size={16} className="text-primary" /> Priority API Access</li>
                        </ul>
                        <Link 
                            to="/register" 
                            className="w-full py-4 bg-primary hover:bg-primary-light text-white font-bold rounded-xl shadow-xl shadow-primary/30 text-center transition-all"
                        >
                            Select Plan
                        </Link>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="p-10 glass rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all flex flex-col group h-full">
                        <div className="mb-8 font-bold">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 mb-6 group-hover:scale-110 transition-transform">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-sm font-bold text-primary-light uppercase tracking-[0.2em] mb-4">Enterprise</h3>
                            <div className="text-5xl font-bold mb-2">Custom</div>
                            <p className="text-text-muted text-sm italic">For global infrastructure</p>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                            <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={16} className="text-primary" /> Multi-Cloud Deployments</li>
                            <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={16} className="text-primary" /> Custom AI Training</li>
                            <li className="flex items-center gap-3 text-sm font-medium"><CheckCircle size={16} className="text-primary" /> 24/7 Strategic Support</li>
                        </ul>
                        <Link 
                            to="/register" 
                            className="w-full py-4 glass hover:bg-white/10 text-white font-bold rounded-xl text-center transition-all"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="pb-32 px-6">
                <div className="max-w-6xl mx-auto glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group border border-white/10 shadow-3xl">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                    
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 relative z-10">
                        Ready to orchestrate <br />your future?
                    </h2>
                    <p className="text-text-muted mb-12 max-w-2xl mx-auto relative z-10 text-lg md:text-xl font-medium leading-relaxed">
                        Join 500+ high-velocity engineering organizations using NexaSetu to maintain complex project ecosystems without the friction.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Link 
                            to="/register"
                            className="px-10 py-5 bg-white text-background-dark font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                            Get Started Now
                        </Link>
                        <Link 
                            to="/login"
                            className="px-10 py-5 glass font-bold rounded-2xl hover:bg-white/5 border border-white/10 transition-all"
                        >
                            Explore Platform
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5 bg-background-dark/50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6 group w-fit">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black italic">N</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tighter text-white">NexaSetu</span>
                        </Link>
                        <p className="text-text-muted max-w-sm text-lg leading-relaxed">
                            Building the next generation of project orchestration for high-density engineering environments.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Product</h4>
                        <ul className="space-y-4 text-text-muted font-medium">
                            <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link to="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
                        <li><Link to="/roadmap" className="hover:text-primary transition-colors">Roadmap</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
                        <ul className="space-y-4 text-text-muted font-medium">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-sm font-medium">
                    <p>&copy; 2026 NexaSetu Systems Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/security" className="hover:text-white transition-colors">Security</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-10 glass rounded-[2.5rem] border border-white/10 hover:border-primary/30 transition-all group hover:-translate-y-2 duration-500">
        <div className="mb-8 p-4 bg-background-dark border border-white/5 rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-primary/10">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-text-muted text-base leading-relaxed">{description}</p>
    </div>
);

export default Home;

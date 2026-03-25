import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Shield, Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const plans = [
        {
            name: 'Strategy Starter',
            price: 'Free',
            description: 'Perfect for individual builders and solo architects.',
            features: ['1 Workspace', 'Up to 3 Projects', 'AI Task Extraction', 'Basic Analytics'],
            cta: 'Continue with Free',
            highlight: false
        },
        {
            name: 'Growth Engine',
            price: '$29',
            description: 'Fuel your team with advanced AI insights and collaboration.',
            features: ['Unlimited Projects', 'Team Invitations', 'Magic Bar Autopilot', 'Advanced Portfolio Health', 'GitHub Integration'],
            cta: 'Start 14-Day Trial',
            highlight: true
        },
        {
            name: 'Enterprise Hub',
            price: 'Custom',
            description: 'Scale securely with multi-tenant governance and dedicated AI.',
            features: ['Isolated Infrastructure', 'SLA Guarantees', 'Dedicated Support', 'Custom AI Model Training'],
            cta: 'Contact Sales',
            highlight: false
        }
    ];

    const handleSelectPlan = (planName) => {
        // [MVP TODO]: Integrate Stripe Checkout here for live billing.
        // For current demo/validation, we grant access to the workspace directly.
        navigate(user?.role === 'ADMIN' ? '/portfolio' : '/dashboard');
    };

    return (
        <div className="min-h-screen bg-background-dark py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Choose your <span className="text-primary italic">Command Center</span>
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto font-light">
                        Select a plan to finalize your workspace setup. You can upgrade or change your hub's capacity at any time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div 
                            key={plan.name}
                            className={`relative p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.03] animate-in fade-in slide-in-from-bottom-10 delay-[${idx * 150}ms] ${
                                plan.highlight 
                                ? 'bg-background-light border-primary/50 shadow-[0_0_40px_rgba(59,130,246,0.15)] z-10' 
                                : 'bg-background border-white/5 hover:border-white/20'
                            }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-text mb-2 tracking-wide uppercase">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    {plan.price !== 'Free' && plan.price !== 'Custom' && (
                                        <span className="text-text-muted">/mo</span>
                                    )}
                                </div>
                                <p className="text-sm text-text-muted leading-relaxed font-light">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-text/80">
                                        <Check className="text-primary" size={16} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={() => handleSelectPlan(plan.name)}
                                className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group ${
                                    plan.highlight 
                                    ? 'bg-primary text-white hover:bg-primary-light shadow-xl shadow-primary/20' 
                                    : 'bg-white/5 text-white hover:bg-white/10'
                                }`}
                            >
                                {plan.cta}
                                <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white/40">
                    <div className="flex flex-col items-center gap-4">
                        <Shield size={32} className="text-white/20" />
                        <div>
                            <p className="font-bold text-white/60 mb-1">Secure Isolation</p>
                            <p className="text-xs font-light">Multi-tenant kernel ensures your data is strictly siloed from other users.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <Zap size={32} className="text-white/20" />
                        <div>
                            <p className="font-bold text-white/60 mb-1">Instant Deployment</p>
                            <p className="text-xs font-light">Select a plan and your workspace is live within 300ms.</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <Globe size={32} className="text-white/20" />
                        <div>
                            <p className="font-bold text-white/60 mb-1">Global Governance</p>
                            <p className="text-xs font-light">Admin tools to manage your team and projects across the entire portfolio.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;

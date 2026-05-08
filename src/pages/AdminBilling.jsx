import React, { useState } from 'react';
import { useBilling } from '../hooks/useBilling';
import { 
  Check, 
  ArrowRight,
  Loader2,
  X
} from 'lucide-react';

const AdminBilling = () => {
  const { plans, subscription, planName, isLoading, selectPlan, isSelecting } = useBilling();
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  const currentPlanId = subscription?.plan || 'free';
  const currentPlan = plans.find(p => p.id === currentPlanId) || plans.find(p => p.id === 'free');
  
  // Find plans with a higher price point for the featured suggestion
  const availableUpgrades = plans.filter(p => p.price > (currentPlan?.price || 0));
  const featuredUpgrade = availableUpgrades[0]; // Next logical tier

  const handleUpgrade = async (plan) => {
    setSelectedPlan(plan);
    setIsProvisioning(true);
    setProgress(0);

    // UX Provisioning Sequence (15s)
    const duration = 15000;
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min((currentStep / steps) * 100, 99));
    }, interval);

    try {
      const selectPromise = selectPlan({ plan: plan.id });
      await new Promise(resolve => setTimeout(resolve, duration));
      await selectPromise;
      
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setIsProvisioning(false);
        window.location.reload(); // Refresh to update subscription state
      }, 1000);
    } catch (err) {
      console.error('Upgrade failed:', err);
      clearInterval(timer);
      setIsProvisioning(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-4 bg-black min-h-screen animate-in fade-in duration-700">
      {/* Provisioning Overlay */}
      {isProvisioning && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-xs space-y-6 text-center">
            <Loader2 size={24} className="text-primary animate-spin mx-auto" />
            <div className="space-y-2">
              <h3 className="text-[12px] font-black uppercase tracking-widest text-white">Deploying {selectedPlan?.name}</h3>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[9px] uppercase font-black tracking-widest text-white/40">{Math.round(progress)}% Integrated</p>
            </div>
          </div>
        </div>
      )}

      {/* Tactical Orchestration Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <h1 className="text-[14px] font-black tracking-widest uppercase text-white">Billing</h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] max-w-xl">
            Manage subscriptions, track resource usage, and configure payment methods.
          </p>
        </div>

        <button 
          onClick={() => setShowAllPlans(!showAllPlans)}
          className="flex items-center gap-2 text-white/40 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all group bg-white/5 border border-white/10 px-4 py-2 rounded-lg"
        >
          {showAllPlans ? 'Hide Tiers' : 'All Plans'} <ArrowRight size={12} className={`${showAllPlans ? 'rotate-90' : ''} transition-transform`} />
        </button>
      </header>

      {/* Slim Current Plan Card */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex justify-between items-center group hover:bg-white/[0.04] transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Check size={18} strokeWidth={3} />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-[12px] font-black text-white uppercase tracking-tight">{planName}</h2>
              <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase rounded">
                Active
              </span>
            </div>
            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">Standard Sector Access</p>
          </div>
        </div>
        <div className="text-right border-l border-white/5 pl-6">
          <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Users</p>
          <p className="text-2xl font-black text-white tracking-tighter tabular-nums">{subscription?.usage?.users || 1}</p>
        </div>
      </div>

      {/* High-Density Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Projects', used: subscription?.usage?.projects || 0, total: subscription?.limits?.projects },
          { label: 'AI Credits', used: subscription?.usage?.aiUsage || 0, total: subscription?.limits?.aiUsage },
          { label: 'Sprints', used: subscription?.usage?.sprints || 0, total: subscription?.limits?.sprints },
          { label: 'Uptime', used: '99.9', total: '100', unit: '%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-3">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[14px] font-black text-white">{stat.used}</span>
              <span className="text-[9px] text-white/10 font-black">/ {stat.total === Infinity ? '∞' : stat.total}{stat.unit}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary/40 transition-all duration-500" 
                style={{ width: `${stat.total === Infinity ? 20 : (stat.used / stat.total) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* All Plans View - Dense */}
      {showAllPlans && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
          {plans.map(plan => (
            <div key={plan.id} className={`p-5 rounded-xl border transition-all ${plan.id === currentPlanId ? 'bg-white/[0.05] border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-white/[0.02] border-white/10'} flex flex-col gap-5`}>
              <div className="space-y-1">
                <h3 className="font-black text-[9px] text-white/30 uppercase tracking-[0.2em]">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] font-black text-white tracking-tighter">₹{plan.price}</span>
                  <span className="text-[9px] text-white/20 font-black uppercase">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 flex-1">
                {Object.entries(plan.features).map(([key, val]) => (
                  <li key={key} className="flex items-center gap-2 text-[9px] text-white/40 font-black uppercase tracking-wider">
                    <Check size={12} className="text-primary shrink-0" />
                    <span className="truncate">{val === Infinity ? 'Unlimited' : val} {key}</span>
                  </li>
                ))}
              </ul>
              {plan.id !== currentPlanId ? (
                <button 
                  onClick={() => handleUpgrade(plan)}
                  className="w-full py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                  Activate
                </button>
              ) : (
                <div className="w-full py-2 border border-white/10 text-white/30 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2">
                  <Check size={12} /> Current
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Compact Featured Upgrade Card */}
      {!showAllPlans && (
        featuredUpgrade ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 md:p-6 space-y-6 group hover:bg-white/[0.05] transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[60px] -z-10" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-1">
                <h2 className="text-[16px] font-black text-white uppercase tracking-tight">Upgrade to {featuredUpgrade.name}</h2>
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Advance to ₹{featuredUpgrade.price} per node/mo</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setShowAllPlans(true)}
                  className="text-white/20 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors flex-1 sm:flex-initial text-center py-2 px-4 border border-white/5 rounded-lg"
                >
                  View Tiers
                </button>
                <button 
                  onClick={() => setShowAllPlans(true)}
                  className="bg-primary hover:bg-primary/90 text-black px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex-1 sm:flex-initial"
                >
                  Upgrade now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-6">
              {Object.entries(featuredUpgrade.features).slice(0, 4).map(([key, val], idx) => (
                <div key={idx} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30">
                  <Check size={12} className="text-primary" />
                  <span className="truncate">{val === Infinity ? 'Unlimited' : val} {key}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Check size={24} strokeWidth={3} />
            </div>
            <div className="space-y-1">
              <h2 className="text-[12px] font-black text-white uppercase tracking-tight">Enterprise Tier Active</h2>
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">You are currently operating on the highest systemic tier</p>
            </div>
          </div>
        )
      )}

      {/* Slim Payment Configuration */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Payment Configuration</h3>
          <button className="text-[9px] font-black text-primary hover:underline uppercase tracking-widest">Update Method</button>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-7 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[8px] font-black text-white/30 tracking-widest">VISA</div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-black text-white tracking-widest uppercase">•••• •••• •••• 4242</p>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Exp 12/28</p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-[10px] font-black text-white/60 tracking-wider">billing@nexasetu.ai</p>
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Primary Identity</p>
          </div>
        </div>
      </div>

      {/* Compact Audit History */}
      <div className="space-y-3 pt-2">
        <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Audit History</h3>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/10 border border-white/10">
            <X size={16} />
          </div>
          <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">No transaction records</p>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;

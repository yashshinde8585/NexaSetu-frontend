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
    <div className="min-h-screen bg-[#0D0D0D] text-white p-4 md:p-8 max-w-4xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-700">
      {/* Provisioning Overlay */}
      {isProvisioning && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-xs space-y-6 text-center">
            <Loader2 size={28} className="text-[#5865F2] animate-spin mx-auto" />
            <div className="space-y-2">
              <h3 className="text-base font-bold">Deploying {selectedPlan?.name}</h3>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#5865F2] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest text-white/40">{Math.round(progress)}% Integrated</p>
            </div>
          </div>
        </div>
      )}

      {/* Compact Header */}
      <div className="flex justify-between items-center mb-1">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Billing</h1>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Workspace Management</p>
        </div>
        <button 
          onClick={() => setShowAllPlans(!showAllPlans)}
          className="flex items-center gap-2 text-[#888] hover:text-white text-[11px] font-bold transition-all group"
        >
          {showAllPlans ? 'Hide Tiers' : 'All Plans'} <ArrowRight size={14} className={`${showAllPlans ? 'rotate-90' : ''} transition-transform`} />
        </button>
      </div>

      {/* Slim Current Plan Card */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 md:p-5 flex justify-between items-center group hover:bg-[#1a1a1a] transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center text-[#5865F2]">
            <Check size={20} strokeWidth={3} />
          </div>
          <div className="space-y-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">{planName}</h2>
              <span className="px-2 py-0.5 border border-[#5865F2]/30 text-[#5865F2] text-[9px] font-bold rounded-full">
                Active
              </span>
            </div>
            <p className="text-[#555] text-[10px] font-bold uppercase tracking-wide">Standard Sector Access</p>
          </div>
        </div>
        <div className="text-right border-l border-white/5 pl-4">
          <p className="text-[#555] text-[9px] font-bold uppercase tracking-wider mb-0.5">Users</p>
          <p className="text-2xl font-bold tracking-tighter tabular-nums">{subscription?.usage?.users || 1}</p>
        </div>
      </div>

      {/* High-Density Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Projects', used: subscription?.usage?.projects || 0, total: subscription?.limits?.projects },
          { label: 'AI Credits', used: subscription?.usage?.aiUsage || 0, total: subscription?.limits?.aiUsage },
          { label: 'Sprints', used: subscription?.usage?.sprints || 0, total: subscription?.limits?.sprints },
          { label: 'Uptime', used: '99.9', total: '100', unit: '%' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161616]/50 border border-white/5 rounded-xl p-3 space-y-2">
            <span className="text-[9px] font-bold text-[#555] uppercase tracking-widest">{stat.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold">{stat.used}</span>
              <span className="text-[9px] text-white/10 font-bold">/ {stat.total === Infinity ? '∞' : stat.total}{stat.unit}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5865F2]/40 transition-all duration-500" 
                style={{ width: `${stat.total === Infinity ? 20 : (stat.used / stat.total) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* All Plans View - Dense */}
      {showAllPlans && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          {plans.map(plan => (
            <div key={plan.id} className={`p-6 rounded-2xl border transition-all ${plan.id === currentPlanId ? 'bg-white/[0.02] border-[#5865F2]/30' : 'bg-[#161616] border-white/5'} space-y-4`}>
              <div className="space-y-0">
                <h3 className="font-bold text-[11px] text-[#555] uppercase tracking-wider">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">₹{plan.price}</span>
                  <span className="text-[10px] text-[#555]">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 flex-1">
                {Object.entries(plan.features).map(([key, val]) => (
                  <li key={key} className="flex items-center gap-2 text-[10px] text-[#888] font-medium">
                    <Check size={14} className="text-[#5865F2] shrink-0" />
                    <span>{val === Infinity ? 'Unlimited' : val} {key}</span>
                  </li>
                ))}
              </ul>
              {plan.id !== currentPlanId ? (
                <button 
                  onClick={() => handleUpgrade(plan)}
                  className="w-full py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-[#5865F2] hover:text-white transition-all active:scale-95"
                >
                  Activate
                </button>
              ) : (
                <div className="w-full py-2 border border-white/10 text-white/30 text-xs font-bold rounded-full flex items-center justify-center gap-2">
                  <Check size={14} /> Current
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Compact Featured Upgrade Card */}
      {!showAllPlans && (
        featuredUpgrade ? (
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-5 md:p-6 space-y-5 group hover:bg-[#1a1a1a] transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5865F2]/5 blur-[40px] -z-10" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-white">Upgrade to {featuredUpgrade.name}</h2>
                <p className="text-[#888] text-[11px] font-bold uppercase tracking-wide">Advance to ₹{featuredUpgrade.price} per node/mo</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setShowAllPlans(true)}
                  className="text-[#555] hover:text-white text-[11px] font-bold transition-colors flex-1 sm:flex-initial text-center"
                >
                  View Tiers
                </button>
                <button 
                  onClick={() => setShowAllPlans(true)}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95 flex-1 sm:sm:flex-initial"
                >
                  Upgrade now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-white/5 pt-5">
              {Object.entries(featuredUpgrade.features).slice(0, 4).map(([key, val], idx) => (
                <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-[#555]">
                  <Check size={14} className="text-[#5865F2]" />
                  <span className="truncate">{val === Infinity ? 'Unlimited' : val} {key}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-10 h-10 bg-[#5865F2]/10 rounded-full flex items-center justify-center text-[#5865F2]">
              <Check size={20} strokeWidth={3} />
            </div>
            <div className="space-y-0">
              <h2 className="text-base font-bold">Enterprise Tier Active</h2>
              <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">You are currently operating on the highest systemic tier</p>
            </div>
          </div>
        )
      )}

      {/* Slim Payment Configuration */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Payment Configuration</h3>
          <button className="text-[10px] font-bold text-[#5865F2] hover:underline">Update Method</button>
        </div>
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-7 bg-white/5 rounded flex items-center justify-center text-[8px] font-black text-white/20">VISA</div>
            <div className="space-y-0">
              <p className="text-sm font-bold tracking-tight">•••• •••• •••• 4242</p>
              <p className="text-[10px] font-bold text-[#555] uppercase">Exp 12/28</p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-[11px] font-bold text-white/80">billing@nexasetu.ai</p>
            <p className="text-[9px] font-bold text-[#555] uppercase">Primary Identity</p>
          </div>
        </div>
      </div>

      {/* Compact Audit History */}
      <div className="space-y-3 pt-2">
        <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Audit History</h3>
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-white/10">
            <X size={16} />
          </div>
          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">No transaction records</p>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;

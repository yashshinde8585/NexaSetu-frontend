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
    <div className="min-h-screen flex items-center justify-center bg-background">
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
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-6 bg-background text-text min-h-screen animate-in fade-in duration-700">
      {/* Provisioning Overlay */}
      {isProvisioning && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-xs space-y-6 text-center">
            <Loader2 size={28} className="text-primary animate-spin mx-auto" />
            <div className="space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-white">DEPLOYING {selectedPlan?.name}</h3>
              <div className="h-1 w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[9px] uppercase font-black tracking-[0.2em] text-white/40">{Math.round(progress)}% INTEGRATED</p>
            </div>
          </div>
        </div>
      )}

      {/* Compact Header */}
      <div className="flex justify-between items-end gap-6 flex-wrap border-b border-white/10 pb-4">
        <div className="space-y-1">
          <h1 className="text-[14px] font-black tracking-widest uppercase text-white">BILLING DIRECTORY</h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] max-w-xl">
            ORCHESTRATE WORKSPACE SUBSCRIPTIONS AND TELEMETRY.
          </p>
        </div>
        <button 
          onClick={() => setShowAllPlans(!showAllPlans)}
          className="h-9 px-6 bg-white/5 border border-white/10 rounded text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white/10 flex items-center justify-center gap-2 group"
        >
          {showAllPlans ? 'HIDE TIERS' : 'ALL PLANS'} <ArrowRight size={14} className={`${showAllPlans ? 'rotate-90' : ''} transition-transform`} />
        </button>
      </div>

      {/* Slim Current Plan Card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:bg-white/10 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
            <Check size={16} strokeWidth={3} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-white">{planName}</h2>
              <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest rounded">
                ACTIVE
              </span>
            </div>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">STANDARD SECTOR ACCESS</p>
          </div>
        </div>
        <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-4 w-full sm:w-auto">
          <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.2em] mb-1">USERS</p>
          <p className="text-xl font-black tracking-tighter tabular-nums text-white">{subscription?.usage?.users || 1}</p>
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
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{stat.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[14px] font-black tracking-widest uppercase text-white">{stat.used}</span>
              <span className="text-[9px] text-white/20 font-black tracking-widest">/ {stat.total === Infinity ? '∞' : stat.total}{stat.unit}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded overflow-hidden">
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
            <div key={plan.id} className={`p-5 rounded-xl border transition-all ${plan.id === currentPlanId ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/10'} space-y-4 flex flex-col`}>
              <div className="space-y-1">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white tracking-widest">₹{plan.price}</span>
                  <span className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em]">/MO</span>
                </div>
              </div>
              <ul className="space-y-3 flex-1 pt-2 border-t border-white/5 mt-2">
                {Object.entries(plan.features).map(([key, val]) => (
                  <li key={key} className="flex items-start gap-2 text-[9px] text-white/60 font-black uppercase tracking-[0.1em]">
                    <Check size={12} className="text-primary shrink-0 mt-0.5" />
                    <span>{val === Infinity ? 'UNLIMITED' : val} {key}</span>
                  </li>
                ))}
              </ul>
              {plan.id !== currentPlanId ? (
                <button 
                  onClick={() => handleUpgrade(plan)}
                  className="w-full h-9 bg-white text-black hover:bg-primary hover:text-black rounded text-[9px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center mt-4"
                >
                  ACTIVATE
                </button>
              ) : (
                <div className="w-full h-9 border border-white/10 text-white/30 text-[9px] font-black uppercase tracking-[0.2em] rounded flex items-center justify-center gap-2 mt-4 bg-black/40">
                  <Check size={12} /> CURRENT
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Compact Featured Upgrade Card */}
      {!showAllPlans && (
        featuredUpgrade ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-5 group hover:bg-white/10 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] -z-10" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-white">UPGRADE TO {featuredUpgrade.name}</h2>
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">ADVANCE TO ₹{featuredUpgrade.price} PER NODE/MO</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setShowAllPlans(true)}
                  className="text-white/40 hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-colors flex-1 sm:flex-initial text-center py-2 px-4"
                >
                  VIEW TIERS
                </button>
                <button 
                  onClick={() => setShowAllPlans(true)}
                  className="bg-primary hover:bg-primary/90 text-black px-6 h-9 rounded text-[9px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex-1 sm:flex-initial flex items-center justify-center"
                >
                  UPGRADE NOW
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-5">
              {Object.entries(featuredUpgrade.features).slice(0, 4).map(([key, val], idx) => (
                <div key={idx} className="flex items-start gap-2 text-[9px] font-black text-white/60 uppercase tracking-[0.1em]">
                  <Check size={12} className="text-primary mt-0.5 shrink-0" />
                  <span className="truncate">{val === Infinity ? 'UNLIMITED' : val} {key}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
              <Check size={16} strokeWidth={3} />
            </div>
            <div className="space-y-1">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-white">ENTERPRISE TIER ACTIVE</h2>
              <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">YOU ARE CURRENTLY OPERATING ON THE HIGHEST SYSTEMIC TIER</p>
            </div>
          </div>
        )
      )}

      {/* Slim Payment Configuration */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">PAYMENT CONFIGURATION</h3>
          <button className="text-[9px] font-black text-primary hover:underline uppercase tracking-widest">UPDATE METHOD</button>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/10 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-7 bg-white/10 rounded flex items-center justify-center text-[8px] font-black text-white/40 tracking-widest">VISA</div>
            <div className="space-y-1">
              <p className="text-[11px] font-black tracking-widest text-white uppercase">•••• •••• •••• 4242</p>
              <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">EXP 12/28</p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-[10px] font-black text-white/80 tracking-widest uppercase">BILLING@NEXASETU.AI</p>
            <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">PRIMARY IDENTITY</p>
          </div>
        </div>
      </div>

      {/* Compact Audit History */}
      <div className="space-y-4 pt-2">
        <div className="px-1">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">AUDIT HISTORY</h3>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 bg-white/5 rounded border border-white/10 flex items-center justify-center text-white/20">
            <X size={14} />
          </div>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">NO TRANSACTION RECORDS</p>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;

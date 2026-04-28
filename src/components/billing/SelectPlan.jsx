import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBilling } from '../../hooks/useBilling';
import DummyCheckoutModal from './DummyCheckoutModal';
import { ROUTES } from '../../constants';
import { Check, ArrowRight, Loader2 } from 'lucide-react';

const SelectPlan = () => {
  const navigate = useNavigate();
  const { plans, subscription, selectPlan, isSelecting, isLoading } = useBilling();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlanClick = (plan) => {
    if (plan.id === subscription?.plan) return;
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    console.log('Provisioning sequence initiated for plan:', selectedPlan?.id);
    setIsModalOpen(false);
    setIsProvisioning(true);
    setProgress(0);

    // Simulated 15-second provisioning sequence
    const duration = 15000;
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const percent = Math.min((currentStep / steps) * 100, 99);
      setProgress(percent);
    }, interval);

    try {
      console.log('Executing selectPlan mutation...');
      // Start the actual API call in the background
      const selectPromise = selectPlan({ plan: selectedPlan.id });

      // Wait for the full 15 seconds to satisfy the UX requirement
      await new Promise(resolve => setTimeout(resolve, duration));
      console.log('Simulated delay complete, awaiting API resolution...');
      await selectPromise;

      console.log('Provisioning successful, showing success popup.');
      clearInterval(timer);
      setProgress(100);
      setIsProvisioning(false);
      setShowSuccess(true);
    } catch (err) {
      console.error('Provisioning failed:', err);
      clearInterval(timer);
      setIsProvisioning(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate(ROUTES.DASHBOARD);
  };

  if (isLoading) return null;

  return (
    <div className="w-full relative">
      {/* Provisioning Loader Overlay */}
      {isProvisioning && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="w-full max-w-sm space-y-8 text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative w-24 h-24 border-2 border-white/5 rounded-full flex items-center justify-center overflow-hidden">
                 <Loader2 size={40} className="text-primary animate-spin" strokeWidth={1} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Provisioning Workspace</h3>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">
                {progress < 30 && "Initializing strategic kernels..."}
                {progress >= 30 && progress < 60 && "Deploying multi-tenant isolation layers..."}
                {progress >= 60 && progress < 90 && "Calibrating AI orchestration nodes..."}
                {progress >= 90 && "Finalizing security handshake..."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-linear shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
                <span>Phase {Math.floor(progress / 25) + 1}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in duration-300">
          <div className="w-full max-w-md bg-[#0A0A0A] border border-status-success/30 rounded-2xl p-10 text-center shadow-[0_0_100px_rgba(var(--status-success-rgb),0.1)]">
            <div className="w-20 h-20 bg-status-success/10 rounded-3xl flex items-center justify-center border border-status-success/20 mx-auto mb-8 animate-bounce">
              <Check className="text-status-success" size={40} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Account Activated</h2>
            <p className="text-xs text-white/40 font-medium leading-relaxed mb-10">
              Your <span className="text-white">{selectedPlan?.name}</span> workspace is now live. 
              All strategic features and increased capacity limits have been successfully unlocked.
            </p>
            <button 
              onClick={handleSuccessClose}
              className="w-full py-4 bg-status-success text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-[0_0_30px_rgba(var(--status-success-rgb),0.4)]"
            >
              Enter Dashboard
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative rounded-xl p-6 border transition-all duration-300 flex flex-col ${
              subscription?.plan === plan.id 
                ? 'bg-primary/[0.03] border-primary/50 ring-1 ring-primary/20' 
                : 'bg-white/[0.01] border-white/10 hover:border-white/30'
            }`}
          >
            {subscription?.plan === plan.id && (
              <div className="absolute -top-2.5 right-4 bg-primary text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-sm shadow-sm tracking-widest">
                Active Tier
              </div>
            )}

            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">{plan.name}</h3>
                <p className="text-[10px] text-white/40 font-medium leading-tight line-clamp-2">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 py-2 border-y border-white/5">
                <span className="text-2xl font-black text-white">₹{plan.price}</span>
                <span className="text-white/20 text-[9px] font-black uppercase tracking-wider">/ mo</span>
              </div>

              <div className="space-y-2.5 pt-2">
                {Object.entries(plan.features).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <Check className={subscription?.plan === plan.id ? 'text-primary mt-0.5' : 'text-white/30 mt-0.5'} size={10} />
                    <span className="text-[11px] text-white/70 font-semibold leading-none">
                      <span className="text-white">{value === Infinity ? 'Unlimited' : value}</span> {key === 'aiUsage' ? 'AI Credits' : key}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handlePlanClick(plan)}
              disabled={subscription?.plan === plan.id || isSelecting}
              className={`mt-6 w-full py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
                subscription?.plan === plan.id
                  ? 'bg-white/5 text-white/20 cursor-default border-white/5'
                  : 'bg-white text-black border-white hover:bg-primary hover:border-primary'
              }`}
            >
              {subscription?.plan === plan.id ? 'Integrated' : 'Activate Plan'}
            </button>
          </div>
        ))}
      </div>

      <DummyCheckoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        plan={selectedPlan}
        isProcessing={isSelecting}
      />
    </div>
  );
};

export default SelectPlan;

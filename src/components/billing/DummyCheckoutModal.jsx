import React from 'react';
import { Shield, Check, X, CreditCard, Loader2 } from 'lucide-react';

const DummyCheckoutModal = ({
  isOpen,
  onClose,
  onConfirm,
  plan,
  isProcessing,
  billingCycle = 'monthly',
  currency = 'inr',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Shield className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Secure Upgrade</h3>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">
                NexaSetu Billing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Selected Plan</span>
              <span className="text-white font-bold px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs uppercase tracking-wider">
                {plan?.name}
              </span>
            </div>
            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <span className="text-white/60 text-sm">Amount Due Today</span>
              <div className="text-right">
                <div className="text-2xl font-black text-white">
                  {currency === 'inr'
                    ? `₹${billingCycle === 'monthly' ? plan?.price : ((plan?.priceAnnual || Math.round(plan?.price * 0.8)) * 12).toLocaleString()}`
                    : `$${billingCycle === 'monthly' ? (plan?.globalPrice || 0) : ((plan?.globalPriceAnnual || 0) * 12).toLocaleString()}`}
                </div>
                <div className="text-[9px] text-white/40 uppercase font-bold tracking-[0.1em] mt-1">
                  {billingCycle === 'monthly'
                    ? 'Billed Monthly'
                    : `${currency === 'inr' ? '₹' : '$'}${currency === 'inr' ? (plan?.priceAnnual || Math.round(plan?.price * 0.8)) : (plan?.globalPriceAnnual || 0)}/mo billed annually`}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-4 h-4 rounded-full bg-status-success/20 flex items-center justify-center border border-status-success/30">
                <Check className="text-status-success" size={10} />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Instant access to all{' '}
                <span className="text-white font-bold">{plan?.name}</span>{' '}
                features including expanded project limits and enhanced AI
                orchestration.
              </p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-4">
            <CreditCard className="text-primary" size={24} />
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-primary tracking-widest">
                Payment Mode
              </p>
              <p className="text-xs text-white/80 font-medium tracking-tight italic">
                Sandbox Simulation Active
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-bold hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-[2] bg-primary hover:bg-primary-hover disabled:bg-primary/20 text-black px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Activation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DummyCheckoutModal;

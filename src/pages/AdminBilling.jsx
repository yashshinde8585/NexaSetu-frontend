import React from 'react';
import { useBilling } from '../hooks/useBilling';
import SelectPlan from '../components/billing/SelectPlan';
import { CreditCard, Zap, ShieldAlert, CheckCircle } from 'lucide-react';

const AdminBilling = () => {
  const { subscription, limits, planName, cancelSubscription, isCanceling, isLoading } = useBilling();

  if (isLoading) return <div className="p-8 text-white/50">Loading billing information...</div>;

  const isFree = subscription?.plan === 'free';
  const isCanceled = subscription?.status === 'canceled';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
          <CreditCard className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Billing & Subscription</h1>
          <p className="text-sm text-white/50 font-medium">Manage your workspace scale and AI orchestration limits.</p>
        </div>
      </div>

      {/* Current Subscription Status */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {isCanceled && (
          <div className="absolute top-0 left-0 right-0 bg-status-error/20 text-status-error text-xs font-bold text-center py-2 border-b border-status-error/30">
            Subscription canceled. You will be downgraded at the end of the billing period.
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10 mt-4">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Current Active Plan</p>
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">{planName}</h2>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  isFree ? 'bg-white/10 text-white/60' : 'bg-primary/20 text-primary border border-primary/30'
                }`}>
                  {subscription?.status}
                </div>
              </div>
            </div>

            <div className="flex gap-8 text-sm pt-4">
              <div>
                <p className="text-white/40 mb-1">Billing Period Start</p>
                <p className="text-white font-medium">{new Date(subscription?.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-white/40 mb-1">Next Renewal</p>
                <p className="text-white font-medium">
                  {subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'Auto-renewing'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            {!isFree && !isCanceled && (
              <button 
                onClick={() => {
                  if(window.confirm('Are you sure you want to cancel your premium subscription? You will lose access to advanced features.')) {
                    cancelSubscription();
                  }
                }}
                disabled={isCanceling}
                className="w-full py-3 rounded-xl border border-status-error/30 text-status-error hover:bg-status-error/10 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isCanceling ? 'Processing...' : 'Cancel Subscription'}
              </button>
            )}
          </div>
        </div>

        {/* Feature Usage */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Zap size={18} className="text-primary" /> Current Cycle Usage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UsageCard 
              title="Active Projects" 
              used={subscription?.usage?.projects || 0} 
              limit={limits?.projects} 
            />
            <UsageCard 
              title="AI Orchestration Credits" 
              used={subscription?.usage?.aiUsage || 0} 
              limit={limits?.aiUsage} 
            />
            <UsageCard 
              title="Team Members" 
              used={subscription?.usage?.users || 0} 
              limit={limits?.users} 
            />
          </div>
        </div>
      </div>

      {/* Upgrade Section */}
      <div className="pt-8">
        <h3 className="text-xl font-bold text-white mb-8 border-l-4 border-primary pl-4">Available Tiers</h3>
        <SelectPlan />
      </div>
    </div>
  );
};

const UsageCard = ({ title, used, limit }) => {
  const isUnlimited = limit === Infinity;
  const percentage = isUnlimited ? 0 : Math.min(100, (used / limit) * 100);
  const isNearLimit = !isUnlimited && percentage > 80;

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-white/60">{title}</span>
        {isNearLimit && <ShieldAlert size={16} className="text-status-warning" />}
      </div>
      
      <div className="flex items-end gap-2">
        <span className="text-3xl font-black text-white">{used}</span>
        <span className="text-white/40 text-sm mb-1">/ {isUnlimited ? '∞' : limit}</span>
      </div>

      {!isUnlimited && (
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${isNearLimit ? 'bg-status-warning' : 'bg-primary'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminBilling;

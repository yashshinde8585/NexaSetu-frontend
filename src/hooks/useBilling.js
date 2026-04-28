import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BillingService from '../api/billingService';
import { useAuth } from '../context/AuthContext';

export const useBilling = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const subscriptionQuery = useQuery({
    queryKey: ['subscription', user?.workspaceId],
    queryFn: () => BillingService.getSubscription().then(res => res.data),
    enabled: !authLoading && !!user?.workspaceId,
  });

  const plansQuery = useQuery({
    queryKey: ['plans'],
    queryFn: () => BillingService.getPlans().then(res => res.data?.plans || []),
    enabled: !authLoading,
  });

  const selectPlanMutation = useMutation({
    mutationFn: ({ plan }) => BillingService.selectPlan(plan, user.workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => BillingService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });

  return {
    subscription: subscriptionQuery.data?.subscription,
    limits: subscriptionQuery.data?.limits,
    planName: subscriptionQuery.data?.planName,
    isLoading: subscriptionQuery.isLoading || plansQuery.isLoading,
    plans: plansQuery.data || [],
    selectPlan: selectPlanMutation.mutateAsync,
    isSelecting: selectPlanMutation.isLoading,
    cancelSubscription: cancelMutation.mutateAsync,
    isCanceling: cancelMutation.isLoading,
  };
};

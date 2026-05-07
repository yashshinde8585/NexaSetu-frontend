import React from 'react';
import { ShieldAlert, CheckCircle, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../context/AuthContext';

const DirectiveBanner = () => {
  const { user, authReady } = useAuth();
  const queryClient = useQueryClient();

  const { data: directives = [], isLoading } = useQuery({
    queryKey: ['directives', user?.workspaceId],
    queryFn: () => apiClient.get('/v1/directives').then(res => res.directives),
    refetchInterval: 60000,
    enabled: authReady && !!user?.workspaceId,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (id) => apiClient.post(`/v1/directives/${id}/acknowledge`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directives'] });
    },
  });

  const activeDirective = directives.find(d => d.status === 'issued');

  if (!activeDirective) return null;

  return (
    <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-6 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/20 p-3 rounded-xl border border-primary/40">
            <ShieldAlert className="text-primary animate-pulse" size={24} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Strategic Directive</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                activeDirective.priority > 7 ? 'bg-status-error text-white' : 'bg-primary text-white'
              }`}>
                P{activeDirective.priority}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{activeDirective.title}</h3>
            <p className="text-sm text-white/60 max-w-2xl">{activeDirective.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => acknowledgeMutation.mutate(activeDirective._id)}
             disabled={acknowledgeMutation.isPending}
             className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300"
           >
             {acknowledgeMutation.isPending ? 'Processing...' : (
               <>
                 <CheckCircle size={16} />
                 Acknowledge Mission
               </>
             )}
           </button>
           <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white hover:border-white/20 transition-all">
             <ChevronRight size={18} />
           </button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
    </div>
  );
};

export default DirectiveBanner;

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';
import { API_ENDPOINTS } from '../../../constants';
import { Lightbulb, AlertCircle, ChevronRight } from 'lucide-react';
import DashboardSection from './DashboardSection';

const StrategicInsights = () => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: () =>
      apiClient.get(API_ENDPOINTS.AI.RECOMMENDATIONS).then((res) => res.data),
    refetchInterval: 300000, // 5 minutes
  });

  if (isLoading) return null;

  return (
    <DashboardSection
      title="Strategic Insights"
      icon={<Lightbulb size={14} className="text-primary" />}
    >
      <div className="space-y-3 pt-2">
        {recommendations?.length > 0 ? (
          recommendations.slice(0, 4).map((rec, i) => (
            <div
              key={i}
              className="group p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 p-1.5 rounded-lg ${
                    rec.priority === 'high'
                      ? 'bg-status-error/10 text-status-error'
                      : rec.priority === 'medium'
                        ? 'bg-status-warning/10 text-status-warning'
                        : 'bg-primary/10 text-primary'
                  }`}
                >
                  <AlertCircle size={12} />
                </div>
                <div className="flex-grow">
                  <p className="text-[11px] font-bold text-white mb-1 leading-tight group-hover:text-primary transition-colors">
                    {rec.message}
                  </p>
                  <p className="text-[9px] text-white/40 font-medium uppercase tracking-wider flex items-center gap-1">
                    Recommendation: {rec.action}
                    <ChevronRight
                      size={10}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
            <p className="text-[10px] text-white/30 uppercase font-black italic tracking-widest">
              No strategic deviations detected.
            </p>
          </div>
        )}
      </div>
    </DashboardSection>
  );
};

export default StrategicInsights;

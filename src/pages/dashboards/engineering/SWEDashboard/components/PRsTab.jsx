import React from 'react';
import { ExternalLink, MessageSquare } from 'lucide-react';

const PRsTab = ({
  pullRequestMetrics = { open: 0, review: 0, merged: 0 },
  pullRequestsList = [],
}) => {
  return (
    <div className="bg-card border border-border-subtle p-6 flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center border-b border-border-subtle pb-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-text">
          Pull Requests Registry
        </h3>
        <div className="flex gap-2 text-[10px] font-bold">
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary">
            Open ({pullRequestMetrics.open})
          </span>
          <span className="px-3 py-1 bg-background-elevated border border-border text-text-subtle">
            In Review ({pullRequestMetrics.review})
          </span>
          <span className="px-3 py-1 bg-background-elevated border border-border text-text-subtle">
            Merged ({pullRequestMetrics.merged})
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-2">
        {pullRequestsList?.map((pr, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-card border border-border-subtle hover:border-primary/40 cursor-pointer"
            onClick={() => pr.link && window.open(pr.link, '_blank')}
          >
            <div className="flex flex-col gap-1 leading-none">
              <span className="text-[10px] font-bold text-primary">
                {pr.number}
              </span>
              <span className="text-xs font-bold text-text">{pr.title}</span>
              <span className="text-[8px] font-black uppercase text-text-subtler tracking-wider">
                Comments: {pr.comments}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-widest ${
                  pr.status === 'Merged'
                    ? 'bg-status-success/15 text-status-success border border-status-success/20'
                    : pr.status === 'In Review'
                      ? 'bg-status-warning/15 text-status-warning border border-status-warning/20'
                      : 'bg-primary/15 text-primary border border-primary/20'
                }`}
              >
                {pr.status}
              </span>
              <ExternalLink size={12} className="text-text-subtler" />
            </div>
          </div>
        ))}
        {(!pullRequestsList || pullRequestsList.length === 0) && (
          <div className="text-center py-12 text-[8px] text-text-subtler uppercase font-black tracking-widest italic">
            No pull requests found
          </div>
        )}
      </div>
    </div>
  );
};

export default PRsTab;

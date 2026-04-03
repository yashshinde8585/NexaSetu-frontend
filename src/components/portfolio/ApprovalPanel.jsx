import React from 'react';

// A panel component that displays pending AI-driven strategic actions requiring user oversight and approval.
const ApprovalPanel = ({ actions, handleApprove, handleReject }) => {
  if (actions.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-10 text-8xl opacity-5 group-hover:scale-125 transition-transform duration-1000">
        ⚡
      </div>
      <div className="flex items-center gap-3 mb-8">
        <span className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 text-xl font-bold">
          Pending Execution
        </span>
        <div>
          <h2 className="text-xl font-black text-white">
            Strategic Approvals Required
          </h2>
          <p className="text-xs text-primary font-bold uppercase tracking-widest">
            AI requires your oversight for high-impact changes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6 tracking-tight">
        {actions.map((action) => (
          <div
            key={action._id}
            className="bg-background-dark/60 border border-white/5 p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 group/item hover:border-primary/30 transition-all"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 bg-white/5 rounded border border-white/10 text-text-muted">
                  Agent: {action.agent}
                </span>
                <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                  {action.type.replace(/_/g, ' ')}
                </span>
              </div>
              <h4 className="text-lg font-bold text-white leading-tight">
                Proposed Change: {action.reason}
              </h4>
              <p className="text-xs text-text-muted">
                Target:{' '}
                <span className="text-white font-bold">
                  {action.targetId?.title ||
                    action.targetId?.name ||
                    'Loading...'}
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => handleApprove(action._id)}
                className="flex-1 px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/30 active:scale-95"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(action._id)}
                className="flex-1 px-8 py-3 bg-white/5 hover:bg-white/10 text-text-muted rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/5"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalPanel;

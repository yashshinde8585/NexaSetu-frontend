import React from 'react';

const CodeTab = ({ codeQuality, pullRequestsList }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Code Quality */}
      <div className="bg-card border border-border-subtle rounded-none p-5">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Code Quality
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="text-xs text-text-subtle font-medium">
              Code Coverage
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text">
                {codeQuality.coverage}%
              </span>
              <span className="text-[10px] text-status-success font-bold flex items-center">
                &uarr; 8%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="text-xs text-text-subtle font-medium">
              ESLint Issues
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text">
                {codeQuality.eslint}
              </span>
              <span className="text-[10px] text-status-success font-bold flex items-center">
                &darr; 3
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="text-xs text-text-subtle font-medium">
              Security Issues
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text">
                {codeQuality.security}
              </span>
              <span className="text-[10px] text-text-subtle font-bold">
                No change
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-text-subtle font-medium">
              Technical Debt
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text">
                {codeQuality.techDebt} days
              </span>
              <span className="text-[10px] text-status-success font-bold flex items-center">
                &darr; 0.4
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pull Requests */}
      <div className="bg-card border border-border-subtle rounded-none p-5">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
            Pull Requests
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {pullRequestsList.map((pr, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1"
            >
              <div className="flex flex-col">
                <span className="font-black text-text">
                  {pr.number} {pr.title}
                </span>
              </div>
              <span
                className={`text-[9px] font-bold uppercase ${
                  pr.status === 'Review'
                    ? 'text-status-warning'
                    : 'text-status-info'
                }`}
              >
                {pr.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeTab;

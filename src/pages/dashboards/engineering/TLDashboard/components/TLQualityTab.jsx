import React from 'react';

const TLQualityTab = ({
  codeHealthOverview = { coverage: 0, eslint: 0, security: 0, debtDays: 0 },
  technicalDebt = [],
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      <div className="lg:col-span-4 bg-card border border-border-subtle p-4 flex flex-col gap-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle block">
          Quality Indicators
        </span>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 border border-border-subtle bg-card">
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
              Code Coverage
            </span>
            <span className="text-[12px] font-black text-[#10B981]">
              {codeHealthOverview.coverage}%
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-border-subtle bg-card">
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
              Lint Warning Count
            </span>
            <span className="text-[12px] font-black text-yellow-500">
              {codeHealthOverview.eslint}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-border-subtle bg-card">
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
              Security Issues
            </span>
            <span className="text-[12px] font-black text-[#EF4444]">
              {codeHealthOverview.security}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 border border-border-subtle bg-card">
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
              Refactor Debt Score
            </span>
            <span className="text-[12px] font-black text-purple-400">
              {codeHealthOverview.debtDays} Days
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 bg-card border border-border-subtle p-4 flex flex-col gap-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-subtle block">
          Structural Technical Debt
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicalDebt?.map((debt, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-background-elevated border border-border border-l-2 border-l-border rounded-none group hover:bg-background-elevated transition-colors"
            >
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-text uppercase tracking-widest group-hover:text-primary transition-colors leading-none">
                  {debt.module} VECTOR
                </span>
                <span className="text-[8px] text-text-subtle font-black uppercase tracking-[0.2em] italic leading-none">
                  {debt.reason}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`px-2 py-0.5 rounded-none border text-[8px] font-black uppercase tracking-[0.2em] leading-none ${
                    debt.debtLevel === 'High'
                      ? 'text-status-error border-status-error/30 bg-status-error/5'
                      : 'text-status-warning border-status-warning/30 bg-status-warning/5'
                  }`}
                >
                  {debt.debtLevel} INTENSITY
                </div>
              </div>
            </div>
          ))}
          {(!technicalDebt || technicalDebt.length === 0) && (
            <div className="col-span-2 py-8 text-center text-[9px] text-text-subtler uppercase tracking-widest italic font-bold">
              No structural technical debt logged
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TLQualityTab;

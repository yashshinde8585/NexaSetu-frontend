import React from 'react';
import { Terminal, Play } from 'lucide-react';

const QualityTab = ({
  codeQuality = { coverage: 0, eslint: 0, security: 0, techDebt: 0 },
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
      <div className="bg-[#0A0C14] border border-white/5 p-6 flex flex-col gap-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">
          Quality Diagnostics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.01] border border-white/5 flex flex-col gap-1 leading-none">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/20">
              Code Coverage
            </span>
            <span className="text-2xl font-black text-[#10B981] mt-1">
              {codeQuality.coverage}%
            </span>
            <span className="text-[7px] text-[#10B981] font-bold mt-2">
              ↑ +5% from last sprint
            </span>
          </div>
          <div className="p-4 bg-white/[0.01] border border-white/5 flex flex-col gap-1 leading-none">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/20">
              Lint Errors
            </span>
            <span className="text-2xl font-black text-status-warning mt-1">
              {codeQuality.eslint}
            </span>
            <span className="text-[7px] text-[#10B981] font-bold mt-2">
              ↓ -5 issues fixed
            </span>
          </div>
          <div className="p-4 bg-white/[0.01] border border-white/5 flex flex-col gap-1 leading-none">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/20">
              Security Threats
            </span>
            <span className="text-2xl font-black text-status-success mt-1">
              {codeQuality.security}
            </span>
            <span className="text-[7px] text-white/30 font-bold mt-2">
              Zero vulnerabilities
            </span>
          </div>
          <div className="p-4 bg-white/[0.01] border border-white/5 flex flex-col gap-1 leading-none">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/20">
              Tech Debt
            </span>
            <span className="text-2xl font-black text-status-info mt-1">
              {codeQuality.techDebt}d
            </span>
            <span className="text-[7px] text-[#10B981] font-bold mt-2">
              ↓ -0.3 days refactored
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0C14] border border-white/5 p-6 flex flex-col gap-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-white">
          Continuous Inspections
        </h3>
        <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center text-primary">
              <Terminal size={14} />
            </div>
            <div>
              <span className="block text-[10px] font-black text-white uppercase tracking-widest">
                Static Analysis
              </span>
              <span className="text-[8px] text-white/40 uppercase font-black">
                SonarQube & ESLint scans: Active
              </span>
            </div>
          </div>
          <span className="text-[8px] font-black text-[#10B981] uppercase tracking-widest px-2 py-0.5 border border-[#10B981]/20 bg-[#10B981]/15 leading-none">
            Passed
          </span>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center text-status-success">
              <Play size={14} />
            </div>
            <div>
              <span className="block text-[10px] font-black text-white uppercase tracking-widest">
                Unit Testing Suite
              </span>
              <span className="text-[8px] text-white/40 uppercase font-black">
                Vitest automation runners
              </span>
            </div>
          </div>
          <span className="text-[8px] font-black text-[#10B981] uppercase tracking-widest px-2 py-0.5 border border-[#10B981]/20 bg-[#10B981]/15 leading-none">
            Passed
          </span>
        </div>
      </div>
    </div>
  );
};

export default QualityTab;

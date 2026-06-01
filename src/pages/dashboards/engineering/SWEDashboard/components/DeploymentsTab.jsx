import React from 'react';

const DeploymentsTab = ({ deployments = [] }) => {
  return (
    <div className="bg-card border border-border-subtle p-6 flex flex-col gap-4 animate-in fade-in duration-300">
      <h3 className="text-sm font-black uppercase tracking-widest text-text">
        Deployments History
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[8px] text-text-subtle uppercase font-black tracking-[0.2em] border-b border-border-subtle">
              <th className="pb-3">Environment</th>
              <th className="pb-3">Version</th>
              <th className="pb-3">Deployed By</th>
              <th className="pb-3">Time</th>
              <th className="pb-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtler text-[10px] font-bold">
            {deployments?.map((dep, idx) => (
              <tr key={idx} className="hover:bg-background-elevated">
                <td className="py-3.5 text-text flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${dep.environment === 'Production' ? 'bg-status-error' : 'bg-primary'}`}
                  />
                  {dep.environment}
                </td>
                <td className="py-3.5 text-text-subtle font-mono">
                  {dep.version}
                </td>
                <td className="py-3.5 text-text-subtle">{dep.deployedBy}</td>
                <td className="py-3.5 text-text-subtler">{dep.time}</td>
                <td className="py-3.5 text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-[1px] text-[8px] font-black uppercase tracking-wider ${
                      dep.status === 'Healthy'
                        ? 'bg-status-success/15 text-status-success border border-status-success/20'
                        : 'bg-primary/15 text-primary border border-primary/20'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {dep.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!deployments || deployments.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-[8px] text-text-subtler uppercase font-black tracking-widest italic"
                >
                  No deployments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeploymentsTab;

import React, { useState, useEffect } from 'react';
import { usePermission } from '../../hooks/usePermission';
import apiClient from '../../api/apiClient';

const MetricsDashboard = () => {
  const { hasPermission, loading: permLoading } = usePermission('view:metrics');
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasPermission) return;
      try {
        setLoading(true);
        const [metricsRes, healthRes] = await Promise.all([
          apiClient.get('/api/v1/observability/metrics'),
          apiClient.get('/api/v1/observability/health'),
        ]);

        setMetrics(metricsRes.data?.data?.metrics || []);
        setHealth(healthRes.data?.data?.health || {});
      } catch (err) {
        console.error('Failed to load metrics dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    if (!permLoading) {
      fetchData();
    }
  }, [hasPermission, permLoading]);

  if (permLoading || loading) return <div>Loading Dashboard...</div>;
  if (!hasPermission)
    return (
      <div className="p-4 bg-red-100 text-red-700">
        Access Denied: You do not have permission to view the metrics dashboard.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Metrics Dashboard (EM/TL)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">System Health</h2>
          <p>
            Status:{' '}
            <span
              className={`font-bold ${health.status === 'HEALTHY' ? 'text-green-600' : 'text-yellow-600'}`}
            >
              {health.status}
            </span>
          </p>
          <p>Database: {health.database}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Recent Execution Metrics
          </h2>
          {metrics && metrics.length > 0 ? (
            <ul>
              {metrics.slice(0, 5).map((m, idx) => (
                <li key={idx} className="border-b py-2">
                  <span className="capitalize font-medium">
                    {m.type.replace('_', ' ')}
                  </span>
                  : {m.value}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent metrics available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;

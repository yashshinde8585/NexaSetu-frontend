import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

// Hook to manage system health monitoring.
export const useSystemIntegrity = (pollInterval = 30000) => {
  const [integrity, setIntegrity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIntegrity = useCallback(async () => {
    try {
      const { data } = await api.get('/health/integrity');
      setIntegrity(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Strategic Sync Failure');
      console.error('[INTEGRITY_SCAN_ERROR]:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrity();

    if (pollInterval <= 0) return;

    const interval = setInterval(fetchIntegrity, pollInterval);
    return () => clearInterval(interval);
  }, [fetchIntegrity, pollInterval]);

  return { integrity, loading, error, refetch: fetchIntegrity };
};

import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

/**
 * Custom hook for managing system integrity monitoring data.
 * Handles fetching, polling, and status management.
 * 
 * @param {number} pollInterval - Frequency of scans in milliseconds
 * @returns {Object} { integrity, loading, error, refetch }
 */
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

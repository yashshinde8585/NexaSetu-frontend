import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const useScopedData = (resource, fetcherFn) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // fetcherFn is expected to call the API endpoint that uses enforceScope()
        // e.g., api.get(`/api/v1/execution/tasks?resource=${resource}`)
        const response = await fetcherFn(resource);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching scoped data', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, resource, fetcherFn]);

  return { data, loading, error };
};

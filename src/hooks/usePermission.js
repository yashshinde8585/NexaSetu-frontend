import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext provides user object
import api from '../api/apiClient';

export const usePermission = (action) => {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (!user) {
        setHasPermission(false);
        setLoading(false);
        return;
      }

      try {
        setHasPermission(true);
      } catch (error) {
        console.error('Permission check failed', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [user, action]);

  return { hasPermission, loading };
};

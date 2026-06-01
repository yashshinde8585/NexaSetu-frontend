import { useState, useEffect } from 'react';
import { usePermissions } from './usePermissions';

/**
 * Hook to check singular permission status for a given action.
 * Reuses the permissions checker to eliminate duplicate logic.
 */
export const usePermission = (action) => {
  const { hasPermission } = usePermissions();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (action) {
      setAllowed(hasPermission(action));
    } else {
      setAllowed(false);
    }
    setLoading(false);
  }, [hasPermission, action]);

  return { hasPermission: allowed, loading };
};

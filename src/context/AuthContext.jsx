import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import AuthService from '../api/authService';

const AuthContext = createContext();

// Manages global authentication, session persistence, and logout signaling
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      
      // Optimization: If no token exists, don't block the UI with an API call
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Add a timeout controller for the /me request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await AuthService.getCurrentUser({ signal: controller.signal });
        clearTimeout(timeoutId);
        setUser(res.data.user);
      } catch (err) {
        // Silently fail auth check if token is invalid or request fails
        setUser(null);
        if (err.name === 'AbortError') {
          console.warn('[AUTH] Authentication check timed out.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const handleGlobalLogout = () => {
      localStorage.removeItem('token');
      setUser(null);
    };

    window.addEventListener('auth:logout', handleGlobalLogout);
    return () => window.removeEventListener('auth:logout', handleGlobalLogout);
  }, []);

  const login = useCallback(async (email, password, config = {}) => {
    try {
      const res = await AuthService.login(email, password, config);
      if (res.token) localStorage.setItem('token', res.token);
      setUser(res.data.user);
      return res;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setUser(null);
      }
      throw err;
    }
  }, []);

  const register = useCallback(
    async (
      name,
      email,
      password,
      role = null,
      assignedProjectId = null,
      workspaceName = null,
      plan = 'free',
      admin = null,
      config = {}
    ) => {
      try {
        const payload = { name, email, password };
        if (role) payload.role = role;
        if (assignedProjectId) payload.assignedProjectId = assignedProjectId;
        if (workspaceName) payload.workspaceName = workspaceName;
        if (plan) payload.plan = plan;
        if (admin !== null && admin !== undefined) payload.admin = admin;

        const res = await AuthService.register(payload, config);
        if (res.token) localStorage.setItem('token', res.token);
        setUser(res.data.user);
        return res;
      } catch (err) {
        throw err;
      }
    },
    []
  );

  const activateInvite = useCallback(async (token, name, password) => {
    try {
      const res = await AuthService.activateInvite(token, name, password);
      if (res.token) localStorage.setItem('token', res.token);
      setUser(res.data.user);
      return res;
    } catch (err) {
      throw err;
    }
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      const res = await AuthService.completeOnboarding();
      setUser(res.data.user);
      return res;
    } catch (err) {
      console.error('Onboarding update failed:', err);
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      activateInvite,
      logout,
      completeOnboarding,
    }),
    [user, loading, login, register, activateInvite, logout, completeOnboarding]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Provides access to the current authentication context and user session details.
export const useAuth = () => useContext(AuthContext);

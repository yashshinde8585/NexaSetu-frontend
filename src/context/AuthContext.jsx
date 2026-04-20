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

// Manages global authentication state, sessions, and user connectivity methods.
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
      try {
        const res = await AuthService.getCurrentUser();
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Binds a listener for global logout events triggered by API interceptors.
    const handleGlobalLogout = () => {
      localStorage.removeItem('token');
      setUser(null);
    };

    window.addEventListener('auth:logout', handleGlobalLogout);
    return () => window.removeEventListener('auth:logout', handleGlobalLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await AuthService.login(email, password);
      if (res.token) localStorage.setItem('token', res.token);
      setUser(res.data.user);
      return res;
    } catch (err) {
      setUser(null);
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
      admin = null
    ) => {
      try {
        const payload = { name, email, password };
        if (role) payload.role = role;
        if (assignedProjectId) payload.assignedProjectId = assignedProjectId;
        if (workspaceName) payload.workspaceName = workspaceName;
        if (plan) payload.plan = plan;
        if (admin !== null && admin !== undefined) payload.admin = admin;

        const res = await AuthService.register(payload);
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

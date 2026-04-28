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
  const [loadingMessage, setLoadingMessage] = useState('Initializing security protocols...');
  const [isWakingUp, setIsWakingUp] = useState(false);

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
      
      if (!token) {
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      // Increase timeout for initial cold start detection
      const timeoutId = setTimeout(() => {
        setIsWakingUp(true);
        setLoadingMessage('Waking up the strategic engine... (this takes ~30s on first load)');
      }, 3000);

      // Final hard timeout
      const hardTimeoutId = setTimeout(() => controller.abort(), 40000); 

      try {
        const res = await AuthService.getCurrentUser({ signal: controller.signal });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        if (err.name === 'AbortError') {
          console.warn('[AUTH] Cold start timeout exceeded.');
        }
      } finally {
        clearTimeout(timeoutId);
        clearTimeout(hardTimeoutId);
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

  const updateAvatar = useCallback(async (formData) => {
    try {
      const res = await AuthService.updateAvatar(formData);
      setUser(res.data.user);
      return res;
    } catch (err) {
      console.error('Avatar update failed:', err);
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      loadingMessage,
      isWakingUp,
      login,
      register,
      activateInvite,
      logout,
      completeOnboarding,
      updateAvatar,
    }),
    [user, loading, loadingMessage, isWakingUp, login, register, activateInvite, logout, completeOnboarding, updateAvatar]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Provides access to the current authentication context and user session details.
export const useAuth = () => useContext(AuthContext);

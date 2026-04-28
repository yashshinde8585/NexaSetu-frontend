import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import AuthService from '../api/authService';
import { AuthContext } from './AuthContextCore';

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

    const handleGlobalLogout = useCallback(() => {
      localStorage.removeItem('token');
      setUser(null);
    }, []);

    useEffect(() => {
      const fetchUser = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          setIsWakingUp(true);
          setLoadingMessage('Waking up the strategic engine... (this takes ~30s on first load)');
        }, 3000);

        const hardTimeoutId = setTimeout(() => controller.abort(), 40000); 

        try {
          const res = await AuthService.getCurrentUser({ signal: controller.signal });
          // Post-Login Initialization: Ensure user, workspace, and role context are fully hydrated
          setUser(res.data.user);
        } catch (err) {
          // Failure Path: Handle expired or invalid tokens by clearing state
          handleGlobalLogout();
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

      // Proactive Session Validation: Verify token integrity every 5 minutes
      const sessionValidator = setInterval(async () => {
        if (localStorage.getItem('token')) {
          try {
            await AuthService.getCurrentUser();
          } catch (err) {
            if (err.status === 401) handleGlobalLogout();
          }
        }
      }, 300000);

      window.addEventListener('auth:logout', handleGlobalLogout);
      return () => {
        window.removeEventListener('auth:logout', handleGlobalLogout);
        clearInterval(sessionValidator);
      };
    }, [handleGlobalLogout]);

  const login = useCallback(async (email, password, config = {}) => {
    try {
      const res = await AuthService.login(email, password, config);
      if (res.token) localStorage.setItem('token', res.token);
      setUser(res.data.user);
      
      // Gap 4: Track login_success
      setTimeout(() => {
        import('../api/metricsService').then(m => m.default.trackEvent('login_success'));
      }, 0);
      
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

        // Gap 4: Track signup_success
        setTimeout(() => {
          import('../api/metricsService').then(m => m.default.trackEvent('signup_success'));
        }, 0);

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
      loadingMessage,
      isWakingUp,
      login,
      register,
      activateInvite,
      logout,
      completeOnboarding,
    }),
    [user, loading, loadingMessage, isWakingUp, login, register, activateInvite, logout, completeOnboarding]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

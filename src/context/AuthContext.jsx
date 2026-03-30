import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = React.useCallback(async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    fetchUser();

    // Listen for global logout events from axios interceptor
    const handleGlobalLogout = () => {
      setUser(null);
      // Optional: window.location.href = '/login';
    };

    window.addEventListener('auth:logout', handleGlobalLogout);
    return () => window.removeEventListener('auth:logout', handleGlobalLogout);
  }, []);

  const login = React.useCallback(async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.data.user);
      return res.data;
    } catch (err) {
      setUser(null);
      throw err;
    }
  }, []);

  const register = React.useCallback(async (name, email, password, role = null, assignedProjectId = null, workspaceName = null, plan = 'free') => {
    try {
      const payload = { name, email, password };
      if (role) payload.role = role;
      if (assignedProjectId) payload.assignedProjectId = assignedProjectId;
      if (workspaceName) payload.workspaceName = workspaceName;
      if (plan) payload.plan = plan;

      const res = await api.post('/auth/register', payload);
      setUser(res.data.data.user);
      return res.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const activateInvite = React.useCallback(async (token, name, password) => {
    try {
      const res = await api.post('/auth/activate', { token, name, password });
      setUser(res.data.data.user);
      return res.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const completeOnboarding = React.useCallback(async () => {
    try {
      const res = await api.patch('/auth/complete-tour');
      setUser(res.data.data.user);
      return res.data;
    } catch (err) {
      console.error('Onboarding update failed:', err);
      throw err;
    }
  }, []);

  const value = React.useMemo(() => ({
    user,
    loading,
    login,
    register,
    activateInvite,
    logout,
    completeOnboarding
  }), [user, loading, login, register, activateInvite, logout, completeOnboarding]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

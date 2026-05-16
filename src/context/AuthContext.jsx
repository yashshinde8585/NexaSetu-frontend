import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useUser, useSignIn, useSignUp, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import AuthService from '../api/authService';
import { setTokenGetter } from '../api/axios';
import socketService from '../services/socketService';
import { queryClient } from '../main';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../constants';
import apiClient from '../api/apiClient';

const AuthStateContext = createContext();
const AuthActionsContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isLoaded: isClerkLoaded, user: clerkUser, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useClerkAuth();
  
  const useClerkAuthFlag = import.meta.env.VITE_USE_CLERK_AUTH === 'true';

  // State for manual auth fallback (Native JWT)
  const [localUser, setLocalUser] = useState(null);
  const [localAuthState, setLocalAuthState] = useState('initializing');

  // Internal counter to force image refreshes when we know an update happened
  const [avatarRefreshCounter, setAvatarRefreshCounter] = useState(0);

  // Backend profile query - only runs when Clerk is signed in
  const { 
    data: backendUser, 
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const res = await AuthService.getCurrentUser();
      return res?.data?.user || res?.user;
    },
    enabled: useClerkAuthFlag ? (isClerkLoaded && isSignedIn) : false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // 401 is handled by interceptor
  });

  // Register token getter with API layer
  useEffect(() => {
    if (useClerkAuthFlag) {
      setTokenGetter(getToken);
    }
  }, [useClerkAuthFlag, getToken]);

  // Derived state
  const authState = useMemo(() => {
    if (useClerkAuthFlag) {
      if (!isClerkLoaded) return 'initializing';
      if (!isSignedIn) return 'unauthenticated';
      if (profileLoading) return 'syncing';
      if (profileError) return 'failed';
      return 'authenticated';
    }
    return localAuthState;
  }, [useClerkAuthFlag, isClerkLoaded, isSignedIn, profileLoading, profileError, localAuthState]);

  const user = useMemo(() => {
    if (useClerkAuthFlag) {
      if (!isSignedIn) return null;
      // Merge Clerk user with backend user data (role, etc.)
      const merged = backendUser ? { ...clerkUser, ...backendUser } : clerkUser;
      
      // Force image refresh if profilePicture exists
      if (merged?.profilePicture) {
        // Use a combination of backend timestamp and our local refresh counter
        const timestamp = backendUser?.updatedAt ? new Date(backendUser.updatedAt).getTime() : '';
        const version = `${timestamp}_${avatarRefreshCounter}`;
        const separator = merged.profilePicture.includes('?') ? '&' : '?';
        merged.profilePicture = `${merged.profilePicture}${separator}v=${version}`;
      }
      
      return merged;
    }
    return localUser;
  }, [useClerkAuthFlag, clerkUser, backendUser, localUser, isSignedIn, avatarRefreshCounter]);

  const logout = useCallback(async () => {
    console.log('[AUTH] Initiating global logout...');
    try {
      if (useClerkAuthFlag) {
        await signOut();
      } else {
        await AuthService.logout();
        setLocalAuthState('unauthenticated');
        setLocalUser(null);
      }
    } catch (err) {
      console.error('[AUTH] Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      // Clear all query caches on logout to prevent data leakage/stale states
      queryClient.clear();
      window.dispatchEvent(new CustomEvent('auth:logout_complete'));
    }
  }, [useClerkAuthFlag, signOut]);

  // Handle global logout events (from API interceptor)
  useEffect(() => {
    const handleGlobalLogout = () => logout();
    const handleLogoutComplete = () => {
      queryClient.clear();
      socketService.disconnect();
    };

    window.addEventListener('auth:logout', handleGlobalLogout);
    window.addEventListener('auth:logout_complete', handleLogoutComplete);
    
    return () => {
      window.removeEventListener('auth:logout', handleGlobalLogout);
      window.removeEventListener('auth:logout_complete', handleLogoutComplete);
    };
  }, [logout]);

  // Socket management - purely reactive
  useEffect(() => {
    if (authState === 'authenticated') {
      const initSocket = async () => {
        const token = useClerkAuthFlag ? await getToken() : localStorage.getItem('token');
        if (token) socketService.connect(token);
      };
      initSocket();
    } else {
      socketService.disconnect();
    }
  }, [authState, useClerkAuthFlag, getToken]);

  const login = useCallback(async (email, password, config = {}) => {
    try {
      const res = await AuthService.login(email, password, config);
      if (res.token) localStorage.setItem('token', res.token);
      const userData = res?.data?.user || res?.user || null;
      setLocalUser(userData);
      if (userData) setLocalAuthState('authenticated');
      return res;
    } catch (err) {
      setLocalAuthState('unauthenticated');
      throw err;
    }
  }, []);

  const register = useCallback(
    async (name, email, password, role, assignedProjectId, workspaceName, plan, admin, config = {}) => {
      try {
        const payload = { name, email, password, role, assignedProjectId, workspaceName, plan, admin };
        const res = await AuthService.register(payload, config);
        if (res.token) localStorage.setItem('token', res.token);
        const userData = res?.data?.user || res?.user || null;
        setLocalUser(userData);
        if (userData) setLocalAuthState('authenticated');
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
      const userData = res?.data?.user || res?.user || null;
      setLocalUser(userData);
      if (userData) setLocalAuthState('authenticated');
      return res;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateAvatar = useCallback(async (formData) => {
    try {
      const res = await AuthService.updateAvatar(formData);
      // Increment local counter to force immediate image reload
      setAvatarRefreshCounter(prev => prev + 1);
      // Invalidate and refetch to ensure all components see the new data
      await queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      return res;
    } catch (err) {
      throw err;
    }
  }, []);

  const stateValue = useMemo(
    () => ({
      user,
      clerkUser: useClerkAuthFlag ? clerkUser : null,
      authState,
      loading: authState === 'initializing' || authState === 'syncing',
      authReady: authState !== 'initializing' && authState !== 'syncing',
      loadingMessage: authState === 'initializing' 
        ? 'Initializing security protocols...' 
        : 'Synchronizing workspace identity...',
      isAuthenticated: authState === 'authenticated' || authState === 'syncing',
      isClerk: useClerkAuthFlag,
    }),
    [user, clerkUser, authState, useClerkAuthFlag]
  );

  const actionsValue = useMemo(
    () => ({
      login,
      register,
      activateInvite,
      updateAvatar,
      logout,
    }),
    [login, register, activateInvite, updateAvatar, logout]
  );

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuth = () => {
  const state = useContext(AuthStateContext);
  const actions = useContext(AuthActionsContext);
  if (!state || !actions) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return { ...state, ...actions };
};

// Targeted hooks for optimized consumption
export const useAuthState = () => useContext(AuthStateContext);
export const useAuthActions = () => useContext(AuthActionsContext);

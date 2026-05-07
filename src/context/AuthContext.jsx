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

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState('initializing'); // 'initializing' | 'syncing' | 'authenticated' | 'unauthenticated' | 'failed'
  const [loadingMessage, setLoadingMessage] = useState('Initializing security protocols...');
  const [isWakingUp, setIsWakingUp] = useState(false);

  const { isLoaded: isClerkLoaded, user: clerkUser, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useClerkAuth();
  
  const useClerkAuthFlag = import.meta.env.VITE_USE_CLERK_AUTH === 'true';

  // Register token getter with API layer once
  useEffect(() => {
    if (useClerkAuthFlag) {
      setTokenGetter(getToken);
    }
  }, [useClerkAuthFlag, getToken]);

  const logout = useCallback(async () => {
    console.log('[AUTH] Initiating global logout...');
    setAuthState('unauthenticated');
    try {
      if (useClerkAuthFlag) {
        await signOut();
      } else {
        await AuthService.logout();
      }
    } catch (err) {
      console.error('[AUTH] Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [useClerkAuthFlag, signOut]);

  // Sync logic: Fetch local user profile when authenticated
  useEffect(() => {
    let isMounted = true;
    
    const syncUser = async () => {
      // 1. Wait for Clerk to load if enabled
      if (useClerkAuthFlag && !isClerkLoaded) return;

      // 2. Resolve initial auth status
      const hasClerkSession = useClerkAuthFlag && isSignedIn;
      const hasLocalToken = !!localStorage.getItem('token');
      
      if (!hasClerkSession && !hasLocalToken) {
        if (isMounted) {
          setAuthState('unauthenticated');
          setUser(null);
        }
        return;
      }

      // 3. Begin synchronization
      console.log('[AUTH] Identity synchronization initiated...');
      setAuthState('syncing');
      setLoadingMessage('Synchronizing workspace identity...');

      const controller = new AbortController();
      const wakingUpTimeout = setTimeout(() => {
        if (isMounted) {
          setIsWakingUp(true);
          setLoadingMessage('Waking up the strategic engine... (First load may take ~30s)');
        }
      }, 4000);

      const hardTimeout = setTimeout(() => controller.abort(), 45000); 

      let attempts = 0;
      const maxRetries = 1; // Only 1 retry for network/5xx, NEVER for 401

      const fetchProfile = async () => {
        try {
          const token = useClerkAuthFlag ? await getToken() : localStorage.getItem('token');
          if (!token) throw new Error('No token available');

          if (useClerkAuthFlag) {
            localStorage.setItem('token', token);
          }

          const res = await AuthService.getCurrentUser({ signal: controller.signal });
          const userData = res?.data?.user || res?.user;
          
          if (!userData) throw new Error('MALFORMED_IDENTITY_PAYLOAD');

          if (isMounted) {
            setUser(userData);
            setAuthState('authenticated');
            console.log('[AUTH] Session stabilized.');
          }
          return true;
        } catch (err) {
          if (err.name === 'AbortError') {
            console.warn('[AUTH] Sync timed out.');
            if (isMounted) setAuthState('failed');
            return false;
          }

          // Handle 401 specifically: Clear state and stop
          if (err.status === 401) {
            console.warn('[AUTH] Invalid session detected during sync.');
            if (isMounted) {
              setUser(null);
              setAuthState('unauthenticated');
            }
            return false;
          }

          // Retry logic only for non-401 errors
          if (attempts < maxRetries && isMounted) {
            attempts++;
            console.log(`[AUTH] Sync attempt ${attempts} failed, retrying in 2s...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return await fetchProfile();
          }

          if (isMounted) {
            console.error('[AUTH] Synchronization failure:', err);
            setAuthState('failed');
            setLoadingMessage('Neural link failure. Please refresh.');
          }
          return false;
        }
      };

      await fetchProfile();
      
      clearTimeout(wakingUpTimeout);
      clearTimeout(hardTimeout);
    };

    syncUser();

    const handleGlobalLogout = () => {
      if (isMounted) {
        logout();
        socketService.disconnect();
      }
    };

    window.addEventListener('auth:logout', handleGlobalLogout);
    return () => {
      isMounted = false;
      window.removeEventListener('auth:logout', handleGlobalLogout);
    };
  }, [useClerkAuthFlag, isClerkLoaded, isSignedIn, getToken, logout]);

  // Socket.io lifecycle management
  useEffect(() => {
    if (authState === 'authenticated') {
      const initSocket = async () => {
        const token = useClerkAuthFlag ? await getToken() : localStorage.getItem('token');
        if (token) socketService.connect(token);
      };
      initSocket();
    } else if (authState === 'unauthenticated' || authState === 'failed') {
      socketService.disconnect();
    }
  }, [authState, useClerkAuthFlag, getToken]);

  const login = useCallback(async (email, password, config = {}) => {
    try {
      const res = await AuthService.login(email, password, config);
      if (res.token) localStorage.setItem('token', res.token);
      const userData = res?.data?.user || res?.user || null;
      setUser(userData);
      if (userData) setAuthState('authenticated');
      return res;
    } catch (err) {
      setAuthState('unauthenticated');
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
        setUser(userData);
        if (userData) setAuthState('authenticated');
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
      setUser(userData);
      if (userData) setAuthState('authenticated');
      return res;
    } catch (err) {
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      authState,
      loading: authState === 'initializing' || authState === 'syncing',
      authReady: authState === 'authenticated' || authState === 'unauthenticated',
      loadingMessage,
      isWakingUp,
      login,
      register,
      activateInvite,
      logout,
      isAuthenticated: authState === 'authenticated',
    }),
    [user, authState, loadingMessage, isWakingUp, login, register, activateInvite, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

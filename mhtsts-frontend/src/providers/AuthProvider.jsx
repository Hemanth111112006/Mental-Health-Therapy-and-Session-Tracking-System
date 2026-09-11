import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { ROLES, ROLE_PERMISSIONS, SESSION_TIMEOUT } from '../config/constants';

// ─── Mock User Database ─────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 'usr_001',
    username: 'admin@mindcare.com',
    email: 'admin@mindcare.com',
    password: 'admin123',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    role: ROLES.ADMIN,
    licenseNumber: null,
    licenseType: null,
    licenseState: null,
    avatar: 'SM',
    title: 'System Administrator',
  },
  {
    id: 'usr_002',
    username: 'psychiatrist@mindcare.com',
    email: 'psychiatrist@mindcare.com',
    password: 'psychiatrist123',
    firstName: 'Mark',
    lastName: 'Rivera',
    role: ROLES.PSYCHIATRIST,
    licenseNumber: 'MD-2024-78231',
    licenseType: 'MD',
    licenseState: 'CA',
    avatar: 'MR',
    title: 'Dr. Mark Rivera, MD',
  },
  {
    id: 'usr_003',
    username: 'psychologist@mindcare.com',
    email: 'psychologist@mindcare.com',
    password: 'psychologist123',
    firstName: 'Emily',
    lastName: 'Chen',
    role: ROLES.PSYCHOLOGIST,
    licenseNumber: 'PSY-2023-44512',
    licenseType: 'PsyD',
    licenseState: 'CA',
    avatar: 'EC',
    title: 'Dr. Emily Chen, PsyD',
  },
  {
    id: 'usr_004',
    username: 'therapist@mindcare.com',
    email: 'therapist@mindcare.com',
    password: 'therapist123',
    firstName: 'Sarah',
    lastName: 'Chen',
    role: ROLES.THERAPIST,
    licenseNumber: 'LCSW-2022-99187',
    licenseType: 'LCSW',
    licenseState: 'CA',
    avatar: 'SC',
    title: 'Dr. Sarah Chen, LCSW',
  },
  {
    id: 'usr_005',
    username: 'supervisor@mindcare.com',
    email: 'supervisor@mindcare.com',
    password: 'supervisor123',
    firstName: 'Patricia',
    lastName: 'Williams',
    role: ROLES.SUPERVISOR,
    licenseNumber: 'LMFT-2021-33456',
    licenseType: 'LMFT',
    licenseState: 'CA',
    avatar: 'PW',
    title: 'Dr. Patricia Williams, LMFT',
  },
  {
    id: 'usr_006',
    username: 'case_manager@mindcare.com',
    email: 'case_manager@mindcare.com',
    password: 'case123',
    firstName: 'Robert',
    lastName: 'Davis',
    role: ROLES.CASE_MANAGER,
    licenseNumber: null,
    licenseType: null,
    licenseState: null,
    avatar: 'RD',
    title: 'Robert Davis',
  },
  {
    id: 'usr_007',
    username: 'receptionist@mindcare.com',
    email: 'receptionist@mindcare.com',
    password: 'receptionist123',
    firstName: 'Jennifer',
    lastName: 'Adams',
    role: ROLES.RECEPTIONIST,
    licenseNumber: null,
    licenseType: null,
    licenseState: null,
    avatar: 'JA',
    title: 'Jennifer Adams',
  },
  {
    id: 'usr_008',
    username: 'client@mindcare.com',
    email: 'client@mindcare.com',
    password: 'client123',
    firstName: 'Alex',
    lastName: 'Morgan',
    role: ROLES.CLIENT,
    licenseNumber: null,
    licenseType: null,
    licenseState: null,
    avatar: 'AM',
    title: 'Alex Morgan',
  },
  {
    id: 'usr_009',
    username: 'counselor@mindcare.com',
    email: 'counselor@mindcare.com',
    password: 'counselor123',
    firstName: 'Daniel',
    lastName: 'Lee',
    role: 'COUNSELOR',
    licenseNumber: null,
    licenseType: null,
    licenseState: null,
    avatar: 'DL',
    title: 'Daniel Lee',
  },
];

/** Demo credentials shown on the login page. */
export const DEMO_CREDENTIALS = MOCK_USERS.map(({ email, password, title, role }) => ({
  email,
  password,
  title,
  role,
}));

// ─── Helpers ────────────────────────────────────────────────────────────────
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  const decoded = decodeJwt(token);
  // JWT exp is in seconds, Date.now() is in milliseconds
  return decoded !== null && decoded.exp * 1000 > Date.now();
}

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Initialise from persisted storage (if the token is still valid)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser && isTokenValid(storedToken)) {
        const parsedUser = JSON.parse(storedUser);
        const decoded = decodeJwt(storedToken);
        if (decoded?.userId && !parsedUser.id) {
          parsedUser.id = decoded.userId;
        }
        const mockProfile = MOCK_USERS.find(u => 
          u.username?.toLowerCase() === parsedUser.username?.toLowerCase() || 
          u.email?.toLowerCase() === parsedUser.username?.toLowerCase() ||
          (parsedUser.role && u.role === parsedUser.role)
        );
        if (mockProfile) {
          if (!parsedUser.firstName || parsedUser.firstName === 'User' || parsedUser.firstName.toLowerCase() === parsedUser.username?.split('@')[0]?.toLowerCase()) {
            parsedUser.firstName = mockProfile.firstName;
          }
          if (!parsedUser.lastName) {
            parsedUser.lastName = mockProfile.lastName;
          }
          if (!parsedUser.title) {
            parsedUser.title = mockProfile.title;
          }
        }
        try { localStorage.setItem(USER_KEY, JSON.stringify(parsedUser)); } catch {}
        return parsedUser;
      }
    } catch {
      /* corrupted storage – fall through */
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  // Refs for timers so they survive renders
  const sessionTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const activityTimerRef = useRef(null);

  // ── Logout ──────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowTimeoutWarning(false);
    clearTimeout(sessionTimerRef.current);
    clearTimeout(warningTimerRef.current);
    navigate('/login', { replace: true });
  }, [navigate]);

  // ── Session Timeout Management ──────────────────────────────────────────
  const resetSessionTimers = useCallback(() => {
    if (!currentUser) return;

    clearTimeout(sessionTimerRef.current);
    clearTimeout(warningTimerRef.current);
    setShowTimeoutWarning(false);

    const timeout = currentUser.role === ROLES.CLIENT
      ? SESSION_TIMEOUT.CLIENT
      : SESSION_TIMEOUT.CLINICAL;

    // Show warning 2 minutes before automatic logout
    warningTimerRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, timeout - SESSION_TIMEOUT.WARNING);

    // Automatic logout when the session expires
    sessionTimerRef.current = setTimeout(() => {
      logout();
    }, timeout);

    // With real JWTs, we don't modify the token client-side.
    // The server determines the expiration. Session timeout here just clears the client state.
  }, [currentUser, logout]);

  // Re-arm timers on activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => {
      // Debounce activity resets to avoid excessive timer churn
      clearTimeout(activityTimerRef.current);
      activityTimerRef.current = setTimeout(() => resetSessionTimers(), 1000);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, handleActivity));
    resetSessionTimers();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearTimeout(sessionTimerRef.current);
      clearTimeout(warningTimerRef.current);
      clearTimeout(activityTimerRef.current);
    };
  }, [isAuthenticated, resetSessionTimers]);

  // ── Login ───────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call real backend API
      const responseData = await authApi.login({ username: email, password });
      
      const { token, username, role } = responseData;
      const decoded = decodeJwt(token);
      
      const mockProfile = MOCK_USERS.find(u => 
        u.username?.toLowerCase() === username?.toLowerCase() || 
        u.email?.toLowerCase() === username?.toLowerCase() ||
        (role && u.role === role)
      );

      const safeUser = { 
        id: decoded?.userId || responseData.userId || mockProfile?.id || 1,
        username, 
        role,
        firstName: mockProfile?.firstName || username.split('@')[0] || 'User',
        lastName: mockProfile?.lastName || '',
        title: mockProfile?.title || ''
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      setIsLoading(false);

      return safeUser;
    } catch (err) {
      setIsLoading(false);
      const errorMsg = err.message || 'Invalid email or password. Please try again.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  // ── Register ────────────────────────────────────────────────────────────
  const register = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Map frontend form data to backend UserDTO
      const userData = {
        username: data.email.split('@')[0], // Derive username from email
        email: data.email,
        password: data.password,
        role: data.accountType === 'therapist' ? 'THERAPIST' : 'CLIENT',
        licenseNumber: data.licenseNumber || null,
      };
      
      const responseData = await authApi.register(userData);
      
      // Registration might not automatically log in the user depending on backend,
      // but if it does return a token, we handle it:
      if (responseData && responseData.token) {
        const token = responseData.token;
        const safeUser = {
          username: responseData.username || userData.username,
          role: responseData.role || userData.role,
          firstName: data.firstName || 'User',
          lastName: data.lastName || ''
        };
  
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
  
        setCurrentUser(safeUser);
        setIsAuthenticated(true);
      }
      setIsLoading(false);

      return responseData;
    } catch (err) {
      setIsLoading(false);
      const errorMsg = err.message || 'An error occurred during registration.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  // ── Permission Check ───────────────────────────────────────────────────
  const hasPermission = useCallback(
    (permission) => {
      if (!currentUser) return false;
      const perms = ROLE_PERMISSIONS[currentUser.role];
      return perms ? perms.includes(permission) : false;
    },
    [currentUser],
  );

  // ── Extend Session (dismiss warning) ───────────────────────────────────
  const extendSession = useCallback(() => {
    setShowTimeoutWarning(false);
    resetSessionTimers();
  }, [resetSessionTimers]);

  // ── Context Value ──────────────────────────────────────────────────────
  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      isLoading,
      error,
      showTimeoutWarning,
      login,
      logout,
      register,
      hasPermission,
      extendSession,
    }),
    [
      currentUser,
      isAuthenticated,
      isLoading,
      error,
      showTimeoutWarning,
      login,
      logout,
      register,
      hasPermission,
      extendSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume the Auth context.
 * Throws if used outside of an AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;

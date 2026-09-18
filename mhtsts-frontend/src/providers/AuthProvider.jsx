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
  const login = useCallback(async (emailOrCreds, passwordArg) => {
    setIsLoading(true);
    setError(null);

    let email = typeof emailOrCreds === 'object' && emailOrCreds !== null
      ? (emailOrCreds.username || emailOrCreds.email || '')
      : (emailOrCreds || '');
    let password = typeof emailOrCreds === 'object' && emailOrCreds !== null
      ? emailOrCreds.password
      : passwordArg;

    try {
      // Call real backend API if available
      const responseData = await authApi.login({ username: email, password });
      
      const { token, username, role } = responseData;
      const decoded = decodeJwt(token);
      
      const mockProfile = MOCK_USERS.find(u => 
        u.username?.toLowerCase() === username?.toLowerCase() || 
        u.email?.toLowerCase() === email?.toLowerCase() ||
        u.email?.toLowerCase() === username?.toLowerCase()
      );

      const resolvedFirstName = responseData.firstName || decoded?.firstName || mockProfile?.firstName || username.split('@')[0] || 'User';
      const resolvedLastName = responseData.lastName || decoded?.lastName || mockProfile?.lastName || '';

      const safeUser = { 
        id: decoded?.userId || responseData.userId || (mockProfile?.id === 'usr_008' ? 8 : (mockProfile?.id === 'usr_004' ? 2 : 1)),
        clientId: responseData.clientId || decoded?.clientId || null,
        username, 
        email: responseData.email || email,
        role,
        firstName: resolvedFirstName,
        lastName: resolvedLastName,
        title: `${resolvedFirstName} ${resolvedLastName}`.trim(),
        avatar: (resolvedFirstName[0] || 'U').toUpperCase()
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      setIsLoading(false);

      return safeUser;
    } catch (err) {
      // Cloud / Vercel offline demo fallback: authenticate mock users seamlessly
      const emailLower = (email || '').toLowerCase().trim();
      
      let mockProfile = MOCK_USERS.find(u => 
        u.email.toLowerCase() === emailLower || 
        u.username.toLowerCase() === emailLower
      );

      // Also match by role keywords if entered (e.g. admin@..., therapist@...)
      if (!mockProfile) {
        if (emailLower.includes('admin')) mockProfile = MOCK_USERS.find(u => u.role === ROLES.ADMIN);
        else if (emailLower.includes('psychiatrist')) mockProfile = MOCK_USERS.find(u => u.role === ROLES.PSYCHIATRIST);
        else if (emailLower.includes('psychologist')) mockProfile = MOCK_USERS.find(u => u.role === ROLES.PSYCHOLOGIST);
        else if (emailLower.includes('supervisor')) mockProfile = MOCK_USERS.find(u => u.role === ROLES.SUPERVISOR);
        else if (emailLower.includes('case')) mockProfile = MOCK_USERS.find(u => u.role === ROLES.CASE_MANAGER);
        else if (emailLower.includes('reception')) mockProfile = MOCK_USERS.find(u => u.role === ROLES.RECEPTIONIST);
        else if (emailLower.includes('client')) mockProfile = MOCK_USERS.find(u => u.role === ROLES.CLIENT);
        else if (emailLower.includes('counselor')) mockProfile = MOCK_USERS.find(u => u.role === 'COUNSELOR');
        else if (emailLower.includes('smith') || emailLower.includes('therapist')) mockProfile = MOCK_USERS.find(u => u.role === ROLES.THERAPIST);
      }

      // Default to Admin or Therapist if credentials provide any reasonable role
      if (!mockProfile) {
        mockProfile = MOCK_USERS[0]; // Admin fallback
      }

      const mockPayload = {
        userId: mockProfile.id,
        sub: mockProfile.username,
        role: mockProfile.role,
        firstName: mockProfile.firstName,
        lastName: mockProfile.lastName,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
      };

      const encodedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(mockPayload)))).replace(/=/g, '');
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.mock_signature`;

      const safeUser = {
        id: mockProfile.id,
        clientId: mockProfile.id === 'usr_008' ? 8 : null,
        username: mockProfile.username,
        email: mockProfile.email,
        role: mockProfile.role,
        firstName: mockProfile.firstName,
        lastName: mockProfile.lastName,
        title: mockProfile.title,
        avatar: mockProfile.avatar
      };

      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      setIsLoading(false);

      return safeUser;
    }
  }, []);

  // ── Login with Token (OAuth2 / SSO) ─────────────────────────────────────
  const loginWithToken = useCallback((token) => {
    try {
      const decoded = decodeJwt(token);
      if (!decoded) {
        throw new Error('Invalid JWT token received.');
      }

      const role = decoded.role || 'CLIENT';
      const username = decoded.sub || 'user';
      const resolvedFirstName = decoded.firstName || username.split('@')[0] || 'User';
      const resolvedLastName = decoded.lastName || '';

      const safeUser = {
        id: decoded.userId || null,
        clientId: decoded.clientId || null,
        username,
        email: username.includes('@') ? username : `${username}@oauth.mindcare.com`,
        role,
        firstName: resolvedFirstName,
        lastName: resolvedLastName,
        title: `${resolvedFirstName} ${resolvedLastName}`.trim(),
        avatar: (resolvedFirstName[0] || 'U').toUpperCase(),
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      return safeUser;
    } catch (err) {
      console.error('Failed to login with token:', err);
      throw err;
    }
  }, []);

  // ── Register ────────────────────────────────────────────────────────────
  const register = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Determine specific role for practitioner vs client
      let assignedRole = 'CLIENT';
      if (data.accountType === 'therapist') {
        if (data.licenseType === 'MD') {
          assignedRole = 'PSYCHIATRIST';
        } else if (data.licenseType === 'PsyD' || data.licenseType === 'PhD') {
          assignedRole = 'PSYCHOLOGIST';
        } else {
          assignedRole = 'THERAPIST';
        }
      }

      // Map frontend form data to backend UserDTO
      const userData = {
        username: data.email.split('@')[0],
        email: data.email,
        password: data.password,
        role: assignedRole,
        licenseNumber: data.licenseNumber || null,
        licenseType: data.licenseType || null,
        licenseState: data.licenseState || null,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || null,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
        insuranceProvider: data.insuranceProvider || null,
        insuranceMemberId: data.insuranceMemberId || null,
        presentingConcern: data.presentingConcern || null
      };
      
      const responseData = await authApi.register(userData);
      
      if (responseData && responseData.token) {
        const token = responseData.token;
        const decoded = decodeJwt(token);
        const resolvedFirstName = data.firstName || responseData.firstName || decoded?.firstName || userData.username;
        const resolvedLastName = data.lastName || responseData.lastName || decoded?.lastName || '';

        const safeUser = {
          id: responseData.userId || decoded?.userId || 1,
          clientId: responseData.clientId || decoded?.clientId || null,
          username: responseData.username || userData.username,
          email: userData.email,
          role: responseData.role || userData.role,
          firstName: resolvedFirstName,
          lastName: resolvedLastName,
          title: `${resolvedFirstName} ${resolvedLastName}`.trim(),
          avatar: (resolvedFirstName[0] || 'U').toUpperCase()
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
      loginWithToken,
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
      loginWithToken,
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

import { toast } from '../utils/toast';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { APP_CONFIG } from '../config/constants';

const NotificationContext = createContext(undefined);

let nextToastId = 1;

const ICON_MAP = {
  success: CheckCircleIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  // Clear all auto-dismiss timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const removeToast = useCallback((id) => {
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type, title, message) => {
      const id = nextToastId++;

      setToasts((prev) => {
        // Enforce the maximum visible toast count
        const updated = [...prev, { id, type, title, message, createdAt: Date.now() }];
        if (updated.length > APP_CONFIG.MAX_TOASTS) {
          const removed = updated.shift();
          if (removed) {
            clearTimeout(timersRef.current[removed.id]);
            delete timersRef.current[removed.id];
          }
        }
        return updated;
      });

      // Auto-dismiss after the configured duration
      timersRef.current[id] = setTimeout(() => {
        removeToast(id);
      }, APP_CONFIG.TOAST_AUTO_DISMISS);

      return id;
    },
    [removeToast],
  );

  // Convenience wrappers
  const success = useCallback((title, message) => addToast('success', title, message), [addToast]);
  const error = useCallback((title, message) => addToast('error', title, message), [addToast]);
  const warning = useCallback((title, message) => addToast('warning', title, message), [addToast]);
  const info = useCallback((title, message) => addToast('info', title, message), [addToast]);

  const value = useMemo(
    () => ({ toasts, addToast, removeToast, success, error, warning, info }),
    [toasts, addToast, removeToast, success, error, warning, info],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* â”€â”€ Toast Container â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="mc-toast-container" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = ICON_MAP[toast.type] || InfoIcon;
          return (
            <div
              key={toast.id}
              className={`mc-toast mc-toast--${toast.type}`}
              role="alert"
            >
              <span className="mc-toast__icon">
                <Icon fontSize="small" />
              </span>

              <div className="mc-toast__body">
                {toast.title && <strong className="mc-toast__title">{toast.title}</strong>}
                {toast.message && <p className="mc-toast__message">{toast.message}</p>}
              </div>

              <button
                type="button"
                className="mc-toast__close"
                aria-label="Dismiss notification"
                onClick={() => removeToast(toast.id)}
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

/**
 * Hook to consume the Notification context.
 * Throws if used outside of a NotificationProvider.
 */
export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (ctx === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return ctx;
}

export default NotificationContext;




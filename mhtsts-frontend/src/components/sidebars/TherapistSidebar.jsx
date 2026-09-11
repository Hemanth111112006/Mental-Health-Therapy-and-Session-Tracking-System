import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import {
  Activity, HeartHandshake, CalendarClock, Calendar, ClipboardPen, Target,
  TrendingUp, TriangleAlert, ShieldPlus, MessageCircle, BellRing, LineChart,
  Stethoscope, SlidersHorizontal, DoorOpen
} from 'lucide-react';

const TherapistSidebar = ({ collapsed }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadMsgCount, setUnreadMsgCount] = React.useState(() => {
    const stored = localStorage.getItem(`mindcare_unread_count_${currentUser?.username || 'user'}`);
    return stored !== null ? parseInt(stored, 10) : 0;
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem(`mindcare_unread_count_${currentUser?.username || 'user'}`);
      if (stored !== null) {
        setUnreadMsgCount(parseInt(stored, 10) || 0);
      }
    };
    window.addEventListener('mindcare_messages_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('mindcare_messages_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [currentUser]);

  if (!currentUser) return null;

  const menuItems = [
    { to: '/therapist/dashboard', icon: <Activity size={18} />, label: 'Dashboard' },
    { to: '/clients', icon: <HeartHandshake size={18} />, label: 'My Clients' },
    { to: '/therapist/appointments', icon: <CalendarClock size={18} />, label: 'Appointments', badge: '3', badgeType: 'warning' },
    { to: '/therapist/calendar', icon: <Calendar size={18} />, label: 'Calendar' },
    { to: '/session-notes', icon: <ClipboardPen size={18} />, label: 'Session Notes' },
    { to: '/treatment-plans', icon: <Target size={18} />, label: 'Treatment Plans' },
    { to: '/outcome-measures', icon: <TrendingUp size={18} />, label: 'Outcome Measures' },
    { to: '/crisis-assessments', icon: <TriangleAlert size={18} />, label: 'Crisis Assessments', badge: '1', badgeType: 'critical' },
    { to: '/safety-plans', icon: <ShieldPlus size={18} />, label: 'Safety Plans' },
    { to: '/messaging', icon: <MessageCircle size={18} />, label: 'Secure Messages', badge: unreadMsgCount > 0 ? String(unreadMsgCount) : null, badgeType: 'active' },
    { to: '/notifications', icon: <BellRing size={18} />, label: 'Notifications' },
    { to: '/reports', icon: <LineChart size={18} />, label: 'Reports' },
    { to: '/settings', icon: <SlidersHorizontal size={18} />, label: 'Settings' }
  ];

  const handleLinkClick = (e, to) => {
    if (to === '/logout') {
      e.preventDefault();
      logout();
      navigate('/login');
    }
  };

  return (
    <aside className={`mc-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="mc-sidebar-brand" style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-primary)' }}>
        <div className="mc-sidebar-logo" style={{ fontSize: 22 }}>🧠</div>
        {!collapsed && (
          <div>
            <div className="mc-sidebar-title" style={{ fontSize: 14, fontWeight: 800 }}>MindCare Clinic</div>
            <div className="mc-sidebar-subtitle" style={{ fontSize: 9 }}>Clinical Provider Workspace</div>
          </div>
        )}
      </div>

      <nav className="mc-sidebar-nav" style={{ flex: 1, overflowY: 'auto', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            onClick={(e) => handleLinkClick(e, item.to)}
            className={({ isActive }) => `mc-sidebar-link ${isActive && item.to !== '/logout' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', textDecoration: 'none', transition: 'all 0.15s ease', marginBottom: 1 }}
          >
            <div className="mc-sidebar-link-icon" style={{ fontSize: 18, minWidth: 24, display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </div>
            {!collapsed && (
              <div className="mc-sidebar-link-text" style={{ flex: 1, fontWeight: 500 }}>
                {item.label}
              </div>
            )}
            {!collapsed && item.badge && (
              <span className={`mc-badge mc-badge-${item.badgeType || 'default'}`} style={{ fontSize: 9, minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mc-sidebar-footer" style={{ padding: '10px 16px', borderTop: '1px solid var(--border-primary)' }}>
        <div className="mc-sidebar-user" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="mc-sidebar-avatar" style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--btn-primary-bg)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold' }}>
            {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="mc-sidebar-user-name" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.firstName} {currentUser.lastName}
              </div>
              <div className="mc-sidebar-user-role" style={{ fontSize: 9, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {currentUser.role?.toLowerCase()?.replace('_', ' ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default TherapistSidebar;

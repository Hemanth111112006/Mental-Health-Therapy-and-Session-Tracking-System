import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import {
  HeartPulse, UserRoundCheck, CalendarHeart, CalendarClock, NotebookPen,
  Pill, ClipboardList, BarChart2, Siren, ShieldCheck, MessagesSquare,
  ClipboardPlus, BadgePlus, Sliders, DoorOpen
} from 'lucide-react';

// Icon substitutions made:
// - PillBottle → Pill (PillBottle does not exist in lucide-react)
// - ActivitySquare → BarChart2 (ActivitySquare does not exist in lucide-react)
// - MessageCircleMore → MessagesSquare (MessageCircleMore does not exist in lucide-react)

const PsychiatristSidebar = ({ collapsed }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const menuItems = [
    { to: '/psychiatrist/dashboard', icon: <HeartPulse size={18} />, label: 'Dashboard' },
    { to: '/clients', icon: <UserRoundCheck size={18} />, label: 'Assigned Clients' },
    { to: '/psychiatrist/appointments', icon: <CalendarHeart size={18} />, label: 'Appointments' },
    { to: '/psychiatrist/calendar', icon: <CalendarClock size={18} />, label: 'Calendar' },
    { to: '/session-notes', icon: <NotebookPen size={18} />, label: 'Clinical Notes' },
    { to: '/treatment-plans', icon: <ClipboardList size={18} />, label: 'Treatment Plans' },
    { to: '/outcome-measures', icon: <BarChart2 size={18} />, label: 'Outcome Measures' },
    { to: '/crisis-assessments', icon: <Siren size={18} />, label: 'Crisis Assessments' },
    { to: '/safety-plans', icon: <ShieldCheck size={18} />, label: 'Safety Plans' },
    { to: '/messaging', icon: <MessagesSquare size={18} />, label: 'Secure Messages' },
    { to: '/reports', icon: <ClipboardPlus size={18} />, label: 'Reports' }
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
        <div className="mc-sidebar-logo" style={{ fontSize: 22 }}>🩺</div>
        {!collapsed && (
          <div>
            <div className="mc-sidebar-title" style={{ fontSize: 14, fontWeight: 800 }}>MindCare Medical</div>
            <div className="mc-sidebar-subtitle" style={{ fontSize: 9 }}>Psychiatric Workspace</div>
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

export default PsychiatristSidebar;

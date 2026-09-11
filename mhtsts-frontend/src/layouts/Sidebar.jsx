import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { ROLES } from '../config/constants';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';

// ─── SRS Permission Matrix: Role-Specific Navigation ────────────────────────
function getNavItemsForRole(role) {
  const dashboard = { to: '/dashboard', icon: <DashboardOutlinedIcon />, label: 'Dashboard' };
  const logout = { to: '/logout', icon: <LogoutOutlinedIcon />, label: 'Logout' };
  const profile = { to: '/profile', icon: <PersonOutlinedIcon />, label: 'Profile' };
  const messaging = { to: '/messaging', icon: <MessageOutlinedIcon />, label: 'Secure Messages' };

  switch (role) {
    // ── CLIENT: View own record, own scheduling, outcome measures (complete),
    //    billing (view), secure messaging (own) ──
    case ROLES.CLIENT:
      return [
        dashboard,
        { to: '/profile', icon: <PersonOutlinedIcon />, label: 'My Record' },
        { to: '/client/appointments', icon: <CalendarMonthOutlinedIcon />, label: 'My Appointments' },
        { to: '/client/calendar', icon: <EventNoteOutlinedIcon />, label: 'My Calendar' },
        { to: '/outcome-measures', icon: <AssessmentOutlinedIcon />, label: 'Outcome Measures' },
        { to: '/billing', icon: <ReceiptOutlinedIcon />, label: 'Billing' },
        messaging,
        logout,
      ];

    // ── RECEPTIONIST: Scheduling (full), client records (scheduling),
    //    billing (own), secure messaging (therapist) ──
    case ROLES.RECEPTIONIST:
      return [
        dashboard,
        { to: '/receptionist/schedule', icon: <CalendarMonthOutlinedIcon />, label: 'Scheduling' },
        { to: '/receptionist/appointments', icon: <EventNoteOutlinedIcon />, label: 'Appointments' },
        { to: '/clients', icon: <PeopleOutlinedIcon />, label: 'Clients' },
        { to: '/waiting-room', icon: <MeetingRoomOutlinedIcon />, label: 'Waiting Room' },
        { to: '/payments', icon: <PaymentOutlinedIcon />, label: 'Payments' },
        { to: '/billing', icon: <ReceiptOutlinedIcon />, label: 'Billing' },
        messaging,
        profile,
        logout,
      ];

    // ── CASE_MANAGER: Client records (assigned), treatment plans (view),
    //    secure messaging (team) ──
    case ROLES.CASE_MANAGER:
      return [
        dashboard,
        { to: '/client-list', icon: <PeopleOutlinedIcon />, label: 'My Clients' },
        { to: '/clients', icon: <FolderSharedOutlinedIcon />, label: 'Client Records' },
        { to: '/treatment-plans', icon: <AssignmentOutlinedIcon />, label: 'Treatment Plans' },
        { to: '/referrals', icon: <LinkOutlinedIcon />, label: 'Referrals' },
        { to: '/resources', icon: <LocalHospitalOutlinedIcon />, label: 'Community Resources' },
        messaging,
        profile,
        logout,
      ];

    // ── THERAPIST: Client records (own cases), session notes, treatment plans,
    //    outcome measures (administer), crisis assessment, safety plans,
    //    scheduling (own), billing (view), messaging (clients) ──
    case ROLES.THERAPIST:
      return [
        dashboard,
        { to: '/clients', icon: <PeopleOutlinedIcon />, label: 'My Clients' },
        { to: '/therapist/appointments', icon: <CalendarMonthOutlinedIcon />, label: 'Appointments' },
        { to: '/therapist/calendar', icon: <EventNoteOutlinedIcon />, label: 'Calendar' },
        { to: '/session-notes', icon: <DescriptionOutlinedIcon />, label: 'Session Notes' },
        { to: '/treatment-plans', icon: <AssignmentOutlinedIcon />, label: 'Treatment Plans' },
        { to: '/outcome-measures', icon: <AssessmentOutlinedIcon />, label: 'Outcome Measures' },
        { to: '/crisis-assessments', icon: <WarningAmberOutlinedIcon />, label: 'Crisis Assessments' },
        { to: '/safety-plans', icon: <HealingOutlinedIcon />, label: 'Safety Plans' },
        { to: '/billing', icon: <ReceiptOutlinedIcon />, label: 'Billing' },
        messaging,
        { to: '/reports', icon: <BarChartOutlinedIcon />, label: 'Reports' },
        profile,
        logout,
      ];

    // ── SUPERVISOR: Client records (supervisees), session notes (review),
    //    treatment plans (review), crisis assessment, outcome measures (view),
    //    supervisor functions, messaging (team) ──
    case ROLES.SUPERVISOR:
      return [
        dashboard,
        { to: '/clients', icon: <PeopleOutlinedIcon />, label: 'Supervisee Clients' },
        { to: '/approvals', icon: <CheckCircleOutlinedIcon />, label: 'Approvals & Co-Sign' },
        { to: '/session-notes', icon: <DescriptionOutlinedIcon />, label: 'Session Notes' },
        { to: '/treatment-plans', icon: <AssignmentOutlinedIcon />, label: 'Treatment Plans' },
        { to: '/outcome-measures', icon: <AssessmentOutlinedIcon />, label: 'Outcome Measures' },
        { to: '/crisis-assessments', icon: <WarningAmberOutlinedIcon />, label: 'Crisis Assessments' },
        { to: '/safety-plans', icon: <HealingOutlinedIcon />, label: 'Safety Plans' },
        messaging,
        { to: '/reports', icon: <BarChartOutlinedIcon />, label: 'Reports' },
        profile,
        logout,
      ];

    // ── PSYCHOLOGIST: Same as Therapist (own cases, session notes,
    //    treatment plans, outcome measures administer, crisis, safety plans) ──
    case ROLES.PSYCHOLOGIST:
      return [
        dashboard,
        { to: '/clients', icon: <PeopleOutlinedIcon />, label: 'My Clients' },
        { to: '/psychologist/appointments', icon: <CalendarMonthOutlinedIcon />, label: 'Appointments' },
        { to: '/psychologist/calendar', icon: <EventNoteOutlinedIcon />, label: 'Calendar' },
        { to: '/session-notes', icon: <DescriptionOutlinedIcon />, label: 'Session Notes' },
        { to: '/treatment-plans', icon: <AssignmentOutlinedIcon />, label: 'Treatment Plans' },
        { to: '/outcome-measures', icon: <AssessmentOutlinedIcon />, label: 'Outcome Measures' },
        { to: '/crisis-assessments', icon: <WarningAmberOutlinedIcon />, label: 'Crisis Assessments' },
        { to: '/safety-plans', icon: <HealingOutlinedIcon />, label: 'Safety Plans' },
        { to: '/billing', icon: <ReceiptOutlinedIcon />, label: 'Billing' },
        messaging,
        { to: '/reports', icon: <BarChartOutlinedIcon />, label: 'Reports' },
        profile,
        logout,
      ];

    // ── PSYCHIATRIST: Like Psychologist + prescribe medications,
    //    outcome measures (view only) ──
    case ROLES.PSYCHIATRIST:
      return [
        dashboard,
        { to: '/clients', icon: <PeopleOutlinedIcon />, label: 'My Clients' },
        { to: '/psychiatrist/appointments', icon: <CalendarMonthOutlinedIcon />, label: 'Appointments' },
        { to: '/psychiatrist/calendar', icon: <EventNoteOutlinedIcon />, label: 'Calendar' },
        { to: '/session-notes', icon: <DescriptionOutlinedIcon />, label: 'Session Notes' },
        { to: '/treatment-plans', icon: <AssignmentOutlinedIcon />, label: 'Treatment Plans' },
        { to: '/outcome-measures', icon: <AssessmentOutlinedIcon />, label: 'Outcome Measures' },
        { to: '/crisis-assessments', icon: <WarningAmberOutlinedIcon />, label: 'Crisis Assessments' },
        { to: '/safety-plans', icon: <HealingOutlinedIcon />, label: 'Safety Plans' },
        { to: '/billing', icon: <ReceiptOutlinedIcon />, label: 'Billing' },
        messaging,
        { to: '/reports', icon: <BarChartOutlinedIcon />, label: 'Reports' },
        profile,
        logout,
      ];

    // ── ADMIN: Full access to everything ──
    case ROLES.ADMIN:
      return [
        dashboard,
        { to: '/clients', icon: <PeopleOutlinedIcon />, label: 'Clients' },
        { to: '/appointments', icon: <CalendarMonthOutlinedIcon />, label: 'Appointments' },
        { to: '/calendar', icon: <EventNoteOutlinedIcon />, label: 'Calendar' },
        { to: '/session-notes', icon: <DescriptionOutlinedIcon />, label: 'Session Notes' },
        { to: '/treatment-plans', icon: <AssignmentOutlinedIcon />, label: 'Treatment Plans' },
        { to: '/outcome-measures', icon: <AssessmentOutlinedIcon />, label: 'Outcome Measures' },
        { to: '/crisis-assessments', icon: <WarningAmberOutlinedIcon />, label: 'Crisis Assessments' },
        { to: '/safety-plans', icon: <HealingOutlinedIcon />, label: 'Safety Plans' },
        { to: '/billing', icon: <ReceiptOutlinedIcon />, label: 'Billing' },
        messaging,
        { to: '/reports', icon: <BarChartOutlinedIcon />, label: 'Reports' },
        { to: '/analytics', icon: <AssessmentOutlinedIcon />, label: 'Analytics' },
        { to: '/users', icon: <GroupOutlinedIcon />, label: 'Manage Users' },
        { to: '/roles', icon: <SecurityOutlinedIcon />, label: 'Manage Roles' },
        { to: '/audit-logs', icon: <DescriptionOutlinedIcon />, label: 'Audit Logs' },
        { to: '/system-configuration', icon: <SettingsOutlinedIcon />, label: 'System Config' },
        profile,
        logout,
      ];

    default:
      // Fallback: minimal navigation
      return [dashboard, profile, logout];
  }
}

const Sidebar = ({ collapsed }) => {
  const { currentUser, logout: doLogout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const menuItems = getNavItemsForRole(currentUser.role);

  const handleLinkClick = (e, to) => {
    if (to === '/logout') {
      e.preventDefault();
      doLogout();
      navigate('/login');
    }
  };

  // Friendly role label for sidebar footer
  const roleLabel = (currentUser.role || '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <aside className={`mc-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="mc-sidebar-brand" style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-primary)' }}>
        <div className="mc-sidebar-logo" style={{ fontSize: 22 }}>🧠</div>
        {!collapsed && (
          <div>
            <div className="mc-sidebar-title" style={{ fontSize: 14, fontWeight: 800 }}>MindCare</div>
            <div className="mc-sidebar-subtitle" style={{ fontSize: 9 }}>
              {currentUser.role === ROLES.CLIENT ? 'Client Portal' : 'Clinical Dashboard'}
            </div>
          </div>
        )}
      </div>

      <nav className="mc-sidebar-nav" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            onClick={(e) => handleLinkClick(e, item.to)}
            className={({ isActive }) => `mc-sidebar-link ${isActive && item.to !== '/logout' ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              marginBottom: 1
            }}
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
              <span
                className={`mc-badge mc-badge-${item.badgeType || 'default'}`}
                style={{ fontSize: 9, minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mc-sidebar-footer" style={{ padding: '10px 16px', borderTop: '1px solid var(--border-primary)' }}>
        <div className="mc-sidebar-user" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="mc-sidebar-avatar" style={{
            width: 28, height: 28, borderRadius: '50%', background: 'var(--btn-primary-bg)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold'
          }}>
            {currentUser.firstName?.charAt(0) || ''}{currentUser.lastName?.charAt(0) || ''}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="mc-sidebar-user-name" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.firstName} {currentUser.lastName}
              </div>
              <div className="mc-sidebar-user-role" style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
                {roleLabel}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

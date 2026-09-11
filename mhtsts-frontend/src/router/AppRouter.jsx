import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { ROLES } from '../config/constants';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Loading fallback
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
    <span className="mc-spinner mc-spinner-lg"></span>
  </div>
);

// Auth Pages
import LoginPage from '../features/authentication/pages/LoginPage';
import RegisterPage from '../features/authentication/pages/RegisterPage';
import ForgotPasswordPage from '../features/authentication/pages/ForgotPasswordPage';
import OtpVerificationPage from '../features/authentication/pages/OtpVerificationPage';
import OAuth2RedirectHandler from '../features/authentication/pages/OAuth2RedirectHandler';

// Lazy-loaded Dashboards
const AdminDashboard = lazy(() => import('../features/dashboard/pages/AdminDashboard'));
const TherapistDashboard = lazy(() => import('../features/dashboard/pages/TherapistDashboard'));
const ClientDashboard = lazy(() => import('../features/dashboard/pages/ClientDashboard'));
const PsychiatristDashboard = lazy(() => import('../features/dashboard/pages/PsychiatristDashboard'));
const PsychologistDashboard = lazy(() => import('../features/dashboard/pages/PsychologistDashboard'));
const SupervisorDashboard = lazy(() => import('../features/dashboard/pages/SupervisorDashboard'));
const CaseManagerDashboard = lazy(() => import('../features/dashboard/pages/CaseManagerDashboard'));
const ReceptionistDashboard = lazy(() => import('../features/dashboard/pages/ReceptionistDashboard'));


// Clinical & Core Pages
import ClientList from '../features/clients/pages/ClientList';
import ClientDetails from '../features/clients/pages/ClientDetails';
import AddClient from '../features/clients/pages/AddClient';
import SchedulePage from '../features/appointments/pages/SchedulePage';
import TelehealthPage from '../features/appointments/pages/TelehealthPage';
import SessionNotesList from '../features/session-notes/pages/SessionNotesList';
import CreateSessionNote from '../features/session-notes/pages/CreateSessionNote';
import TreatmentPlanList from '../features/treatment-plans/pages/TreatmentPlanList';
import AssessmentsPage from '../features/outcomes/pages/AssessmentsPage';
import BillingDashboard from '../features/billing/pages/BillingDashboard';
import SecureInbox from '../features/messaging/pages/SecureInbox';
import CrisisAssessments from '../features/crisis/pages/CrisisAssessments';
import SafetyPlans from '../features/crisis/pages/SafetyPlans';

// Admin Core Pages
import UserManagement from '../features/admin/pages/UserManagement';
import AuditLogs from '../features/admin/pages/AuditLogs';
import RoleManagement from '../features/admin/pages/RoleManagement';
import SystemSettings from '../features/admin/pages/SystemSettings';
import ProfilePage from '../features/admin/pages/ProfilePage';
import NotificationsPage from '../features/admin/pages/NotificationsPage';
import Analytics from '../features/admin/pages/analytics/Analytics';

// Staff Sub-directories
import TherapistManagement from '../features/admin/pages/staff/TherapistManagement';
import PsychologistManagement from '../features/admin/pages/staff/PsychologistManagement';
import PsychiatristManagement from '../features/admin/pages/staff/PsychiatristManagement';
import SupervisorManagement from '../features/admin/pages/staff/SupervisorManagement';
import CaseManagerManagement from '../features/admin/pages/staff/CaseManagerManagement';
import ReceptionistManagement from '../features/admin/pages/staff/ReceptionistManagement';

// Role-Specific Pages
import WaitingRoomPage from '../features/receptionist/pages/WaitingRoomPage';
import PaymentsPage from '../features/receptionist/pages/PaymentsPage';
import ApprovalsPage from '../features/supervisor/pages/ApprovalsPage';
import SuperviseesPage from '../features/supervisor/pages/SuperviseesPage';
import ReferralsPage from '../features/case-manager/pages/ReferralsPage';
import ClientListPage from '../features/case-manager/pages/ClientListPage';
import CommunityResourcesPage from '../features/case-manager/pages/CommunityResourcesPage';

// New Role-Specific Pages
import AdminReportsPage from '../features/admin/pages/reports/AdminReportsPage';
import AdminAnalyticsPage from '../features/admin/pages/analytics/AdminAnalyticsPage';
import PsychiatristCalendarPage from '../features/psychiatrist/pages/PsychiatristCalendarPage';
import PsychiatristAppointmentsPage from '../features/psychiatrist/pages/PsychiatristAppointmentsPage';
import TherapistCalendarPage from '../features/therapist/pages/TherapistCalendarPage';
import TherapistAppointmentsPage from '../features/therapist/pages/TherapistAppointmentsPage';
import PsychologistCalendarPage from '../features/psychologist/pages/PsychologistCalendarPage';
import PsychologistAppointmentsPage from '../features/psychologist/pages/PsychologistAppointmentsPage';
import ClientCalendarPage from '../features/clients/pages/ClientCalendarPage';
import ClientAppointmentsPage from '../features/clients/pages/ClientAppointmentsPage';
import ReceptionistSchedulePage from '../features/receptionist/pages/ReceptionistSchedulePage';
import ReceptionistAppointmentsPage from '../features/receptionist/pages/ReceptionistAppointmentsPage';
import LandingPage from '../pages/public/LandingPage';
import HelpPage from '../pages/public/HelpPage';
import SettingsPage from '../pages/settings/SettingsPage';

// Placeholder fallback for unmatched public routes
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="mc-empty-state" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ fontSize: '72px', marginBottom: '16px' }}>🔍</div>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/dashboard" className="mc-btn mc-btn-primary">Return to Dashboard</Link>
  </div>
);

const UnauthorizedPage = () => (
  <div className="mc-empty-state" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ fontSize: '72px', marginBottom: '16px' }}>🛡️</div>
    <h2>Access Denied</h2>
    <p>You don't have permission to view this page based on your clinical role.</p>
    <Link to="/dashboard" className="mc-btn mc-btn-primary">Return to Dashboard</Link>
  </div>
);

// ─── Role Groups (SRS Permission Matrix) ────────────────────────────────────
const ALL_ROLES = [ROLES.ADMIN, ROLES.PSYCHIATRIST, ROLES.PSYCHOLOGIST, ROLES.THERAPIST, ROLES.SUPERVISOR, ROLES.CASE_MANAGER, ROLES.RECEPTIONIST, ROLES.CLIENT];
const CLINICIANS = [ROLES.ADMIN, ROLES.THERAPIST, ROLES.PSYCHOLOGIST, ROLES.PSYCHIATRIST, ROLES.SUPERVISOR];
const CLIENT_RECORD_ROLES = [ROLES.ADMIN, ROLES.THERAPIST, ROLES.PSYCHOLOGIST, ROLES.PSYCHIATRIST, ROLES.SUPERVISOR, ROLES.CASE_MANAGER, ROLES.RECEPTIONIST];
const SESSION_NOTE_ROLES = [ROLES.ADMIN, ROLES.THERAPIST, ROLES.PSYCHOLOGIST, ROLES.PSYCHIATRIST, ROLES.SUPERVISOR];
const TREATMENT_PLAN_ROLES = [ROLES.ADMIN, ROLES.THERAPIST, ROLES.PSYCHOLOGIST, ROLES.PSYCHIATRIST, ROLES.SUPERVISOR, ROLES.CASE_MANAGER, ROLES.CLIENT];
const CRISIS_ROLES = [ROLES.ADMIN, ROLES.THERAPIST, ROLES.PSYCHOLOGIST, ROLES.PSYCHIATRIST, ROLES.SUPERVISOR];
const OUTCOME_ROLES = [ROLES.ADMIN, ROLES.THERAPIST, ROLES.PSYCHOLOGIST, ROLES.PSYCHIATRIST, ROLES.SUPERVISOR, ROLES.CLIENT];
const SCHEDULING_ROLES = [ROLES.ADMIN, ROLES.THERAPIST, ROLES.PSYCHOLOGIST, ROLES.PSYCHIATRIST, ROLES.CLIENT, ROLES.RECEPTIONIST];
const BILLING_ROLES = [ROLES.ADMIN, ROLES.THERAPIST, ROLES.PSYCHOLOGIST, ROLES.PSYCHIATRIST, ROLES.CLIENT, ROLES.RECEPTIONIST];
const REPORT_ROLES = [ROLES.ADMIN, ROLES.THERAPIST, ROLES.PSYCHOLOGIST, ROLES.PSYCHIATRIST, ROLES.SUPERVISOR];
const ADMIN_ONLY = [ROLES.ADMIN];

// Dashboard Router logic
const DashboardRouter = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  switch (currentUser.role) {
    case ROLES.ADMIN:
      return <Navigate to="/admin/dashboard" replace />;
    case ROLES.THERAPIST:
      return <Navigate to="/therapist/dashboard" replace />;
    case ROLES.PSYCHIATRIST:
      return <Navigate to="/psychiatrist/dashboard" replace />;
    case ROLES.PSYCHOLOGIST:
      return <Navigate to="/psychologist/dashboard" replace />;
    case ROLES.SUPERVISOR:
      return <Navigate to="/supervisor/dashboard" replace />;
    case ROLES.RECEPTIONIST:
      return <Navigate to="/receptionist/dashboard" replace />;
    case ROLES.CASE_MANAGER:
      return <Navigate to="/case-manager/dashboard" replace />;
    case ROLES.CLIENT:
      return <Navigate to="/client/dashboard" replace />;
    default:
      return <Navigate to="/client/dashboard" replace />;
  }
};

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ── Protected Routes: All authenticated users ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Dashboard — each role gets their own via DashboardRouter */}
            <Route path="/dashboard" element={<DashboardRouter />} />
            {/* Profile & Notifications — all roles */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            {/* Secure Messaging — all roles (SRS #11) */}
            <Route path="/messaging" element={<SecureInbox />} />
            {/* Telehealth video session — accessible to all participating roles */}
            <Route path="/telehealth" element={<TelehealthPage />} />
            <Route path="/telehealth/:id" element={<TelehealthPage />} />
          </Route>
        </Route>

        {/* ── Client Records — SRS #2 ── */}
        <Route element={<ProtectedRoute allowedRoles={CLIENT_RECORD_ROLES} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/new" element={<AddClient />} />
            <Route path="/register-client" element={<AddClient />} />
            <Route path="/receptionist/register" element={<AddClient />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            <Route path="/clients/:id/edit" element={<AddClient />} />
          </Route>
        </Route>

        {/* ── Scheduling — SRS #9 ── */}
        <Route element={<ProtectedRoute allowedRoles={SCHEDULING_ROLES} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/appointments" element={<SchedulePage />} />
            <Route path="/calendar" element={<SchedulePage />} />
          </Route>
        </Route>

        {/* ── Session Notes — SRS #3 ── */}
        <Route element={<ProtectedRoute allowedRoles={SESSION_NOTE_ROLES} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/session-notes" element={<SessionNotesList />} />
            <Route path="/session_notes" element={<SessionNotesList />} />
            <Route path="/session-notes/new" element={<CreateSessionNote />} />
            <Route path="/session_notes/new" element={<CreateSessionNote />} />
          </Route>
        </Route>

        {/* ── Treatment Plans — SRS #6 ── */}
        <Route element={<ProtectedRoute allowedRoles={TREATMENT_PLAN_ROLES} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/treatment-plans" element={<TreatmentPlanList />} />
            <Route path="/treatment_plans" element={<TreatmentPlanList />} />
          </Route>
        </Route>

        {/* ── Crisis Assessments — SRS #5 ── */}
        <Route element={<ProtectedRoute allowedRoles={CRISIS_ROLES} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/crisis-assessments" element={<CrisisAssessments />} />
            <Route path="/crisis_assessments" element={<CrisisAssessments />} />
          </Route>
        </Route>

        {/* ── Safety Plans — SRS #5 (Clients allowed) ── */}
        <Route element={<ProtectedRoute allowedRoles={[...CRISIS_ROLES, ROLES.CLIENT]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/safety-plans" element={<SafetyPlans />} />
            <Route path="/safety_plans" element={<SafetyPlans />} />
          </Route>
        </Route>

        {/* ── Outcome Measures — SRS #7 ── */}
        <Route element={<ProtectedRoute allowedRoles={OUTCOME_ROLES} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/outcome-measures" element={<AssessmentsPage />} />
            <Route path="/outcome_measures" element={<AssessmentsPage />} />
          </Route>
        </Route>

        {/* ── Billing — SRS #10 ── */}
        <Route element={<ProtectedRoute allowedRoles={BILLING_ROLES} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/billing" element={<BillingDashboard />} />
          </Route>
        </Route>

        {/* ── Reports & Analytics — SRS #15 implied ── */}
        <Route element={<ProtectedRoute allowedRoles={REPORT_ROLES} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/reports" element={<AdminReportsPage />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* ── Admin-Only: Users, Roles, Audit Logs, System Config — SRS #13,14,15 ── */}
        <Route element={<ProtectedRoute allowedRoles={ADMIN_ONLY} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/users" element={<UserManagement />} />
            <Route path="/roles" element={<RoleManagement />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/system-configuration" element={<SystemSettings />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            {/* Staff Management Sub-directories */}
            <Route path="/therapists" element={<TherapistManagement />} />
            <Route path="/psychologists" element={<PsychologistManagement />} />
            <Route path="/psychiatrists" element={<PsychiatristManagement />} />
            <Route path="/supervisors" element={<SupervisorManagement />} />
            <Route path="/case-managers" element={<CaseManagerManagement />} />
            <Route path="/receptionists" element={<ReceptionistManagement />} />
          </Route>
        </Route>

        {/* ── Supervisor-Specific — SRS #12 ── */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.SUPERVISOR, ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/supervisees" element={<SuperviseesPage />} />
          </Route>
        </Route>

        {/* ── Receptionist-Specific ── */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST, ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/waiting-room" element={<WaitingRoomPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/receptionist/schedule" element={<ReceptionistSchedulePage />} />
            <Route path="/receptionist/appointments" element={<ReceptionistAppointmentsPage />} />
          </Route>
        </Route>

        {/* ── Case Manager-Specific ── */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.CASE_MANAGER, ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/client-list" element={<ClientListPage />} />
            <Route path="/referrals" element={<ReferralsPage />} />
            <Route path="/resources" element={<CommunityResourcesPage />} />
          </Route>
        </Route>

        {/* ── Role-Specific Calendar/Appointments Pages ── */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.THERAPIST, ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/therapist/calendar" element={<TherapistCalendarPage />} />
            <Route path="/therapist/appointments" element={<TherapistAppointmentsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.PSYCHIATRIST, ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/psychiatrist/calendar" element={<PsychiatristCalendarPage />} />
            <Route path="/psychiatrist/appointments" element={<PsychiatristAppointmentsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.PSYCHOLOGIST, ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/psychologist/calendar" element={<PsychologistCalendarPage />} />
            <Route path="/psychologist/appointments" element={<PsychologistAppointmentsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.CLIENT]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/client/calendar" element={<ClientCalendarPage />} />
            <Route path="/client/appointments" element={<ClientAppointmentsPage />} />
          </Route>
        </Route>

        {/* ── Explicit Role-Based Dashboards ── */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.THERAPIST]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.PSYCHIATRIST]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/psychiatrist/dashboard" element={<PsychiatristDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.PSYCHOLOGIST]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/psychologist/dashboard" element={<PsychologistDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.SUPERVISOR]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.CASE_MANAGER]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/case-manager/dashboard" element={<CaseManagerDashboard />} />
            <Route path="/case_manager/dashboard" element={<CaseManagerDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.CLIENT]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/appointments" element={<ClientAppointmentsPage />} />
            <Route path="/client/calendar" element={<ClientCalendarPage />} />
          </Route>
        </Route>

        {/* ── Help & Support — all roles ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/help" element={<HelpPage />} />
            <Route path="/help-support" element={<HelpPage />} />
            <Route path="/support" element={<HelpPage />} />
            <Route path="/faq" element={<HelpPage />} />
            <Route path="/contact-support" element={<HelpPage />} />
          </Route>
        </Route>

        {/* ── Settings — all roles ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/password" element={<SettingsPage />} />
            <Route path="/settings/security" element={<SettingsPage />} />
            <Route path="/settings/account" element={<SettingsPage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route path="/account-settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

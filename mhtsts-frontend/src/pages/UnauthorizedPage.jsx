import React from 'react';
import { Link } from 'react-router-dom';
import LockOutlined from '@mui/icons-material/LockOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';

/* ─────────────────────────────────────────────
   Unauthorized Page
   Shown when a user tries to access a route
   their role does not permit.
   ───────────────────────────────────────────── */

const UnauthorizedPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 'var(--space-8)',
        background: 'var(--bg-primary)',
        textAlign: 'center',
      }}
    >
      {/* Icon container */}
      <div
        className="animate-scale-in"
        style={{
          width: 140,
          height: 140,
          borderRadius: 'var(--radius-2xl)',
          background: 'linear-gradient(135deg, var(--color-danger-light), var(--color-warning-light))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-8)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <LockOutlined
          style={{ fontSize: 72, color: 'var(--color-danger)' }}
        />
      </div>

      {/* Error code */}
      <h1
        className="animate-fade-in-up"
        style={{
          fontSize: '5rem',
          fontWeight: 'var(--font-weight-extrabold)',
          background: 'linear-gradient(135deg, var(--color-danger), var(--color-warning))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          marginBottom: 'var(--space-4)',
        }}
      >
        403
      </h1>

      {/* Title */}
      <h2
        className="animate-fade-in-up"
        style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-3)',
        }}
      >
        Access Denied
      </h2>

      {/* Description */}
      <p
        className="animate-fade-in-up"
        style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--text-secondary)',
          maxWidth: 520,
          lineHeight: 'var(--line-height-relaxed)',
          marginBottom: 'var(--space-4)',
        }}
      >
        You don't have permission to view this page. This area is restricted
        based on your assigned role. If you believe this is an error, please
        contact your system administrator.
      </p>

      {/* Info box */}
      <div
        className="animate-fade-in-up"
        style={{
          background: 'var(--color-warning-light)',
          border: '1px solid var(--color-warning-bg)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4) var(--space-6)',
          maxWidth: 520,
          marginBottom: 'var(--space-8)',
          fontSize: 'var(--font-size-base)',
          color: 'var(--color-warning)',
          fontWeight: 'var(--font-weight-medium)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <span style={{ fontSize: 20 }}>⚠️</span>
        Role-based access control (RBAC) restricts certain areas to authorized
        personnel only.
      </div>

      {/* Actions */}
      <div
        className="animate-fade-in-up"
        style={{
          display: 'flex',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link to="/dashboard" className="mc-btn mc-btn-primary mc-btn-lg">
          <HomeOutlined style={{ fontSize: 20 }} />
          Back to Dashboard
        </Link>
        <button
          className="mc-btn mc-btn-outline mc-btn-lg"
          onClick={() => window.history.back()}
        >
          <ArrowBackOutlined style={{ fontSize: 20 }} />
          Go Back
        </button>
      </div>

      {/* Brand footer */}
      <div
        style={{
          marginTop: 'var(--space-16)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          M
        </div>
        MindCare — Mental Health Therapy &amp; Session Tracking
      </div>
    </div>
  );
};

export default UnauthorizedPage;

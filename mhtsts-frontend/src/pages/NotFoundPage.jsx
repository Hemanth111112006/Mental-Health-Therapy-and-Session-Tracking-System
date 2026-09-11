import React from 'react';
import { Link } from 'react-router-dom';
import SentimentVeryDissatisfiedOutlined from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';

/* ─────────────────────────────────────────────
   404 – Not Found Page
   Premium branded error page with navigation helpers
   ───────────────────────────────────────────── */

const NotFoundPage = () => {
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
      {/* Animated illustration area */}
      <div
        className="animate-scale-in"
        style={{
          width: 140,
          height: 140,
          borderRadius: 'var(--radius-2xl)',
          background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-secondary-50))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-8)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <SentimentVeryDissatisfiedOutlined
          style={{ fontSize: 72, color: 'var(--color-primary)' }}
        />
      </div>

      {/* Error code */}
      <h1
        className="animate-fade-in-up"
        style={{
          fontSize: '5rem',
          fontWeight: 'var(--font-weight-extrabold)',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          marginBottom: 'var(--space-4)',
        }}
      >
        404
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
        Page Not Found
      </h2>

      {/* Description */}
      <p
        className="animate-fade-in-up"
        style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--text-secondary)',
          maxWidth: 480,
          lineHeight: 'var(--line-height-relaxed)',
          marginBottom: 'var(--space-8)',
        }}
      >
        The page you're looking for doesn't exist or may have been moved.
        Let's get you back on track.
      </p>

      {/* Action buttons */}
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

export default NotFoundPage;

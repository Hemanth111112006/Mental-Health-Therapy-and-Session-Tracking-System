import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';

const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (token) {
      try {
        const user = loginWithToken(token);
        if (user && user.role === 'CLIENT') {
          navigate('/client/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('OAuth2 redirect processing error:', err);
        setErrorMessage('Failed to authenticate session from OAuth token.');
        setTimeout(() => {
          navigate('/login?error=AuthenticationFailed', { replace: true });
        }, 2000);
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#f8fafc',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          padding: '40px 48px',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          maxWidth: 420,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: '3px solid rgba(255, 255, 255, 0.2)',
            borderTopColor: '#38bdf8',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0', color: '#f1f5f9' }}>
          {errorMessage ? 'Authentication Notice' : 'Authenticating...'}
        </h2>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
          {errorMessage || 'Connecting your account to MindCare Health System. Please wait...'}
        </p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;

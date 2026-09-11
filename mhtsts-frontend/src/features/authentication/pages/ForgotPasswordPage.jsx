import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../../providers/NotificationProvider';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import AuthLayout from '../../../layouts/AuthLayout';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email'); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setIsLoading(false);
    addToast('success', 'OTP Sent', 'A verification code has been sent to your email.');
  };

  return (
    <AuthLayout>
      <div className="mc-luxury-card" style={{ maxWidth: 460, margin: '0 auto' }}>
        {!submitted ? (
          <>
            <div className="mc-auth-form-header" style={{ marginBottom: 16 }}>
              <h2 style={{ fontWeight: 800, color: '#101828', fontSize: 18, letterSpacing: '-0.5px' }}>Forgot Password?</h2>
              <p style={{ color: '#475467', fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>
                Enter your email address and we'll send you a verification code to reset your password.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#344054", marginBottom: 4 }}>
                  Email Address <span style={{ color: "red" }}>*</span>
                </label>
                <div className="mc-luxury-input-wrapper">
                  <EmailOutlinedIcon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#98A2B3', fontSize: 16 }} />
                  <input 
                    className={`mc-luxury-input ${error ? 'error' : ''}`} 
                    type="email" 
                    placeholder="name@practice.com" 
                    value={email} 
                    onChange={e => { setEmail(e.target.value); setError(''); }} 
                  />
                </div>
                {error && <div style={{ fontSize: 10, color: "var(--color-danger)", marginTop: 2 }}>{error}</div>}
              </div>
              
              <button 
                type="submit" 
                className="mc-luxury-btn-submit" 
                disabled={isLoading} 
                style={{ marginTop: 8 }}
              >
                {isLoading ? (
                  <>
                    <span className="mc-spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: 'white', borderTopColor: 'transparent' }}></span> 
                    Sending...
                  </>
                ) : 'Send Verification Code'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <MarkEmailReadOutlinedIcon style={{ fontSize: 32, color: '#10B981' }} />
            </div>
            <h2 style={{ fontWeight: 800, color: '#101828', fontSize: 18, marginBottom: 8 }}>Check Your Email</h2>
            <p style={{ color: '#475467', fontSize: 12, marginBottom: 24, lineHeight: 1.5 }}>
              We've sent a 6-digit verification code to <strong style={{ color: '#101828' }}>{email}</strong>. Please check your inbox and enter the code to reset your password.
            </p>
            
            <Link 
              to="/otp-verification" 
              state={{ email }} 
              className="mc-luxury-btn-submit" 
              style={{ display: 'flex', textDecoration: 'none', marginBottom: 16 }}
            >
              Enter Verification Code
            </Link>
            
            <button 
              onClick={() => { setSubmitted(false); setEmail(''); }} 
              style={{ background: 'none', border: 'none', color: '#4338CA', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              Didn't receive it? Try again
            </button>
          </div>
        )}
        
        <div className="mc-auth-form-footer" style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#475467', textDecoration: 'none' }}>
            <ArrowBackOutlinedIcon style={{ fontSize: 14 }} /> Back to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;

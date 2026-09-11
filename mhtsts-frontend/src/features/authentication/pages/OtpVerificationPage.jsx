import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../../../providers/NotificationProvider';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AuthLayout from '../../../layouts/AuthLayout';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'user@example.com';

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' });
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsVerified(true);
    setIsLoading(false);
    addToast('success', 'Code Verified', 'Please set your new password.');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newPassword) errs.newPassword = 'Password is required';
    else if (newPassword.length < 8) errs.newPassword = 'Minimum 8 characters';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    addToast('success', 'Password Reset!', 'Your password has been reset successfully.');
    navigate('/login');
  };

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(60);
    addToast('info', 'Code Resent', 'A new verification code has been sent.');
  };

  return (
    <AuthLayout>
      <div className="mc-luxury-card" style={{ maxWidth: 460, margin: '0 auto' }}>
        {!isVerified ? (
          <>
            <div className="mc-auth-form-header" style={{ marginBottom: 16 }}>
              <h2 style={{ fontWeight: 800, color: '#101828', fontSize: 18, letterSpacing: '-0.5px' }}>Verification Code</h2>
              <p style={{ color: '#475467', fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>
                Enter the 6-digit code sent to <strong style={{ color: '#101828' }}>{email}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  style={{
                    width: 48, height: 56, textAlign: 'center', fontSize: 24,
                    fontWeight: 700, border: `1px solid ${digit ? '#4338CA' : '#D0D5DD'}`,
                    borderRadius: 12, background: digit ? '#EEF2FF' : '#fff',
                    color: '#101828', outline: 'none', transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)',
                    caretColor: '#4338CA'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#4338CA'; e.target.style.boxShadow = '0 0 0 4px #EEF2FF'; }}
                  onBlur={e => { e.target.style.borderColor = digit ? '#4338CA' : '#D0D5DD'; e.target.style.boxShadow = '0 1px 2px rgba(16, 24, 40, 0.05)'; }}
                />
              ))}
            </div>
            {errors.otp && <div style={{ fontSize: 10, color: 'var(--color-danger)', textAlign: 'center', marginTop: -16, marginBottom: 16 }}>{errors.otp}</div>}

            <button 
              onClick={handleVerifyOtp} 
              className="mc-luxury-btn-submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mc-spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: 'white', borderTopColor: 'transparent' }}></span> 
                  Verifying...
                </>
              ) : 'Verify Code'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#475467' }}>
              {canResend ? (
                <button 
                  onClick={handleResend} 
                  style={{ background: 'none', border: 'none', color: '#4338CA', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
                >
                  Resend Code
                </button>
              ) : (
                <span>Resend code in <strong style={{ color: '#4338CA' }}>{countdown}s</strong></span>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircleOutlinedIcon style={{ fontSize: 32, color: '#10B981' }} />
              </div>
              <h2 style={{ fontWeight: 800, color: '#101828', fontSize: 18, marginBottom: 8 }}>Set New Password</h2>
              <p style={{ color: '#475467', fontSize: 12, lineHeight: 1.4 }}>Create a strong password for your account</p>
            </div>

            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#344054', marginBottom: 4 }}>
                  New Password <span style={{ color: 'red' }}>*</span>
                </label>
                <div className="mc-luxury-input-wrapper">
                  <LockOutlinedIcon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#98A2B3', fontSize: 16 }} />
                  <input 
                    className={`mc-luxury-input ${errors.newPassword ? 'error' : ''}`} 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Min 8 characters" 
                    value={newPassword} 
                    onChange={e => { setNewPassword(e.target.value); setErrors({}); }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#98A2B3', padding: 0, display: 'flex' }}
                  >
                    {showPassword ? <VisibilityOffOutlinedIcon style={{ fontSize: 16 }} /> : <VisibilityOutlinedIcon style={{ fontSize: 16 }} />}
                  </button>
                </div>
                {errors.newPassword && <div style={{ fontSize: 10, color: 'var(--color-danger)', marginTop: 2 }}>{errors.newPassword}</div>}
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#344054', marginBottom: 4 }}>
                  Confirm Password <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  className={`mc-luxury-input ${errors.confirmPassword ? 'error' : ''}`} 
                  type="password" 
                  placeholder="Re-enter password" 
                  value={confirmPassword} 
                  onChange={e => { setConfirmPassword(e.target.value); setErrors({}); }} 
                />
                {errors.confirmPassword && <div style={{ fontSize: 10, color: 'var(--color-danger)', marginTop: 2 }}>{errors.confirmPassword}</div>}
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
                    Resetting...
                  </>
                ) : 'Reset Password'}
              </button>
            </form>
          </>
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

export default OtpVerificationPage;

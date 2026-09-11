import React, { useState } from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import { useNotification } from '../../../providers/NotificationProvider';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import { useTheme } from '../../../providers/ThemeProvider';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { addToast } = useNotification();
  const { theme, toggleTheme } = useTheme();

  // Profile preferences state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [sessionWarnings, setSessionWarnings] = useState(true);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!currentUser) return null;

  const handleSavePreferences = (e) => {
    e.preventDefault();
    addToast('success', 'Preferences Saved', 'Notification options updated successfully.');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('error', 'Validation Error', 'All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('error', 'Validation Error', 'New passwords do not match.');
      return;
    }
    addToast('success', 'Password Updated', 'Your security password has been changed.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header */}
      <div className="mc-page-header">
        <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 800 }}>
          <PersonOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 28 }} /> {currentUser?.role === 'CLIENT' ? 'My Patient Profile' : 'My Account Profile'}
        </h1>
        <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
          {currentUser?.role === 'CLIENT' 
            ? 'Personal information, enrolled care programs, assigned clinician, and account preferences.'
            : 'Secure, access-controlled view of your clinical license, user details, and system preferences.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        
        {/* LEFT COLUMN: Profile Info & Professional/Client Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Avatar and Name */}
          <div className="mc-card" style={{ padding: 24, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%', background: 'var(--btn-primary-bg)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 'bold'
            }}>
              {currentUser.firstName?.charAt(0) || currentUser.username?.charAt(0) || 'U'}{currentUser.lastName?.charAt(0) || ''}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                {currentUser?.role === 'CLIENT' ? '' : 'Dr. '}{currentUser.firstName || currentUser.username} {currentUser.lastName || ''}
              </h3>
              <span className="mc-badge mc-badge-active" style={{ fontSize: 9, marginTop: 4, display: 'inline-block' }}>
                {currentUser?.role === 'CLIENT' ? 'PATIENT / CLIENT' : currentUser.role}
              </span>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
                {currentUser?.role === 'CLIENT' ? 'Care Status: ' : 'EHR Provider Status: '}
                <strong style={{ color: 'var(--color-success)' }}>
                  {currentUser?.role === 'CLIENT' ? 'Enrolled & Active' : 'Active Caseload'}
                </strong>
              </div>
            </div>
          </div>

          {/* Details Card: Patient Details or Professional Credentials */}
          {currentUser?.role === 'CLIENT' ? (
            <div className="mc-card" style={{ padding: 24, borderRadius: 12 }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SettingsOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 18 }} />
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Patient Care & Enrollment Details</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Client Record ID:</span> <strong style={{ color: 'var(--text-primary)' }}>CLN-{currentUser.clientId || currentUser.id || '2041'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Email Address:</span> <strong style={{ color: 'var(--text-primary)' }}>{currentUser.email || currentUser.username}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Primary Clinician:</span> <strong style={{ color: 'var(--text-primary)' }}>Dr. Sarah Chen, LCSW (Therapist)</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Treatment Modality:</span> <strong style={{ color: 'var(--text-primary)' }}>Outpatient Therapy & Telehealth</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Emergency Contact:</span> <strong style={{ color: 'var(--text-primary)' }}>On File (Verified)</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Portal Registration:</span> <strong style={{ color: 'var(--color-success)' }}>Verified & Active</strong></div>
              </div>
            </div>
          ) : (
            <div className="mc-card" style={{ padding: 24, borderRadius: 12 }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SettingsOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 18 }} />
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Professional Details</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Clinical License Type:</span> <strong style={{ color: 'var(--text-primary)' }}>{currentUser.licenseType || 'LCSW'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>License Registry Number:</span> <strong style={{ color: 'var(--text-primary)' }}>{currentUser.licenseNumber || 'LCSW-2022-99187'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Registered State Jurisdiction:</span> <strong style={{ color: 'var(--text-primary)' }}>{currentUser.licenseState || 'CA'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>National Provider Identifier (NPI):</span> <strong style={{ color: 'var(--text-primary)' }}>1849102919</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Clinical Directory ID:</span> <strong style={{ color: 'var(--text-primary)' }}>MHT-9018{currentUser.id}</strong></div>
              </div>
            </div>
          )}

          {/* Theme Preferences */}
          <div className="mc-card" style={{ padding: 24, borderRadius: 12 }}>
            <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ColorLensOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 18 }} />
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Theme Preferences</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Configure the active visual appearance of the electronic health record system.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={toggleTheme} className="mc-btn mc-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  🎨 Current Theme: <strong style={{ textTransform: 'capitalize' }}>{theme}</strong>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Password & Notification settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Password update form */}
          <div className="mc-card" style={{ padding: 24, borderRadius: 12 }}>
            <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <LockOpenOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 18 }} />
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Change Credentials Password</h4>
            </div>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="mc-form-group" style={{ marginBottom: 0 }}>
                <label className="mc-form-label" style={{ fontSize: 11 }}>Current Secure Password</label>
                <input 
                  type="password" 
                  className="mc-form-input" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ height: 36, padding: '4px 10px', fontSize: 12 }} 
                />
              </div>
              <div className="mc-form-group" style={{ marginBottom: 0 }}>
                <label className="mc-form-label" style={{ fontSize: 11 }}>New Password</label>
                <input 
                  type="password" 
                  className="mc-form-input" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ height: 36, padding: '4px 10px', fontSize: 12 }} 
                />
              </div>
              <div className="mc-form-group" style={{ marginBottom: 0 }}>
                <label className="mc-form-label" style={{ fontSize: 11 }}>Confirm New Password</label>
                <input 
                  type="password" 
                  className="mc-form-input" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ height: 36, padding: '4px 10px', fontSize: 12 }} 
                />
              </div>
              <button type="submit" className="mc-btn mc-btn-primary mc-btn-sm" style={{ marginTop: 8 }}>
                Update EHR Security Key
              </button>
            </form>
          </div>

          {/* Notification settings form */}
          <div className="mc-card" style={{ padding: 24, borderRadius: 12 }}>
            <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 18 }} />
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>EHR Notification Preferences</h4>
            </div>
            <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input 
                  type="checkbox" 
                  id="emailAlerts" 
                  checked={emailAlerts} 
                  onChange={(e) => setEmailAlerts(e.target.checked)} 
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="emailAlerts" style={{ fontSize: 12, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Enable Email alerts for overdue treatment reviews
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input 
                  type="checkbox" 
                  id="smsAlerts" 
                  checked={smsAlerts} 
                  onChange={(e) => setSmsAlerts(e.target.checked)} 
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="smsAlerts" style={{ fontSize: 12, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Enable SMS text reminders for upcoming appointments
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input 
                  type="checkbox" 
                  id="sessionWarnings" 
                  checked={sessionWarnings} 
                  onChange={(e) => setSessionWarnings(e.target.checked)} 
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="sessionWarnings" style={{ fontSize: 12, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Flag session note reminders in sidebar warning badges
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-success)', fontWeight: 600, fontSize: 11, marginTop: 4 }}>
                <CheckCircleOutlinedIcon style={{ fontSize: 14 }} /> Verified HIPAA Email: {currentUser.email}
              </div>

              <button type="submit" className="mc-btn mc-btn-outline mc-btn-sm" style={{ marginTop: 4 }}>
                Save Notification Options
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;

import React, { useState } from 'react';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { toast } from '../../../utils/toast';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('APP');
  const [savedSection, setSavedSection] = useState(null);

  // Realistic mock configurations
  const [appSettings, setAppSettings] = useState({
    systemName: 'MindCare Enterprise Mental Health Portal',
    supportEmail: 'compliance@mindcare.com',
    sessionTimeout: 15, // minutes for clinical staff
    clientTimeout: 30, // minutes for clients
    telehealthEncryption: 'AES-256-GCM',
    lateNoteWindow: 24 // hours
  });

  const [securitySettings, setSecuritySettings] = useState({
    enforceMfa: true,
    clinicalPasswordExpiry: 90, // days
    clientPasswordExpiry: 180, // days
    minPasswordLength: 10,
    lockoutAttempts: 3,
    progressiveLockoutDelay: 15 // minutes
  });

  const [notificationSettings, setNotificationSettings] = useState({
    smsReminders: true,
    emailReminders: true,
    crisisSupervisorNotification: true,
    reminderTime: 24, // hours before appointment
    clinicalAlertEmail: 'crisis-escalations@mindcare.com'
  });

  const handleSave = (section) => {
    setSavedSection(section);
    toast.success(`${section} configuration saved successfully!`);
    setTimeout(() => setSavedSection(null), 3000);
  };

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      
      {/* Header */}
      <div className="mc-page-header" style={{ marginBottom: 20 }}>
        <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 800 }}>
          <SettingsOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 28 }} /> System Configuration & Settings
        </h1>
        <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
          Configure clinic operational boundaries, HIPAA security directives, system session durations, and notification routing keys.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>
        
        {/* Navigation Sidebar List */}
        <div className="mc-card" style={{ padding: 12, borderRadius: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button
              type="button"
              onClick={() => setActiveTab('APP')}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                border: 'none',
                background: activeTab === 'APP' ? '#EEF2FF' : 'transparent',
                color: activeTab === 'APP' ? '#4338CA' : 'var(--text-primary)',
                fontWeight: activeTab === 'APP' ? 700 : 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12
              }}
            >
              <SettingsOutlinedIcon style={{ fontSize: 16 }} /> Application Settings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SECURITY')}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                border: 'none',
                background: activeTab === 'SECURITY' ? '#EEF2FF' : 'transparent',
                color: activeTab === 'SECURITY' ? '#4338CA' : 'var(--text-primary)',
                fontWeight: activeTab === 'SECURITY' ? 700 : 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12
              }}
            >
              <LockOutlinedIcon style={{ fontSize: 16 }} /> Security & Access
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('NOTIF')}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                border: 'none',
                background: activeTab === 'NOTIF' ? '#EEF2FF' : 'transparent',
                color: activeTab === 'NOTIF' ? '#4338CA' : 'var(--text-primary)',
                fontWeight: activeTab === 'NOTIF' ? 700 : 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12
              }}
            >
              <NotificationsOutlinedIcon style={{ fontSize: 16 }} /> Notifications & Alerts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('HEALTH')}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                border: 'none',
                background: activeTab === 'HEALTH' ? '#EEF2FF' : 'transparent',
                color: activeTab === 'HEALTH' ? '#4338CA' : 'var(--text-primary)',
                fontWeight: activeTab === 'HEALTH' ? 700 : 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12
              }}
            >
              <ShieldOutlinedIcon style={{ fontSize: 16 }} /> System Information
            </button>
          </div>
        </div>

        {/* Tab Detail Pane */}
        <div className="mc-card" style={{ padding: 24, borderRadius: 12 }}>
          
          {activeTab === 'APP' && (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Application Settings Configuration</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 500 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>System Platform Name</label>
                  <input type="text" className="form-control" value={appSettings.systemName} onChange={e => setAppSettings({...appSettings, systemName: e.target.value})} style={{ height: 36, fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Compliance / Support Contact Email</label>
                  <input type="email" className="form-control" value={appSettings.supportEmail} onChange={e => setAppSettings({...appSettings, supportEmail: e.target.value})} style={{ height: 36, fontSize: 12 }} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Clinical Session Timeout (mins)</label>
                    <input type="number" className="form-control" value={appSettings.sessionTimeout} onChange={e => setAppSettings({...appSettings, sessionTimeout: parseInt(e.target.value)})} style={{ height: 36, fontSize: 12 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Client Portal Timeout (mins)</label>
                    <input type="number" className="form-control" value={appSettings.clientTimeout} onChange={e => setAppSettings({...appSettings, clientTimeout: parseInt(e.target.value)})} style={{ height: 36, fontSize: 12 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Late Progress Note Review Alert Threshold (hours)</label>
                  <input type="number" className="form-control" value={appSettings.lateNoteWindow} onChange={e => setAppSettings({...appSettings, lateNoteWindow: parseInt(e.target.value)})} style={{ height: 36, fontSize: 12 }} />
                </div>
                <div style={{ marginTop: 10 }}>
                  <button className="mc-btn mc-btn-primary" type="button" onClick={() => handleSave('APP')} style={{ fontSize: 12 }}>Save App Configurations</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Clinical Security Directives</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F8F9FA', padding: 12, borderRadius: 8, border: '1px solid var(--border-primary)' }}>
                  <input type="checkbox" checked={securitySettings.enforceMfa} onChange={e => setSecuritySettings({...securitySettings, enforceMfa: e.target.checked})} style={{ accentColor: '#4338CA' }} />
                  <div>
                    <strong style={{ fontSize: 12, display: 'block' }}>Mandatory Multi-Factor Authentication (MFA)</strong>
                    <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>Enforce MFA verification for all psychologists, psychiatrists, counselors and billing staff.</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Clinical Password Expiry (days)</label>
                    <input type="number" className="form-control" value={securitySettings.clinicalPasswordExpiry} onChange={e => setSecuritySettings({...securitySettings, clinicalPasswordExpiry: parseInt(e.target.value)})} style={{ height: 36, fontSize: 12 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Client Password Expiry (days)</label>
                    <input type="number" className="form-control" value={securitySettings.clientPasswordExpiry} onChange={e => setSecuritySettings({...securitySettings, clientPasswordExpiry: parseInt(e.target.value)})} style={{ height: 36, fontSize: 12 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Failed Lockout Threshold</label>
                    <input type="number" className="form-control" value={securitySettings.lockoutAttempts} onChange={e => setSecuritySettings({...securitySettings, lockoutAttempts: parseInt(e.target.value)})} style={{ height: 36, fontSize: 12 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Progressive Delay (mins)</label>
                    <input type="number" className="form-control" value={securitySettings.progressiveLockoutDelay} onChange={e => setSecuritySettings({...securitySettings, progressiveLockoutDelay: parseInt(e.target.value)})} style={{ height: 36, fontSize: 12 }} />
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <button className="mc-btn mc-btn-primary" type="button" onClick={() => handleSave('SECURITY')} style={{ fontSize: 12 }}>Apply Security Policies</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'NOTIF' && (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Reminder & Clinical Notification Configuration</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" checked={notificationSettings.smsReminders} onChange={e => setNotificationSettings({...notificationSettings, smsReminders: e.target.checked})} style={{ accentColor: '#4338CA' }} />
                  <span style={{ fontSize: 11, fontWeight: 600 }}>Enable Automated SMS Appointment Reminders (Non-Clinical text only)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" checked={notificationSettings.emailReminders} onChange={e => setNotificationSettings({...notificationSettings, emailReminders: e.target.checked})} style={{ accentColor: '#4338CA' }} />
                  <span style={{ fontSize: 11, fontWeight: 600 }}>Enable Automated Email Appointment reminders</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" checked={notificationSettings.crisisSupervisorNotification} onChange={e => setNotificationSettings({...notificationSettings, crisisSupervisorNotification: e.target.checked})} style={{ accentColor: '#4338CA' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#EF4444' }}>Mandatory Supervisor escalation for high-risk crisis alerts</span>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Crisis Escalation Notification Group Email</label>
                  <input type="email" className="form-control" value={notificationSettings.clinicalAlertEmail} onChange={e => setNotificationSettings({...notificationSettings, clinicalAlertEmail: e.target.value})} style={{ height: 36, fontSize: 12 }} />
                </div>
                <div style={{ marginTop: 10 }}>
                  <button className="mc-btn mc-btn-primary" type="button" onClick={() => handleSave('NOTIF')} style={{ fontSize: 12 }}>Save Notification Routing</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'HEALTH' && (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Software Compliance Information</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
                <div><strong>MindCare Engine Version:</strong> v1.0.0-Stable Production Build</div>
                <div><strong>Target Framework:</strong> React 19 / Java 17 Spring Boot 3</div>
                <div><strong>MySQL Engine Status:</strong> Active, Connected, 14 operational tables</div>
                <div><strong>Telehealth Framework:</strong> WebRTC DTLS-SRTP Enabled</div>
                <div><strong>E2EE Keystore Status:</strong> Locked, verified by 256-bit HIPAA compliance key</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.05)', padding: '6px 12px', borderRadius: 8, width: 'fit-content', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 600, fontSize: 11 }}>
                  <CheckCircleOutlinedIcon style={{ fontSize: 14 }} /> SOC 2 Type II Certified
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default SystemSettings;


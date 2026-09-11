import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { Shield, Lock, Mail, Eye, EyeOff, Activity, CheckCircle, HelpCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('dr.smith@mindcare.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('THERAPIST');
  const [activeTab, setActiveTab] = useState('clinician');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        username: email,
        password: password
      };
      const user = await login(credentials);
      
      // Use the returned user's role if available, otherwise fallback
      const role = user?.role || selectedRole;

      switch (role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'PSYCHIATRIST':
          navigate('/psychiatrist');
          break;
        case 'PSYCHOLOGIST':
          navigate('/psychologist');
          break;
        case 'THERAPIST':
        case 'COUNSELOR':
          navigate('/therapist');
          break;
        case 'RECEPTIONIST':
          navigate('/receptionist');
          break;
        case 'CASE_MANAGER':
          navigate('/case-manager');
          break;
        case 'SUPERVISOR':
          navigate('/supervisor');
          break;
        case 'CLIENT':
          navigate('/client');
          break;
        default:
          navigate('/therapist');
      }
    } catch (err) {
      // Error is handled in AuthContext and will be available via the error variable
      console.error('Login failed', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #1e1b4b 0%, #311b92 60%, #4c1d95 100%)', color: '#ffffff', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header Bar */}
      <header style={{ padding: '1.25rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ec4899' }}></div>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '0.02em', color: '#ffffff' }}>MindCare Enterprise</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            <span>Status: <strong style={{ color: '#ffffff' }}>Operational</strong></span>
          </div>
          <span style={{ cursor: 'pointer' }}>Help Center</span>
        </div>
      </header>

      {/* Main Login Screen Content */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '3rem', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '4rem', alignItems: 'center' }}>
        
        {/* Left Informational & Branding Side */}
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.25, marginBottom: '1rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Mental Health Therapy and Session Tracking System
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '580px' }}>
            Secure Â· Confidential Â· Professional Mental Healthcare Platform. Empowering practitioners to schedule, document, plan treatment, and monitor outcomes.
          </p>

          {/* ECG Pulse Graphic Simulation */}
          <div style={{ margin: '2rem 0 3rem 0', height: '80px', display: 'flex', alignItems: 'center' }}>
            <svg width="100%" height="60" viewBox="0 0 500 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 30 H180 L190 10 L200 50 L210 5 L220 55 L230 30 H500" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Testimonial Quote Card */}
          <div style={{ background: 'rgba(255, 255, 255, 0.07)', backdropFilter: 'blur(12px)', padding: '1.5rem 1.75rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)', maxWidth: '520px' }}>
            <p style={{ color: '#f1f5f9', fontSize: '0.92rem', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1rem' }}>
              "MindCare has streamlined our clinical intake, reducing admin overhead by 40% and letting us focus entirely on client care."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff' }}>Dr. Robert Chen, PsyD</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Clinical Director, Hope Pathways</div>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '1.2rem' }}>â€¢â€¢â€¢</div>
            </div>
          </div>
        </div>

        {/* Right Clinician Practice Gateway Form Card */}
        <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', color: '#0f172a' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>Clinician Practice Gateway</h2>
            <span style={{ fontSize: '1.2rem' }}>ðŸŒ¸</span>
          </div>

          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Securely sign in to access your therapy practice and clinical dashboard.
          </p>

          {/* Tabs */}
          <div style={{ background: '#e2e8f0', padding: '0.3rem', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', marginBottom: '1.5rem' }}>
            <button 
              type="button"
              onClick={() => { setActiveTab('clinician'); setSelectedRole('THERAPIST'); }}
              style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: activeTab === 'clinician' ? '#ffffff' : 'transparent', color: activeTab === 'clinician' ? '#0f172a' : '#64748b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', boxShadow: activeTab === 'clinician' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              Clinician Hub
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('client'); setSelectedRole('CLIENT'); }}
              style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: activeTab === 'client' ? '#ffffff' : 'transparent', color: activeTab === 'client' ? '#0f172a' : '#64748b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', boxShadow: activeTab === 'client' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              Client Portal
            </button>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {error && (
              <div style={{ padding: '0.8rem', borderRadius: '8px', background: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@practice.com" 
                  style={{ width: '100%', padding: '0.7rem 0.9rem 0.7rem 2.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#ffffff', outline: 'none' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                  style={{ width: '100%', padding: '0.7rem 2.6rem 0.7rem 2.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', background: '#ffffff', outline: 'none' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>SRS Authorization Role *</label>
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)} 
                style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '2px solid #2563eb', fontSize: '0.9rem', background: '#ffffff', fontWeight: '700', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
              >
                <option value="ADMIN">ðŸ›¡ï¸ Admin Dashboard</option>
                <option value="PSYCHIATRIST">ðŸ©º Psychiatrist Dashboard</option>
                <option value="PSYCHOLOGIST">ðŸ§  Psychologist Dashboard</option>
                <option value="THERAPIST">ðŸ’š Therapist Dashboard</option>
                <option value="RECEPTIONIST">ðŸ“ž Receptionist Dashboard</option>
                <option value="CASE_MANAGER">ðŸ“ Case Manager Dashboard</option>
                <option value="SUPERVISOR">ðŸŽ“ Supervisor Dashboard</option>
                <option value="CLIENT">ðŸ¡ Client Portal</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ borderRadius: '4px' }} />
                <span>Remember me</span>
              </label>
              <a href="#forgot" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>Forgot password?</a>
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '0.85rem', background: '#f59e0b', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.4rem', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}
            >
              Sign In
            </button>
          </form>

          {/* Social Divider */}
          <div style={{ margin: '1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <button type="button" style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Google</button>
            <button type="button" style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Microsoft</button>
            <button type="button" style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Apple</button>
          </div>

          {/* Footer Badges & Links */}
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
            <div>Don't have an account? <a href="#create" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>Create account</a></div>
            <div style={{ margin: '0.5rem 0' }}>
              <a href="#sandbox" style={{ color: '#3b82f6', textDecoration: 'underline', fontSize: '0.75rem' }}>Open Dev Sandbox Accounts</a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.8rem', fontSize: '0.7rem', color: '#94a3b8' }}>
              <span>ðŸ”’ E2EE Secure</span>
              <span>ðŸ›¡ï¸ RBAC Admin</span>
              <span>â±ï¸ HIPAA Notice</span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default Login;


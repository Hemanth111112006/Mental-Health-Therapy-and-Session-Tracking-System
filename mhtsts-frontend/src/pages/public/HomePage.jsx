import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Heart, Activity, CheckCircle2, UserCheck, Calendar, Lock, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Navigation Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 'bold' }}>M</div>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#2563eb' }}>MindCare</span>
        </div>

        <nav style={{ display: 'flex', gap: '1.8rem', fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>
          <a href="#home" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</a>
          <a href="#features" style={{ color: '#475569', textDecoration: 'none' }}>Features</a>
          <a href="#services" style={{ color: '#475569', textDecoration: 'none' }}>Services</a>
          <a href="#about" style={{ color: '#475569', textDecoration: 'none' }}>About</a>
          <a href="#how-it-works" style={{ color: '#475569', textDecoration: 'none' }}>How It Works</a>
          <a href="#testimonials" style={{ color: '#475569', textDecoration: 'none' }}>Testimonials</a>
          <a href="#contact" style={{ color: '#475569', textDecoration: 'none' }}>Contact</a>
          <a href="#faq" style={{ color: '#475569', textDecoration: 'none' }}>FAQ</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/login" style={{ textDecoration: 'none', color: '#334155', fontWeight: '700', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Login</Link>
          <Link to="/register" style={{ textDecoration: 'none', background: '#2563eb', color: '#ffffff', fontWeight: '700', fontSize: '0.9rem', padding: '0.5rem 1.25rem', borderRadius: '8px' }}>Register</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '5rem 3rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '3.2rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Mental Health Therapy <br />
            and Session Tracking <br />
            System
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '540px' }}>
            Confidential, Secure and Clinically Effective Mental Health Practice Management Platform.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{ background: '#2563eb', color: '#ffffff', padding: '0.85rem 1.8rem', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}
            >
              Get Started
            </button>

            <button 
              onClick={() => navigate('/login')}
              style={{ background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', padding: '0.85rem 1.8rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}
            >
              Book Appointment
            </button>

            <button 
              onClick={() => navigate('/client')}
              style={{ background: '#10b981', color: '#ffffff', padding: '0.85rem 1.8rem', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}
            >
              Client Portal
            </button>
          </div>

          <div style={{ marginTop: '0.8rem' }}>
            <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'underline', fontSize: '0.9rem', fontWeight: '600' }}>
              Therapist Login
            </Link>
          </div>
        </div>

        {/* Doctor Graphic Hero Panel */}
        <div style={{ position: 'relative' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '1rem', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '16px', height: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', position: 'relative' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)' }}>
                🩺
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Dr. Robert Chen, PsyD</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '600' }}>Clinical Practice Director · Hope Pathways</p>
              
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ background: '#ffffff', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', border: '1px solid #bfdbfe' }}>✓ HIPAA Encrypted</span>
                <span style={{ background: '#ffffff', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: '#16a34a', border: '1px solid #bbf7d0' }}>✓ 8 SRS Roles</span>
                <span style={{ background: '#ffffff', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: '#d97706', border: '1px solid #fef3c7' }}>✓ SOAP & Safety Plans</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

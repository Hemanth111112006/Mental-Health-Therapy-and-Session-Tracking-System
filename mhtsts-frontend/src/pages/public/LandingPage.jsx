import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, CalendarCheck, Video, FileText, Activity, 
  AlertCircle, Pill, CreditCard, MessageSquare, BarChart, 
  History, Bell, Users, UserPlus, Heart, Brain, Clock,
  CheckCircle, ChevronDown, ChevronUp, MapPin, Phone, Mail,
  BrainCircuit, Stethoscope, ClipboardList, Ear, UserCircle
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="landing-page">
      {/* HEADER */}
      <header className="landing-header">
        <div className="header-container">
          <Link to="/" className="header-logo">
            <div style={{ backgroundColor: 'var(--primary-color)', padding: '6px', borderRadius: '8px', color: 'white', display: 'flex' }}>
              <BrainCircuit size={24} />
            </div>
            MindCare
          </Link>
          <nav className="header-nav">
            <a href="#home" className="nav-link">Home</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#services" className="nav-link">Services</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
            <a href="#contact" className="nav-link">Contact</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </nav>
          <div className="header-actions">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="hero-section">
        <div className="landing-container hero-grid">
          <div className="hero-content">
            <h1>Mental Health Therapy and Session Tracking System</h1>
            <p>Confidential, Secure and Clinically Effective Mental Health Practice Management Platform.</p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-outline">Book Appointment</Link>
              <Link to="/login" className="btn btn-success">Client Portal</Link>
              <Link to="/login" className="btn btn-outline">Therapist Login</Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Professional Healthcare" 
              className="hero-placeholder-image"
            />
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="stats-section">
        <div className="landing-container stats-grid">
          <div className="stat-item">
            <h3>10000+</h3>
            <p>Therapy Sessions</p>
          </div>
          <div className="stat-item">
            <h3>5000+</h3>
            <p>Happy Clients</p>
          </div>
          <div className="stat-item">
            <h3>250+</h3>
            <p>Licensed Professionals</p>
          </div>
          <div className="stat-item">
            <h3>99.9%</h3>
            <p>System Availability & HIPAA Compliant</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features">
        <div className="landing-container">
          <h2 className="section-title">Comprehensive Features</h2>
          <p className="section-subtitle">A full suite of tools designed for mental health professionals to deliver exceptional care.</p>
          
          <div className="cards-grid">
            {[
              { icon: Lock, title: 'Secure Login', desc: 'Encrypted, HIPAA-compliant authentication.' },
              { icon: ShieldCheck, title: 'Role Based Access', desc: 'Strict permissions for all clinical and admin roles.' },
              { icon: CalendarCheck, title: 'Appointment Scheduling', desc: 'Effortless calendar management and bookings.' },
              { icon: Video, title: 'Telehealth Sessions', desc: 'Integrated, secure video conferencing.' },
              { icon: ClipboardList, title: 'Treatment Planning', desc: 'Collaborative goal-setting and plans.' },
              { icon: FileText, title: 'Progress Notes', desc: 'Quick, standardized clinical documentation.' },
              { icon: Activity, title: 'Outcome Tracking', desc: 'Measure client progress with standardized scales.' },
              { icon: AlertCircle, title: 'Crisis Assessment', desc: 'Tools for immediate risk evaluation.' },
              { icon: Pill, title: 'Medication Management', desc: 'Track prescriptions and interactions safely.' },
              { icon: CreditCard, title: 'Billing & Insurance', desc: 'Streamlined invoicing and claims processing.' },
              { icon: MessageSquare, title: 'Secure Messaging', desc: 'Encrypted communication with clients.' },
              { icon: BarChart, title: 'Clinical Reports', desc: 'Generate comprehensive session reports.' },
              { icon: Activity, title: 'Analytics Dashboard', desc: 'Real-time practice performance metrics.' },
              { icon: History, title: 'Audit Logs', desc: 'Complete tracking of system activity.' },
              { icon: Bell, title: 'Notifications', desc: 'Automated reminders and alerts.' },
            ].map((feat, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon"><feat.icon size={24} /></div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="landing-container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">We support a wide range of therapeutic modalities and clinical services.</p>
          
          <div className="cards-grid">
            {[
              'Individual Therapy', 'Couples Therapy', 'Family Therapy', 
              'Group Therapy', 'Psychiatric Consultation', 'Psychological Assessment', 
              'Medication Management', 'Telehealth Therapy', 'Crisis Intervention', 'Case Management'
            ].map((service, idx) => (
              <div key={idx} className="feature-card" style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ color: 'var(--primary-color)', marginBottom: '16px' }}><Heart size={32} style={{ margin: '0 auto' }} /></div>
                <h3 style={{ fontSize: '18px', margin: 0 }}>{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works">
        <div className="landing-container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">A seamless journey from registration to recovery.</p>
          
          <div className="steps-container">
            {[
              { num: '1', title: 'Create Account', desc: 'Sign up securely as a client or provider.' },
              { num: '2', title: 'Book Appointment', desc: 'Find availability and schedule a session easily.' },
              { num: '3', title: 'Meet Therapist', desc: 'Connect via integrated telehealth or in-person.' },
              { num: '4', title: 'Treatment Planning', desc: 'Collaborate on a personalized care plan.' },
              { num: '5', title: 'Track Progress', desc: 'Monitor outcomes and adjust treatment as needed.' }
            ].map((step, idx) => (
              <div key={idx} className="step-item">
                <div className="step-number">{step.num}</div>
                <div className="step-content">
                  <h3>Step {step.num}: {step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="about" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="landing-container why-grid">
          <div>
            <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>Why Choose Us</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '18px' }}>
              Built specifically for mental health professionals, our platform prioritizes clinical effectiveness, absolute security, and a seamless user experience.
            </p>
            <div className="why-list">
              {[
                'HIPAA Compliant', 'Highly Secure', 'Licensed Professionals', 
                'Encrypted Records', 'Telehealth Ready', 'Outcome Based Care', 
                'Modern Dashboard', 'Fast Performance', 'Role Based Access'
              ].map((reason, idx) => (
                <div key={idx} className="why-item">
                  <CheckCircle size={20} className="why-icon" />
                  <span style={{ color: 'var(--text-primary)' }}>{reason}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-image-wrapper">
             <img 
              src="https://images.unsplash.com/photo-1551076805-e18690c5e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Medical Professionals" 
              className="hero-placeholder-image"
            />
          </div>
        </div>
      </section>

      {/* ROLES SECTION */}
      <section>
        <div className="landing-container">
          <h2 className="section-title">Built For Your Entire Practice</h2>
          <p className="section-subtitle">Dedicated interfaces tailored to every specific role in your clinic.</p>
          
          <div className="cards-grid">
            {[
              { title: 'Administrator', icon: ShieldCheck, desc: 'Manage system settings, users, billing, and global analytics.' },
              { title: 'Psychiatrist', icon: Pill, desc: 'Prescribe medication, manage complex cases, and clinical reviews.' },
              { title: 'Psychologist', icon: Brain, desc: 'Conduct thorough cognitive assessments and long-term planning.' },
              { title: 'Therapist', icon: Ear, desc: 'Deliver CBT, EMDR, and maintain detailed progress notes.' },
              { title: 'Case Manager', icon: Users, desc: 'Coordinate care, referrals, and community resources.' },
              { title: 'Receptionist', icon: CalendarCheck, desc: 'Handle intake, scheduling, and waiting room management.' },
              { title: 'Supervisor', icon: Stethoscope, desc: 'Review notes, audit compliance, and mentor junior clinicians.' },
              { title: 'Client', icon: UserCircle, desc: 'Access the secure portal to book, message, and track progress.' }
            ].map((role, idx) => (
              <div key={idx} className="role-card">
                <role.icon size={48} color="var(--primary-color)" style={{ margin: '0 auto' }} />
                <h3>{role.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="landing-container">
          <h2 className="section-title">Client Success Stories</h2>
          <p className="section-subtitle">Hear from the clinics and patients that trust MindCare.</p>
          
          <div className="cards-grid">
            {[
              "MindCare transformed our clinic's workflow. The specialized dashboards for our therapists and psychiatrists mean everyone has exactly the tools they need without the clutter.",
              "As a patient, the client portal is incredibly intuitive. I can book telehealth sessions securely and securely message my therapist when I need to.",
              "The outcome tracking features are top-notch. It allows our clinical supervisors to effectively monitor patient progress across the entire organization."
            ].map((quote, idx) => (
              <div key={idx} className="testimonial-card">
                <p style={{ position: 'relative', zIndex: 1 }}>{quote}</p>
                <div style={{ marginTop: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>- Verified User</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="landing-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about the platform.</p>
          
          <div className="faq-container">
            {[
              { q: 'Is the platform HIPAA compliant?', a: 'Yes, our platform is fully HIPAA compliant with end-to-end encryption for all PHI (Protected Health Information).' },
              { q: 'Can clients book their own appointments?', a: 'Yes, clients can use their secure portal to view provider availability and book appointments directly.' },
              { q: 'Does the system support Telehealth?', a: 'Absolutely. We have integrated, secure, high-definition video conferencing built right into the platform.' },
              { q: 'How are clinical notes managed?', a: 'Therapists, psychologists, and psychiatrists have specialized note templates (e.g., SOAP, DAP) tailored to their specific workflows.' }
            ].map((faq, idx) => (
              <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(idx)}>
                  <span style={{ color: 'var(--text-primary)' }}>{faq.q}</span>
                  {activeFaq === idx ? <ChevronUp size={20} color="var(--text-secondary)" /> : <ChevronDown size={20} color="var(--text-secondary)" />}
                </div>
                <div className="faq-answer">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="landing-container">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">Get in touch with our support team or visit our headquarters.</p>
          
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={24} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Address</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>123 Healthcare Blvd, Suite 400<br/>San Francisco, CA 94105</p>
                </div>
              </div>
              <div className="contact-item">
                <Phone size={24} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Phone</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>1-800-MIND-CARE<br/>Emergency: 911 or 988</p>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={24} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Email</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>support@mindcaresystem.com<br/>sales@mindcaresystem.com</p>
                </div>
              </div>
              <div className="contact-item">
                <Clock size={24} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Working Hours</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Monday - Friday: 8:00 AM - 8:00 PM<br/>24/7 Technical Support Available</p>
                </div>
              </div>
            </div>
            <div className="map-placeholder">
              <div style={{ textAlign: 'center' }}>
                <MapPin size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
                <p>Interactive Google Map Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <div style={{ backgroundColor: 'var(--primary-color)', padding: '4px', borderRadius: '6px', color: 'white', display: 'flex' }}>
                  <BrainCircuit size={20} />
                </div>
                MindCare
              </div>
              <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6 }}>
                A comprehensive platform for managing mental health therapy, appointments, treatment planning, and secure communication.
              </p>
            </div>
            <div>
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-links">
                <li><a href="#services">Individual Therapy</a></li>
                <li><a href="#services">Couples Therapy</a></li>
                <li><a href="#services">Telehealth</a></li>
                <li><a href="#services">Psychiatric Consult</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">HIPAA Notice</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p style={{ margin: 0 }}>© 2026 Mental Health Therapy and Session Tracking System. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

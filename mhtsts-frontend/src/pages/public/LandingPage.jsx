import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, ShieldCheck, Lock, LayoutDashboard, Calendar, Video, FileText, 
  Activity, AlertCircle, Pill, CreditCard, MessageSquare, 
  BarChart3, Users, UserCheck, Heart, Brain, Clock, CheckCircle2, 
  ChevronDown, ChevronUp, ArrowRight, Sparkles, Star, Phone, Mail, 
  Play, Stethoscope, ClipboardList, Zap, TrendingUp, Shield, 
  Check, Laptop, Mic, MicOff, VideoOff, Sliders, Volume2, Wand2
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeRole, setActiveRole] = useState('therapist');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [aiScribeActive, setAiScribeActive] = useState(true);
  const [clientCaseload, setClientCaseload] = useState(28);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const roles = {
    therapist: {
      id: 'therapist',
      title: 'Therapist & Counselor',
      badge: 'Psychotherapy Suite',
      icon: <Stethoscope size={18} />,
      headline: 'Automated SOAP Notes & Evidence-Based Psychotherapy Workspaces',
      description: 'Engineered specifically for clinical counselors and therapists. AI-assisted clinical documentation, treatment planning with SMART goals, automated DSM-5 indexing, and 1-click WebRTC tele-sessions.',
      features: [
        'Interactive SOAP, DAP & BIRP clinical note generators',
        'Custom SMART goals with real-time milestone tracking',
        'Built-in Stanley-Brown safety planning & risk assessment',
        'Concurrent live telehealth with side-by-side charting',
        'Automated DSM-5 / ICD-10 diagnostic indexing'
      ],
      stats: 'Save 4.8 hrs weekly on charting',
      ctaText: 'Launch Therapist Workspace',
      ctaLink: '/login',
      preview: {
        statLabel: 'Active Caseload',
        statVal: '24 Clients · 3 Sessions Remaining Today',
        headerIcon: <FileText size={16} className="text-primary" />,
        headerTitle: "Today's Clinical Agenda",
        items: [
          { time: '09:00 AM', label: 'Emma Johnson (MC-2041)', tag: 'Telehealth', type: 'telehealth' },
          { time: '10:30 AM', label: 'Marcus Williams (MC-1887)', tag: 'In-Person', type: 'inperson' },
          { time: '01:00 PM', label: 'Sofia Garcia (MC-2156)', tag: 'Telehealth', type: 'telehealth' }
        ],
        footerTitle: 'Zero-Knowledge HIPAA Encryption Active',
        footerSub: 'SOAP note automatically synced to client record'
      }
    },
    psychiatrist: {
      id: 'psychiatrist',
      title: 'Psychiatrist (Medical)',
      badge: 'Medical & E-Rx Suite',
      icon: <Pill size={18} />,
      headline: 'Psychiatric Evaluations, Titration Schedules & E-Prescribing',
      description: 'Streamlines psychopharmacology practice with comprehensive psychiatric intake assessments, psychotropic medication management, dosage titration schedules, and drug-drug interaction screening.',
      features: [
        'Structured Psychiatric Evaluation templates',
        'Medication review & titration tracking schedules',
        'High-risk patient alerts with urgent follow-up flags',
        'Prescription renewal history and refill verification',
        'Secure multi-disciplinary coordination with therapists'
      ],
      stats: '100% DEA Schedule II-V compliant audit trails',
      ctaText: 'Launch Psychiatric Suite',
      ctaLink: '/login',
      preview: {
        statLabel: 'Medical Prescribing Caseload',
        statVal: '31 Clients · 5 Medication Reviews Due',
        headerIcon: <Pill size={16} className="text-primary" />,
        headerTitle: 'Psychiatric Consultations & E-Rx',
        items: [
          { time: '09:30 AM', label: 'Robert Foster · Lithium 300mg Titration', tag: 'Review Due', type: 'warning' },
          { time: '11:00 AM', label: 'Angela Torres · Escitalopram 20mg Renewal', tag: 'Active', type: 'inperson' },
          { time: '02:00 PM', label: 'Lisa Park · Crisis Follow-up & Evaluation', tag: 'High Risk', type: 'danger' }
        ],
        footerTitle: 'DEA Schedule II-V Compliant',
        footerSub: 'Tamper-proof digital prescription ledger'
      }
    },
    psychologist: {
      id: 'psychologist',
      title: 'Psychologist (Testing)',
      badge: 'Psychometric Assessment',
      icon: <Brain size={18} />,
      headline: 'Standardized Psychometric Testing, Auto-Scoring & Diagnostic Reports',
      description: 'Designed for clinical psychologists administering diagnostic batteries. Auto-score PHQ-9, GAD-7, MMPI-3, Beck Anxiety, and PCL-5 trauma inventories with visual deviation charts and exportable PDF summaries.',
      features: [
        'Automated scoring & severity classification for PHQ-9 & GAD-7',
        'Full battery administration (MMPI-3, Beck, PCL-5 screening)',
        'Visual psychometric trend lines and longitudinal score charts',
        '1-click exportable psychological diagnostic reports (PDF)',
        'Clinical norm comparisons and psych diagnostic insights'
      ],
      stats: 'Instant auto-scoring for 12+ batteries',
      ctaText: 'Launch Psychology Hub',
      ctaLink: '/login',
      preview: {
        statLabel: 'Psychometric Assessments',
        statVal: '7 Completed This Week · 4 Reports Ready',
        headerIcon: <Brain size={16} className="text-primary" />,
        headerTitle: 'Battery Administration & Reports',
        items: [
          { time: 'PHQ-9', label: 'Rachel Adams · Score 18 (Mod. Severe)', tag: 'Report Ready', type: 'inperson' },
          { time: 'MMPI-3', label: 'Tom Bradley · Full Battery Profile', tag: 'In Scoring', type: 'telehealth' },
          { time: 'Beck AI', label: 'Nina Patel · Score 28/63 (Moderate)', tag: 'Pending Co-Sign', type: 'warning' }
        ],
        footerTitle: 'Automated Normative Comparisons',
        footerSub: 'DSM-5 diagnostic criteria correlation active'
      }
    },
    client: {
      id: 'client',
      title: 'Patient / Client',
      badge: 'Patient Self-Service Portal',
      icon: <UserCheck size={18} />,
      headline: 'Confidential, Calming Self-Service Portal For Your Healing Journey',
      description: 'Clients enjoy a private, frictionless sanctuary to book sessions, enter 1-click video calls with zero downloads, complete assigned outcome measures, message their clinician, and celebrate personal growth.',
      features: [
        '1-Click "Join Therapy" video calls — zero downloads or plugins',
        'Confidential 24/7 appointment self-scheduling & reminders',
        'Direct access to personalized Safety Plans & 988 lifeline',
        'Progress dashboards showing depression & anxiety recovery curves',
        'End-to-end encrypted messaging with your clinical team'
      ],
      stats: '98.6% patient satisfaction & ease-of-use rating',
      ctaText: 'Launch Patient Portal',
      ctaLink: '/login',
      preview: {
        statLabel: 'Next Appointment Scheduled',
        statVal: 'Today at 3:00 PM · Dr. Sarah Chen, LCSW',
        headerIcon: <Video size={16} className="text-primary" />,
        headerTitle: 'Patient Care Hub & Tasks',
        items: [
          { time: 'Telehealth', label: 'Session Room #MC-2041 Ready', tag: 'Join Now (1-Click)', type: 'telehealth' },
          { time: 'Assessment', label: 'Weekly PHQ-9 Questionnaire Due', tag: 'Takes 2 Mins', type: 'warning' },
          { time: 'Safety Plan', label: 'Personalized Grounding Steps & 988', tag: 'Active', type: 'inperson' }
        ],
        footerTitle: '100% Confidential Patient Portal',
        footerSub: 'Only you and your verified clinician have access'
      }
    },
    admin: {
      id: 'admin',
      title: 'Practice Admin & Supervisor',
      badge: 'Practice Governance & RBAC',
      icon: <ShieldCheck size={18} />,
      headline: 'Clinic-Wide Governance, HIPAA Audit Trails & Clinical Supervision',
      description: 'Comprehensive governance for clinic owners and clinical supervisors. Oversee staff credentials, approve and co-sign trainee notes, audit tamper-proof access logs, and track CMS-1500 revenue cycles.',
      features: [
        'Zero-trust Role-Based Access Control (RBAC) across 8 distinct roles',
        'Clinical supervision queue for note approvals and co-signatures',
        'Complete immutable HIPAA access audit trails & timestamping',
        'CMS-1500 insurance billing claims, copay & revenue tracking',
        'Practice-wide analytics, session volume & clinician caseloads'
      ],
      stats: 'Zero unauthorized record disclosures',
      ctaText: 'Launch Admin Console',
      ctaLink: '/login',
      preview: {
        statLabel: 'Clinic Health & Compliance',
        statVal: '99.99% Uptime · 142 Active Users Verified',
        headerIcon: <ShieldCheck size={16} className="text-primary" />,
        headerTitle: 'Governance & Supervision Queue',
        items: [
          { time: 'Notes', label: '3 Trainee SOAP Notes Awaiting Review', tag: 'Co-Sign Due', type: 'warning' },
          { time: 'Billing', label: '18 Claims Approved · 98.4% Clean Rate', tag: 'CMS-1500 OK', type: 'inperson' },
          { time: 'Audit', label: 'HIPAA Access Logs Clean · No Breaches', tag: 'Verified', type: 'telehealth' }
        ],
        footerTitle: 'Zero-Trust Role Separation',
        footerSub: 'Administrative staff cannot read psychotherapy notes'
      }
    }
  };

  const currentRole = roles[activeRole];

  // Dynamic ROI calculation based on caseload slider
  const hoursSavedPerMonth = Math.round(clientCaseload * 0.85);
  const claimAccuracy = (98.2 + (clientCaseload * 0.015)).toFixed(1);
  const revenueBoost = Math.round(clientCaseload * 185);

  return (
    <div className="framer-landing-page light-theme">
      {/* BACKGROUND AMBIENT EFFECTS */}
      <div className="framer-ambient-spotlight light-spotlight"></div>
      <div className="framer-grid-pattern light-grid"></div>

      {/* TOP 24/7 CRISIS BANNER */}
      <div className="framer-crisis-bar">
        <div className="framer-crisis-inner">
          <span className="crisis-pill">24/7 Crisis Hotline</span>
          <span>In immediate emotional distress? Call or text <strong className="text-crisis">988</strong> (Suicide & Crisis Lifeline) or text <strong>HOME to 741741</strong>. Free, confidential, 24/7.</span>
        </div>
      </div>

      {/* GLASS FLOATING HEADER */}
      <header className="framer-header">
        <div className="framer-header-inner">
          <Link to="/" className="framer-brand">
            <div className="framer-logo-box">
              <BrainCircuit size={20} className="logo-svg" />
            </div>
            <div className="framer-brand-name">
              <span>MindCare</span>
              <span className="framer-version-pill">AI 2.0</span>
            </div>
          </Link>

          <nav className="framer-nav">
            <a href="#workspaces" className="framer-nav-link">Clinical Suites</a>
            <a href="#telehealth" className="framer-nav-link">Telehealth</a>
            <a href="#bento" className="framer-nav-link">Capabilities</a>
            <a href="#calculator" className="framer-nav-link">Practice ROI</a>
            <a href="#testimonials" className="framer-nav-link">Outcomes</a>
            <a href="#faq" className="framer-nav-link">FAQ</a>
          </nav>

          <div className="framer-header-actions">
            <Link to="/login" className="framer-btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="framer-btn-primary">
              <Sparkles size={15} />
              <span>Get Started Free</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="framer-hero-section">
        <div className="framer-hero-container">
          {/* Hero Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="framer-hero-badge"
          >
            <span className="badge-shimmer-dot"></span>
            <span>HIPAA & SOC-2 Compliant Next-Gen Mental Health EHR</span>
            <ArrowRight size={13} className="badge-arrow" />
          </motion.div>

          {/* Hero Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="framer-hero-title"
          >
            The Intelligent Mental Health EHR <br />
            <span className="framer-gradient-text">Designed for Real Clinical Outcomes.</span>
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="framer-hero-subtitle"
          >
            A unified, confidential behavioral health operating system. Featuring 1-click WebRTC Telehealth, automated speech-to-SOAP clinical documentation, real-time PHQ-9/GAD-7 recovery tracking, and multi-role clinical governance.
          </motion.p>

          {/* Hero CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="framer-hero-cta-group"
          >
            <Link to="/register" className="framer-hero-btn-primary">
              <span>Start Free Practice Trial</span>
              <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="framer-hero-btn-secondary">
              <Lock size={15} />
              <span>Portal Sign In</span>
            </Link>
            <Link to="/telehealth" className="framer-hero-btn-telehealth">
              <Video size={16} />
              <span>Live Telehealth Demo</span>
            </Link>
          </motion.div>

          {/* Direct Role Chips */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="framer-role-chips-row"
          >
            <span className="role-chips-label">Direct Portals:</span>
            <div className="role-chips-list">
              <Link to="/login" className="framer-chip">Patient Portal</Link>
              <Link to="/login" className="framer-chip">Therapist Workspace</Link>
              <Link to="/login" className="framer-chip">Psychiatric Suite</Link>
              <Link to="/login" className="framer-chip">Psychologist Hub</Link>
              <Link to="/login" className="framer-chip">Admin Console</Link>
            </div>
          </motion.div>

          {/* HERO LIVE PRODUCT MOCKUP */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="framer-mockup-wrapper"
          >
            {/* Top Floating Badge */}
            <motion.div 
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="framer-floating-pill pill-top"
            >
              <TrendingUp size={16} className="text-emerald" />
              <div>
                <strong>PHQ-9 Score: 7 (Mild)</strong>
                <span>62% Clinically Significant Remission</span>
              </div>
            </motion.div>

            {/* Bottom Floating Badge */}
            <motion.div 
              animate={{ y: [4, -4, 4] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
              className="framer-floating-pill pill-bottom"
            >
              <ShieldCheck size={16} className="text-primary" />
              <div>
                <strong>HIPAA Verified Co-Sign Queue</strong>
                <span>All SOAP Notes Encrypted & Logged</span>
              </div>
            </motion.div>

            {/* Main Window Frame */}
            <div className="framer-browser-card">
              {/* Window Titlebar */}
              <div className="browser-titlebar">
                <div className="browser-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="browser-url-pill">
                  <Lock size={12} className="text-emerald" />
                  <span>mindcare-ehr.secure/telehealth/session-MC-2041</span>
                  <span className="live-indicator-dot"></span>
                </div>
                <div className="browser-actions">
                  <span className="session-timer"><Clock size={11} /> 34:18 Live</span>
                </div>
              </div>

              {/* Window Body Split */}
              <div className="browser-content-grid">
                {/* Left Column: Live Telehealth Video Feeds */}
                <div className="browser-video-col">
                  {/* Doctor Video */}
                  <div className="video-tile doctor-tile">
                    <img 
                      src="/images/doctor_telehealth.jpg" 
                      alt="Dr. Sarah Chen, PsyD in Telehealth Session" 
                      className="video-tile-img" 
                    />
                    <div className="video-tile-overlay"></div>
                    <div className="tile-badge">
                      <Stethoscope size={12} />
                      <span>Dr. Sarah Chen, PsyD</span>
                      <span className="tile-live-dot"></span>
                    </div>
                    <div className="tile-speaking-badge">
                      <span className="speaking-pulse"></span>
                      <span>Clinician (Speaking)</span>
                    </div>
                    {/* Audio Waves Animation */}
                    <div className="audio-wave-bars">
                      <span className="bar b1"></span>
                      <span className="bar b2"></span>
                      <span className="bar b3"></span>
                      <span className="bar b4"></span>
                      <span className="bar b5"></span>
                    </div>
                  </div>

                  {/* Client Video */}
                  <div className="video-tile client-tile">
                    <img 
                      src="/images/patient_telehealth.jpg" 
                      alt="Emma Johnson in Telehealth Session" 
                      className="video-tile-img" 
                    />
                    <div className="video-tile-overlay"></div>
                    <div className="tile-badge">Emma Johnson (Client)</div>
                    <div className="tile-quality-badge">1080p HD · 18ms</div>
                  </div>

                  {/* Telehealth Call Controls Bar */}
                  <div className="call-controls-bar">
                    <button 
                      onClick={() => setIsMuted(!isMuted)} 
                      className={`ctrl-btn ${isMuted ? 'muted' : ''}`}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
                    </button>
                    <button 
                      onClick={() => setIsCameraOff(!isCameraOff)} 
                      className={`ctrl-btn ${isCameraOff ? 'off' : ''}`}
                      title={isCameraOff ? 'Camera On' : 'Camera Off'}
                    >
                      {isCameraOff ? <VideoOff size={15} /> : <Video size={15} />}
                    </button>
                    <button className="ctrl-btn" title="Screen Share">
                      <Laptop size={15} />
                    </button>
                    <button 
                      onClick={() => setAiScribeActive(!aiScribeActive)}
                      className={`ctrl-btn ai-btn ${aiScribeActive ? 'active' : ''}`}
                      title="AI Clinical Scribe"
                    >
                      <Sparkles size={14} />
                      <span>AI Scribe</span>
                    </button>
                    <button className="ctrl-btn end-btn" title="End Session">
                      End Call
                    </button>
                  </div>
                </div>

                {/* Right Column: Live AI Scribe & Concurrent SOAP Note */}
                <div className="browser-chart-col">
                  {/* AI Scribe Status Header */}
                  <div className="ai-scribe-header">
                    <div className="scribe-status">
                      <Wand2 size={14} className="text-primary" />
                      <span>AI Clinical Scribe:</span>
                      <strong className="text-primary">{aiScribeActive ? 'Listening & Generating Note' : 'Paused'}</strong>
                    </div>
                    <span className="icd-tag">ICD-10: F33.1</span>
                  </div>

                  {/* Note Tabs */}
                  <div className="soap-tabs-bar">
                    <span className="soap-tab active">SOAP Note</span>
                    <span className="soap-tab">PHQ-9 Trend</span>
                    <span className="soap-tab">Safety Plan</span>
                  </div>

                  {/* SOAP Stream */}
                  <div className="soap-content-stream">
                    <div className="soap-entry">
                      <span className="soap-tag s">S</span>
                      <p>Client reports morning anxiety has noticeably diminished from 5x/wk to 1x/wk. Practicing 4-7-8 breathing exercises with positive relaxation response.</p>
                    </div>
                    <div className="soap-entry">
                      <span className="soap-tag o">O</span>
                      <p>Affect calm, cooperative, and reflective. PHQ-9 dropped to <strong>7 (Mild)</strong> from baseline 18. GAD-7 score: 6. Speech normal rate and rhythm.</p>
                    </div>
                    <div className="soap-entry">
                      <span className="soap-tag a">A</span>
                      <p>Major Depressive Disorder, Recurrent (F33.1) showing sustained remission trajectory. High adherence to cognitive reframing homework.</p>
                    </div>
                    <div className="soap-entry">
                      <span className="soap-tag p">P</span>
                      <p>Continue bi-weekly CBT sessions. Introduce behavioral activation for social routines. Review relapse prevention plan next session.</p>
                    </div>
                  </div>

                  {/* Note Footer */}
                  <div className="soap-footer">
                    <span className="auto-save-pill">
                      <Check size={12} /> Auto-Saved & Ready for Co-Sign
                    </span>
                    <span className="cpt-code">CPT: 90837 (60 min)</span>
                  </div>
                </div>
              </div>
              </div>
          </motion.div>

          {/* PLACEMENT 1: PREMIUM WIDE TELEHEALTH CONSULTATION IMAGE */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="framer-hero-showcase-banner"
          >
            <div className="showcase-banner-inner">
              <img 
                src="/images/hero_telehealth_consultation.jpg" 
                alt="Modern Mental-Health Telehealth Consultation Session" 
                className="showcase-banner-img"
              />
              <div className="showcase-banner-overlay">
                <div className="showcase-banner-pill">
                  <span className="pulse-dot"></span>
                  <span>Active Secure Tele-Session · Encrypted WebRTC Media Channel</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE / CLINICAL SOCIAL PROOF */}
      <section className="framer-marquee-section">
        <div className="marquee-label">POWERING TRUSTED BEHAVIORAL HEALTHCARE ORGANIZATIONS NATIONWIDE</div>
        <div className="marquee-track-container">
          <div className="marquee-track">
            <span>🛡️ HIPAA Certified Practice Management</span>
            <span>🔒 SOC-2 Type II Certified Data Vault</span>
            <span>⚡ WebRTC Ultra-Low Latency Telehealth</span>
            <span>🧠 Standardized APA Assessment Batteries</span>
            <span>📋 CMS-1500 & 837P Clean Billing Claims</span>
            <span>🏥 HITRUST Security Standards Compliant</span>
            <span>🛡️ HIPAA Certified Practice Management</span>
            <span>🔒 SOC-2 Type II Certified Data Vault</span>
            <span>⚡ WebRTC Ultra-Low Latency Telehealth</span>
            <span>🧠 Standardized APA Assessment Batteries</span>
          </div>
        </div>
      </section>

      {/* METRICS / STATS STRIP */}
      <section className="framer-stats-section">
        <div className="framer-container">
          <div className="framer-stats-grid">
            <motion.div whileHover={{ y: -3 }} className="framer-stat-box">
              <div className="stat-value">25,000+</div>
              <div className="stat-title">Completed Therapy Sessions</div>
              <div className="stat-desc">Zero-friction browser telehealth & clinic visits</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="framer-stat-box">
              <div className="stat-value">98.6%</div>
              <div className="stat-title">Client Satisfaction</div>
              <div className="stat-desc">Validated post-session clinical outcomes</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="framer-stat-box">
              <div className="stat-value">4.8 hrs</div>
              <div className="stat-title">Saved Per Clinician / Week</div>
              <div className="stat-desc">With automated SOAP & DAP clinical workflows</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="framer-stat-box">
              <div className="stat-value">99.99%</div>
              <div className="stat-title">Platform Uptime SLA</div>
              <div className="stat-desc">Sub-100ms real-time WebRTC media streams</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CLINICAL WORKSPACES (ROLE SWITCHER) */}
      <section id="workspaces" className="framer-workspaces-section">
        <div className="framer-container">
          <div className="framer-section-header">
            <span className="framer-section-badge">Bespoke Clinical Workspaces</span>
            <h2 className="framer-section-title">Engineered Specifically For Each Care Discipline</h2>
            <p className="framer-section-sub">
              Unlike generic hospital EHRs, MindCare provides dedicated interfaces built ground-up for psychotherapy, psychiatric medicine, psychological testing, and patient empowerment.
            </p>
          </div>

          {/* Interactive Animated Tabs */}
          <div className="framer-role-tabs-wrapper">
            {Object.values(roles).map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`framer-role-tab ${activeRole === role.id ? 'active' : ''}`}
              >
                {role.icon}
                <span>{role.title}</span>
                {activeRole === role.id && (
                  <motion.div layoutId="roleIndicator" className="role-active-glow" />
                )}
              </button>
            ))}
          </div>

          {/* Active Workspace Showcase Card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentRole.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="framer-role-card"
            >
              <div className="role-info-col">
                <div className="role-badge-pill">
                  <Sparkles size={13} />
                  <span>{currentRole.badge}</span>
                </div>
                <h3 className="role-heading">{currentRole.headline}</h3>
                <p className="role-text">{currentRole.description}</p>

                <div className="role-features-grid">
                  {currentRole.features.map((feature, idx) => (
                    <div key={idx} className="role-feature-item">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="role-actions-row">
                  <Link to={currentRole.ctaLink} className="framer-btn-primary">
                    <span>{currentRole.ctaText}</span>
                    <ArrowRight size={16} />
                  </Link>
                  <span className="role-stat-badge">⚡ {currentRole.stats}</span>
                </div>
              </div>

              {/* Visual Preview Window */}
              <div className="role-preview-col">
                <div className="role-window-frame">
                  <div className="window-topbar">
                    <span className="dot dot-gray"></span>
                    <span className="dot dot-gray"></span>
                    <span className="dot dot-gray"></span>
                    <span className="window-label">{currentRole.title} Workspace</span>
                  </div>

                  <div className="window-inner-body">
                    <div className="preview-stat-card">
                      <Activity size={18} className="text-primary" />
                      <div>
                        <div className="stat-card-label">{currentRole.preview.statLabel}</div>
                        <div className="stat-card-val">{currentRole.preview.statVal}</div>
                      </div>
                    </div>

                    <div className="preview-agenda-card">
                      <div className="agenda-title">
                        {currentRole.preview.headerIcon}
                        <span>{currentRole.preview.headerTitle}</span>
                      </div>
                      <div className="agenda-items-list">
                        {currentRole.preview.items.map((item, idx) => (
                          <div key={idx} className="agenda-row">
                            <span className="agenda-time">{item.time}</span>
                            <span className="agenda-label">{item.label}</span>
                            <span className={`agenda-tag ${item.type}`}>{item.tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="preview-footer-card">
                      <ShieldCheck size={16} className="text-emerald" />
                      <div>
                        <strong>{currentRole.preview.footerTitle}</strong>
                        <p>{currentRole.preview.footerSub}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FRAMER BENTO GRID (CAPABILITIES) */}
      <section id="bento" className="framer-bento-section">
        <div className="framer-container">
          <div className="framer-section-header">
            <span className="framer-section-badge">Platform Architecture</span>
            <h2 className="framer-section-title">Everything Needed for Modern Behavioral Care</h2>
            <p className="framer-section-sub">
              From zero-download WebRTC video calls to automated psychometric scoring and DEA-compliant e-prescribing.
            </p>
          </div>

          {/* PLACEMENT 2: MODERN HEALTHCARE MANAGEMENT DASHBOARD VISUAL */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="framer-features-dashboard-showcase"
          >
            <div className="dashboard-showcase-card">
              <img 
                src="/images/product_healthcare_dashboard.jpg" 
                alt="Modern Mental-Health Healthcare Management Dashboard" 
                className="dashboard-showcase-img"
              />
              <div className="dashboard-showcase-caption">
                <div className="showcase-meta-tag">
                  <Activity size={14} className="text-primary" />
                  <span>Unified Clinical & Operational Management Console</span>
                </div>
                <div className="showcase-features-badges">
                  <span>Patient Caseloads</span>
                  <span>Session Scheduling</span>
                  <span>Longitudinal PHQ-9 Recovery Analytics</span>
                  <span>Automated Notes</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="framer-bento-grid">
            {/* Bento Card 1: Large Span (AI Scribe & SOAP) */}
            <motion.div whileHover={{ y: -4 }} className="bento-card span-2 bento-ai">
              <div className="bento-badge">
                <Sparkles size={13} /> AI Clinical Copilot
              </div>
              <h3>Automated Speech-to-SOAP Documentation</h3>
              <p>MindCare securely analyzes audio during live sessions to generate structured Subjective, Objective, Assessment, and Plan drafts in seconds, saving up to 5 hours of paperwork every single week.</p>
              <div className="bento-visual-soap">
                <div className="mini-soap-bubble">
                  <span className="mini-letter">S</span>
                  <span>"Patient reports feeling less fatigued; panic episode frequency dropped 70%."</span>
                </div>
                <div className="mini-soap-bubble">
                  <span className="mini-letter">A</span>
                  <span>"MDD Recurrent (F33.1) - Excellent cognitive resilience and homework follow-through."</span>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 2: WebRTC Telehealth */}
            <motion.div whileHover={{ y: -4 }} className="bento-card bento-telehealth">
              <div className="bento-badge">
                <Video size={13} /> Native WebRTC
              </div>
              <h3>1-Click "Join Therapy" Telehealth</h3>
              <p>No downloads, no passwords, no Zoom links. Direct browser WebRTC video with end-to-end DTLS-SRTP encryption.</p>
              <div className="bento-metric-callout">
                <div className="callout-number">&lt;100ms</div>
                <div className="callout-label">Average Media Latency</div>
              </div>
            </motion.div>

            {/* Bento Card 3: Outcome Measures */}
            <motion.div whileHover={{ y: -4 }} className="bento-card bento-outcomes">
              <div className="bento-badge">
                <TrendingUp size={13} /> Longitudinal Curves
              </div>
              <h3>PHQ-9 & GAD-7 Recovery Trajectories</h3>
              <p>Automated digital questionnaires with instant severity computation and longitudinal trend charts.</p>
              <div className="mini-chart-bar-group">
                <div className="chart-bar-item">
                  <div className="chart-bar-fill h-18"></div>
                  <span>W1 (18)</span>
                </div>
                <div className="chart-bar-item">
                  <div className="chart-bar-fill h-14"></div>
                  <span>W3 (14)</span>
                </div>
                <div className="chart-bar-item">
                  <div className="chart-bar-fill h-9"></div>
                  <span>W6 (9)</span>
                </div>
                <div className="chart-bar-item">
                  <div className="chart-bar-fill h-6 active"></div>
                  <span>W8 (6)</span>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 4: Crisis & Safety Plans */}
            <motion.div whileHover={{ y: -4 }} className="bento-card bento-crisis">
              <div className="bento-badge badge-red">
                <AlertCircle size={13} /> Emergency Protocol
              </div>
              <h3>Stanley-Brown Safety Protocols</h3>
              <p>Instantly deploy collaborative safety plans with warning signs, coping mechanisms, and 24/7 988 Lifeline linkages.</p>
              <div className="crisis-mini-pill">
                <Phone size={13} /> 988 Suicide & Crisis Lifeline Ready
              </div>
            </motion.div>

            {/* Bento Card 5: Role-Based Access Control & Zero-Trust Security */}
            <motion.div whileHover={{ y: -4 }} className="bento-card span-2 bento-rbac">
              <div className="bento-rbac-split">
                <div className="bento-rbac-info">
                  <div className="bento-badge">
                    <ShieldCheck size={13} /> Zero-Trust Security
                  </div>
                  <h3>Strict Role-Based Access Control (RBAC)</h3>
                  <p>Total architectural separation between clinical psychotherapy notes, billing claims, and administrative scheduling. Front-desk staff and billing agents cannot view confidential session content.</p>
                  <div className="rbac-roles-row">
                    <span className="rbac-pill">Therapist (Clinical)</span>
                    <span className="rbac-pill">Psychiatrist (Medical)</span>
                    <span className="rbac-pill">Psychologist (Testing)</span>
                    <span className="rbac-pill">Patient Portal</span>
                    <span className="rbac-pill">Supervisor (Co-Sign)</span>
                    <span className="rbac-pill">Billing (Claims)</span>
                  </div>
                </div>

                {/* PLACEMENT 3: PREMIUM HEALTHCARE CYBERSECURITY ILLUSTRATION */}
                <div className="bento-security-img-box">
                  <img 
                    src="/images/security_healthcare_cybersecurity.jpg" 
                    alt="Enterprise Healthcare Cybersecurity & PHI Data Protection Vault" 
                    className="bento-security-img"
                  />
                  <div className="security-img-badge">
                    <Lock size={11} className="text-emerald" />
                    <span>256-Bit Encrypted EHR Vault · HIPAA / HITRUST</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PRACTICE ROI / CASELOAD CALCULATOR */}
      <section id="calculator" className="framer-calculator-section">
        <div className="framer-container">
          <div className="calculator-box">
            <div className="calculator-header">
              <span className="framer-section-badge">Practice Efficiency Estimator</span>
              <h2 className="calc-title">Calculate How Much Time MindCare Saves Your Practice</h2>
              <p className="calc-sub">Slide to match your active weekly client caseload.</p>
            </div>

            <div className="calculator-slider-row">
              <div className="slider-label-group">
                <span>Active Weekly Clients:</span>
                <strong className="slider-val-number">{clientCaseload} Clients</strong>
              </div>
              <input 
                type="range" 
                min="10" 
                max="80" 
                step="2" 
                value={clientCaseload}
                onChange={(e) => setClientCaseload(Number(e.target.value))}
                className="framer-range-slider"
              />
              <div className="slider-ticks">
                <span>10 Clients</span>
                <span>40 Clients</span>
                <span>80 Clients</span>
              </div>
            </div>

            <div className="calculator-results-grid">
              <div className="calc-result-card">
                <div className="result-number text-primary">{hoursSavedPerMonth} hrs</div>
                <div className="result-label">Documentation Time Saved / Month</div>
                <div className="result-sub">More time for client sessions & self-care</div>
              </div>
              <div className="calc-result-card">
                <div className="result-number text-emerald">{claimAccuracy}%</div>
                <div className="result-label">Clean Insurance Claim Rate</div>
                <div className="result-sub">With automated CMS-1500 coding</div>
              </div>
              <div className="calc-result-card">
                <div className="result-number text-accent">+$${revenueBoost.toLocaleString()}</div>
                <div className="result-label">Est. Added Practice Value / Month</div>
                <div className="result-sub">Reduced no-shows & faster billing cycles</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLINICAL TESTIMONIALS */}
      <section id="testimonials" className="framer-testimonials-section">
        <div className="framer-container">
          <div className="framer-section-header">
            <span className="framer-section-badge">Clinical Testimonials</span>
            <h2 className="framer-section-title">Loved by Clinicians. Trusted by Patients.</h2>
            <p className="framer-section-sub">Read what mental health professionals say about practicing on MindCare EHR.</p>
          </div>

          <div className="framer-testimonials-grid">
            <motion.div whileHover={{ y: -4 }} className="framer-testimonial-card">
              <div className="card-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className="card-quote">
                "Having native WebRTC video and concurrent SOAP notes on one screen without third-party plugins has eliminated documentation burnout from my daily practice."
              </p>
              <div className="card-author-row">
                <img src="/images/doctor_telehealth.jpg" alt="Dr. Sarah Chen" className="author-avatar-img" />
                <div>
                  <div className="author-name">Dr. Sarah Chen, LCSW</div>
                  <div className="author-role">Clinical Director · Hope Valley Center</div>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="framer-testimonial-card">
              <div className="card-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className="card-quote">
                "Managing psychotropic titration schedules while coordinating with our therapists has never been this fluid. The RBAC model ensures total confidentiality."
              </p>
              <div className="card-author-row">
                <img src="/images/doctor_mark_rivera.jpg" alt="Dr. Mark Rivera" className="author-avatar-img" />
                <div>
                  <div className="author-name">Dr. Mark Rivera, MD</div>
                  <div className="author-role">Board Certified Psychiatrist · Metro Health</div>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="framer-testimonial-card">
              <div className="card-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className="card-quote">
                "As a client, clicking 'Join Therapy' directly from my portal without downloading software removed all my pre-session anxiety. It's safe, private, and simple."
              </p>
              <div className="card-author-row">
                <img src="/images/patient_telehealth.jpg" alt="Emma J." className="author-avatar-img" />
                <div>
                  <div className="author-name">Emma J.</div>
                  <div className="author-role">Patient Portal User · In Active Recovery</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="framer-faq-section">
        <div className="framer-container">
          <div className="framer-section-header">
            <span className="framer-section-badge">Frequently Asked Questions</span>
            <h2 className="framer-section-title">Everything You Need to Know</h2>
            <p className="framer-section-sub">Clear answers regarding security, telehealth compliance, and multi-role operations.</p>
          </div>

          <div className="framer-faq-wrapper">
            {[
              {
                q: "Is MindCare fully HIPAA and SOC-2 Type II compliant?",
                a: "Yes. All data at rest is encrypted with AES-256 and all data in transit uses TLS 1.3. Telehealth streams use DTLS-SRTP end-to-end encryption. Strict Role-Based Access Control (RBAC) ensures administrative and billing personnel never see confidential psychotherapy notes."
              },
              {
                q: "How does the 'Join Therapy' WebRTC Telehealth work?",
                a: "Telehealth runs natively in your browser using secure WebRTC technology. Neither clients nor clinicians need to download software, install browser extensions, or remember separate Zoom links. Simply click 'Join Therapy' from your appointments schedule or patient portal."
              },
              {
                q: "Can multiple clinicians collaborate on the same client safely?",
                a: "Yes. MindCare supports multi-disciplinary care teams. A therapist, psychiatrist, and clinical psychologist can be assigned to the same client while maintaining granular confidentiality boundaries. Case notes, e-prescriptions, and assessment reports remain organized in their respective clinical tabs."
              },
              {
                q: "How are outcome measures like PHQ-9 and GAD-7 tracked?",
                a: "Clients can complete digital questionnaires through the patient portal or during an assessment session. MindCare automatically scores the inventory, calculates clinical severity (Minimal, Mild, Moderate, Severe), and charts longitudinal progress graphs over time."
              },
              {
                q: "What happens in a mental health crisis or emergency?",
                a: "MindCare includes integrated Stanley-Brown Safety Plans accessible in 1 click by both clinician and client. In addition, the platform prominently surfaces 24/7 crisis resources including the National 988 Suicide & Crisis Lifeline and Crisis Text Line on all client screens."
              },
              {
                q: "Can clinical supervisors review and co-sign trainee notes?",
                a: "Yes. MindCare features a dedicated Supervisor Console where associate and intern notes are queued for review, feedback, and legal co-signature before being finalized into the medical record."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className={`framer-faq-item ${activeFaq === index ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-q-row">
                  <span>{faq.q}</span>
                  <div className="faq-toggle-icon">
                    {activeFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="faq-a-row"
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGH-CONVERTING BOTTOM CTA */}
      <section className="framer-cta-section">
        <div className="framer-container">
          <div className="framer-cta-card">
            <div className="cta-spotlight-glow"></div>
            <div className="cta-badge-pill">
              <Sparkles size={14} />
              <span>Modernize Your Practice Today</span>
            </div>
            <h2 className="cta-title">
              Ready to Experience the Future of Mental Health Care?
            </h2>
            <p className="cta-subtitle">
              Join hundreds of forward-thinking clinicians and clinics delivering confidential, outcome-driven behavioral health therapy.
            </p>
            <div className="cta-buttons-row">
              <Link to="/register" className="framer-btn-cta-primary">
                <span>Start Practice Free Trial</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/login" className="framer-btn-cta-ghost">
                <Lock size={15} />
                <span>Patient Portal Login</span>
              </Link>
            </div>
            <div className="cta-guarantees">
              <span>✓ No credit card required</span>
              <span>✓ 60-Second setup</span>
              <span>✓ 100% HIPAA compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="framer-footer">
        <div className="framer-container">
          <div className="footer-columns-grid">
            <div className="footer-info-col">
              <div className="footer-brand">
                <div className="framer-logo-box">
                  <BrainCircuit size={18} className="logo-svg" />
                </div>
                <span className="brand-title">MindCare EHR</span>
              </div>
              <p className="footer-bio">
                Confidential, secure, and clinically effective mental health practice management and WebRTC telehealth platform.
              </p>
              <div className="footer-crisis-box">
                <div className="crisis-title">🚨 24/7 Lifeline Callout</div>
                <p>Call or text <strong>988</strong> for free, confidential mental health crisis support.</p>
              </div>
            </div>

            <div>
              <h4 className="footer-col-title">Clinical Suites</h4>
              <ul className="footer-links-list">
                <li><Link to="/login">Therapist Workspace</Link></li>
                <li><Link to="/login">Psychiatric Suite & E-Rx</Link></li>
                <li><Link to="/login">Psychology Assessment Hub</Link></li>
                <li><Link to="/login">Patient Care Portal</Link></li>
                <li><Link to="/login">Clinical Supervision Console</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Platform</h4>
              <ul className="footer-links-list">
                <li><a href="#workspaces">Role Workspaces</a></li>
                <li><a href="#telehealth">WebRTC Telehealth</a></li>
                <li><a href="#bento">SOAP Documentation</a></li>
                <li><a href="#calculator">Practice ROI Calculator</a></li>
                <li><a href="#testimonials">Outcomes & Reviews</a></li>
                <li><a href="#faq">Frequently Asked</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Security & Standards</h4>
              <ul className="footer-links-list">
                <li><a href="#faq">HIPAA / HITECH Compliance</a></li>
                <li><a href="#faq">SOC-2 Type II Certified</a></li>
                <li><a href="#faq">256-Bit Data Encryption</a></li>
                <li><a href="#faq">Zero-Trust RBAC Model</a></li>
                <li><a href="#faq">Crisis Protocols & 988</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-row">
            <div>
              © 2026 MindCare Mental Health Therapy & Session Tracking System. All Rights Reserved.
            </div>
            <div className="legal-links">
              <a href="#faq">Privacy Policy</a>
              <a href="#faq">Terms of Service</a>
              <a href="#faq">HIPAA Notice</a>
              <a href="#faq">Clinical Governance</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

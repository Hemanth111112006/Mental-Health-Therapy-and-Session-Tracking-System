import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Brand SVGs for luxury presentation
export const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 18 18" style={{ marginRight: 4 }}>
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.7-1.57 2.69-3.88 2.69-6.57z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.34-1.58-5.05-3.72H.94v2.3C2.42 16.03 5.48 18 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.95 10.73A5.4 5.4 0 0 1 3.6 9c0-.6.1-1.19.29-1.73V4.97H.94A8.99 8.99 0 0 0 0 9c0 1.48.36 2.89.94 4.13l3.01-2.4z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.89 11.43 0 9 0 5.48 0 2.42 1.97.94 4.97l3.01 2.39c.71-2.14 2.7-3.72 5.05-3.72z"
    />
  </svg>
);

export const MicrosoftIcon = () => (
  <svg width="12" height="12" viewBox="0 0 23 23" style={{ marginRight: 4 }}>
    <rect x="0" y="0" width="11" height="11" fill="#F25022" />
    <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
    <rect x="0" y="12" width="11" height="11" fill="#00A1F1" />
    <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
  </svg>
);

export const AppleIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ marginRight: 4 }}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.17 14.5c-.83 0-1.63-.5-2.07-.5-.45 0-1.32.5-2.06.5-1.57 0-3.32-1.33-4.22-3.14-1.2-2.42-.5-5.27 1.15-6.61.85-.68 1.9-.94 2.88-.94.94 0 1.95.27 2.76.85.34.24.78.65 1.06 1.05.3-.43.76-.84 1.1-1.07.78-.54 1.76-.83 2.65-.83 1.06 0 2.15.35 3 .95.4.28 1 .8 1.4 1.34-1.2.6-1.9 1.78-1.9 3.06 0 1.96 1.44 2.97 1.63 3.08-.18.45-.63 1.37-1.37 2.37-.87 1.18-1.78 2.27-3.16 2.27z" />
  </svg>
);

const testimonials = [
  {
    text: "MindCare has streamlined our clinical intake, reducing admin overhead by 40% and letting us focus entirely on client care.",
    author: "Dr. Robert Chen, PsyD",
    role: "Clinical Director, Hope Pathways",
  },
  {
    text: "The HIPAA-compliant secure messaging and automatic outcome scoring have completely transformed how we measure CBT progress.",
    author: "Sarah Jenkins, LCSW",
    role: "Lead Psychotherapist, Valley Health",
  },
  {
    text: "As a supervisor, having the pending co-signatures queue and supervisor notes integrated saves me hours of coordination every week.",
    author: "Dr. Patricia Williams, LMFT",
    role: "Clinical Supervisor",
  },
];

const AuthLayout = ({ children }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div
      className="mc-luxury-auth-wrapper"
      style={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "var(--bg-primary)"
      }}
    >
      {/* Top Header Navigation */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 40px",
          background: "rgba(255, 255, 255, 0.04)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 10,
          backdropFilter: "blur(10px)",
          height: "48px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🧠</span>
          <strong
            style={{
              fontSize: 14,
              color: "white",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            MindCare Enterprise
          </strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10B981",
                display: "inline-block",
              }}
            ></span>
            Status: <strong style={{ color: "white" }}>Operational</strong>
          </div>
          <a
            href="#help"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.8)",
              textDecoration: "none",
            }}
          >
            Help Center
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div
        style={{
          display: "flex",
          flex: 1,
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left Side: Premium Healthcare Illustration & Micro-cards */}
        <div
          className="mc-luxury-left"
          style={{ padding: "30px 60px 40px 60px" }}
        >
          <div
            className="mc-auth-brand"
            style={{ textAlign: "left", width: "100%" }}
          >
            <h1
              style={{
                fontSize: "26px",
                lineHeight: "1.2",
                fontWeight: 800,
                color: "white",
              }}
            >
              Mental Health Therapy and Session Tracking System
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.8)",
                marginTop: 8,
                maxWidth: 500,
                lineHeight: 1.5,
              }}
            >
              Secure • Confidential • Professional Mental Healthcare Platform.
              Empowering practitioners to schedule, document, plan treatment,
              and monitor outcomes.
            </p>
          </div>

          {/* Glowing Vitality / Heartbeat wave SVG */}
          <div className="mc-luxury-hero-container" style={{ margin: '35px auto', maxWidth: 500, height: 200, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="100%" height="180" viewBox="0 0 400 150" style={{ overflow: 'visible', opacity: 0.85, zIndex: 1 }}>
              <defs>
                <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4338CA" stopOpacity="0.1" />
                  <stop offset="30%" stopColor="#C4B5FD" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#C4B5FD" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#5B21B6" stopOpacity="0.1" />
                </linearGradient>
                <filter id="pulseGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Clinical Grid lines */}
              <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="6,6" />
              <line x1="0" y1="35" x2="400" y2="35" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="115" x2="400" y2="115" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              {/* Dynamic pulse wave path */}
              <g transform="translate(0, 75) scale(1, 1.25) translate(0, -75)">
                <path 
                  className="heartbeat-animated"
                  d="M 0,75 L 80,75 L 95,55 L 105,95 L 115,35 L 125,115 L 135,65 L 145,80 L 155,75 L 245,75 L 260,55 L 270,95 L 280,25 L 290,125 L 300,65 L 310,80 L 320,75 L 400,75" 
                  stroke="url(#pulseGrad)" 
                  strokeWidth="3.5" 
                  fill="none" 
                  filter="url(#pulseGlow)"
                />
              </g>
              <style>{`
                @keyframes waveScroll {
                  0% { stroke-dashoffset: 400; }
                  100% { stroke-dashoffset: 0; }
                }
                .heartbeat-animated {
                  stroke-dasharray: 400;
                  animation: waveScroll 3s linear infinite;
                }
              `}</style>
            </svg>
          </div>


          {/* Testimonial slider for realism */}
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              alignSelf: "center",
              padding: "14px 18px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              margin: "10px 0",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontStyle: "italic",
                color: "rgba(255, 255, 255, 0.95)",
                margin: 0,
                minHeight: 36,
                lineHeight: "1.5",
              }}
            >
              "{testimonials[activeTestimonial].text}"
            </p>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong
                  style={{ display: "block", color: "white", fontSize: 11 }}
                >
                  {testimonials[activeTestimonial].author}
                </strong>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>
                  {testimonials[activeTestimonial].role}
                </span>
              </div>
              {/* Dots */}
              <div style={{ display: "flex", gap: 4 }}>
                {testimonials.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background:
                        activeTestimonial === idx
                          ? "white"
                          : "rgba(255,255,255,0.3)",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Content Passed via Children */}
        <div className="mc-luxury-right" style={{ padding: "20px", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

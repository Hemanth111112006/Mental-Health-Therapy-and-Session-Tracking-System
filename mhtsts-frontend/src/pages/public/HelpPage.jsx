import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HelpPage = () => {
  const [openSection, setOpenSection] = useState(null);

  const faqs = [
    { q: 'How do I schedule an appointment?', a: 'Navigate to Appointments in the sidebar and click "Schedule New Appointment". Select the client, provider, date, and time.' },
    { q: 'How do I send a secure message?', a: 'Click on "Messaging" in the sidebar. Select a recipient and type your message. All messages are encrypted end-to-end.' },
    { q: 'How do I create a safety plan?', a: 'Go to Safety Plans in the sidebar and click "Add New Safety Plan". Fill in the warning signs, coping strategies, and emergency contacts.' },
    { q: 'How do I view my billing history?', a: 'Navigate to Billing in the sidebar to view all invoices and payment records.' },
    { q: 'How do I reset my password?', a: 'Go to Settings and click "Change Password". Enter your current password and your new password.' },
    { q: 'Who do I contact for technical support?', a: 'Email support@mindcare.com or call 1-800-MINDCARE. Support is available Monday–Friday, 8am–6pm EST.' }
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Help & Support</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Find answers to common questions or contact our support team.</p>
        </div>
        <Link to="/dashboard" className="mc-btn mc-btn-outline mc-btn-sm" style={{ textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="mc-card" style={{ marginBottom: 24, padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>📞 Contact Support</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>📧 Email</div>
            <div style={{ color: 'var(--color-primary)' }}>support@mindcare.com</div>
          </div>
          <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>📱 Phone</div>
            <div style={{ color: 'var(--color-primary)' }}>1-800-MINDCARE</div>
          </div>
          <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>🕐 Hours</div>
            <div style={{ color: 'var(--text-secondary)' }}>Mon–Fri, 8am–6pm EST</div>
          </div>
          <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 8 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>🚨 Crisis Line</div>
            <div style={{ color: '#ef4444' }}>988 (Suicide & Crisis Lifeline)</div>
          </div>
        </div>
      </div>

      <div className="mc-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>❓ Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} style={{ borderBottom: '1px solid var(--border-primary)', marginBottom: 0 }}>
            <button
              style={{ width: '100%', textAlign: 'left', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}
              onClick={() => setOpenSection(openSection === index ? null : index)}
            >
              {faq.q}
              <span>{openSection === index ? '▲' : '▼'}</span>
            </button>
            {openSection === index && (
              <div style={{ paddingBottom: 14, color: 'var(--text-secondary)', fontSize: 14 }}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpPage;

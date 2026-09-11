const fs = require('fs');
const path = require('path');

const pages = [
  { dir: 'admin/pages/reports', file: 'AdminReportsPage.jsx', title: 'Admin Reports', icon: 'FileBarChart', desc: 'Printable clinical and financial report tables with export options.' },
  { dir: 'admin/pages/analytics', file: 'AdminAnalyticsPage.jsx', title: 'Admin Analytics', icon: 'PieChart', desc: 'Real-time dashboard with KPI cards and growth charts.' },
  { dir: 'psychiatrist/pages', file: 'PsychiatristCalendarPage.jsx', title: 'Psychiatrist Calendar', icon: 'CalendarDays', desc: 'Monthly, weekly, and daily schedule timeline.' },
  { dir: 'psychiatrist/pages', file: 'PsychiatristAppointmentsPage.jsx', title: 'Psychiatrist Appointments', icon: 'Clock', desc: 'Appointment list, telehealth links, and check-in status.' },
  { dir: 'therapist/pages', file: 'TherapistCalendarPage.jsx', title: 'Therapist Calendar', icon: 'CalendarDays', desc: 'Scheduling interface for therapy sessions.' },
  { dir: 'therapist/pages', file: 'TherapistAppointmentsPage.jsx', title: 'Therapist Appointments', icon: 'Clock', desc: 'Manage upcoming appointments and history.' },
  { dir: 'psychologist/pages', file: 'PsychologistCalendarPage.jsx', title: 'Psychologist Calendar', icon: 'CalendarDays', desc: 'Assessment and evaluation schedule.' },
  { dir: 'psychologist/pages', file: 'PsychologistAppointmentsPage.jsx', title: 'Psychologist Appointments', icon: 'Clock', desc: 'Patient appointments and telehealth access.' },
  { dir: 'clients/pages', file: 'ClientCalendarPage.jsx', title: 'My Calendar', icon: 'CalendarDays', desc: 'View your upcoming schedule and therapist availability.' },
  { dir: 'clients/pages', file: 'ClientAppointmentsPage.jsx', title: 'My Appointments', icon: 'Clock', desc: 'Manage your appointments, cancel, or reschedule.' },
  { dir: 'receptionist/pages', file: 'ReceptionistSchedulePage.jsx', title: 'Staff Schedule', icon: 'CalendarDays', desc: 'Resource allocation and daily staff schedules.' },
  { dir: 'receptionist/pages', file: 'ReceptionistAppointmentsPage.jsx', title: 'Appointment Queue', icon: 'Clock', desc: 'Check-in, walk-ins, and appointment status.' }
];

const basePath = path.join(process.cwd(), 'src', 'features');

pages.forEach(p => {
  const fullDir = path.join(basePath, p.dir);
  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir, { recursive: true });
  }
  
  const content = `import React from 'react';
import { ${p.icon} } from 'lucide-react';

const ${p.file.replace('.jsx', '')} = () => {
  return (
    <div className="mc-page-container" style={{ padding: '20px' }}>
      <div className="mc-page-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <${p.icon} size={24} style={{ color: 'var(--primary-color)' }} />
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>${p.title}</h1>
      </div>
      <div className="mc-card" style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>${p.desc}</p>
        <div style={{ marginTop: '20px', height: '200px', border: '2px dashed var(--border-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'var(--text-secondary)' }}>[${p.title} Content Area]</span>
        </div>
      </div>
    </div>
  );
};

export default ${p.file.replace('.jsx', '')};
`;

  fs.writeFileSync(path.join(fullDir, p.file), content);
  console.log('Created: ' + p.file);
});

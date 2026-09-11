import React, { useState } from 'react';
import { 
  CalendarDays, ChevronLeft, ChevronRight, Clock, User, 
  MapPin, CheckCircle2, AlertCircle, Plus, Filter, Calendar as CalendarIcon,
  ShieldCheck, Phone, Stethoscope
} from 'lucide-react';
import { toast } from '../../../utils/toast';

const ReceptionistSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockForm, setBlockForm] = useState({
    provider: 'Dr. Sarah Chen, LCSW',
    timeSlot: '12:00 PM - 01:00 PM',
    reason: 'Lunch / Clinical Admin Documentation'
  });

  const [blocks, setBlocks] = useState([
    { id: 1, provider: 'Dr. James Rodriguez, MD', time: '12:00 PM - 01:00 PM', reason: 'Peer Case Supervision' }
  ]);

  const changeDate = (days) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  const providers = [
    {
      id: 1,
      name: 'Dr. Sarah Chen, LCSW',
      title: 'Senior Clinical Psychotherapist',
      specialty: 'THERAPY',
      room: 'Room 204',
      badge: 'Active in Room',
      phone: 'ext. 204',
      slots: [
        { time: '09:00 AM - 09:50 AM', client: 'Sophia Davis', type: 'Individual CBT', status: 'COMPLETED' },
        { time: '10:30 AM - 11:20 AM', client: 'Taylor Morgan', type: 'Anxiety Exposure', status: 'IN_PROGRESS' },
        { time: '01:30 PM - 02:20 PM', client: 'Jordan Taylor', type: 'Depression Protocol', status: 'SCHEDULED' },
        { time: '03:00 PM - 03:50 PM', client: 'Casey Harper', type: 'Intake Evaluation', status: 'SCHEDULED' }
      ]
    },
    {
      id: 2,
      name: 'Dr. James Rodriguez, MD',
      title: 'Consulting Psychiatrist',
      specialty: 'PSYCHIATRY',
      room: 'Room 108',
      badge: 'In Session',
      phone: 'ext. 108',
      slots: [
        { time: '10:00 AM - 10:45 AM', client: 'Jennifer Miller', type: 'Medication Review', status: 'COMPLETED' },
        { time: '11:00 AM - 11:45 AM', client: 'Sarah Connor', type: 'Psychiatric Eval', status: 'IN_PROGRESS' },
        { time: '02:00 PM - 02:45 PM', client: 'David Wilson', type: 'Prescription Renewal', status: 'SCHEDULED' }
      ]
    },
    {
      id: 3,
      name: 'Dr. Emily Chen, PsyD',
      title: 'Clinical Psychologist & Neuropsych',
      specialty: 'PSYCHOLOGY',
      room: 'Room 301',
      badge: 'Available',
      phone: 'ext. 301',
      slots: [
        { time: '09:00 AM - 10:30 AM', client: 'Sophia Davis', type: 'MMPI-3 Battery', status: 'COMPLETED' },
        { time: '01:00 PM - 02:30 PM', client: 'Marcus Vance', type: 'Cognitive Screening', status: 'SCHEDULED' }
      ]
    },
    {
      id: 4,
      name: 'Dr. Michael Thompson, LCSW',
      title: 'Counselor & Family Specialist',
      specialty: 'THERAPY',
      room: 'Room 202',
      badge: 'Active in Room',
      phone: 'ext. 202',
      slots: [
        { time: '11:30 AM - 12:20 PM', client: 'Ava Johnson', type: 'Family Mediation', status: 'IN_PROGRESS' },
        { time: '02:30 PM - 03:20 PM', client: 'David Wilson', type: 'CBT Protocol', status: 'SCHEDULED' }
      ]
    }
  ];

  const facilities = [
    { name: 'Room 102 (Intake / Walk-In)', status: 'AVAILABLE', occupant: 'None (Front Desk Ready)' },
    { name: 'Room 204 (Psychotherapy Suite)', status: 'IN_USE', occupant: 'Dr. Sarah Chen, LCSW' },
    { name: 'Room 108 (Psychiatry Office)', status: 'IN_USE', occupant: 'Dr. James Rodriguez, MD' },
    { name: 'Room 301 (Testing & Diagnostics)', status: 'AVAILABLE', occupant: 'Available for walk-in' },
    { name: 'Suite 202 (Counseling Studio)', status: 'IN_USE', occupant: 'Dr. Michael Thompson, LCSW' }
  ];

  const filteredProviders = providers.filter(p => 
    selectedSpecialty === 'ALL' ? true : p.specialty === selectedSpecialty
  );

  const handleAddBlock = (e) => {
    e.preventDefault();
    setBlocks([...blocks, { id: Date.now(), ...blockForm }]);
    setShowBlockModal(false);
    toast.success(`Schedule block added for ${blockForm.provider}`);
  };

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      
      {/* Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 800 }}>
            <CalendarDays style={{ color: 'var(--color-primary)', width: 28, height: 28 }} /> Staff Schedule & Provider Roster
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Daily clinician availability, room allocation, and front-desk schedule coordination.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="mc-btn mc-btn-primary" onClick={() => setShowBlockModal(true)} style={{ fontSize: 11, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Block Provider Time
          </button>
        </div>
      </div>

      {/* Date Bar & Specialty Filter */}
      <div className="mc-card" style={{ padding: 14, borderRadius: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          
          {/* Date Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => changeDate(-1)} style={{ padding: '6px 10px' }}>
              <ChevronLeft size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarIcon size={18} style={{ color: 'var(--color-primary)' }} />
              <strong style={{ fontSize: 15, color: '#1E1B4B' }}>{formattedDate}</strong>
            </div>
            <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => changeDate(1)} style={{ padding: '6px 10px' }}>
              <ChevronRight size={16} />
            </button>
            <button className="mc-btn mc-btn-ghost mc-btn-sm" onClick={() => setSelectedDate(new Date())} style={{ fontSize: 11 }}>
              Today
            </button>
          </div>

          {/* Specialty Filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Providers' },
              { id: 'THERAPY', label: 'Psychotherapy' },
              { id: 'PSYCHIATRY', label: 'Psychiatry' },
              { id: 'PSYCHOLOGY', label: 'Testing & Assessments' }
            ].map(f => (
              <button
                key={f.id}
                className={`mc-btn ${selectedSpecialty === f.id ? 'mc-btn-primary' : 'mc-btn-outline'} mc-btn-sm`}
                onClick={() => setSelectedSpecialty(f.id)}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Provider Roster Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
        {filteredProviders.map(p => (
          <div key={p.id} className="mc-card" style={{ padding: 18, borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            {/* Provider Head */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#EEF2FF',
                  color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14
                }}>
                  {p.name.split(' ').map(x => x[0]).slice(1, 3).join('')}
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{p.name}</h3>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.title}</span>
                </div>
              </div>
              <span className={`mc-badge mc-badge-${p.badge === 'Available' ? 'success' : 'active'}`} style={{ fontSize: 10 }}>
                {p.badge}
              </span>
            </div>

            {/* Room & Extension */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, background: '#F8F9FA', padding: '6px 10px', borderRadius: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} style={{ color: 'var(--color-primary)' }} /> Assigned: <strong>{p.room}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                <Phone size={12} /> {p.phone}
              </span>
            </div>

            {/* Provider Schedule Slots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Today's Bookings ({p.slots.length})
              </span>
              {p.slots.map((slot, idx) => (
                <div key={idx} style={{ 
                  padding: '8px 10px', borderRadius: 8, background: '#FAFAFA', 
                  border: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={12} style={{ color: '#4338CA' }} />
                      <strong style={{ fontSize: 11, color: '#1E1B4B' }}>{slot.time}</strong>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginTop: 2 }}>
                      {slot.client} · {slot.type}
                    </span>
                  </div>
                  <span className={`mc-badge mc-badge-${slot.status === 'COMPLETED' ? 'success' : slot.status === 'IN_PROGRESS' ? 'active' : 'default'}`} style={{ fontSize: 9 }}>
                    {slot.status === 'IN_PROGRESS' ? 'Active' : slot.status}
                  </span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* Facility & Room Utilization Panel */}
      <div className="mc-card" style={{ padding: 20, borderRadius: 14, marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={18} style={{ color: 'var(--color-primary)' }} /> Clinic Room & Facility Utilization
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {facilities.map((fac, idx) => (
            <div key={idx} style={{ 
              padding: 14, borderRadius: 10, background: fac.status === 'AVAILABLE' ? '#F0FDF4' : '#F8FAFC',
              border: `1px solid ${fac.status === 'AVAILABLE' ? '#DCFCE7' : '#E2E8F0'}`,
              display: 'flex', flexDirection: 'column', gap: 6
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: 12, color: '#1E293B' }}>{fac.name}</strong>
                <span className={`mc-badge mc-badge-${fac.status === 'AVAILABLE' ? 'success' : 'active'}`} style={{ fontSize: 9 }}>
                  {fac.status}
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                Current: <strong>{fac.occupant}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Block Modal */}
      {showBlockModal && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 460, padding: 24, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Block Provider Time Slot</h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setShowBlockModal(false)} style={{ fontSize: 20, padding: 4 }}>&times;</button>
            </div>
            <form onSubmit={handleAddBlock} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Provider</label>
                <select
                  className="form-select"
                  value={blockForm.provider}
                  onChange={e => setBlockForm({ ...blockForm, provider: e.target.value })}
                  style={{ height: 36, fontSize: 12 }}
                >
                  <option value="Dr. Sarah Chen, LCSW">Dr. Sarah Chen, LCSW</option>
                  <option value="Dr. James Rodriguez, MD">Dr. James Rodriguez, MD</option>
                  <option value="Dr. Emily Chen, PsyD">Dr. Emily Chen, PsyD</option>
                  <option value="Dr. Michael Thompson, LCSW">Dr. Michael Thompson, LCSW</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Time Range</label>
                <input
                  type="text"
                  className="form-control"
                  value={blockForm.timeSlot}
                  onChange={e => setBlockForm({ ...blockForm, timeSlot: e.target.value })}
                  placeholder="e.g. 12:00 PM - 01:00 PM"
                  style={{ height: 36, fontSize: 12 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Reason / Label</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={blockForm.reason}
                  onChange={e => setBlockForm({ ...blockForm, reason: e.target.value })}
                  placeholder="e.g. Lunch / Administrative Documentation"
                  style={{ height: 36, fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button type="button" className="mc-btn mc-btn-outline" onClick={() => setShowBlockModal(false)} style={{ fontSize: 12 }}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn mc-btn-primary" style={{ fontSize: 12 }}>
                  Save Schedule Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReceptionistSchedulePage;

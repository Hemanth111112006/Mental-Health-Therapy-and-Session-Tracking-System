import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Loader } from 'lucide-react';
import { appointmentApi } from '../../../api/appointmentApi';

const timeSlots = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM'];

const ClientCalendarPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentApi.getAllAppointments()
      .then(data => setAppointments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const prevDay = () => setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate()-1); return n; });
  const nextDay = () => setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate()+1); return n; });

  const dateLabel = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  const todayStr = currentDate.toISOString().slice(0,10);
  const todayAppts = appointments.filter(a => a.date === todayStr);

  const showDetails = (appt) => {
    const providerName = appt.therapist ? `${appt.therapist.firstName || ''} ${appt.therapist.lastName || appt.therapist.username || ''}`.trim() : 'Your Provider';
    toast.info(`Appointment: ${appt.type || "Session"} with ${providerName} at ${appt.startTime || "TBD"} (${appt.status || "Scheduled"})`);
  };

  return (
    <div className="mc-page-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px' }}><CalendarDays size={24} /></div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>My Calendar</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>View your scheduled appointments.</p>
          </div>
        </div>
        <button onClick={() => navigate('/client/appointments?action=request')} className="mc-btn mc-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} /> Book Session
        </button>
      </div>

      <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={prevDay} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', display: 'flex', cursor: 'pointer', color: 'var(--text-primary)' }}><ChevronLeft size={18} /></button>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{dateLabel}</h2>
          <button onClick={nextDay} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', display: 'flex', cursor: 'pointer', color: 'var(--text-primary)' }}><ChevronRight size={18} /></button>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{loading ? 'Loading...' : `${todayAppts.length} appointment(s) today`}</span>
      </div>

      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', overflowY: 'auto', display: 'flex', minHeight: '400px' }}>
        <div style={{ width: '80px', borderRight: '1px solid var(--border-primary)', padding: '20px 0', display: 'flex', flexDirection: 'column' }}>
          {timeSlots.map(time => (
            <div key={time} style={{ height: '80px', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-10px', right: '12px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{time}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '20px', backgroundSize: '100% 80px', backgroundImage: 'linear-gradient(to bottom, var(--border-primary) 1px, transparent 1px)' }}>
          {loading && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}><Loader size={24} /></div>}
          {!loading && todayAppts.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <CalendarDays size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: '16px' }}>No appointments on this day.</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>Contact your care team to schedule a session.</p>
            </div>
          )}
          {todayAppts.map((appt, i) => {
            const colors = ['rgba(59,130,246,0.15)','rgba(16,185,129,0.15)','rgba(245,158,11,0.15)'];
            const borders = ['var(--primary-color)','#10B981','#F59E0B'];
            const providerName = appt.therapist ? `${appt.therapist.firstName || ''} ${appt.therapist.lastName || ''}`.trim() || appt.therapist.username : 'Provider';
            return (
              <div key={appt.id} onClick={() => showDetails(appt)} style={{ marginBottom: '12px', backgroundColor: colors[i % colors.length], borderLeft: `4px solid ${borders[i % borders.length]}`, borderRadius: '4px', padding: '10px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{appt.type || 'Session'} with {providerName}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{appt.startTime}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Click to view details • Status: {appt.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientCalendarPage;










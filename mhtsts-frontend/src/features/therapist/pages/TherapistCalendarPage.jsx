import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Video, User, Plus, Loader } from 'lucide-react';
import { appointmentApi } from '../../../api/appointmentApi';

const timeSlots = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM'];

const TherapistCalendarPage = () => {
  const [view, setView] = useState('Day');
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

  const colors = ['rgba(59,130,246,0.15)','rgba(16,185,129,0.15)','rgba(245,158,11,0.15)'];
  const borders = ['var(--primary-color)','#10B981','#F59E0B'];

  return (
    <div className="mc-page-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', display: 'flex' }}><CalendarDays size={24} /></div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Therapist Schedule</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Manage your daily timeline and upcoming sessions.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', overflow: 'hidden', padding: '2px' }}>
            {['Day','Week','Month'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '6px 16px', backgroundColor: view === v ? 'var(--bg-primary)' : 'transparent', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: view === v ? 600 : 500, color: view === v ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer' }}>{v}</button>
            ))}
          </div>
          <button onClick={() => toast.info('Please contact your administrator to block time slots.')} className="mc-btn mc-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-color)', border: 'none' }}>
            <Plus size={16} /> Block Time
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={prevDay} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', display: 'flex', cursor: 'pointer', color: 'var(--text-primary)' }}><ChevronLeft size={18} /></button>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{dateLabel}</h2>
          <button onClick={nextDay} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', display: 'flex', cursor: 'pointer', color: 'var(--text-primary)' }}><ChevronRight size={18} /></button>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'inline-block' }}></span> In-Person</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span> Telehealth</div>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', overflowY: 'auto', display: 'flex' }}>
        <div style={{ width: '80px', borderRight: '1px solid var(--border-primary)', padding: '20px 0', display: 'flex', flexDirection: 'column' }}>
          {timeSlots.map(time => (
            <div key={time} style={{ height: '80px', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-10px', right: '12px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{time}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '20px', position: 'relative', backgroundSize: '100% 80px', backgroundImage: 'linear-gradient(to bottom, var(--border-primary) 1px, transparent 1px)' }}>
          {loading && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}><Loader size={24} /></div>}
          {!loading && todayAppts.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <CalendarDays size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p>No appointments scheduled for this day.</p>
            </div>
          )}
          {todayAppts.map((appt, i) => {
            const clientName = appt.participants?.[0]?.client?.firstName ? `${appt.participants[0].client.firstName} ${appt.participants[0].client.lastName || ''}`.trim() : (appt.participants?.[0]?.client?.username || 'Client');
            return (
              <div key={appt.id} style={{ marginBottom: '12px', backgroundColor: colors[i % colors.length], borderLeft: `4px solid ${borders[i % borders.length]}`, borderRadius: '4px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{appt.type || 'Session'} - {clientName}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{appt.startTime}</span>
                </div>
                {appt.telehealth && (
                  <div style={{ marginTop: '4px' }}>
                    <button onClick={() => toast.info('Telehealth link will be provided by your administrator.')} style={{ padding: '4px 10px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Video size={11} /> Join Call
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TherapistCalendarPage;






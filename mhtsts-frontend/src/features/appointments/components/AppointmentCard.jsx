import React from 'react';
import { Link } from 'react-router-dom';
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const AppointmentCard = ({ appointment }) => {
  const isTelehealth = appointment.modality === 'Telehealth';
  const isCompleted = appointment.status === 'COMPLETED';

  // Parse time for AM/PM format
  const [hourStr, minuteStr] = appointment.startTime.split(':');
  let hour = parseInt(hourStr);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  const timeFormatted = `${hour}:${minuteStr} ${ampm}`;

  return (
    <div className={`mc-card ${isCompleted ? 'mc-card-muted' : ''}`} style={{ marginBottom: 'var(--space-3)' }}>
      <div className="mc-card-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: 70, height: 70, borderRadius: 'var(--radius-lg)', 
            background: isCompleted ? 'var(--bg-tertiary)' : 'var(--color-primary-100)',
            color: isCompleted ? 'var(--text-secondary)' : 'var(--color-primary)'
          }}>
            <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>{hour}</span>
            <span style={{ fontSize: 'var(--font-size-xs)' }}>{minuteStr} {ampm}</span>
          </div>

          <div>
            <h4 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)', fontSize: 'var(--font-size-lg)' }}>
              {appointment.client?.firstName} {appointment.client?.lastName}
            </h4>
            <div style={{ display: 'flex', gap: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              <span>{appointment.duration} min • {appointment.sessionType}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {isTelehealth ? <VideoCameraFrontOutlinedIcon fontSize="inherit" /> : <LocationOnOutlinedIcon fontSize="inherit" />}
                {appointment.modality}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {isCompleted ? (
            <span className="mc-badge mc-badge-success">
              <CheckCircleOutlinedIcon fontSize="small" style={{ marginRight: 4 }} /> Completed
            </span>
          ) : isTelehealth ? (
            <Link to={`/telehealth/${appointment.id}`} className="mc-btn mc-btn-primary mc-btn-sm">
              <VideoCameraFrontOutlinedIcon style={{ fontSize: 18 }} /> Join Call
            </Link>
          ) : (
            <span className="mc-badge mc-badge-active">Scheduled</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;

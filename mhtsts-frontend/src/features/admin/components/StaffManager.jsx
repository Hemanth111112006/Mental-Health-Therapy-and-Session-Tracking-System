import { toast } from '../../../utils/toast';
import React, { useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import StarRateIcon from '@mui/icons-material/StarRate';
import jsPDF from 'jspdf';

const StaffManager = ({ role, title, description }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [showViewModal, setShowViewModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);

  // Realistic clinical staff database matching MHTSTS canonical accounts
  const allStaffData = {
    THERAPIST: [
      { id: 'TH-201', name: 'Dr. Sarah Chen', degree: 'LCSW', email: 'therapist@mindcare.com', phone: '+1 (555) 021-9874', status: 'ACTIVE', caseload: 24, specialties: 'CBT, DBT, PTSD, Mindfulness', state: 'California', lic: 'LCSW-89760' },
      { id: 'TH-202', name: 'Sarah Jenkins', degree: 'LCSW', email: 'sjenkins@mindcare.com', phone: '+1 (555) 012-4523', status: 'ACTIVE', caseload: 18, specialties: 'CBT, Trauma, EMDR', state: 'California', lic: 'LCSW-90124' },
      { id: 'TH-203', name: 'Robert Davis', degree: 'LMFT', email: 'rdavis@mindcare.com', phone: '+1 (555) 014-9988', status: 'ACTIVE', caseload: 12, specialties: 'Family Systems, Marriage', state: 'Oregon', lic: 'LMFT-87243' },
      { id: 'TH-204', name: 'Dr. David Vance', degree: 'LCSW, PhD', email: 'dvance@mindcare.com', phone: '+1 (555) 018-7711', status: 'ON_LEAVE', caseload: 0, specialties: 'CBT, Mood Disorders', state: 'California', lic: 'LCSW-88120' }
    ],
    PSYCHOLOGIST: [
      { id: 'PS-301', name: 'Dr. Maya Patel', degree: 'PsyD, Clinical Psychologist', email: 'psychologist@mindcare.com', phone: '+1 (555) 034-7128', status: 'ACTIVE', caseload: 19, specialties: 'Psych Testing, Diagnostics, MMPI-3', state: 'California', lic: 'PSY-90812' },
      { id: 'PS-302', name: 'Dr. Kevin Hart', degree: 'PsyD', email: 'khart@mindcare.com', phone: '+1 (555) 025-1122', status: 'ACTIVE', caseload: 8, specialties: 'Neuropsychology, ADHD, PCL-5', state: 'New York', lic: 'PSY-89012' }
    ],
    PSYCHIATRIST: [
      { id: 'MD-401', name: 'Dr. Mark Rivera', degree: 'MD, Board Certified Psychiatrist', email: 'psychiatrist@mindcare.com', phone: '+1 (555) 045-8291', status: 'ACTIVE', caseload: 31, specialties: 'Psychopharmacology, Bipolar, MDD', state: 'California', lic: 'MD-98762' },
      { id: 'MD-402', name: 'Dr. Arthur Pendelton', degree: 'MD', email: 'apendelton@mindcare.com', phone: '+1 (555) 026-8899', status: 'ACTIVE', caseload: 19, specialties: 'Child & Adolescent Medication', state: 'California', lic: 'MD-99120' }
    ],
    SUPERVISOR: [
      { id: 'SV-501', name: 'Dr. Kevin Torres', degree: 'MD, Clinical Director & Supervisor', email: 'supervisor@mindcare.com', phone: '+1 (555) 056-9302', status: 'ACTIVE', caseload: 8, specialties: 'Clinical Practice Supervision, Co-Signature', state: 'California', lic: 'MD-78901' },
      { id: 'SV-502', name: 'Dr. Evelyn Carter', degree: 'LCSW, Supervisor', email: 'ecarter@mindcare.com', phone: '+1 (555) 036-9900', status: 'ACTIVE', caseload: 5, specialties: 'Ethics, Intern Training', state: 'California', lic: 'LCSW-87123' }
    ],
    CASE_MANAGER: [
      { id: 'CM-601', name: 'Marcus Vance', degree: 'MSW, Lead Case Manager', email: 'case_manager@mindcare.com', phone: '+1 (555) 067-1453', status: 'ACTIVE', caseload: 17, specialties: 'Community Resources, Crisis Placement', state: 'California', lic: 'MSW-10081' },
      { id: 'CM-602', name: 'Melanie Cruz', degree: 'BSW', email: 'mcruz@mindcare.com', phone: '+1 (555) 043-5566', status: 'ACTIVE', caseload: 14, specialties: 'Rehabilitation Programs', state: 'California', lic: 'CM-10290' }
    ],
    RECEPTIONIST: [
      { id: 'RC-701', name: 'Jennifer Adams', degree: 'Lead Intake Specialist', email: 'receptionist@mindcare.com', phone: '+1 (555) 078-2564', status: 'ACTIVE', caseload: 0, specialties: 'Scheduling, Copay Collections, Intake', state: 'California', lic: 'N/A' },
      { id: 'RC-702', name: 'Clara Oswald', degree: 'Registration Desk Specialist', email: 'coswald@mindcare.com', phone: '+1 (555) 053-4455', status: 'ACTIVE', caseload: 0, specialties: 'Patient Check-in, Insurance Intake', state: 'California', lic: 'N/A' }
    ]
  };

  const staff = allStaffData[role] || [];

  const getInitials = (fullName) => {
    if (!fullName) return 'ST';
    const clean = fullName.replace(/^Dr\.\s*/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const handleDeactivate = (id) => {
    toast.success(`Staff member ${id} status toggled.`);
  };

  const handleExportCSV = () => {
    const headers = ['Staff ID', 'Full Name', 'Email', 'Phone', 'License', 'Credentials', 'Specialties', 'Caseload', 'State', 'Status'];
    const rows = filteredStaff.map(s => [
      s.id, `"${s.name}"`, s.email, s.phone, s.lic, `"${s.degree}"`,
      `"${s.specialties}"`, s.caseload, s.state, s.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MindCare_${role}_Staff_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Staff roster exported to CSV.');
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      doc.setFillColor(67, 56, 202);
      doc.rect(0, 0, 297, 22, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Mental Health Therapy System', 15, 11);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${title.toUpperCase()} · CLINICAL REGISTRY & PRACTICE CREDENTIALS AUDIT`, 15, 17);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 15, 32);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`${description} | Total Records: ${filteredStaff.length} | Generated: ${new Date().toLocaleString()}`, 15, 38);

      let currentY = 46;
      doc.setFillColor(30, 41, 59);
      doc.rect(15, currentY, 267, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Staff ID', 18, currentY + 5.5);
      doc.text('Practitioner Name', 40, currentY + 5.5);
      doc.text('License & Credentials', 95, currentY + 5.5);
      doc.text('Specialties', 150, currentY + 5.5);
      doc.text('Caseload', 215, currentY + 5.5);
      doc.text('Jurisdiction', 240, currentY + 5.5);
      doc.text('Status', 265, currentY + 5.5);
      currentY += 8;

      filteredStaff.forEach((s, index) => {
        if (currentY > 185) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
        doc.rect(15, currentY, 267, 8, 'F');
        doc.setDrawColor(241, 245, 249);
        doc.line(15, currentY + 8, 282, currentY + 8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        doc.text(s.id, 18, currentY + 5.5);
        doc.text(`${s.name} (${s.email})`, 40, currentY + 5.5);
        doc.text(s.lic !== 'N/A' ? `${s.lic} (${s.degree})` : s.degree, 95, currentY + 5.5);
        doc.text(s.specialties, 150, currentY + 5.5);
        doc.text(s.caseload > 0 ? `${s.caseload} active` : 'N/A', 215, currentY + 5.5);
        doc.text(s.state, 240, currentY + 5.5);
        doc.text(s.status, 265, currentY + 5.5);
        currentY += 8;
      });

      const fileName = `MindCare_${role}_Directory_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      toast.success(`Downloaded ${fileName} in Chrome.`);
    } catch (err) {
      toast.error('Failed to export PDF.');
    }
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.specialties.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? s.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      
      {/* Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ fontSize: 24, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>
            {title}
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            {description}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mc-card" style={{ marginBottom: 16, padding: 16, borderRadius: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1 }}>
            
            {/* Search */}
            <div style={{ position: 'relative', width: 240 }}>
              <SearchOutlinedIcon style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: 18 }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search staff, specialties..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 34, height: 36, fontSize: 12 }}
              />
            </div>

            {/* Status Select */}
            <div>
              <select 
                className="form-select" 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ height: 36, fontSize: 12, width: 140 }}
              >
                <option value="">Filter by Status</option>
                <option value="ACTIVE">Active Staff</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>

            <button className="mc-btn mc-btn-outline" style={{ padding: '0 10px', height: 36 }} onClick={() => { setSearchTerm(''); setStatusFilter(''); }} title="Clear Filters">
              <RefreshOutlinedIcon style={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Export tools */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mc-btn mc-btn-outline" style={{ fontSize: 11, padding: '0 10px', height: 36, display: 'flex', alignItems: 'center', gap: 4 }} onClick={handleExportPDF}>
              <PictureAsPdfOutlinedIcon style={{ fontSize: 14, color: 'red' }} /> Export PDF
            </button>
            <button className="mc-btn mc-btn-outline" style={{ fontSize: 11, padding: '0 10px', height: 36, display: 'flex', alignItems: 'center', gap: 4 }} onClick={handleExportCSV}>
              <CloudDownloadOutlinedIcon style={{ fontSize: 14, color: 'green' }} /> Export Excel
            </button>
            <button className="mc-btn mc-btn-outline" style={{ fontSize: 11, padding: '0 10px', height: 36, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => window.print()}>
              <PrintOutlinedIcon style={{ fontSize: 14 }} /> Print Listing
            </button>
          </div>

        </div>
      </div>

      {/* Staff Table */}
      <div className="mc-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="mc-table" style={{ width: '100%', minWidth: 980 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', fontSize: 11 }}>
                <th>Staff ID</th>
                <th>Profile</th>
                <th>Full Name</th>
                <th>License / Credentials</th>
                <th>Specialty Modalities</th>
                <th style={{ textAlign: 'center' }}>Caseload Size</th>
                <th>Licensing Jurisdiction</th>
                <th>System Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(s => (
                <tr key={s.id} style={{ fontSize: 12 }}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-tertiary)' }}>{s.id}</td>
                  <td>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: '#EEF2FF',
                      color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700
                    }}>
                      {getInitials(s.name)}
                    </div>
                  </td>
                  <td>
                    <strong>{s.name}</strong>
                    <span style={{ display: 'block', fontSize: 10, color: 'var(--text-secondary)' }}>{s.email}</span>
                  </td>
                  <td>
                    <code style={{ background: '#F2F4F7', padding: '2px 6px', borderRadius: 4, fontSize: 10, color: '#344054' }}>
                      {s.lic !== 'N/A' ? `${s.lic} (${s.degree})` : s.degree}
                    </code>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{s.specialties}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#4338CA' }}>{s.caseload > 0 ? `${s.caseload} active` : 'N/A'}</td>
                  <td>{s.state}</td>
                  <td>
                    <span className={`mc-badge mc-badge-${s.status === 'ACTIVE' ? 'success' : 'warning'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                      <button className="mc-btn mc-btn-ghost mc-btn-sm" style={{ fontSize: 10 }} onClick={() => setShowViewModal(s)}>View</button>
                      <button className="mc-btn mc-btn-ghost mc-btn-sm" style={{ fontSize: 10 }} onClick={() => setShowEditModal(s)}>Edit</button>
                      <button className="mc-btn mc-btn-ghost mc-btn-sm" style={{ fontSize: 10, color: 'var(--color-danger)' }} onClick={() => handleDeactivate(s.id)}>Disable</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border-primary)', fontSize: 11, color: 'var(--text-secondary)' }}>
          <span>Showing 1 - {filteredStaff.length} of {filteredStaff.length} practitioners</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="mc-btn mc-btn-outline mc-btn-sm" disabled style={{ padding: '2px 8px' }}>Prev</button>
            <button className="mc-btn mc-btn-outline mc-btn-sm" disabled style={{ padding: '2px 8px' }}>Next</button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 420, padding: 24, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Staff Verification Credentials</h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setShowViewModal(null)} style={{ fontSize: 20, padding: 4 }}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
              <div><strong>Name:</strong> {showViewModal.name}</div>
              <div><strong>System ID:</strong> {showViewModal.id}</div>
              <div><strong>Credential Type:</strong> {showViewModal.degree}</div>
              {showViewModal.lic !== 'N/A' && (
                <>
                  <div><strong>License Index:</strong> {showViewModal.lic}</div>
                  <div><strong>State Authority:</strong> {showViewModal.state}</div>
                </>
              )}
              <div><strong>Caseload Size:</strong> {showViewModal.caseload} clients assigned</div>
              <div><strong>Clinical Specialties:</strong> {showViewModal.specialties}</div>
              <div><strong>Contact Email:</strong> {showViewModal.email}</div>
              <div><strong>Contact Phone:</strong> {showViewModal.phone}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="mc-btn mc-btn-primary" onClick={() => setShowViewModal(null)} style={{ fontSize: 12 }}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 420, padding: 24, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Modify Practitioner Parameters</h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setShowEditModal(null)} style={{ fontSize: 20, padding: 4 }}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Caseload Assignment Count</label>
                <input type="number" className="form-control" defaultValue={showEditModal.caseload} style={{ height: 36, fontSize: 12 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Clinical Modalities</label>
                <input type="text" className="form-control" defaultValue={showEditModal.specialties} style={{ height: 36, fontSize: 12 }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
              <button className="mc-btn mc-btn-outline" onClick={() => setShowEditModal(null)} style={{ fontSize: 12 }}>Cancel</button>
              <button className="mc-btn mc-btn-primary" onClick={() => { setShowEditModal(null); toast.success('Practitioner details updated successfully.'); }} style={{ fontSize: 12 }}>Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffManager;





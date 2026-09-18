import React, { useState, useEffect } from 'react';
import {
  MapPinned, Search, Phone, Globe, ExternalLink, Building,
  Heart, Home, Briefcase, GraduationCap, ShieldCheck, Users,
  Star, MapPin, Clock, Filter, Plus, Send, Check, Copy, UserCheck
} from 'lucide-react';
import { clientApi } from '../../../api/clientApi';
import { toast } from '../../../utils/toast';

const MOCK_RESOURCES = [
  {
    id: 1, name: 'Metro Community Health Center', category: 'Healthcare',
    address: '1234 Main St, Suite 200, Anytown, ST 12345',
    phone: '(555) 123-4567', website: 'www.metrochc.org',
    services: ['Primary Care', 'Behavioral Health', 'Dental', 'Pharmacy'],
    hours: 'Mon-Fri 8AM-6PM, Sat 9AM-1PM', rating: 4.5,
    description: 'Full-service community health center providing integrated primary and behavioral health care.',
    acceptsInsurance: true, slidingScale: true,
  },
  {
    id: 2, name: 'Safe Haven Housing Services', category: 'Housing',
    address: '567 Oak Avenue, Anytown, ST 12345',
    phone: '(555) 234-5678', website: 'www.safehavenhousing.org',
    services: ['Emergency Shelter', 'Transitional Housing', 'Rapid Rehousing', 'Case Management'],
    hours: '24/7 Crisis Line', rating: 4.2,
    description: 'Emergency and transitional housing for individuals and families experiencing homelessness.',
    acceptsInsurance: false, slidingScale: false,
  },
  {
    id: 3, name: 'Workforce Development Center', category: 'Employment',
    address: '890 Commerce Blvd, Anytown, ST 12345',
    phone: '(555) 345-6789', website: 'www.workforcedev.org',
    services: ['Job Training', 'Resume Building', 'Interview Prep', 'Job Placement'],
    hours: 'Mon-Fri 9AM-5PM', rating: 4.0,
    description: 'Vocational rehabilitation and employment services for individuals with barriers to employment.',
    acceptsInsurance: false, slidingScale: false,
  },
  {
    id: 4, name: 'Recovery Solutions Network', category: 'Substance Abuse',
    address: '321 Wellness Way, Anytown, ST 12345',
    phone: '(555) 456-7890', website: 'www.recoverysolutions.org',
    services: ['Outpatient Treatment', 'Group Therapy', 'MAT Program', 'Peer Support'],
    hours: 'Mon-Sat 7AM-9PM', rating: 4.7,
    description: 'Comprehensive substance use disorder treatment including medication-assisted treatment (MAT).',
    acceptsInsurance: true, slidingScale: true,
  },
  {
    id: 5, name: 'Family Support Alliance', category: 'Family Services',
    address: '456 Family Circle, Anytown, ST 12345',
    phone: '(555) 567-8901', website: 'www.familysupport.org',
    services: ['Parenting Classes', 'Family Counseling', 'Child Care Assistance', 'Food Pantry'],
    hours: 'Mon-Fri 8:30AM-5:30PM', rating: 4.3,
    description: 'Comprehensive family support services including parenting education and basic needs assistance.',
    acceptsInsurance: false, slidingScale: true,
  },
  {
    id: 6, name: 'Legal Aid Society', category: 'Legal',
    address: '789 Justice Lane, Anytown, ST 12345',
    phone: '(555) 678-9012', website: 'www.legalaid.org',
    services: ['Civil Legal Aid', 'Immigration', 'Housing Rights', 'Benefits Appeals'],
    hours: 'Mon-Fri 9AM-4PM', rating: 4.1,
    description: 'Free legal services for low-income individuals covering housing, immigration, and benefits issues.',
    acceptsInsurance: false, slidingScale: false,
  },
];

const categoryIcons = {
  'Healthcare': <Heart size={16} />,
  'Housing': <Home size={16} />,
  'Employment': <Briefcase size={16} />,
  'Substance Abuse': <ShieldCheck size={16} />,
  'Family Services': <Users size={16} />,
  'Legal': <GraduationCap size={16} />,
  'Education': <GraduationCap size={16} />,
};

const categoryColors = {
  'Healthcare': '#10b981',
  'Housing': '#3b82f6',
  'Employment': '#f59e0b',
  'Substance Abuse': '#8b5cf6',
  'Family Services': '#ec4899',
  'Legal': '#6366f1',
  'Education': '#06b6d4',
};

const CommunityResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);
  const [referralModalResource, setReferralModalResource] = useState(null);
  const [clients, setClients] = useState([]);

  // Referral form state
  const [selectedClient, setSelectedClient] = useState('');
  const [referralReason, setReferralReason] = useState('');
  const [referralPriority, setReferralPriority] = useState('Normal');
  const [referralFollowUpDate, setReferralFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [referralNotes, setReferralNotes] = useState('');

  // Load clients
  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientList = await clientApi.getAllClients();
        setClients(clientList || []);
        if (clientList && clientList.length > 0) {
          const first = clientList[0];
          setSelectedClient(JSON.stringify({
            name: `${first.firstName} ${first.lastName}`.trim(),
            id: first.clientNumber || `CLT-${first.id}`
          }));
        }
      } catch (e) {
        console.warn('Error loading clients for community referral:', e);
      }
    };
    loadClients();
  }, []);

  const categories = ['All', ...new Set(MOCK_RESOURCES.map(r => r.category))];

  const filtered = MOCK_RESOURCES.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.services.some(s => s.toLowerCase().includes(q));
    const matchCat = categoryFilter === 'All' || r.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleOpenReferralModal = (resource, e) => {
    if (e) e.stopPropagation();
    setReferralModalResource(resource);
    setReferralReason(`Linkage to ${resource.name} for ${resource.services.slice(0, 2).join(' and ')}`);
  };

  const handleSaveReferral = (e) => {
    e.preventDefault();
    if (!referralModalResource) return;
    if (!selectedClient) {
      toast.error('Please select a client to refer');
      return;
    }
    if (!referralReason.trim()) {
      toast.error('Please provide a reason for referral');
      return;
    }

    let clientData = { name: 'Taylor Morgan', id: 'CLT-1089' };
    try {
      clientData = JSON.parse(selectedClient);
    } catch (err) {
      clientData = { name: selectedClient, id: `CLT-${Math.floor(Math.random() * 8000 + 1000)}` };
    }

    // Read existing referrals from localStorage
    let existingReferrals = [];
    try {
      const saved = localStorage.getItem('mindcare_referrals');
      if (saved) existingReferrals = JSON.parse(saved);
    } catch (err) {}

    const nextIdNum = existingReferrals.length + 1;
    const newRef = {
      id: `REF-${String(nextIdNum).padStart(3, '0')}`,
      clientName: clientData.name,
      clientId: clientData.id,
      referralDate: new Date().toISOString().split('T')[0],
      type: 'External',
      direction: 'Outgoing',
      referredTo: referralModalResource.name,
      referredFrom: 'Case Management Desk',
      reason: referralReason.trim(),
      status: 'Pending',
      priority: referralPriority,
      followUpDate: referralFollowUpDate || null,
      notes: referralNotes.trim()
    };

    existingReferrals.unshift(newRef);
    try {
      localStorage.setItem('mindcare_referrals', JSON.stringify(existingReferrals));
    } catch (err) {}

    toast.success(`Referral created for ${clientData.name} to ${referralModalResource.name}`);
    setReferralModalResource(null);
    setReferralNotes('');
  };

  const handleCopyContact = (resource, e) => {
    if (e) e.stopPropagation();
    const text = `${resource.name}\nAddress: ${resource.address}\nPhone: ${resource.phone}\nWebsite: https://${resource.website}`;
    navigator.clipboard.writeText(text);
    toast.success('Resource contact information copied to clipboard');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Case Management</span><span style={{ opacity: 0.4 }}>›</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Community Resources</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPinned size={24} style={{ color: '#3b82f6' }} /> Community Resources Directory
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Verified external community health, housing, legal, and social service providers for client referral linkages
          </p>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {categories.map(cat => {
          const isActive = categoryFilter === cat;
          const count = cat === 'All' ? MOCK_RESOURCES.length : MOCK_RESOURCES.filter(r => r.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'var(--btn-primary-bg, #2563eb)' : 'var(--bg-secondary)',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{cat}</span>
              <span style={{
                fontSize: '10px',
                background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)',
                padding: '1px 6px',
                borderRadius: '10px'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="mc-card" style={{ padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search resources by organization name, description, or service keywords..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)', outline: 'none' }} 
          />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Showing {filtered.length} of {MOCK_RESOURCES.length} organizations
        </div>
      </div>

      {/* Resources Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filtered.map(r => {
          const catColor = categoryColors[r.category] || '#6b7280';
          return (
            <div 
              key={r.id} 
              className="mc-card" 
              onClick={() => setSelectedResource(r)}
              style={{ 
                padding: '20px', borderRadius: '14px', background: 'var(--card-bg)', 
                border: '1px solid var(--border-primary)', transition: 'box-shadow 0.2s, transform 0.2s', 
                cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' 
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${catColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: catColor }}>
                      {categoryIcons[r.category]}
                    </div>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, background: `${catColor}18`, color: catColor }}>
                      {r.category}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontSize: '11px', fontWeight: 600 }}>
                    <Star size={12} fill="#f59e0b" /> {r.rating}
                  </div>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {r.name}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                  {r.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} /> {r.address}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} /> {r.phone}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} /> {r.hours}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={12} /> 
                    <a 
                      href={`https://${r.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      {r.website} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                  {r.services.map(s => (
                    <span key={s} style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', fontSize: '10px', marginBottom: '16px' }}>
                  {r.acceptsInsurance && <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 600 }}>✓ Insurance</span>}
                  {r.slidingScale && <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 600 }}>✓ Sliding Scale</span>}
                </div>
              </div>

              {/* Card Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-primary)', paddingTop: '12px' }}>
                <button
                  type="button"
                  className="mc-btn mc-btn-primary"
                  onClick={(e) => handleOpenReferralModal(r, e)}
                  style={{ flex: 1, fontSize: '11px', padding: '7px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  <Send size={12} /> Refer Client
                </button>
                <button
                  type="button"
                  className="mc-btn mc-btn-outline"
                  onClick={(e) => handleCopyContact(r, e)}
                  title="Copy Contact Information"
                  style={{ padding: '7px 10px', fontSize: '11px' }}
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL: Resource Details ── */}
      {selectedResource && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', borderRadius: '16px', backgroundColor: 'var(--bg-card, #FFFFFF)', border: '1px solid var(--border-primary)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '12px' }}>
              <div>
                <span style={{ 
                  padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, 
                  background: `${categoryColors[selectedResource.category]}18`, 
                  color: categoryColors[selectedResource.category] 
                }}>
                  {selectedResource.category}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '6px 0 0', color: 'var(--text-primary)' }}>
                  {selectedResource.name}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedResource(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px', fontSize: '12px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Overview</span>
                <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.6 }}>{selectedResource.description}</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: '10px', display: 'grid', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <MapPin size={14} style={{ color: '#3b82f6', flexShrink: 0 }} /> {selectedResource.address}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <Phone size={14} style={{ color: '#10b981', flexShrink: 0 }} /> {selectedResource.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <Clock size={14} style={{ color: '#f59e0b', flexShrink: 0 }} /> {selectedResource.hours}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={14} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                  <a href={`https://${selectedResource.website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {selectedResource.website} <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Services Provided</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedResource.services.map(s => (
                    <span key={s} style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600 }}>
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-primary)' }}>
                <button
                  type="button"
                  className="mc-btn mc-btn-outline"
                  onClick={() => handleCopyContact(selectedResource)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}
                >
                  <Copy size={13} /> Copy Contact Info
                </button>
                <button
                  type="button"
                  className="mc-btn mc-btn-primary"
                  onClick={() => {
                    const r = selectedResource;
                    setSelectedResource(null);
                    handleOpenReferralModal(r);
                  }}
                  style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}
                >
                  <Send size={13} /> Refer Client Here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Direct Referral to Resource ── */}
      {referralModalResource && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', borderRadius: '16px', backgroundColor: 'var(--bg-card, #FFFFFF)', border: '1px solid var(--border-primary)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Refer Client to Organization
                </h2>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  Target Provider: <strong style={{ color: 'var(--text-primary)' }}>{referralModalResource.name}</strong>
                </p>
              </div>
              <button 
                onClick={() => setReferralModalResource(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReferral} style={{ display: 'grid', gap: '14px', fontSize: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  Select Client <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select 
                  className="mc-input"
                  value={selectedClient}
                  onChange={e => setSelectedClient(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  {clients.length > 0 ? (
                    clients.map(c => {
                      const name = `${c.firstName} ${c.lastName}`.trim();
                      const code = c.clientNumber || `CLT-${c.id}`;
                      const val = JSON.stringify({ name, id: code });
                      return (
                        <option key={c.id} value={val}>
                          {name} ({code})
                        </option>
                      );
                    })
                  ) : (
                    <>
                      <option value={JSON.stringify({ name: 'Taylor Morgan', id: 'CLT-1089' })}>Taylor Morgan (CLT-1089)</option>
                      <option value={JSON.stringify({ name: 'Sarah Mitchell', id: 'CLT-1042' })}>Sarah Mitchell (CLT-1042)</option>
                      <option value={JSON.stringify({ name: 'James Rodriguez', id: 'CLT-1078' })}>James Rodriguez (CLT-1078)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  Referral Objective / Reason <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea 
                  rows={3}
                  value={referralReason}
                  onChange={e => setReferralReason(e.target.value)}
                  required
                  placeholder="State client need and required services..."
                  style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    Priority
                  </label>
                  <select 
                    value={referralPriority}
                    onChange={e => setReferralPriority(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    Follow-up Due
                  </label>
                  <input 
                    type="date"
                    value={referralFollowUpDate}
                    onChange={e => setReferralFollowUpDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  Additional Notes (Optional)
                </label>
                <textarea 
                  rows={2}
                  value={referralNotes}
                  onChange={e => setReferralNotes(e.target.value)}
                  placeholder="Specific coordinator contact, client constraints..."
                  style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-primary)' }}>
                <button 
                  type="button" 
                  onClick={() => setReferralModalResource(null)}
                  style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="mc-btn mc-btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                >
                  <Send size={13} /> Submit Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityResourcesPage;

import React, { useState, useMemo } from 'react';
import {
  WalletCards, Search, Filter, Download, Printer, RefreshCcw,
  CreditCard, DollarSign, CheckCircle2, Clock, AlertCircle,
  Eye, MoreVertical, ArrowUpDown, Receipt, Banknote,
  TrendingUp, XCircle, X, Plus
} from 'lucide-react';

const INITIAL_PAYMENTS = [
  {
    id: 'PAY-2026-001', clientName: 'Jordan Taylor', clientId: 'CLN-A3A86311',
    date: '2026-09-10', amount: '$25.00', method: 'Credit Card',
    cardLast4: '1188', type: 'Co-pay', status: 'Completed',
    provider: 'Dr. Emily Chen, PsyD', service: 'CBT Psychotherapy (45 min)',
    insurance: 'Blue Cross Blue Shield', reference: 'TXN-994012',
  },
  {
    id: 'PAY-2026-002', clientName: 'Alex Rivers', clientId: 'CLN-62E695F3',
    date: '2026-09-10', amount: '$25.00', method: 'Mastercard',
    cardLast4: '5541', type: 'Co-pay', status: 'Completed',
    provider: 'Dr. Sarah Chen, LCSW', service: 'Individual Psychotherapy (45 min)',
    insurance: 'Aetna Health', reference: 'TXN-994045',
  },
  {
    id: 'PAY-2026-003', clientName: 'Taylor Morgan', clientId: 'CLN-3CD50763',
    date: '2026-09-09', amount: '$30.00', method: 'Visa',
    cardLast4: '4242', type: 'Co-pay', status: 'Completed',
    provider: 'Dr. Sarah Chen, LCSW', service: 'Individual Psychotherapy (60 min)',
    insurance: 'United Healthcare', reference: 'TXN-993882',
  },
  {
    id: 'PAY-2026-004', clientName: 'Casey Harper', clientId: 'CLN-9ABFFDAC',
    date: '2026-09-08', amount: '$30.00', method: 'HSA Card',
    cardLast4: '7741', type: 'Co-pay', status: 'Completed',
    provider: 'Dr. James Rodriguez, LMFT', service: 'Family Psychotherapy (50 min)',
    insurance: 'Cigna Health', reference: 'TXN-993710',
  },
  {
    id: 'PAY-2026-005', clientName: 'Jordan Taylor', clientId: 'CLN-A3A86311',
    date: '2026-09-01', amount: '$40.00', method: 'Debit Card',
    cardLast4: '9043', type: 'Co-pay', status: 'Completed',
    provider: 'Dr. Michael Thompson, MD', service: 'Psychiatric Diagnostic Eval',
    insurance: 'Blue Cross Blue Shield', reference: 'TXN-992501',
  },
  {
    id: 'PAY-2026-006', clientName: 'Alex Rivers', clientId: 'CLN-62E695F3',
    date: '2026-08-28', amount: '$150.00', method: 'Insurance',
    cardLast4: null, type: 'Insurance Claim', status: 'Pending',
    provider: 'Dr. Sarah Chen, LCSW', service: 'Individual Psychotherapy (60 min)',
    insurance: 'Aetna Health', reference: 'CLM-883910',
  }
];

const statusConfig = {
  'Completed': { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'Pending': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'Refunded': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  'Denied': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  'Failed': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const PaymentsPage = () => {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  
  // Modals
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // New payment form
  const [newPay, setNewPay] = useState({
    clientName: 'Jordan Taylor',
    clientId: 'CLN-A3A86311',
    amount: '25.00',
    method: 'Credit Card',
    type: 'Co-pay',
    service: 'Individual Psychotherapy (45 min)',
    provider: 'Dr. Sarah Chen, LCSW',
    cardLast4: '4242',
    insurance: 'Blue Cross Blue Shield'
  });

  const stats = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0);
    const completed = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0);
    const pending = payments.filter(p => p.status === 'Pending').length;
    const refunded = payments.filter(p => p.status === 'Refunded').reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0);
    return {
      totalRevenue: `$${total.toFixed(2)}`,
      collected: `$${completed.toFixed(2)}`,
      pendingCount: pending,
      refundedAmount: `$${refunded.toFixed(2)}`,
    };
  }, [payments]);

  const filtered = useMemo(() => {
    return payments.filter(p => {
      const matchSearch = !searchTerm || p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.clientId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchMethod = methodFilter === 'All' || p.method === methodFilter;
      return matchSearch && matchStatus && matchMethod;
    });
  }, [payments, searchTerm, statusFilter, methodFilter]);

  const statCards = [
    { label: 'Total Revenue', value: stats.totalRevenue, icon: <DollarSign size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
    { label: 'Collected Today', value: stats.collected, icon: <CheckCircle2 size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
    { label: 'Pending Claims', value: stats.pendingCount, icon: <Clock size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
    { label: 'Refunded', value: stats.refundedAmount, icon: <XCircle size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
  ];

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    const newId = `PAY-2026-00${payments.length + 1}`;
    const newTxn = {
      id: newId,
      clientName: newPay.clientName,
      clientId: newPay.clientId,
      date: new Date().toISOString().split('T')[0],
      amount: `$${parseFloat(newPay.amount).toFixed(2)}`,
      method: newPay.method,
      cardLast4: newPay.method.includes('Card') ? (newPay.cardLast4 || '4242') : null,
      type: newPay.type,
      status: 'Completed',
      provider: newPay.provider,
      service: newPay.service,
      insurance: newPay.insurance,
      reference: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setPayments([newTxn, ...payments]);
    setShowRecordModal(false);
    setSelectedReceipt(newTxn);
  };

  const handleExportCSV = () => {
    const headers = 'Payment ID,Client,Client ID,Date,Amount,Method,Type,Status,Provider,Reference\n';
    const rows = payments.map(p => `"${p.id}","${p.clientName}","${p.clientId}","${p.date}","${p.amount}","${p.method}","${p.type}","${p.status}","${p.provider}","${p.reference}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MindCare_Payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Reception</span><span style={{ opacity: 0.4 }}>›</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Payments</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <WalletCards size={24} style={{ color: '#3b82f6' }} /> Payments &amp; Front Desk Collections
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Collect patient co-pays, print itemized receipts, and audit front-desk transactions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="mc-btn mc-btn-primary" onClick={() => setShowRecordModal(true)} style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CreditCard size={14} /> Record Payment
          </button>
          <button className="mc-btn mc-btn-ghost" onClick={handleExportCSV} style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Download size={14} /> Export CSV
          </button>
          <button className="mc-btn mc-btn-ghost" onClick={() => window.print()} style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {statCards.map((card, i) => (
          <div key={i} className="mc-card" style={{ padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{card.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="mc-card" style={{ padding: '14px 18px', borderRadius: '12px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search by client name, ID, or payment ref..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)', outline: 'none' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)' }}>
          <option value="All">All Statuses</option>
          {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}
          style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)' }}>
          <option value="All">All Methods</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Mastercard">Mastercard</option>
          <option value="Visa">Visa</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Cash">Cash</option>
          <option value="HSA Card">HSA Card</option>
          <option value="Insurance">Insurance</option>
        </select>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Showing {filtered.length} of {payments.length} payments
        </div>
      </div>

      {/* Payments Table */}
      <div className="mc-card" style={{ borderRadius: '12px', overflow: 'hidden', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                {['Payment ID', 'Client', 'Date', 'Service & Clinician', 'Amount', 'Method', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No payments match the current filters.</td></tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '11px' }}>{p.id}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.clientName}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{p.clientId}</div>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{p.date}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.service}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{p.provider}</div>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#10b981', fontSize: '13px' }}>{p.amount}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>
                      {p.method}{p.cardLast4 ? ` ···${p.cardLast4}` : ''}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '11px' }}>{p.type}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, color: statusConfig[p.status]?.color, background: statusConfig[p.status]?.bg }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          title="Print Receipt" 
                          className="mc-btn mc-btn-outline mc-btn-sm" 
                          onClick={() => setSelectedReceipt(p)}
                          style={{ padding: '4px 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          <Receipt size={12} /> Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showRecordModal && (
        <div className="mc-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: 480, borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-primary)' }}>
              <h3 className="mc-card-title" style={{ margin: 0, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard size={18} style={{ color: 'var(--color-primary)' }} /> Record Front-Desk Payment
              </h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setShowRecordModal(false)} style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRecordPaymentSubmit} style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Select Patient *</label>
                <select 
                  className="mc-form-select"
                  value={newPay.clientId}
                  onChange={e => {
                    const id = e.target.value;
                    const names = {
                      'CLN-A3A86311': 'Jordan Taylor',
                      'CLN-62E695F3': 'Alex Rivers',
                      'CLN-9ABFFDAC': 'Casey Harper',
                      'CLN-3CD50763': 'Taylor Morgan'
                    };
                    setNewPay({ ...newPay, clientId: id, clientName: names[id] || 'Patient' });
                  }}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}
                >
                  <option value="CLN-A3A86311">Jordan Taylor (CLN-A3A86311)</option>
                  <option value="CLN-62E695F3">Alex Rivers (CLN-62E695F3)</option>
                  <option value="CLN-9ABFFDAC">Casey Harper (CLN-9ABFFDAC)</option>
                  <option value="CLN-3CD50763">Taylor Morgan (CLN-3CD50763)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Amount ($) *</label>
                  <input 
                    type="number" step="0.01" required
                    value={newPay.amount}
                    onChange={e => setNewPay({ ...newPay, amount: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Payment Type</label>
                  <select 
                    value={newPay.type}
                    onChange={e => setNewPay({ ...newPay, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}
                  >
                    <option value="Co-pay">Co-pay</option>
                    <option value="Self-Pay">Self-Pay Full Fee</option>
                    <option value="Deductible">Deductible</option>
                    <option value="Balance">Outstanding Balance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Payment Method</label>
                  <select 
                    value={newPay.method}
                    onChange={e => setNewPay({ ...newPay, method: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="HSA Card">HSA / FSA Card</option>
                    <option value="Check">Check</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Card Last 4 Digits</label>
                  <input 
                    type="text" maxLength={4}
                    placeholder="e.g. 4242"
                    value={newPay.cardLast4}
                    onChange={e => setNewPay({ ...newPay, cardLast4: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Clinician / Provider</label>
                <select 
                  value={newPay.provider}
                  onChange={e => setNewPay({ ...newPay, provider: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}
                >
                  <option value="Dr. Sarah Chen, LCSW">Dr. Sarah Chen, LCSW</option>
                  <option value="Dr. Emily Chen, PsyD">Dr. Emily Chen, PsyD</option>
                  <option value="Dr. James Rodriguez, LMFT">Dr. James Rodriguez, LMFT</option>
                  <option value="Dr. Michael Thompson, MD">Dr. Michael Thompson, MD</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="mc-btn mc-btn-outline" onClick={() => setShowRecordModal(false)}>Cancel</button>
                <button type="submit" className="mc-btn mc-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={15} /> Collect &amp; Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Itemized Payment Receipt Modal */}
      {selectedReceipt && (
        <div className="mc-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: 500, borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-primary)' }}>
              <h3 className="mc-card-title" style={{ margin: 0, fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Receipt size={18} style={{ color: '#10b981' }} /> Official MindCare Payment Receipt
              </h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setSelectedReceipt(null)} style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px dashed var(--border-primary)' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)' }}>MindCare Clinic Network</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Front-Desk Patient Transaction Receipt</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8, color: '#10b981' }}>PAID IN FULL · {selectedReceipt.id}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Client Name:</span>
                  <span style={{ fontWeight: 600 }}>{selectedReceipt.clientName} ({selectedReceipt.clientId})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Date &amp; Time:</span>
                  <span style={{ fontWeight: 600 }}>{selectedReceipt.date} · 09:15 AM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Service Description:</span>
                  <span style={{ fontWeight: 600 }}>{selectedReceipt.service}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Provider:</span>
                  <span style={{ fontWeight: 600 }}>{selectedReceipt.provider}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Payment Type:</span>
                  <span style={{ fontWeight: 600 }}>{selectedReceipt.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Payment Method:</span>
                  <span>{selectedReceipt.method}{selectedReceipt.cardLast4 ? ` (···${selectedReceipt.cardLast4})` : ''}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Transaction Ref:</span>
                  <span style={{ fontFamily: 'monospace' }}>{selectedReceipt.reference}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-primary)', paddingTop: 10, fontSize: 16, fontWeight: 800 }}>
                  <span>Total Amount Paid:</span>
                  <span style={{ color: '#10b981' }}>{selectedReceipt.amount}</span>
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="mc-btn mc-btn-outline" onClick={() => setSelectedReceipt(null)}>Close</button>
                <button className="mc-btn mc-btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Printer size={14} /> Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;

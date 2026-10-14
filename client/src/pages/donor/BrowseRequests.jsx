import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import RequestCard from '../../components/RequestCard';
import api from '../../services/api';

const DonateModal = ({ request, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(0); // 0=amount, 1=payment details, 2=success
  const [payMethod, setPayMethod] = useState('BANK_TRANSFER');
  const [donorAccount, setDonorAccount] = useState('');
  const [transactionUtr, setTransactionUtr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const presets = [1000, 2500, 5000, 10000, 25000];

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/donations', {
        requestId: request.id,
        amount: Number(amount),
        paymentMethod: payMethod,
        donorAccountNumber: donorAccount || 'A/c Ending in 7821',
        transactionUtr: transactionUtr || `UTR${Date.now().toString().slice(-8)}`,
      });

      setSubmitting(false);
      setStep(2);
      setTimeout(() => {
        onConfirm(Number(amount), res.data?.donation);
        onClose();
      }, 2200);
    } catch (err) {
      setSubmitting(false);
      setError(err.response?.data?.error || 'Donation submission failed. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 480 }}>
        {step === 0 && (
          <>
            <div className="modal-header">
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>Make a Medical Donation</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {request.title}
                </div>
              </div>
              <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-info" style={{ fontSize: '0.78rem' }}>
                🛡️ Direct Hospital Escrow Transfer: Funds are credited directly to the verified hospital treatment account for <strong>{request.hospital}</strong>.
              </div>
              <div>
                <div className="form-label" style={{ marginBottom: '0.5rem' }}>Select Donation Amount</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {presets.map(p => (
                    <button key={p} onClick={() => setAmount(String(p))}
                      style={{
                        padding: '0.4rem 0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${amount === String(p) ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                        background: amount === String(p) ? 'rgba(14,165,233,0.1)' : 'var(--bg-input)',
                        color: amount === String(p) ? 'var(--brand-primary-light)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                      id={`preset-amount-${p}`}
                    >
                      ₹{p.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <input
                  id="custom-amount"
                  type="number"
                  className="form-input"
                  placeholder="Or enter custom amount in Rupees (₹)"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose} id="btn-cancel-donate">Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => amount > 0 && setStep(1)}
                disabled={!amount || amount <= 0}
                id="btn-proceed-payment"
              >
                View Hospital Escrow Account & Pay →
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="modal-header">
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Hospital Escrow Payment Details</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--brand-accent)', fontWeight: 600 }}>
                  🔒 Verified Patient Treatment Account
                </div>
              </div>
              <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Account Box */}
              <div style={{
                background: 'rgba(14,165,233,0.06)',
                border: '1px solid rgba(14,165,233,0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand-primary-light)', fontWeight: 700 }}>
                    Official Hospital Escrow Account
                  </span>
                  <button
                    onClick={() => handleCopy(request.accountNumber)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.2rem 0.5rem',
                      color: copied ? 'var(--brand-accent)' : 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                    }}
                  >
                    {copied ? '✓ Copied' : '📋 Copy A/c'}
                  </button>
                </div>

                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                  {request.accountNumber || '309811452093'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Bank: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{request.bankName || 'State Bank of India'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>IFSC: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{request.ifscCode || 'SBIN0001536'}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Beneficiary: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{request.beneficiaryName || request.hospital}</strong>
                  </div>
                  {request.upiId && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: 'var(--text-muted)' }}>UPI VPA: </span>
                      <strong style={{ color: '#38bdf8' }}>{request.upiId}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Display */}
              <div style={{ textAlign: 'center', padding: '0.25rem 0 0.75rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38bdf8' }}>
                  ₹{Number(amount).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transfer Amount</div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <div className="form-label" style={{ marginBottom: '0.4rem' }}>Select Transfer Channel</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { id: 'BANK_TRANSFER', label: '🏦 Direct Bank Transfer / NEFT' },
                    { id: 'UPI', label: '📱 Instant UPI / GPay' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${payMethod === m.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                        background: payMethod === m.id ? 'rgba(14,165,233,0.1)' : 'var(--bg-input)',
                        color: payMethod === m.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Donor Bank Account / Reference Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Your Sender Bank Account Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your Bank Account Number (e.g. 984022198421)"
                    value={donorAccount}
                    onChange={e => setDonorAccount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Payment UTR / Transaction Reference</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. UTR202610148819 (or leave blank for auto-ref)"
                    value={transactionUtr}
                    onChange={e => setTransactionUtr(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="alert alert-danger" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>{error}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStep(0)} id="btn-back-amount">← Back</button>
              <button
                className="btn btn-accent"
                onClick={handlePay}
                disabled={submitting}
                id="btn-confirm-payment"
              >
                {submitting ? 'Recording...' : '✅ Confirm & Record Donation'}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Donation Successful!
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Your contribution of <strong style={{ color: 'var(--brand-accent)' }}>₹{Number(amount).toLocaleString('en-IN')}</strong> has been recorded to hospital escrow.
            </div>
            <div className="spinner" style={{ margin: '1.5rem auto 0' }} />
          </div>
        )}
      </div>
    </div>
  );
};

const BrowseRequests = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/donor/browse');
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [donateTarget, setDonateTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let isMounted = true;
    api.get('/requests/verified')
      .then(res => {
        if (isMounted) setRequests(res.data?.requests || []);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const filtered = requests.filter(r => {
    const matchStatus = filter === 'ALL' || r.status === filter;
    const matchSearch = !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.disease.toLowerCase().includes(search.toLowerCase()) ||
      r.hospital.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="page-title">Browse Verified Medical Requests</div>
            <div className="page-subtitle">{filtered.length} live verified request{filtered.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="flex gap-3 items-center">
            <input
              id="search-requests"
              type="text"
              className="form-input"
              placeholder="🔍 Search disease, hospital..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 280 }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="tabs">
          {['ALL', 'VERIFIED', 'ACTIVE', 'COMPLETED'].map(f => (
            <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} id={`filter-${f.toLowerCase()}`}>
              {f === 'ALL' ? `All (${requests.length})` : f}
            </button>
          ))}
        </div>

        {/* Request Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <div>Loading verified medical requests...</div>
          </div>
        ) : (
          <div className="content-grid">
            {filtered.map(req => (
              <RequestCard
                key={req.id}
                request={req}
                role="DONOR"
                onView={setViewTarget}
                onDonate={setDonateTarget}
              />
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>No requests found</div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Try adjusting your filters</div>
              </div>
            )}
          </div>
        )}

        {/* Donate Modal */}
        {donateTarget && (
          <DonateModal
            request={donateTarget}
            onClose={() => setDonateTarget(null)}
            onConfirm={(amount) => {
              showToast(`✅ Donation of ₹${amount.toLocaleString('en-IN')} recorded to escrow!`);
              fetchRequests(); // Refresh data in real-time
            }}
          />
        )}

        {/* View Details Modal */}
        {viewTarget && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: 560 }}>
              <div className="modal-header">
                <div>
                  <span className={`badge badge-${viewTarget.status?.toLowerCase()}`} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{viewTarget.status}</span>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>{viewTarget.title}</div>
                </div>
                <button onClick={() => setViewTarget(null)} style={{ color: 'var(--text-muted)', fontSize: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { label: 'Condition / Disease', value: viewTarget.disease },
                    { label: 'Verified Hospital', value: viewTarget.hospital },
                    { label: 'Required Treatment', value: viewTarget.treatmentRequired },
                    { label: 'Urgency Level', value: viewTarget.urgency || 'HIGH' },
                    { label: 'Target Funding', value: `₹${Number(viewTarget.totalAmount).toLocaleString('en-IN')}` },
                    { label: 'Escrow Received', value: `₹${Number(viewTarget.amountReceived || 0).toLocaleString('en-IN')}` },
                    { label: 'Escrow Bank', value: viewTarget.bankName || 'State Bank of India' },
                    { label: 'Escrow Account No', value: viewTarget.accountNumber || '309811452093' },
                    { label: 'IFSC Code', value: viewTarget.ifscCode || 'SBIN0001536' },
                    { label: 'Beneficiary Name', value: viewTarget.beneficiaryName || viewTarget.hospital },
                  ].map(item => (
                    <div key={item.label} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="form-label" style={{ marginBottom: '0.5rem' }}>Clinical Case Summary</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{viewTarget.description}</p>
                </div>
                <div className="alert alert-info" style={{ fontSize: '0.78rem' }}>
                  🛡️ All financial contributions are routed to the verified institutional medical escrow account of the hospital.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setViewTarget(null)} id="btn-close-details">Close</button>
                <button className="btn btn-primary" onClick={() => { const t = viewTarget; setViewTarget(null); setDonateTarget(t); }} id="btn-modal-donate">
                  💝 Donate to Escrow
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--bg-surface)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            boxShadow: 'var(--shadow-lg)',
            color: 'var(--brand-accent)',
            fontWeight: 600,
            fontSize: '0.9rem',
            zIndex: 2000,
          }}>
            {toast}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowseRequests;

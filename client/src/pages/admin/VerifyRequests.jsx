import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { MOCK_REQUESTS } from '../../utils/mockData';

const VerifyRequests = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/admin/verify-requests');
  const [requestStatuses, setRequestStatuses] = useState({});
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionModal, setActionModal] = useState(null); // {type: 'approve'|'reject', request}
  const [toast, setToast] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const getStatus = (req) => requestStatuses[req.id] || req.status;

  const handleApprove = (req) => {
    setRequestStatuses(prev => ({ ...prev, [req.id]: 'VERIFIED' }));
    setActionModal(null);
    showToast(`✅ Request "${req.title.substring(0, 40)}..." approved and is now live for donors.`);
    setSelected(null);
  };

  const handleReject = (req) => {
    setRequestStatuses(prev => ({ ...prev, [req.id]: 'REJECTED' }));
    setActionModal(null);
    setRejectReason('');
    showToast(`❌ Request rejected. Patient will be notified.`);
    setSelected(null);
  };

  const filtered = MOCK_REQUESTS.filter(r => filterStatus === 'ALL' || getStatus(r) === filterStatus);

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">Verify Medical Requests</div>
            <div className="page-subtitle">Review and approve patient assistance requests</div>
          </div>
          <span className="badge badge-pending" style={{ fontSize: '0.8rem', padding: '0.35rem 0.875rem' }}>
            ⏳ {MOCK_REQUESTS.filter(r => getStatus(r) === 'PENDING').length} Pending
          </span>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map(f => (
            <button key={f} className={`tab-btn ${filterStatus === f ? 'active' : ''}`} onClick={() => setFilterStatus(f)} id={`filter-req-${f.toLowerCase()}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Request Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map(req => {
            const status = getStatus(req);
            const isExpanded = selected?.id === req.id;
            return (
              <div key={req.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: '0.75rem' }}>
                    <div>
                      <div className="flex gap-2 items-center" style={{ marginBottom: '0.5rem' }}>
                        <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
                        {req.urgency && <span style={{ fontSize: '0.7rem', color: req.urgency === 'HIGH' ? 'var(--brand-danger)' : 'var(--brand-warning)', fontWeight: 700 }}>⚡ {req.urgency}</span>}
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: REQ-{String(req.id).padStart(4, '0')}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {req.title}
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="flex gap-2" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span className="tag">🦠 {req.disease}</span>
                    <span className="tag">🏥 {req.hospital.split(',')[0]}</span>
                    <span className="tag">💰 ₹{req.totalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Document Status */}
                  <div className="flex gap-2" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {req.documents.map(doc => (
                      <span key={doc.type} style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        background: doc.status === 'VERIFIED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: doc.status === 'VERIFIED' ? '#6ee7b7' : '#fcd34d',
                        border: `1px solid ${doc.status === 'VERIFIED' ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                      }}>
                        {doc.status === 'VERIFIED' ? '✅' : '⏳'} {doc.type}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelected(isExpanded ? null : req)} id={`btn-expand-req-${req.id}`}>
                      {isExpanded ? '▲ Collapse' : '▼ Full Details'}
                    </button>
                    {status === 'PENDING' && (
                      <>
                        <button className="btn btn-accent btn-sm" onClick={() => setActionModal({ type: 'approve', request: req })} id={`btn-approve-${req.id}`}>
                          ✅ Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setActionModal({ type: 'reject', request: req })} id={`btn-reject-${req.id}`}>
                          ❌ Reject
                        </button>
                      </>
                    )}
                    {status === 'VERIFIED' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--brand-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        ✅ Verified & Live
                      </span>
                    )}
                    {status === 'REJECTED' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--brand-danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        ❌ Rejected
                      </span>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)', animation: 'fadeInUp 0.2s ease' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.5rem' }}>Patient Details</div>
                        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '0.875rem', border: '1px solid var(--border-subtle)', fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Name</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{req.patientName} (ID: {req.patientId})</span></div>
                          <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Age</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{req.age} years</span></div>
                          <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Urgency</span><span style={{ color: 'var(--brand-danger)', fontWeight: 700 }}>{req.urgency}</span></div>
                        </div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.5rem' }}>Treatment Details</div>
                        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '0.875rem', border: '1px solid var(--border-subtle)', fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Total Required</span><span style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>₹{req.totalAmount.toLocaleString('en-IN')}</span></div>
                          <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Hospital</span><span style={{ color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right', maxWidth: 180 }}>{req.hospital}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="form-label" style={{ marginBottom: '0.5rem' }}>Case Description</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
                      {req.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Modals */}
        {actionModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>
                  {actionModal.type === 'approve' ? '✅ Approve Request' : '❌ Reject Request'}
                </div>
              </div>
              <div className="modal-body">
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{actionModal.request.title}</strong>
                </div>
                {actionModal.type === 'approve' ? (
                  <div className="alert alert-success" style={{ fontSize: '0.82rem' }}>
                    ✅ Approving this request will make it visible to donors on the platform. Please ensure all documents have been verified.
                  </div>
                ) : (
                  <>
                    <div className="alert alert-danger" style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
                      ❌ Rejecting this request will notify the patient. Please provide a reason.
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="reject-reason">Rejection Reason</label>
                      <textarea
                        id="reject-reason"
                        className="form-input"
                        placeholder="Explain why the request is being rejected..."
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        style={{ minHeight: 80 }}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setActionModal(null)} id="btn-cancel-action">Cancel</button>
                {actionModal.type === 'approve' ? (
                  <button className="btn btn-accent" onClick={() => handleApprove(actionModal.request)} id="btn-confirm-approve">
                    ✅ Confirm Approval
                  </button>
                ) : (
                  <button className="btn btn-danger" onClick={() => handleReject(actionModal.request)} disabled={!rejectReason.trim()} id="btn-confirm-reject">
                    ❌ Confirm Rejection
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-mid)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-lg)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', zIndex: 2000, animation: 'fadeInUp 0.3s ease', maxWidth: 360 }}>
            {toast}
          </div>
        )}
      </main>
    </div>
  );
};

export default VerifyRequests;

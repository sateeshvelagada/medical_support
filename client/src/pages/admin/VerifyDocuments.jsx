import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { MOCK_REQUESTS } from '../../utils/mockData';

const ALL_DOCS = MOCK_REQUESTS.flatMap(req =>
  req.documents.map(doc => ({
    ...doc,
    requestId: req.id,
    requestTitle: req.title,
    patientName: req.patientName,
    requestDate: req.createdAt,
    id: `${req.id}-${doc.type}`,
  }))
);

const VerifyDocuments = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/admin/verify-documents');
  const [docStatuses, setDocStatuses] = useState({});
  const [previewDoc, setPreviewDoc] = useState(null);
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState('ALL');

  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const getStatus = (doc) => docStatuses[doc.id] || doc.status;

  const handleVerify = (doc) => {
    setDocStatuses(prev => ({ ...prev, [doc.id]: 'VERIFIED' }));
    showToast(`✅ Document "${doc.type}" verified successfully.`);
    setPreviewDoc(null);
  };

  const handleReject = (doc) => {
    setDocStatuses(prev => ({ ...prev, [doc.id]: 'REJECTED' }));
    showToast(`❌ Document "${doc.type}" marked as rejected.`);
    setPreviewDoc(null);
  };

  const filtered = ALL_DOCS.filter(d => filter === 'ALL' || getStatus(d) === filter);

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">Verify Documents</div>
            <div className="page-subtitle">Review and verify submitted medical documents</div>
          </div>
          <span className="badge badge-pending" style={{ fontSize: '0.8rem', padding: '0.35rem 0.875rem' }}>
            ⏳ {ALL_DOCS.filter(d => getStatus(d) === 'PENDING').length} Pending
          </span>
        </div>

        <div className="alert alert-warning" style={{ marginBottom: '1.5rem', fontSize: '0.82rem' }}>
          🔒 <strong>Confidential:</strong> These documents contain sensitive patient medical and identity information. Access is restricted to authorized admin personnel only. Handle with utmost care.
        </div>

        {/* Tabs */}
        <div className="tabs">
          {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map(f => (
            <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} id={`doc-filter-${f.toLowerCase()}`}>
              {f} {f !== 'ALL' && `(${ALL_DOCS.filter(d => getStatus(d) === f).length})`}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Request</th>
                <th>Patient</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => {
                const status = getStatus(doc);
                return (
                  <tr key={doc.id} id={`doc-row-${doc.id}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>📄</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{doc.type}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: 160 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        REQ-{String(doc.requestId).padStart(4, '0')}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 500 }}>{doc.patientName}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(doc.requestDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td>
                      <span className={`badge badge-${status.toLowerCase()}`}>
                        {status === 'VERIFIED' ? '✅ ' : status === 'REJECTED' ? '❌ ' : '⏳ '}
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm" onClick={() => setPreviewDoc(doc)} id={`btn-preview-doc-${doc.id}`}>
                          👁️ Preview
                        </button>
                        {status === 'PENDING' && (
                          <>
                            <button className="btn btn-accent btn-sm" onClick={() => handleVerify(doc)} id={`btn-verify-doc-${doc.id}`}>✅</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleReject(doc)} id={`btn-reject-doc-${doc.id}`}>❌</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No documents found for this filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Document Preview Modal */}
        {previewDoc && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Document Preview</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{previewDoc.type} — {previewDoc.patientName}</div>
                </div>
                <button onClick={() => setPreviewDoc(null)} style={{ color: 'var(--text-muted)', fontSize: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>
              <div className="modal-body">
                {/* Simulated Document Preview */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  border: '1px solid var(--border-mid)',
                  textAlign: 'center',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                }}>
                  <div style={{ fontSize: '3rem' }}>📄</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{previewDoc.type}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Submitted by: {previewDoc.patientName}
                  </div>
                  <div style={{ padding: '0.5rem 1rem', background: 'rgba(14,165,233,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(14,165,233,0.2)', fontSize: '0.78rem', color: 'var(--brand-primary-light)' }}>
                    🔒 In production, this area displays the actual encrypted document.<br />
                    Access is logged for audit trail.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { l: 'Document Type', v: previewDoc.type },
                    { l: 'Patient', v: previewDoc.patientName },
                    { l: 'Request ID', v: `REQ-${String(previewDoc.requestId).padStart(4, '0')}` },
                    { l: 'Current Status', v: getStatus(previewDoc) },
                  ].map(i => (
                    <div key={i.l} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{i.l}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{i.v}</div>
                    </div>
                  ))}
                </div>

                <div className="alert alert-danger" style={{ fontSize: '0.78rem' }}>
                  🔒 This document view is recorded in the audit log. Unauthorized sharing of patient documents is a criminal offense.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setPreviewDoc(null)} id="btn-close-preview">Close</button>
                {getStatus(previewDoc) === 'PENDING' && (
                  <>
                    <button className="btn btn-danger" onClick={() => handleReject(previewDoc)} id="btn-modal-reject-doc">❌ Reject</button>
                    <button className="btn btn-accent" onClick={() => handleVerify(previewDoc)} id="btn-modal-verify-doc">✅ Verify</button>
                  </>
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

export default VerifyDocuments;

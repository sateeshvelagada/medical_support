import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { MOCK_ORGAN_REQUESTS } from '../../utils/mockData';

const OrganRequests = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/hospital/organ-requests');
  const [selected, setSelected] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [toast, setToast] = useState('');

  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdate(prev => ({ ...prev, [id]: newStatus }));
    showToast(`✅ Status updated to ${newStatus}`);
  };

  const urgencyColors = {
    CRITICAL: { bg: 'rgba(239,68,68,0.1)', color: 'var(--brand-danger)', border: 'rgba(239,68,68,0.3)', icon: '🔴' },
    HIGH: { bg: 'rgba(249,115,22,0.1)', color: 'var(--brand-organ)', border: 'rgba(249,115,22,0.3)', icon: '🟠' },
    MEDIUM: { bg: 'rgba(245,158,11,0.1)', color: 'var(--brand-warning)', border: 'rgba(245,158,11,0.3)', icon: '🟡' },
  };

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">🫀 Organ Requests</div>
            <div className="page-subtitle">Authorized emergency organ coordination portal</div>
          </div>
          <span className="badge badge-verified" style={{ fontSize: '0.75rem', padding: '0.35rem 0.875rem' }}>
            🏥 Hospital Access
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {MOCK_ORGAN_REQUESTS.map(req => {
            const u = urgencyColors[req.urgency] || urgencyColors.MEDIUM;
            const currentStatus = statusUpdate[req.id] || req.status;
            const isExpanded = selected?.id === req.id;

            return (
              <div key={req.id} className="card organ-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', border: `1px solid ${u.border}` }}>
                <div style={{ height: 3, background: `linear-gradient(90deg, ${u.color}, transparent)` }} />
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          background: u.bg,
                          border: `1px solid ${u.border}`,
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: u.color,
                          letterSpacing: '0.05em',
                        }}>
                          {u.icon} {req.urgency}
                        </div>
                        <span className={`badge badge-${currentStatus.toLowerCase()}`}>{currentStatus}</span>
                        <span className="badge badge-verified">✅ VERIFIED</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                        🫀 {req.organType} — Blood Type: {req.bloodType}
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Required By</div>
                      <div style={{ fontWeight: 700, color: req.urgency === 'CRITICAL' ? 'var(--brand-danger)' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {new Date(req.requiredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                    {[
                      { label: 'Hospital', value: req.hospital.split(',')[0] },
                      { label: 'Patient Age', value: `${req.age} years (Confidential)` },
                      { label: 'Request ID', value: `ORG-${String(req.id).padStart(4, '0')}` },
                    ].map(i => (
                      <div key={i.label} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{i.label}</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{i.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelected(isExpanded ? null : req)} id={`btn-expand-organ-${req.id}`}>
                      {isExpanded ? '▲ Collapse' : '▼ View Medical Summary'}
                    </button>
                    <select
                      className="form-input"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                      value={currentStatus}
                      onChange={e => handleStatusChange(req.id, e.target.value)}
                      id={`status-select-${req.id}`}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="MATCHED">Matched</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', animation: 'fadeInUp 0.2s ease' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                      Medical Summary <span style={{ fontSize: '0.7rem', color: 'var(--brand-accent)', fontWeight: 600 }}>— AUTHORIZED HOSPITAL ACCESS</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                      {req.medicalSummary}
                    </p>
                    <div className="alert alert-warning" style={{ fontSize: '0.78rem' }}>
                      🔒 This information is confidential and shared only with authorized hospital personnel. Unauthorized disclosure is prohibited.
                    </div>
                    <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                      <button className="btn btn-organ btn-sm" id={`btn-coordinate-${req.id}`}>
                        📞 Coordinate with Patient's Hospital
                      </button>
                      <button className="btn btn-secondary btn-sm" id={`btn-notify-network-${req.id}`}>
                        📡 Notify Donor Network
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {toast && (
          <div style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            background: 'var(--bg-surface)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem',
            boxShadow: 'var(--shadow-lg)', color: 'var(--brand-accent)', fontWeight: 600, fontSize: '0.9rem',
            zIndex: 2000, animation: 'fadeInUp 0.3s ease',
          }}>
            {toast}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganRequests;

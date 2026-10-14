import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { MOCK_REQUESTS } from '../../utils/mockData';

const ReceiverDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/receiver/dashboard');
  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };

  const myRequests = MOCK_REQUESTS.filter(r => r.patientId === 2).concat([MOCK_REQUESTS[4]]);
  const totalReceived = myRequests.reduce((s, r) => s + r.amountReceived, 0);

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">Patient Dashboard</div>
            <div className="page-subtitle">Track your medical assistance requests</div>
          </div>
          <button className="btn btn-primary" onClick={() => handleNavigate('/receiver/create-request')} id="btn-create-new-request">
            ✏️ New Request
          </button>
        </div>

        {/* Stats */}
        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'My Requests', value: myRequests.length, icon: '📋', cls: 'primary' },
            { label: 'Amount Received', value: `₹${totalReceived.toLocaleString('en-IN')}`, icon: '💰', cls: 'accent' },
            { label: 'Verified Requests', value: myRequests.filter(r => r.status === 'VERIFIED').length, icon: '✅', cls: 'secondary' },
            { label: 'Pending Review', value: myRequests.filter(r => r.status === 'PENDING').length, icon: '⏳', cls: 'organ' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Verification Flow */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.925rem', marginBottom: '1.25rem' }}>
            Request Verification Flow
          </div>
          <div className="flow-steps">
            {[
              { label: 'Submit Request', done: true },
              { label: 'Upload Docs', done: true },
              { label: 'Admin Review', done: true },
              { label: 'Verification', done: false, active: true },
              { label: 'Go Live', done: false },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                <div className={`flow-step ${s.done ? 'done' : ''} ${s.active ? 'active' : ''}`}>
                  <div className="flow-step-num">
                    {s.done ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: s.active ? 'var(--brand-primary)' : s.done ? 'var(--brand-accent)' : 'var(--text-muted)', marginLeft: '0.35rem', whiteSpace: 'nowrap' }}>
                    {s.label}
                  </div>
                </div>
                {i < 4 && <div className="flow-step-line" style={{ background: s.done ? 'var(--brand-accent)' : 'var(--border-subtle)' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* My Requests */}
        <div>
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>My Requests</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => handleNavigate('/receiver/requests')} id="btn-view-all-requests">
              View All →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {myRequests.slice(0, 3).map((req) => {
              const progress = Math.round((req.amountReceived / req.totalAmount) * 100);
              return (
                <div key={req.id} className="card" style={{ flexDirection: 'row', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: '0.4rem' }}>
                      <span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span>
                      <span className="tag">🦠 {req.disease}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {req.title}
                    </div>
                    <div className="progress-bar" style={{ marginBottom: '0.3rem' }}>
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ₹{req.amountReceived.toLocaleString('en-IN')} of ₹{req.totalAmount.toLocaleString('en-IN')} raised
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleNavigate('/receiver/requests')}
                    id={`btn-view-req-${req.id}`}
                    style={{ flexShrink: 0 }}
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '✏️', label: 'Create New Request', desc: 'Submit treatment request', path: '/receiver/create-request', gradient: 'var(--gradient-primary)' },
              { icon: '🫀', label: 'Organ Support', desc: 'Emergency organ request', path: '/receiver/organ-request', gradient: 'var(--gradient-organ)' },
              { icon: '📄', label: 'Upload Documents', desc: 'Add verification docs', path: '/receiver/requests', gradient: 'var(--gradient-accent)' },
            ].map(a => (
              <button key={a.path} onClick={() => handleNavigate(a.path)} id={`quick-action-${a.label.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: a.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                }}>
                  {a.icon}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{a.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReceiverDashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { MOCK_REQUESTS, MOCK_USERS_ADMIN, MOCK_ORGAN_REQUESTS, MOCK_DONATIONS } from '../../utils/mockData';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/admin/dashboard');
  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };

  const pending = MOCK_REQUESTS.filter(r => r.status === 'PENDING').length;
  const totalDonations = MOCK_DONATIONS.reduce((s, d) => s + d.amount, 0);
  const suspendedUsers = MOCK_USERS_ADMIN.filter(u => u.accountStatus === 'SUSPENDED').length;

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">Admin Dashboard 🛡️</div>
            <div className="page-subtitle">Platform overview and management</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => handleNavigate('/admin/verify-requests')} id="btn-pending-review">
              ⚠️ {pending} Pending Review
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'Total Requests', value: MOCK_REQUESTS.length, icon: '📋', cls: 'primary' },
            { label: 'Pending Verification', value: pending, icon: '⏳', cls: 'organ', alert: true },
            { label: 'Total Donations', value: `₹${(totalDonations / 100000).toFixed(1)}L`, icon: '💰', cls: 'accent' },
            { label: 'Total Users', value: MOCK_USERS_ADMIN.length, icon: '👥', cls: 'secondary' },
            { label: 'Organ Requests', value: MOCK_ORGAN_REQUESTS.length, icon: '🫀', cls: 'organ' },
            { label: 'Suspended Users', value: suspendedUsers, icon: '🚫', cls: 'primary', alert: true },
            { label: 'Verified Hospitals', value: 3, icon: '🏥', cls: 'accent' },
            { label: 'Success Rate', value: '94%', icon: '✅', cls: 'secondary' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.cls}`} style={{ position: 'relative' }}>
              {s.alert && pending > 0 && (
                <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-danger)', animation: 'pulse 1.5s infinite' }} />
              )}
              <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
          {/* Pending Requests */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                Requests Awaiting Verification
                <span style={{ marginLeft: '0.5rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.15)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700 }}>
                  {MOCK_REQUESTS.filter(r => r.status === 'PENDING').length} pending
                </span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => handleNavigate('/admin/verify-requests')} id="btn-admin-view-requests">
                View All →
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Disease</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_REQUESTS.map(req => (
                  <tr key={req.id} id={`admin-req-row-${req.id}`}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600, maxWidth: 180 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                        {req.title}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>{req.disease}</td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>₹{(req.totalAmount / 100000).toFixed(1)}L</td>
                    <td><span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleNavigate('/admin/verify-requests')} id={`admin-review-${req.id}`}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Quick Actions */}
            <div className="card">
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.925rem' }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: '✅ Verify Pending Requests', path: '/admin/verify-requests', color: 'var(--brand-accent)' },
                  { label: '📄 Review Documents', path: '/admin/verify-documents', color: 'var(--brand-primary)' },
                  { label: '👥 Manage Users', path: '/admin/users', color: 'var(--brand-secondary)' },
                  { label: '🏥 Manage Hospitals', path: '/admin/hospitals', color: 'var(--brand-organ)' },
                ].map(action => (
                  <button key={action.path} onClick={() => handleNavigate(action.path)}
                    id={`quick-${action.label.split(' ').slice(1).join('-').toLowerCase()}`}
                    style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-card)',
                      color: action.color,
                      fontWeight: 600,
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.925rem' }}>System Activity</div>
              {[
                { time: '5m ago', action: 'New request submitted by Priya M.', type: 'info' },
                { time: '1h ago', action: 'Donation of ₹25,000 recorded', type: 'success' },
                { time: '2h ago', action: 'Document verified for Request #1', type: 'success' },
                { time: '3h ago', action: 'Suspicious activity flagged — User ID 4', type: 'danger' },
                { time: '5h ago', action: 'New organ request — Kidney (CRITICAL)', type: 'warning' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: a.type === 'success' ? 'var(--brand-accent)' : a.type === 'danger' ? 'var(--brand-danger)' : a.type === 'warning' ? 'var(--brand-warning)' : 'var(--brand-primary)',
                    flexShrink: 0,
                    marginTop: 4,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--text-secondary)' }}>{a.action}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

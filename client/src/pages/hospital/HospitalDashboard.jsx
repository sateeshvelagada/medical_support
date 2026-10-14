import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { MOCK_ORGAN_REQUESTS } from '../../utils/mockData';

const HospitalDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/hospital/dashboard');
  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };

  const critical = MOCK_ORGAN_REQUESTS.filter(r => r.urgency === 'CRITICAL');

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">Hospital Dashboard</div>
            <div className="page-subtitle">{user?.name || 'Apollo Medical Center'} — Authorized Organ Coordinator</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="notif-dot" />
            <span style={{ fontSize: '0.8rem', color: 'var(--brand-danger)', fontWeight: 700 }}>
              {critical.length} Critical Alert{critical.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'Active Organ Requests', value: MOCK_ORGAN_REQUESTS.length, icon: '🫀', cls: 'organ' },
            { label: 'Critical Cases', value: critical.length, icon: '🔴', cls: 'primary' },
            { label: 'Pending Verification', value: 2, icon: '⏳', cls: 'secondary' },
            { label: 'Coordinated This Month', value: 7, icon: '✅', cls: 'accent' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Critical Alert */}
        {critical.length > 0 && (
          <div style={{
            background: 'rgba(249,115,22,0.08)',
            border: '2px solid rgba(249,115,22,0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '2rem',
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
              <span className="critical-pulse" style={{ display: 'inline-block' }}>🚨</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--brand-organ)', fontSize: '0.95rem' }}>
                CRITICAL — Immediate Action Required
              </span>
            </div>
            {critical.map(req => (
              <div key={req.id} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0.5rem 0', borderTop: '1px solid rgba(249,115,22,0.15)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>🫀 {req.organType} needed</strong> — Blood type {req.bloodType} — Required by {new Date(req.requiredDate).toLocaleDateString('en-IN')}
                <span style={{ display: 'inline-block', marginLeft: '0.75rem' }}>
                  <button className="btn btn-organ btn-sm" onClick={() => handleNavigate('/hospital/organ-requests')} id={`critical-alert-btn-${req.id}`}>
                    View Now
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Recent Organ Requests Summary */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Recent Organ Requests</div>
            <button className="btn btn-secondary btn-sm" onClick={() => handleNavigate('/hospital/organ-requests')} id="btn-view-all-organ">View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Organ</th>
                <th>Blood Type</th>
                <th>Urgency</th>
                <th>Hospital</th>
                <th>Required By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ORGAN_REQUESTS.map(req => (
                <tr key={req.id} id={`organ-row-${req.id}`}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 700 }}>🫀 {req.organType}</td>
                  <td><span className="badge badge-active">{req.bloodType}</span></td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: req.urgency === 'CRITICAL' ? 'var(--brand-danger)' : req.urgency === 'HIGH' ? 'var(--brand-organ)' : 'var(--brand-warning)',
                    }}>
                      {req.urgency === 'CRITICAL' ? '🔴' : req.urgency === 'HIGH' ? '🟠' : '🟡'} {req.urgency}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{req.hospital.split(',')[0]}</td>
                  <td style={{ fontSize: '0.8rem' }}>{new Date(req.requiredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                  <td><span className="badge badge-verified">{req.verificationStatus}</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleNavigate('/hospital/organ-requests')} id={`btn-manage-organ-${req.id}`}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default HospitalDashboard;

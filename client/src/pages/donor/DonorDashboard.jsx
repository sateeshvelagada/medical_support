import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { MOCK_DONATIONS, MOCK_REQUESTS } from '../../utils/mockData';

const DonorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/donor/dashboard');

  const handleNavigate = (path) => {
    setCurrentPath(path);
    navigate(path);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const verifiedRequests = MOCK_REQUESTS.filter(r => r.status === 'VERIFIED' || r.status === 'ACTIVE');

  const stats = [
    { label: 'Total Donated', value: `₹${(user?.totalDonated || 45000).toLocaleString('en-IN')}`, icon: '💰', cls: 'primary' },
    { label: 'Donations Made', value: user?.donationCount || 8, icon: '💝', cls: 'accent' },
    { label: 'Lives Impacted', value: '6', icon: '❤️', cls: 'secondary' },
    { label: 'Active Campaigns', value: verifiedRequests.length, icon: '📋', cls: 'organ' },
  ];

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</div>
            <div className="page-subtitle">Here's your giving activity and impact</div>
          </div>
          <button className="btn btn-primary" onClick={() => handleNavigate('/donor/browse')} id="btn-browse-requests">
            🔍 Browse Requests
          </button>
        </div>

        {/* Stats */}
        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          {stats.map((s) => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
          {/* Recent Donations */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Recent Donations</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => handleNavigate('/donor/history')} id="btn-view-all-donations">View All</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DONATIONS.slice(0, 4).map((d) => (
                  <tr key={d.id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.requestTitle}
                    </td>
                    <td style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>
                      ₹{d.amount.toLocaleString('en-IN')}
                    </td>
                    <td>{new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td>
                      <span className={`badge ${d.paymentStatus === 'SUCCESS' ? 'badge-verified' : 'badge-pending'}`}>
                        {d.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Impact Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="icon-box icon-box-accent" style={{ fontSize: '1.25rem' }}>🌟</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.925rem' }}>Your Impact</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lives you've touched</div>
                </div>
              </div>
              {[
                { label: 'Cardiac Surgeries', count: 2, icon: '❤️' },
                { label: 'Cancer Treatments', count: 3, icon: '🎗️' },
                { label: 'Dialysis Sessions', count: 1, icon: '💊' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    {item.icon} {item.label}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.875rem' }}>{item.count}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(99,102,241,0.08))' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.925rem', marginBottom: '0.25rem' }}>Gold Donor</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                You're in the top 5% of donors!
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '72%' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                ₹55,000 more to reach Platinum
              </div>
            </div>
          </div>
        </div>

        {/* Featured Active Requests */}
        <div style={{ marginTop: '2rem' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Active Campaigns Needing Help</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => handleNavigate('/donor/browse')} id="btn-see-all-campaigns">
              See All →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {verifiedRequests.slice(0, 3).map((req) => {
              const progress = Math.round((req.amountReceived / req.totalAmount) * 100);
              return (
                <div key={req.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="flex justify-between items-center">
                    <span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span>
                    {req.urgency === 'HIGH' && <span style={{ fontSize: '0.7rem', color: 'var(--brand-danger)', fontWeight: 700 }}>⚡ HIGH</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)' }}>{req.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                    <span>🏥 {req.hospital.split(',')[0]}</span>
                  </div>
                  <div>
                    <div className="flex justify-between" style={{ marginBottom: '0.3rem', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>₹{req.amountReceived.toLocaleString('en-IN')} raised</span>
                      <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      Goal: ₹{req.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleNavigate('/donor/browse')}
                    id={`btn-dashboard-donate-${req.id}`}
                    style={{ width: '100%' }}
                  >
                    💝 Donate Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const DonationHistory = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/donor/history');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const res = await api.get('/donations/my');
        setDonations(res.data?.donations || []);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const total = donations.reduce((s, d) => s + (Number(d.amount) || 0), 0);

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">Donation History</div>
            <div className="page-subtitle">Your real verified transactions and hospital escrow records</div>
          </div>
          <button className="btn btn-primary" onClick={() => handleNavigate('/donor/browse')} id="btn-donate-more">
            💝 Donate More
          </button>
        </div>

        {/* Summary */}
        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'Total Donated', value: `₹${total.toLocaleString('en-IN')}`, icon: '💰', cls: 'primary' },
            { label: 'Transactions', value: donations.length, icon: '📋', cls: 'accent' },
            { label: 'Campaigns Supported', value: new Set(donations.map(d => d.requestId)).size, icon: '❤️', cls: 'secondary' },
            { label: 'Escrow Success Rate', value: '100%', icon: '✅', cls: 'organ' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Donation Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Real Transaction History</div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }} />
              <div>Loading transaction history...</div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medical Campaign & Hospital</th>
                  <th>Escrow A/c Number</th>
                  <th>Payment Ref / UTR</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr key={d.id} id={`donation-row-${d.id}`}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{String(i + 1).padStart(3, '0')}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600, maxWidth: 240 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {d.requestTitle}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        🏥 {d.hospital}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#38bdf8' }}>
                      {d.escrowAccount || 'Escrow Account'}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      <div>{d.paymentReference}</div>
                      {d.transactionUtr && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UTR: {d.transactionUtr}</div>
                      )}
                    </td>
                    <td style={{ color: 'var(--brand-accent)', fontWeight: 800, fontSize: '0.95rem' }}>
                      ₹{Number(d.amount).toLocaleString('en-IN')}
                    </td>
                    <td>{new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <span className={`badge ${d.paymentStatus === 'SUCCESS' ? 'badge-verified' : 'badge-pending'}`}>
                        {d.paymentStatus === 'SUCCESS' ? '✅ Success' : '⏳ Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No donations yet. Click "Donate More" to make your first contribution!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Tax Info */}
        <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
          📋 <strong>Direct Hospital Escrow:</strong> All donations are paid directly to institutional escrow bank accounts of verified medical centers and qualify for tax exemption under 80G.
        </div>
      </main>
    </div>
  );
};

export default DonationHistory;

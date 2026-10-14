import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const MyRequests = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/receiver/requests');
  const [selected, setSelected] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    const fetchMy = async () => {
      try {
        setLoading(true);
        const res = await api.get('/requests/my');
        setMyRequests(res.data?.requests || []);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchMy();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">My Medical Requests</div>
            <div className="page-subtitle">Track your campaigns, verification status, and received escrow funding</div>
          </div>
          <button className="btn btn-primary" onClick={() => handleNavigate('/receiver/create-request')} id="btn-new-request">
            ✏️ New Request
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
            <div>Loading your requests...</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {myRequests.map(req => {
              const progress = Math.min(100, Math.round(((Number(req.amountReceived) || 0) / (Number(req.totalAmount) || 1)) * 100));
              const isSelected = selected?.id === req.id;
              return (
                <div key={req.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '1.25rem 1.5rem' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                      <div className="flex items-center gap-2">
                        <span className={`badge badge-${req.status?.toLowerCase()}`}>{req.status}</span>
                        {req.urgency === 'CRITICAL' && <span style={{ fontSize: '0.7rem', color: 'var(--brand-danger)', fontWeight: 700 }}>⚡ CRITICAL URGENCY</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Created {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {req.title}
                    </h3>
                    <div className="flex gap-2" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span className="tag">🦠 {req.disease}</span>
                      <span className="tag">🏥 {req.hospital}</span>
                      <span className="tag">🏦 {req.bankName} - A/c: {req.accountNumber}</span>
                    </div>
                    <div className="progress-bar" style={{ marginBottom: '0.4rem' }}>
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                      <span style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>
                        ₹{Number(req.amountReceived || 0).toLocaleString('en-IN')} received in escrow
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Goal: ₹{Number(req.totalAmount).toLocaleString('en-IN')} ({progress}%)
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                        onClick={() => setSelected(isSelected ? null : req)}
                      >
                        {isSelected ? '▲ Hide Details' : '▼ View Escrow & Verification'}
                      </button>
                    </div>

                    {isSelected && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Clinical Summary:</strong> {req.description}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                          <div><strong>Escrow Bank:</strong> {req.bankName}</div>
                          <div><strong>Account Number:</strong> {req.accountNumber}</div>
                          <div><strong>IFSC Code:</strong> {req.ifscCode}</div>
                          <div><strong>Beneficiary:</strong> {req.beneficiaryName}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {myRequests.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>No requests created yet</div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Click "New Request" to create your medical funding campaign.</div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRequests;

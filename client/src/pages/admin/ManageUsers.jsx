import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { MOCK_USERS_ADMIN } from '../../utils/mockData';

const ManageUsers = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/admin/users');
  const [users, setUsers] = useState(MOCK_USERS_ADMIN);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [actionModal, setActionModal] = useState(null);
  const [toast, setToast] = useState('');

  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSuspend = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: 'SUSPENDED' } : u));
    showToast('⚠️ User account suspended.');
    setActionModal(null);
  };

  const handleActivate = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: 'ACTIVE' } : u));
    showToast('✅ User account reactivated.');
    setActionModal(null);
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const matchStatus = filterStatus === 'ALL' || u.accountStatus === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const roleColors = {
    DONOR: 'badge-donor',
    RECEIVER: 'badge-receiver',
    HOSPITAL: 'badge-hospital',
    ADMIN: 'badge-admin',
  };

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">Manage Users</div>
            <div className="page-subtitle">{users.length} registered users on the platform</div>
          </div>
          <div className="flex gap-2">
            <select className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', width: 'auto' }} value={filterRole} onChange={e => setFilterRole(e.target.value)} id="filter-role">
              <option value="ALL">All Roles</option>
              <option value="DONOR">Donors</option>
              <option value="RECEIVER">Receivers</option>
              <option value="HOSPITAL">Hospitals</option>
            </select>
            <select className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)} id="filter-status">
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            id="user-search"
            type="text"
            className="form-input"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 360 }}
          />
        </div>

        {/* Suspended Users Alert */}
        {users.filter(u => u.accountStatus === 'SUSPENDED').length > 0 && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem', fontSize: '0.82rem' }}>
            🚫 {users.filter(u => u.accountStatus === 'SUSPENDED').length} suspended account(s). Monitor for fraudulent activity.
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Activity</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} id={`user-row-${u.id}`}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: u.role === 'DONOR' ? 'var(--gradient-donor)' : u.role === 'RECEIVER' ? 'var(--gradient-receiver)' : 'var(--gradient-hospital)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 700, color: 'white', flexShrink: 0,
                      }}>
                        {u.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{u.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${roleColors[u.role] || 'badge-active'}`}>{u.role}</span></td>
                  <td style={{ fontSize: '0.8rem' }}>{u.phone}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {u.role === 'DONOR' ? `₹${u.totalDonated?.toLocaleString('en-IN')} donated` : `${u.requestCount || 0} request(s)`}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <span className={`badge ${u.accountStatus === 'ACTIVE' ? 'badge-verified' : 'badge-rejected'}`}>
                      {u.accountStatus === 'ACTIVE' ? '🟢 Active' : '🔴 Suspended'}
                    </span>
                    {u.suspendReason && (
                      <div style={{ fontSize: '0.68rem', color: 'var(--brand-danger)', marginTop: '0.2rem' }}>
                        ⚠️ {u.suspendReason}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {u.accountStatus === 'ACTIVE' ? (
                        <button className="btn btn-danger btn-sm" onClick={() => setActionModal({ type: 'suspend', user: u })} id={`btn-suspend-${u.id}`}>
                          Suspend
                        </button>
                      ) : (
                        <button className="btn btn-accent btn-sm" onClick={() => handleActivate(u.id)} id={`btn-activate-${u.id}`}>
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {actionModal && actionModal.type === 'suspend' && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>🚫 Suspend User</div>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger" style={{ fontSize: '0.82rem' }}>
                  You are about to suspend <strong>{actionModal.user.name}</strong>'s account. They will lose access to the platform immediately.
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="suspend-reason">Reason for Suspension</label>
                  <textarea id="suspend-reason" className="form-input" placeholder="Provide a reason..." style={{ minHeight: 80 }} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setActionModal(null)} id="btn-cancel-suspend">Cancel</button>
                <button className="btn btn-danger" onClick={() => handleSuspend(actionModal.user.id)} id="btn-confirm-suspend">
                  🚫 Suspend Account
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-mid)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-lg)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', zIndex: 2000, animation: 'fadeInUp 0.3s ease' }}>
            {toast}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageUsers;

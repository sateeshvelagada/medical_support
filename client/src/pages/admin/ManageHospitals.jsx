import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { MOCK_HOSPITALS } from '../../utils/mockData';

const ManageHospitals = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/admin/hospitals');
  const [hospitals, setHospitals] = useState(MOCK_HOSPITALS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', regNumber: '', address: '', contact: '' });
  const [toast, setToast] = useState('');

  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleVerify = (id) => {
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, verificationStatus: 'VERIFIED' } : h));
    showToast('✅ Hospital verified and authorized on the platform.');
  };

  const handleRevoke = (id) => {
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, verificationStatus: 'REVOKED' } : h));
    showToast('❌ Hospital authorization revoked.');
  };

  const handleAdd = () => {
    if (!addForm.name || !addForm.regNumber) return;
    const newHospital = {
      id: Date.now(),
      name: addForm.name,
      registrationNumber: addForm.regNumber,
      address: addForm.address,
      contact: addForm.contact,
      verificationStatus: 'PENDING',
      specializations: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setHospitals(prev => [...prev, newHospital]);
    setAddForm({ name: '', regNumber: '', address: '', contact: '' });
    setShowAddModal(false);
    showToast('🏥 Hospital added. Pending verification.');
  };

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">Manage Hospitals</div>
            <div className="page-subtitle">Authorize and manage partner hospitals</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} id="btn-add-hospital">
            🏥 Add Hospital
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {hospitals.map(hospital => {
            const isVerified = hospital.verificationStatus === 'VERIFIED';
            const isPending = hospital.verificationStatus === 'PENDING';
            return (
              <div key={hospital.id} className="card" id={`hospital-card-${hospital.id}`} style={{
                borderColor: isVerified ? 'rgba(16,185,129,0.2)' : isPending ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: isVerified ? 'var(--gradient-accent)' : isPending ? 'var(--gradient-hospital)' : 'var(--brand-danger)', borderRadius: '16px 16px 0 0' }} />
                <div className="flex items-start justify-between" style={{ marginBottom: '1rem' }}>
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: isVerified ? 'var(--gradient-accent)' : 'var(--gradient-hospital)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.25rem', flexShrink: 0,
                    }}>
                      🏥
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {hospital.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {hospital.registrationNumber}
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${isVerified ? 'badge-verified' : isPending ? 'badge-pending' : 'badge-rejected'}`}>
                    {hospital.verificationStatus}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: 16 }}>📍</span> {hospital.address}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: 16 }}>📞</span> {hospital.contact}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: 16 }}>📅</span> Added {new Date(hospital.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {hospital.specializations?.length > 0 && (
                  <div className="flex gap-1" style={{ flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {hospital.specializations.map(s => (
                      <span key={s} className="tag" style={{ fontSize: '0.68rem' }}>{s}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {isPending && (
                    <button className="btn btn-accent btn-sm" onClick={() => handleVerify(hospital.id)} id={`btn-verify-hospital-${hospital.id}`}>
                      ✅ Verify
                    </button>
                  )}
                  {isVerified && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleRevoke(hospital.id)} id={`btn-revoke-hospital-${hospital.id}`}>
                      ❌ Revoke
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm" id={`btn-contact-hospital-${hospital.id}`}>
                    📞 Contact
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Hospital Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>🏥 Add New Hospital</div>
                <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-muted)', fontSize: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="hospital-name">Hospital Name *</label>
                  <input id="hospital-name" type="text" className="form-input" placeholder="Full hospital name" value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="hospital-reg">Registration Number *</label>
                  <input id="hospital-reg" type="text" className="form-input" placeholder="e.g. MH-HOS-2024-0001" value={addForm.regNumber} onChange={e => setAddForm(p => ({ ...p, regNumber: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="hospital-address">Address</label>
                  <input id="hospital-address" type="text" className="form-input" placeholder="Full address" value={addForm.address} onChange={e => setAddForm(p => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="hospital-contact">Contact Number</label>
                  <input id="hospital-contact" type="text" className="form-input" placeholder="+91-XXXX-XXXXXX" value={addForm.contact} onChange={e => setAddForm(p => ({ ...p, contact: e.target.value }))} />
                </div>
                <div className="alert alert-info" style={{ fontSize: '0.78rem' }}>
                  ℹ️ New hospitals start with PENDING status and must be manually verified before they can access organ requests.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)} id="btn-cancel-add-hospital">Cancel</button>
                <button className="btn btn-primary" onClick={handleAdd} disabled={!addForm.name || !addForm.regNumber} id="btn-confirm-add-hospital">
                  🏥 Add Hospital
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

export default ManageHospitals;

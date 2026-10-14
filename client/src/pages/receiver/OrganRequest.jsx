import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

const ORGAN_TYPES = ['Kidney', 'Liver', 'Heart', 'Lung', 'Cornea', 'Bone Marrow', 'Pancreas', 'Small Intestine'];

const TODAY_STR = new Date().toISOString().split('T')[0];

const OrganRequest = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/receiver/organ-request');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    organType: '',
    bloodType: '',
    urgency: 'HIGH',
    hospital: '',
    medicalSummary: '',
    requiredDate: '',
    agreedTerms: false,
  });
  const [errors, setErrors] = useState({});

  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const validate = () => {
    const e = {};
    if (!form.organType) e.organType = 'Organ type is required';
    if (!form.bloodType) e.bloodType = 'Blood type is required';
    if (!form.hospital.trim()) e.hospital = 'Hospital name is required';
    if (!form.medicalSummary.trim() || form.medicalSummary.length < 50) e.medicalSummary = 'Medical summary must be at least 50 characters';
    if (!form.requiredDate) e.requiredDate = 'Required date is required';
    if (!form.agreedTerms) e.agreedTerms = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="app-layout">
        <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 500 }} className="animate-fade-up">
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🫀</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--brand-organ)' }}>
              Emergency Request Submitted
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Your organ support request has been submitted for emergency verification. Authorized hospitals and donor networks will be notified immediately upon approval.
            </p>
            <div className="alert alert-warning" style={{ textAlign: 'left', marginBottom: '2rem', fontSize: '0.8rem' }}>
              ⚠️ <strong>Important:</strong> This platform coordinates information only. Actual organ allocation decisions are made exclusively by authorized medical and transplant authorities.
            </div>
            <button className="btn btn-primary" onClick={() => handleNavigate('/receiver/dashboard')} id="btn-organ-back">
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🫀</span> Emergency Organ Request
            </div>
            <div className="page-subtitle">Submit an urgent organ support request to authorized medical networks</div>
          </div>
        </div>

        {/* Warning Banner */}
        <div style={{
          background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <div style={{ fontSize: '1.5rem' }}>⚠️</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--brand-organ)', marginBottom: '0.35rem' }}>
              Emergency Module — Read Carefully
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              This module is for coordinating organ-related emergencies with authorized hospitals and donor networks. 
              All requests are reviewed and verified before being shared with medical authorities. 
              Organ allocation decisions remain with authorized transplant centers only.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Organ Requirement Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="organ-type">Organ Type Required *</label>
                <select id="organ-type" className={`form-input ${errors.organType ? 'error' : ''}`}
                  value={form.organType} onChange={e => update('organType', e.target.value)}>
                  <option value="">Select organ type</option>
                  {ORGAN_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.organType && <span className="form-error">{errors.organType}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="blood-type">Blood Group *</label>
                <select id="blood-type" className={`form-input ${errors.bloodType ? 'error' : ''}`}
                  value={form.bloodType} onChange={e => update('bloodType', e.target.value)}>
                  <option value="">Select blood group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Any'].map(b => <option key={b}>{b}</option>)}
                </select>
                {errors.bloodType && <span className="form-error">{errors.bloodType}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="organ-urgency">Urgency Level</label>
                <select id="organ-urgency" className="form-input" value={form.urgency} onChange={e => update('urgency', e.target.value)}>
                  <option value="CRITICAL">🔴 Critical — Immediate</option>
                  <option value="HIGH">🟠 High — Within days</option>
                  <option value="MEDIUM">🟡 Medium — Within weeks</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="required-date">Required By Date *</label>
                <input id="required-date" type="date" className={`form-input ${errors.requiredDate ? 'error' : ''}`}
                  value={form.requiredDate} onChange={e => update('requiredDate', e.target.value)}
                  min={TODAY_STR} />
                {errors.requiredDate && <span className="form-error">{errors.requiredDate}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="organ-hospital">Treating Hospital / Medical Center *</label>
              <input id="organ-hospital" type="text" className={`form-input ${errors.hospital ? 'error' : ''}`}
                placeholder="e.g. Apollo Hospitals, Mumbai"
                value={form.hospital} onChange={e => update('hospital', e.target.value)} />
              {errors.hospital && <span className="form-error">{errors.hospital}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="medical-summary">Medical Summary *</label>
              <textarea id="medical-summary" className={`form-input ${errors.medicalSummary ? 'error' : ''}`}
                placeholder="Describe the patient's medical condition, why the organ is needed, current status, MELD/PELD score if applicable... (min 50 characters)"
                value={form.medicalSummary} onChange={e => update('medicalSummary', e.target.value)}
                style={{ minHeight: 140 }} />
              <div style={{ fontSize: '0.72rem', color: form.medicalSummary.length >= 50 ? 'var(--brand-accent)' : 'var(--text-muted)', textAlign: 'right' }}>
                {form.medicalSummary.length} chars
              </div>
              {errors.medicalSummary && <span className="form-error">{errors.medicalSummary}</span>}
            </div>

            {/* File Upload for Organ Request */}
            <div>
              <div className="form-label" style={{ marginBottom: '0.75rem' }}>Supporting Medical Documents</div>
              {[
                'Organ Failure Reports / Diagnostic Tests',
                'Transplant Center Referral Letter',
                'MELD/PELD Score Certificate (if applicable)',
              ].map((doc, i) => (
                <div key={i} className="file-upload" style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>📄</span>
                  <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{doc}</span>
                  <button type="button" className="btn btn-secondary btn-sm" id={`organ-doc-${i}`}>📎 Upload</button>
                </div>
              ))}
            </div>

            {/* Terms */}
            <div
              onClick={() => update('agreedTerms', !form.agreedTerms)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 5, marginTop: 2, flexShrink: 0,
                border: `2px solid ${form.agreedTerms ? 'var(--brand-organ)' : 'var(--border-mid)'}`,
                background: form.agreedTerms ? 'var(--brand-organ)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                {form.agreedTerms && <span style={{ color: 'white', fontSize: '0.65rem' }}>✓</span>}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                I confirm that all information is medically accurate. I understand this platform is for coordination only and that actual organ allocation decisions are made by authorized transplant authorities. I consent to sharing this information with authorized hospitals and donor networks.
              </span>
            </div>
            {errors.agreedTerms && <span className="form-error">{errors.agreedTerms}</span>}

            <button type="submit" className="btn btn-organ btn-lg" id="btn-submit-organ" style={{ width: '100%' }}>
              🚨 Submit Emergency Organ Request
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default OrganRequest;

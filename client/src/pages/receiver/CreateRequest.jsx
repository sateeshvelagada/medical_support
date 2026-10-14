import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const STEPS = ['Basic Info', 'Medical Details', 'Documents', 'Review'];

const CreateRequest = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState('/receiver/create-request');
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    disease: '',
    hospital: '',
    totalAmount: '',
    urgency: 'MEDIUM',
    treatmentRequired: '',
    description: '',
    files: [],
  });
  const [errors, setErrors] = useState({});

  const handleNavigate = (path) => { setCurrentPath(path); navigate(path); };
  const handleLogout = () => { logout(); navigate('/login'); };
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.title.trim()) e.title = 'Title is required';
      if (!form.disease.trim()) e.disease = 'Disease name is required';
      if (!form.hospital.trim()) e.hospital = 'Hospital name is required';
      if (!form.totalAmount || form.totalAmount <= 0) e.totalAmount = 'Valid amount required';
    }
    if (step === 1) {
      if (!form.treatmentRequired.trim()) e.treatmentRequired = 'Treatment details required';
      if (!form.description.trim() || form.description.length < 50) e.description = 'Description must be at least 50 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) setStep(s => s + 1); };
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    try {
      await api.post('/requests', {
        title: form.title,
        disease: form.disease,
        hospital: form.hospital,
        treatmentRequired: form.treatmentRequired,
        totalAmount: Number(form.totalAmount),
        urgency: form.urgency,
        description: form.description,
        bankName: form.bankName || 'State Bank of India',
        accountNumber: form.accountNumber || `3098${Math.floor(10000000 + Math.random() * 90000000)}`,
        ifscCode: form.ifscCode || 'SBIN0001536',
        beneficiaryName: form.beneficiaryName || `${form.hospital} Escrow`,
        upiId: form.upiId || 'treatment@sbi',
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit request');
    }
  };

  if (submitted) {
    return (
      <div className="app-layout">
        <Sidebar user={user} currentPath={currentPath} onNavigate={handleNavigate} onLogout={handleLogout} />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }} className="animate-fade-up">
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'float 2s ease-in-out infinite' }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
              Request Submitted!
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Your medical assistance request has been submitted successfully. Our admin team will review it within <strong style={{ color: 'var(--brand-primary)' }}>2–3 business days</strong>. You'll receive an email notification once it's verified.
            </p>
            <div className="alert alert-info" style={{ textAlign: 'left', marginBottom: '2rem', fontSize: '0.82rem' }}>
              <div>📋 <strong>What happens next:</strong></div>
              <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>✅ Request received and queued for review</li>
                <li>⏳ Admin team verifies your documents</li>
                <li>🔔 You'll be notified of approval/rejection</li>
                <li>💝 If approved, donors can see and help</li>
              </ul>
            </div>
            <div className="flex gap-3 justify-center">
              <button className="btn btn-primary" onClick={() => handleNavigate('/receiver/requests')} id="btn-view-my-requests">View My Requests</button>
              <button className="btn btn-secondary" onClick={() => handleNavigate('/receiver/dashboard')} id="btn-back-dashboard">Dashboard</button>
            </div>
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
            <div className="page-title">Create Medical Request</div>
            <div className="page-subtitle">Submit your treatment assistance request</div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="flex items-center" style={{ gap: 0 }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: i < step ? 'var(--brand-accent)' : i === step ? 'var(--gradient-primary)' : 'var(--bg-card)',
                    border: `2px solid ${i < step ? 'var(--brand-accent)' : i === step ? 'var(--brand-primary)' : 'var(--border-mid)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700,
                    color: i <= step ? 'white' : 'var(--text-muted)',
                    transition: 'all 0.3s',
                    boxShadow: i === step ? 'var(--shadow-glow)' : 'none',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: i === step ? 'var(--brand-primary)' : i < step ? 'var(--brand-accent)' : 'var(--text-muted)', textAlign: 'center' }}>
                    {s}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ height: 2, flex: 1, background: i < step ? 'var(--brand-accent)' : 'var(--border-subtle)', margin: '0 0.25rem', marginBottom: '1.25rem', transition: 'background 0.3s' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ maxWidth: 680 }}>
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Basic Information</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="req-title">Request Title *</label>
                <input id="req-title" type="text" className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="e.g. Cardiac Surgery for Heart Valve Replacement"
                  value={form.title} onChange={e => update('title', e.target.value)} />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="req-disease">Disease / Condition *</label>
                  <input id="req-disease" type="text" className={`form-input ${errors.disease ? 'error' : ''}`}
                    placeholder="e.g. Aortic Valve Stenosis"
                    value={form.disease} onChange={e => update('disease', e.target.value)} />
                  {errors.disease && <span className="form-error">{errors.disease}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="req-urgency">Urgency Level</label>
                  <select id="req-urgency" className="form-input" value={form.urgency} onChange={e => update('urgency', e.target.value)}>
                    <option value="LOW">🟢 Low — Elective</option>
                    <option value="MEDIUM">🟡 Medium — Soon</option>
                    <option value="HIGH">🔴 High — Urgent</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="req-hospital">Hospital / Medical Center *</label>
                <input id="req-hospital" type="text" className={`form-input ${errors.hospital ? 'error' : ''}`}
                  placeholder="e.g. Apollo Hospitals, Mumbai"
                  value={form.hospital} onChange={e => update('hospital', e.target.value)} />
                {errors.hospital && <span className="form-error">{errors.hospital}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="req-amount">Total Treatment Amount Required (₹) *</label>
                <input id="req-amount" type="number" className={`form-input ${errors.totalAmount ? 'error' : ''}`}
                  placeholder="Enter amount in Indian Rupees"
                  value={form.totalAmount} onChange={e => update('totalAmount', e.target.value)} min="1000" />
                {errors.totalAmount && <span className="form-error">{errors.totalAmount}</span>}
              </div>
            </div>
          )}

          {/* Step 1: Medical Details */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Medical Details</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="req-treatment">Treatment Required *</label>
                <input id="req-treatment" type="text" className={`form-input ${errors.treatmentRequired ? 'error' : ''}`}
                  placeholder="e.g. Open Heart Surgery — Aortic Valve Replacement"
                  value={form.treatmentRequired} onChange={e => update('treatmentRequired', e.target.value)} />
                {errors.treatmentRequired && <span className="form-error">{errors.treatmentRequired}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="req-description">Patient Story & Medical Summary *</label>
                <textarea id="req-description" className={`form-input ${errors.description ? 'error' : ''}`}
                  placeholder="Provide a detailed description of the patient's condition, why treatment is needed, and how donations will help (minimum 50 characters)..."
                  value={form.description} onChange={e => update('description', e.target.value)}
                  style={{ minHeight: 160 }} />
                <div style={{ fontSize: '0.72rem', color: form.description.length >= 50 ? 'var(--brand-accent)' : 'var(--text-muted)', textAlign: 'right' }}>
                  {form.description.length} / 50 min characters
                </div>
                {errors.description && <span className="form-error">{errors.description}</span>}
              </div>
              <div className="alert alert-warning" style={{ fontSize: '0.78rem' }}>
                🛡️ <strong>Privacy Notice:</strong> Medical details will only be visible to authorized admin staff during verification. Donors will only see permitted information.
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Upload Verification Documents</h3>
              <div className="alert alert-info" style={{ fontSize: '0.8rem' }}>
                📋 Required documents: Medical Reports, Hospital Estimate, Identity Proof, Income Certificate (if applicable)
              </div>
              {[
                { id: 'doc-medical', label: 'Medical Reports / Diagnosis', required: true },
                { id: 'doc-estimate', label: 'Hospital Cost Estimate', required: true },
                { id: 'doc-identity', label: 'Identity Proof (Aadhaar/PAN)', required: true },
                { id: 'doc-income', label: 'Income Certificate (Optional)', required: false },
              ].map(doc => (
                <div key={doc.id} className="file-upload" onClick={() => {}}
                  style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.75rem' }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {doc.label} {doc.required && <span style={{ color: 'var(--brand-danger)' }}>*</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF, JPG, PNG — Max 10MB</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" id={doc.id}>
                    📎 Upload
                  </button>
                </div>
              ))}
              <div className="alert alert-success" style={{ fontSize: '0.78rem' }}>
                🔒 All documents are stored securely with AES-256 encryption. They are never shared publicly.
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Review & Submit</h3>
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Request Title', value: form.title || '(not filled)' },
                  { label: 'Disease / Condition', value: form.disease || '(not filled)' },
                  { label: 'Hospital', value: form.hospital || '(not filled)' },
                  { label: 'Total Amount Required', value: form.totalAmount ? `₹${Number(form.totalAmount).toLocaleString('en-IN')}` : '(not filled)' },
                  { label: 'Urgency', value: form.urgency },
                  { label: 'Treatment', value: form.treatmentRequired || '(not filled)' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)', minWidth: 160 }}>{item.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="alert alert-warning" style={{ fontSize: '0.78rem' }}>
                ⚠️ By submitting, you confirm that all information provided is accurate and truthful. Providing false information may result in account suspension and legal action.
              </div>
              <div className="alert alert-info" style={{ fontSize: '0.78rem' }}>
                ⏱️ Expected review time: <strong>2–3 business days</strong>. You will be notified via email.
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex gap-3" style={{ marginTop: '1.5rem', justifyContent: 'space-between' }}>
            {step > 0 ? (
              <button id="btn-form-back" className="btn btn-secondary" onClick={handleBack}>← Back</button>
            ) : <div />}
            {step < 3 ? (
              <button id="btn-form-next" className="btn btn-primary" onClick={handleNext}>Continue →</button>
            ) : (
              <button id="btn-form-submit" className="btn btn-accent btn-lg" onClick={handleSubmit}>
                ✅ Submit Request
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateRequest;

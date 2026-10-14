import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { value: 'DONOR', label: '💝 Donor', desc: 'I want to help patients' },
  { value: 'RECEIVER', label: '🙏 Patient', desc: 'I need medical assistance' },
];

const ROLE_REDIRECT = {
  DONOR: '/donor/dashboard',
  RECEIVER: '/receiver/dashboard',
};

const steps = ['Account Info', 'Personal Info', 'Confirmation'];

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'DONOR',
    age: '',
    gender: '',
    location: '',
    agreeTerms: false,
  });

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const validateStep0 = () => {
    if (!form.name.trim()) return 'Full name is required.';
    if (!form.email.includes('@')) return 'Valid email is required.';
    if (form.phone.length < 10) return 'Valid phone number is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const validateStep1 = () => {
    if (form.role === 'RECEIVER') {
      if (!form.age || isNaN(form.age)) return 'Age is required.';
      if (!form.location.trim()) return 'Location is required.';
    }
    return null;
  };

  const handleNext = () => {
    setError('');
    if (step === 0) {
      const err = validateStep0();
      if (err) { setError(err); return; }
    }
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!form.agreeTerms) { setError('Please agree to the terms.'); return; }
    setError('');
    const res = await register(form);
    if (res.success) {
      navigate(ROLE_REDIRECT[res.user.role] || '/');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ position: 'fixed', top: '30%', right: '25%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 480 }} className="animate-fade-up">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', margin: '0 auto 0.75rem', boxShadow: 'var(--shadow-glow)' }}>❤️</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Join MediCare Connect</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center" style={{ gap: '0', marginBottom: '1.5rem' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: i < step ? 'var(--brand-accent)' : i === step ? 'var(--gradient-primary)' : 'var(--bg-card)',
                  border: `2px solid ${i <= step ? (i < step ? 'var(--brand-accent)' : 'var(--brand-primary)') : 'var(--border-mid)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: i <= step ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.3s',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: '0.65rem', color: i === step ? 'var(--brand-primary)' : 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{s}</div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ height: 2, width: 60, background: i < step ? 'var(--brand-accent)' : 'var(--border-subtle)', margin: '0 0.25rem', marginBottom: '1.25rem', transition: 'background 0.3s' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>

          {/* Step 0: Account Info */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Role Selector */}
              <div className="form-group">
                <div className="form-label" style={{ marginBottom: '0.5rem' }}>I am registering as</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      id={`register-role-${r.value.toLowerCase()}`}
                      onClick={() => update('role', r.value)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: form.role === r.value ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                        background: form.role === r.value ? 'rgba(14,165,233,0.1)' : 'var(--bg-input)',
                        color: form.role === r.value ? 'var(--brand-primary-light)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{r.label}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name</label>
                <input id="reg-name" type="text" className="form-input" placeholder="Enter your full name" value={form.name} onChange={e => update('name', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address</label>
                <input id="reg-email" type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Phone Number</label>
                <input id="reg-phone" type="tel" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <input id="reg-password" type="password" className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={e => update('password', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                <input id="reg-confirm" type="password" className="form-input" placeholder="Repeat your password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="alert alert-info" style={{ fontSize: '0.8rem' }}>
                📋 {form.role === 'RECEIVER' ? 'Patient profile information (accessible only to authorized admins)' : 'Additional donor information (optional)'}
              </div>

              {form.role === 'RECEIVER' && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-age">Age</label>
                    <input id="reg-age" type="number" className="form-input" placeholder="Your age" value={form.age} onChange={e => update('age', e.target.value)} min="1" max="120" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-gender">Gender</label>
                    <select id="reg-gender" className="form-input" value={form.gender} onChange={e => update('gender', e.target.value)}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-location">City / Location</label>
                    <input id="reg-location" type="text" className="form-input" placeholder="e.g. Mumbai, Maharashtra" value={form.location} onChange={e => update('location', e.target.value)} />
                  </div>
                </>
              )}

              {form.role === 'DONOR' && (
                <div className="alert alert-success" style={{ fontSize: '0.8rem' }}>
                  ✅ No additional information needed for donors. You can start browsing requests right after registration!
                </div>
              )}
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.875rem' }}>Account Summary</div>
                {[
                  { label: 'Name', value: form.name },
                  { label: 'Email', value: form.email },
                  { label: 'Phone', value: form.phone },
                  { label: 'Role', value: form.role },
                  ...(form.role === 'RECEIVER' ? [{ label: 'Location', value: form.location }] : []),
                ].map(item => (
                  <div key={item.label} className="flex justify-between" style={{ padding: '0.35rem 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.825rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.value || '—'}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }} onClick={() => update('agreeTerms', !form.agreeTerms)}>
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: `2px solid ${form.agreeTerms ? 'var(--brand-primary)' : 'var(--border-mid)'}`,
                  background: form.agreeTerms ? 'var(--brand-primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                  transition: 'all 0.2s',
                }}>
                  {form.agreeTerms && <span style={{ color: 'white', fontSize: '0.65rem' }}>✓</span>}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  I agree to the Terms of Service and Privacy Policy. I understand that all personal and medical information will be handled securely and with confidentiality.
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" style={{ marginTop: '1rem', fontSize: '0.825rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3" style={{ marginTop: '1.5rem' }}>
            {step > 0 && (
              <button id="btn-reg-back" className="btn btn-secondary" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>
                ← Back
              </button>
            )}
            {step < 2 ? (
              <button id="btn-reg-next" className="btn btn-primary" onClick={handleNext} style={{ flex: 1 }}>
                Continue →
              </button>
            ) : (
              <button id="btn-reg-submit" className="btn btn-accent" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Creating Account...
                  </span>
                ) : '✅ Create Account'}
              </button>
            )}
          </div>

          <div className="divider" />
          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }} id="link-login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

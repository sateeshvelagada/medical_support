import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { value: 'donor', label: '💝 Donor', desc: 'Help patients by donating' },
  { value: 'receiver', label: '🙏 Patient/Receiver', desc: 'Request medical assistance' },
  { value: 'hospital', label: '🏥 Hospital', desc: 'Manage organ requests' },
  { value: 'admin', label: '🛡️ Administrator', desc: 'Platform management' },
];

const DEMO_CREDENTIALS = {
  donor: { email: 'donor@medicare.org', password: 'Password123!' },
  receiver: { email: 'receiver@medicare.org', password: 'Password123!' },
  hospital: { email: 'hospital@medicare.org', password: 'Password123!' },
  admin: { email: 'admin@medicare.org', password: 'Password123!' },
};

const ROLE_REDIRECT = {
  DONOR: '/donor/dashboard',
  RECEIVER: '/receiver/dashboard',
  HOSPITAL: '/hospital/dashboard',
  ADMIN: '/admin/dashboard',
};

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState('donor');
  const [form, setForm] = useState({ email: 'donor@demo.com', password: 'Demo@1234' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setForm({ ...DEMO_CREDENTIALS[role] });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    const res = await login(form.email, form.password);
    if (res.success) {
      navigate(ROLE_REDIRECT[res.user.role] || '/');
    } else {
      setError(res.error || 'Invalid credentials. Please try again.');
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
      {/* Background glow */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '30%',
        width: 500,
        height: 500,
        background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 460 }} className="animate-fade-up">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            margin: '0 auto 1rem',
            boxShadow: 'var(--shadow-glow)',
            animation: 'float 3s ease-in-out infinite',
          }}>
            ❤️
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '0.25rem',
          }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Sign in to MediCare Connect
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {/* Role Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="form-label" style={{ marginBottom: '0.75rem' }}>Select Your Role</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  id={`role-${r.value}`}
                  onClick={() => handleRoleSelect(r.value)}
                  style={{
                    padding: '0.625rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedRole === r.value
                      ? '1px solid var(--brand-primary)'
                      : '1px solid var(--border-subtle)',
                    background: selectedRole === r.value
                      ? 'rgba(14,165,233,0.1)'
                      : 'var(--bg-input)',
                    color: selectedRole === r.value ? 'var(--brand-primary-light)' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                >
                  <div>{r.label}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.7, fontWeight: 400, marginTop: 2 }}>
                    {r.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Demo Hint */}
          <div className="alert alert-info" style={{ marginBottom: '1.25rem', fontSize: '0.78rem' }}>
            🎯 <strong>Prototype Mode:</strong> Credentials are pre-filled for the selected role.
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" style={{ fontSize: '0.825rem' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              id="btn-login-submit"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.925rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Authenticating...
                </span>
              ) : '🔐 Sign In Securely'}
            </button>
          </form>

          <div className="divider" />

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ color: 'var(--brand-primary)', fontWeight: 600 }}
              id="link-register"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} id="link-home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

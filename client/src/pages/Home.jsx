import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATS = [
  { label: 'Patients Helped', value: '2,847', icon: '❤️', color: 'var(--brand-primary)' },
  { label: 'Total Raised', value: '₹4.2Cr', icon: '💰', color: 'var(--brand-accent)' },
  { label: 'Active Donors', value: '12,500+', icon: '🤝', color: 'var(--brand-secondary)' },
  { label: 'Partner Hospitals', value: '180+', icon: '🏥', color: 'var(--brand-organ)' },
];

const FEATURES = [
  {
    icon: '🔐',
    title: 'Verified & Secure',
    desc: 'Every medical request undergoes rigorous admin verification before donors can view it. Your trust is our priority.',
    gradient: 'var(--gradient-primary)',
  },
  {
    icon: '🫀',
    title: 'Organ Emergency Module',
    desc: 'A dedicated emergency pathway connects organ-needing patients with authorized hospitals and donor networks instantly.',
    gradient: 'var(--gradient-organ)',
  },
  {
    icon: '🛡️',
    title: 'Privacy Protected',
    desc: 'Sensitive patient data and documents are stored securely with role-based access control — only authorized personnel can view.',
    gradient: 'var(--gradient-donor)',
  },
  {
    icon: '💳',
    title: 'Transparent Donations',
    desc: 'Every donation is recorded with full transaction history and audit trails, ensuring complete financial transparency.',
    gradient: 'var(--gradient-accent)',
  },
];

const ROLES = [
  {
    id: 'donor',
    icon: '💝',
    title: 'Donor',
    desc: 'Help verified patients by donating to their medical treatment funds.',
    gradient: 'var(--gradient-donor)',
    color: '#a5b4fc',
    can: ['Browse verified treatment requests', 'Make secure donations', 'Track donation history', 'View impact reports'],
  },
  {
    id: 'receiver',
    icon: '🙏',
    title: 'Patient / Receiver',
    desc: 'Create and manage medical assistance requests with document verification.',
    gradient: 'var(--gradient-receiver)',
    color: '#38bdf8',
    can: ['Create treatment requests', 'Upload medical documents', 'Track verification status', 'Submit organ requests'],
  },
  {
    id: 'hospital',
    icon: '🏥',
    title: 'Hospital',
    desc: 'Coordinate organ requests and verify medical information for your patients.',
    gradient: 'var(--gradient-hospital)',
    color: '#fbbf24',
    can: ['View authorized organ requests', 'Verify medical information', 'Update request status', 'Coordinate with networks'],
  },
  {
    id: 'admin',
    icon: '🛡️',
    title: 'Administrator',
    desc: 'Oversee the entire platform — verify users, requests, and manage system integrity.',
    gradient: 'var(--gradient-admin)',
    color: '#f87171',
    can: ['Verify users & documents', 'Approve/reject requests', 'Manage hospitals', 'Monitor all transactions'],
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Navbar */}
      <nav className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div className="container flex items-center justify-between" style={{ height: 64 }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
            }}>
              ❤️
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
            }}>
              MediCare <span style={{ color: 'var(--brand-primary)' }}>Connect</span>
            </span>
          </div>
          <div className="flex gap-3">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/login')}
              id="nav-login"
            >
              Sign In
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/register')}
              id="nav-register"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ padding: '5rem 0 4rem' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(14,165,233,0.08)',
            border: '1px solid rgba(14,165,233,0.2)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            color: 'var(--brand-primary-light)',
            fontWeight: 600,
          }}>
            <span className="animate-pulse" style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--brand-accent)', display: 'inline-block',
            }} />
            Secure Medical Assistance Platform • India
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            maxWidth: 800,
            margin: '0 auto 1.5rem',
          }}>
            Save Lives Through{' '}
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Verified
            </span>{' '}
            Medical Support
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 620,
            margin: '0 auto 2.5rem',
          }}>
            Connect patients in critical need with compassionate donors. 
            Every request is verified by our admin team before going live. 
            Emergency organ support built in.
          </p>

          <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/register')}
              id="hero-cta-register"
            >
              💝 Start Donating
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/register')}
              id="hero-cta-request"
            >
              🙏 Request Support
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {STATS.map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: '0.25rem',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 800,
              marginBottom: '0.75rem',
            }}>
              Who Uses MediCare Connect?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              A secure platform built for everyone involved in the healthcare support ecosystem.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {ROLES.map((role) => (
              <div
                key={role.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: hoveredRole === role.id
                    ? `1px solid ${role.color}40`
                    : '1px solid var(--border-subtle)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => navigate('/register')}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: role.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  marginBottom: '1rem',
                  boxShadow: `0 4px 15px ${role.color}30`,
                }}>
                  {role.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                }}>
                  {role.title}
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {role.desc}
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {role.can.map((item) => (
                    <li key={item} style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span style={{ color: role.color, fontSize: '0.6rem' }}>✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 800,
              marginBottom: '0.75rem',
            }}>
              Built for Trust & Safety
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card">
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: f.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  marginBottom: '1rem',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Flow */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              How Verification Works
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Only verified requests are shown to donors — protecting everyone.
            </p>
          </div>
          <div className="flex items-center justify-center" style={{ gap: '0', flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
            {[
              { step: '01', label: 'Patient Registers', icon: '👤' },
              { step: '02', label: 'Submit Request + Documents', icon: '📄' },
              { step: '03', label: 'Admin Review', icon: '🛡️' },
              { step: '04', label: 'Medical Verification', icon: '✅' },
              { step: '05', label: 'Donors Can Help', icon: '💝' },
            ].map((s, i) => (
              <React.Fragment key={s.step}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 100 }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: i === 4 ? 'var(--gradient-primary)' : 'var(--bg-card)',
                    border: `2px solid ${i === 4 ? 'var(--brand-primary)' : 'var(--border-mid)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    boxShadow: i === 4 ? 'var(--shadow-glow)' : 'none',
                  }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontWeight: 700, letterSpacing: '0.06em' }}>
                    STEP {s.step}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
                {i < 4 && (
                  <div style={{
                    height: 2,
                    width: 40,
                    background: 'var(--border-mid)',
                    flexShrink: 0,
                    marginBottom: '1.5rem',
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, rgba(14,165,233,0.06), rgba(99,102,241,0.06))',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.25rem',
            fontWeight: 800,
            marginBottom: '1rem',
          }}>
            Ready to Make a Difference?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
            Join thousands of donors helping real patients across India.
          </p>
          <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/register')}
              id="cta-join"
            >
              Join Now — It's Free
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/login')}
              id="cta-signin"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 0',
      }}>
        <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '1.1rem' }}>❤️</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
              MediCare Connect
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Prototype — Medical Assistance & Organ Support Platform © 2026
          </div>
          <div className="flex gap-4" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>🔒 Secure</span>
            <span>🛡️ Verified</span>
            <span>🏥 Medical Grade</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

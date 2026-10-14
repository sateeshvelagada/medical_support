import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-base)',
    textAlign: 'center',
    padding: '2rem',
  }}>
    <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🔍</div>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.5rem' }}>404</h1>
    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Page not found. The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-primary btn-lg" id="btn-go-home">← Back to Home</Link>
  </div>
);

export default NotFound;

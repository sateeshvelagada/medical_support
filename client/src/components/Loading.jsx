import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '1.5rem',
      background: 'var(--bg-base)',
    }}>
      {/* Animated Logo */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '16px',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          animation: 'float 2s ease-in-out infinite',
          boxShadow: '0 0 30px rgba(14,165,233,0.35)',
        }}>
          ❤️
        </div>
        <div style={{
          position: 'absolute',
          inset: -4,
          borderRadius: 20,
          border: '2px solid transparent',
          borderTopColor: 'var(--brand-primary)',
          animation: 'spin 1.2s linear infinite',
        }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.25rem',
        }}>
          MediCare Connect
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{message}</div>
      </div>
    </div>
  );
};

export default Loading;

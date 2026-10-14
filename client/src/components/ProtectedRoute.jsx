import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ fontSize: '4rem' }}>🚫</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
          Access Denied
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          You don't have permission to access this page. 
          Your role (<strong>{user.role}</strong>) is not authorized here.
        </p>
        <button className="btn btn-primary" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

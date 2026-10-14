import React from 'react';

// Role-aware sidebar navigation configuration
const NAV_CONFIG = {
  DONOR: [
    { icon: '📊', label: 'Dashboard', path: '/donor/dashboard' },
    { icon: '🔍', label: 'Browse Requests', path: '/donor/browse' },
    { icon: '💳', label: 'Donation History', path: '/donor/history' },
  ],
  RECEIVER: [
    { icon: '📊', label: 'Dashboard', path: '/receiver/dashboard' },
    { icon: '✏️', label: 'Create Request', path: '/receiver/create-request' },
    { icon: '📋', label: 'My Requests', path: '/receiver/requests' },
    { icon: '🫀', label: 'Organ Request', path: '/receiver/organ-request' },
  ],
  HOSPITAL: [
    { icon: '📊', label: 'Dashboard', path: '/hospital/dashboard' },
    { icon: '🫀', label: 'Organ Requests', path: '/hospital/organ-requests' },
  ],
  ADMIN: [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '✅', label: 'Verify Requests', path: '/admin/verify-requests' },
    { icon: '📄', label: 'Verify Documents', path: '/admin/verify-documents' },
    { icon: '👥', label: 'Manage Users', path: '/admin/users' },
    { icon: '🏥', label: 'Manage Hospitals', path: '/admin/hospitals' },
  ],
};

const ROLE_GRADIENTS = {
  DONOR: 'var(--gradient-donor)',
  RECEIVER: 'var(--gradient-receiver)',
  HOSPITAL: 'var(--gradient-hospital)',
  ADMIN: 'var(--gradient-admin)',
};

const Sidebar = ({ user, currentPath, onNavigate, onLogout }) => {
  const navItems = NAV_CONFIG[user?.role] || [];
  const roleGradient = ROLE_GRADIENTS[user?.role] || 'var(--gradient-primary)';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          ❤️
        </div>
        <div>
          <div className="sidebar-logo-text">MediCare</div>
          <div className="sidebar-logo-sub">Connect Platform</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>

        {navItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-link ${currentPath === item.path ? 'active' : ''}`}
            onClick={() => onNavigate(item.path)}
            id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: '0.5rem' }}>System</div>

        <button
          className="sidebar-link"
          onClick={() => onNavigate('/profile')}
          id="nav-profile"
        >
          <span>👤</span>
          <span>My Profile</span>
        </button>

        <button
          className="sidebar-link"
          onClick={() => onNavigate('/notifications')}
          id="nav-notifications"
          style={{ position: 'relative' }}
        >
          <span>🔔</span>
          <span>Notifications</span>
          <div
            className="notif-dot"
            style={{ marginLeft: 'auto' }}
          />
        </button>
      </nav>

      {/* User Info + Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user" style={{ marginBottom: '0.5rem' }}>
          <div
            className="sidebar-avatar"
            style={{ background: roleGradient }}
          >
            {user?.avatar || user?.name?.[0] || '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name" style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {user?.name || 'User'}
            </div>
            <div className="sidebar-user-role">
              <span
                className={`badge badge-${user?.role?.toLowerCase()}`}
                style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}
              >
                {user?.role}
              </span>
            </div>
          </div>
        </div>
        <button
          className="btn btn-secondary w-full btn-sm"
          onClick={onLogout}
          id="btn-logout"
          style={{ width: '100%', marginTop: '0.25rem' }}
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';

const RequestCard = ({ request, onView, onDonate, role }) => {
  const progress = Math.round((request.amountReceived / request.totalAmount) * 100);

  const statusClass = {
    PENDING: 'badge-pending',
    VERIFIED: 'badge-verified',
    ACTIVE: 'badge-active',
    COMPLETED: 'badge-completed',
    REJECTED: 'badge-rejected',
  }[request.status] || 'badge-pending';

  const urgencyColor = {
    HIGH: 'var(--brand-danger)',
    MEDIUM: 'var(--brand-warning)',
    LOW: 'var(--brand-accent)',
  }[request.urgency] || 'var(--brand-primary)';

  return (
    <div className="request-card animate-fade-up">
      <div className="request-card-header">
        <div className="flex items-center justify-between gap-2" style={{ marginBottom: '0.5rem' }}>
          <span className={`badge ${statusClass}`}>
            {request.status}
          </span>
          {request.urgency && (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: urgencyColor,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              ⚡ {request.urgency} URGENCY
            </span>
          )}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.25rem',
        }}>
          {request.title}
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="tag">🏥 {request.hospital}</span>
          <span className="tag">🦠 {request.disease}</span>
        </div>
      </div>

      <div className="request-card-body">
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {request.description}
        </p>

        {/* Funding Progress */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div className="flex justify-between" style={{ marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Raised
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
              {progress}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between" style={{ marginTop: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brand-accent)' }}>
              ₹{request.amountReceived?.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              of ₹{request.totalAmount?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      <div className="request-card-footer">
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          📅 {new Date(request.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          })}
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onView?.(request)}
            id={`btn-view-request-${request.id}`}
          >
            Details
          </button>
          {role === 'DONOR' && request.status === 'VERIFIED' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onDonate?.(request)}
              id={`btn-donate-${request.id}`}
            >
              💝 Donate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;

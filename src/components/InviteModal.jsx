import { useState } from 'react';

export default function InviteModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock invite
    setSent(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {sent ? (
          <div className="text-center py-4 animate-in">
            <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--color-moss-soft)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-moss)" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-ink)' }}>Invite sent!</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--color-ink-soft)' }}>
              An invitation has been sent to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold" style={{ color: 'var(--color-ink)' }}>
                Invite a team member
              </h2>
              <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="invite-email" className="input-label">Email address</label>
                <input
                  id="invite-email"
                  type="email"
                  className="input"
                  placeholder="teammate@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-5">
                <label htmlFor="invite-role" className="input-label">Role</label>
                <select
                  id="invite-role"
                  className="select"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option value="member">Member — can view and edit services</option>
                  <option value="admin">Admin — can manage members and settings</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send invite
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

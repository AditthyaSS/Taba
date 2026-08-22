import { useState } from 'react';
import { X, Check, Send } from 'lucide-react';

export default function InviteModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {sent ? (
          <div className="text-center py-6 animate-in">
            <div className="mx-auto mb-4 flex items-center justify-center" style={{ width: 52, height: 52, background: '#CCFF00', border: '3px solid #000' }}>
              <Check size={24} color="#000" strokeWidth={3} />
            </div>
            <h3 className="font-display text-lg font-bold mb-2" style={{ color: '#000' }}>Invite Sent!</h3>
            <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)' }}>
              An invitation has been sent to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold" style={{ color: '#000' }}>Invite Team Member</h2>
              <button onClick={onClose} style={{ background: 'transparent', border: '2px solid #000', padding: '4px', cursor: 'pointer', display: 'flex' }}>
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="invite-email" className="input-label">Email address</label>
                <input id="invite-email" type="email" className="input" placeholder="teammate@company.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
              </div>
              <div className="mb-6">
                <label htmlFor="invite-role" className="input-label">Role</label>
                <select id="invite-role" className="select" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="member">Member — can view and edit services</option>
                  <option value="admin">Admin — can manage members and settings</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Send size={14} strokeWidth={2.5} />
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

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { inviteMember } from '../lib/api';
import { X, Check, Send, Copy, Link as LinkIcon, Shield } from 'lucide-react';

export default function InviteModal({ orgId, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const { user, org } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setSending(true);
      await inviteMember(orgId, email.trim(), role, user?.id);
      setSent(true);
      toast.success(`Sent invite to ${email}`);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.message);
      setSending(false);
      toast.error(`Invite failed: ${err.message}`);
    }
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/signup?org=${encodeURIComponent(org?.name || 'Workspace')}&role=${role}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    toast.success('Copied magic invitation link to clipboard');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {sent ? (
          <div className="text-center py-6 animate-in">
            <div className="mx-auto mb-4 flex items-center justify-center" style={{ width: 56, height: 56, background: '#CCFF00', border: '3px solid #000', boxShadow: '3px 3px 0 #000' }}>
              <Check size={28} color="#000" strokeWidth={3} />
            </div>
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#000' }}>Invitation Dispatched!</h3>
            <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)' }}>
              An invitation email and access credentials have been sent to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-black">
              <div>
                <h2 className="font-display text-lg font-bold" style={{ color: '#000' }}>INVITE TEAM MEMBER</h2>
                <p className="font-mono text-xs text-black/60">Grant access to {org?.name || 'this workspace'}</p>
              </div>
              <button onClick={onClose} style={{ background: 'transparent', border: '2px solid #000', padding: '4px', cursor: 'pointer', display: 'flex' }}>
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            {error && (
              <div
                className="mb-5 px-4 py-3 font-mono text-sm font-semibold"
                style={{ background: '#FFE0E0', color: '#D32F2F', border: '3px solid #D32F2F' }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="invite-email" className="input-label">Teammate Email Address *</label>
                <input
                  id="invite-email"
                  type="email"
                  className="input font-mono"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="invite-role" className="input-label">Role &amp; Permissions *</label>
                <select id="invite-role" className="select font-mono" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="member">Member — View, add, and manage assigned subscriptions</option>
                  <option value="admin">Admin — Manage team members, billing, and all subscriptions</option>
                </select>
              </div>

              {/* Quick Share Link */}
              <div className="p-3 bg-[#FAF8F2] border-2 border-black/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <LinkIcon size={14} className="text-black/60 flex-shrink-0" />
                  <span className="font-mono text-xs text-black/70 truncate">Or copy direct registration link</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="font-mono text-xs font-bold px-2 py-1 bg-white border-2 border-black flex items-center gap-1 hover:bg-[#CCFF00] cursor-pointer flex-shrink-0"
                >
                  {copiedLink ? <Check size={12} color="#16A34A" /> : <Copy size={12} />}
                  {copiedLink ? 'Copied' : 'Copy Link'}
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-black/10">
                <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  <Send size={14} strokeWidth={2.5} />
                  {sending ? 'Sending…' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

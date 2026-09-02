import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Check, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { error: err } = await resetPassword(email);
    if (err) {
      setError(err.message || 'Failed to send reset email');
      toast.error('Reset request failed');
    } else {
      setSent(true);
      toast.success('Password reset email dispatched');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'transparent' }}>
      <div className="w-full max-w-md animate-in">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4">
            <img src="/logo.png" alt="Taba" style={{ height: 40, width: 'auto' }} />
          </div>
          <p
            className="font-mono text-xs font-bold mb-2"
            style={{
              color: 'var(--color-ink-soft)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Password Recovery
          </p>
          <h1
            className="font-display mb-3"
            style={{
              color: 'var(--color-ink)',
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            RESET PASSWORD.
          </h1>
          <p className="text-sm font-mono" style={{ color: 'var(--color-ink-soft)' }}>
            Enter your email and we'll send you recovery instructions.
          </p>
        </div>

        {sent ? (
          <div
            className="card animate-in text-center"
            style={{ padding: '32px', background: '#DCFCE7', borderColor: '#000' }}
          >
            <div
              className="flex items-center justify-center mx-auto mb-4"
              style={{
                width: 52,
                height: 52,
                background: '#CCFF00',
                border: '3px solid #000',
                boxShadow: '3px 3px 0 #000',
              }}
            >
              <Check size={28} strokeWidth={3} color="#000" />
            </div>
            <h2 className="font-display text-xl font-bold mb-2" style={{ color: '#000' }}>
              CHECK YOUR INBOX
            </h2>
            <p className="font-mono text-xs mb-5" style={{ color: 'var(--color-ink-soft)' }}>
              We sent a password recovery link to <strong>{email}</strong>.
            </p>
            <Link to="/signin" className="btn btn-secondary w-full justify-center">
              <ArrowLeft size={14} strokeWidth={2.5} /> Back to login
            </Link>
          </div>
        ) : (
          <div className="card" style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="reset-email" className="input-label">Email Address</label>
                <input
                  id="reset-email"
                  type="email"
                  className="input font-mono"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div
                  className="mb-4 px-4 py-2.5 font-mono text-xs font-semibold"
                  style={{
                    background: '#FFE0E0',
                    color: '#D32F2F',
                    border: '2px solid #D32F2F',
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full justify-center mb-3"
                style={{ padding: '12px 20px' }}
              >
                SEND RECOVERY LINK
              </button>
            </form>

            <p className="mt-4 text-center text-xs font-mono" style={{ color: 'var(--color-ink-soft)' }}>
              Remembered your password?{' '}
              <Link to="/signin" style={{ color: '#000', textDecoration: 'underline', fontWeight: 800 }}>
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

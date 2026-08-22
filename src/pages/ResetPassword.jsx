import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { error: err } = await resetPassword(email);
    if (err) {
      setError(err.message || 'Failed to send reset email');
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'transparent' }}>
      <div className="w-full max-w-md animate-in">
        {/* Header */}
        <div className="mb-8">
          <p
            className="font-mono text-xs font-bold mb-3"
            style={{
              color: 'var(--color-ink-soft)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Reset
          </p>
          <h1
            className="font-display mb-4"
            style={{
              color: 'var(--color-ink)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            FORGOT YOUR PASSWORD.
          </h1>
          <p className="text-base" style={{ color: 'var(--color-ink-soft)' }}>
            Enter your email and we'll send you a link to reset it.
          </p>
        </div>

        {sent ? (
          <div
            className="card animate-in"
            style={{ padding: '32px', background: 'var(--color-green-soft)', borderColor: 'var(--color-green)' }}
          >
            <div
              className="flex items-center justify-center mb-4"
              style={{
                width: 48, height: 48,
                background: 'var(--color-lime)',
                border: '3px solid #000',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="square">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--color-ink)' }}>
              CHECK YOUR EMAIL.
            </h2>
            <p className="text-sm mb-5" style={{ color: 'var(--color-ink-soft)' }}>
              We sent a reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
            </p>
            <Link to="/signin" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="reset-email" className="input-label">Email</label>
              <input
                id="reset-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && (
              <div
                className="mb-5 px-4 py-3 font-mono text-sm font-semibold"
                style={{
                  background: 'var(--color-red-soft)',
                  color: 'var(--color-red)',
                  border: '3px solid var(--color-red)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full justify-center"
              style={{ padding: '14px 22px', fontSize: '0.875rem' }}
            >
              SEND RESET LINK
            </button>
          </form>
        )}

        <p className="mt-6 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
          Remember your password?{' '}
          <Link to="/signin" style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm animate-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl mb-1" style={{ color: 'var(--color-ink)' }}>taba</h1>
          <p className="text-sm" style={{ color: 'var(--color-ink-soft)' }}>
            Reset your password
          </p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-moss-soft)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-moss)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>
                Check your email
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--color-ink-soft)' }}>
                We sent a reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
              </p>
              <Link to="/signin" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>
                Forgot your password?
              </h2>
              <p className="text-sm mb-5" style={{ color: 'var(--color-ink-soft)' }}>
                Enter your email and we'll send you a link to reset it.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="reset-email" className="input-label">Email</label>
                  <input
                    id="reset-email"
                    type="email"
                    className="input"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="mb-4 px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--color-vermillion-soft)', color: 'var(--color-vermillion)' }}>
                    {error}
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full justify-center" style={{ padding: '10px 18px' }}>
                  Send reset link
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--color-ink-soft)' }}>
          Remember your password?{' '}
          <Link to="/signin" style={{ color: 'var(--color-indigo)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

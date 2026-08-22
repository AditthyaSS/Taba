import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err.message || 'Failed to sign in');
    } else {
      navigate('/');
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
            Welcome back
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
            LOG IN TO TABA.
          </h1>
          <p className="text-base" style={{ color: 'var(--color-ink-soft)' }}>
            Your subscriptions. Your team. Nobody argues about who owns what.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="signin-email" className="input-label">Email</label>
            <input
              id="signin-email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="signin-password" className="input-label" style={{ marginBottom: 0 }}>Password</label>
              <Link
                to="/reset-password"
                className="font-mono text-xs font-semibold"
                style={{ color: 'var(--color-ink-soft)', textDecoration: 'underline', textTransform: 'uppercase', letterSpacing: '0.06em' }}
              >
                Forgot?
              </Link>
            </div>
            <input
              id="signin-password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
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
            disabled={loading}
            style={{ padding: '14px 22px', fontSize: '0.875rem' }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Logging in…
              </span>
            ) : 'LOG IN'}
          </button>
        </form>

        <p className="mt-6 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
          No account yet?{' '}
          <Link to="/signup" style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

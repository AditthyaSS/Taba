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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm animate-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl mb-1" style={{ color: 'var(--color-ink)' }}>taba</h1>
          <p className="text-sm" style={{ color: 'var(--color-ink-soft)' }}>
            Track every subscription in one place
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--color-ink)' }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="signin-email" className="input-label">Email</label>
              <input
                id="signin-email"
                type="email"
                className="input"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="signin-password" className="input-label">Password</label>
                <Link
                  to="/reset-password"
                  className="text-xs"
                  style={{ color: 'var(--color-indigo)', textDecoration: 'none' }}
                >
                  Forgot password?
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
              <div className="mb-4 px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--color-vermillion-soft)', color: 'var(--color-vermillion)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full justify-center"
              disabled={loading}
              style={{ padding: '10px 18px' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--color-ink-soft)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-indigo)', textDecoration: 'none', fontWeight: 500 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

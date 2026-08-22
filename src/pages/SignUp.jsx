import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const { error: err } = await signUp(email, password, fullName);
    if (err) {
      setError(err.message || 'Failed to sign up');
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
            New here
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
            SIGN UP TO TABA.
          </h1>
          <p className="text-base" style={{ color: 'var(--color-ink-soft)' }}>
            Track every subscription your team pays for. Your name is what they see on the dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="signup-name" className="input-label">Your name</label>
            <input
              id="signup-name"
              type="text"
              className="input"
              placeholder="Rio"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-5">
            <label htmlFor="signup-email" className="input-label">Email</label>
            <input
              id="signup-email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="signup-password" className="input-label">Password</label>
            <input
              id="signup-password"
              type="password"
              className="input"
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
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
                Creating account…
              </span>
            ) : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="mt-6 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
          Already have an account?{' '}
          <Link to="/signin" style={{ color: 'var(--color-ink)', textDecoration: 'underline', fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

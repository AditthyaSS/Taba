import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, enterDemoMode, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err.message || 'Failed to sign in. Try Demo mode below.');
      toast.error('Authentication error');
    } else {
      toast.success('Logged in to TABA');
      navigate('/');
    }
  };

  const handleLaunchDemo = () => {
    enterDemoMode();
    toast.success('Launched Interactive Demo Workspace');
    navigate('/');
  };

  const handleQuickFill = () => {
    setEmail('alex@acmerobotics.io');
    setPassword('demo1234');
    toast.info('Autofilled demo credentials');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'transparent' }}>
      <div className="w-full max-w-md animate-in">
        {/* Logo & Header */}
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
            Subscription Tracker
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
            LOG IN TO TABA.
          </h1>
          <p className="text-sm font-mono" style={{ color: 'var(--color-ink-soft)' }}>
            Track every cloud &amp; SaaS subscription your team pays for.
          </p>
        </div>

        {/* Demo Mode Quick Launch Card */}
        <div
          className="mb-6 p-4 border-2 border-black bg-[var(--color-lime)] rounded-sm shadow-[3px_3px_0_#000000] cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#000000] transition-all"
          onClick={handleLaunchDemo}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} strokeWidth={3} className="text-black" />
              <strong className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                Instant Interactive Demo
              </strong>
            </div>
            <ArrowRight size={16} strokeWidth={3} className="text-black" />
          </div>
          <p className="font-mono text-xs text-black/80 mt-1">
            Test all features with 10+ preloaded subscriptions without setup.
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="signin-email" className="input-label">Email Address</label>
              <input
                id="signin-email"
                type="email"
                className="input font-mono"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="signin-password" className="input-label" style={{ marginBottom: 0 }}>Password</label>
                <Link
                  to="/reset-password"
                  className="font-mono text-xs font-semibold underline text-black"
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="signin-password"
                type="password"
                className="input font-mono"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div
                className="mb-4 px-4 py-2.5 font-mono text-xs font-semibold rounded-sm"
                style={{
                  background: 'var(--color-red-soft)',
                  color: 'var(--color-red)',
                  border: '2px solid var(--color-red)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full justify-center mb-3"
              disabled={loading}
              style={{ padding: '12px 20px' }}
            >
              {loading ? 'Logging in…' : 'LOG IN'}
            </button>

            <button
              type="button"
              onClick={handleQuickFill}
              className="btn btn-secondary w-full justify-center font-mono text-xs"
            >
              Autofill Sample Credentials
            </button>
          </form>

          <p className="mt-5 text-center text-xs font-mono" style={{ color: 'var(--color-ink-soft)' }}>
            Need an account?{' '}
            <Link to="/signup" style={{ color: '#000000', textDecoration: 'underline', fontWeight: 800 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

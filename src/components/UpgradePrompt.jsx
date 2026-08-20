import { useNavigate } from 'react-router-dom';
import { PLANS } from '../data/mockData';

export default function UpgradePrompt({ currentPlan, onClose }) {
  const navigate = useNavigate();
  const currentPlanData = PLANS[currentPlan];

  const upgradeTiers = Object.entries(PLANS).filter(([key]) => {
    const order = ['free', 'starter', 'team', 'growth'];
    return order.indexOf(key) > order.indexOf(currentPlan);
  });

  return (
    <div className="max-w-3xl mx-auto animate-in">
      {/* Back */}
      <button
        onClick={onClose}
        className="btn btn-ghost mb-4"
        style={{ padding: '4px 0', gap: '4px' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Go back
      </button>

      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-indigo-soft)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-indigo)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <h1 className="font-display text-2xl font-medium mb-2" style={{ color: 'var(--color-ink)' }}>
          You've reached your plan limit
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-ink-soft)' }}>
          Your <strong>{currentPlanData.name}</strong> plan allows up to {currentPlanData.maxServices === Infinity ? 'unlimited' : currentPlanData.maxServices} services.
          Upgrade to add more.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {upgradeTiers.map(([key, plan]) => (
          <div
            key={key}
            className="card"
            style={{
              padding: '24px',
              border: key === 'team' ? '2px solid var(--color-indigo)' : undefined,
            }}
          >
            {key === 'team' && (
              <span className="badge badge-indigo mb-3">Most popular</span>
            )}
            <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>{plan.name}</h3>
            <p className="font-mono text-2xl font-medium mb-4" style={{ color: 'var(--color-ink)' }}>
              ${plan.price}<span className="text-sm font-normal" style={{ color: 'var(--color-ink-faint)' }}>/mo</span>
            </p>

            <ul className="space-y-2 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-moss)" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('/settings')}
              className={`btn w-full justify-center ${key === 'team' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Upgrade to {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

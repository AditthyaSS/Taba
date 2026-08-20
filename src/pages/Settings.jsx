import { useState } from 'react';
import { MOCK_ORG, PLANS } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { org, setOrg } = useAuth();
  const currentOrg = org || MOCK_ORG;
  const [orgName, setOrgName] = useState(currentOrg.name);
  const [saved, setSaved] = useState(false);

  const currentPlan = PLANS[currentOrg.plan];
  const planOrder = ['free', 'starter', 'team', 'growth'];
  const currentPlanIndex = planOrder.indexOf(currentOrg.plan);

  const handleSaveName = (e) => {
    e.preventDefault();
    // Mock save
    if (setOrg) setOrg({ ...currentOrg, name: orgName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleManageBilling = () => {
    // Will redirect to Stripe Customer Portal
    alert('This will redirect to Stripe Customer Portal when backend is connected.');
  };

  const handleUpgrade = (tierKey) => {
    // Will create Stripe Checkout session
    alert(`This will create a Stripe Checkout session for the ${PLANS[tierKey].name} plan when backend is connected.`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-medium" style={{ color: 'var(--color-ink)' }}>
          Settings
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-ink-soft)' }}>
          Manage your organization and billing
        </p>
      </div>

      {/* Organization Name */}
      <section className="mb-8">
        <div className="section-label mb-3">
          <span className="dot" style={{ background: 'var(--color-indigo)' }} />
          Organization
        </div>
        <div className="card animate-in" style={{ padding: '24px' }}>
          <form onSubmit={handleSaveName}>
            <div className="mb-4">
              <label htmlFor="org-name" className="input-label">Organization name</label>
              <input
                id="org-name"
                type="text"
                className="input"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={saved || orgName === currentOrg.name}
            >
              {saved ? (
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Saved
                </span>
              ) : 'Save changes'}
            </button>
          </form>
        </div>
      </section>

      {/* Current Plan */}
      <section className="mb-8">
        <div className="section-label mb-3">
          <span className="dot" style={{ background: 'var(--color-moss)' }} />
          Current plan
        </div>
        <div className="card animate-in" style={{ padding: '24px', animationDelay: '0.08s' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-ink)' }}>
                  {currentPlan.name}
                </h3>
                <span className="badge badge-indigo">Current</span>
              </div>
              <p className="font-mono text-2xl font-medium" style={{ color: 'var(--color-ink)' }}>
                ${currentPlan.price}<span className="text-sm font-normal" style={{ color: 'var(--color-ink-faint)' }}>/mo</span>
              </p>
            </div>
            {currentOrg.plan !== 'free' && (
              <button onClick={handleManageBilling} className="btn btn-secondary btn-sm">
                Manage billing
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentPlan.features.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-moss)" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {f}
              </div>
            ))}
            {currentPlan.missingFeatures.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-ink-faint)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade Options */}
      {currentOrg.plan !== 'growth' && (
        <section>
          <div className="section-label mb-3">
            <span className="dot" style={{ background: '#D4A843' }} />
            Upgrade your plan
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planOrder.slice(currentPlanIndex + 1).map((key, i) => {
              const plan = PLANS[key];
              const isPopular = key === 'team';
              return (
                <div
                  key={key}
                  className="card animate-in"
                  style={{
                    padding: '24px',
                    animationDelay: `${(i + 2) * 0.08}s`,
                    border: isPopular ? '2px solid var(--color-indigo)' : undefined,
                  }}
                >
                  {isPopular && <span className="badge badge-indigo mb-2">Most popular</span>}
                  <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>{plan.name}</h3>
                  <p className="font-mono text-2xl font-medium mb-4" style={{ color: 'var(--color-ink)' }}>
                    ${plan.price}<span className="text-sm font-normal" style={{ color: 'var(--color-ink-faint)' }}>/mo</span>
                  </p>

                  <ul className="space-y-1.5 mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-ink-soft)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-moss)" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(key)}
                    className={`btn w-full justify-center ${isPopular ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Upgrade to {plan.name}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

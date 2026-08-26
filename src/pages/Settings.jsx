import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateOrgName } from '../lib/api';
import { PLANS } from '../data/helpers';
import { Check, X, Zap, CreditCard } from 'lucide-react';

const PLAN_COLORS = {
  starter: { bg: '#CCFF00', text: '#000' },
  team: { bg: '#FF1B6B', text: 'white' },
  growth: { bg: '#4400FF', text: 'white' },
};

export default function Settings() {
  const { org, setOrg, refreshOrg } = useAuth();
  const [orgName, setOrgName] = useState(org?.name || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const currentPlan = PLANS[org?.plan || 'free'];
  const planOrder = ['free', 'starter', 'team', 'growth'];
  const currentPlanIndex = planOrder.indexOf(org?.plan || 'free');

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!org?.id) return;

    try {
      setSaving(true);
      setError(null);
      const updated = await updateOrgName(org.id, orgName);
      setOrg(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleManageBilling = () => {
    alert('This will redirect to Stripe Customer Portal when Edge Functions are deployed.');
  };

  const handleUpgrade = (tierKey) => {
    alert(`This will create a Stripe Checkout session for the ${PLANS[tierKey].name} plan when Edge Functions are deployed.`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="mb-8">
        <h1 className="font-display" style={{ color: '#000', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          SETTINGS
        </h1>
        <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Manage your organization and billing
        </p>
      </div>

      {/* Organization Name */}
      <section className="mb-10">
        <div className="section-label mb-4">
          <span className="dot" style={{ background: '#4400FF', borderColor: '#000' }} />
          Organization
        </div>
        <div className="card animate-in" style={{ padding: '24px' }}>
          <form onSubmit={handleSaveName}>
            <div className="mb-5">
              <label htmlFor="org-name" className="input-label">Organization name</label>
              <input id="org-name" type="text" className="input" value={orgName} onChange={e => setOrgName(e.target.value)} required />
            </div>
            {error && (
              <div className="mb-4 px-4 py-3 font-mono text-sm font-semibold" style={{ background: 'var(--color-red-soft)', color: '#D32F2F', border: '3px solid #D32F2F' }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-sm" disabled={saved || saving || orgName === org?.name}>
              {saved ? (
                <span className="flex items-center gap-1.5">
                  <Check size={14} strokeWidth={3} />
                  Saved
                </span>
              ) : saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>
      </section>

      {/* Current Plan */}
      <section className="mb-10">
        <div className="section-label mb-4">
          <span className="dot" style={{ background: '#CCFF00', borderColor: '#000' }} />
          Current plan
        </div>
        <div className="card animate-in" style={{ padding: '24px', animationDelay: '0.08s' }}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-display text-xl font-bold" style={{ color: '#000' }}>{currentPlan.name}</h3>
                <span className="badge badge-indigo">Current</span>
              </div>
              <p className="font-mono text-3xl font-bold" style={{ color: '#000' }}>
                ${currentPlan.price}<span className="text-sm font-semibold" style={{ color: 'var(--color-ink-faint)' }}>/mo</span>
              </p>
            </div>
            {org?.plan !== 'free' && (
              <button onClick={handleManageBilling} className="btn btn-secondary btn-sm">
                <CreditCard size={14} strokeWidth={2.5} />
                Manage billing
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
            {currentPlan.features.map(f => (
              <div key={f} className="flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.02em' }}>
                <Check size={14} strokeWidth={3} style={{ color: '#CCFF00', flexShrink: 0 }} />
                <span>{f}</span>
              </div>
            ))}
            {currentPlan.missingFeatures.map(f => (
              <div key={f} className="flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--color-ink-faint)', letterSpacing: '0.02em' }}>
                <X size={14} strokeWidth={2.5} style={{ color: 'var(--color-ink-faint)', flexShrink: 0 }} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade Options */}
      {org?.plan !== 'growth' && (
        <section>
          <div className="section-label mb-4">
            <span className="dot" style={{ background: '#FF8A00', borderColor: '#000' }} />
            Upgrade your plan
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {planOrder.slice(currentPlanIndex + 1).map((key, i) => {
              const plan = PLANS[key];
              const isPopular = key === 'team';
              const colors = PLAN_COLORS[key] || { bg: 'var(--color-surface-raised)', text: '#000' };
              return (
                <div
                  key={key}
                  className="card-enter"
                  style={{
                    padding: '24px',
                    animationDelay: `${(i + 2) * 0.08}s`,
                    background: colors.bg,
                    color: colors.text,
                    border: '3px solid #000',
                    boxShadow: '4px 4px 0 #000',
                  }}
                >
                  {isPopular && <span className="badge mb-3" style={{ background: '#000', color: '#fff' }}>Most popular</span>}
                  <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="font-mono text-3xl font-bold mb-5">
                    ${plan.price}<span className="text-sm font-semibold" style={{ opacity: 0.7 }}>/mo</span>
                  </p>

                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 font-mono text-xs" style={{ letterSpacing: '0.02em', opacity: 0.9 }}>
                        <Check size={12} strokeWidth={3} style={{ flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(key)}
                    className="btn w-full justify-center"
                    style={{
                      background: colors.text === 'white' ? 'white' : '#000',
                      color: colors.text === 'white' ? '#000' : 'white',
                      border: '3px solid #000',
                      boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                    }}
                  >
                    <Zap size={14} strokeWidth={2.5} />
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

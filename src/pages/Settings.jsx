import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { updateOrgName, fetchServices } from '../lib/api';
import { PLANS, exportServicesToCSV } from '../data/helpers';
import { Check, X, Download } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', label: 'USD ($) — United States Dollar' },
  { code: 'EUR', label: 'EUR (€) — Euro' },
  { code: 'GBP', label: 'GBP (£) — British Pound' },
  { code: 'CAD', label: 'CAD (CA$) — Canadian Dollar' },
  { code: 'AUD', label: 'AUD (AU$) — Australian Dollar' },
  { code: 'INR', label: 'INR (₹) — Indian Rupee' },
  { code: 'JPY', label: 'JPY (¥) — Japanese Yen' },
];

export default function Settings() {
  const { org, setOrg, changePlan, currency, setCurrency } = useAuth();
  const toast = useToast();

  const [orgName, setOrgName] = useState(org?.name || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!org?.id) return;
    fetchServices(org.id).then(data => setServices(data)).catch(() => {});
  }, [org?.id]);

  const currentPlanKey = org?.plan || 'free';
  const currentPlan = PLANS[currentPlanKey] || PLANS.free;
  const planOrder = ['free', 'starter', 'team', 'growth'];

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!org?.id) return;

    try {
      setSaving(true);
      setError(null);
      const updated = await updateOrgName(org.id, orgName);
      setOrg(updated);
      setSaved(true);
      toast.success('Organization name updated');
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to update: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchPlan = async (tierKey) => {
    try {
      await changePlan(tierKey);
      toast.success(`Plan updated to ${PLANS[tierKey].name} Tier!`);
    } catch (err) {
      toast.error(`Plan update failed: ${err.message}`);
    }
  };

  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    toast.success(`Currency switched to ${newCurr}`);
  };

  const handleExportData = () => {
    exportServicesToCSV(services);
    toast.success(`Downloaded CSV backup for ${services.length} subscriptions`);
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div className="mb-8">
        <h1 className="font-display" style={{ color: '#000', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          SETTINGS
        </h1>
        <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Workspace configurations, currency &amp; subscription plan
        </p>
      </div>

      {/* Organization Name */}
      <section className="mb-10">
        <div className="section-label mb-4">
          <span className="dot" style={{ background: '#4400FF', borderColor: '#000' }} />
          Organization Profile
        </div>
        <div className="card animate-in" style={{ padding: '24px' }}>
          <form onSubmit={handleSaveName}>
            <div className="mb-4">
              <label htmlFor="org-name" className="input-label">Workspace / Organization Name</label>
              <input
                id="org-name"
                type="text"
                className="input"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 font-mono text-sm font-semibold" style={{ background: '#FFE0E0', color: '#D32F2F', border: '3px solid #D32F2F' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={saved || saving || orgName === org?.name}
            >
              {saved ? (
                <span className="flex items-center gap-1.5">
                  <Check size={14} strokeWidth={3} />
                  Saved
                </span>
              ) : saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </section>

      {/* Currency Preferences */}
      <section className="mb-10">
        <div className="section-label mb-4">
          <span className="dot" style={{ background: '#CCFF00', borderColor: '#000' }} />
          Global Currency Preference
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <label htmlFor="currency-select" className="input-label">Display Currency</label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              id="currency-select"
              className="select font-mono flex-1"
              value={currency}
              onChange={e => handleCurrencyChange(e.target.value)}
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <p className="input-hint font-mono text-xs mt-2">
            Applied across all service cost summaries, cards, and monthly projections.
          </p>
        </div>
      </section>

      {/* Plan & Usage */}
      <section className="mb-10">
        <div className="section-label mb-4">
          <span className="dot" style={{ background: '#FF1B6B', borderColor: '#000' }} />
          Current Subscription Plan &amp; Limits
        </div>

        <div className="card mb-6" style={{ padding: '24px' }}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-display text-2xl font-bold" style={{ color: '#000' }}>{currentPlan.name} Plan</h3>
                <span className="badge badge-indigo">Active</span>
              </div>
              <p className="font-mono text-3xl font-bold" style={{ color: '#000' }}>
                ${currentPlan.price}<span className="text-sm font-semibold" style={{ color: 'var(--color-ink-faint)' }}>/month</span>
              </p>
            </div>

            <div className="p-3 bg-[#FAF8F2] border-2 border-black font-mono text-xs">
              <span className="font-bold text-black block mb-1">Service Capacity:</span>
              <span>{services.length} / {currentPlan.maxServices === Infinity ? 'Unlimited' : currentPlan.maxServices} Used</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 border-t-2 border-black/10">
            {currentPlan.features.map(f => (
              <div key={f} className="flex items-center gap-2 font-mono text-xs" style={{ color: '#000' }}>
                <Check size={14} strokeWidth={3} style={{ color: '#16A34A', flexShrink: 0 }} />
                <span>{f}</span>
              </div>
            ))}
            {currentPlan.missingFeatures.map(f => (
              <div key={f} className="flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                <X size={14} strokeWidth={2.5} style={{ color: 'var(--color-ink-faint)', flexShrink: 0 }} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Plan Tier Matrix */}
        <div className="section-label mb-4">
          <span className="dot" style={{ background: '#FF8A00', borderColor: '#000' }} />
          Available Tiers (Switch Instantly)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {planOrder.map(key => {
            const plan = PLANS[key];
            const isCurrent = key === currentPlanKey;

            return (
              <div
                key={key}
                className="card flex flex-col justify-between"
                style={{
                  padding: '20px',
                  background: isCurrent ? '#FAF8F2' : 'var(--color-surface-raised)',
                  border: isCurrent ? '4px solid #000' : '3px solid #000',
                  boxShadow: isCurrent ? '6px 6px 0 #CCFF00' : '4px 4px 0 #000',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-display font-bold text-lg">{plan.name}</h4>
                    {isCurrent && <span className="badge badge-moss">Current</span>}
                  </div>

                  <p className="font-mono text-2xl font-bold mb-4">
                    ${plan.price}<span className="text-xs font-semibold text-black/60">/mo</span>
                  </p>

                  <ul className="space-y-1.5 font-mono text-xs mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-1.5">
                        <Check size={12} strokeWidth={3} color="#16A34A" className="flex-shrink-0" />
                        <span className="text-black/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleSwitchPlan(key)}
                  disabled={isCurrent}
                  className={`btn w-full justify-center btn-sm ${isCurrent ? 'btn-secondary opacity-60 cursor-default' : 'btn-primary'}`}
                >
                  {isCurrent ? 'Current Tier' : `Switch to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Export & Backup */}
      <section className="mb-10">
        <div className="section-label mb-4">
          <span className="dot" style={{ background: '#000', borderColor: '#000' }} />
          Data Export &amp; Backup
        </div>

        <div className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ padding: '24px' }}>
          <div>
            <h3 className="font-display text-base font-bold mb-1">Export Subscription Records</h3>
            <p className="font-mono text-xs text-black/60">
              Download your entire subscription inventory as a CSV spreadsheet for accounting or offline storage.
            </p>
          </div>

          <button onClick={handleExportData} className="btn btn-secondary flex-shrink-0">
            <Download size={15} strokeWidth={2.5} />
            Export CSV
          </button>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { fetchServiceById, fetchServices, createService, updateService, deleteService, createAuditEntry } from '../lib/api';
import { PLANS, CATEGORY_ICONS, formatCost } from '../data/helpers';
import { POPULAR_SAAS_PRESETS } from '../lib/demoData';
import UpgradePrompt from '../components/UpgradePrompt';
import {
  ChevronLeft, Check, Trash2, Loader, Sparkles, Shield
} from 'lucide-react';

const CATEGORIES = Object.keys(CATEGORY_ICONS);
const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY'];

function getFutureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { org, members, user, currency: defaultCurrency } = useAuth();
  const toast = useToast();
  const isEditing = !!id;

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [serviceCount, setServiceCount] = useState(0);

  const [form, setForm] = useState({
    name: '',
    category: 'Development',
    provider: '',
    cost: '',
    currency: defaultCurrency || 'USD',
    billing_cycle: 'monthly',
    renewal_date: getFutureDate(30),
    owner_user_id: user?.id || '',
    credential_location: '',
    status: 'active',
    notes: '',
  });

  // Load existing service for editing
  useEffect(() => {
    if (!isEditing) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const svc = await fetchServiceById(id);
        if (!cancelled && svc) {
          setForm({
            name: svc.name || '',
            category: svc.category || 'Development',
            provider: svc.provider || '',
            cost: svc.cost !== undefined ? svc.cost.toString() : '',
            currency: svc.currency || defaultCurrency || 'USD',
            billing_cycle: svc.billing_cycle || 'monthly',
            renewal_date: svc.renewal_date || '',
            owner_user_id: svc.owner_user_id || '',
            credential_location: svc.credential_location || '',
            status: svc.status || 'active',
            notes: svc.notes || '',
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id, isEditing, defaultCurrency]);

  // Count services for plan check
  useEffect(() => {
    if (!org?.id) return;
    fetchServices(org.id).then(data => {
      setServiceCount(data.length);
    }).catch(() => {});
  }, [org?.id]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  // Quick preset apply
  const applyPreset = (preset) => {
    setForm(prev => ({
      ...prev,
      name: preset.name,
      category: preset.category,
      provider: preset.provider,
      cost: preset.defaultCost ? preset.defaultCost.toString() : prev.cost,
      currency: preset.currency || prev.currency,
      billing_cycle: preset.billing_cycle || prev.billing_cycle,
      credential_location: `1Password → ${preset.category} → ${preset.name}`,
    }));
    toast.info(`Applied template: ${preset.name}`);
  };

  // Find owner name for user ID
  const getOwnerName = (userId) => {
    if (!userId) return null;
    const member = members.find(m => m.user_id === userId || m.id === userId);
    return member?.name || user?.full_name || null;
  };

  const parsedCost = parseFloat(form.cost) || 0;
  const monthlyCost = form.billing_cycle === 'annual' ? parsedCost / 12 : parsedCost;
  const annualCost = form.billing_cycle === 'monthly' ? parsedCost * 12 : parsedCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Plan limit check
    if (!isEditing && org) {
      const plan = PLANS[org.plan || 'free'];
      if (serviceCount >= plan.maxServices) {
        setShowUpgrade(true);
        return;
      }
    }

    const ownerName = getOwnerName(form.owner_user_id);
    const serviceData = {
      name: form.name.trim(),
      category: form.category,
      provider: form.provider.trim(),
      cost: parsedCost,
      currency: form.currency,
      billing_cycle: form.billing_cycle,
      renewal_date: form.renewal_date || null,
      owner_user_id: form.owner_user_id || null,
      owner_name: ownerName,
      credential_location: form.credential_location.trim(),
      status: form.status,
      notes: form.notes.trim(),
    };

    try {
      setSubmitting(true);

      if (isEditing) {
        const updated = await updateService(id, serviceData);
        await createAuditEntry(org.id, {
          actor_user_id: user?.id,
          actor_name: user?.full_name || user?.email || 'Admin',
          action: 'updated',
          target_service_name: updated.name,
          target_service_id: updated.id,
          detail: { field: 'subscription', new: serviceData.name },
        });
        toast.success(`Updated "${updated.name}"`);
      } else {
        const created = await createService(org.id, serviceData);
        await createAuditEntry(org.id, {
          actor_user_id: user?.id,
          actor_name: user?.full_name || user?.email || 'Admin',
          action: 'created',
          target_service_name: created.name,
          target_service_id: created.id,
          detail: { cost: serviceData.cost },
        });
        toast.success(`Created subscription "${created.name}"`);
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${form.name}"? This action cannot be undone.`)) return;

    try {
      setSubmitting(true);
      await createAuditEntry(org.id, {
        actor_user_id: user?.id,
        actor_name: user?.full_name || user?.email || 'Admin',
        action: 'deleted',
        target_service_name: form.name,
        target_service_id: id,
        detail: { reason: 'Deleted by user' },
      });
      await deleteService(id);
      toast.success(`Deleted "${form.name}"`);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  if (showUpgrade) {
    return <UpgradePrompt currentPlan={org?.plan || 'free'} onClose={() => setShowUpgrade(false)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center animate-in">
          <Loader size={32} className="mx-auto mb-3 animate-spin" style={{ color: '#000' }} />
          <p className="font-mono text-xs font-bold" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.1em' }}>
            Loading subscription details…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Top navigation */}
      <button
        onClick={() => navigate('/')}
        className="btn btn-ghost mb-6"
        style={{ padding: '6px 0', gap: '6px' }}
      >
        <ChevronLeft size={16} strokeWidth={3} />
        Back to services
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display" style={{ color: '#000', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {isEditing ? 'EDIT SUBSCRIPTION' : 'ADD NEW SUBSCRIPTION'}
          </h1>
          <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {isEditing ? `Editing ${form.name}` : 'Record a new cloud or SaaS tool for your team'}
          </p>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-sm"
            disabled={submitting}
            style={{
              background: '#FFE0E0',
              color: '#D32F2F',
              borderColor: '#D32F2F',
            }}
          >
            <Trash2 size={14} strokeWidth={2.5} />
            Delete Service
          </button>
        )}
      </div>

      {/* Quick SaaS Preset Catalog (Only for new services) */}
      {!isEditing && (
        <div className="card mb-6" style={{ background: '#FAF8F2', padding: '16px 20px' }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} strokeWidth={2.5} style={{ color: '#4400FF' }} />
            <span className="font-mono text-xs font-bold uppercase" style={{ color: '#000', letterSpacing: '0.08em' }}>
              Quick-Fill Popular SaaS Presets:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SAAS_PRESETS.map(preset => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="font-mono text-xs font-semibold px-2.5 py-1 transition-all"
                style={{
                  background: 'var(--color-surface)',
                  border: '1.5px solid #000',
                  color: '#000',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0 #000',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#CCFF00'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; }}
              >
                + {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit}>
        <div className="card animate-in space-y-6" style={{ padding: '28px' }}>
          {error && (
            <div className="px-4 py-3 font-mono text-sm font-semibold" style={{ background: '#FFE0E0', color: '#D32F2F', border: '3px solid #D32F2F' }}>
              {error}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div>
            <div className="section-label mb-4">
              <span className="dot" style={{ background: '#CCFF00', borderColor: '#000' }} />
              Basic Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="svc-name" className="input-label">Service Name *</label>
                <input
                  id="svc-name"
                  type="text"
                  className="input"
                  placeholder="e.g. AWS Production, GitHub Enterprise"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="svc-category" className="input-label">Category *</label>
                <select
                  id="svc-category"
                  className="select"
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  required
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="svc-provider" className="input-label">Provider / Vendor</label>
                <input
                  id="svc-provider"
                  type="text"
                  className="input"
                  placeholder="e.g. Amazon Web Services, Figma, Inc."
                  value={form.provider}
                  onChange={e => handleChange('provider', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="svc-status" className="input-label">Subscription Status</label>
                <select
                  id="svc-status"
                  className="select"
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="needs_review">Needs Review (Unused / Under Review)</option>
                  <option value="cancelled">Cancelled (Archived)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Cost & Billing Cycle with Live Run-Rate Calculator */}
          <div className="pt-4 border-t-2 border-black/10">
            <div className="section-label mb-4">
              <span className="dot" style={{ background: '#4400FF', borderColor: '#000' }} />
              Pricing &amp; Billing Cycle
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="svc-cost" className="input-label">Cost Amount *</label>
                <input
                  id="svc-cost"
                  type="number"
                  step="any"
                  min="0"
                  className="input font-mono font-bold"
                  placeholder="0.00"
                  value={form.cost}
                  onChange={e => handleChange('cost', e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="svc-currency" className="input-label">Currency</label>
                <select
                  id="svc-currency"
                  className="select font-mono"
                  value={form.currency}
                  onChange={e => handleChange('currency', e.target.value)}
                >
                  {CURRENCIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="svc-cycle" className="input-label">Billing Cycle</label>
                <select
                  id="svc-cycle"
                  className="select"
                  value={form.billing_cycle}
                  onChange={e => handleChange('billing_cycle', e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                  <option value="one_time">One-time payment</option>
                </select>
              </div>
            </div>

            {/* Live Cost Calculation Bar */}
            {parsedCost > 0 && (
              <div className="p-3 bg-[#E8E0FF] border-2 border-black font-mono text-xs flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-[#4400FF]">
                  ⚡ Calculated Impact:
                </span>
                <span className="font-bold text-black">
                  Monthly Equivalent: {formatCost(monthlyCost, form.currency)}/mo
                </span>
                <span className="font-bold text-black">
                  Annual Projection: {formatCost(annualCost, form.currency)}/yr
                </span>
              </div>
            )}
          </div>

          {/* Section 3: Renewal Date & Presets */}
          <div className="pt-4 border-t-2 border-black/10">
            <div className="section-label mb-4">
              <span className="dot" style={{ background: '#FF1B6B', borderColor: '#000' }} />
              Renewal Date
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label htmlFor="svc-renewal" className="input-label">Next Renewal / Billing Date</label>
                <input
                  id="svc-renewal"
                  type="date"
                  className="input font-mono"
                  value={form.renewal_date}
                  onChange={e => handleChange('renewal_date', e.target.value)}
                />
              </div>

              <div>
                <span className="input-label">Quick Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '+7 Days', days: 7 },
                    { label: '+14 Days', days: 14 },
                    { label: '+30 Days', days: 30 },
                    { label: '+1 Year', days: 365 },
                  ].map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleChange('renewal_date', getFutureDate(p.days))}
                      className="font-mono text-xs font-bold px-2 py-1 bg-white border-2 border-black hover:bg-[#CCFF00] cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Owner & Security Credential Location */}
          <div className="pt-4 border-t-2 border-black/10">
            <div className="section-label mb-4">
              <span className="dot" style={{ background: '#FF8A00', borderColor: '#000' }} />
              Ownership &amp; Credential Pointer
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="svc-owner" className="input-label">Assigned Service Owner</label>
                <select
                  id="svc-owner"
                  className="select"
                  value={form.owner_user_id}
                  onChange={e => handleChange('owner_user_id', e.target.value)}
                >
                  <option value="">— Unassigned (Needs review) —</option>
                  {members.map(m => (
                    <option key={m.id || m.user_id} value={m.user_id || m.id}>
                      {m.name || m.email} ({m.role})
                    </option>
                  ))}
                </select>
                <p className="input-hint font-mono text-xs">
                  The person responsible for renewals, seat allocation, and cancellations.
                </p>
              </div>

              <div>
                <label htmlFor="svc-credentials" className="input-label">Credential Pointer Location</label>
                <input
                  id="svc-credentials"
                  type="text"
                  className="input font-mono text-xs"
                  placeholder="e.g. 1Password → Engineering Vault → AWS Root"
                  value={form.credential_location}
                  onChange={e => handleChange('credential_location', e.target.value)}
                />
                <p className="input-hint font-mono text-xs flex items-center gap-1" style={{ color: '#9F1239' }}>
                  <Shield size={12} strokeWidth={2.5} />
                  Plain-text pointer only. Never enter passwords or raw keys!
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="svc-notes" className="input-label">Additional Notes &amp; Seat Details</label>
              <textarea
                id="svc-notes"
                rows={3}
                className="input font-mono text-xs"
                placeholder="License tier, number of seats, discount codes, or contract terms…"
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t-2 border-black/10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="save-service-btn"
            >
              <Check size={16} strokeWidth={3} />
              {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Subscription'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

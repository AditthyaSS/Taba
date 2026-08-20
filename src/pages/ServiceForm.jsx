import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_SERVICES, MOCK_MEMBERS, MOCK_ORG, PLANS, CATEGORY_ICONS } from '../data/mockData';
import UpgradePrompt from '../components/UpgradePrompt';

const CATEGORIES = Object.keys(CATEGORY_ICONS);
const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY'];

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: '',
    provider: '',
    cost: '',
    currency: 'USD',
    billing_cycle: 'monthly',
    renewal_date: '',
    owner_user_id: '',
    credential_location: '',
    status: 'active',
    notes: '',
  });

  // Load existing service data if editing
  useEffect(() => {
    if (isEditing) {
      const svc = MOCK_SERVICES.find(s => s.id === id);
      if (svc) {
        setForm({
          name: svc.name || '',
          category: svc.category || '',
          provider: svc.provider || '',
          cost: svc.cost?.toString() || '',
          currency: svc.currency || 'USD',
          billing_cycle: svc.billing_cycle || 'monthly',
          renewal_date: svc.renewal_date || '',
          owner_user_id: svc.owner_user_id || '',
          credential_location: svc.credential_location || '',
          status: svc.status || 'active',
          notes: svc.notes || '',
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check plan limits for new services
    if (!isEditing) {
      const plan = PLANS[MOCK_ORG.plan];
      if (MOCK_SERVICES.length >= plan.maxServices) {
        setShowUpgrade(true);
        return;
      }
    }

    // Mock save
    setSaved(true);
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      navigate('/');
    }
  };

  if (showUpgrade) {
    return <UpgradePrompt currentPlan={MOCK_ORG.plan} onClose={() => setShowUpgrade(false)} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => navigate('/')}
        className="btn btn-ghost mb-4"
        style={{ padding: '4px 0', gap: '4px' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to dashboard
      </button>

      <div className="card animate-in" style={{ padding: '28px' }}>
        <h1 className="font-display text-xl font-medium mb-6" style={{ color: 'var(--color-ink)' }}>
          {isEditing ? 'Edit service' : 'Add a new service'}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Name + Provider (side by side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="svc-name" className="input-label">Service name *</label>
              <input
                id="svc-name"
                type="text"
                className="input"
                placeholder="e.g. AWS, Figma, Slack"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="svc-provider" className="input-label">Provider</label>
              <input
                id="svc-provider"
                type="text"
                className="input"
                placeholder="e.g. Amazon, Microsoft"
                value={form.provider}
                onChange={e => handleChange('provider', e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="svc-category" className="input-label">Category</label>
            <select
              id="svc-category"
              className="select"
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
              ))}
            </select>
          </div>

          {/* Cost + Currency + Billing Cycle */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label htmlFor="svc-cost" className="input-label">Cost</label>
              <input
                id="svc-cost"
                type="number"
                className="input font-mono"
                placeholder="0.00"
                value={form.cost}
                onChange={e => handleChange('cost', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="svc-currency" className="input-label">Currency</label>
              <select
                id="svc-currency"
                className="select"
                value={form.currency}
                onChange={e => handleChange('currency', e.target.value)}
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="svc-cycle" className="input-label">Billing cycle</label>
              <select
                id="svc-cycle"
                className="select"
                value={form.billing_cycle}
                onChange={e => handleChange('billing_cycle', e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="one_time">One-time</option>
              </select>
            </div>
          </div>

          {/* Renewal Date */}
          <div className="mb-4">
            <label htmlFor="svc-renewal" className="input-label">Renewal date</label>
            <input
              id="svc-renewal"
              type="date"
              className="input font-mono"
              value={form.renewal_date}
              onChange={e => handleChange('renewal_date', e.target.value)}
            />
          </div>

          {/* Owner */}
          <div className="mb-4">
            <label htmlFor="svc-owner" className="input-label">Owner</label>
            <select
              id="svc-owner"
              className="select"
              value={form.owner_user_id}
              onChange={e => handleChange('owner_user_id', e.target.value)}
            >
              <option value="">Unassigned</option>
              {MOCK_MEMBERS.map(m => (
                <option key={m.user_id} value={m.user_id}>{m.name} ({m.email})</option>
              ))}
            </select>
          </div>

          {/* Credential Location */}
          <div className="mb-4">
            <label htmlFor="svc-cred" className="input-label">Credential location</label>
            <input
              id="svc-cred"
              type="text"
              className="input"
              placeholder="e.g. 1Password → AWS Root"
              value={form.credential_location}
              onChange={e => handleChange('credential_location', e.target.value)}
            />
            <p className="input-hint">
              ⚠️ This is a plain-text pointer only. Never store actual passwords, API keys, or secrets here.
            </p>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label htmlFor="svc-status" className="input-label">Status</label>
            <select
              id="svc-status"
              className="select"
              value={form.status}
              onChange={e => handleChange('status', e.target.value)}
            >
              <option value="active">Active</option>
              <option value="needs_review">Needs review</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="svc-notes" className="input-label">Notes</label>
            <textarea
              id="svc-notes"
              className="input"
              placeholder="Any additional details about this service…"
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-ghost text-sm"
                  style={{ color: 'var(--color-vermillion)' }}
                >
                  Delete service
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saved}>
                {saved ? (
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Saved!
                  </span>
                ) : isEditing ? 'Save changes' : 'Add service'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

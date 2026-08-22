import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_SERVICES, MOCK_MEMBERS, MOCK_ORG, PLANS, CATEGORY_ICONS } from '../data/mockData';
import UpgradePrompt from '../components/UpgradePrompt';
import { ChevronLeft, Check, Trash2 } from 'lucide-react';

const CATEGORIES = Object.keys(CATEGORY_ICONS);
const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY'];

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: '', category: '', provider: '', cost: '', currency: 'USD',
    billing_cycle: 'monthly', renewal_date: '', owner_user_id: '',
    credential_location: '', status: 'active', notes: '',
  });

  useEffect(() => {
    if (isEditing) {
      const svc = MOCK_SERVICES.find(s => s.id === id);
      if (svc) {
        setForm({
          name: svc.name || '', category: svc.category || '', provider: svc.provider || '',
          cost: svc.cost?.toString() || '', currency: svc.currency || 'USD',
          billing_cycle: svc.billing_cycle || 'monthly', renewal_date: svc.renewal_date || '',
          owner_user_id: svc.owner_user_id || '', credential_location: svc.credential_location || '',
          status: svc.status || 'active', notes: svc.notes || '',
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing) {
      const plan = PLANS[MOCK_ORG.plan];
      if (MOCK_SERVICES.length >= plan.maxServices) { setShowUpgrade(true); return; }
    }
    setSaved(true);
    setTimeout(() => navigate('/'), 1200);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this service?')) navigate('/');
  };

  if (showUpgrade) return <UpgradePrompt currentPlan={MOCK_ORG.plan} onClose={() => setShowUpgrade(false)} />;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} className="btn btn-ghost mb-5" style={{ padding: '4px 0', gap: '6px' }}>
        <ChevronLeft size={16} strokeWidth={3} />
        Back to dashboard
      </button>

      <div className="card animate-in" style={{ padding: '28px' }}>
        <h1 className="font-display font-bold mb-6" style={{ color: '#000', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label htmlFor="svc-name" className="input-label">Service name *</label>
              <input id="svc-name" type="text" className="input" placeholder="e.g. AWS, Figma" value={form.name} onChange={e => handleChange('name', e.target.value)} required autoFocus />
            </div>
            <div>
              <label htmlFor="svc-provider" className="input-label">Provider</label>
              <input id="svc-provider" type="text" className="input" placeholder="e.g. Amazon" value={form.provider} onChange={e => handleChange('provider', e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="svc-category" className="input-label">Category</label>
            <select id="svc-category" className="select" value={form.category} onChange={e => handleChange('category', e.target.value)}>
              <option value="">Select a category…</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label htmlFor="svc-cost" className="input-label">Cost</label>
              <input id="svc-cost" type="number" className="input font-mono" placeholder="0.00" value={form.cost} onChange={e => handleChange('cost', e.target.value)} min="0" step="0.01" />
            </div>
            <div>
              <label htmlFor="svc-currency" className="input-label">Currency</label>
              <select id="svc-currency" className="select" value={form.currency} onChange={e => handleChange('currency', e.target.value)}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="svc-cycle" className="input-label">Billing cycle</label>
              <select id="svc-cycle" className="select" value={form.billing_cycle} onChange={e => handleChange('billing_cycle', e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="one_time">One-time</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="svc-renewal" className="input-label">Renewal date</label>
            <input id="svc-renewal" type="date" className="input font-mono" value={form.renewal_date} onChange={e => handleChange('renewal_date', e.target.value)} />
          </div>

          <div className="mb-4">
            <label htmlFor="svc-owner" className="input-label">Owner</label>
            <select id="svc-owner" className="select" value={form.owner_user_id} onChange={e => handleChange('owner_user_id', e.target.value)}>
              <option value="">Unassigned</option>
              {MOCK_MEMBERS.map(m => <option key={m.user_id} value={m.user_id}>{m.name} ({m.email})</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="svc-cred" className="input-label">Credential location</label>
            <input id="svc-cred" type="text" className="input" placeholder="e.g. 1Password → AWS Root" value={form.credential_location} onChange={e => handleChange('credential_location', e.target.value)} />
            <p className="input-hint font-mono" style={{ fontSize: '0.625rem', letterSpacing: '0.04em' }}>
              ⚠️ Plain-text pointer only. Never store actual passwords here.
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="svc-status" className="input-label">Status</label>
            <select id="svc-status" className="select" value={form.status} onChange={e => handleChange('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="needs_review">Needs review</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="svc-notes" className="input-label">Notes</label>
            <textarea id="svc-notes" className="input" placeholder="Additional details…" value={form.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} style={{ resize: 'vertical' }} />
          </div>

          <div className="flex items-center justify-between" style={{ borderTop: '3px solid #000', paddingTop: '20px' }}>
            <div>
              {isEditing && (
                <button type="button" onClick={handleDelete} className="btn btn-ghost" style={{ color: '#D32F2F' }}>
                  <Trash2 size={14} strokeWidth={2.5} /> Delete
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saved}>
                {saved ? <><Check size={16} strokeWidth={3} /> Saved!</> : isEditing ? 'Save changes' : 'Add service'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

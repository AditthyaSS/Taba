import { useNavigate } from 'react-router-dom';
import { PLANS } from '../data/helpers';
import { ChevronLeft, Zap, Check } from 'lucide-react';

const PLAN_COLORS = {
  starter: { bg: '#CCFF00', text: '#000' },
  team: { bg: '#FF1B6B', text: 'white' },
  growth: { bg: '#4400FF', text: 'white' },
};

export default function UpgradePrompt({ currentPlan, onClose }) {
  const navigate = useNavigate();
  const currentPlanData = PLANS[currentPlan];

  const upgradeTiers = Object.entries(PLANS).filter(([key]) => {
    const order = ['free', 'starter', 'team', 'growth'];
    return order.indexOf(key) > order.indexOf(currentPlan);
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-in">
      <button onClick={onClose} className="btn btn-ghost mb-5" style={{ padding: '4px 0', gap: '6px' }}>
        <ChevronLeft size={16} strokeWidth={3} />
        Go back
      </button>

      <div className="text-center mb-10">
        <div className="mx-auto mb-5 flex items-center justify-center" style={{ width: 64, height: 64, background: '#FF8A00', border: '3px solid #000', boxShadow: '4px 4px 0 #000' }}>
          <Zap size={32} color="#000" strokeWidth={2.5} />
        </div>
        <h1 className="font-display font-bold mb-3" style={{ color: '#000', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
          PLAN LIMIT REACHED
        </h1>
        <p className="font-mono text-xs" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.06em', maxWidth: '480px', margin: '0 auto' }}>
          Your <strong>{currentPlanData.name}</strong> plan allows up to {currentPlanData.maxServices === Infinity ? 'unlimited' : currentPlanData.maxServices} services. Upgrade to add more.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {upgradeTiers.map(([key, plan]) => {
          const colors = PLAN_COLORS[key] || { bg: 'var(--color-surface-raised)', text: '#000' };
          return (
            <div key={key} style={{ padding: '24px', background: colors.bg, color: colors.text, border: '3px solid #000', boxShadow: '4px 4px 0 #000' }}>
              {key === 'team' && <span className="badge mb-3" style={{ background: '#000', color: '#fff' }}>Most popular</span>}
              <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
              <p className="font-mono text-3xl font-bold mb-5">
                ${plan.price}<span className="text-sm font-semibold" style={{ opacity: 0.7 }}>/mo</span>
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 font-mono text-xs" style={{ opacity: 0.9 }}>
                    <Check size={12} strokeWidth={3} style={{ flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/settings')}
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
    </div>
  );
}

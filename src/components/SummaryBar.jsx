import { formatCost, daysUntil, PLANS } from '../data/helpers';
import { useAuth } from '../contexts/AuthContext';
import { Layers, DollarSign, TrendingUp, CalendarClock, ShieldCheck } from 'lucide-react';

export default function SummaryBar({ services, activeFilter, onFilterChange }) {
  const { currency, org } = useAuth();
  const currentPlan = PLANS[org?.plan || 'free'] || PLANS.free;

  const activeServices = services.filter(s => s.status !== 'cancelled');
  const needsReviewServices = services.filter(s => s.status === 'needs_review' || !s.owner_user_id);

  const renewingSoonServices = services.filter(s => {
    if (!s.renewal_date || s.status === 'cancelled') return false;
    const days = daysUntil(s.renewal_date);
    return days >= 0 && days <= 14;
  });

  const totalMonthlyCost = activeServices.reduce((sum, s) => {
    if (s.billing_cycle === 'annual') return sum + (s.cost / 12);
    if (s.billing_cycle === 'monthly') return sum + s.cost;
    return sum;
  }, 0);

  const upcomingRenewalCost = renewingSoonServices.reduce((sum, s) => {
    return sum + s.cost;
  }, 0);

  const stats = [
    {
      id: 'all',
      label: 'Active Subscriptions',
      value: `${activeServices.length}`,
      subtext: currentPlan.maxServices === Infinity ? 'Unlimited' : `${activeServices.length}/${currentPlan.maxServices} on ${currentPlan.name}`,
      accent: '#CCFF00',
      icon: Layers,
    },
    {
      id: 'monthly',
      label: 'Monthly Burn Rate',
      value: formatCost(totalMonthlyCost, currency),
      subtext: 'Normalized per month',
      mono: true,
      accent: '#FF1B6B',
      icon: DollarSign,
    },
    {
      id: 'annual',
      label: 'Annual Projection',
      value: formatCost(totalMonthlyCost * 12, currency),
      subtext: '12-month run-rate',
      mono: true,
      accent: '#4400FF',
      icon: TrendingUp,
    },
    {
      id: 'renewing',
      label: 'Renewing in 14 Days',
      value: `${renewingSoonServices.length} (${formatCost(upcomingRenewalCost, currency)})`,
      subtext: renewingSoonServices.length === 0 ? 'No immediate renewals' : `${renewingSoonServices.length} subscriptions due`,
      mono: true,
      accent: '#FF8A00',
      icon: CalendarClock,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const isSelected = activeFilter === stat.id;

        return (
          <div
            key={stat.label}
            className={`card-enter ${onFilterChange ? 'cursor-pointer' : ''}`}
            onClick={() => onFilterChange?.(stat.id)}
            style={{
              animationDelay: `${i * 0.05}s`,
              padding: '18px 20px',
              background: isSelected ? 'var(--color-surface)' : 'var(--color-surface-raised)',
              border: '3px solid #000',
              boxShadow: isSelected ? '2px 2px 0 #000' : '4px 4px 0 #000',
              borderTop: `6px solid ${stat.accent}`,
              transform: isSelected ? 'translate(2px, 2px)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Icon size={14} strokeWidth={2.5} style={{ color: '#000' }} />
                <span className="section-label" style={{ margin: 0, fontSize: '0.625rem' }}>{stat.label}</span>
              </div>
            </div>

            <p
              className={`font-bold ${stat.mono ? 'font-mono' : 'font-display'}`}
              style={{
                color: '#000',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginTop: '4px',
              }}
            >
              {stat.value}
            </p>

            <p className="font-mono text-xs mt-1.5" style={{ color: 'var(--color-ink-soft)', fontSize: '0.6875rem' }}>
              {stat.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}

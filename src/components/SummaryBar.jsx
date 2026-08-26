import { formatCost } from '../data/helpers';
import { Layers, DollarSign, TrendingUp } from 'lucide-react';

export default function SummaryBar({ services }) {
  const activeServices = services.filter(s => s.status !== 'cancelled');
  const totalMonthlyCost = activeServices.reduce((sum, s) => {
    if (s.billing_cycle === 'annual') return sum + (s.cost / 12);
    if (s.billing_cycle === 'monthly') return sum + s.cost;
    return sum;
  }, 0);

  const stats = [
    { label: 'Total services', value: activeServices.length, accent: '#CCFF00', icon: Layers },
    { label: 'Monthly cost', value: formatCost(totalMonthlyCost), mono: true, accent: '#FF1B6B', icon: DollarSign },
    { label: 'Annual projection', value: formatCost(totalMonthlyCost * 12), mono: true, accent: '#4400FF', icon: TrendingUp },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="card-enter"
            style={{
              animationDelay: `${i * 0.08}s`,
              padding: '20px 24px',
              background: 'var(--color-surface-raised)',
              border: '3px solid #000',
              boxShadow: '4px 4px 0 #000',
              borderTop: `6px solid ${stat.accent}`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} strokeWidth={2.5} style={{ color: 'var(--color-ink-soft)' }} />
              <p className="section-label" style={{ margin: 0 }}>{stat.label}</p>
            </div>
            <p
              className={`font-bold ${stat.mono ? 'font-mono' : 'font-display'}`}
              style={{ color: '#000', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
            >
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

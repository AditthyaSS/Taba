import { formatCost } from '../data/mockData';

export default function SummaryBar({ services }) {
  const activeServices = services.filter(s => s.status !== 'cancelled');
  const totalMonthlyCost = activeServices.reduce((sum, s) => {
    if (s.billing_cycle === 'annual') return sum + (s.cost / 12);
    if (s.billing_cycle === 'monthly') return sum + s.cost;
    return sum;
  }, 0);

  const stats = [
    {
      label: 'Total services',
      value: activeServices.length,
      color: 'var(--color-ink)',
    },
    {
      label: 'Monthly cost',
      value: formatCost(totalMonthlyCost),
      color: 'var(--color-ink)',
      mono: true,
    },
    {
      label: 'Annual projection',
      value: formatCost(totalMonthlyCost * 12),
      color: 'var(--color-ink-soft)',
      mono: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="card animate-in"
          style={{ animationDelay: `${i * 0.08}s`, padding: '16px 18px' }}
        >
          <p className="section-label mb-1.5">{stat.label}</p>
          <p
            className={`text-xl font-semibold ${stat.mono ? 'font-mono' : ''}`}
            style={{ color: stat.color }}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

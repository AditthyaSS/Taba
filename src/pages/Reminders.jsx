import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SERVICES, daysUntil, formatDate, formatCost, getInitials, getServiceColor, CATEGORY_ICONS } from '../data/mockData';

export default function Reminders() {
  const navigate = useNavigate();
  const [reminderWindow, setReminderWindow] = useState(14);

  const upcoming = useMemo(() => {
    return MOCK_SERVICES
      .filter(s => s.renewal_date && s.status === 'active')
      .map(s => ({ ...s, daysLeft: daysUntil(s.renewal_date) }))
      .filter(s => s.daysLeft >= 0 && s.daysLeft <= reminderWindow)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [reminderWindow]);

  const allUpcoming = useMemo(() => {
    return MOCK_SERVICES
      .filter(s => s.renewal_date && s.status === 'active')
      .map(s => ({ ...s, daysLeft: daysUntil(s.renewal_date) }))
      .filter(s => s.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-medium" style={{ color: 'var(--color-ink)' }}>
            Reminders
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-ink-soft)' }}>
            Upcoming subscription renewals
          </p>
        </div>

        {/* Reminder window setting */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium" style={{ color: 'var(--color-ink-soft)' }}>
            Window:
          </label>
          <select
            className="select"
            value={reminderWindow}
            onChange={e => setReminderWindow(Number(e.target.value))}
            style={{ width: 'auto', paddingRight: '2.5rem' }}
          >
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
          </select>
        </div>
      </div>

      {/* Upcoming within window */}
      <section className="mb-8">
        <div className="section-label mb-3">
          <span className="dot" style={{ background: 'var(--color-vermillion)' }} />
          Within {reminderWindow} days
          <span className="ml-1" style={{ color: 'var(--color-ink-faint)', fontWeight: 400, fontSize: '0.625rem' }}>
            {upcoming.length}
          </span>
        </div>

        {upcoming.length > 0 ? (
          <div className="grid gap-2">
            {upcoming.map((svc, i) => (
              <div
                key={svc.id}
                className="card card-interactive card-enter"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/services/${svc.id}/edit`)}
              >
                <div className="flex items-center gap-3.5">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: 36,
                      height: 36,
                      background: `${getServiceColor(svc.name)}12`,
                      color: getServiceColor(svc.name),
                      fontSize: '0.875rem',
                    }}
                  >
                    {CATEGORY_ICONS[svc.category] || getInitials(svc.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{svc.name}</h3>
                      <span className="font-mono text-sm" style={{ color: 'var(--color-ink)' }}>
                        {formatCost(svc.cost, svc.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs" style={{ color: 'var(--color-ink-soft)' }}>
                        {svc.owner_name || 'No owner'}
                      </span>
                      <span
                        className={`text-xs font-mono font-medium ${svc.daysLeft <= 3 ? '' : ''}`}
                        style={{ color: svc.daysLeft <= 3 ? 'var(--color-vermillion)' : 'var(--color-ink-soft)' }}
                      >
                        {svc.daysLeft === 0 ? 'Today' : svc.daysLeft === 1 ? 'Tomorrow' : `In ${svc.daysLeft} days`}
                        {' · '}
                        {formatDate(svc.renewal_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-8" style={{ background: 'var(--color-surface)' }}>
            <p className="text-sm mb-1" style={{ color: 'var(--color-ink-faint)' }}>
              No renewals within the next {reminderWindow} days
            </p>
            <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
              You'll see services here as their renewal dates approach
            </p>
          </div>
        )}
      </section>

      {/* Timeline of all upcoming renewals */}
      <section>
        <div className="section-label mb-3">
          <span className="dot" style={{ background: 'var(--color-moss)' }} />
          All upcoming renewals
          <span className="ml-1" style={{ color: 'var(--color-ink-faint)', fontWeight: 400, fontSize: '0.625rem' }}>
            {allUpcoming.length}
          </span>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {allUpcoming.map((svc, i) => (
            <div
              key={svc.id}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors card-enter"
              style={{
                borderBottom: i < allUpcoming.length - 1 ? '1px solid var(--color-border)' : 'none',
                animationDelay: `${i * 0.03}s`,
              }}
              onClick={() => navigate(`/services/${svc.id}/edit`)}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span className="font-mono text-xs w-20 flex-shrink-0" style={{ color: svc.daysLeft <= 3 ? 'var(--color-vermillion)' : 'var(--color-ink-faint)' }}>
                {formatDate(svc.renewal_date)}
              </span>
              <span className="text-sm font-medium flex-1" style={{ color: 'var(--color-ink)' }}>
                {svc.name}
              </span>
              <span className="font-mono text-sm" style={{ color: 'var(--color-ink-soft)' }}>
                {formatCost(svc.cost, svc.currency)}
              </span>
              <span className="font-mono text-xs" style={{ color: svc.daysLeft <= 3 ? 'var(--color-vermillion)' : 'var(--color-ink-faint)' }}>
                {svc.daysLeft}d
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

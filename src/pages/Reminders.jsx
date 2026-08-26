import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchServices } from '../lib/api';
import { daysUntil, formatDate, formatCost } from '../data/helpers';
import { CategoryIcon } from '../components/ServiceCard';
import { Loader } from 'lucide-react';

export default function Reminders() {
  const navigate = useNavigate();
  const { org } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderWindow, setReminderWindow] = useState(14);

  useEffect(() => {
    if (!org?.id) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchServices(org.id);
        if (!cancelled) setServices(data);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [org?.id]);

  const upcoming = useMemo(() => {
    return services
      .filter(s => s.renewal_date && s.status === 'active')
      .map(s => ({ ...s, daysLeft: daysUntil(s.renewal_date) }))
      .filter(s => s.daysLeft >= 0 && s.daysLeft <= reminderWindow)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [services, reminderWindow]);

  const allUpcoming = useMemo(() => {
    return services
      .filter(s => s.renewal_date && s.status === 'active')
      .map(s => ({ ...s, daysLeft: daysUntil(s.renewal_date) }))
      .filter(s => s.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [services]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center animate-in">
          <Loader size={32} className="mx-auto mb-3 animate-spin" style={{ color: 'var(--color-ink-soft)' }} />
          <p className="font-mono text-xs" style={{ color: 'var(--color-ink-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Loading reminders…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display" style={{ color: '#000', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            REMINDERS
          </h1>
          <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Upcoming subscription renewals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="font-mono text-xs font-bold" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Window:
          </label>
          <select
            className="select"
            value={reminderWindow}
            onChange={e => setReminderWindow(Number(e.target.value))}
            style={{ width: 'auto', minWidth: '120px' }}
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
      <section className="mb-10">
        <div className="section-label mb-4">
          <span className="dot" style={{ background: '#FF1B6B', borderColor: '#000' }} />
          Within {reminderWindow} days
          <span className="font-mono" style={{ color: 'var(--color-ink-faint)', fontWeight: 700, fontSize: '0.625rem' }}>
            {upcoming.length}
          </span>
        </div>

        {upcoming.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcoming.map((svc, i) => (
              <div
                key={svc.id}
                className="card card-interactive card-enter"
                style={{ animationDelay: `${i * 0.05}s`, padding: '16px 20px' }}
                onClick={() => navigate(`/services/${svc.id}/edit`)}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: 46, height: 46, background: '#CCFF00', border: '3px solid #000' }}
                  >
                    <CategoryIcon category={svc.category} size={22} color="#000" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-bold truncate" style={{ color: '#000' }}>
                          {svc.name}
                        </h3>
                        <p className="font-mono text-xs mt-1 truncate" style={{ color: 'var(--color-ink-soft)' }}>
                          {svc.owner_name || 'No owner'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-base font-bold" style={{ color: '#000' }}>
                          {formatCost(svc.cost, svc.currency)}
                        </p>
                        <p
                          className="font-mono text-xs mt-0.5 font-bold"
                          style={{ color: svc.daysLeft <= 3 ? '#FF1B6B' : 'var(--color-ink-soft)' }}
                        >
                          {svc.daysLeft === 0 ? 'Today' : svc.daysLeft === 1 ? 'Tomorrow' : `In ${svc.daysLeft} days`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-10 font-mono text-xs"
            style={{
              background: 'var(--color-surface)',
              border: '3px dashed var(--color-border-soft)',
              color: 'var(--color-ink-faint)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            No renewals within the next {reminderWindow} days
          </div>
        )}
      </section>

      {/* Timeline */}
      <section>
        <div className="section-label mb-4">
          <span className="dot" style={{ background: '#CCFF00', borderColor: '#000' }} />
          All upcoming renewals
          <span className="font-mono" style={{ color: 'var(--color-ink-faint)', fontWeight: 700, fontSize: '0.625rem' }}>
            {allUpcoming.length}
          </span>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {allUpcoming.map((svc, i) => (
            <div
              key={svc.id}
              className="card-enter"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(90px, auto) 1fr auto auto',
                gap: '12px',
                alignItems: 'center',
                padding: '12px 20px',
                borderBottom: i < allUpcoming.length - 1 ? '2px solid #000' : 'none',
                animationDelay: `${i * 0.03}s`,
                cursor: 'pointer',
                transition: 'background 0.12s ease',
              }}
              onClick={() => navigate(`/services/${svc.id}/edit`)}
              onMouseEnter={e => { e.currentTarget.style.background = '#CCFF00'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span className="font-mono text-xs font-bold" style={{ color: svc.daysLeft <= 3 ? '#FF1B6B' : 'var(--color-ink-faint)' }}>
                {formatDate(svc.renewal_date)}
              </span>
              <span className="font-display text-sm font-bold truncate" style={{ color: '#000' }}>
                {svc.name}
              </span>
              <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-ink-soft)' }}>
                {formatCost(svc.cost, svc.currency)}
              </span>
              <span
                className="font-mono text-xs font-bold text-right"
                style={{
                  minWidth: '36px',
                  color: svc.daysLeft <= 3 ? '#fff' : 'var(--color-ink-faint)',
                  background: svc.daysLeft <= 3 ? '#FF1B6B' : 'transparent',
                  padding: svc.daysLeft <= 3 ? '2px 8px' : '2px 0',
                  border: svc.daysLeft <= 3 ? '2px solid #000' : 'none',
                }}
              >
                {svc.daysLeft}d
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

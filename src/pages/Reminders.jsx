import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { fetchServices, updateService } from '../lib/api';
import { daysUntil, formatDate, formatCost, CATEGORY_COLORS } from '../data/helpers';
import { CategoryIcon } from '../components/ServiceCard';
import {
  Loader, Bell, Calendar, CheckCircle, AlertTriangle,
  RotateCw, ArrowRight, Clock, DollarSign
} from 'lucide-react';

export default function Reminders() {
  const navigate = useNavigate();
  const { org, currency } = useAuth();
  const toast = useToast();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminderWindow, setReminderWindow] = useState(30);
  const [activeTab, setActiveTab] = useState('list'); // list, timeline

  const loadData = async () => {
    if (!org?.id) return;
    try {
      setLoading(true);
      const data = await fetchServices(org.id);
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [org?.id]);

  const handleMarkRenewed = async (svc) => {
    try {
      const currentRenewal = svc.renewal_date ? new Date(svc.renewal_date) : new Date();
      if (svc.billing_cycle === 'annual') {
        currentRenewal.setFullYear(currentRenewal.getFullYear() + 1);
      } else {
        currentRenewal.setMonth(currentRenewal.getMonth() + 1);
      }
      const newDateStr = currentRenewal.toISOString().split('T')[0];
      const updated = await updateService(svc.id, { renewal_date: newDateStr });

      setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
      toast.success(`Renewed "${svc.name}"! Next billing date: ${newDateStr}`);
    } catch (err) {
      toast.error(`Failed to renew: ${err.message}`);
    }
  };

  // Upcoming within selected window
  const upcomingInWindow = useMemo(() => {
    return services
      .filter(s => s.renewal_date && s.status === 'active')
      .map(s => ({ ...s, daysLeft: daysUntil(s.renewal_date) }))
      .filter(s => s.daysLeft >= 0 && s.daysLeft <= reminderWindow)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [services, reminderWindow]);

  // Overdue renewals
  const overdue = useMemo(() => {
    return services
      .filter(s => s.renewal_date && s.status === 'active')
      .map(s => ({ ...s, daysLeft: daysUntil(s.renewal_date) }))
      .filter(s => s.daysLeft < 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [services]);

  // All upcoming
  const allUpcoming = useMemo(() => {
    return services
      .filter(s => s.renewal_date && s.status === 'active')
      .map(s => ({ ...s, daysLeft: daysUntil(s.renewal_date) }))
      .filter(s => s.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [services]);

  const totalWindowCost = upcomingInWindow.reduce((sum, s) => sum + s.cost, 0);

  // Group by timeline periods (This Week, Next Week, Later this Month, Next Month, Later)
  const timelineGroups = useMemo(() => {
    const groups = {
      urgent: { title: 'Immediate (Next 3 Days)', items: [], color: '#FF1B6B' },
      thisWeek: { title: 'This Week (4-7 Days)', items: [], color: '#FF8A00' },
      nextTwoWeeks: { title: 'Next 2 Weeks (8-14 Days)', items: [], color: '#4400FF' },
      thisMonth: { title: 'Within 30 Days', items: [], color: '#CCFF00' },
      later: { title: 'Beyond 30 Days', items: [], color: '#94A3B8' },
    };

    allUpcoming.forEach(s => {
      if (s.daysLeft <= 3) groups.urgent.items.push(s);
      else if (s.daysLeft <= 7) groups.thisWeek.items.push(s);
      else if (s.daysLeft <= 14) groups.nextTwoWeeks.items.push(s);
      else if (s.daysLeft <= 30) groups.thisMonth.items.push(s);
      else groups.later.items.push(s);
    });

    return Object.values(groups).filter(g => g.items.length > 0);
  }, [allUpcoming]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center animate-in">
          <Loader size={36} className="mx-auto mb-3 animate-spin" style={{ color: '#000' }} />
          <p className="font-mono text-xs font-bold" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Loading renewal reminders…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display" style={{ color: '#000', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            RENEWALS
          </h1>
          <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Stay ahead of auto-renewals &amp; surprise card charges
          </p>
        </div>

        {/* View Mode & Window */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="pill-nav">
            <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}>
              List
            </button>
            <button className={activeTab === 'timeline' ? 'active' : ''} onClick={() => setActiveTab('timeline')}>
              Timeline Roadmap
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-mono text-xs font-bold uppercase" style={{ color: 'var(--color-ink-soft)' }}>
              Window:
            </label>
            <select
              className="select font-mono font-bold"
              value={reminderWindow}
              onChange={e => setReminderWindow(Number(e.target.value))}
              style={{ width: 'auto', minWidth: '130px', height: '38px', fontSize: '0.75rem' }}
            >
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={365}>Whole Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Banner for Selected Window */}
      <div
        className="card mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          background: 'var(--color-surface-raised)',
          borderLeft: '6px solid var(--color-pink)',
          padding: '20px 24px',
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={16} strokeWidth={2.5} style={{ color: 'var(--color-pink)' }} />
            <span className="section-label" style={{ margin: 0 }}>Upcoming Exposure</span>
          </div>
          <p className="font-display text-2xl font-bold" style={{ color: '#000000' }}>
            {formatCost(totalWindowCost, currency)}
          </p>
          <p className="font-mono text-xs mt-1" style={{ color: 'var(--color-ink-soft)' }}>
            Due across <strong>{upcomingInWindow.length}</strong> subscriptions in the next {reminderWindow} days.
          </p>
        </div>

        <button
          onClick={() => navigate('/services/new')}
          className="btn btn-secondary self-start sm:self-auto font-mono text-xs"
        >
          Add another subscription
        </button>
      </div>

      {/* Overdue Section (if any) */}
      {overdue.length > 0 && (
        <section className="mb-10">
          <div className="section-label mb-4">
            <span className="dot" style={{ background: 'var(--color-pink)', borderColor: '#000000' }} />
            Overdue / Past Renewal Date
            <span className="badge badge-vermillion font-mono" style={{ fontSize: '0.625rem' }}>
              {overdue.length} Need Attention
            </span>
          </div>

          <div className="space-y-3">
            {overdue.map((svc, i) => (
              <div
                key={svc.id}
                className="card card-interactive card-enter"
                style={{ padding: '16px 20px', borderLeft: '5px solid var(--color-pink)' }}
                onClick={() => navigate(`/services/${svc.id}/edit`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="flex items-center justify-center flex-shrink-0 rounded-sm"
                      style={{ width: 42, height: 42, background: 'var(--color-pink)', border: '2px solid #000000' }}
                    >
                      <CategoryIcon category={svc.category} size={20} color="#ffffff" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-bold truncate" style={{ color: '#000000' }}>
                        {svc.name}
                      </h3>
                      <p className="font-mono text-xs" style={{ color: 'var(--color-pink)', fontWeight: 700 }}>
                        {Math.abs(svc.daysLeft)} days overdue ({formatDate(svc.renewal_date)})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-mono text-base font-bold" style={{ color: '#000000' }}>
                        {formatCost(svc.cost, svc.currency || currency)}
                      </p>
                      <p className="font-mono text-xs font-bold" style={{ color: 'var(--color-ink-faint)' }}>
                        {svc.billing_cycle}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleMarkRenewed(svc); }}
                      className="btn btn-sm btn-primary"
                      title="Advance date to next cycle"
                    >
                      <RotateCw size={13} strokeWidth={2.5} /> Mark Renewed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Content: List or Timeline */}
      {activeTab === 'timeline' ? (
        /* Timeline Roadmap */
        <div className="space-y-8 animate-in">
          {timelineGroups.map(group => (
            <div key={group.title} className="card" style={{ padding: '24px' }}>
              <div className="section-label mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="dot" style={{ background: group.color, borderColor: '#000000' }} />
                  <span className="font-display font-bold text-sm text-black uppercase">{group.title}</span>
                </div>
                <span className="font-mono text-xs font-bold">
                  {group.items.length} services ({formatCost(group.items.reduce((s, i) => s + i.cost, 0), currency)})
                </span>
              </div>

              <div className="space-y-3">
                {group.items.map(svc => (
                  <div
                    key={svc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border-2 border-black/15 hover:border-black transition-all cursor-pointer gap-3 rounded-sm"
                    onClick={() => navigate(`/services/${svc.id}/edit`)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex items-center justify-center flex-shrink-0 rounded-sm"
                        style={{ width: 36, height: 36, background: 'var(--color-lime)', border: '2px solid #000000' }}
                      >
                        <CategoryIcon category={svc.category} size={18} color="#000000" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm truncate" style={{ color: '#000000' }}>{svc.name}</p>
                        <p className="font-mono text-xs truncate" style={{ color: 'var(--color-ink-soft)' }}>
                          {svc.owner_name || 'Unassigned'} · {svc.provider}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-left sm:text-right">
                        <p className="font-mono font-bold text-xs" style={{ color: svc.daysLeft <= 3 ? 'var(--color-pink)' : '#000000' }}>
                          {svc.daysLeft === 0 ? 'Today' : svc.daysLeft === 1 ? 'Tomorrow' : `In ${svc.daysLeft} days`} ({formatDate(svc.renewal_date)})
                        </p>
                        <p className="font-mono font-bold text-sm" style={{ color: '#000000' }}>
                          {formatCost(svc.cost, svc.currency || currency)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleMarkRenewed(svc); }}
                        className="btn btn-sm btn-secondary"
                        title="Mark renewed"
                      >
                        <CheckCircle size={13} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <section>
          <div className="section-label mb-4">
            <span className="dot" style={{ background: 'var(--color-pink)', borderColor: '#000000' }} />
            Within {reminderWindow} days window
            <span className="font-mono px-2 py-0.5 rounded-sm" style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border-soft)', fontWeight: 800, fontSize: '0.625rem' }}>
              {upcomingInWindow.length}
            </span>
          </div>

          {upcomingInWindow.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingInWindow.map((svc, i) => (
                <div
                  key={svc.id}
                  className="card card-interactive card-enter"
                  style={{ animationDelay: `${i * 0.04}s`, padding: '16px 20px', borderLeft: svc.daysLeft <= 3 ? '5px solid var(--color-pink)' : '2px solid #000000' }}
                  onClick={() => navigate(`/services/${svc.id}/edit`)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="flex items-center justify-center flex-shrink-0 rounded-sm"
                        style={{ width: 42, height: 42, background: 'var(--color-lime)', border: '2px solid #000000' }}
                      >
                        <CategoryIcon category={svc.category} size={20} color="#000000" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-base font-bold truncate" style={{ color: '#000000' }}>
                            {svc.name}
                          </h3>
                          {svc.daysLeft <= 3 && (
                            <span className="badge badge-vermillion animate-pulse" style={{ fontSize: '0.5625rem' }}>
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--color-ink-soft)' }}>
                          Owner: <strong>{svc.owner_name || 'Unassigned'}</strong> · {svc.provider}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-left sm:text-right">
                        <p className="font-mono text-base font-bold" style={{ color: '#000000' }}>
                          {formatCost(svc.cost, svc.currency || currency)}
                        </p>
                        <p
                          className="font-mono text-xs font-bold"
                          style={{ color: svc.daysLeft <= 3 ? 'var(--color-pink)' : 'var(--color-ink-soft)' }}
                        >
                          {svc.daysLeft === 0 ? 'Today' : svc.daysLeft === 1 ? 'Tomorrow' : `In ${svc.daysLeft} days`} ({formatDate(svc.renewal_date)})
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleMarkRenewed(svc); }}
                        className="btn btn-sm btn-primary"
                        title="Mark renewed and advance date by cycle"
                      >
                        <RotateCw size={13} strokeWidth={2.5} />
                        <span className="hidden md:inline">Mark Renewed</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-10 font-mono text-xs uppercase rounded-sm"
              style={{
                background: 'var(--color-surface)',
                border: '1.5px dashed var(--color-border-soft)',
                color: 'var(--color-ink-faint)',
              }}
            >
              No upcoming renewals within the next {reminderWindow} days.
            </div>
          )}
        </section>
      )}
    </div>
  );
}

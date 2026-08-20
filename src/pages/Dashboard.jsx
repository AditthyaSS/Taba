import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SERVICES, daysUntil } from '../data/mockData';
import ServiceCard from '../components/ServiceCard';
import SummaryBar from '../components/SummaryBar';

const REMINDER_WINDOW = 3; // days

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const services = MOCK_SERVICES;

  // Group services
  const { renewingSoon, active, needsReview } = useMemo(() => {
    const filtered = searchQuery
      ? services.filter(s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.owner_name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : services;

    const renewingSoon = [];
    const active = [];
    const needsReview = [];

    filtered.forEach(s => {
      if (s.status === 'needs_review' || !s.owner_user_id) {
        needsReview.push(s);
      } else if (s.renewal_date && daysUntil(s.renewal_date) >= 0 && daysUntil(s.renewal_date) <= REMINDER_WINDOW) {
        renewingSoon.push(s);
      } else if (s.status === 'active') {
        active.push(s);
      }
    });

    // Sort renewing soon by date (soonest first)
    renewingSoon.sort((a, b) => daysUntil(a.renewal_date) - daysUntil(b.renewal_date));

    return { renewingSoon, active, needsReview };
  }, [services, searchQuery]);

  const handleCardClick = (service) => {
    navigate(`/services/${service.id}/edit`);
  };

  const sections = [
    {
      id: 'renewing-soon',
      label: 'Renewing soon',
      dotColor: 'var(--color-vermillion)',
      items: renewingSoon,
      emptyText: 'No upcoming renewals in the next 3 days',
    },
    {
      id: 'active',
      label: 'Active',
      dotColor: 'var(--color-moss)',
      items: active,
      emptyText: 'No active services',
    },
    {
      id: 'needs-review',
      label: 'Needs review',
      dotColor: '#D4A843',
      items: needsReview,
      emptyText: 'Nothing needs review',
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-medium" style={{ color: 'var(--color-ink)' }}>
            Services
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-ink-soft)' }}>
            All your subscriptions in one place
          </p>
        </div>
        <button
          onClick={() => navigate('/services/new')}
          className="btn btn-primary"
          id="add-service-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add service
        </button>
      </div>

      {/* Summary */}
      <SummaryBar services={services} />

      {/* Search */}
      <div className="mb-6 relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-ink-faint)" strokeWidth="2" strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          className="input"
          placeholder="Search services by name, category, provider, or owner…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
          id="search-services"
        />
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map(section => (
          <section key={section.id} id={section.id}>
            <div className="section-label mb-3">
              <span className="dot" style={{ background: section.dotColor }} />
              {section.label}
              <span className="ml-1" style={{ color: 'var(--color-ink-faint)', fontWeight: 400, fontSize: '0.625rem' }}>
                {section.items.length}
              </span>
            </div>

            {section.items.length > 0 ? (
              <div className="grid gap-2.5">
                {section.items.map((svc, i) => (
                  <ServiceCard
                    key={svc.id}
                    service={svc}
                    onClick={handleCardClick}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div
                className="card text-center py-6"
                style={{ background: 'var(--color-surface)' }}
              >
                <p className="text-sm" style={{ color: 'var(--color-ink-faint)' }}>
                  {section.emptyText}
                </p>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

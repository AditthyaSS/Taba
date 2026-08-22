import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SERVICES, daysUntil } from '../data/mockData';
import ServiceCard from '../components/ServiceCard';
import SummaryBar from '../components/SummaryBar';
import { Plus, Search } from 'lucide-react';

const REMINDER_WINDOW = 3;

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const services = MOCK_SERVICES;

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

    renewingSoon.sort((a, b) => daysUntil(a.renewal_date) - daysUntil(b.renewal_date));
    return { renewingSoon, active, needsReview };
  }, [services, searchQuery]);

  const handleCardClick = (service) => {
    navigate(`/services/${service.id}/edit`);
  };

  const sections = [
    { id: 'renewing-soon', label: 'Renewing soon', dotColor: '#FF1B6B', items: renewingSoon, emptyText: 'No upcoming renewals in the next 3 days' },
    { id: 'active', label: 'Active', dotColor: '#CCFF00', items: active, emptyText: 'No active services' },
    { id: 'needs-review', label: 'Needs review', dotColor: '#FF8A00', items: needsReview, emptyText: 'Nothing needs review' },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display" style={{ color: '#000', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            SERVICES
          </h1>
          <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            All your subscriptions in one place
          </p>
        </div>
        <button onClick={() => navigate('/services/new')} className="btn btn-primary" id="add-service-btn">
          <Plus size={16} strokeWidth={3} />
          Add service
        </button>
      </div>

      {/* Summary */}
      <SummaryBar services={services} />

      {/* Search */}
      <div className="mb-8 relative">
        <Search size={18} strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-ink-faint)' }} />
        <input
          type="text"
          className="input"
          placeholder="Search services by name, category, provider, or owner…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '3rem' }}
          id="search-services"
        />
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {sections.map(section => (
          <section key={section.id} id={section.id}>
            <div className="section-label mb-4">
              <span className="dot" style={{ background: section.dotColor, borderColor: '#000' }} />
              {section.label}
              <span className="font-mono" style={{ color: 'var(--color-ink-faint)', fontWeight: 700, fontSize: '0.625rem' }}>
                {section.items.length}
              </span>
            </div>

            {section.items.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {section.items.map((svc, i) => (
                  <ServiceCard key={svc.id} service={svc} onClick={handleCardClick} index={i} />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-8 font-mono text-xs"
                style={{
                  background: 'var(--color-surface)',
                  border: '3px dashed var(--color-border-soft)',
                  color: 'var(--color-ink-faint)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {section.emptyText}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

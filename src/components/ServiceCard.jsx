import { getInitials, formatCost, formatRelativeDate, daysUntil, getServiceColor, CATEGORY_ICONS } from '../data/mockData';

export default function ServiceCard({ service, onClick, index = 0 }) {
  const days = daysUntil(service.renewal_date);
  const isUrgent = days >= 0 && days <= 3;
  const isMissingOwner = !service.owner_user_id;

  return (
    <div
      className="card card-interactive card-enter"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => onClick?.(service)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.(service)}
      id={`service-card-${service.id}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Service Icon / Initials */}
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            background: `${getServiceColor(service.name)}12`,
            color: getServiceColor(service.name),
            fontSize: '1rem',
          }}
        >
          {CATEGORY_ICONS[service.category] || getInitials(service.name)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            {/* Left: name + meta */}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>
                {service.name}
              </h3>
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-ink-soft)' }}>
                {[service.category, service.provider, service.owner_name].filter(Boolean).join(' · ')}
                {isMissingOwner && (
                  <span className="ml-1.5 badge badge-vermillion" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>
                    No owner
                  </span>
                )}
              </p>
            </div>

            {/* Right: cost + renewal */}
            <div className="text-right flex-shrink-0">
              <p className="font-mono text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                {formatCost(service.cost, service.currency)}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-faint)' }}>
                {service.billing_cycle === 'annual' ? '/yr' : service.billing_cycle === 'monthly' ? '/mo' : ''}
              </p>
            </div>
          </div>

          {/* Renewal date badge */}
          {service.renewal_date && (
            <div className="mt-2.5 flex items-center gap-2">
              {isUrgent ? (
                <span className="badge badge-vermillion">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Renews {formatRelativeDate(service.renewal_date)}
                </span>
              ) : (
                <span className="font-mono text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                  Renews {formatRelativeDate(service.renewal_date)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

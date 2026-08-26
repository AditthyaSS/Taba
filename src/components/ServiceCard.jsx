import { getInitials, formatCost, formatRelativeDate, daysUntil, CATEGORY_ICONS } from '../data/helpers';
import { Cloud, Globe, Palette, MessageSquare, Code, ClipboardList, BarChart3, Activity, CreditCard, Headphones, Mail, Shield, TrendingUp, HardDrive, AlertCircle, Package } from 'lucide-react';

const ICON_MAP = {
  'cloud': Cloud,
  'globe': Globe,
  'palette': Palette,
  'message-square': MessageSquare,
  'code': Code,
  'clipboard-list': ClipboardList,
  'bar-chart-3': BarChart3,
  'activity': Activity,
  'credit-card': CreditCard,
  'headphones': Headphones,
  'mail': Mail,
  'shield': Shield,
  'trending-up': TrendingUp,
  'hard-drive': HardDrive,
};

export function CategoryIcon({ category, size = 20, color = '#000' }) {
  const iconKey = CATEGORY_ICONS[category];
  const IconComponent = ICON_MAP[iconKey];
  if (IconComponent) {
    return <IconComponent size={size} color={color} strokeWidth={2.5} />;
  }
  return <Package size={size} color={color} strokeWidth={2.5} />;
}

export default function ServiceCard({ service, onClick, index = 0 }) {
  const days = daysUntil(service.renewal_date);
  const isUrgent = days >= 0 && days <= 3;
  const isMissingOwner = !service.owner_user_id;

  return (
    <div
      className="card card-interactive card-enter"
      style={{ animationDelay: `${index * 0.05}s`, padding: '16px 20px' }}
      onClick={() => onClick?.(service)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.(service)}
      id={`service-card-${service.id}`}
    >
      <div className="flex items-center gap-4">
        {/* Service Icon */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 46,
            height: 46,
            background: '#CCFF00',
            border: '3px solid #000',
          }}
        >
          <CategoryIcon category={service.category} size={22} color="#000" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-bold truncate" style={{ color: '#000', letterSpacing: '-0.01em' }}>
                {service.name}
              </h3>
              <p className="font-mono text-xs mt-1 truncate" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.02em' }}>
                {[service.category, service.provider, service.owner_name].filter(Boolean).join(' · ')}
              </p>
            </div>

            {/* Right: cost */}
            <div className="text-right flex-shrink-0">
              <p className="font-mono text-base font-bold" style={{ color: '#000' }}>
                {formatCost(service.cost, service.currency)}
              </p>
              <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--color-ink-faint)' }}>
                {service.billing_cycle === 'annual' ? '/yr' : service.billing_cycle === 'monthly' ? '/mo' : ''}
              </p>
            </div>
          </div>

          {/* Badges row */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {isMissingOwner && (
              <span className="badge badge-vermillion" style={{ fontSize: '0.5625rem', padding: '2px 8px' }}>
                No owner
              </span>
            )}
            {service.renewal_date && (
              isUrgent ? (
                <span className="badge badge-vermillion" style={{ padding: '2px 8px' }}>
                  <AlertCircle size={10} strokeWidth={3} />
                  Renews {formatRelativeDate(service.renewal_date)}
                </span>
              ) : (
                <span className="font-mono text-xs" style={{ color: 'var(--color-ink-faint)', letterSpacing: '0.04em' }}>
                  Renews {formatRelativeDate(service.renewal_date)}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

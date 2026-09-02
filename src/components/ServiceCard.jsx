import { formatCost, formatRelativeDate, daysUntil, CATEGORY_ICONS, CATEGORY_COLORS } from '../data/helpers';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Cloud, Globe, Palette, MessageSquare, Code, ClipboardList,
  BarChart3, Activity, CreditCard, Headphones, Mail, Shield,
  TrendingUp, HardDrive, AlertCircle, Package, Key, Copy, Check
} from 'lucide-react';
import { useState } from 'react';

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

export default function ServiceCard({
  service,
  onClick,
  index = 0,
  layout = 'list'
}) {
  const { currency } = useAuth();
  const toast = useToast();
  const [copiedKey, setCopiedKey] = useState(false);

  const days = daysUntil(service.renewal_date);
  const isUrgent = days >= 0 && days <= 3;
  const isOverdue = days < 0;
  const isMissingOwner = !service.owner_user_id;
  const catColor = CATEGORY_COLORS[service.category] || { bg: '#E2E8F0', text: '#1E293B', border: '#94A3B8' };

  const handleCopyCredentialLocation = (e) => {
    e.stopPropagation();
    if (!service.credential_location) return;
    navigator.clipboard.writeText(service.credential_location);
    setCopiedKey(true);
    toast.success('Copied credential pointer to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (layout === 'grid') {
    return (
      <div
        className="card card-interactive card-enter flex flex-col justify-between"
        style={{
          animationDelay: `${index * 0.04}s`,
          padding: '20px',
          borderTop: isUrgent ? '6px solid #FF1B6B' : '3px solid #000',
        }}
        onClick={() => onClick?.(service)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onClick?.(service)}
        id={`service-card-${service.id}`}
      >
        <div>
          {/* Top row: Icon + Cost */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 44,
                height: 44,
                background: '#CCFF00',
                border: '3px solid #000',
                boxShadow: '2px 2px 0 #000',
              }}
            >
              <CategoryIcon category={service.category} size={22} color="#000" />
            </div>

            <div className="text-right">
              <p className="font-mono text-lg font-bold" style={{ color: '#000' }}>
                {formatCost(service.cost, service.currency || currency)}
              </p>
              <span className="font-mono text-xs font-bold" style={{ color: 'var(--color-ink-faint)' }}>
                {service.billing_cycle === 'annual' ? '/year' : service.billing_cycle === 'monthly' ? '/month' : 'one-time'}
              </span>
            </div>
          </div>

          {/* Title & Info */}
          <h3 className="font-display text-base font-bold mb-1 truncate" style={{ color: '#000', letterSpacing: '-0.01em' }}>
            {service.name}
          </h3>
          <p className="font-mono text-xs truncate mb-3" style={{ color: 'var(--color-ink-soft)' }}>
            {service.provider || service.category}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span
              className="badge"
              style={{
                background: catColor.bg,
                color: catColor.text,
                borderColor: catColor.border,
                fontSize: '0.5625rem',
              }}
            >
              {service.category || 'General'}
            </span>

            {isMissingOwner && (
              <span className="badge badge-vermillion" style={{ fontSize: '0.5625rem' }}>
                No Owner
              </span>
            )}
          </div>
        </div>

        {/* Footer info: Renewal date + Owner */}
        <div className="pt-3 mt-2" style={{ borderTop: '2px dashed var(--color-border-soft)' }}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span style={{ color: 'var(--color-ink-faint)' }}>Owner:</span>
            <span className="font-bold truncate max-w-[140px]" style={{ color: '#000' }}>
              {service.owner_name || 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span style={{ color: 'var(--color-ink-faint)' }}>Renewal:</span>
            {service.renewal_date ? (
              <span
                className="font-bold flex items-center gap-1"
                style={{ color: isUrgent || isOverdue ? '#FF1B6B' : '#000' }}
              >
                {isUrgent && <AlertCircle size={12} strokeWidth={3} className="animate-pulse" />}
                {formatRelativeDate(service.renewal_date)}
              </span>
            ) : (
              <span style={{ color: 'var(--color-ink-faint)' }}>—</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: List layout
  return (
    <div
      className="card card-interactive card-enter"
      style={{
        animationDelay: `${index * 0.04}s`,
        padding: '16px 20px',
        borderLeft: isUrgent ? '6px solid #FF1B6B' : '3px solid #000',
      }}
      onClick={() => onClick?.(service)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.(service)}
      id={`service-card-${service.id}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon + Main Info */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 44,
              height: 44,
              background: '#CCFF00',
              border: '3px solid #000',
              boxShadow: '2px 2px 0 #000',
            }}
          >
            <CategoryIcon category={service.category} size={22} color="#000" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-display text-base font-bold truncate" style={{ color: '#000', letterSpacing: '-0.01em' }}>
                {service.name}
              </h3>
              <span
                className="badge"
                style={{
                  background: catColor.bg,
                  color: catColor.text,
                  borderColor: catColor.border,
                  fontSize: '0.5625rem',
                }}
              >
                {service.category || 'General'}
              </span>
              {isMissingOwner && (
                <span className="badge badge-vermillion" style={{ fontSize: '0.5625rem' }}>
                  No Owner
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs" style={{ color: 'var(--color-ink-soft)' }}>
              {service.provider && <span>{service.provider}</span>}
              {service.owner_name && (
                <span className="flex items-center gap-1 font-semibold" style={{ color: '#000' }}>
                  👤 {service.owner_name}
                </span>
              )}
              {service.credential_location && (
                <button
                  type="button"
                  onClick={handleCopyCredentialLocation}
                  className="flex items-center gap-1 px-1.5 py-0.5"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1.5px solid var(--color-border-soft)',
                    color: 'var(--color-ink-soft)',
                    fontSize: '0.625rem',
                    cursor: 'pointer',
                  }}
                  title={`Pointer: ${service.credential_location} (Click to copy)`}
                >
                  <Key size={10} strokeWidth={2.5} />
                  <span className="truncate max-w-[160px]">{service.credential_location}</span>
                  {copiedKey ? <Check size={10} color="#16A34A" /> : <Copy size={10} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Cost + Renewal status */}
        <div className="flex items-center justify-between sm:justify-end gap-6 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-black/10">
          {service.renewal_date && (
            <div className="text-left sm:text-right">
              {isUrgent ? (
                <span className="badge badge-vermillion flex items-center gap-1" style={{ padding: '4px 10px' }}>
                  <AlertCircle size={11} strokeWidth={3} className="animate-pulse" />
                  Renews {formatRelativeDate(service.renewal_date)}
                </span>
              ) : isOverdue ? (
                <span className="badge badge-vermillion" style={{ padding: '4px 10px' }}>
                  {formatRelativeDate(service.renewal_date)}
                </span>
              ) : (
                <p className="font-mono text-xs" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.02em' }}>
                  Renews <strong style={{ color: '#000' }}>{formatRelativeDate(service.renewal_date)}</strong>
                </p>
              )}
            </div>
          )}

          <div className="text-right">
            <p className="font-mono text-base sm:text-lg font-bold" style={{ color: '#000' }}>
              {formatCost(service.cost, service.currency || currency)}
            </p>
            <p className="font-mono text-xs font-bold" style={{ color: 'var(--color-ink-faint)' }}>
              {service.billing_cycle === 'annual' ? '/yr' : service.billing_cycle === 'monthly' ? '/mo' : 'one-time'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

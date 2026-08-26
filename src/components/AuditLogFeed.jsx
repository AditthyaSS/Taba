import { timeAgo } from '../data/helpers';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const ACTION_STYLES = {
  created: { color: '#000', bg: '#CCFF00', icon: Plus },
  updated: { color: 'white', bg: '#4400FF', icon: Pencil },
  deleted: { color: 'white', bg: '#FF1B6B', icon: Trash2 },
};

export default function AuditLogFeed({ logs }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {logs.map((log, i) => {
        const style = ACTION_STYLES[log.action] || ACTION_STYLES.updated;
        const Icon = style.icon;

        return (
          <div
            key={log.id}
            className="card card-enter"
            style={{ animationDelay: `${i * 0.04}s`, padding: '14px 20px' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ width: 30, height: 30, background: style.bg, border: '2px solid #000' }}
              >
                <Icon size={14} color={style.color} strokeWidth={2.5} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: '#000' }}>
                  <strong className="font-display">{log.actor_name}</strong>
                  <span className="font-mono text-xs" style={{ color: 'var(--color-ink-soft)' }}>
                    {' '}{log.action}{' '}
                  </span>
                  <strong className="font-display">{log.target_service_name}</strong>
                </p>
                {log.detail && (
                  <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-ink-faint)' }}>
                    {log.detail.field && <>{log.detail.field}: {JSON.stringify(log.detail.old)} → {JSON.stringify(log.detail.new)}</>}
                    {log.detail.cost && !log.detail.field && <>cost: ${log.detail.cost}</>}
                    {log.detail.reason && <>{log.detail.reason}</>}
                  </p>
                )}
              </div>

              <span className="font-mono text-xs font-bold flex-shrink-0" style={{ color: 'var(--color-ink-faint)' }}>
                {timeAgo(log.created_at)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

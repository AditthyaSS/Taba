import { timeAgo } from '../data/mockData';

const ACTION_STYLES = {
  created: { color: 'var(--color-moss)', bg: 'var(--color-moss-soft)', label: 'Created' },
  updated: { color: 'var(--color-indigo)', bg: 'var(--color-indigo-soft)', label: 'Updated' },
  deleted: { color: 'var(--color-vermillion)', bg: 'var(--color-vermillion-soft)', label: 'Deleted' },
};

export default function AuditLogFeed({ logs }) {
  return (
    <div className="space-y-2">
      {logs.map((log, i) => {
        const style = ACTION_STYLES[log.action] || ACTION_STYLES.updated;

        return (
          <div
            key={log.id}
            className="card card-enter"
            style={{ animationDelay: `${i * 0.04}s`, padding: '12px 16px' }}
          >
            <div className="flex items-start gap-3">
              {/* Action icon */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: style.bg }}
              >
                {log.action === 'created' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                )}
                {log.action === 'updated' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="2.5" strokeLinecap="round">
                    <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                  </svg>
                )}
                {log.action === 'deleted' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: 'var(--color-ink)' }}>
                  <strong>{log.actor_name}</strong>
                  <span style={{ color: 'var(--color-ink-soft)' }}>
                    {' '}{log.action}{' '}
                  </span>
                  <strong>{log.target_service_name}</strong>
                </p>

                {/* Detail */}
                {log.detail && (
                  <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--color-ink-faint)' }}>
                    {log.detail.field && (
                      <>{log.detail.field}: {JSON.stringify(log.detail.old)} → {JSON.stringify(log.detail.new)}</>
                    )}
                    {log.detail.cost && !log.detail.field && (
                      <>cost: ${log.detail.cost}</>
                    )}
                    {log.detail.reason && (
                      <>{log.detail.reason}</>
                    )}
                  </p>
                )}
              </div>

              {/* Time */}
              <span className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--color-ink-faint)' }}>
                {timeAgo(log.created_at)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

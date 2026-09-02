import { useState, useMemo } from 'react';
import { timeAgo } from '../data/helpers';
import { Plus, Pencil, Trash2, Filter, Search, ShieldCheck } from 'lucide-react';

const ACTION_STYLES = {
  created: { label: 'Created', color: '#000', bg: '#CCFF00', icon: Plus },
  updated: { label: 'Updated', color: 'white', bg: '#4400FF', icon: Pencil },
  deleted: { label: 'Deleted', color: 'white', bg: '#FF1B6B', icon: Trash2 },
};

export default function AuditLogFeed({ logs = [] }) {
  const [filterAction, setFilterAction] = useState('all');
  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesAction = filterAction === 'all' || log.action === filterAction;
      const matchesSearch = !search ||
        log.actor_name?.toLowerCase().includes(search.toLowerCase()) ||
        log.target_service_name?.toLowerCase().includes(search.toLowerCase());
      return matchesAction && matchesSearch;
    });
  }, [logs, filterAction, search]);

  return (
    <div className="space-y-4">
      {/* Search & Filter bar */}
      <div className="card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3" style={{ padding: '12px 16px' }}>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
          <input
            type="text"
            className="input"
            placeholder="Search by actor or service name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.8125rem' }}
          />
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
          {['all', 'created', 'updated', 'deleted'].map(act => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className="px-2.5 py-1.5 uppercase transition-all"
              style={{
                background: filterAction === act ? '#000' : 'var(--color-surface)',
                color: filterAction === act ? '#CCFF00' : 'var(--color-ink-soft)',
                border: '1.5px solid #000',
                cursor: 'pointer',
                fontSize: '0.625rem',
              }}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      {filteredLogs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredLogs.map((log, i) => {
            const style = ACTION_STYLES[log.action] || ACTION_STYLES.updated;
            const Icon = style.icon;

            return (
              <div
                key={log.id}
                className="card card-enter"
                style={{ animationDelay: `${i * 0.03}s`, padding: '14px 20px' }}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className="flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ width: 32, height: 32, background: style.bg, border: '2px solid #000', boxShadow: '2px 2px 0 #000' }}
                  >
                    <Icon size={14} color={style.color} strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: '#000' }}>
                      <strong className="font-display font-bold">{log.actor_name || 'Team Admin'}</strong>
                      <span className="font-mono text-xs mx-1.5 px-1.5 py-0.5" style={{ background: style.bg, color: style.color, border: '1px solid #000', fontWeight: 700 }}>
                        {log.action}
                      </span>
                      <strong className="font-display font-bold">{log.target_service_name}</strong>
                    </p>

                    {log.detail && (
                      <p className="text-xs mt-1.5 font-mono" style={{ color: 'var(--color-ink-soft)' }}>
                        {log.detail.field && <span>Modified <strong>{log.detail.field}</strong> {log.detail.old && `from ${log.detail.old} `}to <strong>{log.detail.new}</strong></span>}
                        {log.detail.cost !== undefined && !log.detail.field && <span>Initial cost: <strong>${log.detail.cost}</strong></span>}
                        {log.detail.reason && <span>Reason: {log.detail.reason}</span>}
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
      ) : (
        <div className="card text-center py-10 font-mono text-xs uppercase" style={{ background: 'var(--color-surface)', border: '2px dashed var(--color-border-soft)' }}>
          No audit entries matching filter
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { MOCK_MEMBERS, MOCK_AUDIT_LOG, MOCK_ORG, PLANS, getInitials, timeAgo } from '../data/mockData';
import InviteModal from '../components/InviteModal';
import AuditLogFeed from '../components/AuditLogFeed';

const ROLE_LABELS = {
  owner: { label: 'Owner', color: 'var(--color-indigo)', bg: 'var(--color-indigo-soft)' },
  admin: { label: 'Admin', color: 'var(--color-moss)', bg: 'var(--color-moss-soft)' },
  member: { label: 'Member', color: 'var(--color-ink-soft)', bg: 'var(--color-surface)' },
};

export default function Team() {
  const [showInvite, setShowInvite] = useState(false);
  const [activeTab, setActiveTab] = useState('members');

  const plan = PLANS[MOCK_ORG.plan];
  const canInvite = MOCK_MEMBERS.length < plan.maxUsers;
  const hasAuditAccess = ['team', 'growth'].includes(MOCK_ORG.plan);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-medium" style={{ color: 'var(--color-ink)' }}>
            Team
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-ink-soft)' }}>
            {MOCK_MEMBERS.length} of {plan.maxUsers === Infinity ? '∞' : plan.maxUsers} members · {MOCK_ORG.name}
          </p>
        </div>

        <button
          onClick={() => setShowInvite(true)}
          className="btn btn-primary"
          disabled={!canInvite}
          id="invite-member-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
          Invite member
        </button>
      </div>

      {/* Tab switcher */}
      <div className="pill-nav mb-6" style={{ display: 'inline-flex' }}>
        <button
          className={activeTab === 'members' ? 'active' : ''}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          className={activeTab === 'audit' ? 'active' : ''}
          onClick={() => setActiveTab('audit')}
        >
          Audit log
        </button>
      </div>

      {activeTab === 'members' ? (
        <section>
          <div className="grid gap-2.5">
            {MOCK_MEMBERS.map((member, i) => {
              const roleStyle = ROLE_LABELS[member.role] || ROLE_LABELS.member;
              return (
                <div
                  key={member.id}
                  className="card card-enter"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Avatar */}
                    <div
                      className="avatar"
                      style={{
                        background: i === 0 ? 'var(--color-indigo)' : `${['#6B7A5E', '#8B5E3C', '#5E4B8B', '#3C728B'][i % 4]}`,
                      }}
                    >
                      {getInitials(member.name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                          {member.name}
                        </h3>
                        <span
                          className="badge"
                          style={{ background: roleStyle.bg, color: roleStyle.color }}
                        >
                          {roleStyle.label}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-ink-soft)' }}>
                        {member.email}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono" style={{ color: 'var(--color-ink-faint)' }}>
                        Joined {timeAgo(member.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!canInvite && (
            <div className="mt-4 px-4 py-3 rounded-lg" style={{ background: 'var(--color-indigo-soft)', border: '1px solid var(--color-border)' }}>
              <p className="text-sm" style={{ color: 'var(--color-indigo)' }}>
                You've reached your plan's member limit ({plan.maxUsers} members).{' '}
                <a href="/settings" className="underline font-medium">Upgrade your plan</a> to invite more.
              </p>
            </div>
          )}
        </section>
      ) : (
        <section>
          {hasAuditAccess ? (
            <AuditLogFeed logs={MOCK_AUDIT_LOG} />
          ) : (
            <div className="card text-center py-10" style={{ background: 'var(--color-surface)' }}>
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--color-indigo-soft)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-indigo)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>Audit log</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-ink-soft)' }}>
                Available on Team and Growth plans. See who changed what and when.
              </p>
              <a href="/settings" className="btn btn-upgrade">Upgrade to Team</a>
            </div>
          )}
        </section>
      )}

      {/* Invite Modal */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}

import { useState } from 'react';
import { MOCK_MEMBERS, MOCK_AUDIT_LOG, MOCK_ORG, PLANS, getInitials, timeAgo } from '../data/mockData';
import InviteModal from '../components/InviteModal';
import AuditLogFeed from '../components/AuditLogFeed';
import { UserPlus, Shield } from 'lucide-react';

const ROLE_LABELS = {
  owner: { label: 'Owner', color: 'white', bg: '#4400FF' },
  admin: { label: 'Admin', color: '#000', bg: '#CCFF00' },
  member: { label: 'Member', color: 'var(--color-ink-soft)', bg: 'var(--color-surface)' },
};

const AVATAR_COLORS = ['#CCFF00', '#FF1B6B', '#4400FF', '#FF8A00'];

export default function Team() {
  const [showInvite, setShowInvite] = useState(false);
  const [activeTab, setActiveTab] = useState('members');

  const plan = PLANS[MOCK_ORG.plan];
  const canInvite = MOCK_MEMBERS.length < plan.maxUsers;
  const hasAuditAccess = ['team', 'growth'].includes(MOCK_ORG.plan);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display" style={{ color: '#000', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            TEAM
          </h1>
          <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {MOCK_MEMBERS.length} of {plan.maxUsers === Infinity ? '∞' : plan.maxUsers} members · {MOCK_ORG.name}
          </p>
        </div>

        <button
          onClick={() => setShowInvite(true)}
          className="btn btn-primary"
          disabled={!canInvite}
          id="invite-member-btn"
        >
          <UserPlus size={16} strokeWidth={2.5} />
          Invite member
        </button>
      </div>

      {/* Tab switcher */}
      <div className="pill-nav mb-8" style={{ display: 'inline-flex' }}>
        <button className={activeTab === 'members' ? 'active' : ''} onClick={() => setActiveTab('members')}>
          Members
        </button>
        <button className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}>
          Audit log
        </button>
      </div>

      {activeTab === 'members' ? (
        <section>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {MOCK_MEMBERS.map((member, i) => {
              const roleStyle = ROLE_LABELS[member.role] || ROLE_LABELS.member;
              return (
                <div
                  key={member.id}
                  className="card card-enter"
                  style={{ animationDelay: `${i * 0.05}s`, padding: '16px 20px' }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="avatar"
                      style={{
                        background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                        color: i % AVATAR_COLORS.length === 2 ? 'white' : '#000',
                      }}
                    >
                      {getInitials(member.name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-sm font-bold" style={{ color: '#000' }}>
                          {member.name}
                        </h3>
                        <span className="badge" style={{ background: roleStyle.bg, color: roleStyle.color }}>
                          {roleStyle.label}
                        </span>
                      </div>
                      <p className="font-mono text-xs mt-1" style={{ color: 'var(--color-ink-soft)' }}>
                        {member.email}
                      </p>
                    </div>

                    <span className="font-mono text-xs font-bold hidden sm:block" style={{ color: 'var(--color-ink-faint)', flexShrink: 0 }}>
                      Joined {timeAgo(member.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {!canInvite && (
            <div className="mt-5" style={{ background: '#CCFF00', border: '3px solid #000', boxShadow: '4px 4px 0 #000', padding: '16px 20px' }}>
              <p className="font-mono text-xs font-bold" style={{ color: '#000', letterSpacing: '0.04em' }}>
                You've reached your plan's member limit ({plan.maxUsers} members).{' '}
                <a href="/settings" className="underline">Upgrade your plan</a> to invite more.
              </p>
            </div>
          )}
        </section>
      ) : (
        <section>
          {hasAuditAccess ? (
            <AuditLogFeed logs={MOCK_AUDIT_LOG} />
          ) : (
            <div className="card text-center" style={{ padding: '3rem 2rem' }}>
              <div className="mx-auto mb-4 flex items-center justify-center" style={{ width: 56, height: 56, background: '#4400FF', border: '3px solid #000' }}>
                <Shield size={28} color="white" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-lg font-bold mb-2" style={{ color: '#000' }}>AUDIT LOG</h3>
              <p className="text-sm mb-5" style={{ color: 'var(--color-ink-soft)', maxWidth: '320px', margin: '0 auto 1.25rem' }}>
                Available on Team and Growth plans. See who changed what and when.
              </p>
              <a href="/settings" className="btn btn-upgrade">Upgrade to Team</a>
            </div>
          )}
        </section>
      )}

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}

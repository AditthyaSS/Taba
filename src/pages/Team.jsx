import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAuditLog, fetchServices } from '../lib/api';
import { PLANS, getInitials, timeAgo } from '../data/helpers';
import InviteModal from '../components/InviteModal';
import AuditLogFeed from '../components/AuditLogFeed';
import { UserPlus, Shield, Loader, ExternalLink, Mail, UserCheck } from 'lucide-react';

const ROLE_LABELS = {
  owner: { label: 'Owner', color: 'white', bg: '#4400FF', desc: 'Full workspace & billing ownership' },
  admin: { label: 'Admin', color: '#000', bg: '#CCFF00', desc: 'Can add/remove members and services' },
  member: { label: 'Member', color: 'var(--color-ink-soft)', bg: 'var(--color-surface)', desc: 'Can view and edit services' },
};

const AVATAR_COLORS = ['#CCFF00', '#FF1B6B', '#4400FF', '#FF8A00'];

export default function Team() {
  const navigate = useNavigate();
  const { org, members, refreshMembers } = useAuth();
  const [showInvite, setShowInvite] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [services, setServices] = useState([]);

  const plan = PLANS[org?.plan || 'free'] || PLANS.free;
  const canInvite = members.length < plan.maxUsers;
  const hasAuditAccess = ['team', 'growth'].includes(org?.plan);

  // Load services to count ownership per member
  useEffect(() => {
    if (!org?.id) return;
    fetchServices(org.id).then(data => setServices(data)).catch(() => {});
  }, [org?.id]);

  // Load audit log when on audit tab
  useEffect(() => {
    if (activeTab !== 'audit' || !org?.id || !hasAuditAccess) return;
    let cancelled = false;

    async function load() {
      try {
        setAuditLoading(true);
        const data = await fetchAuditLog(org.id);
        if (!cancelled) setAuditLogs(data);
      } catch (err) {
        console.error('Failed to load audit log:', err);
      } finally {
        if (!cancelled) setAuditLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeTab, org?.id, hasAuditAccess]);

  const handleInviteClose = () => {
    setShowInvite(false);
    refreshMembers();
  };

  // Ownership count map
  const memberServiceCount = useMemo(() => {
    const counts = {};
    services.forEach(s => {
      const key = s.owner_user_id || s.owner_name;
      if (key) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [services]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display" style={{ color: '#000', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            TEAM
          </h1>
          <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {members.length} of {plan.maxUsers === Infinity ? '∞' : plan.maxUsers} Seats Used · {org?.name || '—'}
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
          Members ({members.length})
        </button>
        <button className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}>
          Activity Audit Log
        </button>
      </div>

      {activeTab === 'members' ? (
        <section>
          {/* Seat usage meter */}
          <div className="card mb-6" style={{ padding: '16px 20px', background: '#FAF8F2' }}>
            <div className="flex items-center justify-between font-mono text-xs mb-2">
              <span className="font-bold text-black uppercase">Team Seat Capacity</span>
              <span className="font-bold">{members.length} / {plan.maxUsers === Infinity ? 'Unlimited' : plan.maxUsers} Seats</span>
            </div>
            <div style={{ height: '8px', background: 'var(--color-surface)', border: '2px solid #000' }}>
              <div
                style={{
                  height: '100%',
                  width: plan.maxUsers === Infinity ? '15%' : `${Math.min(100, (members.length / plan.maxUsers) * 100)}%`,
                  background: '#CCFF00',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {members.map((member, i) => {
              const roleStyle = ROLE_LABELS[member.role] || ROLE_LABELS.member;
              const svcCount = memberServiceCount[member.user_id] || memberServiceCount[member.name] || 0;

              return (
                <div
                  key={member.id}
                  className="card card-enter"
                  style={{ animationDelay: `${i * 0.05}s`, padding: '18px 20px' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="avatar"
                        style={{
                          background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                          color: i % AVATAR_COLORS.length === 2 ? 'white' : '#000',
                          width: 44,
                          height: 44,
                          fontSize: '0.875rem',
                          border: '3px solid #000',
                          boxShadow: '2px 2px 0 #000',
                        }}
                      >
                        {getInitials(member.name || member.email)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-base font-bold" style={{ color: '#000' }}>
                            {member.name || member.email}
                          </h3>
                          <span className="badge" style={{ background: roleStyle.bg, color: roleStyle.color, fontSize: '0.5625rem' }}>
                            {roleStyle.label}
                          </span>
                        </div>
                        <p className="font-mono text-xs mt-1" style={{ color: 'var(--color-ink-soft)' }}>
                          {member.email} · {roleStyle.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-left sm:text-right font-mono text-xs">
                        <p className="font-bold text-black">
                          {svcCount} {svcCount === 1 ? 'Subscription' : 'Subscriptions'}
                        </p>
                        <p style={{ color: 'var(--color-ink-faint)' }}>
                          Joined {timeAgo(member.created_at)}
                        </p>
                      </div>

                      {svcCount > 0 && (
                        <button
                          onClick={() => navigate(`/?search=${encodeURIComponent(member.name || member.email)}`)}
                          className="btn btn-sm btn-secondary"
                          title="View subscriptions owned by this member"
                        >
                          <ExternalLink size={12} strokeWidth={2.5} />
                          <span className="hidden md:inline">View Services</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!canInvite && (
            <div className="mt-6 p-4 border-3 border-black bg-[#CCFF00] font-mono text-xs font-bold text-black flex items-center justify-between gap-4">
              <span>
                Plan seat limit reached ({plan.maxUsers} members on {plan.name}). Upgrade for more seats.
              </span>
              <button onClick={() => navigate('/settings')} className="btn btn-sm btn-primary">
                Upgrade Plan
              </button>
            </div>
          )}
        </section>
      ) : (
        <section>
          {hasAuditAccess ? (
            auditLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={28} className="animate-spin" style={{ color: '#000' }} />
              </div>
            ) : (
              <AuditLogFeed logs={auditLogs} />
            )
          ) : (
            <div className="card text-center py-12" style={{ background: '#FAF8F2' }}>
              <Shield size={36} className="mx-auto mb-3" style={{ color: '#4400FF' }} />
              <h3 className="font-display text-lg font-bold mb-2">Audit Logging is a Team Feature</h3>
              <p className="font-mono text-xs text-black/60 max-w-md mx-auto mb-5">
                Full accountability of who added, updated, or removed every cloud service and credential pointer.
              </p>
              <button onClick={() => navigate('/settings')} className="btn btn-primary">
                Upgrade to Team Plan ($49/mo)
              </button>
            </div>
          )}
        </section>
      )}

      {showInvite && (
        <InviteModal orgId={org?.id} onClose={handleInviteClose} />
      )}
    </div>
  );
}

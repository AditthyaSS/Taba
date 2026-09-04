import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { fetchServices, updateService } from '../lib/api';
import { daysUntil, formatCost, exportServicesToCSV, CATEGORY_ICONS, CATEGORY_COLORS } from '../data/helpers';
import ServiceCard from '../components/ServiceCard';
import SummaryBar from '../components/SummaryBar';
import {
  Plus, Search, Loader, Download, LayoutList, LayoutGrid,
  BarChart3, Filter, ArrowUpDown, X, Sparkles, RefreshCw
} from 'lucide-react';

const REMINDER_WINDOW = 7;
const CATEGORIES = ['All', ...Object.keys(CATEGORY_ICONS)];

export default function Dashboard() {
  const navigate = useNavigate();
  const { org, currency, isDemo } = useAuth();
  const toast = useToast();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [billingFilter, setBillingFilter] = useState('all'); // all, monthly, annual, one_time
  const [sortBy, setSortBy] = useState('renewal'); // renewal, cost_desc, cost_asc, name
  const [viewMode, setViewMode] = useState('list'); // list, grid, analytics
  const [summaryFilter, setSummaryFilter] = useState(null);

  const loadData = async () => {
    if (!org?.id) return;
    try {
      setLoading(true);
      const data = await fetchServices(org.id);
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [org?.id]);

  // Handle 1-click Quick Renew
  const handleQuickRenew = async (service) => {
    try {
      const currentRenewal = service.renewal_date ? new Date(service.renewal_date) : new Date();
      if (service.billing_cycle === 'annual') {
        currentRenewal.setFullYear(currentRenewal.getFullYear() + 1);
      } else {
        currentRenewal.setMonth(currentRenewal.getMonth() + 1);
      }
      const newDateStr = currentRenewal.toISOString().split('T')[0];
      const updated = await updateService(service.id, { renewal_date: newDateStr });

      setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
      toast.success(`Advanced renewal date for ${service.name} to ${newDateStr}`);
    } catch (err) {
      toast.error(`Failed to renew: ${err.message}`);
    }
  };

  // Filtered & Sorted services
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      // Search
      const matchesSearch = !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.notes?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;

      // Billing cycle
      const matchesBilling = billingFilter === 'all' || s.billing_cycle === billingFilter;

      // Summary filter (if clicked on summary bar)
      let matchesSummary = true;
      if (summaryFilter === 'renewing') {
        const days = daysUntil(s.renewal_date);
        matchesSummary = s.renewal_date && days >= 0 && days <= 14 && s.status === 'active';
      }

      return matchesSearch && matchesCategory && matchesBilling && matchesSummary;
    });
  }, [services, searchQuery, selectedCategory, billingFilter, summaryFilter]);

  // Sorted list
  const sortedServices = useMemo(() => {
    const list = [...filteredServices];
    list.sort((a, b) => {
      if (sortBy === 'cost_desc') return (b.cost || 0) - (a.cost || 0);
      if (sortBy === 'cost_asc') return (a.cost || 0) - (b.cost || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // Default: renewal date soonest
      const daysA = daysUntil(a.renewal_date);
      const daysB = daysUntil(b.renewal_date);
      return daysA - daysB;
    });
    return list;
  }, [filteredServices, sortBy]);

  // Grouped sections for list view
  const { renewingSoon, active, needsReview } = useMemo(() => {
    const renewingSoon = [];
    const active = [];
    const needsReview = [];

    sortedServices.forEach(s => {
      if (s.status === 'needs_review' || !s.owner_user_id) {
        needsReview.push(s);
      } else if (s.renewal_date && daysUntil(s.renewal_date) >= 0 && daysUntil(s.renewal_date) <= REMINDER_WINDOW) {
        renewingSoon.push(s);
      } else {
        active.push(s);
      }
    });

    return { renewingSoon, active, needsReview };
  }, [sortedServices]);

  // Analytics Aggregates
  const analyticsData = useMemo(() => {
    const categoryTotals = {};
    const ownerTotals = {};
    let totalMonthly = 0;

    services.filter(s => s.status !== 'cancelled').forEach(s => {
      const monthly = s.billing_cycle === 'annual' ? (s.cost / 12) : s.cost;
      totalMonthly += monthly;

      const cat = s.category || 'Uncategorized';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + monthly;

      const owner = s.owner_name || 'Unassigned';
      ownerTotals[owner] = (ownerTotals[owner] || 0) + monthly;
    });

    const categoryList = Object.entries(categoryTotals)
      .map(([name, amount]) => ({ name, amount, percentage: totalMonthly > 0 ? (amount / totalMonthly) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount);

    const topExpensive = [...services]
      .filter(s => s.status !== 'cancelled')
      .map(s => ({ ...s, monthly: s.billing_cycle === 'annual' ? (s.cost / 12) : s.cost }))
      .sort((a, b) => b.monthly - a.monthly)
      .slice(0, 5);

    return { totalMonthly, categoryList, topExpensive };
  }, [services]);

  const handleExportCSV = () => {
    exportServicesToCSV(sortedServices);
    toast.success(`Exported ${sortedServices.length} subscriptions to CSV`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setBillingFilter('all');
    setSummaryFilter(null);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || billingFilter !== 'all' || summaryFilter;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center animate-in">
          <Loader size={36} className="mx-auto mb-3 animate-spin" style={{ color: '#000' }} />
          <p className="font-mono text-xs font-bold" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-10 animate-in" style={{ borderColor: '#FF1B6B', background: 'var(--color-surface-raised)' }}>
        <p className="font-mono text-base font-bold" style={{ color: '#FF1B6B' }}>Failed to load services</p>
        <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)' }}>{error}</p>
        <button onClick={loadData} className="btn btn-secondary mt-4">
          <RefreshCw size={14} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display" style={{ color: '#000', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
              SERVICES
            </h1>
            {isDemo && (
              <span className="badge badge-moss">Interactive Sandbox</span>
            )}
          </div>
          <p className="font-mono text-xs mt-2" style={{ color: 'var(--color-ink-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {services.length} Total Subscriptions · Team Central Record
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary"
            title="Download CSV spreadsheet"
          >
            <Download size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => navigate('/services/new')}
            className="btn btn-primary"
            id="add-service-btn"
          >
            <Plus size={16} strokeWidth={3} />
            Add service
          </button>
        </div>
      </div>

      {/* Interactive Metric Summary Bar */}
      <SummaryBar
        services={services}
        activeFilter={summaryFilter}
        onFilterChange={id => setSummaryFilter(prev => prev === id ? null : id)}
      />

      {/* Controls Bar: Search, Category Chips, Sort, View Modes */}
      <div className="card mb-8" style={{ padding: '18px 22px', background: 'var(--color-surface-raised)' }}>
        {/* Row 1: Search + View Switcher + Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} strokeWidth={2.5} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-ink-faint)' }} />
            <input
              type="text"
              className="input"
              placeholder="Search by name, provider, owner, notes (Press '/' to focus)…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', paddingRight: searchQuery ? '2.5rem' : '1rem', height: '42px' }}
              id="search-services"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ink-faint)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Billing Cycle Filter */}
            <select
              className="select"
              value={billingFilter}
              onChange={e => setBillingFilter(e.target.value)}
              style={{ height: '42px', minWidth: '130px', fontSize: '0.75rem', fontWeight: 700 }}
            >
              <option value="all">All Cycles</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
              <option value="one_time">One-Time</option>
            </select>

            {/* Sort Select */}
            <select
              className="select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ height: '42px', minWidth: '150px', fontSize: '0.75rem', fontWeight: 700 }}
            >
              <option value="renewal">Renewal (Soonest)</option>
              <option value="cost_desc">Cost (Highest)</option>
              <option value="cost_asc">Cost (Lowest)</option>
              <option value="name">Name (A-Z)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="pill-nav" style={{ height: '42px', flexShrink: 0 }}>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                title="Grouped List View"
                style={{ padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center' }}
              >
                <LayoutList size={16} />
              </button>
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                title="Grid Card View"
                style={{ padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center' }}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={viewMode === 'analytics' ? 'active' : ''}
                onClick={() => setViewMode('analytics')}
                title="Visual Analytics Breakdown"
                style={{ padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center' }}
              >
                <BarChart3 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1 no-scrollbar">
          <span className="font-mono text-xs font-bold uppercase mr-1.5 flex-shrink-0" style={{ color: 'var(--color-ink-faint)', fontSize: '0.6875rem' }}>
            Category:
          </span>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="font-mono font-bold uppercase transition-all whitespace-nowrap rounded-sm"
                style={{
                  fontSize: '0.6875rem',
                  padding: '4px 10px',
                  background: isSelected ? '#000000' : 'var(--color-surface)',
                  color: isSelected ? 'var(--color-lime)' : 'var(--color-ink-soft)',
                  border: isSelected ? '1.5px solid #000000' : '1.5px solid var(--color-border-soft)',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filter Notice */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-dashed border-black/10 font-mono text-xs">
            <span style={{ color: 'var(--color-ink-soft)' }}>
              Showing <strong>{sortedServices.length}</strong> of {services.length} services
            </span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 font-bold underline cursor-pointer"
              style={{ color: 'var(--color-pink)', background: 'transparent', border: 'none' }}
            >
              <X size={12} strokeWidth={3} /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* View Content */}
      {viewMode === 'analytics' ? (
        /* Analytics View */
        <div className="space-y-6 animate-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="card" style={{ padding: '24px' }}>
              <div className="section-label mb-5">
                <span className="dot" style={{ background: '#4400FF', borderColor: '#000' }} />
                Spend by Category (Monthly Equivalent)
              </div>
              <div className="space-y-3">
                {analyticsData.categoryList.map(cat => {
                  const colors = CATEGORY_COLORS[cat.name] || { dot: '#000', text: '#000' };
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between items-center font-mono text-xs mb-1">
                        <span className="font-bold truncate" style={{ color: '#000' }}>{cat.name}</span>
                        <span className="font-bold">{formatCost(cat.amount, currency)} ({cat.percentage.toFixed(0)}%)</span>
                      </div>
                      <div style={{ height: '10px', background: 'var(--color-surface)', border: '2px solid #000' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${cat.percentage}%`,
                            background: colors.dot || '#CCFF00',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top 5 Most Expensive */}
            <div className="card" style={{ padding: '24px' }}>
              <div className="section-label mb-5">
                <span className="dot" style={{ background: '#FF1B6B', borderColor: '#000' }} />
                Top 5 Cost Drivers
              </div>
              <div className="space-y-3">
                {analyticsData.topExpensive.map((svc, i) => (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between p-3 border-2 border-black/15 bg-white cursor-pointer hover:border-black transition-all"
                    onClick={() => navigate(`/services/${svc.id}/edit`)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono font-bold text-xs" style={{ width: 18, color: 'var(--color-ink-faint)' }}>
                        #{i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm truncate" style={{ color: '#000' }}>{svc.name}</p>
                        <p className="font-mono text-xs truncate" style={{ color: 'var(--color-ink-soft)' }}>{svc.category}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono font-bold text-sm" style={{ color: '#000' }}>
                        {formatCost(svc.monthly, currency)}/mo
                      </p>
                      <p className="font-mono text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                        {svc.billing_cycle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        sortedServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedServices.map((svc, i) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                onClick={s => navigate(`/services/${s.id}/edit`)}
                onQuickRenew={handleQuickRenew}
                index={i}
                layout="grid"
              />
            ))}
          </div>
        ) : (
          <div
            className="card text-center py-12 font-mono text-xs uppercase"
            style={{ background: 'var(--color-surface)', border: '3px dashed var(--color-border-soft)' }}
          >
            No matching subscriptions found
          </div>
        )
      ) : (
        /* Grouped List View (Default) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {[
            { id: 'renewing-soon', label: 'Renewing soon (Within 7 days)', dotColor: 'var(--color-pink)', items: renewingSoon, emptyText: 'No upcoming renewals in the next 7 days' },
            { id: 'active', label: 'Active subscriptions', dotColor: 'var(--color-lime)', items: active, emptyText: 'No active services matching criteria' },
            { id: 'needs-review', label: 'Needs review / Unassigned owner', dotColor: 'var(--color-orange)', items: needsReview, emptyText: 'All services have assigned owners' },
          ].map(section => (
            <section key={section.id} id={section.id}>
              <div className="section-label mb-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="dot" style={{ background: section.dotColor, borderColor: '#000000' }} />
                  <span className="font-bold">{section.label}</span>
                  <span
                    className="font-mono px-2 py-0.5 rounded-sm"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1.5px solid var(--color-border-soft)',
                      color: '#000000',
                      fontWeight: 800,
                      fontSize: '0.6875rem',
                    }}
                  >
                    {section.items.length}
                  </span>
                </div>
              </div>

              {section.items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {section.items.map((svc, i) => (
                    <ServiceCard
                      key={svc.id}
                      service={svc}
                      onClick={s => navigate(`/services/${s.id}/edit`)}
                      onQuickRenew={handleQuickRenew}
                      index={i}
                      layout="list"
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-6 font-mono text-xs rounded-sm"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1.5px dashed var(--color-border-soft)',
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
      )}
    </div>
  );
}

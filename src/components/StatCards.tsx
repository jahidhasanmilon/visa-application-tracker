import type { StatCounts } from '../types';

interface StatCardsProps {
  stats: StatCounts;
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="vt-stats">
      <div className="vt-stat-card">
        <div className="vt-stat-num">{stats.total}</div>
        <div className="vt-stat-label">Total applicants</div>
      </div>
      <div className="vt-stat-card">
        <div className="vt-stat-num" style={{ color: 'var(--gold)' }}>{stats.urgent}</div>
        <div className="vt-stat-label">Due within 30 days</div>
      </div>
      <div className="vt-stat-card">
        <div className="vt-stat-num" style={{ color: 'var(--rust)' }}>{stats.overdue}</div>
        <div className="vt-stat-label">Overdue</div>
      </div>
      <div className="vt-stat-card">
        <div className="vt-stat-num" style={{ color: 'var(--teal)' }}>{stats.approved}</div>
        <div className="vt-stat-label">Approved</div>
      </div>
    </div>
  );
}

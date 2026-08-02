import { Search, Plus, History } from 'lucide-react';
import { STATUS_OPTIONS } from '../constants/status';
import type { StatusOption } from '../types';

interface ToolbarProps {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: StatusOption | 'All';
  setStatusFilter: (v: StatusOption | 'All') => void;
  onAdd: () => void;
  showLog: boolean;
  setShowLog: (v: (prev: boolean) => boolean) => void;
}

export default function Toolbar({
  search, setSearch, statusFilter, setStatusFilter, onAdd, showLog, setShowLog,
}: ToolbarProps) {
  return (
    <div className="vt-toolbar">
      <div className="vt-search">
        <Search size={16} color="#5B6472" />
        <input
          placeholder="Search by name, email, or serial no."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <select
        className="vt-select"
        value={statusFilter}
        onChange={e => setStatusFilter(e.target.value as StatusOption | 'All')}
      >
        <option value="All">All statuses</option>
        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <button className="vt-btn" onClick={onAdd}><Plus size={16} /> Add applicant</button>
      <button className="vt-btn vt-btn-ghost" onClick={() => setShowLog(s => !s)}>
        <History size={16} /> {showLog ? 'Hide log' : 'Status log'}
      </button>
    </div>
  );
}

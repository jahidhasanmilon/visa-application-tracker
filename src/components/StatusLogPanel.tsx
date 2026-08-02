import { fmtDate } from '../utils/dateHelpers';
import type { LogEntry } from '../types';

interface StatusLogPanelProps {
  log: LogEntry[];
}

export default function StatusLogPanel({ log }: StatusLogPanelProps) {
  return (
    <div style={{ marginBottom: 18, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
      {log.length === 0 && <div className="vt-empty">No changes logged yet.</div>}
      {log.slice(0, 15).map((l, i) => (
        <div className="vt-log-item" key={i}>
          <span className="vt-log-date">{fmtDate(l.date)}</span>
          <span><b>{l.name}</b> — {l.update}</span>
        </div>
      ))}
    </div>
  );
}

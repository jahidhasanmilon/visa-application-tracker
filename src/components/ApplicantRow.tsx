import { Pencil, Trash2 } from 'lucide-react';
import { STATUS_META } from '../constants/status';
import { fmtDate } from '../utils/dateHelpers';
import type { EnrichedApplicant } from '../types';

interface ApplicantRowProps {
  applicant: EnrichedApplicant;
  onEdit: (a: EnrichedApplicant) => void;
  onDelete: (id: string) => void;
  confirmingDelete: boolean;
  onAskDelete: (id: string) => void;
  onCancelDelete: () => void;
}

export default function ApplicantRow({
  applicant, onEdit, onDelete, confirmingDelete, onAskDelete, onCancelDelete,
}: ApplicantRowProps) {
  const a = applicant;
  const meta = STATUS_META[a.status] || STATUS_META['Applied'];
  const Icon = meta.icon;

  return (
    <tr>
      <td className="vt-mono">{a.serialNo}</td>
      <td>
        <div style={{ fontWeight: 600 }}>{a.name}</div>
        <div style={{ fontSize: 11.5, color: 'var(--slate)' }}>{a.email || 'no email on file'}</div>
      </td>
      <td>
        <span className="vt-badge" style={{ background: meta.bg, color: meta.color }}>
          <Icon size={13} /> {a.status}
        </span>
      </td>
      <td className="vt-mono">{fmtDate(a.created)}</td>
      <td>{a.waiting}d</td>
      <td>
        <span className="vt-urgency-dot" style={{ background: a.urg.color }} />
        {a.remaining > 0 ? `${a.remaining}d left` : `${Math.abs(a.remaining)}d overdue`}
      </td>
      <td className="vt-mono">{fmtDate(a.lastUpdated)}</td>
      <td>
        <span className="vt-badge" style={{
          background: a.reminderMailSent === 'Sent' ? '#DCEEE6' : '#F7E4DB',
          color: a.reminderMailSent === 'Sent' ? '#2F6F62' : '#C1440E',
        }}>
          {a.reminderMailSent}
        </span>
      </td>
      <td style={{ maxWidth: 160, fontSize: 12.5, color: 'var(--slate)' }}>{a.notes || '—'}</td>
      <td style={{ position: 'relative', whiteSpace: 'nowrap' }}>
        <button className="vt-icon-btn" onClick={() => onEdit(a)}><Pencil size={15} /></button>
        <button className="vt-icon-btn" onClick={() => onAskDelete(a.id)}><Trash2 size={15} /></button>
        {confirmingDelete && (
          <div className="vt-confirm" style={{ right: 0, top: '100%' }}>
            <div style={{ marginBottom: 8 }}>Delete {a.name}?</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="vt-btn" style={{ background: 'var(--rust)', padding: '6px 10px' }} onClick={() => onDelete(a.id)}>Delete</button>
              <button className="vt-btn vt-btn-ghost" style={{ padding: '6px 10px' }} onClick={onCancelDelete}>Cancel</button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

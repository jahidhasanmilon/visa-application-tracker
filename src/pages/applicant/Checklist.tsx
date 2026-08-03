import { useEffect, useState } from 'react';
import { Check, Circle } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { subscribeMyApplicants, updateChecklist } from '../../services/applicantsService';
import type { Applicant, ChecklistItem } from '../../types';

interface ApplicantChecklistProps {
  email: string;
}

export default function ApplicantChecklist({ email }: ApplicantChecklistProps) {
  const [applicants, setApplicants] = useState<Applicant[] | null>(null);

  useEffect(() => {
    const unsub = subscribeMyApplicants(email, setApplicants);
    return unsub;
  }, [email]);

  return (
    <>
      <PageHeader title="Checklist" subtitle="Tasks your case officer has set for your application." />
      <div className="app-content">
        {applicants === null ? (
          <div className="app-loading-screen" style={{ minHeight: 200 }}>Loading your checklist…</div>
        ) : applicants.length === 0 ? (
          <div className="app-card app-card-pad">
            <div className="app-empty">
              No application found for <strong style={{ color: 'var(--ink)' }}>{email}</strong>.
            </div>
          </div>
        ) : (
          applicants.map(a => <ChecklistCard key={a.id} applicant={a} />)
        )}
      </div>
    </>
  );
}

function ChecklistCard({ applicant }: { applicant: Applicant }) {
  const items = applicant.checklist || [];
  const [saving, setSaving] = useState<string | null>(null);

  async function toggle(item: ChecklistItem) {
    setSaving(item.id);
    try {
      const next = items.map(i => i.id === item.id ? { ...i, done: !i.done } : i);
      await updateChecklist(applicant.id, next);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="app-card app-card-pad">
      <div className="app-card-head">
        <div>
          <div className="app-card-title">{applicant.name}</div>
          <div className="app-mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{applicant.serialNo}</div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="app-empty">No checklist items yet — your case officer hasn't added any.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => toggle(item)}
              disabled={saving === item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 4px', borderBottom: '1px solid var(--border)',
                background: 'none', border: 'none', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border)',
                width: '100%', textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit',
              }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: item.done ? 'var(--success)' : 'var(--neutral-soft)',
                color: item.done ? '#fff' : 'var(--muted-2)',
              }}>
                {item.done ? <Check size={13} /> : <Circle size={9} fill="currentColor" />}
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--muted)' : 'var(--ink)' }}>
                {item.label}
              </span>
              <span className="app-badge" style={{
                background: item.done ? 'var(--success-soft)' : 'var(--neutral-soft)',
                color: item.done ? 'var(--success)' : 'var(--neutral)',
              }}>
                {item.done ? 'Done' : 'Not yet'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

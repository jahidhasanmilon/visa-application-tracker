import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { subscribeMyApplicants, updateReminderStatus } from '../../services/applicantsService';
import { enrichApplicant, fmtDate, todayStr } from '../../utils/dateHelpers';
import { getStatusMeta, REMINDER_OPTIONS } from '../../constants/status';
import type { Applicant, EnrichedApplicant, ReminderStatus } from '../../types';

const TIMELINE: string[] = ['Applied', 'Submitted', 'Under Review', 'Approved'];

interface ApplicantDashboardProps {
  email: string;
}

export default function ApplicantDashboard({ email }: ApplicantDashboardProps) {
  const [applicants, setApplicants] = useState<Applicant[] | null>(null);

  useEffect(() => {
    const unsub = subscribeMyApplicants(email, setApplicants);
    return unsub;
  }, [email]);

  const enriched: EnrichedApplicant[] = (applicants || []).map(a => enrichApplicant(a, todayStr()));

  return (
    <>
      <PageHeader title="My Status" subtitle="Live progress on your visa application." />
      <div className="app-content">
        {applicants === null ? (
          <div className="app-loading-screen" style={{ minHeight: 200 }}>Loading your application…</div>
        ) : enriched.length === 0 ? (
          <div className="app-card app-card-pad">
            <div className="app-empty">
              No application found for <strong style={{ color: 'var(--ink)' }}>{email}</strong>.<br />
              If you've already applied, contact the team to confirm the email on file.
            </div>
          </div>
        ) : (
          enriched.map(a => <ApplicationCard key={a.id} a={a} />)
        )}
      </div>
    </>
  );
}

function ApplicationCard({ a }: { a: EnrichedApplicant }) {
  const meta = getStatusMeta(a.status);
  const rejected = a.status === 'Rejected';
  const activeIndex = TIMELINE.indexOf(a.status);
  const [savingReminder, setSavingReminder] = useState(false);

  async function handleReminderChange(value: ReminderStatus) {
    setSavingReminder(true);
    try {
      await updateReminderStatus(a.id, value);
    } finally {
      setSavingReminder(false);
    }
  }

  return (
    <div className="app-card app-card-pad">
      <div className="app-card-head">
        <div>
          <div className="app-card-title">{a.name}</div>
          <div className="app-mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{a.serialNo}</div>
        </div>
        <span className="app-badge" style={{ background: meta.bg, color: meta.color, fontSize: 13, padding: '6px 14px' }}>
          <meta.icon size={14} /> {a.status}
        </span>
      </div>

      {rejected ? (
        <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', borderRadius: 12, padding: '14px 16px', fontSize: 13.5, fontWeight: 500 }}>
          This application was not approved. Contact the team for more details.
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0 22px' }}>
          {TIMELINE.map((step, i) => {
            const done = i <= activeIndex;
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i === TIMELINE.length - 1 ? '0 0 auto' : 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? 'var(--success)' : 'var(--neutral-soft)',
                    color: done ? '#fff' : 'var(--muted-2)',
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>
                    {done ? <Check size={13} /> : i + 1}
                  </div>
                  <div style={{ fontSize: 10.5, color: done ? 'var(--ink)' : 'var(--muted-2)', fontWeight: done ? 600 : 500, whiteSpace: 'nowrap' }}>{step}</div>
                </div>
                {i < TIMELINE.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < activeIndex ? 'var(--success)' : 'var(--border)', margin: '0 6px 18px' }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        <Field label="Applied on" value={fmtDate(a.created)} />
        <Field label="Submitted on" value={fmtDate(a.submitted)} />
        <Field label="Waiting" value={`${a.waiting} days`} />
        <Field
          label={a.remaining > 0 ? 'Estimated remaining' : 'Status'}
          value={a.remaining > 0 ? `${a.remaining} days (est.)` : `${Math.abs(a.remaining)}d past target`}
          color={a.urg.color}
        />
      </div>

      <div style={{ paddingTop: 14, marginTop: 14, borderTop: '1px solid var(--border)' }}>
        <div className="app-field" style={{ margin: 0, maxWidth: 240 }}>
          <label>Application Reminder (30-Day)</label>
          <select
            className="app-select"
            value={a.reminderMailSent}
            disabled={savingReminder}
            onChange={e => handleReminderChange(e.target.value as ReminderStatus)}
          >
            {REMINDER_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div style={{ fontSize: 11.5, color: a.reminderDaysLeft > 0 ? 'var(--muted)' : 'var(--danger)', marginTop: 6 }}>
            {a.reminderDaysLeft > 0 ? `${a.reminderDaysLeft} days left in this window` : `${Math.abs(a.reminderDaysLeft)} days overdue`}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3, color: color || 'var(--ink)' }}>{value}</div>
    </div>
  );
}

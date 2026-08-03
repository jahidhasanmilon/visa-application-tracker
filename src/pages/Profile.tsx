import { useEffect, useState } from 'react';
import { ShieldCheck, UserRound, Mail, LogOut } from 'lucide-react';
import type { User } from 'firebase/auth';
import PageHeader from '../components/PageHeader';
import UserAvatar from '../components/UserAvatar';
import { useApplicants } from '../hooks/useApplicants';
import type { AppRole } from '../constants/roles';
import type { EmailTemplate } from '../types';
import { signOut } from '../services/authService';
import { subscribeEmailTemplate, saveEmailTemplate } from '../services/emailTemplateService';
import { DEFAULT_EMAIL_TEMPLATE, EMAIL_TEMPLATE_PLACEHOLDERS } from '../constants/emailTemplate';

interface ProfileProps {
  user: User;
  role: AppRole;
}

export default function Profile({ user, role }: ProfileProps) {
  return (
    <>
      <PageHeader title="Profile" subtitle="Your account details." />
      <div className="app-content">
        <div className="app-card app-card-pad" style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <UserAvatar user={user} size="lg" style={{ background: 'var(--violet-soft)', color: 'var(--violet)' }} />
          <div style={{ flex: 1, minWidth: 160 }}>
            <div className="app-brand-font" style={{ fontWeight: 700, fontSize: 18 }}>{user.displayName || 'Signed-in account'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
              <Mail size={13} /> {user.email}
            </div>
            <div className="app-role-pill" style={{ marginTop: 10 }}>
              {role === 'admin' ? <ShieldCheck size={12} /> : <UserRound size={12} />}
              {role === 'admin' ? 'Staff / Admin' : 'Applicant'}
            </div>
          </div>
          <button className="app-btn app-btn-ghost" onClick={() => signOut()}>
            <LogOut size={15} /> Sign out
          </button>
        </div>

        {role === 'admin' ? (
          <>
            <AdminSummary />
            <EmailTemplateSettings />
          </>
        ) : <ApplicantSummary email={user.email} />}
      </div>
    </>
  );
}

function AdminSummary() {
  const { stats, loading } = useApplicants();
  if (loading) return null;
  return (
    <div className="app-card app-card-pad">
      <div className="app-card-head">
        <div className="app-card-title">At a glance</div>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <SummaryStat label="Applicants managed" value={stats.total} />
        <SummaryStat label="Approved" value={stats.approved} />
        <SummaryStat label="Overdue" value={stats.overdue} />
      </div>
    </div>
  );
}

function EmailTemplateSettings() {
  const [template, setTemplate] = useState<EmailTemplate>(DEFAULT_EMAIL_TEMPLATE);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => subscribeEmailTemplate(t => { if (t) setTemplate(t); }), []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveEmailTemplate(template);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-card app-card-pad">
      <div className="app-card-head">
        <div className="app-card-title">Reminder email template</div>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: -8, marginBottom: 14 }}>
        Sent automatically once a 30-day reminder is overdue. Placeholders: {EMAIL_TEMPLATE_PLACEHOLDERS.join(', ')}
      </p>
      <div className="app-field">
        <label>Subject</label>
        <input className="app-input" value={template.subject} onChange={e => setTemplate({ ...template, subject: e.target.value })} />
      </div>
      <div className="app-field">
        <label>Body</label>
        <textarea
          className="app-textarea"
          style={{ minHeight: 180, fontFamily: 'inherit' }}
          value={template.body}
          onChange={e => setTemplate({ ...template, body: e.target.value })}
        />
      </div>
      <button className="app-btn app-btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save template'}
      </button>
    </div>
  );
}

function ApplicantSummary({ email }: { email: string | null }) {
  return (
    <div className="app-card app-card-pad">
      <div className="app-card-head">
        <div className="app-card-title">How this works</div>
      </div>
      <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
        Your dashboard shows the applicant record on file with the email address <strong style={{ color: 'var(--ink)' }}>{email}</strong>.
        If your status looks out of date, reach out to the team that filed your application — only staff can make changes here.
      </p>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="app-brand-font" style={{ fontWeight: 700, fontSize: 26 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

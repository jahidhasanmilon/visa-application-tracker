import { ShieldCheck, UserRound, Mail, LogOut } from 'lucide-react';
import type { User } from 'firebase/auth';
import PageHeader from '../components/PageHeader';
import { useApplicants } from '../hooks/useApplicants';
import type { AppRole } from '../constants/roles';
import { signOut } from '../services/authService';

interface ProfileProps {
  user: User;
  role: AppRole;
}

function initialsFor(user: User): string {
  const source = user.displayName || user.email || '?';
  const parts = source.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function Profile({ user, role }: ProfileProps) {
  return (
    <>
      <PageHeader title="Profile" subtitle="Your account details." />
      <div className="app-content">
        <div className="app-card app-card-pad" style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div className="app-avatar app-avatar-lg" style={{ background: 'var(--violet-soft)', color: 'var(--violet)' }}>
            {initialsFor(user)}
          </div>
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

        {role === 'admin' ? <AdminSummary /> : <ApplicantSummary email={user.email} />}
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

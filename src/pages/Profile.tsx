import { useRef, useState } from 'react';
import { ShieldCheck, UserRound, Mail, LogOut, Camera, Loader2 } from 'lucide-react';
import type { User } from 'firebase/auth';
import PageHeader from '../components/PageHeader';
import UserAvatar from '../components/UserAvatar';
import { useApplicants } from '../hooks/useApplicants';
import type { AppRole } from '../constants/roles';
import { signOut, uploadProfilePhoto } from '../services/authService';

interface ProfileProps {
  user: User;
  role: AppRole;
  onPhotoChange: () => void;
}

export default function Profile({ user, role, onPhotoChange }: ProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setUploadError('Image must be under 3MB.');
      return;
    }
    setUploadError('');
    setUploading(true);
    try {
      await uploadProfilePhoto(file);
      onPhotoChange();
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <PageHeader title="Profile" subtitle="Your account details." />
      <div className="app-content">
        <div className="app-card app-card-pad" style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <UserAvatar user={user} size="lg" />
            <button
              type="button"
              className="app-icon-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Change profile photo"
              style={{
                position: 'absolute', bottom: -2, right: -2, width: 24, height: 24,
                borderRadius: '50%', background: 'var(--violet)', color: '#fff',
                border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {uploading ? <Loader2 size={12} className="app-spin" /> : <Camera size={12} />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div className="app-brand-font" style={{ fontWeight: 700, fontSize: 18 }}>{user.displayName || 'Signed-in account'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
              <Mail size={13} /> {user.email}
            </div>
            <div className="app-role-pill" style={{ marginTop: 10 }}>
              {role === 'admin' ? <ShieldCheck size={12} /> : <UserRound size={12} />}
              {role === 'admin' ? 'Admin' : 'Applicant'}
            </div>
            {uploadError && (
              <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 8 }}>{uploadError}</div>
            )}
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
        If your status looks out of date, reach out to the team that filed your application — only admin can make changes here.
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

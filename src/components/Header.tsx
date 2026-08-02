import { LogOut } from 'lucide-react';

interface HeaderProps {
  userEmail?: string | null;
  onSignOut?: () => void;
}

export default function Header({ userEmail, onSignOut }: HeaderProps) {
  return (
    <div className="vt-header">
      <div className="vt-stamp"><span>VT</span></div>
      <div style={{ flex: 1 }}>
        <div className="vt-title">VisaTrack</div>
        <div className="vt-subtitle">Applicant status &amp; deadline tracker</div>
      </div>
      {userEmail && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--slate)' }}>{userEmail}</span>
          <button className="vt-icon-btn" onClick={onSignOut} title="Sign out">
            <LogOut size={17} />
          </button>
        </div>
      )}
    </div>
  );
}

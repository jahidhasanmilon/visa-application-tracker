import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Briefcase, KanbanSquare, UserCircle, LogOut, PlaneTakeoff } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { AppRole } from '../constants/roles';
import { signOut } from '../services/authService';

interface AppShellProps {
  user: User;
  role: AppRole;
}

const ADMIN_NAV = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/applications', label: 'Applications', icon: Briefcase },
  { to: '/app/tracker', label: 'Tracker', icon: KanbanSquare },
  { to: '/app/profile', label: 'Profile', icon: UserCircle },
];

const APPLICANT_NAV = [
  { to: '/app/dashboard', label: 'My Status', icon: LayoutDashboard },
  { to: '/app/profile', label: 'Profile', icon: UserCircle },
];

function initialsFor(user: User): string {
  const source = user.displayName || user.email || '?';
  const parts = source.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function AppShell({ user, role }: AppShellProps) {
  const navItems = role === 'admin' ? ADMIN_NAV : APPLICANT_NAV;

  return (
    <div className="app-root app-shell">
      <aside className="app-sidebar">
        <div className="app-logo">
          <div className="app-logo-mark"><PlaneTakeoff size={18} /></div>
          <div>
            <div className="app-logo-text">VisaTrack</div>
            <div className="app-logo-sub">{role === 'admin' ? 'Staff console' : 'Applicant portal'}</div>
          </div>
        </div>

        <nav className="app-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `app-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar-footer">
          <div className="app-sidebar-user">
            <div className="app-avatar">{initialsFor(user)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || 'Signed in'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--sidebar-text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
            <button
              className="app-icon-btn"
              style={{ color: 'var(--sidebar-text)' }}
              title="Sign out"
              onClick={() => signOut()}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

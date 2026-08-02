import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Briefcase, KanbanSquare, UserCircle, LogOut, PlaneTakeoff, Menu, X } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { AppRole } from '../constants/roles';
import { signOut } from '../services/authService';
import ThemeToggle from '../components/ThemeToggle';

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="app-root app-shell">
      <div className="app-mobile-topbar">
        <div className="app-logo" style={{ padding: 0 }}>
          <div className="app-logo-mark"><PlaneTakeoff size={16} /></div>
          <div className="app-logo-text" style={{ color: 'var(--ink)' }}>VisaTrack</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ThemeToggle />
          <button className="app-icon-btn" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {mobileNavOpen && <div className="app-mobile-backdrop" onClick={() => setMobileNavOpen(false)} />}

      <aside className={`app-sidebar${mobileNavOpen ? ' mobile-open' : ''}`}>
        <div className="app-logo">
          <div className="app-logo-mark"><PlaneTakeoff size={18} /></div>
          <div style={{ flex: 1 }}>
            <div className="app-logo-text">VisaTrack</div>
            <div className="app-logo-sub">{role === 'admin' ? 'Staff console' : 'Applicant portal'}</div>
          </div>
          <button className="app-icon-btn app-sidebar-close" style={{ color: 'var(--sidebar-text)' }} onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="app-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `app-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setMobileNavOpen(false)}
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
            <ThemeToggle className="app-icon-btn" style={{ color: 'var(--sidebar-text)' }} />
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

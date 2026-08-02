import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import {
  signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, friendlyAuthError,
} from '../../services/authService';

interface AuthFormProps {
  title: string;
  subtitle: string;
  switchTo: { to: string; label: string };
  allowSignUp?: boolean;
  /** Return an error message to reject this account right after sign-in (and sign it back out). */
  guard?: (email: string | null) => string | null;
}

export default function AuthForm({ title, subtitle, switchTo, allowSignUp = true, guard }: AuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function afterAuth(signedInEmail: string | null) {
    if (guard) {
      const rejection = guard(signedInEmail);
      if (rejection) {
        await signOut();
        setError(rejection);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const cred = mode === 'signin'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);
      await afterAuth(cred.user.email);
    } catch (err) {
      const code = (err as { code?: string }).code || '';
      setError(friendlyAuthError(code));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setBusy(true);
    try {
      const cred = await signInWithGoogle();
      await afterAuth(cred.user.email);
    } catch (err) {
      const code = (err as { code?: string }).code || '';
      setError(friendlyAuthError(code));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--muted)', textDecoration: 'none', marginBottom: 22 }}>
        <ArrowLeft size={14} /> Choose a different portal
      </Link>

      <div className="app-page-title" style={{ marginBottom: 4 }}>{title}</div>
      <div style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 24 }}>{subtitle}</div>

      <form onSubmit={handleSubmit}>
        <div className="app-field">
          <label>Email</label>
          <div className="app-input-wrap">
            <Mail size={16} />
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>
        <div className="app-field">
          <label>Password</label>
          <div className="app-input-wrap">
            <Lock size={16} />
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
        </div>

        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</div>}

        <button className="app-btn app-btn-primary app-btn-block" type="submit" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <div className="app-divider-text">or</div>

      <button className="app-btn app-btn-ghost app-btn-block" onClick={handleGoogle} disabled={busy}>
        Continue with Google
      </button>

      {allowSignUp && (
        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--muted)' }}>
          {mode === 'signin' ? (
            <>Don't have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode('signup'); setError(''); }} style={{ color: 'var(--ink)', fontWeight: 600 }}>Sign up</a>
            </>
          ) : (
            <>Already have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode('signin'); setError(''); }} style={{ color: 'var(--ink)', fontWeight: 600 }}>Sign in</a>
            </>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12.5 }}>
        <Link to={switchTo.to} style={{ color: 'var(--violet)', fontWeight: 600, textDecoration: 'none' }}>{switchTo.label}</Link>
      </div>
    </div>
  );
}

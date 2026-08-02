import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, friendlyAuthError } from '../services/authService';

export default function LoginScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
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
      await signInWithGoogle();
    } catch (err) {
      const code = (err as { code?: string }).code || '';
      setError(friendlyAuthError(code));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="vt-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="vt-panel" style={{ width: '100%', maxWidth: 380 }}>
        <div className="vt-header" style={{ marginBottom: 20, border: 'none', paddingBottom: 0 }}>
          <div className="vt-stamp"><span>VT</span></div>
          <div>
            <div className="vt-title" style={{ fontSize: 22 }}>VisaTrack</div>
            <div className="vt-subtitle">{mode === 'signin' ? 'Sign in to continue' : 'Create an account'}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="vt-field">
            <label>Email</label>
            <div className="vt-search" style={{ width: '100%' }}>
              <Mail size={16} color="#5B6472" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </div>
          <div className="vt-field">
            <label>Password</label>
            <div className="vt-search" style={{ width: '100%' }}>
              <Lock size={16} color="#5B6472" />
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          {error && <div style={{ color: 'var(--rust)', fontSize: 13, marginBottom: 12 }}>{error}</div>}

          <button className="vt-btn" type="submit" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          className="vt-btn vt-btn-ghost"
          onClick={handleGoogle}
          disabled={busy}
          style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
        >
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--slate)' }}>
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
      </div>
    </div>
  );
}

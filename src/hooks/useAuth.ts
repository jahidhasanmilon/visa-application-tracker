import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase';
import { roleForEmail, type AppRole } from '../constants/roles';

export function useAuth(): { user: User | null; role: AppRole | null; authLoading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, role: user ? roleForEmail(user.email) : null, authLoading };
}

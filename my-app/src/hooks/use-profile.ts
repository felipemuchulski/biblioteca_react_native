import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { getFirebaseAuth } from '../../database/firebase';
import { subscribeToUserProfile, type UserProfile } from '../../database/users';

type ProfileState = {
  loading: boolean;
  user: User | null;
  profile: UserProfile | null;
  error: string;
};

export function useProfile() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<ProfileState>({
    loading: true, user: null, profile: null, error: '',
  });

  useEffect(() => {
    let active = true;
    let generation = 0;
    let unsubscribeAuth: (() => void) | undefined;
    let unsubscribeProfile: (() => void) | undefined;
    const fail = () => {
      if (active) setState((current) => ({
        ...current, loading: false, error: 'Não foi possível carregar seu perfil. Tente novamente.',
      }));
    };
    try {
      unsubscribeAuth = onAuthStateChanged(getFirebaseAuth(), (user) => {
        const currentGeneration = ++generation;
        unsubscribeProfile?.();
        unsubscribeProfile = undefined;
        setState({ loading: !!user, user, profile: null, error: '' });
        if (!user) return;
        const isCurrent = () => active && generation === currentGeneration;
        void subscribeToUserProfile(user.uid, (profile) => {
          if (isCurrent()) setState({ loading: false, user, profile, error: '' });
        }, () => { if (isCurrent()) fail(); }).then((unsubscribe) => {
          if (isCurrent()) unsubscribeProfile = unsubscribe;
          else unsubscribe();
        }).catch(() => { if (isCurrent()) fail(); });
      }, fail);
    } catch {
      fail();
    }
    return () => {
      active = false;
      unsubscribeAuth?.();
      unsubscribeProfile?.();
    };
  }, [attempt]);

  return { ...state, retry: () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    setAttempt((current) => current + 1);
  } };
}

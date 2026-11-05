import { useEffect, useState } from 'react';
import { collection, getFirestore, limit, onSnapshot, query, where, type DocumentData } from 'firebase/firestore';
import { getFirebaseAuth } from '../../database/firebase';

export type ProfileRecord = { id: string; data: DocumentData };
export type RecordKind = 'books' | 'trades';

export function useProfileRecords(uid: string | undefined, kind: RecordKind) {
  const [pageSize, setPageSize] = useState(20);
  const [attempt, setAttempt] = useState(0);
  const key = `${uid}:${kind}:${attempt}`;
  const [state, setState] = useState({ key: '', records: [] as ProfileRecord[], loading: true, error: '', hasMore: false });
  useEffect(() => {
    if (!uid) return;
    let active = true;
    const fail = () => {
      if (active) setState({ key, records: [], loading: false, error: 'Não foi possível carregar a lista. Verifique sua conexão e tente novamente.', hasMore: false });
    };
    let unsubscribe: (() => void) | undefined;
    try {
      const db = getFirestore(getFirebaseAuth().app);
      const filter = kind === 'books' ? where('ownerId', '==', uid) : where('participantIds', 'array-contains', uid);
      unsubscribe = onSnapshot(query(collection(db, kind), filter, limit(pageSize + 1)), (snapshot) => {
        if (active) setState({ key, loading: false, error: '', hasMore: snapshot.size > pageSize,
          records: snapshot.docs.slice(0, pageSize).map((item) => ({ id: item.id, data: item.data() })),
        });
      }, fail);
    } catch { fail(); }
    return () => { active = false; unsubscribe?.(); };
  }, [uid, kind, pageSize, key]);
  return {
    ...(state.key === key ? state : { records: [], loading: !!uid, error: '', hasMore: false }),
    loadMore: () => {
      setState((current) => ({ ...current, hasMore: false }));
      setPageSize((size) => size + 20);
    },
    retry: () => setAttempt((value) => value + 1),
  };
}

import {
  useContext,
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { collection, getFirestore, onSnapshot, type DocumentData } from 'firebase/firestore';
import type { Book, BookCondition, BookType, BooksContextData } from '@/types/book';
import { useProfile } from '@/hooks/use-profile';
import {
  calculateDistance,
  formatDistance,
  isValidCoordinates,
} from '@/utils/distance';
import { getFirebaseAuth } from '../../database/firebase';

type BooksContextValue = BooksContextData & {
  books: Book[];
  loading: boolean;
  error: string;
  retry: () => void;
};

export const BooksContext = createContext<BooksContextValue | null>(null);

const types: BookType[] = ['donation', 'exchange', 'pagination'];
const conditions: BookCondition[] = ['new', 'like_new', 'good', 'worn'];

function mapBook(id: string, data: DocumentData): Book | null {
  const images = Array.isArray(data.images)
    ? data.images.filter((image: unknown): image is string => typeof image === 'string' && !!image.trim())
    : [];
  const thumbnail = typeof data.thumbnail === 'string' ? data.thumbnail : '';
  const bookImages = images.length ? images : thumbnail ? [thumbnail] : [];
  if (!bookImages.length || typeof data.title !== 'string' || typeof data.author !== 'string') return null;

  return {
    id,
    ...(typeof data.ownerId === 'string' ? { ownerId: data.ownerId } : {}),
    title: data.title,
    author: data.author,
    images: bookImages,
    thumbnail: thumbnail || bookImages[0],
    type: types.includes(data.type) ? data.type : 'donation',
    distance: formatDistance(null),
    ownerCoordinates: isValidCoordinates(data.ownerCoordinates)
      ? data.ownerCoordinates
      : null,
    owner: typeof data.owner === 'string' && data.owner.trim() ? data.owner : 'Usuário',
    ownerId: typeof data.ownerId === 'string' ? data.ownerId : undefined,
    isFavorite: false,
    category: Array.isArray(data.category)
      ? data.category.filter((category: unknown): category is string => typeof category === 'string')
      : [],
    available: typeof data.available === 'boolean' ? data.available : true,
    bookCondition: conditions.includes(data.bookCondition) ? data.bookCondition : 'good',
    ...(typeof data.bookConditionNote === 'string' ? { bookConditionNote: data.bookConditionNote } : {}),
    ...(typeof data.ownerNeighborhood === 'string'
      ? { ownerNeighborhood: data.ownerNeighborhood }
      : {}),
    ...(typeof data.ownerCity === 'string' ? { ownerCity: data.ownerCity } : {}),
  };
}

export function BooksProvider({ children }: { children: ReactNode }) {
  const { user, profile, loading: profileLoading } = useProfile();
  const userId = user?.uid;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({
    uid: '',
    attempt: -1,
    books: [] as Book[],
    loading: true,
    error: '',
  });

  useEffect(() => {
    if (profileLoading) return;

    let active = true;
    try {
      const db = getFirestore(getFirebaseAuth().app);
      const unsubscribe = onSnapshot(
        collection(db, 'books'),
        (snapshot) => {
          if (!active) return;
          setState({
            uid: userId ?? '',
            attempt,
            books: snapshot.docs
              .map((document) => mapBook(document.id, document.data()))
              .filter((book): book is Book => book !== null),
            loading: false,
            error: '',
          });
        },
        () => {
          if (active) {
            setState({
              uid: userId ?? '',
              attempt,
              books: [],
              loading: false,
              error: 'Não foi possível carregar os livros cadastrados.',
            });
          }
        },
      );
      return () => {
        active = false;
        unsubscribe();
      };
    } catch {
      const failureTimeout = setTimeout(() => {
        if (active) {
          setState({
            uid: userId ?? '',
            attempt,
            books: [],
            loading: false,
            error: 'Não foi possível conectar ao catálogo de livros.',
          });
        }
      }, 0);
      return () => {
        active = false;
        clearTimeout(failureTimeout);
      };
    }
  }, [userId, profileLoading, attempt]);

  const stateIsCurrent = state.uid === (userId ?? '') && state.attempt === attempt;
  const books = useMemo(() => (stateIsCurrent ? state.books : []).map((book) => {
    const distanceMeters = calculateDistance(profile?.coordinates, book.ownerCoordinates);
    return { ...book, distanceMeters, distance: formatDistance(distanceMeters) };
  }), [state.books, stateIsCurrent, profile?.coordinates]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <BooksContext.Provider
      value={{
        books,
        loading: !stateIsCurrent || state.loading,
        error: stateIsCurrent ? state.error : '',
        retry: () => setAttempt((current) => current + 1),
        selectedBook,
        setSelectedBook,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);

  if (!context) {
    throw new Error('useBooks deve ser usado dentro de BooksProvider');
  }

  return {...context};
}

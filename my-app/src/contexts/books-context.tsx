import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { BOOKS } from '@/mocks/books';
import type { Book, BooksContextData } from '@/types/book';
import { useProfile } from '@/hooks/use-profile';
import { calculateDistance, formatDistance } from '@/utils/distance';

export const BooksContext = createContext<BooksContextData | null>(null);

export function BooksProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfile();
  const books = useMemo(() => BOOKS.map((book) => {
    const distanceMeters = calculateDistance(profile?.coordinates, book.ownerCoordinates);
    return { ...book, distanceMeters, distance: formatDistance(distanceMeters) };
  }), [profile?.coordinates]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <BooksContext.Provider
      value={{
        books,
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

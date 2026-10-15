import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { BOOKS } from '@/mocks/books';
import type { Book, BooksContextData } from '@/types/book';

export const BooksContext = createContext<BooksContextData | {}>({});

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books] = useState<Book[]>(BOOKS);
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
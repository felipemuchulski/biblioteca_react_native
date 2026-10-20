export type BookType = "donation" | "exchange" | "pagination";

export interface Book {
  id: string;
  title: string;
  author: string;
  images: string[];
  thumbnail: string;
  type: BookType;
  distance: string;
  owner: string;
  isFavorite: boolean;
  category?: string;
}

export interface BooksContextData {
  books?: Book[];
  selectedBook: Book;
  setSelectedBook: (value: Book) => void;
}

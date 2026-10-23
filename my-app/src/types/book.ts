export type BookType = "donation" | "exchange" | "pagination";
export type BookCondition = "new" | "like_new" | "good" | "worn";

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
  category: string[];
  available: boolean;
  bookCondition: BookCondition;
  bookConditionNote?: string;
  ownerNeighborhood?: string;
  ownerCity?: string;
}

export interface BooksContextData {
  books?: Book[];
  selectedBook: Book;
  setSelectedBook: (value: Book) => void;
}

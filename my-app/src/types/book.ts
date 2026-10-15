export interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  type: "donation" | "exchange";
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

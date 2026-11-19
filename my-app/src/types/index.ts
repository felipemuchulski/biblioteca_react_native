// Book
export type BookType = "donation" | "exchange" | "pagination";
export type BookCondition = "new" | "like_new" | "good" | "worn";

export interface Book {
  id: string;
  ownerId?: string;
  title: string;
  author: string;
  images: string[];
  thumbnail: string;
  type: BookType;
  distance: string;
  distanceMeters?: number | null;
  ownerCoordinates?: Coordinates | null;
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
  books: Book[];
  loading: boolean;
  error: string;
  retry: () => void;
  selectedBook: Book | null;
  setSelectedBook: (value: Book) => void;
}

// Address
export type Coordinates = { latitude: number; longitude: number };

// Trade
export type TradeAction =
  | "cancel"
  | "reject"
  | "accept"
  | "decline"
  | "success";

export interface ITradeContact {
  email: string;
  whatsapp: string;
}

export interface ITradeParticipant {
  uid?: string;
  displayName?: string;
}

export interface ITradeData {
  sender?: ITradeParticipant;
  recipient?: ITradeParticipant;
  requestedBook?: { title?: string };
  offeredBooks?: { title?: string }[];
  offeredBookTitle?: string;
  requestedBookTitle?: string;
  status?: string;
  createdAt?: unknown;
  successConfirmedBy?: string[];
}

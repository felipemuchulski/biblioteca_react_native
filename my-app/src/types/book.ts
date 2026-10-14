export interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  type: 'donation' | 'exchange';
  distance: string;
  owner: string;
  isFavorite: boolean;
  category?: string;
}

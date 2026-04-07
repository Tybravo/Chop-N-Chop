export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  maxStock: number;
  isSoldOut: boolean;
  category: 'meal' | 'drink' | 'extra';
  dietary?: string[];
}

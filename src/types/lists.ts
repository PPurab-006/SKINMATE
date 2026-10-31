import { Product } from './product';

export interface SavedListItem {
  id: string;
  productId: string;
  product: Product;
  selectedRetailer?: string;
  savedPrice: number | null;
  savedAt: string;
  notes?: string;
  googleSearchQuery?: string;
  googleSearchUrl?: string;
  sourceAttribution?: string;
}

export interface UserProductList {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
  items: SavedListItem[];
}

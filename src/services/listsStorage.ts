import { UserProductList, SavedListItem } from '../types/lists';
import { Product } from '../types/product';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { buildGoogleProductSearchQuery, buildGoogleProductSearchUrl } from '../utils/googleSearch';

const STORAGE_KEY = 'skinmate_user_lists_v1';

const ceraveCleanse = MOCK_PRODUCTS.find(p => p.id === 'prod-cleanse-03') || MOCK_PRODUCTS[0];
const minimalistSun = MOCK_PRODUCTS.find(p => p.id === 'prod-sun-01') || MOCK_PRODUCTS[1];
const ceraveMoist = MOCK_PRODUCTS.find(p => p.id === 'prod-moist-01') || MOCK_PRODUCTS[2];

export const DEFAULT_LISTS: UserProductList[] = [
  {
    id: 'list-barrier-essentials',
    name: 'Barrier & Hydration Essentials',
    description: 'Targeted formulations for calming, ceramide recovery, and daily SPF defense.',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item-cerave-cleanse',
        productId: ceraveCleanse.id,
        product: ceraveCleanse,
        selectedRetailer: 'Google Search',
        savedPrice: ceraveCleanse.price,
        savedAt: new Date().toISOString(),
        notes: 'Gentle morning cleanser with 3 essential ceramides',
        googleSearchQuery: ceraveCleanse.googleSearchQuery || buildGoogleProductSearchQuery(ceraveCleanse),
        googleSearchUrl: ceraveCleanse.googleSearchUrl || buildGoogleProductSearchUrl(ceraveCleanse),
        sourceAttribution: ceraveCleanse.sourceAttribution || 'Open Beauty Facts'
      },
      {
        id: 'item-minimalist-sun',
        productId: minimalistSun.id,
        product: minimalistSun,
        selectedRetailer: 'Google Search',
        savedPrice: minimalistSun.price,
        savedAt: new Date().toISOString(),
        notes: 'Broad spectrum SPF 50 with 4 chemical UV filters',
        googleSearchQuery: minimalistSun.googleSearchQuery || buildGoogleProductSearchQuery(minimalistSun),
        googleSearchUrl: minimalistSun.googleSearchUrl || buildGoogleProductSearchUrl(minimalistSun),
        sourceAttribution: minimalistSun.sourceAttribution || 'Open Beauty Facts & Brand Official'
      }
    ]
  },
  {
    id: 'list-pore-texture',
    name: 'Pore & Texture Refining',
    description: 'Salicylic acid and niacinamide solutions for T-zone congestion.',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item-paula-bha',
        productId: 'prod-exfol-01',
        product: MOCK_PRODUCTS.find(p => p.id === 'prod-exfol-01') || MOCK_PRODUCTS[2],
        selectedRetailer: 'Nykaa',
        savedPrice: 1200,
        savedAt: new Date().toISOString(),
        notes: '2% BHA liquid exfoliant for evening follicular clearance'
      }
    ]
  },
  {
    id: 'list-wishlist',
    name: 'Saved for Later',
    description: 'Curated products saved from visual consultations and shop discovery.',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: []
  }
];

export class ListsStorageService {
  public static getLists(): UserProductList[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveLists(DEFAULT_LISTS);
        return DEFAULT_LISTS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_LISTS;
    } catch (e) {
      console.warn('Failed to load user lists from localStorage, using memory defaults', e);
      return DEFAULT_LISTS;
    }
  }

  public static saveLists(lists: UserProductList[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (e) {
      console.warn('Failed to persist user lists to localStorage', e);
    }
  }

  public static createList(name: string, description: string = ''): UserProductList {
    const lists = this.getLists();
    const newList: UserProductList = {
      id: `list_${Date.now()}`,
      name: name.trim() || 'My Curated List',
      description: description.trim(),
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: []
    };
    const updated = [...lists, newList];
    this.saveLists(updated);
    return newList;
  }

  public static deleteList(listId: string): UserProductList[] {
    const lists = this.getLists();
    const updated = lists.filter(l => l.id !== listId);
    this.saveLists(updated);
    return updated;
  }

  public static addProductToList(
    listId: string, 
    product: Product, 
    selectedRetailer?: string,
    notes?: string
  ): { success: boolean; listName: string; itemAlreadyExists: boolean } {
    const lists = this.getLists();
    let targetList = lists.find(l => l.id === listId);
    
    // If list not found, fall back to first default list or create one
    if (!targetList) {
      if (lists.length > 0) {
        targetList = lists[0];
      } else {
        targetList = this.createList('Saved for Later');
      }
    }

    // Check if item already exists in this list
    const alreadyExists = targetList.items.some(i => i.productId === product.id);
    if (alreadyExists) {
      return { success: true, listName: targetList.name, itemAlreadyExists: true };
    }

    const googleQuery = product.googleSearchQuery || buildGoogleProductSearchQuery(product);
    const googleUrl = product.googleSearchUrl || buildGoogleProductSearchUrl(product);

    const newItem: SavedListItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      productId: product.id,
      product,
      selectedRetailer: selectedRetailer || 'Google Search',
      savedPrice: product.price,
      savedAt: new Date().toISOString(),
      notes: notes || product.reasonForRecommendation || 'Saved from visual consultation',
      googleSearchQuery: googleQuery,
      googleSearchUrl: googleUrl,
      sourceAttribution: product.sourceAttribution || product.verification?.sourceAttribution || 'Open Beauty Facts & Brand Official Feed'
    };

    targetList.items.unshift(newItem);
    targetList.updatedAt = new Date().toISOString();

    this.saveLists(lists);
    return { success: true, listName: targetList.name, itemAlreadyExists: false };
  }

  public static removeProductFromList(listId: string, itemId: string): UserProductList[] {
    const lists = this.getLists();
    const target = lists.find(l => l.id === listId);
    if (target) {
      target.items = target.items.filter(i => i.id !== itemId);
      target.updatedAt = new Date().toISOString();
      this.saveLists(lists);
    }
    return lists;
  }

  public static moveProduct(fromListId: string, toListId: string, itemId: string): UserProductList[] {
    const lists = this.getLists();
    const sourceList = lists.find(l => l.id === fromListId);
    const destList = lists.find(l => l.id === toListId);

    if (!sourceList || !destList) return lists;

    const itemIdx = sourceList.items.findIndex(i => i.id === itemId);
    if (itemIdx === -1) return lists;

    const [item] = sourceList.items.splice(itemIdx, 1);
    
    // Avoid duplicates in destination
    if (!destList.items.some(i => i.productId === item.productId)) {
      destList.items.unshift(item);
    }

    sourceList.updatedAt = new Date().toISOString();
    destList.updatedAt = new Date().toISOString();

    this.saveLists(lists);
    return lists;
  }
}

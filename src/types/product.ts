export type ProductCategory = 
  | 'cleanser'
  | 'toner'
  | 'serum'
  | 'moisturizer'
  | 'sunscreen'
  | 'exfoliant'
  | 'haircare'
  | 'beardcare'
  | 'makeup'
  | 'nails';

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory;
  subcategory?: string;
  price: number; // in INR ₹
  currency: 'INR' | 'USD' | 'EUR';
  size: string; // e.g. "30ml", "50ml", "200ml"
  imageUrl: string;
  rating: number; // e.g. 4.8
  reviewsCount: number;
  
  // Clinical & formulation attributes
  keyActives: string[];
  fullIngredients: string[];
  activeConcentration?: string; // e.g. "10% Niacinamide + 1% Zinc"
  phLevel?: number; // e.g. 5.5
  texture: 'Gel' | 'Lightweight Cream' | 'Rich Cream' | 'Water / Essence' | 'Oil' | 'Foam' | 'Mousse';
  
  // Suitability filters
  suitableSkinTypes?: ('Dry' | 'Normal' | 'Combination' | 'Oily' | 'Sensitive')[];
  suitableHairTypes?: ('Straight' | 'Wavy' | 'Curly' | 'Coily')[];
  targetConcerns: string[];
  
  // Clinical rule tags for PCPartPicker-style engine
  clinicalTags: (
    | 'retinoid'
    | 'aha'
    | 'bha'
    | 'l-ascorbic-acid'
    | 'vitamin-c-derivative'
    | 'niacinamide'
    | 'ceramides'
    | 'hyaluronic-acid'
    | 'peptides'
    | 'benzoyl-peroxide'
    | 'centella-cica'
    | 'sunscreen-chemical'
    | 'sunscreen-mineral'
    | 'sulfate-free'
    | 'bond-repair'
    | 'argan-oil'
    | 'jojoba'
    | 'zinc-pca'
  )[];

  // Certifications
  isFragranceFree: boolean;
  isVegan: boolean;
  isCrueltyFree: boolean;
  isNonComedogenic: boolean;

  // Retailer availability
  retailers: {
    name: 'Nykaa' | 'Amazon India' | 'Brand Official' | 'Tira';
    url: string;
    inStock: boolean;
  }[];
}

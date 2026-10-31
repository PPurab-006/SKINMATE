export type ProductDepartment = 'skincare' | 'haircare' | 'grooming' | 'beauty';

export type ProductCategory = 
  // Skincare
  | 'cleanser'
  | 'toner'
  | 'serum'
  | 'moisturizer'
  | 'sunscreen'
  | 'exfoliant'
  | 'treatment'
  // Haircare
  | 'shampoo'
  | 'conditioner'
  | 'hair-mask'
  | 'hair-oil'
  | 'hair-styling'
  | 'hair-treatment'
  | 'haircare'
  // Grooming
  | 'beard-oil'
  | 'beard-wash'
  | 'shaving'
  | 'grooming-accessory'
  | 'beardcare'
  // Beauty
  | 'makeup'
  | 'nails'
  | 'cosmetics';

export type ImageSourceType = 'official-brand' | 'open-beauty-facts' | 'trusted-retailer' | 'none';

export interface ProductVerificationMetadata {
  verifiedIdentity: boolean;
  verifiedImage: boolean;
  verifiedIngredients: boolean;
  verifiedDescription: boolean;
  verifiedPrice: boolean;
  dataSource: 'Open Beauty Facts' | 'Official Brand Catalogue' | 'Cosmetic Rules & Brand Feeds' | 'Authorized Feeds';
  sourceAttribution: string; // e.g. "Open Beauty Facts (Barcode: 3337875598996)", "Minimalist Official Brand Registry"
  imageSourceType?: ImageSourceType;
  imageSourceAttribution?: string;
  lastVerifiedDate: string; // ISO date string e.g. "2026-10-31"
  barcode?: string;
  externalReferenceUrl?: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: ProductCategory;
  department?: ProductDepartment;
  subcategory?: string;
  price: number | null; // in INR ₹ (null if price unavailable / unverified)
  referencePrice?: number | null;
  currency: 'INR' | 'USD' | 'EUR';
  size: string; // e.g. "30ml", "50ml", "200ml"
  imageUrl?: string | null; // null/empty if unverified image; intentional typographic fallback rendered
  imageSourceType?: ImageSourceType;
  imageSourceAttribution?: string;
  rating: number; // e.g. 4.8
  reviewsCount: number;
  
  // Exact variant & product identification
  variant?: string; // e.g. "10% Niacinamide + 1% Zinc", "05% Aquaporin"
  exactVariant?: string; // e.g. "100ml Pump Bottle", "30ml Dropper"
  barcode?: string; // Barcode / GTIN where available e.g. "3337875598996"
  gtin?: string;
  
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

  // Exact formulation & verification metadata
  retailerDescription?: string; // Attributed source description
  verificationStatus?: 'verified' | 'brand_partner' | 'curated';
  verificationDate?: string; // e.g. "October 2026"
  compatibilityNotes?: string;
  reasonForRecommendation?: string;

  // Comprehensive Data Quality & Verification
  verification?: ProductVerificationMetadata;
  sourceAttribution?: string;
  lastVerifiedDate?: string;

  // Universal Google Product-Search Redirect
  googleSearchQuery?: string; // e.g. "Minimalist Niacinamide 10% Serum 30ml buy"
  googleSearchUrl?: string; // e.g. "https://www.google.com/search?q=..."

  // Optional legacy retailer availability (kept for backward compatibility)
  retailers?: {
    name: 'Nykaa' | 'Amazon India' | 'Brand Official' | 'Tira' | 'Sephora' | 'Ulta';
    url: string;
    price?: number;
    inStock: boolean;
    lastVerified?: string;
  }[];
}

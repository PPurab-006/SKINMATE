import { Product } from '../types/product';
import { buildGoogleProductSearchQuery, buildGoogleProductSearchUrl } from '../utils/googleSearch';

/**
 * Normalizes a string by converting to lowercase, trimming, and condensing extra whitespace.
 */
export function normalizeString(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s%+.-]/g, ' ') // Preserve alphanumeric, %, +, ., -
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts a normalized composite identity string for exact product matching and deduplication.
 * Includes: Brand + Exact Name + Variant/Formulation + Size (and Barcode/GTIN when available).
 */
export function getNormalizedProductIdentityKey(product: {
  brand: string;
  name: string;
  variant?: string;
  exactVariant?: string;
  size?: string;
  barcode?: string;
  gtin?: string;
}): string {
  const barcode = (product.barcode || product.gtin || '').trim();
  if (barcode) {
    return `barcode:${barcode}`;
  }

  const normBrand = normalizeString(product.brand);
  const normName = normalizeString(product.name);
  const normVariant = normalizeString(product.variant || product.exactVariant);
  const normSize = normalizeString(product.size);

  return `${normBrand}::${normName}::${normVariant}::${normSize}`;
}

export const normalizeProductIdentityKey = getNormalizedProductIdentityKey;

/**
 * Checks if two product records represent the exact same variant.
 * Strictly checks brand, name, variant/concentration, and volume/size.
 * Rejects matching if variants (e.g. 10% vs 5%) or sizes (30ml vs 50ml) differ.
 */
export function areExactProductVariants(a: Product, b: Product): boolean {
  // If both have barcodes, compare barcodes directly
  const aBarcode = a.barcode || a.gtin;
  const bBarcode = b.barcode || b.gtin;
  if (aBarcode && bBarcode) {
    return aBarcode.trim() === bBarcode.trim();
  }

  const normBrandA = normalizeString(a.brand);
  const normBrandB = normalizeString(b.brand);
  if (normBrandA !== normBrandB) return false;

  const normNameA = normalizeString(a.name);
  const normNameB = normalizeString(b.name);
  if (normNameA !== normNameB) return false;

  const normVariantA = normalizeString(a.variant || a.exactVariant);
  const normVariantB = normalizeString(b.variant || b.exactVariant);
  if (normVariantA !== normVariantB) return false;

  const normSizeA = normalizeString(a.size);
  const normSizeB = normalizeString(b.size);
  if (normSizeA !== normSizeB) return false;

  return true;
}

/**
 * Deduplicates an array of products by composite identity or barcode.
 * When duplicates exist, keeps the entry with highest verification status,
 * authentic product photo, and latest verification timestamp.
 */
export function deduplicateProducts(products: Product[]): Product[] {
  const map = new Map<string, Product>();

  for (const prod of products) {
    const key = getNormalizedProductIdentityKey(prod);
    const existing = map.get(key);

    // Ensure Google search query & url are always computed
    const googleQuery = prod.googleSearchQuery || buildGoogleProductSearchQuery(prod);
    const googleUrl = prod.googleSearchUrl || buildGoogleProductSearchUrl(prod);
    const normalizedProduct: Product = {
      ...prod,
      googleSearchQuery: googleQuery,
      googleSearchUrl: googleUrl,
      variant: prod.variant || prod.exactVariant
    };

    if (!existing) {
      map.set(key, normalizedProduct);
      continue;
    }

    // Merge: Prefer verified image, verified ingredients, and more recent verification date
    const existingScore = (existing.verification?.verifiedImage ? 2 : 0) +
                          (existing.verification?.verifiedIngredients ? 1 : 0) +
                          (existing.imageUrl ? 1 : 0);
    const newScore = (normalizedProduct.verification?.verifiedImage ? 2 : 0) +
                     (normalizedProduct.verification?.verifiedIngredients ? 1 : 0) +
                     (normalizedProduct.imageUrl ? 1 : 0);

    if (newScore > existingScore) {
      map.set(key, {
        ...existing,
        ...normalizedProduct,
        googleSearchQuery: googleQuery,
        googleSearchUrl: googleUrl
      });
    }
  }

  return Array.from(map.values());
}

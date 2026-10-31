import { Product } from '../types/product';

/**
 * Builds a precise, high-intent Google search query for a specific product.
 * Standard format:
 *   [Brand] [Exact Product Name] [Variant/Formulation] [Size] buy
 *
 * Example:
 *   "Minimalist Niacinamide 10% Serum 30ml buy"
 */
export function buildGoogleProductSearchQuery(product: {
  brand: string;
  name: string;
  variant?: string;
  exactVariant?: string;
  size?: string;
}): string {
  const parts: string[] = [];

  // 1. Brand
  const brand = (product.brand || '').trim();
  if (brand) parts.push(brand);

  // 2. Exact Product Name
  const name = (product.name || '').trim();
  if (name) parts.push(name);

  // 3. Variant or Formulation (if not already redundant with the name)
  const variant = (product.variant || product.exactVariant || '').trim();
  if (variant && !name.toLowerCase().includes(variant.toLowerCase())) {
    parts.push(variant);
  }

  // 4. Size (e.g., "30ml", "100ml", "236ml" - if not already included in name or variant)
  const size = (product.size || '').trim();
  if (size && !name.toLowerCase().includes(size.toLowerCase()) && !variant.toLowerCase().includes(size.toLowerCase())) {
    parts.push(size);
  }

  // 5. Purchase Intent Keyword
  parts.push('buy');

  // Collapse multiple whitespaces and return
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Generates a safe, fully URL-encoded Google search redirect link.
 * Special characters like '%', '+', and '&' are safely percent-encoded.
 *
 * Example:
 *   "https://www.google.com/search?q=Minimalist%20Niacinamide%2010%25%20Serum%2030ml%20buy"
 */
export function buildGoogleProductSearchUrl(target: {
  brand: string;
  name: string;
  variant?: string;
  exactVariant?: string;
  size?: string;
  googleSearchQuery?: string;
  googleSearchUrl?: string;
} | string): string {
  if (typeof target === 'string') {
    return `https://www.google.com/search?q=${encodeURIComponent(target.trim())}`;
  }

  if (target.googleSearchUrl) {
    return target.googleSearchUrl;
  }

  const query = target.googleSearchQuery || buildGoogleProductSearchQuery(target);
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Safely redirects the user to Google Search in a new tab without window opener vulnerabilities.
 */
export function openGoogleProductSearch(product: Product): void {
  const url = product.googleSearchUrl || buildGoogleProductSearchUrl(product);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Validates that a Google search URL targets Google Search with a specific product query,
 * and is not a generic redirect for brand alone.
 */
export function isValidGoogleProductSearchUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('google.')) return false;
    if (parsed.pathname !== '/search') return false;
    const q = parsed.searchParams.get('q');
    if (!q) return false;
    // Reject queries that are just a single brand word without purchase intent or product identity
    const tokens = q.trim().split(/\s+/);
    return tokens.length >= 2 && q.toLowerCase().includes('buy');
  } catch {
    return false;
  }
}


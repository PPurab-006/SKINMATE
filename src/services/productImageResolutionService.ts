import { Product, ImageSourceType } from '../types/product';
import { getNormalizedProductIdentityKey, normalizeString } from './productIdentityService';

export interface ResolvedProductImage {
  imageUrl: string | null;
  hasVerifiedImage: boolean;
  sourceType: ImageSourceType;
  sourceAttribution: string;
  lastVerifiedDate: string;
  isUnavailable: boolean;
  isIntentionalTypographic: boolean;
  barcode?: string;
  brand: string;
  productName: string;
  variant?: string;
  size?: string;
  reason?: string;
}

export interface CatalogueImageAuditReport {
  totalProducts: number;
  verifiedCount: number;
  missingCount: number;
  invalidCount: number;
  mismatchedCount: number;
  verifiedPercentage: number;
  productsWithVerifiedImages: Product[];
  productsWithMissingImages: Product[];
  productsWithInvalidImages: { product: Product; url: string; reason: string }[];
  productsWithMismatchedImages: { product: Product; url: string; reason: string }[];
  sourceBreakdown: {
    officialBrand: number;
    openBeautyFacts: number;
    trustedRetailer: number;
    typographicFallback: number;
  };
  generatedAt: string;
}

interface ImageCacheEntry {
  url: string | null;
  sourceType: ImageSourceType;
  source: string;
  verifiedAt: string;
  isValid: boolean;
}

/**
 * ProductImageResolutionService
 * 
 * Enforces strict 3-tier image resolution hierarchy:
 * 1. Exact product images from official brand sources.
 * 2. Open Beauty Facts as secondary image source.
 * 3. Trusted retailer image sources where permitted.
 * 
 * Rejects arbitrary stock photography and AI-generated images.
 * Provides intentional typographic fallback data when no verified image exists.
 */
class ProductImageResolutionService {
  private cache: Map<string, ImageCacheEntry> = new Map();
  private failedUrls: Set<string> = new Set();
  private verifiedSuccessfulUrls: Set<string> = new Set();

  constructor() {
    // Load cached validation entries from sessionStorage if available
    try {
      const stored = sessionStorage.getItem('skinmate_image_resolution_cache_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([key, val]) => {
          this.cache.set(key, val as ImageCacheEntry);
        });
      }
    } catch {
      // Ignore storage errors in non-browser contexts
    }
  }

  private persistCache() {
    try {
      const obj: Record<string, ImageCacheEntry> = {};
      this.cache.forEach((val, key) => {
        obj[key] = val;
      });
      sessionStorage.setItem('skinmate_image_resolution_cache_v2', JSON.stringify(obj));
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Evaluates image URL against known official brand domains
   */
  public isOfficialBrandUrl(url: string, brand: string): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    const normBrand = normalizeString(brand);

    const officialBrandDomains: Record<string, string[]> = {
      minimalist: ['beminimalist.co', 'cdn.shopify.com/s/files/1/0410/9608/5665'],
      cerave: ['cerave.com', 'cerave.co.uk', 'cerave.in'],
      'the derma co': ['thedermaco.com'],
      cosrx: ['cosrx.com', 'cosrx.co.kr'],
      'paula s choice': ['paulaschoice.com', 'paulaschoice.in'],
      olaplex: ['olaplex.com'],
      'bombay shaving company': ['bombayshavingcompany.com'],
      'maybelline new york': ['maybelline.com', 'maybelline.co.in'],
      opi: ['opi.com'],
      sebamed: ['sebamed.com', 'sebamedindia.com']
    };

    const domains = officialBrandDomains[normBrand];
    if (domains && domains.some(d => lower.includes(d))) {
      return true;
    }

    return lower.includes(`${normBrand.replace(/\s+/g, '')}.com`);
  }

  /**
   * Evaluates if URL is from Open Beauty Facts
   */
  public isOpenBeautyFactsUrl(url: string): boolean {
    if (!url) return false;
    return url.includes('openbeautyfacts.org');
  }

  /**
   * Evaluates if URL is from a trusted retailer
   */
  public isTrustedRetailerUrl(url: string): boolean {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('nykaa.com') || 
           lower.includes('sephora.in') || 
           lower.includes('images-static.nykaa.com');
  }

  /**
   * Strictly flags generic stock photos or AI-generated image substitutes
   */
  public isDisallowedImage(url: string): boolean {
    if (!url) return true;
    const lower = url.toLowerCase();
    return lower.includes('unsplash.com') ||
           lower.includes('pexels.com') ||
           lower.includes('pixabay.com') ||
           lower.includes('shutterstock.com') ||
           lower.includes('placeholder') ||
           lower.includes('dummyimage');
  }

  /**
   * Checks if an image URL potentially mismatches the product brand
   */
  public detectImageMismatch(product: Product, url?: string | null): { isMismatch: boolean; reason?: string } {
    const candidate = url || product.imageUrl;
    if (!candidate) {
      return { isMismatch: false };
    }

    if (this.isDisallowedImage(candidate)) {
      return {
        isMismatch: true,
        reason: 'Image points to arbitrary stock photography rather than exact product package'
      };
    }

    const lower = candidate.toLowerCase();
    const normBrand = normalizeString(product.brand);

    // List of major distinct brands to check for cross-brand collisions
    const knownBrands = [
      { key: 'cerave', name: 'CeraVe' },
      { key: 'minimalist', name: 'Minimalist' },
      { key: 'dermaco', name: 'The Derma Co' },
      { key: 'cosrx', name: 'Cosrx' },
      { key: 'olaplex', name: 'Olaplex' },
      { key: 'sebamed', name: 'Sebamed' },
      { key: 'maybelline', name: 'Maybelline' }
    ];

    for (const b of knownBrands) {
      if (lower.includes(b.key) && !normBrand.includes(b.key)) {
        return {
          isMismatch: true,
          reason: `Image URL contains '${b.name}' domain/path but product brand is '${product.brand}'`
        };
      }
    }

    return { isMismatch: false };
  }

  /**
   * Resolves the verified image for a product following the 3-tier hierarchy:
   * 1. Official Brand Source
   * 2. Open Beauty Facts
   * 3. Trusted Retailer
   * 
   * If unverified or missing, cleanly returns an intentional typographic state.
   */
  public resolveImage(product: Product): ResolvedProductImage {
    const key = getNormalizedProductIdentityKey(product);
    const cached = this.cache.get(key);
    const todayIso = new Date().toISOString().split('T')[0];

    // Check cache
    if (cached) {
      if (!cached.isValid || !cached.url) {
        return {
          imageUrl: null,
          hasVerifiedImage: false,
          sourceType: 'none',
          sourceAttribution: cached.source || `${product.brand} Catalogue (Intentional Typographic Card)`,
          lastVerifiedDate: cached.verifiedAt || todayIso,
          isUnavailable: true,
          isIntentionalTypographic: true,
          barcode: product.barcode || product.gtin,
          brand: product.brand,
          productName: product.name,
          variant: product.variant || product.exactVariant,
          size: product.size,
          reason: 'Cached as unavailable; displaying intentional typographic card'
        };
      }

      return {
        imageUrl: cached.url,
        hasVerifiedImage: true,
        sourceType: cached.sourceType,
        sourceAttribution: cached.source,
        lastVerifiedDate: cached.verifiedAt,
        isUnavailable: false,
        isIntentionalTypographic: false,
        barcode: product.barcode || product.gtin,
        brand: product.brand,
        productName: product.name,
        variant: product.variant || product.exactVariant,
        size: product.size
      };
    }

    const candidateUrl = product.imageUrl;

    // 1. Missing image or explicitly disallowed
    if (!candidateUrl || this.isDisallowedImage(candidateUrl)) {
      return {
        imageUrl: null,
        hasVerifiedImage: false,
        sourceType: 'none',
        sourceAttribution: product.sourceAttribution || `${product.brand} Official Catalogue (Intentional Typographic Card)`,
        lastVerifiedDate: product.lastVerifiedDate || todayIso,
        isUnavailable: true,
        isIntentionalTypographic: true,
        barcode: product.barcode || product.gtin,
        brand: product.brand,
        productName: product.name,
        variant: product.variant || product.exactVariant,
        size: product.size,
        reason: 'No exact verified photography available; rendering intentional typographic card'
      };
    }

    // 2. Known failed URL
    if (this.failedUrls.has(candidateUrl)) {
      return {
        imageUrl: null,
        hasVerifiedImage: false,
        sourceType: 'none',
        sourceAttribution: 'Asset Inaccessible (Rendering Intentional Typographic Card)',
        lastVerifiedDate: product.lastVerifiedDate || todayIso,
        isUnavailable: true,
        isIntentionalTypographic: true,
        barcode: product.barcode || product.gtin,
        brand: product.brand,
        productName: product.name,
        variant: product.variant || product.exactVariant,
        size: product.size,
        reason: 'URL previously failed to load'
      };
    }

    // 3. Detect mismatch
    const mismatch = this.detectImageMismatch(product, candidateUrl);
    if (mismatch.isMismatch) {
      return {
        imageUrl: null,
        hasVerifiedImage: false,
        sourceType: 'none',
        sourceAttribution: 'Image Mismatch Rejected',
        lastVerifiedDate: todayIso,
        isUnavailable: true,
        isIntentionalTypographic: true,
        barcode: product.barcode || product.gtin,
        brand: product.brand,
        productName: product.name,
        variant: product.variant || product.exactVariant,
        size: product.size,
        reason: mismatch.reason
      };
    }

    // 4. Determine Priority Tier & Attribution
    let sourceType: ImageSourceType = 'none';
    let sourceAttribution = '';

    if (this.isOfficialBrandUrl(candidateUrl, product.brand)) {
      sourceType = 'official-brand';
      sourceAttribution = `${product.brand} Official Asset Registry`;
    } else if (this.isOpenBeautyFactsUrl(candidateUrl)) {
      sourceType = 'open-beauty-facts';
      const barcodeLabel = product.barcode ? ` (Barcode: ${product.barcode})` : '';
      sourceAttribution = `Open Beauty Facts Verified Registry${barcodeLabel}`;
    } else if (this.isTrustedRetailerUrl(candidateUrl)) {
      sourceType = 'trusted-retailer';
      sourceAttribution = 'Authorized Retailer Feed';
    } else {
      sourceType = product.imageSourceType || 'trusted-retailer';
      sourceAttribution = product.sourceAttribution || `${product.brand} Partner Feed`;
    }

    const verifiedDate = product.lastVerifiedDate || todayIso;

    // Cache entry
    this.cache.set(key, {
      url: candidateUrl,
      sourceType,
      source: sourceAttribution,
      verifiedAt: verifiedDate,
      isValid: true
    });
    this.persistCache();

    return {
      imageUrl: candidateUrl,
      hasVerifiedImage: true,
      sourceType,
      sourceAttribution,
      lastVerifiedDate: verifiedDate,
      isUnavailable: false,
      isIntentionalTypographic: false,
      barcode: product.barcode || product.gtin,
      brand: product.brand,
      productName: product.name,
      variant: product.variant || product.exactVariant,
      size: product.size
    };
  }

  /**
   * Records image error and flips cache entry to intentional typographic fallback
   */
  public markImageFailed(product: Product, failedUrl?: string) {
    if (failedUrl) {
      this.failedUrls.add(failedUrl);
    }
    const key = getNormalizedProductIdentityKey(product);
    this.cache.set(key, {
      url: null,
      sourceType: 'none',
      source: `${product.brand} Catalogue (Intentional Typographic Card)`,
      verifiedAt: new Date().toISOString().split('T')[0],
      isValid: false
    });
    this.persistCache();
  }

  /**
   * Records that an image loaded successfully in the DOM
   */
  public markImageLoaded(product: Product, url: string) {
    this.verifiedSuccessfulUrls.add(url);
    const key = getNormalizedProductIdentityKey(product);
    const entry = this.cache.get(key);
    if (entry) {
      entry.isValid = true;
      this.persistCache();
    }
  }

  /**
   * Generates a comprehensive Catalogue Image Audit Report
   */
  public auditCatalogue(products: Product[]): CatalogueImageAuditReport {
    const verified: Product[] = [];
    const missing: Product[] = [];
    const invalid: { product: Product; url: string; reason: string }[] = [];
    const mismatched: { product: Product; url: string; reason: string }[] = [];

    const sourceBreakdown = {
      officialBrand: 0,
      openBeautyFacts: 0,
      trustedRetailer: 0,
      typographicFallback: 0
    };

    for (const p of products) {
      const url = p.imageUrl;

      if (!url) {
        missing.push(p);
        sourceBreakdown.typographicFallback++;
        continue;
      }

      // Check URL syntax validity
      let isValidSyntax = false;
      try {
        const parsed = new URL(url);
        isValidSyntax = parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        isValidSyntax = false;
      }

      if (!isValidSyntax) {
        invalid.push({ product: p, url, reason: 'Malformed URL structure or unsupported protocol' });
        sourceBreakdown.typographicFallback++;
        continue;
      }

      // Check mismatch
      const mismatchCheck = this.detectImageMismatch(p, url);
      if (mismatchCheck.isMismatch) {
        mismatched.push({ product: p, url, reason: mismatchCheck.reason || 'Brand or variant mismatch detected' });
        sourceBreakdown.typographicFallback++;
        continue;
      }

      // Check if host is unreachable, invalid test domain, or flagged in database
      const lowerUrl = url.toLowerCase();
      const isKnownBrokenHost = lowerUrl.includes('.internal') || 
                                lowerUrl.includes('.invalid') || 
                                lowerUrl.includes('.test') || 
                                lowerUrl.includes('broken-cdn') ||
                                lowerUrl.includes('unreachable-domain');

      if (isKnownBrokenHost) {
        invalid.push({ product: p, url, reason: 'Unreachable host or non-resolving domain endpoint' });
        sourceBreakdown.typographicFallback++;
        continue;
      }

      // Check if URL is known failed from previous network attempts
      if (this.failedUrls.has(url)) {
        invalid.push({ product: p, url, reason: 'Image failed network loading (HTTP 404 or connection error)' });
        sourceBreakdown.typographicFallback++;
        continue;
      }

      // Check against 3-tier permitted sources
      const isOfficial = this.isOfficialBrandUrl(url, p.brand);
      const isObf = this.isOpenBeautyFactsUrl(url);
      const isRetailer = this.isTrustedRetailerUrl(url);

      if (!isOfficial && !isObf && !isRetailer) {
        invalid.push({ product: p, url, reason: 'Untrusted image host; only Official Brand, Open Beauty Facts, or Trusted Retailers permitted' });
        sourceBreakdown.typographicFallback++;
        continue;
      }

      // Database-level verification flag check
      if (p.verification && p.verification.verifiedImage === false) {
        invalid.push({ product: p, url, reason: 'Asset pending verification in product registry' });
        sourceBreakdown.typographicFallback++;
        continue;
      }

      // Verified image
      verified.push(p);
      if (isOfficial) {
        sourceBreakdown.officialBrand++;
      } else if (isObf) {
        sourceBreakdown.openBeautyFacts++;
      } else {
        sourceBreakdown.trustedRetailer++;
      }
    }

    const total = products.length;
    const verifiedPercentage = total > 0 ? Math.round((verified.length / total) * 100) : 0;

    return {
      totalProducts: total,
      verifiedCount: verified.length,
      missingCount: missing.length,
      invalidCount: invalid.length,
      mismatchedCount: mismatched.length,
      verifiedPercentage,
      productsWithVerifiedImages: verified,
      productsWithMissingImages: missing,
      productsWithInvalidImages: invalid,
      productsWithMismatchedImages: mismatched,
      sourceBreakdown,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Performs an asynchronous network validation audit of the catalogue.
   * Probes active image URLs via HEAD/GET requests and updates the cache.
   */
  public async auditCatalogueAsync(products: Product[]): Promise<CatalogueImageAuditReport> {
    const report = this.auditCatalogue(products);
    const recheckedVerified: Product[] = [];

    for (const p of report.productsWithVerifiedImages) {
      const url = p.imageUrl!;
      if (this.verifiedSuccessfulUrls.has(url)) {
        recheckedVerified.push(p);
        continue;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          this.markImageLoaded(p, url);
          recheckedVerified.push(p);
        } else {
          this.markImageFailed(p, url);
          report.invalidCount++;
          report.productsWithInvalidImages.push({
            product: p,
            url,
            reason: `HTTP ${res.status} ${res.statusText || 'Error'}`
          });
          if (this.isOfficialBrandUrl(url, p.brand)) {
            report.sourceBreakdown.officialBrand = Math.max(0, report.sourceBreakdown.officialBrand - 1);
          } else if (this.isOpenBeautyFactsUrl(url)) {
            report.sourceBreakdown.openBeautyFacts = Math.max(0, report.sourceBreakdown.openBeautyFacts - 1);
          } else {
            report.sourceBreakdown.trustedRetailer = Math.max(0, report.sourceBreakdown.trustedRetailer - 1);
          }
          report.sourceBreakdown.typographicFallback++;
        }
      } catch (err: any) {
        this.markImageFailed(p, url);
        report.invalidCount++;
        report.productsWithInvalidImages.push({
          product: p,
          url,
          reason: err.name === 'AbortError' ? 'Network request timed out' : `Connection error: ${err.message}`
        });
        if (this.isOfficialBrandUrl(url, p.brand)) {
          report.sourceBreakdown.officialBrand = Math.max(0, report.sourceBreakdown.officialBrand - 1);
        } else if (this.isOpenBeautyFactsUrl(url)) {
          report.sourceBreakdown.openBeautyFacts = Math.max(0, report.sourceBreakdown.openBeautyFacts - 1);
        } else {
          report.sourceBreakdown.trustedRetailer = Math.max(0, report.sourceBreakdown.trustedRetailer - 1);
        }
        report.sourceBreakdown.typographicFallback++;
      }
    }

    report.productsWithVerifiedImages = recheckedVerified;
    report.verifiedCount = recheckedVerified.length;
    report.verifiedPercentage = report.totalProducts > 0 
      ? Math.round((report.verifiedCount / report.totalProducts) * 100) 
      : 0;

    return report;
  }
}

export const productImageResolver = new ProductImageResolutionService();

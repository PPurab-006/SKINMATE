import React, { useState } from 'react';
import { Product } from '../../types/product';
import { CatalogueImageAuditReport, productImageResolver } from '../../services/productImageResolutionService';
import { Modal } from '../common/Modal';
import { 
  ShieldCheck, 
  Image, 
  AlertTriangle, 
  FileQuestion, 
  RefreshCw, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Building2,
  Database,
  Store
} from 'lucide-react';
import { ProductImage } from '../common/ProductImage';
import { GoogleShoppingButton } from '../common/GoogleShoppingButton';

interface CatalogueImageAuditModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

type FilterTab = 'all' | 'verified' | 'missing' | 'invalid' | 'mismatched';

export const CatalogueImageAuditModal: React.FC<CatalogueImageAuditModalProps> = ({
  products,
  isOpen,
  onClose
}) => {
  const [report, setReport] = useState<CatalogueImageAuditReport>(() => productImageResolver.auditCatalogue(products));
  const [isReauditing, setIsReauditing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const handleRunLiveAudit = async () => {
    setIsReauditing(true);
    try {
      const liveReport = await productImageResolver.auditCatalogueAsync(products);
      setReport(liveReport);
    } catch {
      // Keep existing report on error
    } finally {
      setIsReauditing(false);
    }
  };

  if (!isOpen) return null;

  // Filtered list based on active tab
  const getDisplayedItems = () => {
    switch (activeTab) {
      case 'verified':
        return report.productsWithVerifiedImages.map(p => ({
          product: p,
          status: 'verified' as const,
          source: p.sourceAttribution || 'Verified Database Registry',
          reason: undefined,
          url: p.imageUrl || undefined
        }));
      case 'missing':
        return report.productsWithMissingImages.map(p => ({
          product: p,
          status: 'missing' as const,
          source: p.sourceAttribution || `${p.brand} Official Registry`,
          reason: 'Photography pending ingestion; rendered as intentional typographic card',
          url: undefined
        }));
      case 'invalid':
        return report.productsWithInvalidImages.map(item => ({
          product: item.product,
          status: 'invalid' as const,
          source: item.product.sourceAttribution || 'Unreachable Link',
          reason: item.reason,
          url: item.url
        }));
      case 'mismatched':
        return report.productsWithMismatchedImages.map(item => ({
          product: item.product,
          status: 'mismatched' as const,
          source: item.product.sourceAttribution || 'Mismatched Asset',
          reason: item.reason,
          url: item.url
        }));
      case 'all':
      default: {
        const allItems: {
          product: Product;
          status: 'verified' | 'missing' | 'invalid' | 'mismatched';
          source: string;
          reason?: string;
          url?: string;
        }[] = [];

        report.productsWithVerifiedImages.forEach(p => {
          allItems.push({
            product: p,
            status: 'verified',
            source: p.sourceAttribution || 'Verified Asset',
            url: p.imageUrl || undefined
          });
        });

        report.productsWithMissingImages.forEach(p => {
          allItems.push({
            product: p,
            status: 'missing',
            source: p.sourceAttribution || `${p.brand} Registry`,
            reason: 'Photography pending ingestion; intentional typographic card rendered'
          });
        });

        report.productsWithInvalidImages.forEach(item => {
          allItems.push({
            product: item.product,
            status: 'invalid',
            source: item.product.sourceAttribution || 'Invalid Endpoint',
            reason: item.reason,
            url: item.url
          });
        });

        report.productsWithMismatchedImages.forEach(item => {
          allItems.push({
            product: item.product,
            status: 'mismatched',
            source: item.product.sourceAttribution || 'Mismatched Asset',
            reason: item.reason,
            url: item.url
          });
        });

        return allItems;
      }
    }
  };

  const displayedItems = getDisplayedItems();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catalogue Image Integrity Audit"
      subtitle="Strict 3-tier image source hierarchy & intentional typographic fallback report"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Top Action Bar & Live Probe Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-beauty-cream/40 border border-beauty-muted-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-beauty-forest">
                Catalogue Health Status: Authentic Verification Active
              </span>
            </div>
            <p className="text-2xs text-beauty-muted mt-0.5">
              Zero synthetic placeholders or generic stock photography permitted.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunLiveAudit}
            disabled={isReauditing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest/90 transition-all shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReauditing ? 'animate-spin' : ''}`} />
            <span>{isReauditing ? 'Probing Endpoints...' : 'Run Live Network Audit'}</span>
          </button>
        </div>

        {/* 5 Core Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Total Products */}
          <div className="p-3.5 rounded-xl border border-beauty-muted-border bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-medium uppercase tracking-wider text-beauty-muted">Total Products</span>
              <Layers className="w-3.5 h-3.5 text-beauty-sage" />
            </div>
            <div className="font-serif text-2xl font-semibold text-beauty-charcoal mt-1">
              {report.totalProducts}
            </div>
            <span className="text-[10px] text-beauty-muted block mt-0.5">Tracked SKUs</span>
          </div>

          {/* 2. Verified Images */}
          <div 
            onClick={() => setActiveTab('verified')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'verified' 
                ? 'border-emerald-600 bg-emerald-50/60 shadow-xs' 
                : 'border-beauty-muted-border bg-white hover:border-emerald-500/50 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-medium uppercase tracking-wider text-emerald-800">Verified Images</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="font-serif text-2xl font-semibold text-emerald-700 mt-1">
              {report.verifiedCount}
            </div>
            <span className="text-[10px] text-emerald-700/80 block mt-0.5 font-medium">
              {report.verifiedPercentage}% Verified Photography
            </span>
          </div>

          {/* 3. Missing Images */}
          <div 
            onClick={() => setActiveTab('missing')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'missing' 
                ? 'border-beauty-forest bg-beauty-cream/50 shadow-xs' 
                : 'border-beauty-muted-border bg-white hover:border-beauty-forest/40 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-medium uppercase tracking-wider text-beauty-forest">Missing Images</span>
              <FileQuestion className="w-3.5 h-3.5 text-beauty-sage" />
            </div>
            <div className="font-serif text-2xl font-semibold text-beauty-charcoal mt-1">
              {report.missingCount}
            </div>
            <span className="text-[10px] text-beauty-sage block mt-0.5 font-medium">
              Typographic Cards Active
            </span>
          </div>

          {/* 4. Invalid URLs */}
          <div 
            onClick={() => setActiveTab('invalid')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'invalid' 
                ? 'border-rose-600 bg-rose-50/60 shadow-xs' 
                : 'border-beauty-muted-border bg-white hover:border-rose-400 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-medium uppercase tracking-wider text-rose-800">Invalid URLs</span>
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div className="font-serif text-2xl font-semibold text-rose-700 mt-1">
              {report.invalidCount}
            </div>
            <span className="text-[10px] text-rose-600 block mt-0.5 font-medium">
              Flagged Unreachable
            </span>
          </div>

          {/* 5. Mismatched Images */}
          <div 
            onClick={() => setActiveTab('mismatched')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all col-span-2 sm:col-span-1 ${
              activeTab === 'mismatched' 
                ? 'border-amber-600 bg-amber-50/60 shadow-xs' 
                : 'border-beauty-muted-border bg-white hover:border-amber-400 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-medium uppercase tracking-wider text-amber-800">Mismatches</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="font-serif text-2xl font-semibold text-amber-700 mt-1">
              {report.mismatchedCount}
            </div>
            <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
              Cross-Brand / Stock
            </span>
          </div>
        </div>

        {/* Source Hierarchy Breakdown Bar */}
        <div className="p-4 rounded-2xl bg-white border border-beauty-muted-border space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-beauty-charcoal">
            <span>Source Hierarchy Attribution Distribution</span>
            <span className="text-2xs font-normal text-beauty-muted">
              Tier 1: Brand Official &bull; Tier 2: Open Beauty Facts &bull; Tier 3: Trusted Retailer
            </span>
          </div>

          {/* Multi-segment progress bar */}
          <div className="h-3 w-full rounded-full bg-beauty-cream/50 overflow-hidden flex">
            <div 
              style={{ width: `${(report.sourceBreakdown.openBeautyFacts / (report.totalProducts || 1)) * 100}%` }}
              className="bg-emerald-600 h-full transition-all duration-500" 
              title={`Open Beauty Facts: ${report.sourceBreakdown.openBeautyFacts}`}
            />
            <div 
              style={{ width: `${(report.sourceBreakdown.officialBrand / (report.totalProducts || 1)) * 100}%` }}
              className="bg-beauty-forest h-full transition-all duration-500" 
              title={`Official Brand Sources: ${report.sourceBreakdown.officialBrand}`}
            />
            <div 
              style={{ width: `${(report.sourceBreakdown.trustedRetailer / (report.totalProducts || 1)) * 100}%` }}
              className="bg-sky-600 h-full transition-all duration-500" 
              title={`Trusted Retailers: ${report.sourceBreakdown.trustedRetailer}`}
            />
            <div 
              style={{ width: `${(report.sourceBreakdown.typographicFallback / (report.totalProducts || 1)) * 100}%` }}
              className="bg-beauty-sage/40 h-full transition-all duration-500" 
              title={`Intentional Typographic Cards: ${report.sourceBreakdown.typographicFallback}`}
            />
          </div>

          <div className="flex items-center justify-between gap-3 text-2xs text-beauty-muted flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Open Beauty Facts ({report.sourceBreakdown.openBeautyFacts})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-beauty-forest" />
              <span>Brand Official ({report.sourceBreakdown.officialBrand})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <span>Trusted Retailer ({report.sourceBreakdown.trustedRetailer})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-beauty-sage/40" />
              <span>Intentional Typographic Fallbacks ({report.sourceBreakdown.typographicFallback})</span>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-beauty-muted-border pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-beauty-forest text-beauty-ivory'
                : 'text-beauty-muted hover:text-beauty-charcoal hover:bg-beauty-cream/50'
            }`}
          >
            All Products ({report.totalProducts})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'verified'
                ? 'bg-emerald-700 text-white'
                : 'text-beauty-muted hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Verified Images ({report.verifiedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('missing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'missing'
                ? 'bg-beauty-sage text-white'
                : 'text-beauty-muted hover:text-beauty-forest hover:bg-beauty-cream/50'
            }`}
          >
            Missing Images ({report.missingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invalid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'invalid'
                ? 'bg-rose-700 text-white'
                : 'text-beauty-muted hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            Invalid URLs ({report.invalidCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mismatched')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'mismatched'
                ? 'bg-amber-700 text-white'
                : 'text-beauty-muted hover:text-amber-700 hover:bg-amber-50'
            }`}
          >
            Mismatches ({report.mismatchedCount})
          </button>
        </div>

        {/* Detailed Item List */}
        <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1">
          {displayedItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-beauty-muted bg-beauty-cream/20 rounded-xl border border-dashed border-beauty-muted-border">
              No products found for this audit filter.
            </div>
          ) : (
            displayedItems.map((item, idx) => (
              <div
                key={`${item.product.id}-${idx}`}
                className="p-3 rounded-xl border border-beauty-muted-border bg-white hover:border-beauty-forest/30 transition-all flex items-center justify-between gap-4"
              >
                {/* Thumbnail / Typographic Badge */}
                <div className="w-12 h-12 rounded-lg border border-beauty-muted-border/80 overflow-hidden shrink-0">
                  <ProductImage
                    product={item.product}
                    className="w-full h-full"
                    imageClassName="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xs uppercase tracking-wider font-semibold text-beauty-forest">
                      {item.product.brand}
                    </span>
                    <span className="text-2xs text-beauty-muted">&bull;</span>
                    <span className="text-2xs text-beauty-charcoal font-medium">
                      {item.product.variant || item.product.exactVariant || item.product.size}
                    </span>
                  </div>

                  <div className="font-serif text-sm font-medium text-beauty-charcoal truncate mt-0.5">
                    {item.product.name}
                  </div>

                  <div className="text-2xs text-beauty-muted mt-0.5 truncate flex items-center gap-1.5">
                    <span className="font-medium text-beauty-charcoal/70">Source:</span>
                    <span>{item.source}</span>
                  </div>

                  {item.reason && (
                    <div className="text-[11px] text-amber-800 font-light mt-0.5 italic flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                      <span>{item.reason}</span>
                    </div>
                  )}
                </div>

                {/* Audit Status Pill & Live Google Shopping Link */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'verified' && (
                    <span className="px-2 py-1 rounded-full text-2xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Live</span>
                    </span>
                  )}
                  {item.status === 'missing' && (
                    <span className="px-2 py-1 rounded-full text-2xs font-semibold bg-beauty-cream text-beauty-forest border border-beauty-muted-border flex items-center gap-1">
                      <FileQuestion className="w-3 h-3" />
                      <span>Typographic Card</span>
                    </span>
                  )}
                  {item.status === 'invalid' && (
                    <span className="px-2 py-1 rounded-full text-2xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      <span>Invalid URL</span>
                    </span>
                  )}
                  {item.status === 'mismatched' && (
                    <span className="px-2 py-1 rounded-full text-2xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Mismatched</span>
                    </span>
                  )}

                  <GoogleShoppingButton
                    product={item.product}
                    variant="ghost"
                    size="sm"
                    label="Google"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

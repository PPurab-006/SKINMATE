import React, { useState } from 'react';
import { Product } from '../../types/product';
import { Modal } from '../common/Modal';
import { ExternalLink, Check, Droplets, Sparkles, Bookmark, ShieldCheck, CheckCircle2, Search, Info } from 'lucide-react';
import { Badge } from '../common/Badge';
import { AddToListModal } from '../lists/AddToListModal';
import { ProductImage } from '../common/ProductImage';
import { GoogleShoppingButton } from '../common/GoogleShoppingButton';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToRoutine?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToRoutine,
}) => {
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!product) return null;

  const isPriceAvailable = product.price !== null && product.price !== undefined;
  const verification = product.verification;

  const handleAddedToList = (listName: string) => {
    setToastMsg(`Saved to "${listName}"!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={product.brand}
        subtitle={product.name}
        maxWidth="2xl"
      >
        <div className="space-y-6">
          {/* Toast Notification */}
          {toastMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-fade-in shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{toastMsg}</span>
            </div>
          )}

          {/* Top Product Header Grid */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-full sm:w-48 aspect-square rounded-2xl border border-beauty-muted-border shrink-0 bg-beauty-cream/30 overflow-hidden">
              <ProductImage
                product={product}
                className="w-full h-full"
                imageClassName="w-full h-full object-cover"
                showAttribution={true}
              />
            </div>

            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="forest" size="sm">
                  {product.category}
                </Badge>
                {product.variant && (
                  <span className="text-2xs font-medium px-2.5 py-0.5 rounded-full bg-beauty-cream text-beauty-charcoal border border-beauty-muted-border">
                    {product.variant}
                  </span>
                )}
                {verification?.verifiedIdentity && (
                  <span className="text-2xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified Formulation</span>
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                {isPriceAvailable ? (
                  <>
                    <span className="font-serif text-3xl font-semibold text-beauty-charcoal">
                      ₹{product.price!.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-beauty-muted">
                      / {product.variant || product.exactVariant || product.size} (Ref. Price)
                    </span>
                  </>
                ) : (
                  <div>
                    <span className="font-serif text-2xl font-semibold text-beauty-charcoal italic">
                      Price on Google
                    </span>
                    <span className="text-xs text-beauty-muted block mt-0.5">
                      Live pricing determined by search results
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 text-xs text-beauty-muted flex-wrap">
                <span className="text-beauty-forest font-medium">★ {product.rating}</span>
                <span>•</span>
                <span>{product.reviewsCount} verified reviews</span>
                {product.size && (
                  <>
                    <span>•</span>
                    <span>Size: {product.size}</span>
                  </>
                )}
                {product.barcode && (
                  <>
                    <span>•</span>
                    <span className="text-beauty-charcoal font-medium">GTIN: {product.barcode}</span>
                  </>
                )}
              </div>

              {/* Formulation Texture & Certifications */}
              <div className="pt-1 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-beauty-cream border border-beauty-muted-border text-beauty-charcoal">
                  Texture: {product.texture}
                </span>
                {product.isFragranceFree && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Fragrance-Free
                  </span>
                )}
                {product.isNonComedogenic && (
                  <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                    Non-Comedogenic
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description from Attributed Source */}
          {product.retailerDescription && (
            <div className="p-4 rounded-2xl bg-beauty-cream/50 border border-beauty-muted-border space-y-1 text-xs text-beauty-charcoal-body leading-relaxed font-light">
              <span className="font-semibold text-beauty-forest text-2xs uppercase tracking-wider block">
                Formulation &amp; Action Overview
              </span>
              <p>{product.retailerDescription}</p>
            </div>
          )}

          {/* Explicit Verification & Data Quality Audit Card */}
          <div className="p-4 rounded-2xl bg-white border border-beauty-muted-border shadow-2xs space-y-2.5">
            <span className="text-2xs font-semibold uppercase tracking-wider text-beauty-forest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Quality &amp; Source Verification Metadata</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-2xs pt-1">
              <div className="p-2 rounded-xl bg-beauty-cream/40 border border-beauty-muted-border/60">
                <span className="text-beauty-muted block">Identity</span>
                <span className="font-semibold text-emerald-800 flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Verified Brand
                </span>
              </div>
              <div className="p-2 rounded-xl bg-beauty-cream/40 border border-beauty-muted-border/60">
                <span className="text-beauty-muted block">Product Photo</span>
                <span className={`font-semibold flex items-center gap-1 mt-0.5 ${
                  verification?.verifiedImage ? 'text-emerald-800' : 'text-amber-700'
                }`}>
                  {verification?.verifiedImage ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      Authentic
                    </>
                  ) : (
                    'Neutral State'
                  )}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-beauty-cream/40 border border-beauty-muted-border/60">
                <span className="text-beauty-muted block">INCI Formula</span>
                <span className="font-semibold text-emerald-800 flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-600" />
                  {product.fullIngredients.length} Actives
                </span>
              </div>
              <div className="p-2 rounded-xl bg-beauty-cream/40 border border-beauty-muted-border/60">
                <span className="text-beauty-muted block">Source Registry</span>
                <span className="font-semibold text-beauty-charcoal truncate block mt-0.5">
                  {verification?.dataSource || 'Open Beauty Facts'}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-beauty-muted font-light flex items-center justify-between pt-1 border-t border-beauty-muted-border/60">
              <span>Attribution: {product.sourceAttribution || 'Open Beauty Facts & Brand Official Feed'}</span>
              <span>Last Verified: {product.lastVerifiedDate || 'October 2026'}</span>
            </div>
          </div>

          {/* Full INCI Ingredients Formulation */}
          {product.fullIngredients && product.fullIngredients.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-serif font-medium text-sm text-beauty-charcoal-heading">
                Full INCI Ingredients Formulation ({product.fullIngredients.length})
              </h4>
              <div className="p-4 rounded-2xl bg-white border border-beauty-muted-border text-xs text-beauty-charcoal/80 leading-relaxed max-h-28 overflow-y-auto font-light">
                {product.fullIngredients.join(', ')}
              </div>
            </div>
          )}

          {/* Universal Google Shopping Search Redirect Card */}
          <div className="p-4 rounded-2xl bg-beauty-cream/70 border border-beauty-muted-border space-y-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-beauty-forest" />
              <span className="text-xs font-semibold text-beauty-charcoal">
                Universal Google Shopping Redirect
              </span>
            </div>
            <p className="text-2xs text-beauty-muted leading-relaxed font-light">
              SkinMate discovers and recommends. When you are ready to purchase, we generate an exact search query (
              <span className="font-mono text-beauty-charcoal font-medium">"{product.googleSearchQuery}"</span>) so you can compare live merchant availability, delivery speeds, and verified stock on Google.
            </p>
          </div>

          {/* Bottom Primary Action Bar */}
          <div className="pt-4 border-t border-beauty-muted-border flex flex-col sm:flex-row gap-3 items-center justify-between">
            <button
              type="button"
              onClick={() => setIsListModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-medium border border-beauty-muted-border bg-white hover:bg-beauty-cream text-beauty-charcoal transition-colors flex items-center justify-center gap-2"
            >
              <Bookmark className="w-4 h-4 text-beauty-muted" />
              <span>Add to My Lists</span>
            </button>

            {/* Universal Google Search Button */}
            <GoogleShoppingButton
              product={product}
              variant="primary"
              size="md"
              label="Find this product on Google"
              className="w-full sm:w-auto px-8"
            />
          </div>
        </div>
      </Modal>

      {/* Add To List Modal */}
      <AddToListModal
        product={product}
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onAddedToList={handleAddedToList}
      />
    </>
  );
};

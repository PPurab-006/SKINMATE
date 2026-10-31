import React, { useState } from 'react';
import { Product } from '../../types/product';
import { ShieldCheck, Scale, Sparkles, Bookmark, Plus } from 'lucide-react';
import { GoogleShoppingButton } from '../common/GoogleShoppingButton';
import { AddToListModal } from '../lists/AddToListModal';

interface TypographicProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  isComparing?: boolean;
  onAddToList?: (product: Product) => void;
}

/**
 * TypographicProductCard
 * 
 * An intentional editorial typographic product card designed for products
 * without verified live photography. Never looks broken; prominently displays
 * brand, exact product name, variant, size, category, verified price,
 * recommendation reason, Google shopping redirect, and Add to List action.
 */
export const TypographicProductCard: React.FC<TypographicProductCardProps> = ({
  product,
  onSelect,
  onToggleCompare,
  isComparing = false,
  onAddToList
}) => {
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const isPriceAvailable = product.price !== null && product.price !== undefined;
  const brandInitial = (product.brand?.trim()?.[0] || 'S').toUpperCase();

  const handleAddToListClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToList) {
      onAddToList(product);
    } else {
      setIsAddToListOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={() => onSelect(product)}
        className="group cursor-pointer rounded-2xl border border-beauty-muted-border bg-[#FCFAF6] p-5 hover:border-beauty-forest/40 transition-all duration-300 flex flex-col justify-between shadow-beauty-sm hover:shadow-beauty-md relative overflow-hidden"
      >
        {/* Subtle Background Watermark Monogram */}
        <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full border border-beauty-forest/5 bg-beauty-cream/20 flex items-center justify-center pointer-events-none select-none transition-transform duration-500 group-hover:scale-105">
          <span className="font-serif italic text-6xl text-beauty-forest/[0.07] font-semibold">
            {brandInitial}
          </span>
        </div>

        <div>
          {/* Header Row: Category Badge & Formulation Stamp / Compare */}
          <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
            <span className="px-2.5 py-1 rounded-full text-2xs uppercase tracking-wider font-medium bg-white text-beauty-forest border border-beauty-muted-border shadow-2xs">
              {product.category}
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase tracking-widest font-serif font-semibold text-beauty-sage/90 px-2 py-0.5 rounded bg-beauty-cream/50 border border-beauty-muted-border/60">
                Atelier Entry
              </span>

              {onToggleCompare && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCompare(product);
                  }}
                  title="Add to formulation comparison"
                  className={`p-1.5 rounded-lg border transition-all ${
                    isComparing
                      ? 'bg-beauty-forest text-beauty-ivory border-beauty-forest shadow-sm'
                      : 'bg-white/85 text-beauty-charcoal/70 border-beauty-muted-border hover:bg-white hover:text-beauty-forest'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Brand & Verification Stamp */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <span className="text-xs uppercase tracking-[0.22em] font-serif font-bold text-beauty-forest">
              {product.brand}
            </span>

            {product.verification?.verifiedIdentity && (
              <span
                className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 shrink-0"
                title={product.sourceAttribution || 'Verified cosmetics formulation in official database'}
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Spec</span>
              </span>
            )}
          </div>

          {/* Exact Product Name */}
          <h3 className="font-serif text-base sm:text-lg font-medium text-beauty-charcoal leading-snug line-clamp-2 mt-1.5 group-hover:text-beauty-forest transition-colors">
            {product.name}
          </h3>

          {/* Variant and Size Highlights */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {(product.variant || product.exactVariant) && (
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-beauty-muted-border/80 text-beauty-charcoal shadow-2xs">
                {product.variant || product.exactVariant}
              </span>
            )}
            {product.size && (
              <span className="px-2 py-1 rounded-md text-xs font-semibold bg-beauty-cream/80 border border-beauty-muted-border/70 text-beauty-forest">
                {product.size}
              </span>
            )}
          </div>

          {/* Key Actives */}
          {product.keyActives && product.keyActives.length > 0 && (
            <div className="text-2xs text-beauty-muted mt-2 line-clamp-1 font-light">
              <span className="font-medium text-beauty-charcoal/70">Actives: </span>
              <span>{product.keyActives.join(' • ')}</span>
            </div>
          )}

          {/* Recommendation Explanation Block */}
          <div className="mt-3 p-3 rounded-xl bg-beauty-cream/40 border border-beauty-muted-border/60 text-xs text-beauty-charcoal/90 leading-relaxed font-light">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-beauty-sage mb-1">
              <Sparkles className="w-3 h-3 text-beauty-forest" />
              <span>Why Recommended</span>
            </div>
            <p className="line-clamp-2 italic text-beauty-charcoal/80 font-serif text-[11px] leading-relaxed">
              "{product.reasonForRecommendation || product.retailerDescription || `Targeted personal care formulation addressing ${product.targetConcerns?.slice(0, 2).join(' & ')}.`}"
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2.5 text-xs">
            <span className="font-medium text-beauty-forest">
              ★ {product.rating}
            </span>
            <span className="text-beauty-muted text-[11px]">
              ({product.reviewsCount} reviews)
            </span>
          </div>
        </div>

        {/* Card Footer: Price & Primary Actions (Find on Google + Add to List) */}
        <div className="mt-4 pt-3.5 border-t border-beauty-muted-border/80 flex items-center justify-between gap-2 relative z-10">
          <div>
            {isPriceAvailable ? (
              <div>
                <span className="font-serif text-base font-semibold text-beauty-charcoal">
                  ₹{product.price!.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-beauty-muted block">Verified Ref.</span>
              </div>
            ) : (
              <span className="text-xs font-medium text-beauty-muted italic">
                Price on Google
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Add to List Button */}
            <button
              type="button"
              onClick={handleAddToListClick}
              title="Save to My Lists"
              className="p-2 rounded-xl border border-beauty-muted-border bg-white text-beauty-charcoal/80 hover:bg-beauty-cream/70 hover:text-beauty-forest transition-colors shadow-2xs flex items-center justify-center"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Universal Google Shopping Redirect Action */}
            <GoogleShoppingButton
              product={product}
              variant="secondary"
              size="sm"
              label="Find on Google"
            />
          </div>
        </div>
      </div>

      {/* Internal AddToListModal fallback when parent doesn't provide onAddToList */}
      {!onAddToList && (
        <AddToListModal
          product={product}
          isOpen={isAddToListOpen}
          onClose={() => setIsAddToListOpen(false)}
        />
      )}
    </>
  );
};

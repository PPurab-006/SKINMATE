import React, { useState } from 'react';
import { Product } from '../../types/product';
import { Scale, ShieldCheck, Bookmark } from 'lucide-react';
import { ProductImage } from '../common/ProductImage';
import { GoogleShoppingButton } from '../common/GoogleShoppingButton';
import { productImageResolver } from '../../services/productImageResolutionService';
import { TypographicProductCard } from './TypographicProductCard';
import { AddToListModal } from '../lists/AddToListModal';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  isComparing?: boolean;
  onAddToList?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onToggleCompare,
  isComparing = false,
  onAddToList
}) => {
  const resolved = productImageResolver.resolveImage(product);
  const [loadFailed, setLoadFailed] = useState<boolean>(resolved.isUnavailable || !resolved.imageUrl);
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);

  // If there is no verified image, URL was flagged/mismatched, or loading failed:
  // Render the intentional typographic product card
  if (resolved.isIntentionalTypographic || !resolved.hasVerifiedImage || !resolved.imageUrl || loadFailed) {
    return (
      <TypographicProductCard
        product={product}
        onSelect={onSelect}
        onToggleCompare={onToggleCompare}
        isComparing={isComparing}
        onAddToList={onAddToList}
      />
    );
  }

  const isPriceAvailable = product.price !== null && product.price !== undefined;

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
        className="group cursor-pointer rounded-2xl border border-beauty-muted-border bg-white p-4 hover:border-beauty-forest/40 transition-all duration-300 flex flex-col justify-between shadow-beauty-sm hover:shadow-beauty-md relative"
      >
        <div>
          {/* Product Image Container with Authentic Verification Badge */}
          <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-beauty-cream/30 border border-beauty-muted-border/60">
            <ProductImage
              product={product}
              className="w-full h-full"
              imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              showAttribution={true}
            />

            {/* Category Chip */}
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full text-2xs uppercase tracking-wider font-medium bg-white/95 backdrop-blur-md text-beauty-forest border border-beauty-muted-border shadow-2xs">
                {product.category}
              </span>
            </div>

            {/* Compare toggle button */}
            {onToggleCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(product);
                }}
                title="Add to formulation comparison"
                className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-xl backdrop-blur-md border transition-all ${
                  isComparing
                    ? 'bg-beauty-forest text-beauty-ivory border-beauty-forest shadow-sm'
                    : 'bg-white/85 text-beauty-charcoal/70 border-beauty-muted-border hover:bg-white hover:text-beauty-forest'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Brand & Verification Badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-2xs uppercase tracking-widest font-semibold text-beauty-sage">
              {product.brand}
            </span>
            {product.verification?.verifiedIdentity && (
              <span
                className="text-[10px] text-emerald-700 font-medium flex items-center gap-1"
                title={product.sourceAttribution || 'Verified cosmetics formulation'}
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Exact Product Name */}
          <h3 className="font-serif font-medium text-sm sm:text-base text-beauty-charcoal line-clamp-2 mt-1 group-hover:text-beauty-forest transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Variant / Size pill */}
          <div className="text-2xs text-beauty-muted mt-1.5 flex items-center gap-1.5 flex-wrap">
            {(product.variant || product.exactVariant) && (
              <span className="font-medium text-beauty-charcoal">
                {product.variant || product.exactVariant}
              </span>
            )}
            {product.variant && product.size && <span>•</span>}
            {product.size && <span>{product.size}</span>}
          </div>

          {/* Key Actives */}
          {product.keyActives && product.keyActives.length > 0 && (
            <div className="text-xs text-beauty-muted mt-1.5 line-clamp-1 font-light">
              {product.keyActives.join(' • ')}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="font-medium text-beauty-forest">
              ★ {product.rating}
            </span>
            <span className="text-beauty-muted text-[11px]">
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Card Footer: Price & Primary Actions (Find on Google + Add to List) */}
        <div className="mt-4 pt-3.5 border-t border-beauty-muted-border flex items-center justify-between gap-2">
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

      {/* Internal AddToListModal fallback */}
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

import React from 'react';
import { Product } from '../../types/product';
import { ExternalLink, Plus, Check, Scale } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  isComparing?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onToggleCompare,
  isComparing = false
}) => {
  return (
    <div
      onClick={() => onSelect(product)}
      className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-editorial-surface p-4 hover:border-editorial-lime/40 transition-all duration-300 flex flex-col justify-between shadow-card-dark relative"
    >
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3.5 bg-neutral-900 border border-white/[0.06]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Category Chip */}
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2 py-0.5 rounded-full text-2xs font-mono uppercase bg-black/75 backdrop-blur-md text-editorial-lime font-bold border border-white/10">
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
              title="Add to side-by-side comparison"
              className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md border transition-all ${
                isComparing
                  ? 'bg-editorial-lime text-black border-editorial-lime shadow-subtle-glow'
                  : 'bg-black/60 text-white/80 border-white/10 hover:text-white hover:bg-black/80'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Brand & Title */}
        <div className="text-2xs uppercase tracking-wider font-semibold text-editorial-text-muted">
          {product.brand}
        </div>
        <h4 className="font-semibold text-xs sm:text-sm text-white line-clamp-2 mt-0.5 group-hover:text-editorial-lime transition-colors">
          {product.name}
        </h4>

        {/* Key Actives Pill */}
        <div className="text-2xs text-editorial-text-secondary mt-1.5 line-clamp-1 font-mono">
          {product.keyActives.join(' • ')}
        </div>

        {/* Rating & Size */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xs font-mono text-editorial-lime font-bold">
            ★ {product.rating}
          </span>
          <span className="text-2xs text-editorial-text-muted">
            ({product.reviewsCount})
          </span>
          <span className="text-editorial-text-muted text-2xs">•</span>
          <span className="text-2xs text-editorial-text-secondary font-mono">
            {product.size}
          </span>
        </div>
      </div>

      {/* Card Footer: Price & Retailer Indicator */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <div>
          <span className="font-mono text-sm sm:text-base font-bold text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.currency && (
            <span className="text-[10px] font-mono text-editorial-text-muted pl-1">
              INR
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-2xs text-editorial-text-secondary group-hover:text-editorial-lime transition-colors">
          <span>Inspect</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Product } from '../../types/product';
import { productImageResolver } from '../../services/productImageResolutionService';
import { ShieldCheck } from 'lucide-react';

interface ProductImageProps {
  product: Product;
  className?: string;
  imageClassName?: string;
  showAttribution?: boolean;
  onClick?: () => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  className = 'w-full h-full',
  imageClassName = 'w-full h-full object-cover',
  showAttribution = false,
  onClick
}) => {
  const resolved = productImageResolver.resolveImage(product);
  const [loadFailed, setLoadFailed] = useState<boolean>(resolved.isUnavailable || !resolved.imageUrl);

  const handleImageError = () => {
    if (resolved.imageUrl) {
      productImageResolver.markImageFailed(product, resolved.imageUrl);
    }
    setLoadFailed(true);
  };

  const brandInitial = (product.brand?.trim()?.[0] || 'S').toUpperCase();

  // If image is missing, failed, or unverified: render intentional typographic formulation badge
  if (loadFailed || !resolved.imageUrl) {
    return (
      <div
        onClick={onClick}
        className={`${className} flex flex-col items-center justify-between p-2.5 sm:p-3 text-center bg-[#FCFAF6] border border-beauty-muted-border/80 rounded-xl relative select-none overflow-hidden group`}
        title={`${product.brand} ${product.name} (Intentional Typographic Entry)`}
      >
        {/* Subtle Watermark Seal */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-beauty-forest/20 bg-beauty-cream/50 flex items-center justify-center shadow-2xs my-auto">
          <span className="font-serif italic text-sm sm:text-base text-beauty-forest font-semibold">
            {brandInitial}
          </span>
        </div>

        <div className="w-full mt-1">
          <div className="text-[10px] font-serif font-bold text-beauty-forest uppercase tracking-widest line-clamp-1">
            {product.brand}
          </div>
          <div className="text-[9px] text-beauty-charcoal font-medium line-clamp-1 mt-0.5">
            {product.name}
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-1 mt-1">
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-white text-beauty-forest border border-beauty-muted-border/70 font-semibold tracking-wide">
            {product.size || product.variant || product.category}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} className={`relative overflow-hidden ${className}`}>
      <img
        src={resolved.imageUrl}
        alt={`${product.brand} ${product.name} ${product.variant || ''}`}
        onError={handleImageError}
        className={`${imageClassName} transition-transform duration-300`}
        loading="lazy"
      />

      {/* Optional Attribution Chip */}
      {showAttribution && resolved.hasVerifiedImage && (
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[8px] font-medium flex items-center gap-1 pointer-events-none">
          <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
          <span>{resolved.sourceAttribution.split('(')[0].trim()}</span>
        </div>
      )}
    </div>
  );
};

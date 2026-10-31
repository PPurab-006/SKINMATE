import React from 'react';
import { Product } from '../../types/product';
import { Modal } from '../common/Modal';
import { X, Check, Scale } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProductImage } from '../common/ProductImage';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
  onClearAll,
}) => {
  if (products.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Side-by-Side Formulation Comparison"
      subtitle="Examine botanical actives, certifications, and INR pricing side by side"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-beauty-muted-border">
          <span className="text-2xs font-semibold uppercase tracking-wider text-beauty-muted">
            {products.length} Formulations Selected
          </span>
          <button
            onClick={onClearAll}
            className="text-xs text-beauty-muted hover:text-rose-600 transition-colors"
          >
            Clear Selection
          </button>
        </div>

        {/* Side by side comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-5 rounded-2xl border border-beauty-muted-border bg-white space-y-4 relative flex flex-col justify-between shadow-beauty-sm"
            >
              <button
                onClick={() => onRemoveProduct(product.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-beauty-cream text-beauty-muted hover:text-beauty-charcoal transition-colors border border-beauty-muted-border"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-3.5">
                <div className="w-full aspect-square rounded-xl overflow-hidden border border-beauty-muted-border bg-beauty-cream/30">
                  <ProductImage
                    product={product}
                    className="w-full h-full"
                    imageClassName="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="text-2xs uppercase tracking-widest font-semibold text-beauty-sage">
                    {product.brand}
                  </span>
                  <h4 className="font-serif font-medium text-sm text-beauty-charcoal line-clamp-2 mt-0.5">
                    {product.name}
                  </h4>
                  <div className="font-serif text-base font-semibold text-beauty-charcoal mt-2">
                    {product.price !== null && product.price !== undefined
                      ? `₹${product.price.toLocaleString('en-IN')}`
                      : 'Price on Google'}
                    <span className="text-xs text-beauty-muted font-normal pl-1.5">
                      / {product.variant || product.size}
                    </span>
                  </div>
                </div>

                {/* Actives */}
                <div className="pt-3 border-t border-beauty-muted-border space-y-1">
                  <span className="text-2xs uppercase tracking-wider text-beauty-muted font-medium">
                    Key Actives
                  </span>
                  <p className="text-xs text-beauty-charcoal/80 leading-relaxed">
                    {product.keyActives.join(', ')}
                  </p>
                </div>

                {/* Texture & Suitability */}
                <div className="pt-3 border-t border-beauty-muted-border space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-beauty-muted">Texture</span>
                    <span className="text-beauty-charcoal font-medium">{product.texture}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-beauty-muted">Fragrance-Free</span>
                    <span className={product.isFragranceFree ? 'text-beauty-forest font-semibold' : 'text-beauty-muted'}>
                      {product.isFragranceFree ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-beauty-muted">Cruelty-Free</span>
                    <span className={product.isCrueltyFree ? 'text-beauty-forest font-semibold' : 'text-beauty-muted'}>
                      {product.isCrueltyFree ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

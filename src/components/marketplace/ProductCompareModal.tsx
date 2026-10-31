import React from 'react';
import { Product } from '../../types/product';
import { Modal } from '../common/Modal';
import { X, Check, Scale } from 'lucide-react';

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
      title="Side-by-Side Product Formulation Comparison"
      subtitle="Comparing biochemical actives, certifications, and INR value"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-2xs font-mono uppercase text-editorial-text-muted">
            {products.length} Products Under Analysis
          </span>
          <button
            onClick={onClearAll}
            className="text-2xs text-editorial-text-muted hover:text-rose-400 transition-colors"
          >
            Clear Selection
          </button>
        </div>

        {/* Side by side comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-2xl border border-white/10 bg-editorial-card space-y-4 relative flex flex-col justify-between"
            >
              <button
                onClick={() => onRemoveProduct(product.id)}
                className="absolute top-3 right-3 p-1 rounded-full bg-black/60 text-editorial-text-muted hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full aspect-square rounded-xl object-cover border border-white/10"
                />

                <div>
                  <span className="text-2xs font-mono uppercase text-editorial-lime font-bold">
                    {product.brand}
                  </span>
                  <h4 className="font-semibold text-xs text-white line-clamp-2 mt-0.5">
                    {product.name}
                  </h4>
                  <div className="text-sm font-bold font-mono text-white mt-2">
                    ₹{product.price.toLocaleString('en-IN')}
                    <span className="text-2xs text-editorial-text-muted font-normal pl-1">
                      / {product.size}
                    </span>
                  </div>
                </div>

                {/* Actives */}
                <div className="pt-2 border-t border-white/[0.06] space-y-1">
                  <span className="text-2xs font-mono uppercase text-editorial-text-muted">
                    Key Actives
                  </span>
                  <p className="text-2xs text-editorial-text-secondary leading-relaxed">
                    {product.keyActives.join(', ')}
                  </p>
                </div>

                {/* Texture & Suitability */}
                <div className="pt-2 border-t border-white/[0.06] space-y-1 text-2xs">
                  <div className="flex justify-between">
                    <span className="text-editorial-text-muted">Texture:</span>
                    <span className="text-white font-medium">{product.texture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-editorial-text-muted">Fragrance-Free:</span>
                    <span className={product.isFragranceFree ? 'text-emerald-400 font-bold' : 'text-editorial-text-muted'}>
                      {product.isFragranceFree ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-editorial-text-muted">Cruelty-Free:</span>
                    <span className={product.isCrueltyFree ? 'text-emerald-400 font-bold' : 'text-editorial-text-muted'}>
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

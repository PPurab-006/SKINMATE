import React from 'react';
import { Product } from '../../types/product';
import { RoutineSlot } from '../../types/routine';
import { RecommendationEngine } from '../../services/recommendationEngine';
import { Modal } from '../common/Modal';
import { ArrowLeftRight, Check, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';
import { ProductImage } from '../common/ProductImage';

interface ProductSubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: RoutineSlot | null;
  currentProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

export const ProductSubstitutionModal: React.FC<ProductSubstitutionModalProps> = ({
  isOpen,
  onClose,
  slot,
  currentProduct,
  onSelectProduct
}) => {
  if (!slot) return null;

  const substitutes = RecommendationEngine.getSubstitutesForSlot(slot, currentProduct);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Choose Formula for ${slot.slotName}`}
      subtitle="Compare key active ingredients, sizes, and price differences"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Current Product Selection (if any) */}
        {currentProduct && (
          <div className="p-4 rounded-2xl border border-beauty-muted-border bg-beauty-cream/60 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-beauty-muted-border bg-white shrink-0">
                <ProductImage
                  product={currentProduct}
                  className="w-full h-full"
                  imageClassName="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-medium">
                  Current Selection
                </span>
                <div className="font-serif text-sm font-medium text-beauty-charcoal">
                  {currentProduct.brand} — {currentProduct.name}
                </div>
                <div className="text-xs text-beauty-muted mt-0.5">
                  Actives: {currentProduct.keyActives.join(', ')} ({currentProduct.size})
                </div>
              </div>
            </div>
            <span className="font-serif text-base font-medium text-beauty-charcoal shrink-0">
              {currentProduct.price !== null && currentProduct.price !== undefined
                ? `₹${currentProduct.price.toLocaleString('en-IN')}`
                : 'Price on Google'}
            </span>
          </div>
        )}

        {/* Available Alternatives List */}
        <div className="space-y-3 max-h-[52vh] overflow-y-auto pr-1">
          <div className="text-2xs uppercase tracking-wider text-beauty-muted font-semibold">
            Compatible Alternatives ({substitutes.length})
          </div>

          {substitutes.length === 0 ? (
            <div className="p-8 text-center text-xs text-beauty-muted bg-beauty-cream/30 rounded-2xl">
              No additional alternatives found in this specific formulation category.
            </div>
          ) : (
            substitutes.map((sub) => {
              const hasPrices = currentProduct?.price !== null && currentProduct?.price !== undefined && sub.price !== null && sub.price !== undefined;
              const priceDiff = hasPrices ? (sub.price! - currentProduct!.price!) : null;

              return (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl border border-beauty-muted-border bg-white hover:border-beauty-forest transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-beauty-sm"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-beauty-muted-border shrink-0 bg-beauty-cream/20">
                      <ProductImage
                        product={sub}
                        className="w-full h-full"
                        imageClassName="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xs font-semibold text-beauty-sage uppercase tracking-wider">
                          {sub.brand}
                        </span>
                        {sub.isFragranceFree && (
                          <Badge variant="cream" size="sm">
                            Fragrance-Free
                          </Badge>
                        )}
                      </div>
                      <div className="font-serif text-sm font-medium text-beauty-charcoal mt-0.5">
                        {sub.name}
                      </div>
                      <div className="text-xs text-beauty-muted mt-0.5">
                        Actives: {sub.keyActives.join(', ')} ({sub.size})
                      </div>
                    </div>
                  </div>

                  {/* Price & Swap CTA */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-beauty-muted-border">
                    <div className="text-right">
                      <div className="font-serif text-base font-medium text-beauty-charcoal">
                        {sub.price !== null && sub.price !== undefined
                          ? `₹${sub.price.toLocaleString('en-IN')}`
                          : 'Price on Google'}
                      </div>
                      {priceDiff !== null && (
                        <div className={`text-2xs font-medium ${
                          priceDiff < 0 ? 'text-beauty-forest' : priceDiff > 0 ? 'text-amber-700' : 'text-beauty-muted'
                        }`}>
                          {priceDiff < 0 ? `-₹${Math.abs(priceDiff)} savings` : priceDiff > 0 ? `+₹${priceDiff}` : 'Same Price'}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectProduct(sub);
                        onClose();
                      }}
                      className="px-4 py-2 text-xs font-medium rounded-xl bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest/90 shadow-beauty-sm flex items-center gap-1.5 transition-all"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-beauty-lime" />
                      <span>Select Formula</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import { Product } from '../../types/product';
import { RoutineSlot } from '../../types/routine';
import { RecommendationEngine } from '../../services/recommendationEngine';
import { Modal } from '../common/Modal';
import { ArrowLeftRight, Check, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';

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
      title={`Substitute Product for ${slot.slotName}`}
      subtitle="Compare formulations, key actives, and live price delta"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Currently Assigned Product Anchor */}
        {currentProduct && (
          <div className="p-3.5 rounded-xl border border-white/12 bg-editorial-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                className="w-12 h-12 rounded-lg object-cover border border-white/10"
              />
              <div>
                <span className="text-2xs font-mono uppercase text-editorial-text-muted">
                  Current Selection
                </span>
                <div className="text-xs font-bold text-white">
                  {currentProduct.brand} — {currentProduct.name}
                </div>
                <div className="text-2xs text-editorial-text-secondary mt-0.5">
                  {currentProduct.keyActives.join(', ')}
                </div>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-white">
              ₹{currentProduct.price.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Available Alternatives List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          <div className="text-2xs font-mono uppercase tracking-wider text-editorial-text-muted">
            Available Compatible Substitutes ({substitutes.length})
          </div>

          {substitutes.length === 0 ? (
            <div className="p-6 text-center text-xs text-editorial-text-muted">
              No additional alternatives found in this specific formulation category.
            </div>
          ) : (
            substitutes.map((sub) => {
              const priceDiff = currentProduct ? sub.price - currentProduct.price : 0;
              return (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-xl border border-white/[0.08] bg-editorial-surface hover:border-editorial-lime/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={sub.imageUrl}
                      alt={sub.name}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xs font-semibold text-editorial-lime uppercase">
                          {sub.brand}
                        </span>
                        {sub.isFragranceFree && (
                          <span className="text-[10px] text-editorial-text-muted font-mono">
                            Fragrance-Free
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-white mt-0.5">
                        {sub.name}
                      </div>
                      <div className="text-2xs text-editorial-text-secondary mt-1">
                        Actives: {sub.keyActives.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Price & Swap CTA */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-white">
                        ₹{sub.price.toLocaleString('en-IN')}
                      </div>
                      {currentProduct && (
                        <div className={`text-[10px] font-mono font-semibold ${
                          priceDiff < 0 ? 'text-emerald-400' : priceDiff > 0 ? 'text-amber-400' : 'text-editorial-text-muted'
                        }`}>
                          {priceDiff < 0 ? `-₹${Math.abs(priceDiff)}` : priceDiff > 0 ? `+₹${priceDiff}` : 'Same Price'}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectProduct(sub);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-subtle-glow flex items-center gap-1.5 transition-all"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Select Swap</span>
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

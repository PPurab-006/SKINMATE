import React from 'react';
import { Product } from '../../types/product';
import { Modal } from '../common/Modal';
import { ExternalLink, Check, ShieldCheck, ShoppingBag, Droplets, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';

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
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.brand}
      subtitle={product.name}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Product Header Grid */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full sm:w-44 aspect-square rounded-2xl object-cover border border-white/10 shrink-0"
          />

          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="lime" size="sm">
                {product.category}
              </Badge>
              {product.activeConcentration && (
                <span className="text-2xs font-mono px-2 py-0.5 rounded bg-white/[0.04] text-editorial-text-secondary border border-white/10">
                  {product.activeConcentration}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-editorial-text-muted font-mono">
                / {product.size}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-editorial-text-secondary">
              <span className="text-editorial-lime font-mono">★ {product.rating}</span>
              <span>•</span>
              <span>{product.reviewsCount} verified reviews</span>
              {product.phLevel && (
                <>
                  <span>•</span>
                  <span className="font-mono text-white">pH {product.phLevel}</span>
                </>
              )}
            </div>

            {/* Formulation Texture & Suitability */}
            <div className="pt-2 flex flex-wrap gap-1.5 text-2xs">
              <span className="px-2.5 py-1 rounded-md bg-editorial-card border border-white/[0.06] text-white">
                Texture: {product.texture}
              </span>
              {product.isFragranceFree && (
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Fragrance-Free
                </span>
              )}
              {product.isNonComedogenic && (
                <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Non-Comedogenic
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Key Actives Section */}
        <div className="p-4 rounded-xl bg-editorial-card border border-white/[0.06] space-y-2">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Key Dermatological Actives
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.keyActives.map((active, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs rounded-lg bg-editorial-bg border border-white/10 text-editorial-lime font-mono font-medium"
              >
                {active}
              </span>
            ))}
          </div>
        </div>

        {/* Clinical Compatibility Tags */}
        {product.clinicalTags.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-2xs font-mono uppercase tracking-wider text-editorial-text-muted">
              PCPartPicker Biochemical Classification Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.clinicalTags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-2xs rounded bg-white/[0.04] text-editorial-text-secondary border border-white/[0.06] font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full INCI Ingredients Array */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Full INCI Ingredients Formulation ({product.fullIngredients.length})
          </h4>
          <div className="p-3.5 rounded-xl bg-editorial-bg border border-white/10 text-2xs text-editorial-text-secondary leading-relaxed font-mono max-h-32 overflow-y-auto">
            {product.fullIngredients.join(', ')}
          </div>
        </div>

        {/* Direct Retailer Purchase Links */}
        <div className="pt-2 border-t border-white/[0.08] space-y-3">
          <span className="text-2xs font-mono uppercase tracking-wider text-editorial-text-muted">
            Verified Retailers &amp; Delivery Links
          </span>
          <div className="flex flex-wrap gap-2.5">
            {product.retailers.map((ret, i) => (
              <a
                key={i}
                href={ret.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-editorial-card border border-white/10 hover:border-editorial-lime text-white flex items-center gap-1.5 transition-all"
              >
                <span>{ret.name}</span>
                <ExternalLink className="w-3 h-3 text-editorial-lime" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

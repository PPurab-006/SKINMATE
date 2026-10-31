import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Plus, 
  ShieldCheck, 
  Droplets, 
  Scissors, 
  Sun, 
  Info,
  SlidersHorizontal,
  Eye,
  Heart,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { UserAppearanceProfile } from '../../types/profile';
import { SkinAnalysisResult } from '../../types/skin';
import { HairAnalysisResult } from '../../types/hair';
import { Product, ProductDepartment } from '../../types/product';
import { Routine } from '../../types/routine';
import { AppTab } from '../../types/common';
import { RecommendationEngine, RecommendationMatch } from '../../services/recommendationEngine';
import { ProductImage } from '../common/ProductImage';
import { GoogleShoppingButton } from '../common/GoogleShoppingButton';
import { Badge } from '../common/Badge';

interface ForYouViewProps {
  profile: UserAppearanceProfile;
  skinAnalysis: SkinAnalysisResult;
  hairAnalysis: HairAnalysisResult;
  activeRoutines: Routine[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (tab: AppTab) => void;
  onAddProductToRoutine?: (product: Product) => void;
}

export const ForYouView: React.FC<ForYouViewProps> = ({
  profile,
  skinAnalysis,
  hairAnalysis,
  activeRoutines,
  onSelectProduct,
  onNavigate,
  onAddProductToRoutine
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<'all' | 'skincare' | 'haircare' | 'grooming' | 'beauty'>('all');
  const [addedProductToast, setAddedProductToast] = useState<string | null>(null);

  const hasAnalysis = profile.hasCompletedSkinConsultation || profile.hasCompletedHairConsultation;

  // Compute recommendations dynamically
  const recommendations: RecommendationMatch[] = useMemo(() => {
    if (!hasAnalysis) return [];
    return RecommendationEngine.getRecommendationsForUser(profile, selectedDepartment);
  }, [profile, selectedDepartment, hasAnalysis]);

  // Routine gap analysis
  const routineGaps = useMemo(() => {
    const gaps: { title: string; category: string; reason: string; suggestedProduct?: Product }[] = [];
    const morning = activeRoutines.find(r => r.kind === 'morning-skin');
    const evening = activeRoutines.find(r => r.kind === 'evening-skin');
    const hairRoutine = activeRoutines.find(r => r.kind === 'haircare');

    // Check SPF
    const hasSpf = morning?.slots.some(s => s.product?.category === 'sunscreen');
    if (!hasSpf) {
      gaps.push({
        title: 'Broad-Spectrum UV Defense',
        category: 'sunscreen',
        reason: `Your ${skinAnalysis.skinType} skin and Fitzpatrick Type ${skinAnalysis.fitzpatrick} phototype requires non-comedogenic daily UV protection to prevent barrier damage.`
      });
    }

    // Check Hair Frizz Control
    const hasFrizzControl = hairRoutine?.slots.some(s => s.product?.clinicalTags.some(t => t === 'argan-oil' || t === 'bond-repair'));
    if (!hasFrizzControl && hairAnalysis.frizziness.score > 50) {
      gaps.push({
        title: 'Cuticle Frizz Sealing',
        category: 'haircare',
        reason: `Your ${hairAnalysis.pattern} hair analysis recorded a ${hairAnalysis.frizziness.score}/100 frizz score. A cold-pressed lipid sealer or bond repair mask is missing from your active hair protocol.`
      });
    }

    return gaps;
  }, [activeRoutines, skinAnalysis, hairAnalysis]);

  const handleAddProduct = (product: Product) => {
    if (onAddProductToRoutine) {
      onAddProductToRoutine(product);
    }
    setAddedProductToast(`"${product.name}" marked for My Routine!`);
    setTimeout(() => setAddedProductToast(null), 3500);
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
      {/* 1. Header & Pillar Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-beauty-muted-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-beauty-forest" />
            <span className="text-2xs font-semibold uppercase tracking-widest text-beauty-forest font-sans">
              Pillar 3: Personalized Recommendation Engine
            </span>
          </div>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl text-beauty-charcoal-heading tracking-tight">
            For You
          </h1>
          <p className="text-sm text-beauty-muted mt-1.5 font-light max-w-xl">
            Explainable formulation matchmaking. Every product recommendation clearly details why it was selected for your verified skin and hair characteristics.
          </p>
        </div>

        {hasAnalysis && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-beauty-cream border border-beauty-muted-border text-xs text-beauty-charcoal self-start md:self-auto shrink-0">
            <ShieldCheck className="w-4 h-4 text-beauty-forest" />
            <span className="font-medium">Live Intelligence Active</span>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {addedProductToast && (
        <div className="p-4 rounded-2xl bg-beauty-forest text-beauty-ivory text-xs flex items-center justify-between gap-3 animate-fade-in shadow-beauty-card">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-beauty-lime shrink-0" />
            <span className="font-medium">{addedProductToast}</span>
          </div>
          <button
            onClick={() => onNavigate('routine')}
            className="text-2xs uppercase tracking-wider font-semibold text-beauty-lime hover:underline"
          >
            Open Routine Builder &rarr;
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. UNANALYZED STATE: Welcoming Prompt to Complete Profile                  */}
      {/* ========================================================================= */}
      {!hasAnalysis ? (
        <div className="p-10 sm:p-16 rounded-[2.5rem] bg-beauty-cream border border-beauty-muted-border text-center space-y-8 shadow-beauty-card max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-white border border-beauty-muted-border flex items-center justify-center mx-auto text-beauty-forest shadow-2xs">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-beauty-charcoal-heading">
              Personalized for your exact biology
            </h2>
            <p className="text-sm sm:text-base text-beauty-muted font-light leading-relaxed">
              SkinMate doesn't show random placeholder recommendations. To unlock genuinely tailored skincare and haircare suggestions, start by analyzing your skin or hair with our optical camera intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-2">
            <button
              onClick={() => onNavigate('skin-hair')}
              className="p-5 rounded-2xl bg-white border border-beauty-muted-border hover:border-beauty-forest transition-all text-left space-y-2 group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-beauty-cream flex items-center justify-center text-beauty-forest group-hover:scale-105 transition-transform">
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-semibold text-base text-beauty-charcoal group-hover:text-beauty-forest transition-colors">
                Skin Analysis
              </h4>
              <p className="text-xs text-beauty-muted font-light leading-relaxed">
                Identify sebum equilibrium, pore visibility, and undertone in seconds.
              </p>
            </button>

            <button
              onClick={() => onNavigate('skin-hair')}
              className="p-5 rounded-2xl bg-white border border-beauty-muted-border hover:border-beauty-forest transition-all text-left space-y-2 group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-beauty-cream flex items-center justify-center text-beauty-forest group-hover:scale-105 transition-transform">
                <Scissors className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-semibold text-base text-beauty-charcoal group-hover:text-beauty-forest transition-colors">
                Hair Diagnostic
              </h4>
              <p className="text-xs text-beauty-muted font-light leading-relaxed">
                Detect wave pattern, cuticle alignment, length, and scalp ecology.
              </p>
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 3. ANALYZED STATE: Rich Explainable Recommendations Feed                  */
        /* ========================================================================= */
        <div className="space-y-10">
          
          {/* Active Diagnostic Profile Context Bar */}
          <div className="p-6 rounded-3xl bg-beauty-cream border border-beauty-muted-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-2xs uppercase tracking-wider font-semibold text-beauty-forest">
                Active Diagnostic Baseline
              </span>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-beauty-muted-border text-beauty-charcoal">
                  {skinAnalysis.skinType} Skin
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-beauty-muted-border text-beauty-charcoal">
                  Fitzpatrick {skinAnalysis.fitzpatrick}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-beauty-muted-border text-beauty-charcoal">
                  {skinAnalysis.colorTone.undertone} Tone
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-beauty-muted-border text-beauty-charcoal">
                  {hairAnalysis.pattern} Hair
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-beauty-muted-border text-beauty-charcoal">
                  {hairAnalysis.frizziness.level} Frizz Index
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('skin-hair')}
              className="px-4 py-2 rounded-full text-xs font-semibold text-beauty-forest hover:bg-white transition-all self-start md:self-auto border border-beauty-muted-border"
            >
              Update Profile &rarr;
            </button>
          </div>

          {/* Routine Gaps Spotlight */}
          {routineGaps.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-4">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <h3 className="font-serif font-semibold text-lg text-amber-950">
                  Identified Routine Protocol Gaps
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {routineGaps.map((gap, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-amber-200/60 space-y-2">
                    <span className="text-2xs uppercase tracking-wider font-semibold text-amber-800">
                      Missing Step: {gap.title}
                    </span>
                    <p className="text-xs text-beauty-charcoal-body leading-relaxed font-light">
                      {gap.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Department Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Curated Matches' },
              { id: 'skincare', label: 'Skincare Formulations' },
              { id: 'haircare', label: 'Haircare Treatments' },
              { id: 'grooming', label: 'Beard & Grooming' },
              { id: 'beauty', label: 'Cosmetics & Beauty' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedDepartment(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedDepartment === tab.id
                    ? 'bg-beauty-forest text-beauty-ivory font-semibold shadow-2xs'
                    : 'bg-white border border-beauty-muted-border text-beauty-charcoal hover:bg-beauty-cream'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Recommendation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.slice(0, 8).map(({ product, matchScore, matchReasons }) => (
              <div
                key={product.id}
                className="p-6 rounded-3xl bg-white border border-beauty-muted-border hover:border-beauty-forest transition-all shadow-beauty-card flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Brand, Category, Match Score Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <ProductImage
                        product={product}
                        className="w-16 h-16 rounded-2xl shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
                        onClick={() => onSelectProduct(product)}
                      />
                      <div>
                        <span className="text-2xs font-semibold uppercase tracking-wider text-beauty-muted">
                          {product.brand}
                        </span>
                        <h4
                          onClick={() => onSelectProduct(product)}
                          className="font-serif font-semibold text-base text-beauty-charcoal-heading group-hover:text-beauty-forest transition-colors cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-sm font-bold text-beauty-charcoal">
                            {product.price !== null ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Google'}
                          </span>
                          <span className="text-2xs text-beauty-muted">
                            ({product.size})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-full text-2xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      {matchScore}% Match
                    </div>
                  </div>

                  {/* Explainable Matching Rationale Box */}
                  <div className="p-4 rounded-2xl bg-beauty-cream/70 border border-beauty-muted-border space-y-1.5">
                    <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-beauty-forest">
                      <Sparkles className="w-3.5 h-3.5 text-beauty-forest" />
                      <span>Why this was matched for you</span>
                    </div>
                    <ul className="space-y-1">
                      {matchReasons.map((reason, idx) => (
                        <li key={idx} className="text-xs text-beauty-charcoal-body font-light leading-relaxed flex items-start gap-2">
                          <span className="text-beauty-forest font-bold">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Actives Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {product.keyActives.slice(0, 3).map((act, i) => (
                      <span key={i} className="text-2xs px-2.5 py-1 rounded-full bg-beauty-cream text-beauty-charcoal font-medium">
                        {act}
                      </span>
                    ))}
                    {product.isFragranceFree && (
                      <span className="text-2xs px-2.5 py-1 rounded-full bg-white border border-beauty-muted-border text-beauty-muted">
                        Fragrance-Free
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-beauty-muted-border flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="text-xs font-semibold text-beauty-charcoal hover:text-beauty-forest flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details</span>
                    </button>
                    <GoogleShoppingButton product={product} size="sm" variant="ghost" />
                  </div>

                  <button
                    onClick={() => handleAddProduct(product)}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Routine</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

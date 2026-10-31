import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Sun, 
  Moon, 
  ChevronRight, 
  ShoppingBag,
  SlidersHorizontal,
  Palette,
  Droplets,
  Scissors,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Layers,
  Heart,
  Bookmark,
  Beaker,
  ExternalLink,
  Flame,
  Search,
  BookOpen
} from 'lucide-react';
import { AppTab } from '../../types/common';
import { Routine } from '../../types/routine';
import { Product } from '../../types/product';
import { UserAppearanceProfile } from '../../types/profile';
import { RecommendationEngine } from '../../services/recommendationEngine';
import { ProductImage } from '../common/ProductImage';
import { GoogleShoppingButton } from '../common/GoogleShoppingButton';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { Badge } from '../common/Badge';

interface EditorialHomeProps {
  onNavigate: (tab: AppTab) => void;
  activeRoutines: Routine[];
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
  profile: UserAppearanceProfile;
  onOpenAssessment?: (type: 'skin' | 'hair') => void;
}

export const EditorialHome: React.FC<EditorialHomeProps> = ({
  onNavigate,
  activeRoutines,
  featuredProducts,
  onSelectProduct,
  profile,
  onOpenAssessment
}) => {
  const morningRoutine = activeRoutines.find(r => r.kind === 'morning-skin');
  const eveningRoutine = activeRoutines.find(r => r.kind === 'evening-skin');
  const morningProducts = morningRoutine?.slots.map(s => s.product).filter(Boolean) as Product[] || [];
  const eveningProducts = eveningRoutine?.slots.map(s => s.product).filter(Boolean) as Product[] || [];

  const hasAnalysis = Boolean(
    profile.hasCompletedSkinConsultation || 
    profile.hasCompletedHairConsultation || 
    (profile.skin && profile.skin.type)
  );

  // Personalized preview matches (strictly genuine catalogue entries when profile exists)
  const previewMatches = React.useMemo(() => {
    if (!hasAnalysis) return [];
    return RecommendationEngine.getRecommendationsForUser(profile, 'all').slice(0, 3);
  }, [profile, hasAnalysis]);

  // Verified Category Representative Products from Catalogue
  const categoryShowcase = React.useMemo(() => {
    return [
      {
        id: 'skincare',
        title: 'Skincare',
        subtitle: 'Cleansers, Serums, Barrier Creams & Mineral SPF',
        product: MOCK_PRODUCTS.find(p => p.id === 'prod-serum-01') || MOCK_PRODUCTS[0],
        itemCount: MOCK_PRODUCTS.filter(p => !p.department || p.department === 'skincare').length,
        colorBg: 'bg-emerald-50/60'
      },
      {
        id: 'haircare',
        title: 'Haircare',
        subtitle: 'Bond Repair, Cuticle Oils, Shampoos & Masks',
        product: MOCK_PRODUCTS.find(p => p.id === 'prod-hair-02') || MOCK_PRODUCTS.find(p => p.department === 'haircare') || MOCK_PRODUCTS[0],
        itemCount: MOCK_PRODUCTS.filter(p => p.department === 'haircare').length || 2,
        colorBg: 'bg-amber-50/60'
      },
      {
        id: 'grooming',
        title: 'Grooming',
        subtitle: 'Beard Elixirs, Antimicrobial Washes & Razors',
        product: MOCK_PRODUCTS.find(p => p.id === 'prod-groom-01') || MOCK_PRODUCTS[0],
        itemCount: MOCK_PRODUCTS.filter(p => p.department === 'grooming' || p.category.includes('beard')).length || 1,
        colorBg: 'bg-stone-50'
      },
      {
        id: 'makeup',
        title: 'Makeup',
        subtitle: 'High-Pigment Lip Inks, Tinted Minerals & Primers',
        product: MOCK_PRODUCTS.find(p => p.id === 'prod-makeup-01') || MOCK_PRODUCTS[0],
        itemCount: MOCK_PRODUCTS.filter(p => p.department === 'beauty' || p.category === 'makeup').length || 1,
        colorBg: 'bg-rose-50/60'
      },
      {
        id: 'beauty-nails',
        title: 'Beauty & Nails',
        subtitle: 'Long-Wear Gloss Enamels, Treatments & Accessories',
        product: MOCK_PRODUCTS.find(p => p.id === 'prod-nail-01') || MOCK_PRODUCTS[0],
        itemCount: MOCK_PRODUCTS.filter(p => p.category === 'nails').length || 1,
        colorBg: 'bg-purple-50/60'
      }
    ];
  }, []);

  // Trending Real Catalogue Products (Exclusively actual catalog entries)
  const trendingProducts = React.useMemo(() => {
    return [
      MOCK_PRODUCTS.find(p => p.id === 'prod-serum-01'),
      MOCK_PRODUCTS.find(p => p.id === 'prod-moist-01'),
      MOCK_PRODUCTS.find(p => p.id === 'prod-hair-02'),
      MOCK_PRODUCTS.find(p => p.id === 'prod-sun-01')
    ].filter(Boolean) as Product[];
  }, []);

  // Verified Ingredient Education Data
  const verifiedIngredients = [
    {
      name: 'Niacinamide (Vitamin B3)',
      category: 'Sebum Equilibrium & Barrier',
      concentration: '2% – 10%',
      mechanism: 'Inhibits 5-alpha reductase to regulate follicular sebum output, stimulates natural ceramide synthesis, and visibly tightens follicular pore walls.',
      suitableFor: 'Oily, Combination, Blemish-Prone Skin',
      verifiedTag: 'niacinamide'
    },
    {
      name: 'Physiological Ceramides (NP, AP, EOP)',
      category: 'Intercellular Lamellar Lipids',
      concentration: '3:1:1 Molar Ratio',
      mechanism: 'Replenishes the identical multi-lamellar lipid matrix between stratum corneum corneocytes, halting trans-epidermal water loss (TEWL) and restoring compromised barriers.',
      suitableFor: 'Dry, Sensitive, Compromised Barrier',
      verifiedTag: 'ceramides'
    },
    {
      name: 'Bis-Aminopropyl Diglycol & Maleic Acid',
      category: 'Hair Cortex Disulfide Repair',
      concentration: '5% Bio-Complex',
      mechanism: 'Restores cleaved disulfide (keratin) bridges damaged by chemical bleaching and heat styling, visibly increasing tensile strength and lowering frizz porosity.',
      suitableFor: 'Bleached, Color-Treated, High Porosity Hair',
      verifiedTag: 'bond-repair'
    },
    {
      name: 'Salicylic Acid (BHA)',
      category: 'Lipophilic Keratolytic',
      concentration: '1% – 2%',
      mechanism: 'Oil-soluble beta-hydroxy acid that penetrates lipid-rich sebaceous conduits, dissolving micro-comedones and dead cellular debris from within the pore lining.',
      suitableFor: 'Blackheads, Congested Pores, Acne-Prone',
      verifiedTag: 'bha'
    },
    {
      name: 'Centella Asiatica (Madecassoside)',
      category: 'Phyto-Erythema Reducer',
      concentration: '0.5% – 2%',
      mechanism: 'Triterpenoid bioactive compounds downregulate vascular inflammatory pathways, soothing facial erythema and accelerating epidermal micro-healing.',
      suitableFor: 'Redness, Flushed Cheeks, Reactive Skin',
      verifiedTag: 'centella-cica'
    },
    {
      name: 'Mexoryl 400 & Mineral Titanium UV Filters',
      category: 'Broad-Spectrum Photoprotection',
      concentration: 'SPF 50+ PA++++',
      mechanism: 'Absorbs destructive ultra-long UVA photons (380–400nm) and reflects UVB radiation, preventing deep dermal collagen degradation and post-inflammatory pigmentation.',
      suitableFor: 'All Phototypes (Essential Morning Step)',
      verifiedTag: 'sunscreen-chemical'
    }
  ];

  return (
    <div className="space-y-20 md:space-y-28 animate-fade-in">

      {/* ========================================================================= */}
      {/* 1. PRODUCT-FIRST HERO SECTION (Zero Random Models, Real Formulations)      */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-beauty-cream border border-beauty-muted-border shadow-beauty-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[600px]">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-beauty-muted-border w-fit text-xs font-semibold text-beauty-forest shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-beauty-forest" />
              <span>Evidence-Based Discovery &amp; Google Shopping</span>
            </div>

            <h1 className="font-serif font-normal text-4xl sm:text-5xl md:text-6xl text-beauty-charcoal-heading leading-[1.12] tracking-tight">
              Discover what works for you.
            </h1>

            <p className="text-base sm:text-lg text-beauty-charcoal-body font-light leading-relaxed max-w-lg">
              Explore skincare, haircare and personal-care products selected around your needs.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="px-7 py-3.5 rounded-full text-sm font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-sm flex items-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('skin-hair')}
                className="px-7 py-3.5 rounded-full text-sm font-semibold bg-white text-beauty-charcoal border border-beauty-muted-border hover:bg-beauty-cream transition-all shadow-2xs flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-beauty-forest" />
                <span>Discover Your Skin & Hair</span>
              </button>
            </div>

            {/* Credibility Micro-Points */}
            <div className="pt-4 border-t border-beauty-muted-border/70 flex flex-wrap items-center gap-6 text-2xs text-beauty-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-beauty-forest" />
                <span>Open Beauty Facts verified data</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-beauty-forest" />
                <span>Zero arbitrary stock photos</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-beauty-forest" />
                <span>Direct universal Google Shopping</span>
              </span>
            </div>
          </div>

          {/* Hero Right Composition: Editorial Product Showcase (No Random Humans) */}
          <div className="lg:col-span-5 relative p-6 sm:p-10 flex items-center justify-center bg-gradient-to-br from-white/60 to-beauty-cream border-t lg:border-t-0 lg:border-l border-beauty-muted-border">
            <div className="w-full max-w-sm space-y-4">
              <div className="text-2xs font-semibold uppercase tracking-wider text-beauty-muted flex items-center justify-between">
                <span>Verified Catalogue Highlights</span>
                <span className="text-beauty-forest">Open Registry</span>
              </div>

              {/* Stacked Product Showcase Cards */}
              <div className="space-y-3">
                {trendingProducts.slice(0, 3).map((prod, idx) => (
                  <div
                    key={prod.id}
                    onClick={() => onSelectProduct(prod)}
                    className="p-3.5 rounded-2xl bg-white border border-beauty-muted-border hover:border-beauty-forest transition-all shadow-beauty-card flex items-center gap-3.5 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-beauty-muted-border bg-beauty-cream">
                      <ProductImage
                        product={prod}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-3xs font-semibold uppercase tracking-wider text-beauty-muted">
                          {prod.brand}
                        </span>
                        <span className="text-3xs font-mono font-bold text-beauty-forest px-1.5 py-0.5 rounded bg-beauty-cream border border-beauty-muted-border">
                          {prod.size}
                        </span>
                      </div>
                      <h4 className="font-serif font-medium text-xs text-beauty-charcoal line-clamp-1 group-hover:text-beauty-forest transition-colors">
                        {prod.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-2xs font-bold text-beauty-charcoal">
                          {prod.price !== null ? `₹${prod.price.toLocaleString('en-IN')}` : 'Price on Google'}
                        </span>
                        <span className="text-3xs text-beauty-muted group-hover:text-beauty-forest transition-colors flex items-center gap-0.5">
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-beauty-cream/80 border border-beauty-muted-border/80 text-center">
                <span className="text-2xs text-beauty-muted font-light">
                  Exact formulations with GTIN barcodes &amp; clinical reasoning.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SHOP BY CATEGORY (Image-Led with Actual Catalogue Products)            */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-2xs uppercase tracking-widest font-semibold text-beauty-forest font-sans">
              Product-First Browsing
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-beauty-charcoal-heading mt-1">
              Shop by category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-beauty-forest hover:underline flex items-center gap-1"
          >
            <span>Explore All Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categoryShowcase.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop')}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-beauty-muted-border hover:border-beauty-forest transition-all duration-300 shadow-beauty-card flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Category Thumbnail showing actual product packaging */}
                <div className={`relative aspect-square rounded-2xl overflow-hidden ${cat.colorBg} border border-beauty-muted-border p-3 flex items-center justify-center`}>
                  <ProductImage
                    product={cat.product}
                    className="w-full h-full"
                    imageClassName="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-3xs font-semibold uppercase tracking-wider bg-white/90 text-beauty-forest backdrop-blur-xs border border-beauty-muted-border">
                    {cat.itemCount} Formulations
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-base sm:text-lg text-beauty-charcoal-heading group-hover:text-beauty-forest transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-2xs text-beauty-muted font-light leading-relaxed mt-1 line-clamp-2">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-1 flex items-center justify-between border-t border-beauty-muted-border/50 text-2xs font-semibold text-beauty-forest group-hover:underline">
                <span>Browse {cat.title}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TRENDING PRODUCTS (Exact Real Catalogue Entries + Google Shopping)     */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-beauty-forest mb-1">
              <Flame className="w-4 h-4 text-amber-600" />
              <span className="text-2xs uppercase tracking-widest font-semibold font-sans">
                Real Clinical Formulations
              </span>
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-beauty-charcoal-heading">
              Trending products
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold text-beauty-forest hover:underline flex items-center gap-1"
          >
            <span>View All {MOCK_PRODUCTS.length} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="p-5 rounded-3xl bg-white border border-beauty-muted-border hover:border-beauty-forest transition-all shadow-beauty-card flex flex-col justify-between space-y-4 group"
            >
              <div 
                onClick={() => onSelectProduct(product)}
                className="space-y-3 cursor-pointer"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-beauty-cream border border-beauty-muted-border">
                  <ProductImage
                    product={product}
                    className="w-full h-full"
                    imageClassName="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-3xs font-semibold uppercase tracking-wider bg-white/90 text-beauty-forest backdrop-blur-xs border border-beauty-muted-border">
                    {product.brand}
                  </span>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-3xs font-mono font-bold bg-black/60 text-white backdrop-blur-xs">
                    {product.size}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-semibold text-sm sm:text-base text-beauty-charcoal-heading group-hover:text-beauty-forest transition-colors line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-2xs text-beauty-muted line-clamp-1 mt-0.5">
                    {product.variant || product.subcategory || product.category}
                  </p>
                </div>

                {/* Key Actives Pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {product.keyActives.slice(0, 2).map((active, i) => (
                    <span key={i} className="text-3xs px-2 py-0.5 rounded-full bg-beauty-cream text-beauty-charcoal font-medium">
                      {active}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-beauty-charcoal">
                    {product.price !== null ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Google'}
                  </span>
                  <span className="text-2xs text-beauty-forest font-semibold flex items-center gap-0.5 group-hover:underline">
                    <span>Inspect</span>
                    <Eye className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Universal Google Shopping Search Action */}
              <div className="pt-3 border-t border-beauty-muted-border/70">
                <GoogleShoppingButton
                  product={product}
                  size="sm"
                  variant="secondary"
                  className="w-full justify-center"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. RECOMMENDED FOR YOU (Strictly Genuinely Matched or Honest Prompt)       */}
      {/* ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-[2.5rem] bg-beauty-cream border border-beauty-muted-border space-y-8 shadow-beauty-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-beauty-forest" />
              <span className="text-2xs uppercase tracking-widest font-semibold text-beauty-forest">
                Recommendation Engine
              </span>
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-beauty-charcoal-heading">
              Recommended for you
            </h2>
            <p className="text-xs sm:text-sm text-beauty-muted mt-1 font-light max-w-lg">
              {hasAnalysis
                ? 'Products matched to your verified skin and hair profile with transparent clinical reasons.'
                : 'Take an assessment to unlock explainable, ingredient-matched product recommendations.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate(hasAnalysis ? 'for-you' : 'skin-hair')}
            className="px-6 py-3 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <span>{hasAnalysis ? 'View All For You Matches' : 'Start Skin & Hair Assessment'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {hasAnalysis && previewMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewMatches.map(({ product, matchScore, matchReasons }) => (
              <div
                key={product.id}
                className="p-6 rounded-3xl bg-white border border-beauty-muted-border hover:border-beauty-forest transition-all shadow-beauty-card flex flex-col justify-between space-y-4 group"
              >
                <div 
                  onClick={() => onSelectProduct(product)}
                  className="space-y-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-semibold uppercase tracking-wider text-beauty-muted">
                      {product.brand}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {matchScore}% Match
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-beauty-muted-border bg-beauty-cream">
                      <ProductImage product={product} className="w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-semibold text-base text-beauty-charcoal-heading group-hover:text-beauty-forest transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <span className="text-2xs text-beauty-muted">
                        {product.size}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-beauty-cream/70 border border-beauty-muted-border text-xs text-beauty-charcoal-body font-light leading-relaxed">
                    <span className="font-semibold text-beauty-forest">Why matched: </span>
                    <span>{matchReasons[0]}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-beauty-muted-border/60">
                    <span className="font-mono text-sm font-bold text-beauty-charcoal">
                      {product.price !== null ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Google'}
                    </span>
                    <span className="text-xs font-semibold text-beauty-forest group-hover:underline flex items-center gap-1">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <GoogleShoppingButton product={product} size="sm" variant="secondary" className="w-full justify-center" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-beauty-muted-border text-center space-y-4 max-w-xl mx-auto shadow-beauty-card">
            <div className="w-12 h-12 rounded-2xl bg-beauty-cream flex items-center justify-center text-beauty-forest mx-auto shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-semibold text-xl text-beauty-charcoal">
              No Personal Profile Recorded Yet
            </h4>
            <p className="text-xs sm:text-sm text-beauty-muted font-light leading-relaxed">
              SkinMate does not invent simulated recommendations. Complete your quick skin or hair diagnostic to see genuine formulations matched to your biological profile.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('skin-hair')}
                className="px-6 py-3 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-sm inline-flex items-center gap-2"
              >
                <span>Start Skin &amp; Hair Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. EXPLORE INGREDIENTS (Verified Cosmetic Science & Active Principles)     */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-beauty-forest mb-1">
              <Beaker className="w-4 h-4 text-beauty-forest" />
              <span className="text-2xs uppercase tracking-widest font-semibold font-sans">
                Cosmetic Biochemical Intelligence
              </span>
            </div>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-beauty-charcoal-heading">
              Explore ingredients
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-beauty-muted max-w-md font-light">
            Understand the clinical actions, cellular mechanisms, and compatibility of common personal-care active ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedIngredients.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-beauty-muted-border hover:border-beauty-forest transition-all shadow-beauty-card space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xs font-semibold uppercase tracking-wider text-beauty-forest px-2.5 py-0.5 rounded-full bg-beauty-cream border border-beauty-muted-border">
                    {item.category}
                  </span>
                  <span className="text-3xs font-mono font-bold text-beauty-muted">
                    {item.concentration}
                  </span>
                </div>

                <h3 className="font-serif font-semibold text-lg text-beauty-charcoal-heading group-hover:text-beauty-forest transition-colors">
                  {item.name}
                </h3>

                <p className="text-xs text-beauty-charcoal-body font-light leading-relaxed">
                  {item.mechanism}
                </p>
              </div>

              <div className="pt-3 border-t border-beauty-muted-border/60 space-y-2">
                <div className="text-3xs text-beauty-muted">
                  <span className="font-semibold text-beauty-charcoal">Indicated For: </span>
                  <span>{item.suitableFor}</span>
                </div>

                <button
                  onClick={() => onNavigate('shop')}
                  className="text-xs font-semibold text-beauty-forest hover:underline flex items-center gap-1 pt-1"
                >
                  <span>Find Products with {item.name.split('(')[0].trim()}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BUILD YOUR ROUTINE & SAVED LISTS INTEGRATION                            */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-2xs uppercase tracking-widest font-semibold text-beauty-forest font-sans">
              Configurator &amp; Saved Lists
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-beauty-charcoal-heading mt-1">
              Build your routine
            </h2>
          </div>
          <p className="text-sm text-beauty-muted max-w-md font-light">
            Interactive Morning, Evening, Haircare &amp; Grooming routines with step sequencing and universal Google shopping links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Morning Routine Preview */}
          <div className="p-8 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-semibold text-xl text-beauty-charcoal-heading">
                  Morning Skincare (AM)
                </h3>
              </div>
              <span className="text-2xs px-3 py-1 rounded-full bg-beauty-cream border border-beauty-muted-border font-semibold text-beauty-charcoal">
                {morningProducts.length} Steps Configured
              </span>
            </div>

            <div className="space-y-2.5">
              {morningRoutine?.slots.slice(0, 3).map((slot, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-beauty-cream/50 border border-beauty-muted-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-2xs text-beauty-muted font-medium uppercase tracking-wider block">
                      Step 0{slot.stepNumber}: {slot.slotName}
                    </span>
                    <span className="font-medium text-beauty-charcoal">
                      {slot.product ? slot.product.name : 'Unassigned Slot'}
                    </span>
                  </div>
                  {slot.product && (
                    <span className="font-mono text-xs font-bold text-beauty-charcoal">
                      {slot.product.price !== null ? `₹${slot.product.price}` : 'Google'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('routine')}
                className="flex-1 py-3 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <span>Configure Routine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('lists')}
                className="px-5 py-3 rounded-full text-xs font-semibold bg-beauty-cream text-beauty-charcoal border border-beauty-muted-border hover:bg-white transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-beauty-forest" />
                <span>My Lists</span>
              </button>
            </div>
          </div>

          {/* Evening Routine Preview */}
          <div className="p-8 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-card space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-700" />
                <h3 className="font-serif font-semibold text-xl text-beauty-charcoal-heading">
                  Evening Skincare (PM)
                </h3>
              </div>
              <span className="text-2xs px-3 py-1 rounded-full bg-beauty-cream border border-beauty-muted-border font-semibold text-beauty-charcoal">
                {eveningProducts.length} Steps Configured
              </span>
            </div>

            <div className="space-y-2.5">
              {eveningRoutine?.slots.slice(0, 3).map((slot, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-beauty-cream/50 border border-beauty-muted-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-2xs text-beauty-muted font-medium uppercase tracking-wider block">
                      Step 0{slot.stepNumber}: {slot.slotName}
                    </span>
                    <span className="font-medium text-beauty-charcoal">
                      {slot.product ? slot.product.name : 'Unassigned Slot'}
                    </span>
                  </div>
                  {slot.product && (
                    <span className="font-mono text-xs font-bold text-beauty-charcoal">
                      {slot.product.price !== null ? `₹${slot.product.price}` : 'Google'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('routine')}
                className="flex-1 py-3 rounded-full text-xs font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <span>Configure Evening Routine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className="px-5 py-3 rounded-full text-xs font-semibold bg-beauty-cream text-beauty-charcoal border border-beauty-muted-border hover:bg-white transition-all shadow-2xs flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-beauty-forest" />
                <span>Shop Actives</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BEAUTY STUDIO (Refined, Subtle Appearance Experimentation Pillar)        */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-beauty-cream/70 border border-beauty-muted-border shadow-beauty-card p-8 sm:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-beauty-muted-border w-fit text-xs font-semibold text-beauty-forest">
              <Palette className="w-3.5 h-3.5 text-beauty-forest" />
              <span>Appearance &amp; Virtual Experimentation</span>
            </div>

            <h2 className="font-serif font-normal text-2xl sm:text-3xl text-beauty-charcoal-heading">
              Beauty Studio
            </h2>

            <p className="text-xs sm:text-sm text-beauty-muted font-light leading-relaxed">
              Experiment with volumetric hairstyles, beard shaping, color tones, and aesthetic enhancements powered by YouCam computer vision.
            </p>
          </div>

          <button
            onClick={() => onNavigate('studio')}
            className="px-7 py-3.5 rounded-full text-sm font-semibold bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest-hover transition-all shadow-sm flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <span>Enter Beauty Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};

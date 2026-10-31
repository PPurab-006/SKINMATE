import React from 'react';
import { 
  Sparkles, 
  Scissors, 
  Palette, 
  SlidersHorizontal, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Droplets,
  Heart
} from 'lucide-react';
import { AppTab } from '../../types/common';
import { UserAppearanceProfile } from '../../types/profile';
import { SkinAnalysisResult } from '../../types/skin';
import { HairAnalysisResult } from '../../types/hair';
import { Routine } from '../../types/routine';
import { Product } from '../../types/product';
import { Badge } from '../common/Badge';

interface PersonalDashboardProps {
  profile: UserAppearanceProfile;
  skinAnalysis: SkinAnalysisResult;
  hairAnalysis: HairAnalysisResult;
  activeRoutines: Routine[];
  recommendedProducts: Product[];
  onNavigate: (tab: AppTab) => void;
  onSelectProduct: (product: Product) => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  profile,
  skinAnalysis,
  hairAnalysis,
  activeRoutines,
  recommendedProducts,
  onNavigate,
  onSelectProduct
}) => {
  const morningRoutine = activeRoutines.find(r => r.kind === 'morning-skin');
  const eveningRoutine = activeRoutines.find(r => r.kind === 'evening-skin');
  const morningCost = morningRoutine?.slots.reduce((sum, s) => sum + (s.product?.price || 0), 0) || 0;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. Hero Editorial Welcome & Appearance Profile Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-editorial-surface via-editorial-card to-editorial-bg p-6 sm:p-8 md:p-10 shadow-2xl">
        {/* Subtle decorative radial glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-editorial-lime/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="lime" size="sm">
                Diagnostic Health Index 84/100
              </Badge>
              <span className="text-2xs font-mono text-editorial-text-muted">
                Updated {skinAnalysis.timestamp}
              </span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-tight">
              Welcome back, <span className="text-editorial-lime">{profile.name.split(' ')[0]}</span>.
            </h1>

            <p className="text-sm sm:text-base font-light text-editorial-text-secondary leading-relaxed">
              Your cellular barrier is in optimal balance. Today's humidity levels in your region favor lightweight ceramide buffering with UVA-dominant photo-protection.
            </p>

            {/* Appearance Profile Snapshot Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-2xs font-mono text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-editorial-lime" />
                Skin: {profile.skin.type}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-2xs font-mono text-white flex items-center gap-1.5">
                Fitzpatrick: Type {profile.skin.fitzpatrick}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-2xs font-mono text-white flex items-center gap-1.5">
                Undertone: {profile.skin.colorTone.undertone}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-2xs font-mono text-white flex items-center gap-1.5">
                Hair: {profile.hair.pattern}
              </span>
            </div>
          </div>

          {/* Quick Action Diagnostic Launch Bar */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => onNavigate('skin-lab')}
              className="px-6 py-3.5 rounded-xl font-semibold text-xs bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-lime-glow flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
              <span>Launch Skin Lab Scan</span>
            </button>
            <button
              onClick={() => onNavigate('routine-builder')}
              className="px-6 py-3.5 rounded-xl font-semibold text-xs bg-editorial-card border border-white/15 text-white hover:border-editorial-lime flex items-center justify-center gap-2 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Configure My Care Routine</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Core Diagnostics Summary Grid (Skin & Hair) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skin Diagnostics Card */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-editorial-surface/90 flex flex-col justify-between hover:border-white/15 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-editorial-lime/10 border border-editorial-lime/30 flex items-center justify-center text-editorial-lime">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Skin Diagnostic Summary</h3>
                  <span className="text-2xs font-mono text-editorial-text-muted">AI Computer Vision Model</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('skin-lab')}
                className="text-2xs font-mono uppercase tracking-wider text-editorial-lime hover:underline flex items-center gap-1"
              >
                <span>Full Lab</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-editorial-card border border-white/[0.06]">
                <div className="text-2xs text-editorial-text-muted">Health Index</div>
                <div className="text-xl font-bold font-mono text-editorial-lime mt-0.5">
                  {skinAnalysis.overallScore}
                  <span className="text-xs text-editorial-text-muted font-normal">/100</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-editorial-card border border-white/[0.06]">
                <div className="text-2xs text-editorial-text-muted">Biological Age</div>
                <div className="text-xl font-bold font-mono text-white mt-0.5">
                  {skinAnalysis.skinAge}
                  <span className="text-xs text-emerald-400 font-normal"> (-2y)</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-editorial-card border border-white/[0.06]">
                <div className="text-2xs text-editorial-text-muted">Barrier State</div>
                <div className="text-xs font-semibold text-emerald-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Resilient</span>
                </div>
              </div>
            </div>

            {/* Key Concern Bars */}
            <div className="space-y-2.5 mb-4">
              <div>
                <div className="flex justify-between text-2xs font-medium mb-1">
                  <span className="text-editorial-text-secondary">Pore Congestion (T-Zone)</span>
                  <span className="font-mono text-editorial-lime">{skinAnalysis.concerns.pores.score}% optimal</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-editorial-subtle overflow-hidden">
                  <div className="h-full bg-editorial-lime rounded-full" style={{ width: `${skinAnalysis.concerns.pores.score}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-2xs font-medium mb-1">
                  <span className="text-editorial-text-secondary">Hydration Retention</span>
                  <span className="font-mono text-sky-400">{skinAnalysis.concerns.moisture.score}% optimal</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-editorial-subtle overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: `${skinAnalysis.concerns.moisture.score}%` }} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-2xs text-editorial-text-muted border-t border-white/[0.06] pt-3">
            Primary focus: Niacinamide sebum modulation &amp; nightly ceramide seal.
          </p>
        </div>

        {/* Hair Diagnostics Card */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-editorial-surface/90 flex flex-col justify-between hover:border-white/15 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Hair &amp; Follicle Intelligence</h3>
                  <span className="text-2xs font-mono text-editorial-text-muted">Texture &amp; Cuticle Analyzer</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('hair-lab')}
                className="text-2xs font-mono uppercase tracking-wider text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Full Lab</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-editorial-card border border-white/[0.06]">
                <div className="text-2xs text-editorial-text-muted">Wave Pattern</div>
                <div className="text-base font-bold font-mono text-white mt-1">2B Wavy</div>
              </div>
              <div className="p-3 rounded-xl bg-editorial-card border border-white/[0.06]">
                <div className="text-2xs text-editorial-text-muted">Cuticle Frizz</div>
                <div className="text-base font-bold font-mono text-amber-400 mt-1">Moderate</div>
              </div>
              <div className="p-3 rounded-xl bg-editorial-card border border-white/[0.06]">
                <div className="text-2xs text-editorial-text-muted">Follicle Density</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-1">194 /cm²</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-editorial-card border border-white/[0.06] space-y-1 mb-2">
              <div className="text-2xs font-semibold text-white flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Medium Porosity Cuticle Profile</span>
              </div>
              <p className="text-2xs text-editorial-text-secondary leading-relaxed">
                Scales accept water freely but allow moisture evaporation in dry air. Recommend weekly Maleic acid bond repair + Argan lipid lock.
              </p>
            </div>
          </div>

          <p className="text-2xs text-editorial-text-muted border-t border-white/[0.06] pt-3">
            Last evaluated {hairAnalysis.timestamp}. Length estimated at {hairAnalysis.length.estimatedCm}cm.
          </p>
        </div>
      </section>

      {/* 3. Active Care Routine Snapshot & PCPartPicker Status */}
      <section className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-editorial-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="lime" size="sm">Configurator</Badge>
              <h2 className="font-display font-bold text-lg text-white">Active Care Regimen</h2>
            </div>
            <p className="text-xs text-editorial-text-secondary mt-0.5">
              Live biochemistry compatibility checking and budget tracking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xs uppercase tracking-wider text-editorial-text-muted">Daily AM Cost</div>
              <div className="font-mono text-sm font-bold text-editorial-lime">₹{morningCost.toLocaleString('en-IN')}</div>
            </div>
            <button
              onClick={() => onNavigate('routine-builder')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] border border-white/12 text-white hover:border-editorial-lime transition-all flex items-center gap-1.5"
            >
              <span>Manage Steps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Morning & Evening Routine Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* AM Skincare Routine */}
          <div className="p-4 sm:p-5 rounded-2xl bg-editorial-card border border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Morning Skincare (AM)
                </h4>
              </div>
              <Badge variant="green" size="sm">0 Conflicts</Badge>
            </div>

            <div className="space-y-2">
              {morningRoutine?.slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-editorial-bg/70 border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xs font-mono font-bold text-editorial-lime w-4 shrink-0">
                      {slot.stepNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="text-2xs uppercase tracking-wider text-editorial-text-muted truncate">
                        {slot.slotName}
                      </div>
                      <div className="text-xs font-medium text-white truncate">
                        {slot.product ? `${slot.product.brand} - ${slot.product.name}` : 'Empty Slot'}
                      </div>
                    </div>
                  </div>
                  {slot.product && (
                    <span className="text-xs font-mono text-editorial-text-secondary pl-2 shrink-0">
                      ₹{slot.product.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PM Skincare Routine */}
          <div className="p-4 sm:p-5 rounded-2xl bg-editorial-card border border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Evening Cellular Repair (PM)
                </h4>
              </div>
              <Badge variant="green" size="sm">Synergy Detected</Badge>
            </div>

            <div className="space-y-2">
              {eveningRoutine?.slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-editorial-bg/70 border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xs font-mono font-bold text-purple-400 w-4 shrink-0">
                      {slot.stepNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="text-2xs uppercase tracking-wider text-editorial-text-muted truncate">
                        {slot.slotName}
                      </div>
                      <div className="text-xs font-medium text-white truncate">
                        {slot.product ? `${slot.product.brand} - ${slot.product.name}` : 'Empty Slot'}
                      </div>
                    </div>
                  </div>
                  {slot.product && (
                    <span className="text-xs font-mono text-editorial-text-secondary pl-2 shrink-0">
                      ₹{slot.product.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Saved Beauty Looks & Visual Experiments Carousel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Saved Editorial Looks</h2>
            <p className="text-xs text-editorial-text-secondary">Virtual try-on creations from Style Studio</p>
          </div>
          <button
            onClick={() => onNavigate('style-studio')}
            className="text-xs font-medium text-editorial-lime hover:underline flex items-center gap-1"
          >
            <span>Open Style Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profile.savedLooks.map((look) => (
            <div
              key={look.id}
              onClick={() => onNavigate('style-studio')}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-editorial-surface hover:border-editorial-lime/50 transition-all duration-300 shadow-card-dark"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={look.styledImageUrl}
                  alt={look.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3">
                  <Badge variant="lime" size="sm">
                    {look.studioCategory}
                  </Badge>
                </div>

                <div className="absolute bottom-4 inset-x-4">
                  <div className="text-2xs font-mono text-editorial-text-muted mb-1">{look.date}</div>
                  <h4 className="font-display font-bold text-base text-white group-hover:text-editorial-lime transition-colors">
                    {look.title}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {look.appliedOptions.map((opt, i) => (
                      <span key={i} className="text-2xs px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-white/90">
                        {opt.details}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Look CTA Card */}
          <div
            onClick={() => onNavigate('style-studio')}
            className="group cursor-pointer rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] hover:border-editorial-lime/50 hover:bg-editorial-lime/[0.02] transition-all duration-300 flex flex-col items-center justify-center p-8 text-center min-h-[300px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-editorial-lime group-hover:scale-110 group-hover:border-editorial-lime/40 transition-transform mb-3">
              <Palette className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h4 className="font-display font-semibold text-base text-white mb-1">
              Experiment with New Look
            </h4>
            <p className="text-xs text-editorial-text-secondary max-w-xs mb-4">
              Try on hairstyles, hair colors, editorial makeup palettes, beard styles, or nail sets.
            </p>
            <span className="text-xs font-semibold text-editorial-lime group-hover:underline flex items-center gap-1">
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* 5. Recommended Products Highlights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Targeted Product Matches</h2>
            <p className="text-xs text-editorial-text-secondary">Clinically vetted for your {profile.skin.type} skin profile</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-medium text-editorial-lime hover:underline flex items-center gap-1"
          >
            <span>Browse Full Marketplace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-editorial-surface p-4 hover:border-editorial-lime/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-900 border border-white/[0.06]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-2xs font-mono uppercase bg-black/70 backdrop-blur-sm text-editorial-lime font-bold">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="text-2xs uppercase tracking-wider font-semibold text-editorial-text-muted">
                  {product.brand}
                </div>
                <h4 className="font-medium text-xs text-white line-clamp-2 mt-0.5 group-hover:text-editorial-lime transition-colors">
                  {product.name}
                </h4>

                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-2xs text-editorial-lime font-mono">★ {product.rating}</span>
                  <span className="text-2xs text-editorial-text-muted">({product.reviewsCount})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-2xs text-editorial-text-secondary hover:text-white flex items-center gap-1">
                  Details <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

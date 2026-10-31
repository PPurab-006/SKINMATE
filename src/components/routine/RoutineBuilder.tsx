import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Trash2, 
  ArrowLeftRight, 
  Sun, 
  Moon, 
  Scissors, 
  UserCheck, 
  Save, 
  Coins, 
  Zap,
  Info,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { Routine, RoutineKind, RoutineSlot } from '../../types/routine';
import { Product } from '../../types/product';
import { ProductImage } from '../common/ProductImage';
import { analyzeRoutineCompatibility } from '../../data/rules/ingredientRules';
import { RecommendationEngine } from '../../services/recommendationEngine';
import { ProductSubstitutionModal } from './ProductSubstitutionModal';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface RoutineBuilderProps {
  initialRoutines: Routine[];
  onSaveRoutines: (routines: Routine[]) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const RoutineBuilder: React.FC<RoutineBuilderProps> = ({
  initialRoutines,
  onSaveRoutines,
  onOpenProductDetails
}) => {
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines);
  const [activeKind, setActiveKind] = useState<RoutineKind>('morning-skin');
  const [substitutingSlot, setSubstitutingSlot] = useState<RoutineSlot | null>(null);
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeRoutine = routines.find(r => r.kind === activeKind) || routines[0];

  // Active products in the routine
  const activeProducts = useMemo(() => {
    return activeRoutine.slots
      .map(s => s.product)
      .filter((p): p is Product => p !== null);
  }, [activeRoutine]);

  // Total cost
  const totalCost = useMemo(() => {
    return activeProducts.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }, [activeProducts]);

  const budgetDelta = activeRoutine.targetBudget - totalCost;
  const percentageUsed = Math.min(100, Math.round((totalCost / activeRoutine.targetBudget) * 100));
  const isOverBudget = totalCost > activeRoutine.targetBudget;

  // Formula harmony & compatibility
  const compatibility = useMemo(() => {
    return analyzeRoutineCompatibility(activeProducts);
  }, [activeProducts]);

  // Update slot product
  const handleUpdateSlotProduct = (slotId: string, newProduct: Product | null) => {
    setRoutines(prev => prev.map(r => {
      if (r.kind !== activeKind) return r;
      return {
        ...r,
        slots: r.slots.map(s => s.id === slotId ? { ...s, product: newProduct } : s)
      };
    }));
  };

  // Adjust target budget
  const handleTargetBudgetChange = (newTarget: number) => {
    setRoutines(prev => prev.map(r => {
      if (r.kind !== activeKind) return r;
      return { ...r, targetBudget: newTarget };
    }));
  };

  // Smart budget optimization
  const handleOptimizeBudget = () => {
    const optimizations = RecommendationEngine.suggestBudgetOptimizations(
      activeRoutine.slots,
      activeRoutine.targetBudget
    );

    if (optimizations.length === 0) {
      setToastMessage('Your ritual is already well-balanced for formulation efficacy and budget.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setRoutines(prev => prev.map(r => {
      if (r.kind !== activeKind) return r;
      let updatedSlots = [...r.slots];
      for (const opt of optimizations) {
        updatedSlots = updatedSlots.map(s => 
          s.id === opt.slotId ? { ...s, product: opt.suggestedSwap } : s
        );
      }
      return { ...r, slots: updatedSlots };
    }));

    const totalSaved = optimizations.reduce((sum, o) => sum + o.savingsInr, 0);
    setToastMessage(`Saved ₹${totalSaved.toLocaleString('en-IN')} by swapping ${optimizations.length} items with gentler price points.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAll = () => {
    onSaveRoutines(routines);
    setToastMessage('Your personalized care ritual has been saved!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-beauty-muted-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-2xs font-semibold uppercase tracking-widest text-beauty-sage">
              Personal Vanity &amp; Care Configurator
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-beauty-charcoal font-normal tracking-tight">
            My Care Routine
          </h1>
          <p className="text-sm text-beauty-muted mt-2 max-w-xl">
            Curate your daily rituals step by step. Balance complementary ingredients, customize your budget, and refine formulas that make your skin feel its best.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            className="px-6 py-3 rounded-full font-medium text-xs bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest/90 shadow-beauty-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Routine</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-beauty-cream border border-beauty-sage/40 text-xs text-beauty-forest flex items-center gap-2.5 shadow-beauty-sm">
          <Sparkles className="w-4 h-4 text-beauty-forest shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Routine Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-beauty-cream/80 border border-beauty-muted-border overflow-x-auto">
        <button
          onClick={() => setActiveKind('morning-skin')}
          className={`px-5 py-2.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeKind === 'morning-skin' 
              ? 'bg-white text-beauty-forest font-semibold shadow-beauty-sm' 
              : 'text-beauty-muted hover:text-beauty-charcoal'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>Morning Skincare (AM)</span>
        </button>

        <button
          onClick={() => setActiveKind('evening-skin')}
          className={`px-5 py-2.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeKind === 'evening-skin' 
              ? 'bg-white text-beauty-forest font-semibold shadow-beauty-sm' 
              : 'text-beauty-muted hover:text-beauty-charcoal'
          }`}
        >
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
          <span>Evening Skincare (PM)</span>
        </button>

        <button
          onClick={() => setActiveKind('haircare')}
          className={`px-5 py-2.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeKind === 'haircare' 
              ? 'bg-white text-beauty-forest font-semibold shadow-beauty-sm' 
              : 'text-beauty-muted hover:text-beauty-charcoal'
          }`}
        >
          <Scissors className="w-3.5 h-3.5 text-beauty-forest" />
          <span>Haircare Regimen</span>
        </button>

        <button
          onClick={() => setActiveKind('grooming')}
          className={`px-5 py-2.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeKind === 'grooming' 
              ? 'bg-white text-beauty-forest font-semibold shadow-beauty-sm' 
              : 'text-beauty-muted hover:text-beauty-charcoal'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-beauty-forest" />
          <span>Grooming &amp; Beard</span>
        </button>
      </div>

      {/* Routine Overview Panel (Budget & Harmony) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-beauty-muted-border shadow-beauty-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Target Budget Controller */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-2xs uppercase tracking-wider text-beauty-muted font-medium flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-beauty-forest" />
                Target Budget Limit
              </span>
              <span className="font-serif text-base font-medium text-beauty-charcoal">
                ₹{activeRoutine.targetBudget.toLocaleString('en-IN')}
              </span>
            </div>

            <input
              type="range"
              min="1000"
              max="10000"
              step="250"
              value={activeRoutine.targetBudget}
              onChange={(e) => handleTargetBudgetChange(Number(e.target.value))}
              className="w-full accent-beauty-forest h-1.5 bg-beauty-cream rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-beauty-muted">
              <span>₹1,000 (Minimal)</span>
              <span>₹5,000 (Balanced)</span>
              <span>₹10,000 (Luxe)</span>
            </div>
          </div>

          {/* Current Total Calculation */}
          <div className="md:col-span-4 p-4 rounded-2xl bg-beauty-cream/50 border border-beauty-muted-border/60 flex items-center justify-between">
            <div>
              <span className="text-2xs uppercase tracking-wider text-beauty-muted font-medium">
                Ritual Total Cost
              </span>
              <div className="font-serif text-2xl font-normal text-beauty-charcoal mt-0.5">
                ₹{totalCost.toLocaleString('en-IN')}
              </div>
              <div className={`text-2xs mt-0.5 font-medium ${isOverBudget ? 'text-rose-600' : 'text-beauty-forest'}`}>
                {isOverBudget 
                  ? `₹${Math.abs(budgetDelta).toLocaleString('en-IN')} above target` 
                  : `₹${budgetDelta.toLocaleString('en-IN')} remaining within budget`}
              </div>
            </div>

            {isOverBudget && (
              <button
                onClick={handleOptimizeBudget}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-beauty-forest text-beauty-ivory hover:bg-beauty-forest/90 flex items-center gap-1.5 shrink-0 transition-all shadow-beauty-sm"
              >
                <Zap className="w-3 h-3 text-beauty-lime" />
                <span>Optimize Cost</span>
              </button>
            )}
          </div>

          {/* Compatibility Pill & Harmony Modal Trigger */}
          <div className="md:col-span-3">
            <button
              onClick={() => setIsCompatibilityModalOpen(true)}
              className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                compatibility.overallStatus === 'conflict'
                  ? 'border-rose-300 bg-rose-50/70 hover:border-rose-400'
                  : compatibility.overallStatus === 'caution'
                  ? 'border-amber-300 bg-amber-50/70 hover:border-amber-400'
                  : 'border-beauty-muted-border bg-beauty-cream/50 hover:border-beauty-sage'
              }`}
            >
              <div>
                <span className="text-2xs uppercase tracking-wider text-beauty-muted font-medium">
                  Formula Harmony
                </span>
                <div className={`text-sm font-serif font-medium mt-0.5 ${
                  compatibility.overallStatus === 'conflict' ? 'text-rose-700' : compatibility.overallStatus === 'caution' ? 'text-amber-800' : 'text-beauty-forest'
                }`}>
                  {compatibility.overallStatus === 'conflict' 
                    ? 'Caution Flag' 
                    : compatibility.overallStatus === 'caution' 
                    ? 'Gentle Suggestion' 
                    : 'Harmonious Pairing'}
                </div>
                <div className="text-2xs text-beauty-muted mt-0.5">
                  {compatibility.reports.length === 0 ? 'All steps complementary' : `${compatibility.reports.length} pairing notes`}
                </div>
              </div>
              <Info className="w-4 h-4 text-beauty-muted group-hover:text-beauty-forest transition-colors shrink-0" />
            </button>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-beauty-cream overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-rose-500' : percentageUsed > 85 ? 'bg-amber-500' : 'bg-beauty-forest'
            }`}
            style={{ width: `${Math.min(100, percentageUsed)}%` }}
          />
        </div>
      </div>

      {/* Routine Slots List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-beauty-charcoal font-medium">
            Ritual Sequence ({activeRoutine.slots.length} Steps)
          </h2>
          <span className="text-xs text-beauty-muted">
            Tap &lsquo;Replace&rsquo; on any item to explore alternative formulations and price differences
          </span>
        </div>

        <div className="space-y-3.5">
          {activeRoutine.slots.map((slot) => {
            const product = slot.product;
            return (
              <div
                key={slot.id}
                className="p-5 rounded-2xl bg-white border border-beauty-muted-border hover:border-beauty-sage transition-all shadow-beauty-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Step Number & Category Info */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-beauty-cream border border-beauty-muted-border flex items-center justify-center font-serif text-sm font-medium text-beauty-forest shrink-0">
                    0{slot.stepNumber}
                  </div>

                  {product ? (
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        onClick={() => onOpenProductDetails(product)}
                        className="w-16 h-16 rounded-xl overflow-hidden border border-beauty-muted-border cursor-pointer hover:border-beauty-forest transition-colors shrink-0 bg-white"
                      >
                        <ProductImage
                          product={product}
                          className="w-full h-full"
                          imageClassName="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-2xs uppercase tracking-wider text-beauty-muted font-medium">
                            {slot.slotName}
                          </span>
                          <span className="text-beauty-muted">•</span>
                          <span className="text-2xs font-semibold text-beauty-sage uppercase tracking-wider">
                            {product.brand}
                          </span>
                        </div>
                        <h3
                          onClick={() => onOpenProductDetails(product)}
                          className="font-serif text-base text-beauty-charcoal font-normal truncate cursor-pointer hover:text-beauty-forest transition-colors mt-0.5"
                        >
                          {product.name}
                        </h3>
                        <div className="text-xs text-beauty-muted mt-1 truncate">
                          Key Actives: {product.keyActives.join(', ')} ({product.size})
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xs uppercase tracking-wider text-beauty-muted font-medium">
                        {slot.slotName}
                      </div>
                      <div className="text-xs text-beauty-muted italic mt-1">
                        Step unassigned. Select a gentle, compatible formula to complete this slot.
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Price & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-beauty-muted-border">
                  {product && (
                    <span className="font-serif text-base font-medium text-beauty-charcoal shrink-0 pr-2">
                      {product.price !== null && product.price !== undefined
                        ? `₹${product.price.toLocaleString('en-IN')}`
                        : 'Price on Google'}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {product && (
                      <button
                        onClick={() => onOpenProductDetails(product)}
                        title="View formulation & ingredients"
                        className="p-2 rounded-xl text-beauty-muted hover:text-beauty-forest hover:bg-beauty-cream transition-colors border border-transparent hover:border-beauty-muted-border"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => setSubstitutingSlot(slot)}
                      className="px-4 py-2 rounded-xl text-xs font-medium bg-beauty-cream hover:bg-beauty-forest hover:text-beauty-ivory text-beauty-forest border border-beauty-muted-border transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>{product ? 'Replace' : 'Add Formula'}</span>
                    </button>

                    {product && (
                      <button
                        onClick={() => handleUpdateSlotProduct(slot.id, null)}
                        title="Remove product from ritual"
                        className="p-2 rounded-xl text-beauty-muted hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Substitution / Replacement Modal */}
      <ProductSubstitutionModal
        isOpen={substitutingSlot !== null}
        onClose={() => setSubstitutingSlot(null)}
        slot={substitutingSlot}
        currentProduct={substitutingSlot?.product || null}
        onSelectProduct={(newProd) => {
          if (substitutingSlot) {
            handleUpdateSlotProduct(substitutingSlot.id, newProd);
          }
        }}
      />

      {/* Formula Harmony & Compatibility Modal */}
      <Modal
        isOpen={isCompatibilityModalOpen}
        onClose={() => setIsCompatibilityModalOpen(false)}
        title="Formula Harmony & Pairing Notes"
        subtitle="Insights into how your active ingredients work together"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          {compatibility.reports.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-beauty-forest mx-auto" />
              <h4 className="font-serif text-base text-beauty-charcoal font-medium">Harmonious Pairing</h4>
              <p className="text-xs text-beauty-muted max-w-sm mx-auto">
                No active ingredient conflicts detected in this routine. Your skin barrier should feel comfortable and balanced.
              </p>
            </div>
          ) : (
            compatibility.reports.map((report) => (
              <div
                key={report.id}
                className={`p-4 rounded-2xl border space-y-2 ${
                  report.level === 'conflict'
                    ? 'border-rose-200 bg-rose-50/60'
                    : report.level === 'caution'
                    ? 'border-amber-200 bg-amber-50/60'
                    : 'border-beauty-muted-border bg-beauty-cream/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      report.level === 'conflict' ? 'bg-rose-500' : report.level === 'caution' ? 'bg-amber-500' : 'bg-beauty-forest'
                    }`} />
                    <h4 className="text-xs font-semibold text-beauty-charcoal uppercase tracking-wider">
                      {report.ruleTitle}
                    </h4>
                  </div>
                  <Badge variant={report.level === 'conflict' ? 'neutral' : report.level === 'caution' ? 'cream' : 'forest'} size="sm">
                    {report.level === 'conflict' ? 'Note' : report.level === 'caution' ? 'Suggestion' : 'Harmonious'}
                  </Badge>
                </div>

                <p className="text-xs text-beauty-charcoal/80 leading-relaxed">
                  {report.scientificReason}
                </p>

                <div className="pt-2 border-t border-beauty-muted-border/60 text-xs text-beauty-forest font-medium">
                  <span>Care Recommendation: </span>
                  <span className="text-beauty-charcoal font-normal">{report.recommendation}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

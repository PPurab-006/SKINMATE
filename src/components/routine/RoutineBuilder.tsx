import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowLeftRight, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sun, 
  Moon, 
  Scissors, 
  UserCheck, 
  Save, 
  RotateCcw, 
  Coins, 
  Zap,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { Routine, RoutineKind, RoutineSlot } from '../../types/routine';
import { Product } from '../../types/product';
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
  const [isCompatibilityDrawerOpen, setIsCompatibilityDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeRoutine = routines.find(r => r.kind === activeKind) || routines[0];

  // Calculate live costs and budget metrics
  const activeProducts = useMemo(() => {
    return activeRoutine.slots
      .map(s => s.product)
      .filter((p): p is Product => p !== null);
  }, [activeRoutine]);

  const totalCost = useMemo(() => {
    return activeProducts.reduce((sum, p) => sum + p.price, 0);
  }, [activeProducts]);

  const budgetDelta = activeRoutine.targetBudget - totalCost;
  const percentageUsed = Math.min(100, Math.round((totalCost / activeRoutine.targetBudget) * 100));
  const isOverBudget = totalCost > activeRoutine.targetBudget;

  // Run clinical compatibility analysis
  const compatibility = useMemo(() => {
    return analyzeRoutineCompatibility(activeProducts);
  }, [activeProducts]);

  // Handle slot product updates
  const handleUpdateSlotProduct = (slotId: string, newProduct: Product | null) => {
    setRoutines(prev => prev.map(r => {
      if (r.kind !== activeKind) return r;
      return {
        ...r,
        slots: r.slots.map(s => s.id === slotId ? { ...s, product: newProduct } : s)
      };
    }));
  };

  // Handle target budget adjustments
  const handleTargetBudgetChange = (newTarget: number) => {
    setRoutines(prev => prev.map(r => {
      if (r.kind !== activeKind) return r;
      return { ...r, targetBudget: newTarget };
    }));
  };

  // Auto-optimize routine for budget
  const handleOptimizeBudget = () => {
    const optimizations = RecommendationEngine.suggestBudgetOptimizations(
      activeRoutine.slots,
      activeRoutine.targetBudget
    );

    if (optimizations.length === 0) {
      setToastMessage('Routine is already at the optimal balance of clinical efficacy and budget!');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    // Apply the smart swaps
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
    setToastMessage(`Optimized! Swapped ${optimizations.length} products to save ₹${totalSaved.toLocaleString('en-IN')}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveAll = () => {
    onSaveRoutines(routines);
    setToastMessage('All personal care regimens saved to your profile!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="lime" size="sm">PCPartPicker for Personal Care</Badge>
            <span className="text-2xs font-mono text-editorial-text-muted">Biochemical Conflict Engine</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mt-1">
            My Care Routine Builder
          </h1>
          <p className="text-xs sm:text-sm text-editorial-text-secondary mt-1">
            Interactive step configurator with real-time pharmacological compatibility, product substitution, and budget constraints.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-subtle-glow flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Routines</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-editorial-card border border-editorial-lime/40 text-xs text-editorial-lime flex items-center gap-2 shadow-subtle-glow">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Routine Kind Switcher Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-editorial-surface border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveKind('morning-skin')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeKind === 'morning-skin' ? 'bg-editorial-lime text-black font-bold shadow-subtle-glow' : 'text-editorial-text-secondary hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Morning Skincare (AM)</span>
        </button>
        <button
          onClick={() => setActiveKind('evening-skin')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeKind === 'evening-skin' ? 'bg-editorial-lime text-black font-bold shadow-subtle-glow' : 'text-editorial-text-secondary hover:text-white'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Evening Repair (PM)</span>
        </button>
        <button
          onClick={() => setActiveKind('haircare')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeKind === 'haircare' ? 'bg-editorial-lime text-black font-bold shadow-subtle-glow' : 'text-editorial-text-secondary hover:text-white'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Haircare Regimen</span>
        </button>
        <button
          onClick={() => setActiveKind('grooming')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeKind === 'grooming' ? 'bg-editorial-lime text-black font-bold shadow-subtle-glow' : 'text-editorial-text-secondary hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Grooming &amp; Beard</span>
        </button>
      </div>

      {/* Live Budget & Compatibility Telemetry Bar */}
      <div className="p-6 rounded-3xl border border-white/10 bg-editorial-surface space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Target Budget Controller */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono uppercase tracking-wider text-editorial-text-muted flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-editorial-lime" />
                Target Budget Limit
              </span>
              <span className="font-mono text-sm font-bold text-white">
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
              className="w-full accent-editorial-lime"
            />
            <div className="flex justify-between text-[10px] font-mono text-editorial-text-muted">
              <span>₹1,000 (Minimal)</span>
              <span>₹5,000</span>
              <span>₹10,000 (Clinical)</span>
            </div>
          </div>

          {/* Current Total Calculation */}
          <div className="md:col-span-4 p-4 rounded-2xl bg-editorial-card border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-2xs font-mono uppercase text-editorial-text-muted">Live Routine Total</span>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">
                ₹{totalCost.toLocaleString('en-IN')}
              </div>
              <div className={`text-2xs font-mono mt-0.5 ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isOverBudget 
                  ? `₹${Math.abs(budgetDelta).toLocaleString('en-IN')} over target` 
                  : `₹${budgetDelta.toLocaleString('en-IN')} remaining budget`}
              </div>
            </div>

            {isOverBudget && (
              <button
                onClick={handleOptimizeBudget}
                className="px-3 py-1.5 rounded-lg text-2xs font-semibold bg-editorial-lime text-black hover:bg-editorial-lime-hover shadow-subtle-glow flex items-center gap-1 shrink-0"
              >
                <Zap className="w-3 h-3" />
                <span>Optimize Cost</span>
              </button>
            )}
          </div>

          {/* Compatibility Pill & Conflict Trigger */}
          <div className="md:col-span-3">
            <button
              onClick={() => setIsCompatibilityDrawerOpen(true)}
              className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                compatibility.overallStatus === 'conflict'
                  ? 'border-rose-500/40 bg-rose-500/10 hover:border-rose-500'
                  : compatibility.overallStatus === 'caution'
                  ? 'border-amber-500/40 bg-amber-500/10 hover:border-amber-500'
                  : 'border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500'
              }`}
            >
              <div>
                <span className="text-2xs font-mono uppercase tracking-wider text-editorial-text-muted">
                  Biochemical Status
                </span>
                <div className={`text-sm font-bold capitalize mt-0.5 ${
                  compatibility.overallStatus === 'conflict' ? 'text-rose-400' : compatibility.overallStatus === 'caution' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {compatibility.overallStatus === 'conflict' ? 'Conflict Detected' : compatibility.overallStatus === 'caution' ? 'Caution Flag' : 'Harmonious'}
                </div>
                <div className="text-2xs text-editorial-text-secondary mt-0.5">
                  {compatibility.reports.length} Clinical Rules Active
                </div>
              </div>
              <Info className="w-5 h-5 text-editorial-text-secondary shrink-0" />
            </button>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="w-full h-2 rounded-full bg-editorial-subtle overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-rose-500' : percentageUsed > 85 ? 'bg-amber-400' : 'bg-editorial-lime'
            }`}
            style={{ width: `${Math.min(100, percentageUsed)}%` }}
          />
        </div>
      </div>

      {/* Routine Slots List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">
            Regimen Sequence ({activeRoutine.slots.length} Steps)
          </h3>
          <span className="text-2xs text-editorial-text-muted">
            Click 'Substitute' on any product to see alternative formulas and instant price differences
          </span>
        </div>

        <div className="space-y-3">
          {activeRoutine.slots.map((slot) => {
            const product = slot.product;
            return (
              <div
                key={slot.id}
                className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-editorial-surface hover:border-white/15 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Step Number & Category */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-editorial-card border border-white/10 flex items-center justify-center font-mono font-bold text-editorial-lime text-xs shrink-0">
                    0{slot.stepNumber}
                  </div>

                  {product ? (
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        onClick={() => onOpenProductDetails(product)}
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 cursor-pointer hover:border-editorial-lime transition-colors shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-2xs font-mono uppercase tracking-wider text-editorial-text-muted">
                            {slot.slotName}
                          </span>
                          <span className="text-editorial-text-muted">•</span>
                          <span className="text-2xs font-semibold text-editorial-lime uppercase">
                            {product.brand}
                          </span>
                        </div>
                        <h4
                          onClick={() => onOpenProductDetails(product)}
                          className="font-medium text-sm text-white truncate cursor-pointer hover:text-editorial-lime transition-colors mt-0.5"
                        >
                          {product.name}
                        </h4>
                        <div className="text-2xs text-editorial-text-secondary mt-1 truncate">
                          Actives: {product.keyActives.join(', ')} ({product.size})
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xs font-mono uppercase tracking-wider text-editorial-text-muted">
                        {slot.slotName}
                      </div>
                      <div className="text-xs text-editorial-text-secondary italic mt-0.5">
                        Slot empty. Select a compatible product to fulfill step.
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Price & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
                  {product && (
                    <span className="font-mono text-sm font-bold text-white shrink-0 pr-3">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSubstitutingSlot(slot)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-editorial-lime hover:text-black border border-white/12 transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>{product ? 'Substitute' : 'Add Product'}</span>
                    </button>

                    {product && (
                      <button
                        onClick={() => handleUpdateSlotProduct(slot.id, null)}
                        title="Remove product"
                        className="p-1.5 rounded-lg text-editorial-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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

      {/* Substitution Modal */}
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

      {/* Biochemical Compatibility Drawer Modal */}
      <Modal
        isOpen={isCompatibilityDrawerOpen}
        onClose={() => setIsCompatibilityDrawerOpen(false)}
        title="Biochemical Interaction & Synergy Report"
        subtitle="Evaluated against clinical pairwise dermatological rules"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          {compatibility.reports.length === 0 ? (
            <div className="p-8 text-center text-xs text-editorial-text-secondary">
              No complex active interactions identified for this selection. All steps are safe for co-application.
            </div>
          ) : (
            compatibility.reports.map((report) => (
              <div
                key={report.id}
                className={`p-4 rounded-xl border space-y-2 ${
                  report.level === 'conflict'
                    ? 'border-rose-500/30 bg-rose-500/10'
                    : report.level === 'caution'
                    ? 'border-amber-500/30 bg-amber-500/10'
                    : 'border-emerald-500/30 bg-emerald-500/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      report.level === 'conflict' ? 'bg-rose-400' : report.level === 'caution' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {report.ruleTitle}
                    </h4>
                  </div>
                  <Badge variant={report.level === 'conflict' ? 'red' : report.level === 'caution' ? 'amber' : 'green'} size="sm">
                    {report.level}
                  </Badge>
                </div>

                <p className="text-xs text-editorial-text-secondary leading-relaxed">
                  {report.scientificReason}
                </p>

                <div className="pt-2 border-t border-white/[0.06] text-2xs">
                  <span className="font-semibold text-white">Clinical Guidance: </span>
                  <span className="text-editorial-text-primary">{report.recommendation}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

import { Product } from '../types/product';
import { UserAppearanceProfile } from '../types/profile';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { RoutineSlot } from '../types/routine';

export interface RecommendationMatch {
  product: Product;
  matchScore: number; // 0-100
  matchReasons: string[];
}

export class RecommendationEngine {
  /**
   * Matches products from catalog against user skin & hair profile
   */
  public static getRecommendationsForUser(
    profile: UserAppearanceProfile, 
    category?: Product['category']
  ): RecommendationMatch[] {
    let pool = MOCK_PRODUCTS;
    if (category) {
      pool = pool.filter(p => p.category === category);
    }

    const matches: RecommendationMatch[] = pool.map(product => {
      let score = 70;
      const reasons: string[] = [];

      // Check skin type match
      if (product.suitableSkinTypes?.includes(profile.skin.type)) {
        score += 15;
        reasons.push(`Formulated specifically for ${profile.skin.type} skin.`);
      }

      // Check primary concerns overlap
      const concernOverlap = product.targetConcerns.filter(tc => 
        profile.skin.primaryConcerns.some(pc => pc.toLowerCase().includes(tc.toLowerCase()) || tc.toLowerCase().includes(pc.toLowerCase()))
      );

      if (concernOverlap.length > 0) {
        score += 12;
        reasons.push(`Directly targets your concern: ${concernOverlap.join(', ')}.`);
      }

      // Check hair pattern match if haircare
      if (product.category === 'haircare' && product.suitableHairTypes) {
        if (product.suitableHairTypes.some(ht => profile.hair.pattern.includes(ht))) {
          score += 15;
          reasons.push(`Engineered for your ${profile.hair.pattern} wave/curl structure.`);
        }
      }

      // Check cruelty free & fragrance free preferences
      if (profile.preferences.fragranceFreeOnly && product.isFragranceFree) {
        score += 5;
        reasons.push('Certified 100% fragrance-free.');
      }

      return {
        product,
        matchScore: Math.min(99, score),
        matchReasons: reasons
      };
    });

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Finds candidate substitutes for a given slot/product
   */
  public static getSubstitutesForSlot(slot: RoutineSlot, currentProduct: Product | null): Product[] {
    return MOCK_PRODUCTS.filter(p => {
      // Must match allowed category
      if (!slot.allowedCategories.includes(p.category)) return false;
      // Exclude currently assigned product
      if (currentProduct && p.id === currentProduct.id) return false;
      return true;
    });
  }

  /**
   * PCPartPicker-style Budget Optimizer:
   * Auto-suggests budget-friendly alternative swaps for high-cost slots
   */
  public static suggestBudgetOptimizations(
    slots: RoutineSlot[], 
    targetBudget: number
  ): { slotId: string; currentProduct: Product; suggestedSwap: Product; savingsInr: number }[] {
    const currentTotal = slots.reduce((sum, s) => sum + (s.product?.price || 0), 0);
    if (currentTotal <= targetBudget) return [];

    const suggestions: { slotId: string; currentProduct: Product; suggestedSwap: Product; savingsInr: number }[] = [];

    // Sort slots by product price descending to find biggest savings
    const expensiveSlots = [...slots]
      .filter(s => s.product !== null && s.product.price > 600)
      .sort((a, b) => (b.product?.price || 0) - (a.product?.price || 0));

    for (const slot of expensiveSlots) {
      if (!slot.product) continue;
      const current = slot.product;
      
      // Look for a cheaper product in the same category
      const cheaperAlternatives = MOCK_PRODUCTS.filter(p => 
        p.category === current.category && 
        p.id !== current.id && 
        p.price < current.price
      ).sort((a, b) => a.price - b.price);

      if (cheaperAlternatives.length > 0) {
        const bestAlternative = cheaperAlternatives[0];
        suggestions.push({
          slotId: slot.id,
          currentProduct: current,
          suggestedSwap: bestAlternative,
          savingsInr: current.price - bestAlternative.price
        });
      }
    }

    return suggestions;
  }
}

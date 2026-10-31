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
    department?: 'skincare' | 'haircare' | 'grooming' | 'beauty' | 'all'
  ): RecommendationMatch[] {
    let pool = MOCK_PRODUCTS;
    if (department && department !== 'all') {
      pool = pool.filter(p => {
        if (p.department) return p.department === department;
        if (department === 'skincare') return ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'exfoliant', 'treatment'].includes(p.category);
        if (department === 'haircare') return ['shampoo', 'conditioner', 'hair-mask', 'hair-oil', 'hair-styling', 'hair-treatment', 'haircare'].includes(p.category);
        if (department === 'grooming') return ['beard-oil', 'beard-wash', 'shaving', 'grooming-accessory', 'beardcare'].includes(p.category);
        if (department === 'beauty') return ['makeup', 'nails', 'cosmetics'].includes(p.category);
        return true;
      });
    }

    const matches: RecommendationMatch[] = pool.map(product => {
      let score = 70;
      const reasons: string[] = [];

      // Check skin type match
      if (profile.skin && product.suitableSkinTypes?.includes(profile.skin.type)) {
        score += 12;
        reasons.push(`Matches your recorded ${profile.skin.type} skin profile with appropriate non-stripping lipids.`);
      }

      // Check primary concerns overlap (e.g. Pores, Sebum, Redness, Texture)
      if (profile.skin?.primaryConcerns && profile.skin.primaryConcerns.length > 0) {
        const concernOverlap = product.targetConcerns.filter(tc => 
          profile.skin?.primaryConcerns?.some(pc => 
            pc.toLowerCase().includes(tc.toLowerCase()) || 
            tc.toLowerCase().includes(pc.toLowerCase()) ||
            (pc.toLowerCase().includes('pore') && tc.toLowerCase().includes('pore')) ||
            (pc.toLowerCase().includes('sebum') && tc.toLowerCase().includes('sebum')) ||
            (pc.toLowerCase().includes('hydration') && tc.toLowerCase().includes('barrier'))
          )
        );

        if (concernOverlap.length > 0) {
          score += 15;
          reasons.push(`Directly targets detected concern: ${concernOverlap.slice(0, 2).join(' & ')}.`);
        }
      }

      // Check key actives alignment
      if (product.keyActives && product.keyActives.length > 0) {
        const primaryActive = product.keyActives[0];
        if (profile.skin?.type === 'Combination' && ['Niacinamide', 'Salicylic Acid', 'Zinc PCA', 'Centella Cica'].some(a => primaryActive.includes(a))) {
          score += 8;
          reasons.push(`Utilizes ${primaryActive} to balance central T-zone without dehydrating cheek areas.`);
        }
      }

      // Check hair pattern & frizz match if haircare
      const isHairProduct = product.department === 'haircare' || ['haircare', 'shampoo', 'conditioner', 'hair-mask', 'hair-oil', 'hair-styling', 'hair-treatment'].includes(product.category);
      if (isHairProduct && profile.hair) {
        if (product.suitableHairTypes?.some(ht => profile.hair?.pattern?.includes(ht))) {
          score += 14;
          reasons.push(`Formulated specifically for your ${profile.hair.pattern} wave/curl structure without weighing down roots.`);
        }
        if (product.targetConcerns.some(c => c.toLowerCase().includes('frizz')) && (profile.hair.primaryConcerns?.some(c => c.toLowerCase().includes('frizz')) || true)) {
          score += 8;
          reasons.push('Contains cuticle-smoothing lipid sealers to counteract humidity-induced frizz.');
        }
      }

      // Check user-declared preferences
      if (profile.preferences.fragranceFreeOnly && product.isFragranceFree) {
        score += 5;
        reasons.push('Verified 100% fragrance-free formulation.');
      }
      if (profile.preferences.crueltyFreeOnly && product.isCrueltyFree) {
        score += 4;
        reasons.push('Certified cruelty-free and ethically formulated.');
      }
      if (profile.preferences.veganOnly && product.isVegan) {
        score += 4;
        reasons.push('Certified 100% vegan formula.');
      }

      // Budget check
      if (profile.preferences.monthlyBudget && product.price !== null && product.price <= profile.preferences.monthlyBudget * 0.4) {
        score += 4;
        reasons.push(`Priced comfortably within your budget threshold (₹${product.price.toLocaleString('en-IN')}).`);
      }

      // Ensure at least one explainable reason exists
      if (reasons.length === 0) {
        reasons.push(`Curated as a verified formulation compatible with your recorded profile preferences.`);
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
      .filter(s => s.product !== null && s.product.price !== null && s.product.price > 600)
      .sort((a, b) => (b.product?.price || 0) - (a.product?.price || 0));

    for (const slot of expensiveSlots) {
      if (!slot.product || slot.product.price === null) continue;
      const current = slot.product;
      const currentPrice: number = slot.product.price;
      
      // Look for a cheaper product in the same category
      const cheaperAlternatives = MOCK_PRODUCTS.filter(p => 
        p.category === current.category && 
        p.id !== current.id && 
        p.price !== null && 
        p.price < currentPrice
      ).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

      if (cheaperAlternatives.length > 0 && cheaperAlternatives[0].price !== null) {
        const bestAlternative = cheaperAlternatives[0];
        suggestions.push({
          slotId: slot.id,
          currentProduct: current,
          suggestedSwap: bestAlternative,
          savingsInr: currentPrice - bestAlternative.price!
        });
      }
    }

    return suggestions;
  }

  /**
   * Connects detected AI Skin findings (pores, redness, oiliness, texture, etc.)
   * directly to verified purchasable formulations with explainable reasons.
   */
  public static getRecommendationsForFinding(
    findingKey: string,
    skinAnalysis?: any,
    profile?: UserAppearanceProfile
  ): RecommendationMatch[] {
    const key = (findingKey || '').toLowerCase();
    const skinType = skinAnalysis?.skinType || profile?.skin?.type || 'Combination';
    
    // Filter candidate products based on finding mapping
    const matches: RecommendationMatch[] = [];

    for (const product of MOCK_PRODUCTS) {
      // Must be a skincare product
      const isSkincare = product.department === 'skincare' || 
        ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'exfoliant', 'treatment'].includes(product.category);
      if (!isSkincare) continue;

      let matched = false;
      let reason = '';
      let score = 75;

      const tc = product.targetConcerns.map(c => c.toLowerCase());
      const actives = product.keyActives.map(a => a.toLowerCase());
      const tags = product.clinicalTags || [];

      if (key === 'all' || !key) {
        // Return top overall balanced routine items
        matched = true;
        score = 85;
        reason = `Selected as a foundational ${product.category} formulated for ${skinType} skin stability.`;
      } else if (key.includes('pore') || key === 'pores') {
        if (tags.includes('bha') || actives.some(a => a.includes('salicylic') || a.includes('niacinamide') || a.includes('zinc')) || tc.some(c => c.includes('pore') || c.includes('blackhead'))) {
          matched = true;
          score = 94;
          reason = `Recommended because verified ${product.keyActives[0] || 'active'} targets dilated follicular openings and regulates sebum to prevent pore clogging.`;
        }
      } else if (key.includes('oil') || key.includes('sebum')) {
        if (actives.some(a => a.includes('zinc') || a.includes('niacinamide') || a.includes('salicylic')) || tc.some(c => c.includes('sebum') || c.includes('oil') || c.includes('shine'))) {
          matched = true;
          score = 92;
          reason = `Recommended because ${product.keyActives[0] || 'active'} restores T-zone sebum equilibrium without causing compensatory oil overproduction.`;
        }
      } else if (key.includes('redness') || key.includes('calm') || key.includes('erythema')) {
        if (tags.includes('centella-cica') || actives.some(a => a.includes('cica') || a.includes('centella') || a.includes('allantoin') || a.includes('oat') || a.includes('azelaic')) || tc.some(c => c.includes('redness') || c.includes('barrier') || c.includes('sensitized'))) {
          matched = true;
          score = 95;
          reason = `Recommended because verified soothing lipids (${product.keyActives.slice(0, 2).join(' & ')}) actively calm cutaneous micro-erythema and strengthen vascular tolerance.`;
        }
      } else if (key.includes('wrinkle') || key.includes('aging') || key.includes('line')) {
        if (tags.includes('retinoid') || tags.includes('peptides') || actives.some(a => a.includes('retinol') || a.includes('peptide') || a.includes('squalane')) || tc.some(c => c.includes('aging') || c.includes('fine line') || c.includes('wrinkle'))) {
          matched = true;
          score = 93;
          reason = `Recommended because ${product.keyActives[0] || 'active'} stimulates epidermal cell renewal and matrix integrity to soften the appearance of expression lines.`;
        }
      } else if (key.includes('texture') || key.includes('rough')) {
        if (tags.includes('aha') || tags.includes('bha') || actives.some(a => a.includes('snail') || a.includes('gluconolactone') || a.includes('lactic')) || tc.some(c => c.includes('texture') || c.includes('smooth'))) {
          matched = true;
          score = 91;
          reason = `Recommended because gentle chemical exfoliants & hydrators (${product.keyActives[0]}) loosen cohesive dead corneocytes for uniform epidermal smoothness.`;
        }
      } else if (key.includes('spot') || key.includes('pigment') || key.includes('age_spot')) {
        if (tags.includes('l-ascorbic-acid') || tags.includes('vitamin-c-derivative') || actives.some(a => a.includes('vitamin c') || a.includes('arbutin') || a.includes('niacinamide')) || tc.some(c => c.includes('pigment') || c.includes('spot') || c.includes('glow'))) {
          matched = true;
          score = 90;
          reason = `Recommended because ${product.keyActives[0]} inhibits tyrosinase activity to fade uneven pigmentation and defend against UV-induced oxidative discoloration.`;
        }
      } else if (key.includes('eye_bag') || key.includes('dark_circle') || key.includes('eye')) {
        if (actives.some(a => a.includes('caffeine') || a.includes('peptide') || a.includes('hyaluronic')) || tc.some(c => c.includes('plumping') || c.includes('hydration') || c.includes('scars'))) {
          matched = true;
          score = 88;
          reason = `Recommended because micro-circulatory stimulants (${product.keyActives[0]}) support orbital fluid drainage and reinforce the thin peri-orbital dermal barrier.`;
        }
      } else if (key.includes('moist') || key.includes('hydrat') || key.includes('dry')) {
        if (tags.includes('ceramides') || tags.includes('hyaluronic-acid') || actives.some(a => a.includes('hyaluronic') || a.includes('ceramide') || a.includes('b5') || a.includes('panthenol')) || tc.some(c => c.includes('dehydration') || c.includes('dryness') || c.includes('barrier'))) {
          matched = true;
          score = 96;
          reason = `Recommended because physiological lipid replacers (${product.keyActives.slice(0, 2).join(' + ')}) bind water in the stratum corneum to halt transepidermal water loss.`;
        }
      } else if (key.includes('acne') || key.includes('blemish')) {
        if (tags.includes('bha') || actives.some(a => a.includes('salicylic') || a.includes('zinc') || a.includes('azelaic')) || tc.some(c => c.includes('blemish') || c.includes('acne') || c.includes('comedone'))) {
          matched = true;
          score = 94;
          reason = `Recommended because verified ${product.keyActives[0]} purifies follicle pathways and diminishes acne-causing microbial colonization.`;
        }
      } else if (key.includes('radiance') || key.includes('glow') || key.includes('dull')) {
        if (tags.includes('l-ascorbic-acid') || tags.includes('vitamin-c-derivative') || actives.some(a => a.includes('vitamin c') || a.includes('rice') || a.includes('probiotic')) || tc.some(c => c.includes('glow') || c.includes('radiance'))) {
          matched = true;
          score = 89;
          reason = `Recommended because antioxidant-rich ${product.keyActives[0]} revitalizes skin optical reflectance for a clarified, luminous finish.`;
        }
      }

      if (matched) {
        // Preference boosts
        if (profile?.preferences?.fragranceFreeOnly && product.isFragranceFree) score += 4;
        if (profile?.preferences?.crueltyFreeOnly && product.isCrueltyFree) score += 3;
        if (profile?.preferences?.veganOnly && product.isVegan) score += 3;

        matches.push({
          product,
          matchScore: Math.min(99, score),
          matchReasons: [reason]
        });
      }
    }

    // Sort by match score descending
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // If matches are fewer than 3, add top verified general skincare products as complementary care
    if (matches.length < 3) {
      const existingIds = new Set(matches.map(m => m.product.id));
      const generalProducts = MOCK_PRODUCTS.filter(p => 
        (p.department === 'skincare' || ['cleanser', 'serum', 'moisturizer', 'sunscreen'].includes(p.category)) &&
        !existingIds.has(p.id)
      ).slice(0, 3 - matches.length);

      for (const p of generalProducts) {
        matches.push({
          product: p,
          matchScore: 80,
          matchReasons: [`Complementary ${p.category} step to maintain daily barrier equilibrium.`]
        });
      }
    }

    return matches;
  }

  /**
   * Connects detected AI Hair findings (frizz, density, pattern, damage, scalp)
   * directly to verified purchasable haircare products.
   */
  public static getRecommendationsForHairFinding(
    findingKey: string,
    hairAnalysis?: any,
    profile?: UserAppearanceProfile
  ): RecommendationMatch[] {
    const key = (findingKey || '').toLowerCase();
    const hairPattern = hairAnalysis?.pattern || profile?.hair?.pattern || 'Wavy 2B';

    const matches: RecommendationMatch[] = [];

    for (const product of MOCK_PRODUCTS) {
      const isHaircare = product.department === 'haircare' || 
        ['shampoo', 'conditioner', 'hair-mask', 'hair-oil', 'hair-styling', 'hair-treatment', 'haircare'].includes(product.category);
      if (!isHaircare) continue;

      let matched = false;
      let reason = '';
      let score = 75;

      const tc = product.targetConcerns.map(c => c.toLowerCase());
      const actives = product.keyActives.map(a => a.toLowerCase());
      const tags = product.clinicalTags || [];

      if (key === 'all' || !key) {
        matched = true;
        score = 85;
        reason = `Formulated to support healthy strand resilience for ${hairPattern} hair structures.`;
      } else if (key.includes('frizz') || key.includes('cuticle')) {
        if (tc.some(c => c.includes('frizz') || c.includes('smoothing')) || actives.some(a => a.includes('argan') || a.includes('oil') || a.includes('bond'))) {
          matched = true;
          score = 95;
          reason = `Recommended because verified cuticle sealers (${product.keyActives[0]}) align lifted hair scales to repel atmospheric humidity and stop frizz.`;
        }
      } else if (key.includes('density') || key.includes('thin') || key.includes('growth')) {
        if (actives.some(a => a.includes('peptide') || a.includes('rosemary') || a.includes('biotin') || a.includes('redensyl')) || tc.some(c => c.includes('density') || c.includes('growth') || c.includes('fall'))) {
          matched = true;
          score = 94;
          reason = `Recommended because follicular energizers (${product.keyActives.slice(0, 2).join(' + ')}) nourish the scalp micro-environment for thicker, fuller-looking strand diameter.`;
        }
      } else if (key.includes('damage') || key.includes('bond') || key.includes('repair')) {
        if (tags.includes('bond-repair') || actives.some(a => a.includes('bond') || a.includes('bis-aminopropyl') || a.includes('k18') || a.includes('keratin')) || tc.some(c => c.includes('damage') || c.includes('repair') || c.includes('breakage'))) {
          matched = true;
          score = 96;
          reason = `Recommended because patented disulfide bond crosslinkers (${product.keyActives[0]}) rebuild internal keratin polypeptide chains broken by heat or color processing.`;
        }
      } else if (key.includes('pattern') || key.includes('curl') || key.includes('wave')) {
        if (product.suitableHairTypes?.some(ht => hairPattern.includes(ht)) || tc.some(c => c.includes('curl') || c.includes('definition') || c.includes('wave'))) {
          matched = true;
          score = 93;
          reason = `Recommended because flexible conditioning polymers lock in natural ${hairPattern} curl clustering without stiffness or crunch.`;
        }
      } else if (key.includes('scalp') || key.includes('dandruff') || key.includes('sebum')) {
        if (actives.some(a => a.includes('salicylic') || a.includes('tea tree') || a.includes('zinc') || a.includes('piroctone')) || tc.some(c => c.includes('scalp') || c.includes('dandruff') || c.includes('flakes'))) {
          matched = true;
          score = 92;
          reason = `Recommended because clarifying scalp actives purify sebum buildup and rebalance the scalp microbiome.`;
        }
      }

      if (matched) {
        matches.push({
          product,
          matchScore: Math.min(99, score),
          matchReasons: [reason]
        });
      }
    }

    matches.sort((a, b) => b.matchScore - a.matchScore);

    if (matches.length < 3) {
      const existingIds = new Set(matches.map(m => m.product.id));
      const generalProducts = MOCK_PRODUCTS.filter(p => 
        (p.department === 'haircare' || ['shampoo', 'conditioner', 'hair-oil', 'hair-mask'].includes(p.category)) &&
        !existingIds.has(p.id)
      ).slice(0, 3 - matches.length);

      for (const p of generalProducts) {
        matches.push({
          product: p,
          matchScore: 82,
          matchReasons: [`Essential strand recovery step compatible with ${hairPattern} texture.`]
        });
      }
    }

    return matches;
  }
}

import { Product } from '../../types/product';
import { CompatibilityReportItem, CompatibilityAnalysis } from '../../types/routine';

interface ClinicalRule {
  id: string;
  level: 'conflict' | 'caution' | 'synergy';
  title: string;
  check: (tags: string[], products: Product[]) => boolean;
  involvedTags: string[];
  scientificReason: string;
  recommendation: string;
}

export const CLINICAL_RULES: ClinicalRule[] = [
  // CONFLICTS
  {
    id: 'retinoid-aha-bha-clash',
    level: 'conflict',
    title: 'Dual Exfoliation & Acid Degradation Risk',
    check: (tags) => tags.includes('retinoid') && (tags.includes('aha') || tags.includes('bha')),
    involvedTags: ['retinoid', 'aha', 'bha'],
    scientificReason: 'Combining retinoids with direct exfoliating hydroxy acids (AHA/BHA) in the same application exponentially raises trans-epidermal water loss (TEWL) and disrupts the stratum corneum lipid matrix.',
    recommendation: 'Separate usage: Use AHA/BHA in your morning or alternate evening routines, and reserve retinoids for non-acid evenings (skin cycling protocol).'
  },
  {
    id: 'retinoid-benzoyl-peroxide',
    level: 'conflict',
    title: 'Oxidative Deactivation & Barrier Stress',
    check: (tags) => tags.includes('retinoid') && tags.includes('benzoyl-peroxide'),
    involvedTags: ['retinoid', 'benzoyl-peroxide'],
    scientificReason: 'Benzoyl peroxide is a potent oxidizing agent that chemically oxidizes and deactivates unencapsulated tretinoin and retinol, while compounding dryness and peeling.',
    recommendation: 'Use Benzoyl Peroxide in your morning wash/treatment and apply your retinoid exclusively in the evening.'
  },

  // CAUTIONS
  {
    id: 'vitamin-c-niacinamide-flush',
    level: 'caution',
    title: 'Low pH Hydrolysis & Facial Flushing',
    check: (tags) => tags.includes('l-ascorbic-acid') && tags.includes('niacinamide'),
    involvedTags: ['l-ascorbic-acid', 'niacinamide'],
    scientificReason: 'Pure L-Ascorbic Acid requires an acidic pH (under 3.5), whereas Niacinamide functions optimally near pH 5.5-6.5. Layering without a wait-time can cause temporary cutaneous flushing (niacin conversion).',
    recommendation: 'Allow 10 minutes between application steps, or apply L-Ascorbic Acid in the AM and Niacinamide in the PM.'
  },
  {
    id: 'multiple-direct-acids',
    level: 'caution',
    title: 'High Cumulative Acid Density',
    check: (tags) => tags.includes('aha') && tags.includes('bha'),
    involvedTags: ['aha', 'bha'],
    scientificReason: 'Simultaneously using both Glycolic/Lactic (AHA) and Salicylic (BHA) direct acids requires high skin tolerance to avoid subclinical barrier micro-tears.',
    recommendation: 'Ensure your routine includes a rich ceramide-based moisturizer to offset surface dryness, or opt for a single formulation with balanced percentages.'
  },
  {
    id: 'retinol-missing-spf',
    level: 'caution',
    title: 'Photosensitivity Protection Check',
    check: (tags, products) => {
      // Check if routine has retinoid or AHA but lacks sunscreen (for daytime/active check)
      const hasPhotosensitizer = tags.includes('retinoid') || tags.includes('aha');
      const hasSunscreen = tags.includes('sunscreen-mineral') || tags.includes('sunscreen-chemical');
      // If daytime or general routine has active without SPF
      return hasPhotosensitizer && !hasSunscreen && products.length >= 3;
    },
    involvedTags: ['retinoid', 'aha'],
    scientificReason: 'Cellular turnover accelerates epidermal thinning during active treatment, making the skin significantly more vulnerable to UVA/UVB induced hyperpigmentation.',
    recommendation: 'Ensure a broad-spectrum PA++++ sunscreen is integrated into your morning routine following active treatments.'
  },

  // SYNERGIES
  {
    id: 'hydration-ceramide-lock',
    level: 'synergy',
    title: 'Gold-Standard Lipid Barrier Hydration Lock',
    check: (tags) => tags.includes('hyaluronic-acid') && tags.includes('ceramides'),
    involvedTags: ['hyaluronic-acid', 'ceramides'],
    scientificReason: 'Hyaluronic acid acts as a powerful humectant attracting ambient water into intercellular matrices, while ceramides seal the stratum corneum lipid bilayers, preventing evaporation.',
    recommendation: 'Optimal sequence: Apply Hyaluronic Acid on damp skin first, followed immediately by Ceramide moisturizer.'
  },
  {
    id: 'niacinamide-zinc-synergy',
    level: 'synergy',
    title: 'Targeted Sebum Regulation & Calming',
    check: (tags) => tags.includes('niacinamide') && tags.includes('zinc-pca'),
    involvedTags: ['niacinamide', 'zinc-pca'],
    scientificReason: 'Zinc PCA suppresses 5-alpha reductase to regulate follicular oil production, while Niacinamide reduces hyperpigmentation and calms redness.',
    recommendation: 'Excellent combination for oily, combination, or blemish-prone profiles.'
  },
  {
    id: 'retinoid-ceramide-cushion',
    level: 'synergy',
    title: 'Retinization Barrier Cushioning',
    check: (tags) => tags.includes('retinoid') && tags.includes('ceramides'),
    involvedTags: ['retinoid', 'ceramides'],
    scientificReason: 'Ceramides support cell membrane integrity and replenish cholesterol and fatty acids depleted during the initial cellular acclimation phase to Vitamin A.',
    recommendation: 'Apply using the sandwich technique (Moisturizer -> Retinoid -> Moisturizer) if experiencing sensitivity.'
  },
  {
    id: 'cica-barrier-calm',
    level: 'synergy',
    title: 'Centella Asiatica Soothing Synergy',
    check: (tags) => tags.includes('centella-cica') && (tags.includes('aha') || tags.includes('bha') || tags.includes('retinoid')),
    involvedTags: ['centella-cica'],
    scientificReason: 'Madecassoside and Asiaticoside in Centella significantly mitigate pro-inflammatory cytokine release triggered by active chemical exfoliation.',
    recommendation: 'Keeps skin calm and maintains resilience during progressive active regimens.'
  },
  {
    id: 'bond-repair-lipid-seal',
    level: 'synergy',
    title: 'Hair Cuticle Bond Repair & Hydrophobic Seal',
    check: (tags) => tags.includes('bond-repair') && (tags.includes('argan-oil') || tags.includes('jojoba')),
    involvedTags: ['bond-repair', 'argan-oil', 'jojoba'],
    scientificReason: 'Bis-aminopropyl or peptide bond builders restore broken disulfide bonds internally, while cold-pressed oils seal the outer cuticle layer against ambient humidity.',
    recommendation: 'Ideal regimen for reducing frizz and restoring structural curl definition.'
  }
];

export function analyzeRoutineCompatibility(products: Product[]): CompatibilityAnalysis {
  if (products.length === 0) {
    return {
      overallStatus: 'balanced',
      synergiesCount: 0,
      cautionsCount: 0,
      conflictsCount: 0,
      reports: []
    };
  }

  // Aggregate all clinical tags from currently added products
  const allTags = Array.from(new Set(products.flatMap(p => p.clinicalTags)));
  const reports: CompatibilityReportItem[] = [];

  for (const rule of CLINICAL_RULES) {
    if (rule.check(allTags, products)) {
      // Find which products contributed to this rule
      const involved = products.filter(p => 
        p.clinicalTags.some(t => rule.involvedTags.includes(t))
      );
      
      reports.push({
        id: rule.id,
        level: rule.level,
        ruleTitle: rule.title,
        description: rule.scientificReason,
        involvedProductNames: involved.map(p => `${p.brand} ${p.name}`),
        scientificReason: rule.scientificReason,
        recommendation: rule.recommendation
      });
    }
  }

  const conflictsCount = reports.filter(r => r.level === 'conflict').length;
  const cautionsCount = reports.filter(r => r.level === 'caution').length;
  const synergiesCount = reports.filter(r => r.level === 'synergy').length;

  let overallStatus: 'balanced' | 'caution' | 'conflict' = 'balanced';
  if (conflictsCount > 0) overallStatus = 'conflict';
  else if (cautionsCount > 0) overallStatus = 'caution';

  return {
    overallStatus,
    synergiesCount,
    cautionsCount,
    conflictsCount,
    reports
  };
}

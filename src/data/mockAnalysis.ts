import { SkinAnalysisResult } from '../types/skin';
import { HairAnalysisResult } from '../types/hair';
import { UserAppearanceProfile } from '../types/profile';

/**
 * Clean default initial user profile (zero fake names or fabricated scores)
 */
export const DEFAULT_USER_PROFILE: UserAppearanceProfile = {
  hasCompletedSkinConsultation: false,
  hasCompletedHairConsultation: false,
  isSampleProfile: false,
  preferences: {
    budgetTier: '₹2,000 - ₹5,000',
    preferredFinish: 'Natural',
    crueltyFreeOnly: false,
    fragranceFreeOnly: false,
    targetRoutineBudget: 3500
  },
  privacy: {
    storeImagesLocally: true,
    allowDiagnosticTelemetry: false,
    cloudSyncEnabled: false
  },
  savedProductIds: [],
  savedLooks: [],
  savedRoutines: [],
  skinHistory: [],
  hairHistory: []
};

/**
 * Verified sample demonstration baseline (clearly flagged as demonstration data)
 */
export const SAMPLE_SKIN_ANALYSIS: SkinAnalysisResult = {
  id: 'sample-skin-demo',
  timestamp: 'Demonstration Baseline',
  imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  skinAge: 27,
  chronologicalAge: 27,
  overallScore: 82,
  skinType: 'Combination',
  fitzpatrick: 'IV',
  colorTone: {
    dominantHex: '#C59572',
    undertone: 'Olive',
    contrast: 'Medium',
    melaninIndex: 44,
    seasonPalette: 'Warm Autumn Earth Tones'
  },
  concerns: {
    pores: {
      id: 'pores',
      name: 'Pore & Sebum Balance',
      score: 74,
      severity: 'moderate',
      description: 'Mild shine observed along the nose bridge and forehead T-zone. Pores respond well to gentle daily niacinamide balance.',
      affectedRegions: ['Nose Bridge', 'Medial Cheeks'],
      heatmapCoordinates: [
        { x: 50, y: 52, radius: 24, intensity: 0.65 },
        { x: 42, y: 56, radius: 18, intensity: 0.45 },
        { x: 58, y: 56, radius: 18, intensity: 0.45 }
      ]
    },
    spots: {
      id: 'spots',
      name: 'Tone Evenness & Marks',
      score: 80,
      severity: 'low',
      description: 'Minor sun-induced freckling and post-blemish marks on outer cheeks. Benefits from regular Vitamin C and sunscreen.',
      affectedRegions: ['Outer Cheeks'],
      heatmapCoordinates: [
        { x: 34, y: 58, radius: 15, intensity: 0.55 },
        { x: 67, y: 60, radius: 14, intensity: 0.48 }
      ]
    },
    wrinkles: {
      id: 'wrinkles',
      name: 'Elasticity & Expression Lines',
      score: 91,
      severity: 'low',
      description: 'Skin elasticity is supple and resilient. Subtle expression lines around the outer eye area.',
      affectedRegions: ['Outer Eye Contours'],
      heatmapCoordinates: [
        { x: 28, y: 46, radius: 12, intensity: 0.25 },
        { x: 72, y: 46, radius: 12, intensity: 0.25 }
      ]
    },
    texture: {
      id: 'texture',
      name: 'Surface Smoothness',
      score: 85,
      severity: 'low',
      description: 'Even skin surface with minor dryness around the corners of the mouth.',
      affectedRegions: ['Jawline Border'],
      heatmapCoordinates: [
        { x: 50, y: 72, radius: 20, intensity: 0.35 }
      ]
    },
    redness: {
      id: 'redness',
      name: 'Calmness & Redness',
      score: 88,
      severity: 'low',
      description: 'Skin is calm with negligible flushed redness. Barrier integrity is strong.',
      affectedRegions: ['Cheeks'],
      heatmapCoordinates: [
        { x: 46, y: 55, radius: 10, intensity: 0.30 },
        { x: 54, y: 55, radius: 10, intensity: 0.30 }
      ]
    },
    moisture: {
      id: 'moisture',
      name: 'Hydration Retention',
      score: 76,
      severity: 'moderate',
      description: 'Cheek areas benefit from an extra layer of ceramide cream to lock in moisture during seasonal weather shifts.',
      affectedRegions: ['Lower Cheeks'],
      heatmapCoordinates: [
        { x: 36, y: 68, radius: 25, intensity: 0.60 },
        { x: 64, y: 68, radius: 25, intensity: 0.60 }
      ]
    },
    oiliness: {
      id: 'oiliness',
      name: 'T-Zone Activity',
      score: 70,
      severity: 'moderate',
      description: 'Natural sebum output is concentrated in the forehead and central nose.',
      affectedRegions: ['Forehead', 'Nose'],
      heatmapCoordinates: [
        { x: 50, y: 32, radius: 30, intensity: 0.72 }
      ]
    },
    darkCircles: {
      id: 'darkCircles',
      name: 'Under-Eye Brightness',
      score: 80,
      severity: 'low',
      description: 'Subtle shadows under the eyes. Responds well to caffeine serums and ample sleep.',
      affectedRegions: ['Under-Eye Contours'],
      heatmapCoordinates: [
        { x: 38, y: 48, radius: 16, intensity: 0.50 },
        { x: 62, y: 48, radius: 16, intensity: 0.50 }
      ]
    }
  },
  keyFindings: [
    'Balanced combination skin with naturally resilient barrier structure.',
    'Forehead and nose benefit from lightweight sebum-regulating hydrators like Niacinamide.',
    'Fitzpatrick IV tone offers good natural sun defense, but is prone to mild marks that benefit from broad-spectrum SPF 50.'
  ],
  recommendedFocus: [
    'Gentle foaming cleanser with salicylic or oat extract',
    'Hydrating barrier moisturizer with ceramides and hyaluronic acid',
    'Daily invisible SPF 50 sunscreen protection'
  ],
  simulationPreviews: {
    weeks4: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    weeks8: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    weeks12: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  }
};

/**
 * Verified sample hair demonstration baseline
 */
export const SAMPLE_HAIR_ANALYSIS: HairAnalysisResult = {
  id: 'sample-hair-demo',
  timestamp: 'Demonstration Baseline',
  imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  pattern: '2B Wavy',
  length: {
    category: 'Collarbone',
    estimatedCm: 34
  },
  frizziness: {
    score: 70,
    level: 'Moderate',
    cuticleAlignmentPct: 68
  },
  density: {
    score: 82,
    level: 'Medium / Dense',
    follicleDensityScore: 194
  },
  scalpProfile: {
    type: 'Balanced',
    porosity: 'Medium',
    moistureRetention: 74,
    damageLevel: 'Minimal'
  },
  keyFindings: [
    'Defined 2B wavy hair structure with natural movement.',
    'Medium porosity: cuticle responds well to moisture but needs sealing oils to prevent humidity flyaways.',
    'Naturally healthy strand density across the scalp.'
  ],
  recommendedTreatments: [
    {
      title: 'Disulfide Linkage Maintenance',
      focus: 'Bond Repair',
      activeIngredients: ['Maleic Acid Complex', 'Amino Acids'],
      benefit: 'Strengthens internal hair structure against heat and styling tension.'
    },
    {
      title: 'Cuticle Humidity Shield',
      focus: 'Anti-Frizz Smoothing',
      activeIngredients: ['Cold-Pressed Argan Oil', 'Jojoba Oil'],
      benefit: 'Seals moisture inside the hair shaft to prevent humidity frizz.'
    }
  ]
};

// Aliases for compatibility
export const INITIAL_SKIN_ANALYSIS = SAMPLE_SKIN_ANALYSIS;
export const INITIAL_HAIR_ANALYSIS = SAMPLE_HAIR_ANALYSIS;

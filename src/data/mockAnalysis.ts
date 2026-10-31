import { SkinAnalysisResult } from '../types/skin';
import { HairAnalysisResult } from '../types/hair';
import { UserAppearanceProfile } from '../types/profile';

export const INITIAL_SKIN_ANALYSIS: SkinAnalysisResult = {
  id: 'skin-eval-101',
  timestamp: 'Today, 09:42 AM',
  imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  skinAge: 26,
  chronologicalAge: 28,
  overallScore: 84,
  skinType: 'Combination',
  fitzpatrick: 'IV',
  colorTone: {
    dominantHex: '#C59572',
    undertone: 'Olive',
    contrast: 'Medium',
    melaninIndex: 44,
    seasonPalette: 'Warm Autumn / Earth Muted'
  },
  concerns: {
    pores: {
      id: 'pores',
      name: 'Pore Congestion',
      score: 72,
      severity: 'moderate',
      description: 'Localized follicular dilation observed across nasal bridge and central medial cheeks with light sebum oxidation.',
      affectedRegions: ['Nasal Bridge', 'Medial Cheeks', 'Chin Crease'],
      heatmapCoordinates: [
        { x: 50, y: 52, radius: 24, intensity: 0.65 },
        { x: 42, y: 56, radius: 18, intensity: 0.45 },
        { x: 58, y: 56, radius: 18, intensity: 0.45 }
      ]
    },
    spots: {
      id: 'spots',
      name: 'Hyperpigmentation & Spots',
      score: 81,
      severity: 'low',
      description: 'Subtle post-inflammatory erythema (PIE) and localized melanocytic clusters on lateral cheek plane.',
      affectedRegions: ['Lateral Cheeks', 'Upper Zygomatic Arch'],
      heatmapCoordinates: [
        { x: 34, y: 58, radius: 15, intensity: 0.55 },
        { x: 67, y: 60, radius: 14, intensity: 0.48 }
      ]
    },
    wrinkles: {
      id: 'wrinkles',
      name: 'Fine Lines & Wrinkles',
      score: 92,
      severity: 'low',
      description: 'Minimal superficial dynamic expression lines along lateral periorbital quadrant. Cellular elasticity is robust.',
      affectedRegions: ['Outer Eye Canthus'],
      heatmapCoordinates: [
        { x: 28, y: 46, radius: 12, intensity: 0.25 },
        { x: 72, y: 46, radius: 12, intensity: 0.25 }
      ]
    },
    texture: {
      id: 'texture',
      name: 'Stratum Texture Evenness',
      score: 84,
      severity: 'low',
      description: 'Smooth corneal surface with mild keratinized flaking around the perioral commissures.',
      affectedRegions: ['Perioral Border'],
      heatmapCoordinates: [
        { x: 50, y: 72, radius: 20, intensity: 0.35 }
      ]
    },
    redness: {
      id: 'redness',
      name: 'Micro-Vascular Redness',
      score: 88,
      severity: 'low',
      description: 'Calm micro-capillary state with negligible diffuse erythema. Barrier resilience is intact.',
      affectedRegions: ['Alar Crease'],
      heatmapCoordinates: [
        { x: 46, y: 55, radius: 10, intensity: 0.30 },
        { x: 54, y: 55, radius: 10, intensity: 0.30 }
      ]
    },
    moisture: {
      id: 'moisture',
      name: 'Epidermal Hydration',
      score: 75,
      severity: 'moderate',
      description: 'Mild sub-surface trans-epidermal moisture depletion in cheek zones contrasting with sebum-rich T-zone.',
      affectedRegions: ['Lower Cheeks', 'Jawline'],
      heatmapCoordinates: [
        { x: 36, y: 68, radius: 25, intensity: 0.60 },
        { x: 64, y: 68, radius: 25, intensity: 0.60 }
      ]
    },
    oiliness: {
      id: 'oiliness',
      name: 'Sebum Balance',
      score: 68,
      severity: 'moderate',
      description: 'Active lipid secretion concentrated in the frontal forehead and nasal T-zone region.',
      affectedRegions: ['Forehead Center', 'Nose Bridge'],
      heatmapCoordinates: [
        { x: 50, y: 32, radius: 30, intensity: 0.72 },
        { x: 50, y: 52, radius: 20, intensity: 0.68 }
      ]
    },
    darkCircles: {
      id: 'darkCircles',
      name: 'Periorbital Tone (Dark Circles)',
      score: 79,
      severity: 'low',
      description: 'Mild vascular shadows in lower tear trough with mild melanin shadowing.',
      affectedRegions: ['Infraorbital Trough'],
      heatmapCoordinates: [
        { x: 38, y: 48, radius: 16, intensity: 0.50 },
        { x: 62, y: 48, radius: 16, intensity: 0.50 }
      ]
    }
  },
  keyFindings: [
    'Optimal cellular turnover: Skin age reads 2 years younger than chronological age.',
    'Combination lipid profile: T-zone displays 38% higher sebum output than lateral cheek planes.',
    'Fitzpatrick Type IV: High melanin resilience against UVB, with elevated susceptibility to post-acne marks (PIH).'
  ],
  recommendedFocus: [
    'Gentle Niacinamide + Zinc buffering for T-zone pore refinement',
    'Ceramide barrier replenishment for lower cheek moisture deficit',
    'Broad-Spectrum PA++++ daily defense to prevent pigment oxidation'
  ],
  simulationPreviews: {
    weeks4: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    weeks8: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    weeks12: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  }
};

export const INITIAL_HAIR_ANALYSIS: HairAnalysisResult = {
  id: 'hair-eval-201',
  timestamp: 'Yesterday, 04:15 PM',
  imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  pattern: '2B Wavy',
  length: {
    category: 'Collarbone',
    estimatedCm: 34
  },
  frizziness: {
    score: 68,
    level: 'Moderate',
    cuticleAlignmentPct: 66
  },
  density: {
    score: 82,
    level: 'Medium / Dense',
    follicleDensityScore: 194
  },
  scalpProfile: {
    type: 'Balanced',
    porosity: 'Medium',
    moistureRetention: 72,
    damageLevel: 'Minimal'
  },
  keyFindings: [
    'Type 2B defined S-wave structure with pronounced natural volume.',
    'Cuticle porosity is optimal medium; cuticle scales open slightly in ambient humidity causing mid-length flyaways.',
    'Healthy follicle root count: 194 strands per cm².'
  ],
  recommendedTreatments: [
    {
      title: 'Disulfide Linkage Maintenance',
      focus: 'Bond Repair',
      activeIngredients: ['Maleic Acid', 'Arginine Complex'],
      benefit: 'Fortifies internal keratin chains against mechanical styling tension.'
    },
    {
      title: 'Lipid Moisture Lock',
      focus: 'Anti-Frizz Smoothing',
      activeIngredients: ['Cold-Pressed Argan Oil', 'Jojoba Wax Esters'],
      benefit: 'Forms a hydrophobic micro-film to seal the outer cuticle against monsoonal humidity.'
    }
  ]
};

export const DEFAULT_USER_PROFILE: UserAppearanceProfile = {
  name: 'Devika Sharma',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  age: 28,
  genderIdentity: 'Female',
  skin: {
    type: 'Combination',
    fitzpatrick: 'IV',
    colorTone: {
      dominantHex: '#C59572',
      undertone: 'Olive',
      contrast: 'Medium',
      melaninIndex: 44,
      seasonPalette: 'Warm Autumn / Earth Muted'
    },
    primaryConcerns: ['T-Zone Pores', 'Mild Dehydration', 'Post-Acne Spots'],
    allergies: ['Synthetic Fragrance / Cinnamic Aldehyde']
  },
  hair: {
    pattern: '2B Wavy',
    porosity: 'Medium',
    scalpType: 'Balanced',
    lengthCategory: 'Collarbone (34 cm)',
    primaryConcerns: ['Humidity Frizz', 'Curl Definition']
  },
  preferences: {
    budgetTier: 'Balanced Quality (₹2,000 - ₹5,000)',
    preferredFinish: 'Dewy / Glass Skin',
    crueltyFreeOnly: true,
    fragranceFreeOnly: true,
    targetRoutineBudget: 3500
  },
  privacy: {
    storeImagesLocally: true,
    allowDiagnosticTelemetry: false,
    cloudSyncEnabled: true
  },
  savedProductIds: ['prod-serum-01', 'prod-moist-01', 'prod-spf-01', 'prod-hair-01'],
  savedLooks: [
    {
      id: 'look-golden-hour',
      title: 'Editorial Bronze & Soft Waves',
      date: 'Oct 28, 2026',
      baseImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      styledImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      studioCategory: 'makeup',
      appliedOptions: [
        { name: 'Look Preset', details: 'Golden Hour Glow' },
        { name: 'Lip Finish', details: 'Matte Rosewood' },
        { name: 'Hairstyle', details: 'Textured Curtain Waves' }
      ],
      favorite: true
    }
  ],
  savedRoutines: [],
  skinHistory: [INITIAL_SKIN_ANALYSIS],
  hairHistory: [INITIAL_HAIR_ANALYSIS]
};

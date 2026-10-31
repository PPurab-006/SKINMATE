export type HairPattern = '1A Straight' | '1B Straight' | '2A Wavy' | '2B Wavy' | '2C Wavy' | '3A Curly' | '3B Curly' | '4A Coily' | '4B Coily';

export type HairLengthCategory = 'Very Short' | 'Short' | 'Collarbone' | 'Mid-Back' | 'Long';

export type HairPorosity = 'Low' | 'Medium' | 'High';

export type ScalpType = 'Dry' | 'Balanced' | 'Oily' | 'Sensitive';

export interface HairAnalysisResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  pattern: HairPattern;
  length: {
    category: HairLengthCategory;
    estimatedCm: number;
  };
  frizziness: {
    score: number; // 0-100 (100 = smoothest, 0 = severe frizz)
    level: 'Low' | 'Moderate' | 'High';
    cuticleAlignmentPct: number;
  };
  density: {
    score: number; // 0-100
    level: 'Fine / Sparse' | 'Medium' | 'Dense / Thick' | 'Medium / Dense';
    follicleDensityScore: number;
  };
  scalpProfile: {
    type: ScalpType;
    porosity: HairPorosity;
    moistureRetention: number; // 0-100
    damageLevel: 'Minimal' | 'Moderate' | 'Significant';
  };
  keyFindings: string[];
  recommendedTreatments: {
    title: string;
    focus: string;
    activeIngredients: string[];
    benefit: string;
  }[];
}

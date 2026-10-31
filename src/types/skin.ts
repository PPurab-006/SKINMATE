export type SkinType = 'Dry' | 'Normal' | 'Combination' | 'Oily' | 'Sensitive';

export type FitzpatrickType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export interface SkinConcernMetric {
  id: string;
  name: string;
  score: number; // 0-100 (higher means healthier/less concern)
  severity: 'low' | 'moderate' | 'high';
  description: string;
  affectedRegions: string[];
  heatmapCoordinates?: { x: number; y: number; radius: number; intensity: number }[];
}

export interface FacialColorTone {
  dominantHex: string;
  undertone: 'Warm' | 'Cool' | 'Neutral' | 'Olive';
  contrast: 'Low' | 'Medium' | 'High';
  melaninIndex: number;
  seasonPalette: string; // e.g. "Warm Autumn", "Deep Winter"
}

export interface ImageQualityCheck {
  lighting: 'poor' | 'fair' | 'optimal';
  lightingScore: number;
  centering: boolean;
  resolutionOk: boolean;
  glassesDetected: boolean;
  expressionNeutral: boolean;
  passed: boolean;
  feedback: string[];
}

export interface SkinAnalysisResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  skinAge: number;
  chronologicalAge: number;
  overallScore: number; // 0-100
  skinType: SkinType;
  fitzpatrick: FitzpatrickType;
  colorTone: FacialColorTone;
  concerns: Record<string, SkinConcernMetric>;
  keyFindings: string[];
  recommendedFocus: string[];
  simulationPreviews?: {
    weeks4: string;
    weeks8: string;
    weeks12: string;
  };
}

export interface SkinSimulationState {
  targetConcern: 'hydration' | 'anti-wrinkle' | 'brightening' | 'texture' | 'redness';
  treatmentDurationWeeks: 4 | 8 | 12;
  simulatedScoreDelta: number;
  simulatedImageUrl: string;
}

import { SkinType, FitzpatrickType, FacialColorTone, SkinAnalysisResult } from './skin';
import { HairPattern, HairPorosity, ScalpType, HairAnalysisResult } from './hair';
import { SavedLook } from './style';
import { Routine } from './routine';

export interface UserAppearanceProfile {
  name: string;
  avatarUrl: string;
  age: number;
  genderIdentity: string;
  
  // Diagnostic snapshots
  skin: {
    type: SkinType;
    fitzpatrick: FitzpatrickType;
    colorTone: FacialColorTone;
    primaryConcerns: string[];
    allergies: string[];
  };
  
  hair: {
    pattern: HairPattern;
    porosity: HairPorosity;
    scalpType: ScalpType;
    lengthCategory: string;
    primaryConcerns: string[];
  };

  preferences: {
    budgetTier: 'Budget Conscious (Under ₹2,000)' | 'Balanced Quality (₹2,000 - ₹5,000)' | 'Luxury Clinical (₹5,000+)';
    preferredFinish: 'Dewy / Glass Skin' | 'Natural Velvet' | 'Matte';
    crueltyFreeOnly: boolean;
    fragranceFreeOnly: boolean;
    targetRoutineBudget: number; // e.g. 3500
  };

  privacy: {
    storeImagesLocally: boolean;
    allowDiagnosticTelemetry: boolean;
    cloudSyncEnabled: boolean;
  };

  // Activity logs
  savedProductIds: string[];
  savedLooks: SavedLook[];
  savedRoutines: Routine[];
  skinHistory: SkinAnalysisResult[];
  hairHistory: HairAnalysisResult[];
}

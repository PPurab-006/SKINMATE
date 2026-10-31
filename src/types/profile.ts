import { SkinType, FitzpatrickType, FacialColorTone, SkinAnalysisResult } from './skin';
import { HairPattern, HairPorosity, ScalpType, HairAnalysisResult } from './hair';
import { SavedLook } from './style';
import { Routine } from './routine';

export interface UserAppearanceProfile {
  name?: string;
  avatarUrl?: string;
  age?: number;
  genderIdentity?: string;
  
  hasCompletedSkinConsultation: boolean;
  hasCompletedHairConsultation: boolean;
  isSampleProfile: boolean;

  // Diagnostic snapshots (populated once user completes a guided consultation)
  skin?: {
    type: SkinType;
    fitzpatrick: FitzpatrickType;
    colorTone: FacialColorTone;
    primaryConcerns: string[];
    allergies: string[];
  };
  
  hair?: {
    pattern: HairPattern;
    porosity: HairPorosity;
    scalpType: ScalpType;
    lengthCategory: string;
    primaryConcerns: string[];
  };

  preferences: {
    budgetTier: 'Under ₹2,000' | '₹2,000 - ₹5,000' | '₹5,000+';
    preferredFinish: 'Dewy' | 'Natural' | 'Matte';
    crueltyFreeOnly: boolean;
    fragranceFreeOnly: boolean;
    veganOnly?: boolean;
    monthlyBudget?: number;
    targetRoutineBudget: number; // in INR
  };

  privacy: {
    storeImagesLocally: boolean;
    allowDiagnosticTelemetry: boolean;
    cloudSyncEnabled: boolean;
  };

  // Saved items & activity
  savedProductIds: string[];
  savedLooks: SavedLook[];
  savedRoutines: Routine[];
  skinHistory: SkinAnalysisResult[];
  hairHistory: HairAnalysisResult[];
}

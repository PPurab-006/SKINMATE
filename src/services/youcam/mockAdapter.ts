import { SkinAnalysisResult } from '../../types/skin';
import { HairAnalysisResult } from '../../types/hair';
import { INITIAL_SKIN_ANALYSIS, INITIAL_HAIR_ANALYSIS } from '../../data/mockAnalysis';

export class YouCamMockAdapter {
  /**
   * Generates a realistic skin analysis for an uploaded image
   */
  public static async analyzeSkin(imageUrl: string): Promise<SkinAnalysisResult> {
    // Simulate API round-trip delay
    await new Promise(resolve => setTimeout(resolve, 1400));

    // Slight variance so repeated analyses feel alive
    const scoreOffset = Math.floor(Math.random() * 5) - 2;
    const overallScore = Math.min(96, Math.max(70, INITIAL_SKIN_ANALYSIS.overallScore + scoreOffset));

    return {
      ...INITIAL_SKIN_ANALYSIS,
      id: `skin-eval-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      imageUrl,
      overallScore,
      skinAge: INITIAL_SKIN_ANALYSIS.skinAge + (scoreOffset > 0 ? -1 : 0),
    };
  }

  /**
   * Generates a realistic hair analysis for an uploaded image
   */
  public static async analyzeHair(imageUrl: string): Promise<HairAnalysisResult> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      ...INITIAL_HAIR_ANALYSIS,
      id: `hair-eval-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      imageUrl,
    };
  }

  /**
   * Simulate a style preview generation with high fidelity
   */
  public static async generateStylePreview(
    baseImageUrl: string, 
    studioCategory: string, 
    optionId: string
  ): Promise<{ styledImageUrl: string; confidenceScore: number }> {
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Curated high quality stylized previews
    const styleGallery: Record<string, string> = {
      'hair-french-bob': 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
      'hair-curtain-layers': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'hair-beach-waves': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'hair-pixie-shag': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      'beard-stubble': 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80',
      'beard-boxed': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'look-editorial-bronze': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'look-parisienne': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'look-golden-hour': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'look-cyberpunk': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    };

    const styledImageUrl = styleGallery[optionId] || baseImageUrl;
    return {
      styledImageUrl,
      confidenceScore: 0.94
    };
  }
}

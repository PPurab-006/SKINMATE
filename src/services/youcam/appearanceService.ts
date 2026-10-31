import { youCamClient } from './client';
import { YouCamMockAdapter } from './mockAdapter';

export interface AppearanceEffectResult {
  styledImageUrl: string;
  effectName: string;
  isMock: boolean;
}

export class AppearanceService {
  /**
   * Applies smile transformation
   */
  public static async applySmile(imageUrl: string, intensity: number = 50, fileId: string = 'portrait-base'): Promise<AppearanceEffectResult> {
    const res = await youCamClient.applyVto({
      fileId,
      category: 'appearance',
      serviceSlug: 'ai-smile',
      effectId: `smile_${intensity}`,
      parameters: { intensity },
      imageUrl
    });
    return {
      styledImageUrl: res.styled_image_url || imageUrl,
      effectName: res.effect_name || `Radiant Smile (${intensity}%)`,
      isMock: res.is_mock_demonstration
    };
  }

  /**
   * Applies teeth whitening simulation
   */
  public static async applyTeethWhitening(imageUrl: string, intensity: number = 60, fileId: string = 'portrait-base'): Promise<AppearanceEffectResult> {
    const res = await youCamClient.applyVto({
      fileId,
      category: 'appearance',
      serviceSlug: 'teeth-whitening',
      effectId: `teeth_${intensity}`,
      parameters: { intensity },
      imageUrl
    });
    return {
      styledImageUrl: res.styled_image_url || imageUrl,
      effectName: res.effect_name || `Teeth Brightening (${intensity}%)`,
      isMock: res.is_mock_demonstration
    };
  }

  /**
   * Applies subtle face lift simulation
   */
  public static async applyFaceLift(imageUrl: string, intensity: number = 50, fileId: string = 'portrait-base'): Promise<AppearanceEffectResult> {
    const res = await youCamClient.applyVto({
      fileId,
      category: 'appearance',
      serviceSlug: 'face-lift',
      effectId: `lift_${intensity}`,
      parameters: { intensity },
      imageUrl
    });
    return {
      styledImageUrl: res.styled_image_url || imageUrl,
      effectName: res.effect_name || `Contour Lift (${intensity}%)`,
      isMock: res.is_mock_demonstration
    };
  }

  /**
   * Applies facial reshaping contour
   */
  public static async applyFaceReshape(imageUrl: string, parameters?: Record<string, unknown>, fileId: string = 'portrait-base'): Promise<AppearanceEffectResult> {
    const res = await youCamClient.applyVto({
      fileId,
      category: 'appearance',
      serviceSlug: 'face-reshape',
      effectId: 'custom_reshape',
      parameters,
      imageUrl
    });
    return {
      styledImageUrl: res.styled_image_url || imageUrl,
      effectName: res.effect_name || 'Natural Facial Contouring',
      isMock: res.is_mock_demonstration
    };
  }
}
